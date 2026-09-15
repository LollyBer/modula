/* ===== CONFIGURATORE — logica (4 step + anteprima + invio) ===== */
const $ = (s,r=document)=>r.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const byId = (arr,id)=>arr.find(x=>x.id===id);
const ALL_MODS = [...MODULI_BASE, ...MODULI_EXTRA];
const modById = id => byId(ALL_MODS, id);

const STEPS = ['Azienda','Settore','Moduli','Anteprima'];
const S = { step:1, azienda:'', referente:'', email:'', telefono:'', dipendenti:'', logo:'', settore:null, extra:new Set(), richiesta:'', dominio:false, migrazione:false, previewView:'hub', device:'phone', accent:'#FF453A' };
function toggleServizio(key){ S[key]=!S[key]; if(S.step===4){ $('#view').innerHTML=step4(); } }

/* ---------------- color picker (accento per-azienda) ---------------- */
const COLORI = [
  {h:'#FF453A',n:'Rosso'},  {h:'#E11D2A',n:'Cremisi'}, {h:'#FB923C',n:'Arancio'},
  {h:'#FBBF24',n:'Ambra'},  {h:'#34D399',n:'Verde'},   {h:'#2DD4BF',n:'Teal'},
  {h:'#60A5FA',n:'Blu'},    {h:'#818CF8',n:'Indaco'},  {h:'#A78BFA',n:'Viola'},
  {h:'#F472B6',n:'Rosa'}
];
function colorPicker(opts={}){
  const title = opts.title || 'Colore della tua app';
  const hint  = opts.hint || '';
  const sw = COLORI.map(c=>`<button class="sw ${S.accent.toLowerCase()===c.h.toLowerCase()?'on':''}" data-c="${c.h}" style="--swc:${c.h}" title="${esc(c.n)}" onclick="setAccent('${c.h}')"></button>`).join('');
  return `<div class="cpick">
    <div class="cpick-h">${esc(title)}${hint?`<span class="cpick-hint">${esc(hint)}</span>`:''}</div>
    <div class="cpick-row">
      ${sw}
      <label class="sw sw-custom" title="Colore personalizzato"><input type="color" value="${S.accent}" oninput="setAccent(this.value)"></label>
    </div>
  </div>`;
}
function setAccent(hex){
  if(!hex) return;
  S.accent = hex;
  document.querySelectorAll('.cpick .sw[data-c]').forEach(s=>{
    s.classList.toggle('on', s.getAttribute('data-c').toLowerCase()===hex.toLowerCase());
  });
  document.querySelectorAll('.cpick .sw-custom input').forEach(i=>{ i.value=hex; });
  if(S.step===4) refreshPreview();
}

/* ---------------- render router ---------------- */
function render(){
  $('#steps').innerHTML = STEPS.map((t,i)=>{
    const n=i+1; const cls = n===S.step?'on':(n<S.step?'done':'');
    return `<div class="s ${cls}">${n}. ${t}</div>`;
  }).join('');
  const v = $('#view');
  if(S.step===1) v.innerHTML = step1();
  else if(S.step===2) v.innerHTML = step2();
  else if(S.step===3) v.innerHTML = step3();
  else v.innerHTML = step4();
  window.scrollTo({top:0,behavior:'smooth'});
  if(S.step===1){ const inp=$('#az'); if(inp){ inp.focus(); inp.addEventListener('keydown',e=>{if(e.key==='Enter')next();}); } }
}

