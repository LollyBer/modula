# FABBRICA Modula — LABORATORIO (reparto moduli nuovi)

Manuale del reparto che **costruisce i moduli "in arrivo"** e li promuove a `pronto`.
Agente: **l'Inventore** (`fabbrica-inventore`). Mappa file: [MANIFEST.js](MANIFEST.js).

> ⚠️ Regola: qui si lavora SOLO su struttura. Mai dati reali, mai toccare `cay work` (ptek reale)
> se non in lettura per estrarne la *forma*. PII vera → skill `dati-sensibili` + `owasp-security-review`.

---

## Trigger: "apri laboratorio"

Quando Loris dice **"apri laboratorio"** (con o senza un modulo), entro in **modalità build-ready**:

1. **Leggo** [`agenti/inventore/MEMORIA.md`](agenti/inventore/MEMORIA.md) (ricette già scritte da riusare)
   e `MANIFEST.inArrivo` (la coda: `prenota · magazzino · catalogo · fatture · documenti · report · fidelity · turni`).
   **E leggo il catalogo [`SETTORI-MODULI.md`](SETTORI-MODULI.md):** se Loris chiede *"cosa facciamo"*,
   propongo dai **7 moduli ♻️ trasversali** in cima (sbloccano più settori) prima dei moduli mono-settore.
2. **Carico in testa** il **Contratto Modulo** qui sotto + lo scheletro [`TEMPLATE-modulo.js`](TEMPLATE-modulo.js).
3. Se Loris ha **nominato un modulo** → lo costruisco seguendo il Contratto (tutti gli agganci obbligatori).
   Se **non** l'ha nominato → mostro la coda e chiedo quale, oppure propongo il più richiesto dal catalogo.
4. A fine modulo eseguo il **QA** e la **promozione** (sezione finale), poi scrivo la ricetta in MEMORIA.

L'obiettivo: **non reinventare la ruota** ogni volta. Ogni modulo nasce già agganciato a Hub, agli altri
moduli e alla memoria/persistenza — sono requisiti, non optional.

---

## CONTRATTO MODULO — le regole base di OGNI modulo nuovo

Un modulo è "a norma" solo se soddisfa **tutti e sei** gli agganci. (`<id>` = id kebab, es. `prenota`;
`<Nome>` = PascalCase, es. `Prenota`.)

