# 🔌 INTEGRAZIONE — collegare un modulo (fatto da Loris) all'app

> **Divisione del lavoro.** Loris scrive il **modulo** (la schermata + la logica). L'agente
> Laboratorio lo rende **collegabile**: lo aggancia all'app unica e, se salva dati, al
> database (tabella + RLS + plumbing). Una sola app condivisa → integri **una volta** e il
> modulo è disponibile a tutte le aziende; poi lo accendi per chi vuoi da `admin/`.

Dati di un modulo (li concorda l'agente con Loris prima di iniziare):
`id` (es. `fgas`) · `render<Nome>` (es. `renderFgas`) · `ic` (emoji) · `label` (es. `F-Gas`).

---

## A) Modulo SENZA dati (sola UI / usa stato già esistente)

1. **File** — `modules-extra/<id>/<id>.js` definisce **globale** `function render<Nome>(){…}`
   (deve finire come `window.render<Nome>`). CSS opzionale: `modules-extra/<id>/<id>.css`.
2. **`app.html`** — aggiungi `<script src="./modules-extra/<id>/<id>.js"></script>` (vicino
   agli altri moduli extra) e, se c'è CSS, un `<link rel="stylesheet">` nel `<head>`.
3. **`core/core.js`** — tre punti:
   - `VIEWS` (≈ riga 436): aggiungi `{id:'<id>',ic:'<ic>',label:'<Label>'}` nella posizione
     prevista da `MANIFEST.viewOrder`.
   - **dispatcher** `R={…}` dentro `render()` (≈ riga 984): aggiungi `<id>:window.render<Nome>`.
   - `MODULE_CATALOG.pronti`: aggiungi `{id:'<id>',ic:'<ic>',nome:'<Label>',desc:'…'}`.
4. **`FABBRICA/MANIFEST.js`** — sposta l'`id` da `inArrivo` a `extra`
   (`<id>:{ js:['modules-extra/<id>/<id>.js'], css:[…], render:'render<Nome>', view:{ic,label} }`)
   e aggiungilo a `viewOrder`.
5. **`configuratore/catalogo.js`** — in `MODULI_EXTRA` porta la voce a `stato:'pronto'`
   (o aggiungila): così compare nel configuratore della vetrina.
6. **`admin/index.html`** — aggiungi `{id:'<id>',label:'<Label>'}` all'array `MODULES`:
   così l'interruttore appare nella console super-admin.
7. **LANDING (vetrina)** — REGOLA di Loris: un modulo nuovo va **sempre** anche in vetrina.
   - `landing/landing.js` array `MODS`: `{id:'<id>', ic:'<ic>', nm:'<Nome>', px:<prezzo CHF/mese>, pitch:'…', f:['…','…','…','…']}` (esploratore moduli + price builder). `px:0` = incluso nella base, `px:-1` = in arrivo. Il **prezzo lo decide Loris**: metti un segnaposto e fatteglielo confermare.
   - `landing/news.js` array `NEWS`: una voce `{tipo:'Nuovo modulo', data:'<Mese Anno>', titolo:'…', testo:'…'}` in cima.
   - `landing/index.html`: aggiorna il contatore "Moduli".

Fatti questi 7 punti, il modulo è nel sistema **e in vetrina**. Si vede nell'app quando è in
`VIEWS` **e** acceso sul tenant (`moduleActive`) **e** l'utente ha il permesso (`can('<id>')`).

---

## B) In più, se il modulo SALVA dati

7. **`supabase/schema.sql`** — crea la tabella con `tenant_id` (lo esige il pattern RLS):
   ```sql
   create table if not exists <tbl> (
     id uuid primary key default gen_random_uuid(),
     tenant_id uuid not null references tenants(id) on delete cascade,
     -- …campi del modulo…
     created_at timestamptz not null default now()
   );
   ```
   Poi aggiungi `'<tbl>'` ai **tre** array di loop: trigger+indice (sez. 5), RLS (sez. 6),
   realtime (sez. 8). Infine **ri-esegui** lo schema in Supabase (è idempotente).
8. **`core/core.js` — plumbing dati** (specchio di un modulo dati esistente, es. `maintenances`):
   - `blank()`: aggiungi `<key>:[]`.
   - `MAPS.<key> = { tbl:'<tbl>', toDb:r=>({…}), fromDb:r=>({…}) }` — **mai** mettere
     `tenant_id` nel `toDb`: lo stampa il trigger `set_tenant_id`.
   - `loadAll()`: aggiungi la query e `S.<key>=(…).map(MAPS.<key>.fromDb)`.
   - `dbRows()`, `TBL`, `UP_ORDER`, `DEL_ORDER`: aggiungi `<key>` / `'<tbl>'`.

---

## Regole assolute
- **Isolamento dati = RLS lato server**: ogni tabella ha `tenant_id` (stampato dal trigger) e
  la policy `tenant_isolation`. Il modulo NON invia mai `tenant_id`.
- **Zero dati reali nel repo**: solo struttura e segnaposto.
- Gli `id` devono **combaciare** ovunque: VIEWS, dispatcher `R`, MANIFEST, catalogo, admin,
  (e `<tbl>`/`<key>` nel plumbing). Un id che non combacia = modulo invisibile o crash.
- Verifica finale: `node --check core/core.js`, apri `app.html?demo=1`, accendi il modulo su
  un tenant di prova in `admin/` e controlla che la voce compaia e la schermata si apra.
