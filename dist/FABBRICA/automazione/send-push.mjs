#!/usr/bin/env node
/* ============================================================================
   MODULA · INVIO NOTIFICHE PUSH (Stadio B — manuale, super-admin)
   ----------------------------------------------------------------------------
   Manda una notifica push ai dipendenti di un'azienda (o di tutte) che hanno
   attivato le notifiche nell'app.

   USO:
     node send-push.mjs <slug-azienda> "Titolo" "Messaggio" [url]
     node send-push.mjs --all          "Titolo" "Messaggio" [url]

   ESEMPI:
     node send-push.mjs ptek "Promemoria" "Domani manutenzione da Rossi alle 9"
     node send-push.mjs --all "Avviso" "Manutenzione del sistema stanotte"

   LEGGE (file locali, gitignorati — mai nel repo):
     ./secrets.local.json  → SUPABASE_URL, SERVICE_ROLE_KEY
     ./vapid.local.json    → VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT
   ============================================================================ */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import webpush from 'web-push';

const HERE = dirname(fileURLToPath(import.meta.url));
const die = m => { console.error('✗ ' + m); process.exit(1); };
const read = f => { try { return JSON.parse(readFileSync(join(HERE, f), 'utf8')); } catch { die('Manca o illeggibile ' + f); } };

const S = read('secrets.local.json');
const V = read('vapid.local.json');
const URL = S.SUPABASE_URL, KEY = S.SERVICE_ROLE_KEY;
if (!URL || !KEY) die('secrets.local.json: servono SUPABASE_URL e SERVICE_ROLE_KEY.');
if (!V.VAPID_PUBLIC || !V.VAPID_PRIVATE) die('vapid.local.json: servono VAPID_PUBLIC e VAPID_PRIVATE.');

const args = process.argv.slice(2);
if (args.length < 3) die('Uso: node send-push.mjs <slug|--all> "Titolo" "Messaggio" [url]');
const [target, title, body, url] = args;

webpush.setVapidDetails(V.VAPID_SUBJECT || 'mailto:admin@modula.app', V.VAPID_PUBLIC, V.VAPID_PRIVATE);

const api = (path, opts = {}) => fetch(URL + '/rest/v1/' + path, {
  ...opts,
  headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) }
});

async function tenantBySlug(slug) {
  const r = await api(`tenants?slug=eq.${encodeURIComponent(slug)}&select=id,name`);
  const j = await r.json();
  if (!Array.isArray(j) || !j.length) die(`Azienda con slug "${slug}" non trovata.`);
  return j[0];
}

async function main() {
  let subsPath = 'push_subs?select=endpoint,p256dh,auth';
  let label = 'tutte le aziende';
  if (target !== '--all') {
    const t = await tenantBySlug(target);
    subsPath += `&tenant_id=eq.${t.id}`;
    label = t.name;
  }
  const subs = await (await api(subsPath)).json();
  if (!Array.isArray(subs) || !subs.length) {
    console.log(`Nessuna iscrizione push per ${label}. (Nessuno ha ancora attivato le notifiche nell'app.)`);
    return;
  }
  const payload = JSON.stringify({ title, body, url: url || './', tag: 'modula' });
  let ok = 0, gone = 0, fail = 0;
  for (const s of subs) {
    const sub = { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } };
    try { await webpush.sendNotification(sub, payload); ok++; }
    catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        await api(`push_subs?endpoint=eq.${encodeURIComponent(s.endpoint)}`, { method: 'DELETE' });
        gone++;
      } else { fail++; console.error('  errore invio:', e.statusCode || e.message); }
    }
  }
  console.log(`✓ Inviate ${ok} notifiche a "${label}".`
    + (gone ? ` ${gone} iscrizioni scadute rimosse.` : '')
    + (fail ? ` ${fail} errori.` : ''));
}
main().catch(e => die(e.message));
