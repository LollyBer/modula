// ============================================================================
// MODULA · Edge Function "reminders" (Stadio A — automatica)
// ----------------------------------------------------------------------------
// Girata da pg_cron ogni ~5 minuti. Trova gli appuntamenti/manutenzioni in
// arrivo entro la soglia impostata dall'azienda e manda una notifica push:
//   · al TITOLARE arrivano quelle di tutta la sua azienda;
//   · a ogni DIPENDENTE solo quelle assegnate a lui (employee_id o employees[]).
// Ogni evento viene notificato UNA volta sola (tabella reminders_sent).
//
// SEGRETI (Supabase → Edge Functions → Secrets):
//   SUPABASE_URL, SERVICE_ROLE_KEY, VAPID_PUBLIC, VAPID_PRIVATE,
//   VAPID_SUBJECT (es. mailto:tu@dominio), CRON_SECRET (stringa a caso).
// Deploy:  supabase functions deploy reminders --no-verify-jwt
// Chiamata da pg_cron con header  x-cron-key: <CRON_SECRET>  (vedi schema.sql).
// ============================================================================
import webpush from "npm:web-push@3.6.7";

const URL = Deno.env.get("SUPABASE_URL")!;
const KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@modula.app";
const CRON_SECRET = Deno.env.get("CRON_SECRET") || "";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

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

// offset (ms) del fuso rispetto a UTC per un dato istante — gestisce l'ora legale
function tzOffset(utcMs: number, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const m: Record<string, string> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) m[p.type] = p.value;
  const asUTC = Date.UTC(+m.year, +m.month - 1, +m.day, +m.hour, +m.minute, +m.second);
  return asUTC - utcMs;
}
// istante (epoch ms) di una data+ora "da parete" in Europe/Zurich
function zurichEpoch(dateStr: string, timeStr: string): number {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = (timeStr || "00:00").split(":").map((n) => Number(n) || 0);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  return guess - tzOffset(guess, "Europe/Zurich");
}
const isoDate = (ms: number) => {
  const off = tzOffset(ms, "Europe/Zurich");
  return new Date(ms + off).toISOString().slice(0, 10);
};

Deno.serve(async (req) => {
  // solo il cron (o chi ha il segreto) può eseguire
  if (CRON_SECRET && req.headers.get("x-cron-key") !== CRON_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  try {
    const now = Date.now();
    const today = isoDate(now);
    const in2 = isoDate(now + 2 * 86400000); // finestra: oggi..+2 giorni (copre "1 giorno prima" + fuso)

    // impostazioni promemoria per azienda
    const tenants = await get(`settings?select=tenant_id,reminders`);
    const cfg: Record<string, { min: number; allDay: string }> = {};
    for (const t of tenants) {
      const r = t.reminders || {};
      if (r.enabled === false) continue; // default: acceso
      cfg[t.tenant_id] = {
        min: Number(r.minutesBefore ?? 60),
        allDay: r.allDayTime || "08:00",
      };
    }
    const tenantIds = Object.keys(cfg);
    if (!tenantIds.length) return json({ ok: true, sent: 0, note: "nessuna azienda con promemoria attivi" });

    // dipendenti (per titolari + nomi) e iscrizioni push
    const emps = await get(`employees?select=id,tenant_id,is_owner,active`);
    const ownersByTenant: Record<string, string[]> = {};
    for (const e of emps) {
      if (e.is_owner && e.active !== false) (ownersByTenant[e.tenant_id] ||= []).push(e.id);
    }
    const subs = await get(`push_subs?select=endpoint,p256dh,auth,emp_id,tenant_id`);
    const subsByEmp: Record<string, any[]> = {};
    for (const s of subs) (subsByEmp[s.emp_id] ||= []).push(s);

    // già inviati (dedup)
    const sentRows = await get(`reminders_sent?select=kind,event_id`);
    const already = new Set(sentRows.map((r: any) => `${r.kind}:${r.event_id}`));

    // clienti (per il nome nel messaggio)
    const clients = await get(`clients?select=id,name`);
    const cName: Record<string, string> = {};
    for (const c of clients) cName[c.id] = c.name;

    const kinds = [
      { kind: "appointment", table: "appointments", filter: "done=eq.false" },
      { kind: "maintenance", table: "maintenances", filter: "status=neq.fatta" },
    ];

    let sent = 0, marked = 0;
    for (const k of kinds) {
      const rows = await get(
        `${k.table}?select=id,tenant_id,title,client_id,client_raw,employee_id,employees,date,time&date=gte.${today}&date=lte.${in2}&${k.filter}`,
      );
      for (const ev of rows) {
        const c = cfg[ev.tenant_id];
        if (!c || !ev.date) continue;
        if (already.has(`${k.kind}:${ev.id}`)) continue;

        const eventMs = zurichEpoch(ev.date, ev.time || c.allDay);
        const remindAt = eventMs - c.min * 60000;
        if (now < remindAt || now >= eventMs) continue; // non ancora, o già passato

        // destinatari: titolari (tutto) + dipendenti assegnati
        const assigned = new Set<string>();
        (ownersByTenant[ev.tenant_id] || []).forEach((id) => assigned.add(id));
        if (ev.employee_id) assigned.add(ev.employee_id);
        if (Array.isArray(ev.employees)) {
          for (const a of ev.employees) {
            const id = typeof a === "string" ? a : (a && (a.id || a.emp_id));
            if (id) assigned.add(id);
          }
        }
        const targets: any[] = [];
        for (const id of assigned) (subsByEmp[id] || []).forEach((s) => targets.push(s));

        // segna SEMPRE come inviato (anche se 0 iscritti: evita ritentare all'infinito)
        const ins = await api(`reminders_sent`, {
          method: "POST",
          headers: { Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify({ kind: k.kind, event_id: ev.id, tenant_id: ev.tenant_id }),
        });
        if (ins.ok) marked++;
        already.add(`${k.kind}:${ev.id}`);
        if (!targets.length) continue;

        const client = ev.client_id ? cName[ev.client_id] : ev.client_raw;
        const whenTxt = c.min >= 1440 ? "domani" : c.min >= 60 ? `tra ${Math.round(c.min / 60)} h` : `tra ${c.min} min`;
        const title = `🔔 Promemoria · ${whenTxt}`;
        const body = `${ev.time ? ev.time + " · " : ""}${ev.title || (k.kind === "maintenance" ? "Manutenzione" : "Appuntamento")}${client ? " · " + client : ""}`;
        const payload = JSON.stringify({ title, body, url: "./app.html", tag: `rem-${ev.id}` });

        for (const s of targets) {
          try {
            await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
            sent++;
          } catch (e) {
            const sc = (e as any)?.statusCode;
            if (sc === 404 || sc === 410) {
              await api(`push_subs?endpoint=eq.${encodeURIComponent(s.endpoint)}`, { method: "DELETE" });
            }
          }
        }
      }
    }
    return json({ ok: true, sent, marked });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
}
