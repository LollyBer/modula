# FABBRICA Modula — RICETTA di assemblaggio

Il processo che **Claude** esegue per trasformare la config di un cliente
(arrivata dal configuratore) in un'app pronta in `clienti/<slug>/`.

Modello scelto: **C — Claude-driven** (io sono il motore; il [MANIFEST.js](MANIFEST.js) è la mappa).
Output: **sottocartella nello stesso repo** → online su `…/modula/clienti/<slug>/`.

Questa ricetta è il manuale del reparto **Assemblaggio** e del suo agente **l'Assemblatore**
(subagent `fabbrica-assemblatore`). L'agente segue il proprio protocollo di auto-miglioramento:
**prima** legge `agenti/assemblatore/MEMORIA.md`, **dopo** ci scrive cosa ha imparato e aggiorna
`agenti/assemblatore/metriche.json`. Vedi [agenti/assemblatore/AGENTE.md](agenti/assemblatore/AGENTE.md).

> Come si avvia: incolli a Claude la config (anche solo la riga JSON) e dici
> *"assembla questo cliente"* (o invochi il subagent `fabbrica-assemblatore`). Il resto è questa ricetta.

---

## 0. Input

Dal configuratore arriva del testo con, in fondo, la riga JSON:

```json
{ "azienda":"Rossi S.r.l.", "settore":"impianti", "accento":"#6EE7B7",
  "moduli_base":["hub","cal","notes","clients","emps"],
  "moduli_extra":["man","macchine","zone"], "generato":"configuratore" }
```

Campi usati: `azienda` (nome+slug+BRAND), `accento` (colore), `moduli_extra` (cosa includere).
`moduli_base` è informativo: i base ci sono **sempre** (+ `notif`, che non è nel catalogo).

---

## 1. Slug del cliente

`slug = azienda` in minuscolo, solo `a-z 0-9 -` (come fa il configuratore in `pcMockup`):
`Rossi S.r.l.` → `rossi-s-r-l`. La cartella sarà `clienti/<slug>/`.

---

## 2. Copia del template (solo i file che servono)

Crea `clienti/<slug>/` copiando, **mantenendo i percorsi relativi**, l'insieme:

- **sempre**: tutti i file in `MANIFEST.core.files`
- **tutti i base**: i `.js` di ogni voce in `MANIFEST.base`
- **gli extra scelti** (solo quelli `pronto`): i `.js` + `.css` + `deps` di ogni id in `moduli_extra`
  che esiste in `MANIFEST.extra`

I percorsi in `app.html` sono relativi (`./core/…`, `./macchine.js`, `./vendor/…`), quindi la
sottocartella è **autosufficiente** e funziona sotto GitHub Pages senza modifiche ai path.

⚠️ **Casi speciali** (vedi `root:true` nel manifest):
- `macchine` → `macchine.js` + `macchine.css` stanno in **root**, non in `modules-extra/`.
- `zone` → `zone.js` + `zone.css` + `zone-data.js` + **Leaflet** (`vendor/leaflet.js`, `vendor/leaflet.css`).
  Ordine di caricamento js: **leaflet → zone-data → zone**.

---

## 3. Pota `app.html` (script + css solo dei scelti)

Nella copia del cliente, in `app.html`:
- Sezione `<!-- moduli EXTRA (stili) -->` nel `<head>`: tieni i `<link>` css **solo** degli extra scelti
  (rimuovi `macchine.css` / `zone.css` / `leaflet.css` se quei moduli non ci sono).
- Sezione `<!-- moduli EXTRA … -->` a fine `<body>`: tieni i `<script>` **solo** degli extra scelti.
- I `<script>`/`<link>` dei **base** restano sempre.

---

## 4. Pota `core/core.js` (menù + dispatcher)

Due punti, così l'app non mostra voci di moduli assenti:
- **`VIEWS=[`** (ancora `inject.views`): tieni solo le voci dei moduli presenti, **nell'ordine** di
  `MANIFEST.viewOrder`. `hub` e `notif` restano sempre.
- **`R={hub:window.renderHub…}`** (ancora `inject.dispatcher`): tieni solo le coppie dei moduli presenti.