/* ---------------- STEP 1 — nome azienda ---------------- */
function step1(){
  return `
  <div class="h1"><span class="accent"></span>Crea la tua app</div>
  <div class="lead">In pochi passi componi il gestionale della tua attività. Iniziamo dal nome: comparirà nella tua app.</div>
  <div class="card">
    <div class="bigfield">
      <label>Nome dell'azienda</label>
      <input id="az" value="${esc(S.azienda)}" placeholder="es. La Mia Azienda S.r.l." oninput="S.azienda=this.value" maxlength="48">
    </div>
  </div>
  <div class="card" style="margin-top:12px">
    ${colorPicker({title:"Colore della tua app", hint:"sarà l'accento dell'app — lo vedrai nell'anteprima"})}
  </div>
  <div class="card" style="margin-top:12px">
    <div class="bigfield"><label>Referente — chi gestirà l'app</label>
      <input id="ref" value="${esc(S.referente)}" placeholder="es. Mario Rossi" oninput="S.referente=this.value" maxlength="60"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="bigfield"><label>Email</label><input id="eml" type="email" value="${esc(S.email)}" placeholder="tu@azienda.ch" oninput="S.email=this.value"></div>
      <div class="bigfield"><label>Telefono</label><input id="tel" value="${esc(S.telefono)}" placeholder="+41 ..." oninput="S.telefono=this.value"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:2px">
      <div class="bigfield"><label>Quanti utenti useranno l'app?</label><input id="dip" type="number" min="1" value="${esc(S.dipendenti)}" placeholder="es. 4" oninput="S.dipendenti=this.value"></div>
      <div class="bigfield"><label>Logo (facoltativo)</label><input id="logo" type="file" accept="image/*" onchange="S.logo=this.files[0]?this.files[0].name:'';var o=document.getElementById('logo-ok');if(o)o.textContent=S.logo?('caricato: '+S.logo):''"><div id="logo-ok" style="color:var(--ac);font-size:12px;margin-top:4px">${S.logo?('caricato: '+esc(S.logo)):''}</div></div>
    </div>
  </div>
  <div class="navbar">
    <div class="sp"></div>
    <button class="btn pri" onclick="next()">Continua →</button>
  </div>`;
}

/* ---------------- STEP 2 — settore ---------------- */
function step2(){
  return `
  <div class="h1"><span class="accent"></span>Che attività fai?</div>
  <div class="lead">Scegli il settore più vicino al tuo: ti proporremo i moduli più utili. Potrai comunque aggiungere tutti gli altri.</div>
  <div class="grid">
    ${SETTORI.map(s=>`
      <div class="tile ${S.settore===s.id?'on':''}" onclick="pickSettore('${s.id}')">
        <span class="ic">${s.ic}</span>
        <div class="nm">${esc(s.nome)}</div>
        <div class="ds">${esc(s.desc)}</div>
      </div>`).join('')}
  </div>
  <div class="navbar">
    <button class="btn ghost" onclick="back()">← Indietro</button>
    <div class="sp"></div>
    <button class="btn pri" id="nx2" onclick="next()" ${S.settore?'':'disabled'}>Continua →</button>
  </div>`;
}
function pickSettore(id){
  S.settore=id;
  // pre-seleziona i moduli proposti del settore (solo quelli già pronti)
  const st=byId(SETTORI,id);
  if(st) st.proposti.forEach(m=>{ const mod=modById(m); if(mod && mod.stato!=='arrivo') S.extra.add(m); });
  render();
}

