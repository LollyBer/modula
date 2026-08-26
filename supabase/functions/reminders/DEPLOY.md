# Promemoria appuntamenti — messa in funzione (una volta sola)

La Edge Function `reminders` manda le notifiche push prima di ogni
appuntamento/manutenzione. Al **titolare** arrivano quelle di tutta l'azienda,
a ogni **dipendente** solo le sue. Gira da sola ogni ~5 minuti.

> Prerequisito: le notifiche push devono già funzionare (VAPID generate; gli
> utenti attivano le notifiche dall'app → Impostazioni → 🔔). Vedi la memoria
> `notifiche-push`.

## 1) Schema (SQL Editor)
Esegui `supabase/schema.sql` (idempotente): aggiunge `settings.reminders` e la
tabella `reminders_sent`.

## 2) Segreti della funzione
Supabase → **Edge Functions → Secrets** (o `supabase secrets set …`):

| Nome | Valore |
|------|--------|
| `SUPABASE_URL` | `https://yohtthmcjqwlxoihvcrt.supabase.co` |
| `SERVICE_ROLE_KEY` | (Project settings → API → service_role) — **segreto** |
| `VAPID_PUBLIC` | la chiave pubblica VAPID (stessa di `core/config.js`) |
| `VAPID_PRIVATE` | la chiave privata VAPID (da `vapid.local.json`, **mai nel repo**) |
| `VAPID_SUBJECT` | `mailto:tuaemail@dominio` |
| `CRON_SECRET` | una stringa a caso lunga (la usi al passo 4) |

## 3) Deploy della funzione
```bash
supabase functions deploy reminders --no-verify-jwt
```
(`--no-verify-jwt` perché la protegge il nostro `CRON_SECRET`, non il JWT.)

## 4) Pianificazione ogni 5 minuti (SQL Editor)
Abilita le estensioni e crea il job. **Sostituisci** `IL_TUO_CRON_SECRET`.
```sql
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule('modula-reminders', '*/5 * * * *', $$
  select net.http_post(
    url     := 'https://yohtthmcjqwlxoihvcrt.functions.supabase.co/reminders',
    headers := jsonb_build_object(
                 'Content-Type','application/json',
                 'x-cron-key','IL_TUO_CRON_SECRET'),
    body    := '{}'::jsonb
  );
$$);
```
Per fermarlo: `select cron.unschedule('modula-reminders');`

## 5) Prova
- In un'azienda di test: attiva le notifiche (Impostazioni → 🔔), tieni i
  Promemoria accesi con “15 minuti prima”, crea un appuntamento tra ~10 minuti.
- Chiamata manuale per non aspettare il cron:
```bash
curl -s -X POST 'https://yohtthmcjqwlxoihvcrt.functions.supabase.co/reminders' \
  -H 'x-cron-key: IL_TUO_CRON_SECRET' -H 'Content-Type: application/json' -d '{}'
```
Risposta attesa: `{"ok":true,"sent":N,"marked":M}`.

## Note
- Ogni evento è notificato **una volta** (riga in `reminders_sent`). Se cambi
  l'orario di un evento già notificato, non ri-notifica (per ripetere: cancella
  la sua riga da `reminders_sent`).
- Eventi **senza orario**: avvisati all'ora “allDayTime” dell'azienda.
- Fuso **Europe/Zurich** con ora legale gestita nella funzione.
- Costo: nullo (web push è gratis). WhatsApp sarà un canale in più, a pagamento.
