# MODULA · La via: UNA app multi-tenant

> Decisione presa il 2026-06-24. Da qui in poi Modula è **una sola app online**,
> con **account** per le aziende, non più un'app-copia per cliente.

## Il modello in una frase

Un solo codice, un solo deploy, un solo database Supabase. Ogni **azienda** è un
*tenant*: una riga in `tenants` con nome, logo, accento e l'elenco dei **moduli
attivi**. Dopo il login l'app carica il tenant dell'utente e mostra solo i suoi
moduli. I dati sono isolati lato server dalla **RLS** (un'azienda non vede mai
quelli di un'altra). Tu sei il **super-admin**: vedi tutto e crei le aziende.

## I tre livelli

- **👑 Super-admin (tu)** — crei le aziende, accendi/spegni i loro moduli, fatturi.
- **👤 Titolare** — gestisce tutto della *sua* azienda, invita i dipendenti.
- **🧑‍🔧 Dipendente** — entra e vede solo i moduli che il titolare gli dà (`perms`).

## Perché (vs. il vecchio modello "un'app per cliente")

A 50 clienti il vecchio modello erano 50 copie identiche del codice da aggiornare
una per una. Adesso: correggi un bug **una volta**, lo ricevono tutti al refresh;
aggiungi un modulo a un'azienda = **aggiorni una riga** nel DB, zero deploy.

## I pezzi (cosa c'è già nel repo)

| Pezzo | File | Cosa fa |
|---|---|---|
| Schema DB | `supabase/schema.sql` | tenant + tutte le tabelle con `tenant_id`, RLS, funzioni onboarding |
| Config backend | `core/config.js` | UNA coppia URL+anon key per tutta la piattaforma |
| App tenant-aware | `core/core.js` | dopo il login carica `BRAND` + moduli dal tenant (`loadTenant`), filtra le viste con `visViews()` |
| App generale (tua) | _da costruire_ | console super-admin: lista aziende, "nuova azienda", interruttori moduli |

## Come funziona l'isolamento dei dati (RLS)

- Ogni riga dati ha `tenant_id`, **stampato in automatico** da un trigger
  (`set_tenant_id`) — l'app non lo invia, quindi i moduli non sono cambiati.
- La policy `tenant_isolation` su ogni tabella consente solo
  `tenant_id = current_tenant() OR is_super_admin()`.
- `current_tenant()` legge il tenant dell'utente loggato dalla riga `employees`.

## Onboarding di una nuova azienda (flusso inviti, già nell'app)

1. Tu (super-admin) chiami `create_tenant(nome, slug, moduli, nome_titolare)`
   → crea l'azienda + il record titolare e ti restituisce un **codice invito**.
2. Dai all'azienda il **link dell'app** + il codice.
3. Il titolare apre l'app, si **registra** (email+password) e inserisce il codice
   → diventa titolare di quell'azienda.
4. Il titolare invita i suoi dipendenti dall'app (`create_invite`, già esistente).

## Setup iniziale (una volta sola)

1. Crea **un** progetto Supabase.
2. SQL Editor → incolla tutto `supabase/schema.sql` → Run.
3. Copia *Project URL* + *anon key* in `core/config.js` (sostituisci i `__..__`).
4. Apri l'app, **registrati**, poi in SQL Editor esegui `select bootstrap_super_admin();`
   → il tuo login diventa super-admin.
5. (Push) genera le chiavi VAPID e metti la pubblica in `core/config.js`.

Finché i `__..__` restano, l'app gira in **modalità demo** (nessun backend) — utile
per la vetrina.

## Cosa cambia per la Fabbrica

La Fabbrica **non assembla più un'app per cliente**. Diventa l'onboarding:
crea il tenant e accende i moduli. I `modules-base/` e `modules-extra/` restano
**una copia sola**, condivisa da tutte le aziende.

## Prossimo passo

Costruire l'**app generale (console super-admin)**: la pagina da cui tu crei le
aziende e gestisci i moduli, appoggiata su `create_tenant` / `bootstrap_super_admin`.