/* ---------------- STEP 3 — moduli ---------------- */
function step3(){
  const st = byId(SETTORI, S.settore) || {proposti:[]};
  const pronti   = MODULI_EXTRA.filter(m=>m.stato!=='arrivo' && !m.custom);  /* niente moduli su misura di altri */
  const proposti = pronti.filter(m=>st.proposti.includes(m.id));
  const altri    = pronti.filter(m=>!st.proposti.includes(m.id));
  const tile = (m,extra=true)=>`
    <div class="tile ${extra?(S.extra.has(m.id)?'on':''):'locked'} ${extra&&m.stato==='arrivo'?'dim':''}" ${extra?`onclick="toggleExtra('${m.id}')"`:''}>
      <span class="ic">${m.ic}</span>
      <div class="nm">${esc(m.nome)}</div>
      <div class="ds">${esc(m.desc)}</div>
      ${extra&&st.proposti.includes(m.id)?'<span class="tag">consigliato</span>':''}${extra&&m.stato==='arrivo'?'<span class="soon">in arrivo</span>':''}
    </div>`;
  return `
  <div class="h1"><span class="accent"></span>Componi la tua app</div>
  <div class="lead">I moduli <b>base</b> ci sono sempre. Aggiungi quelli che ti servono: i <b style="color:var(--amber)">consigliati</b> sono pensati per il tuo settore.</div>

  <div class="section-label first">Inclusi sempre — la base</div>
  <div class="grid">${MODULI_BASE.map(m=>tile(m,false)).join('')}</div>

  ${proposti.length?`<div class="section-label">Consigliati per il tuo settore</div>
  <div class="grid">${proposti.map(m=>tile(m)).join('')}</div>`:''}

  <div class="section-label">Tutti gli altri moduli</div>
  <div class="grid">${altri.map(m=>tile(m)).join('')}</div>

  <div class="custom-mod">
    <div class="cm-h"><span class="ic">✨</span>Non trovi quello che ti serve?</div>
    <div class="cm-sub">Descrivi il <b>modulo su misura</b> che vorresti: a cosa serve, cosa deve gestire, chi lo usa. Lo costruiamo noi e te lo ricontattiamo.</div>
    <div class="bigfield">
      <label>Modulo su misura — descrizione</label>
      <textarea id="rich" placeholder="es. «Mi serve un modulo per registrare i controlli F-Gas dei condizionatori: per ogni apparecchio data del controllo, kg di gas, e un avviso quando scade.»" oninput="S.richiesta=this.value;updCount()" maxlength="1200">${esc(S.richiesta)}</textarea>
    </div>
  </div>

  <div class="navbar">
    <button class="btn ghost" onclick="back()">← Indietro</button>
    <div class="sp"></div>
    <span class="count">${MODULI_BASE.length + S.extra.size} moduli${S.richiesta.trim()?' + 1 su misura':''}</span>
    <button class="btn pri" onclick="next()">Vedi l'anteprima →</button>
  </div>`;
}
function toggleExtra(id){ S.extra.has(id)?S.extra.delete(id):S.extra.add(id); render(); }
function updCount(){ const c=$('.count'); if(c) c.textContent=`${MODULI_BASE.length + S.extra.size} moduli${S.richiesta.trim()?' + 1 su misura':''}`; }

/* ---------------- STEP 4 — anteprima + invio ---------------- */
function chosenMods(){ return [...MODULI_BASE, ...MODULI_EXTRA.filter(m=>S.extra.has(m.id))]; }

/* ---- prezzo (stesso listino della landing) ---- */
const MOD_TIER={conti:12, man:19, macchine:19, pellet:19, sites:29, zone:29};
const tierPrezzo=id=>MOD_TIER[id]||25;
function calcPrezzo(){
  const extra=[...S.extra].filter(id=>{const m=modById(id);return m && m.stato!=='arrivo' && !m.custom;});
  const modSum=extra.reduce((s,id)=>s+tierPrezzo(id),0);
  const n=extra.length;
  const sconto=n>=6?0.15:(n>=3?0.10:0);
  const dip=parseInt(S.dipendenti)||0;
  const utentiExtra=Math.max(0,dip-4);
  const costoUtenti=utentiExtra*4;
  const canone=Math.round(59+modSum*(1-sconto))+costoUtenti;
  return {modSum, sconto, canone, utentiExtra, costoUtenti, custom:!!S.richiesta.trim()};
}