### A · Identità & registrazione (l'id combacia OVUNQUE)
Lo stesso `<id>` deve comparire identico in **tutti** questi punti, o il menù si rompe:
- `function render<Nome>(){ … }` **globale**, dipinge in `$('#main')` — niente ES module.
- voce in `VIEWS` di [core/core.js](../core/core.js) (ancora `const VIEWS=[`): `{id:'<id>',ic:'…',label:'…'}`.
- coppia nel **dispatcher** `R={…}` dentro `render()` (core.js): `<id>:window.render<Nome>`.
- riga in `MANIFEST.extra` (e **togli** l'id da `inArrivo`).
- `stato:'pronto'` in [configuratore/catalogo.js](../configuratore/catalogo.js).
- `<script src="…">` in [app.html](../app.html) **dopo** il core (sezione `<!-- moduli EXTRA -->`).
- L'`<id>` è anche il **permesso**: la visibilità nel menù passa da `can('<id>')` (vedi `renderNav`).

### B · Aggancio all'HUB (SEMPRE)
Ogni modulo **emerge in homepage**. Si fa con una funzione card + una guard nell'Hub:
- Nel modulo esponi `function <id>HubCardHTML(){ return '<div class="card">…</div>'; }` — un riassunto
  (conteggi, prossime voci) con header cliccabile `onclick="nav('<id>')"` per saltare al modulo.
- In [modules-base/hub/hub.js](../modules-base/hub/hub.js), dentro `renderHub`, aggiungi la riga guard
  accanto a quella di `zone` (modello già presente):
  ```js
  ${typeof <id>HubCardHTML==='function'?<id>HubCardHTML():''}
  ```
  La typeof-guard fa sì che l'Hub non si rompa nelle app dove quel modulo non è incluso.

### C · Aggancio agli ALTRI moduli (cross-link, niente isole)
- Clienti/dipendenti si referenziano per **id** + helper del core: `cName(id)`, `eName(id)`, `byId(arr,id)`
  (mai stringhe libere; al massimo un campo `…Raw` di fallback come fanno `man`/`sites`).
- Per saltare altrove: `nav('clients')`, `nav('cal')`, `openSite(id)`, ecc.
- (Opzionale, avanzato) far instradare l'**Hub-input** verso il nuovo tipo: aggiungere il tipo in
  `TYPE_META` + `parseInput`/`commitParsed` nel core. Solo se ha senso scriverlo a linguaggio naturale.

### D · Memoria / persistenza (lo "stato" S → Supabase)
Se il modulo ha dati propri (quasi sempre):
- aggiungi l'array in `blank()` (oggetto `S`) in core.js.
- blocco in `MAPS`: `toDb` (camelCase→**snake_case** per il db) e `fromDb` (inverso).
- l'id-tabella in `TBL`, e l'array in `UP_ORDER` **e** `DEL_ORDER`
  (ordine FK-safe: **padri prima** in UP, **figli prima** in DEL).
- caricamento in `loadAll()` e serializzazione in `dbRows()`.
- chiama **`save()`** dopo ogni mutazione → sync automatico (debounced 300ms).
  In **DEMO** `save()` è no-op: i dati restano in memoria pagina (giusto così per la vetrina).
- `localStorage` SOLO per preferenze di dispositivo (tema, nav). **Mai** dati di business lì.
- aggiungi 2-3 record finti in `demoBoot()` così il modulo è navigabile in modalità demo.

> Una tabella nuova nel db richiede anche la **migration SQL + RLS** lato Supabase del cliente:
> annotala come TODO in `CONSEGNA.md` (non si tocca in fase template). RLS → skill `dati-sensibili`.

### E · Brand / tema / sicurezza
- Colori via **CSS var** (`--cy` accento, `--t2`, `--coral`, `--teal`, …). Niente hex fissi nuovi
  (così l'accento del cliente, iniettato come `:root{--cy:…}`, si propaga).
- **`esc()` su OGNI testo utente** dentro i template literal (XSS). Coerente con `owasp-security-review`.
- Solo struttura + segnaposto: nessun dato reale nel template.
- Funzioni globali, caricate dopo il core; riusa gli helper (`$`, `esc`, `save`, `openSheet`, `toast`, `uid`, `byId`).

### F · QA + promozione a `pronto`
Prima di dire "fatto":
- il menù mostra il modulo; la console **non** ha `render… is not a function`;
- la **hub card** appare in homepage; la demo naviga senza errori; `save()` non rompe in demo.
- Poi: sposta l'id `inArrivo → extra` nel MANIFEST, `stato:'pronto'` nel catalogo, scrivi la **ricetta**
  in [`agenti/inventore/MEMORIA.md`](agenti/inventore/MEMORIA.md) e aggiorna `agenti/inventore/metriche.json`.

---

## Checklist rapida (incolla nel commit del modulo)

```
[ ] render<Nome>() globale, dipinge in #main
[ ] VIEWS + dispatcher R + MANIFEST.extra + catalogo stato:'pronto' + <script> in app.html
[ ] <id>HubCardHTML() + riga guard in hub.js
[ ] cross-link via cName/eName/byId/nav() — nessuna isola
[ ] stato: blank()+MAPS+TBL+UP_ORDER+DEL_ORDER+loadAll+dbRows + save() dopo le mutazioni
[ ] demoBoot(): record di esempio
[ ] esc() su ogni testo utente · colori via --cy/CSS var · zero dati reali
[ ] QA (menù, console, hub card, demo) → promozione + ricetta in MEMORIA + metriche
```
