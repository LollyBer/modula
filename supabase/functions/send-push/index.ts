// ============================================================================
// MODULA · Edge Function "send-push" (notifiche fra colleghi, in tempo reale)
// ----------------------------------------------------------------------------
// Chiamata dall'app (core.js → pushNotify / pushTest) col JWT dell'utente:
//   POST { empIds: [uuid, …], title, body, tag? }
// Manda una Web Push ai dispositivi iscritti (tabella push_subs) dei dipendenti
// indicati, SOLO se appartengono alla stessa azienda (tenant) di chi chiama.
// Il gateway di Supabase verifica il JWT (verify_jwt attivo, default); qui si
// ricava l'utente e il suo tenant. Le iscrizioni scadute (404/410) si cancellano.
//
// SEGRETI (Supabase → Edge Functions → Secrets): VAPID_PUBLIC, VAPID_PRIVATE,
//   VAPID_SUBJECT (es. mailto:tu@dominio).
//   SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY le inietta Supabase da sola
//   (SERVICE_ROLE_KEY resta accettata per compatibilità con "reminders").
// Deploy:  supabase functions deploy send-push --project-ref <ref> --use-api
// Runbook completo: supabase/functions/NOTIFICHE.md
// ============================================================================
import webpush from "npm:web-push@3.6.7";

const URL = Deno.env.get("SUPABASE_URL")!;
const KEY = Deno.env.get("SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@modula.app";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

// L'app gira su un altro dominio (GitHub Pages): servono le intestazioni CORS.
// L'accesso resta protetto dal JWT, non dall'origine.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// limiti prudenziali sull'input (l'app non supera mai questi valori)
const MAX_TARGETS = 50;
const MAX_TITLE = 80;
const MAX_BODY = 240;
const MAX_TAG = 40;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const api = (path: string, opts: RequestInit = {}) =>
  fetch(`${URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
const get = async (path: string) => {
  const r = await api(path);
  if (!r.ok) throw new Error(`${path} → ${r.status} ${await r.text()}`);
  return await r.json();
};
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ ok: false, error: "solo POST" }, 405);
  try {
    // 1) chi chiama? Il JWT è già stato verificato dal gateway: qui lo si traduce in utente.
    const auth = req.headers.get("Authorization") || "";
    const ur = await fetch(`${URL}/auth/v1/user`, { headers: { apikey: KEY, Authorization: auth } });
    if (!ur.ok) return json({ ok: false, error: "non autenticato" }, 401);
    const user = await ur.json();
    const uid: string | undefined = user?.id;
    if (!uid || !UUID.test(uid)) return json({ ok: false, error: "non autenticato" }, 401);

    // 2) il suo record dipendente → azienda (tenant). Chi non è collegato non manda nulla.
    const mine = await get(`employees?select=id,tenant_id,active&user_id=eq.${uid}&limit=1`);
    const me = mine[0];
    if (!me || me.active === false) return json({ ok: false, error: "utente non collegato a un'azienda" }, 403);

    // 3) input: destinatari (uuid validi, senza doppioni, max 50) e testo
    const b = await req.json().catch(() => ({}));
    const raw = Array.isArray(b?.empIds) ? b.empIds : [];
    const ids = [...new Set(raw.filter((x: unknown) => typeof x === "string" && UUID.test(x)))].slice(0, MAX_TARGETS) as string[];
    const title = clip(b?.title, MAX_TITLE) || "Modula";
    const body = clip(b?.body, MAX_BODY);
    const tag = clip(b?.tag, MAX_TAG) || undefined;
    if (!ids.length) return json({ ok: true, sent: 0, devices: 0, note: "nessun destinatario" });

    // 4) iscrizioni dei destinatari, SOLO dentro l'azienda di chi chiama
    const subs = await get(
      `push_subs?select=endpoint,p256dh,auth,emp_id&tenant_id=eq.${me.tenant_id}&emp_id=in.(${ids.join(",")})`,
    );
    const payload = JSON.stringify({ title, body, url: "./app.html", tag });

    let sent = 0, removed = 0;
    for (const s of subs) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
        sent++;
      } catch (e) {
        const sc = (e as any)?.statusCode;
        if (sc === 404 || sc === 410) {
          // iscrizione scaduta o revocata: via dalla tabella
          await api(`push_subs?endpoint=eq.${encodeURIComponent(s.endpoint)}`, { method: "DELETE" });
          removed++;
        }
      }
    }
    return json({ ok: true, sent, removed, devices: subs.length });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