function step4(){
  const nome = S.azienda.trim() || 'La tua app';
  const settore = byId(SETTORI,S.settore);
  const extraChosen = MODULI_EXTRA.filter(m=>S.extra.has(m.id));
  const P = calcPrezzo();
  const extraPriceRows = extraChosen.filter(m=>m.stato!=='arrivo'&&!m.custom)
    .map(m=>`<div class="rowl"><span class="k">${esc(m.nome.toUpperCase())}</span><span>+ CHF ${tierPrezzo(m.id)} / mese</span></div>`).join('');
  const svc=(key,label,sub)=>`<span onclick="toggleServizio('${key}')" style="cursor:pointer;display:inline-flex;align-items:center;gap:7px;font-size:13.5px;padding:9px 13px;border-radius:11px;border:1px solid ${S[key]?'#34D399':'rgba(255,255,255,.15)'};background:${S[key]?'rgba(52,211,153,.12)':'transparent'};color:${S[key]?'#EAF0EC':'var(--t2,#9aa)'}">${S[key]?'✓':'+'} ${label} <span style="opacity:.7;font-size:11.5px">· ${sub}</span></span>`;
  // assicura una schermata valida selezionata
  const validi = new Set([...chosenMods().map(m=>m.id),'altro']);
  if(!validi.has(S.previewView)) S.previewView='hub';

  return `
  <div class="h1"><span class="accent"></span>Ecco la tua app</div>
  <div class="lead"><b>Tocca i moduli</b> nell'anteprima per vederne le schermate. Ecco come si presenterebbe <b>${esc(nome)}</b>.</div>

  <div id="preview-area">${previewArea()}</div>

  <div class="summary" style="margin-top:18px">
    <h3>Riepilogo</h3>
    <div class="rowl"><span class="k">AZIENDA</span><span>${esc(nome)}</span></div>
    <div class="rowl"><span class="k">SETTORE</span><span>${settore?esc(settore.ic+' '+settore.nome):'—'}</span></div>
    <div class="rowl"><span class="k">BASE</span><div class="chips">${MODULI_BASE.map(m=>`<span class="chip b">${m.ic} ${esc(m.nome)}</span>`).join('')}</div></div>
    <div class="rowl"><span class="k">EXTRA</span><div class="chips">${extraChosen.length?extraChosen.map(m=>`<span class="chip">${m.ic} ${esc(m.nome)}${m.stato==='arrivo'?' · in arrivo':''}</span>`).join(''):'<span class="cs" style="color:var(--t3)">nessuno</span>'}</div></div>
    ${S.richiesta.trim()?`<div class="rowl"><span class="k">SU MISURA</span><div class="chips"><span class="chip" style="white-space:normal;line-height:1.45;text-align:left">✨ ${esc(S.richiesta.trim())}</span></div></div>`:''}

    <div style="margin-top:18px;border-top:1px solid var(--line);padding-top:16px">
      <h3>➕ Servizi aggiuntivi <span style="color:var(--t3);font-size:13px;font-weight:400">· facoltativi</span></h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">
        ${svc('dominio','🌐 Dominio personalizzato','CHF 90/anno')}
        ${svc('migrazione','📦 Migrazione dati','da concordare')}
      </div>
      <div class="cs" style="margin-top:8px;color:var(--t3);font-size:12px">Il dominio è un indirizzo tuo (es. miazienda.ch). La migrazione porta dentro i dati dal tuo vecchio gestionale.</div>
    </div>

    <div style="margin-top:18px;border-top:1px solid var(--line);padding-top:16px">
      <h3>💳 Il tuo abbonamento</h3>
      <div class="rowl"><span class="k">CANONE BASE</span><span>CHF 59 / mese</span></div>
      ${extraPriceRows}
      ${P.utentiExtra?`<div class="rowl"><span class="k">+${P.utentiExtra} UTENTI</span><span>+ CHF ${P.costoUtenti} / mese</span></div>`:''}
      ${P.sconto?`<div class="rowl"><span class="k">SCONTO VOLUME</span><span>− ${Math.round(P.sconto*100)}%</span></div>`:''}
      <div class="rowl" style="border-top:1px solid var(--line);margin-top:6px;padding-top:10px"><span class="k" style="color:var(--t1);font-weight:700">TOTALE MENSILE</span><span style="font-weight:700;font-size:18px;color:var(--t1)">CHF ${P.canone} / mese</span></div>
      <div class="rowl"><span class="k">ATTIVAZIONE</span><span>CHF 690 una tantum <span style="color:var(--t3);font-size:12px">· progettazione iniziale</span></span></div>
      ${S.dominio?`<div class="rowl"><span class="k">DOMINIO</span><span>CHF 90 / anno</span></div>`:''}
      ${S.migrazione?`<div class="rowl"><span class="k">MIGRAZIONE DATI</span><span style="text-align:right;color:var(--amber)">da concordare<br><span style="font-size:12px">in base ai dati · una tantum</span></span></div>`:''}
      ${P.custom?`<div class="rowl"><span class="k" style="color:var(--amber)">MODULO SU MISURA</span><span style="text-align:right;color:var(--amber)">da concordare insieme<br><span style="font-size:12px">ti contatto io · si paga una volta sola</span></span></div>`:''}
    </div>

    <div class="send-box">
      <h3>📨 ${P.custom?'Parliamone':'Invia la richiesta'}</h3>
      <p>${P.custom?'Hai chiesto un modulo su misura: ti contatto io per progettarlo e concordare il prezzo prima di procedere. Intanto inviami la configurazione.':'Inviami la configurazione: ti preparo l\'app e ti mando il link per pagare. Oppure contattami per qualsiasi domanda. Nessun dato viene salvato online.'}</p>
      <div class="send-actions">
        <button class="btn pri" onclick="sendToRegia()">Invia richiesta</button>
        ${CONTATTO.whatsapp?`<button class="btn" onclick="sendWhatsApp()">💬 WhatsApp</button>`:''}
        <button class="btn ghost" onclick="copyConfig()">⧉ Copia configurazione</button>
      </div>
      <div class="code" id="code">${esc(buildText())}</div>
    </div>
  </div>

  <div class="navbar">
    <button class="btn ghost" onclick="back()">← Modifica i moduli</button>
    <div class="sp"></div>
  </div>`;
}

