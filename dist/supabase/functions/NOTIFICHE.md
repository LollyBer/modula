# Notifiche push — runbook di messa in funzione

Stato al 14 settembre 2026: il lato browser è completo (service worker `sw.js`, chiave VAPID
pubblica in `core/config.js`, iscrizioni salvate in `push_subs`), ma sul progetto Supabase
**non è deployata nessuna Edge Function**. Quindi:

- le notifiche fra colleghi (lavoro assegnato, "fatta", "Notifica di prova") chiamano
  `send-push`, che prima di questa modifica **non esisteva** → `404`;
- i promemoria automatici (`reminders`) esistono solo nel repo, mai deployati;
- il mittente manuale `FABBRICA/automazione/send-push.mjs` non ha più `secrets.local.json`.

Questo runbook mette online entrambe le funzioni. **Ordine consigliato: prima sul progetto
Supabase TEST, poi su PROD.** Ogni comando va lanciato dalla root del repo.

## 0. Prerequisiti

- Supabase CLI loggata (`supabase projects list` mostra il progetto).
- Docker **non serve**: si deploya con `--use-api` (bundle fatto lato server).
- `FABBRICA/automazione/vapid.local.json` presente (chiavi VAPID già generate: **non
  rigenerarle**, invaliderebbero le iscrizioni esistenti).
- `REF` = ref del progetto su cui lavori (TEST o PROD). Esempio per PROD: `yohtthmcjqwlxoihvcrt`.

## 1. Segreti delle funzioni

Le chiavi VAPID si caricano direttamente dal file locale, senza mai stamparle a schermo:

```bash
supabase secrets set --project-ref REF --env-file <(python3 -c 'import json;d=json.load(open("FABBRICA/automazione/vapid.local.json"));print("\n".join(f"{k}={d[k]}" for k in ("VAPID_PUBLIC","VAPID_PRIVATE","VAPID_SUBJECT")))')
```

Segreto del cron (solo per `reminders`): generalo una volta e conservalo in un file
gitignored (`*.local.json` è già escluso dal repo):

```bash
python3 -c 'import secrets,json;print(json.dumps({"CRON_SECRET":secrets.token_hex(32)}))' > FABBRICA/automazione/cron.local.json && supabase secrets set --project-ref REF --env-file <(python3 -c 'import json;print("CRON_SECRET="+json.load(open("FABBRICA/automazione/cron.local.json"))["CRON_SECRET"])')
```

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` **non vanno impostati**: Supabase li inietta da
sola in ogni funzione (la CLI rifiuta comunque i nomi che iniziano con `SUPABASE_`).
Entrambe le funzioni li usano automaticamente.

Verifica (mostra solo i nomi):

```bash
supabase secrets list --project-ref REF
```

## 2. Deploy delle funzioni

```bash
supabase functions deploy send-push --project-ref REF --use-api
```

```bash
supabase functions deploy reminders --project-ref REF --use-api --no-verify-jwt
```

`send-push` tiene la verifica JWT (la chiama l'app con la sessione dell'utente).
`reminders` la disattiva perché la chiama pg_cron: la protegge `CRON_SECRET`.

## 3. Pianificazione dei promemoria (SQL Editor del progetto)

Prima assicurati che lo schema sia aggiornato (`supabase/schema.sql`, idempotente: crea
`settings.reminders` e `reminders_sent`). Poi, sostituendo `REF` e `IL_TUO_CRON_SECRET`
(valore in `FABBRICA/automazione/cron.local.json`):

```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule('modula-reminders', '*/5 * * * *', $$
  select net.http_post(
    url     := 'https://REF.supabase.co/functions/v1/reminders',
    headers := jsonb_build_object(
                 'Content-Type','application/json',
                 'x-cron-key','IL_TUO_CRON_SECRET'),
    body    := '{}'::jsonb
  );
$$);
```

Per fermarlo: `select cron.unschedule('modula-reminders');`

## 4. Prova

1. Nell'app, con un utente del tenant di prova: Impostazioni → 🔔 → **Attiva notifiche**
   (serve il permesso del browser sul dispositivo).
2. Sempre lì: **Notifica di prova** → deve comparire "📩 Inviata" e arrivare la notifica.
   Se compare "⚠ Requested function was not found" la funzione non è deployata su quel progetto.
3. Assegna un lavoro a un collega iscritto: riceve "📌 Ti è stato assegnato".
4. Promemoria: crea un appuntamento tra ~10 minuti con soglia 15 min (Impostazioni → 🔔 Promemoria)
   e aspetta il giro del cron, oppure chiamata manuale:

```bash
curl -s -X POST "https://REF.supabase.co/functions/v1/reminders" -H "x-cron-key: IL_TUO_CRON_SECRET" -H "Content-Type: application/json" -d '{}'
```

Risposta attesa: `{"ok":true,"sent":N,"marked":M}`.

## 5. Dopo il deploy su PROD

- Le iscrizioni fatte prima del 22 agosto 2026 vivevano nel vecchio progetto: ogni utente
  deve **riattivare le notifiche** su ciascun dispositivo (Impostazioni → 🔔).
- Su iPhone/iPad le notifiche funzionano solo con l'app aggiunta alla schermata Home.
- Su Mac la "Safari Web App" (es. `ptek.app` sul Desktop) le supporta.

## Sicurezza

- `send-push` accetta solo utenti autenticati e collegati a un'azienda; spedisce **solo ai
  dipendenti della stessa azienda** di chi chiama (`push_subs.tenant_id`), max 50 destinatari,
  testi troncati. Nessun segreto nel codice.
- `reminders` risponde solo con l'header `x-cron-key` corretto.
- La chiave privata VAPID e il segreto del cron restano in `FABBRICA/automazione/*.local.json`
  (gitignored) e nei Secrets del progetto.