> Perché serve: la visibilità a runtime è filtrata dai permessi (`can()`), ma quelli sono dati per-dipendente,
> non valgono in consegna. Potare VIEWS+dispatcher garantisce un menù pulito e nessuna `render*` mancante.

---

## 5. Inietta BRAND + accento

- **BRAND** (`core/core.js`, ancora `const BRAND={`): `name` = `azienda`; `tagline` opzionale
  (es. nome settore); `logo` = `''` finché il cliente non manda il file (poi `./logo.png`).
- **Accento** (`accento` dal config): aggiungi nel `<head>` di `app.html`, **subito dopo** il link a
  `core/core.css`:
  ```html
  <style>:root{--cy:VALORE_ACCENTO}</style>
  ```
  Sovrascrive l'accento di default (`#5BA02C`) senza toccare `core.css`.

  ⚠️ **Limite noto v1:** alcuni bagliori (glow) in `core.css` usano valori `rgba()` fissi derivati dal
  verde (es. `rgba(111,178,58,.6)`) e **non** seguono `--cy`. L'accento "strutturale" (puntini, voce
  attiva, focus, chip) cambia; i glow restano verdini. *Miglioria futura:* calcolare gli `rgba` dall'hex.

---

## 6. Backend e push (segnaposto)

Restano i segnaposto finché il cliente non ha un suo Supabase:
- `__SUPABASE_URL__`, `__SUPABASE_ANON_KEY__` in `core/core.js` (riga BACKEND).
- `__VAPID_PUBLIC_KEY__` (push) idem.

Vanno compilati a parte (creazione progetto Supabase del cliente) → annotare in `CONSEGNA.md` come TODO.
Finché sono segnaposto, l'app **non** si collega a dati reali (coerente con la regola "solo struttura").

---

## 7. Moduli "in arrivo" eventualmente scelti

Se `moduli_extra` contiene un id in `MANIFEST.inArrivo` (es. `prenota`, `fatture`): **non** assemblarlo
(non esiste ancora). Elencalo in `CONSEGNA.md` sotto *"Promessi — da costruire"*.

---

## 8. CONSEGNA.md per il cliente

Scrivi `clienti/<slug>/CONSEGNA.md` con: azienda, slug, accento, moduli inclusi, moduli promessi,
e i TODO aperti (Supabase, VAPID, logo). È il riepilogo di cosa è stato consegnato e cosa manca.

---

## 9. Verifica e messa online

- **Verifica locale**: `python3 -m http.server 8000` → apri `/clienti/<slug>/app.html`. Controlla che
  il menù mostri solo i moduli giusti e che la console non abbia `render… is not a function`.
- **Online**: `git add -A && git commit -m "Cliente <slug>: app assemblata" && git push`
  → live su `https://lollyber.github.io/modula/clienti/<slug>/app.html`.

---

## Esempio rapido

Config: `azienda:"Rossi S.r.l."`, `accento:"#6EE7B7"`, `moduli_extra:["man","zone"]`.

1. slug = `rossi-s-r-l` → `clienti/rossi-s-r-l/`
2. Copia: core + tutti i base + `man` (`modules-extra/man/man.js`) + `zone`
   (`zone.js`,`zone.css`,`zone-data.js`,`vendor/leaflet.*`).
3. `app.html`: tieni css `zone.css`+`leaflet.css` (no `macchine.css`); script `man.js`,`leaflet.js`,
   `zone-data.js`,`zone.js` (no `pellet/sites/conti/macchine`).
4. `core.js` VIEWS → `hub,cal,notes,notif,man,clients,zone,emps`; dispatcher idem.
5. BRAND.name=`Rossi S.r.l.`; `<style>:root{--cy:#6EE7B7}</style>` dopo core.css.
6. Segnaposto Supabase/VAPID restano → TODO in CONSEGNA.md.

---

## Quando passare all'opzione B (script)

Questa ricetta + il MANIFEST sono già la base per uno **script generatore** Node (`config.json` →
`clienti/<slug>/`). Conviene scriverlo quando i clienti diventano molti e i passi 2–5 si ripetono uguali.
Lo script riuserà lo stesso `MANIFEST.js` (per questo è dato/commentato e con `module.exports`).