/* ---- anteprima navigabile (telefono / pc) ---- */
const _short = n => esc(n.split(/[\s\/]/)[0]);
function previewArea(){
  return `
  <div class="preview-controls">
    <div class="device-toggle">
      <button class="${S.device==='phone'?'on':''}" onclick="setDevice('phone')">📱 Telefono</button>
      <button class="${S.device==='pc'?'on':''}" onclick="setDevice('pc')">💻 Computer</button>
    </div>
    ${colorPicker({title:'Colore', hint:'toccalo: la tua app cambia subito'})}
  </div>
  <div class="mock-wrap" style="--cy:${S.accent};--glow:0 0 24px ${S.accent}55">${S.device==='pc'?pcMockup():phoneMockup()}</div>`;
}
function refreshPreview(){ const a=$('#preview-area'); if(a) a.innerHTML=previewArea(); }
function setPreviewView(id){ S.previewView=id; refreshPreview(); }
function setDevice(d){ S.device=d; if(d==='pc'&&S.previewView==='altro') S.previewView='hub'; refreshPreview(); }

function altroScreen(){
  const mods = chosenMods();
  return `<div class="ph-title"><span class="a"></span>Tutti i moduli</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
    ${mods.map(m=>`<div onclick="setPreviewView('${m.id}')" style="background:var(--bg1);border:1px solid var(--line);border-radius:11px;padding:12px 6px;text-align:center;cursor:pointer"><div style="font-size:23px">${m.ic}</div><div style="font-size:9.5px;color:var(--t2);margin-top:5px;line-height:1.2">${esc(m.nome)}</div></div>`).join('')}
  </div>`;
}
function phoneMockup(){
  const nome = S.azienda.trim()||'La tua app';
  const mods = chosenMods();
  const first = mods.slice(0,5);
  let nav = first.map(m=>`<div class="nb ${S.previewView===m.id?'on':''}" onclick="setPreviewView('${m.id}')"><span class="i">${m.ic}</span>${_short(m.nome)}</div>`).join('');
  if(mods.length>5) nav += `<div class="nb ${S.previewView==='altro'?'on':''}" onclick="setPreviewView('altro')"><span class="i">☰</span>Altro</div>`;
  const body = S.previewView==='altro' ? altroScreen() : schermataDi(S.previewView);
  return `<div class="phone">
    <div class="notch"></div>
    <div class="ph-top"><span class="dot"></span><div><div class="nm">${esc(nome)}</div><div class="sub">GESTIONALE</div></div></div>
    <div class="ph-body">${body}</div>
    <div class="ph-nav">${nav}</div>
  </div>`;
}
function pcMockup(){
  const nome = S.azienda.trim()||'La tua app';
  const mods = chosenMods();
  const view = S.previewView==='altro' ? 'hub' : S.previewView;
  const slug = (nome.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'la-tua-app');
  return `<div class="pc">
    <div class="pc-bar"><span class="b r"></span><span class="b y"></span><span class="b g"></span><span class="url">${esc(slug)}.app</span></div>
    <div class="pc-app">
      <div class="pc-side">
        <div class="pc-brand"><span class="dot"></span>${esc(nome)}</div>
        <div class="pc-brand-sub">GESTIONALE</div>
        ${mods.map(m=>`<div class="pc-ni ${view===m.id?'on':''}" onclick="setPreviewView('${m.id}')"><span class="i">${m.ic}</span>${esc(m.nome)}</div>`).join('')}
      </div>
      <div class="pc-main">${schermataDi(view)}</div>
    </div>
  </div>`;
}

