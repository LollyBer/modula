#!/usr/bin/env node
/* ============================================================================
   FABBRICA · AUTOMAZIONE — attiva.mjs
   Crea un'azienda (tenant) e/o accende i suoi moduli, IN AUTOMATICO, usando la
   service-role key di Supabase (salta la RLS). Replica esattamente ciò che fa
   la funzione create_tenant, ma chiamabile da riga di comando dalla Fabbrica.

   La key sta SOLO in ./secrets.local.json (ignorato da git). Mai nel repo.

   USO (uno dei tre):
     echo '{"azienda":"Prova SRL","titolare":"Mario Rossi","moduli":["cal","notes","clients","man","conti"]}' | node attiva.mjs
     node attiva.mjs '{"azienda":"Prova SRL","titolare":"Mario Rossi","moduli":["man","conti"]}'
     node attiva.mjs --azienda "Prova SRL" --titolare "Mario Rossi" --moduli "man,conti"

   COMPORTAMENTO:
     · azienda NUOVA  → crea tenant + titolare (employee owner) + settings → stampa CODICE INVITO
     · azienda ESISTENTE (stesso slug) → UNISCE i moduli richiesti a quelli già attivi (non spegne nulla)
   ============================================================================ */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

/* --- moduli che ESISTONO davvero oggi (base + extra pronti). Gli altri non si accendono. --- */
const BASE   = ['hub','cal','notes','notif','clients','emps'];
const PRONTI = ['conti','man','sites','macchine','pellet','zone'];
const VALID  = new Set([...BASE, ...PRONTI]);

/* --- helper --- */
const slugify = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const randCode = (len=5) => { const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let o=''; for(let i=0;i<len;i++)o+=A[Math.floor(Math.random()*A.length)]; return o; };
const inviteFor = name => ((String(name||'').replace(/[^a-zA-Z]/g,'').slice(0,5).toUpperCase())||'OWNER')+'-'+randCode(5);
const die = m => { console.error('\n❌ '+m+'\n'); process.exit(1); };

/* --- segreti --- */
let SECRETS;
try { SECRETS = JSON.parse(readFileSync(join(HERE,'secrets.local.json'),'utf8')); }
catch { die('Manca FABBRICA/automazione/secrets.local.json (con SUPABASE_URL e SERVICE_ROLE_KEY).'); }
const URL = SECRETS.SUPABASE_URL, KEY = SECRETS.SERVICE_ROLE_KEY;
if(!URL || !KEY || /INCOLLA_QUI/.test(KEY)) die('Apri secrets.local.json e incolla la SERVICE_ROLE_KEY (sb_secret_…).');

/* --- REST helper (service-role: salta la RLS) --- */
async function sb(path, { method='GET', body, prefer } = {}){
  const r = await fetch(URL+'/rest/v1/'+path, {
    method,
    headers: { apikey:KEY, Authorization:'Bearer '+KEY, 'Content-Type':'application/json',
               ...(prefer?{Prefer:prefer}:{}) },
    body: body?JSON.stringify(body):undefined,
  });
  const txt = await r.text();
  let data; try { data = txt?JSON.parse(txt):null; } catch { data = txt; }
  if(!r.ok) die('Supabase '+r.status+': '+(data?.message||data?.hint||txt));
  return data;
}

/* --- leggi input (stdin | primo arg JSON | flag) --- */
function flag(n){ const i=process.argv.indexOf('--'+n); return i>=0?process.argv[i+1]:undefined; }
async function readStdin(){ if(process.stdin.isTTY) return ''; let s=''; for await (const c of process.stdin) s+=c; return s.trim(); }

async function getInput(){
  const stdin = await readStdin();
  const arg = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '';
  const raw = stdin || arg;
  if(raw){ try { return JSON.parse(raw); } catch { die('Input JSON non valido.'); } }
  // flag mode
  const az = flag('azienda'); if(!az) die('Niente input. Passa un JSON (stdin o arg) oppure --azienda "…" --titolare "…" --moduli "…"');
  return { azienda:az, titolare:flag('titolare'), slug:flag('slug'),
           moduli:(flag('moduli')||'').split(',').map(s=>s.trim()).filter(Boolean),
           modulo_su_misura:flag('su-misura') };
}

/* --- main --- */
(async () => {
  const inp = await getInput();
  // accetta sia "moduli" sia i nomi del configuratore (moduli_base/moduli_extra)
  const wanted = [...new Set([...(inp.moduli||[]), ...(inp.moduli_base||[]), ...(inp.moduli_extra||[])])];
  const azienda = (inp.azienda||'').trim();
  if(!azienda) die('Manca "azienda".');
  const slug = slugify(inp.slug || azienda);
  // posti dipendente (titolare incluso); 0 o "illimitati" = nessun limite (piano Tutto compreso)
  let posti = inp.posti ?? inp.max_dipendenti;
  if(posti==null) posti = 4;
  else if(typeof posti==='string' && /illim/i.test(posti)) posti = 0;
  else posti = Math.max(0, parseInt(posti)||0);

  // separa moduli reali da quelli ancora da costruire
  const reali = wanted.filter(m => VALID.has(m));
  const daCostruire = wanted.filter(m => !VALID.has(m));
  // hub e notif sempre presenti (base imprescindibile)
  const modules = [...new Set(['hub','notif', ...reali])];

  // esiste già?
  const existing = await sb(`tenants?slug=eq.${encodeURIComponent(slug)}&select=id,name,modules`);
  let report;

  if(existing.length){
    const t = existing[0];
    const merged = [...new Set([...(t.modules||[]), ...modules])];
    const patch = { modules:merged };
    if(inp.posti!=null || inp.max_dipendenti!=null) patch.max_employees = posti;  // aggiorna i posti solo se richiesto
    await sb(`tenants?id=eq.${t.id}`, { method:'PATCH', body:patch, prefer:'return=minimal' });
    report = { stato:'AGGIORNATA', azienda:t.name, slug, moduli_attivi:merged, posti:patch.max_employees??'(invariati)', codice_invito:null };
  } else {
    const titolare = (inp.titolare||'Titolare').trim();
    const code = inviteFor(titolare);
    const ten = await sb('tenants', { method:'POST', prefer:'return=representation', body:{ slug, name:azienda, modules, max_employees:posti } });
    const tid = ten[0].id;
    await sb('employees', { method:'POST', prefer:'return=minimal',
      body:{ tenant_id:tid, name:titolare, is_owner:true, active:true, invite_code:code } });
    await sb('settings', { method:'POST', prefer:'return=minimal', body:{ tenant_id:tid, company_name:azienda } });
    report = { stato:'CREATA', azienda, slug, titolare, moduli_attivi:modules, posti, codice_invito:code };
  }

  // stampa pulita per Loris / la Fabbrica
  console.log('\n──────────────────────────────────────────────');
  console.log(`  ✅ Azienda ${report.stato}: ${report.azienda}  (slug: ${report.slug})`);
  console.log(`  Moduli attivi: ${report.moduli_attivi.join(', ')}`);
  console.log(`  Posti dipendente: ${report.posti===0?'illimitati':report.posti}`);
  if(report.codice_invito){
    console.log(`  👤 Titolare: ${report.titolare}`);
    console.log(`  🔑 CODICE INVITO da dare al cliente: ${report.codice_invito}`);
  }
  if(daCostruire.length)
    console.log(`  ✨ Moduli RICHIESTI ma da costruire (non accesi): ${daCostruire.join(', ')}`);
  if(inp.modulo_su_misura)
    console.log(`  ✨ Modulo su misura richiesto: ${inp.modulo_su_misura}`);
  console.log('──────────────────────────────────────────────\n');
  // anche in JSON (per chi automatizza a valle)
  console.log(JSON.stringify({ ...report, da_costruire:daCostruire, modulo_su_misura:inp.modulo_su_misura||null }));
})();