/* ---------------- invio / export ---------------- */
function buildConfig(){
  const slug = S.azienda.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const c = {
    azienda: S.azienda.trim(),
    slug: slug,
    settore: S.settore,
    accento: S.accent,
    referente: S.referente.trim(),
    email: S.email.trim(),
    telefono: S.telefono.trim(),
    dipendenti: S.dipendenti?Number(S.dipendenti):null,
    logo: S.logo||false,
    dominio: !!S.dominio,
    migrazione: !!S.migrazione,
    moduli_base: MODULI_BASE.map(m=>m.id),
    moduli_extra: [...S.extra],
    generato: 'configuratore'
  };
  if(S.richiesta.trim()) c.modulo_su_misura = S.richiesta.trim();
  return c;
}
function buildText(){
  const c = buildConfig();
  const settore = byId(SETTORI,S.settore);
  const P = calcPrezzo();
  const nm = id => (modById(id)||{nome:id}).nome;
  return [
    `NUOVA APP — configurazione`,
    `Azienda: ${c.azienda||'(da indicare)'}`,
    `Settore: ${settore?settore.nome:'—'}`,
    `Colore accento: ${c.accento}`,
    `Referente: ${c.referente||'-'}`,
    `Email: ${c.email||'-'}  ·  Tel: ${c.telefono||'-'}`,
    `Utenti previsti: ${c.dipendenti||'-'}`,
    ...(c.logo?[`Logo: ${c.logo} (allega il file alla mail)`]:[]),
    `Moduli base: ${c.moduli_base.map(nm).join(', ')}`,
    `Moduli extra: ${c.moduli_extra.length?c.moduli_extra.map(nm).join(', '):'nessuno'}`,
    ``,
    `STIMA COSTO: CHF ${P.canone}/mese + CHF 690 attivazione${S.dominio?' + CHF 90/anno dominio':''}${S.migrazione?' + migrazione dati (da concordare)':''}${P.custom?' + modulo su misura da concordare (una tantum)':''}`,
    ...((S.dominio||S.migrazione)?[`Servizi extra richiesti: ${[S.dominio?'dominio personalizzato (CHF 90/anno)':null,S.migrazione?'migrazione dati (da concordare)':null].filter(Boolean).join(', ')}`]:[]),
    ...(c.modulo_su_misura?[``,`MODULO SU MISURA (da costruire, da concordare prezzo):`,c.modulo_su_misura]:[]),
    ``,
    `--- config (per l'assemblaggio) ---`,
    JSON.stringify(c)
  ].join('\n');
}
function sendEmail(){
  const sub = `Nuova app — ${S.azienda.trim()||'configurazione'}`;
  window.location.href = `mailto:${CONTATTO.email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(buildText())}`;
}
async function sendToRegia(){
  const c=buildConfig();
  if(!c.azienda||!c.referente||!c.email){toast('Inserisci azienda, referente ed email');return;}
  const cfg=window.MODULA_CONFIG;
  if(!cfg||!window.supabase){toast('Connessione TEST non disponibile');return;}
  const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
  const{error}=await db.from('configurator_requests').insert({company_name:c.azienda,contact_name:c.referente,contact_email:c.email,contact_phone:c.telefono,configuration:c});
  if(error){toast('Invio non riuscito: '+error.message);return;}
  toast('Richiesta inviata alla Regia ✓');
}
function sendWhatsApp(){
  window.open(`https://wa.me/${CONTATTO.whatsapp}?text=${encodeURIComponent(buildText())}`,'_blank');
}
function copyConfig(){
  const t = buildText();
  (navigator.clipboard?.writeText(t) || Promise.reject()).then(()=>toast('Configurazione copiata ✓')).catch(()=>{
    const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');toast('Configurazione copiata ✓');}catch(e){toast('Copia non riuscita');}
    ta.remove();
  });
}
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2200); }

/* ---------------- navigazione step ---------------- */
function next(){
  if(S.step===1 && !S.azienda.trim()){ $('#az')?.focus(); toast('Scrivi il nome dell\'azienda'); return; }
  if(S.step===2 && !S.settore){ toast('Scegli un settore'); return; }
  if(S.step<4){ S.step++; if(S.step===4){ S.previewView='hub'; S.device='phone'; } render(); }
}
function back(){ if(S.step>1){ S.step--; render(); } }

render();
