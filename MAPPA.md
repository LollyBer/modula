# Mappa progetto Modula — fonte per rigenerare il widget

Questa è la **mappa concettuale interattiva** del progetto Modula, da mostrare come widget in chat
(tool `show_widget` di visualize). L'utente la tiene fissata in una chat dedicata.

**Come rigenerarla:** quando l'utente la chiede ("rigenera/aggiorna la mappa"), aggiornare i DATI qui sotto
allo stato corrente del progetto e ri-emettere il widget con `show_widget` (title: `mappa_progetto_modula`).
Vincoli widget visualize: niente emoji (icone Tabler `ti-*`), niente `position:fixed`, colori via CSS vars
del host, font-weight 400/500, contenitore 680px. Vedi codice in fondo.

## DATI (aggiornare a ogni avanzamento)

Hub centrale: **Modula** — "gestionali su misura".

Base URL live: `https://lollyber.github.io/modula`

### Sezioni (rami dall'hub)
**Sito & vendita**
- Landing — "Vetrina pubblica di Modula" — stato: online — `/` (mostra SOLO i moduli pronti)
- Configuratore — "Il cliente compone la sua app" — stato: online — `/configuratore/`
  (mostra SOLO i moduli `pronto`; gli `arrivo` sono nascosti finché non si costruiscono; card "richiesta modulo su misura" per chiedere ciò che non c'è)

**App del cliente**
- App personalizzata — "Il gestionale interno" — stato: template — `/app.html`
- Guida cliente — "Manuale d'uso brandizzato, assemblato dai moduli del cliente (pagina + PDF)" — stato: scheletro (2 capitoli pilota) — `/guida/`
- Portale clienti — "I clienti finali prenotano" — stato: online — `/portale/`
- Mini sito azienda — "Vetrina pubblica del cliente" — stato: scheletro — `/mini-sito/`

**Fabbrica (qui su Claude)**
- Fabbrica Modula — "Banco di regia INTERNO, gira su Claude" — stato: operativa — `/FABBRICA/` (NON online)
  - **fuori dall'online**: esclusa da GitHub Pages via `_config.yml` (resta nel repo, versionata); pubblico = solo landing/configuratore/portale/app cliente
  - **si apre come widget interattivo su Claude**: `FABBRICA/regia.widget.html` (incolli config → smistamento → "Avvia in Fabbrica" via sendPrompt → Claude esegue la catena)
  - **flusso ordine:** config → 🧭 Dirigenza smista → 🛠 Assemblaggio (moduli pronti) + 🧪 Laboratorio (da creare) → app → 🔄 Conversione dati (opz.)
  - 4 reparti, ognuno con un agente (subagent reale in `.claude/agents/`) che si auto-migliora (quaderno MEMORIA + metriche in `FABBRICA/agenti/<id>/`): Direzione (il Direttore, entrata), Assemblaggio (l'Assemblatore), Laboratorio (l'Inventore), Conversione (il Convertitore)
  - import dati: skill `importa-dati` (adattata da ptek) → file `modula-import.json`; core.js accetta modula-import e il vecchio ptek-import
  - **modalità DEMO**: ogni app assemblata, finché Supabase è segnaposto, parte con dati di esempio navigabile (vetrina) → core.js
  - trigger operativo: «creiamo l'app per X» → apro `clienti/<slug>/ORDINE.md` + regia + eseguo la catena
  - output app cliente in `/clienti/<slug>/` (online sotto /modula/clienti/); demo: `clienti/demo-impianti-verdi/`

### Resoconto
Fatto: landing+effetti · hosting GitHub Pages · brand "Modula" · configuratore · portale · mini-sito ·
Fabbrica a 4 reparti con agenti auto-miglioranti (subagent reali) · orchestrazione Dirigenza · reparto
Conversione (skill importa-dati) · modalità demo/vetrina nelle app · Fabbrica resa interna (widget regia su Claude).
Prossimo: simulare/assemblare clienti veri dalla regia · costruire i 7 moduli trasversali del catalogo
(`interventi`·`contratti-man`·`scadenziario`·`impianti`·`mezzi`·`preventivi`·`ricorrenze`) in Laboratorio.
Rimandato: dominio personalizzato · generatore in-browser (scartato: tutto su Claude).

### Nuovi arrivi (ago 2026)
Migrazione backend+hosting su account propri (Supabase `yohtthmcjqwlxoihvcrt` + repo `LollyBer/modula`,
live `lollyber.github.io/modula`) · **18 moduli** · nuovi moduli: **Lavagna** (dashboard a tela libera),
**Rapportini** di cantiere (foto+promemoria), **Fatture** (QR-fattura svizzera → Conti), **Documenti**
(archivio fatture fornitori/scadenze, senza IA) · voci calendario configurabili · gating `moduleActive`
ovunque · ricerca cliente per nome in tutti i moduli · "Fattura questo cantiere" (cantiere→bozza fattura).
Prima (giu-lug): catalogo settori→moduli · richiesta modulo su misura · landing solo moduli pronti · Fabbrica.
2026-08-26: modulo FISSO **Impostazioni** (ordine moduli per-utente + account + preferenze + promemoria +
strumenti titolare; consolida la sidebar) · **Promemoria appuntamenti** push con scope per ruolo (Edge Function
`reminders` + pg_cron, da deployare) · **prezzo abbonamento corretto** dai moduli in Regia · fix calendario
desktop (mese intero a schermo) · calendario viste **Giorno/Settimana** + campo **Luogo** + **orario fine/eventi
multi-giorno** (fix salvataggio promemoria) · **Lavagna** con aspetto ardesia+cornice. ⚠️ richiede `schema.sql`.
2026-08-27: nuovo modulo **Da fare** (todo, liste+scadenze→calendario) · **promemoria in-app** X min prima ·
Lavagna **per-utente** · **Mappa** rework + **punti salvati** (magazzino/ufficio) · Pellet **prenotato** + bancali ·
Rapportini **multi-operaio** + **riepilogo cantiere** stampabile · **negozio moduli** col prezzo in-app ·
Conti **anti-doppioni** · nome utente non modificabile · audit multi-agente + ~20 fix. ⚠️ richiede `schema.sql`.
2026-08-27 (2ª sessione): audit 4-agenti + 11 fix di consistenza (privacy note nel calendario, quick-add
campi per tipo voce, gating Zone, clientRaw appuntamenti, Macchine fuori dal negozio moduli, cantieri
**Previsto** visibili + inizio sul calendario, filtri per assegnatario) · permessi **Conti/Fatture delegabili** ·
**Da fatturare**: manutenzioni fatte / cantieri da_fatturare / consegne pellet compaiono in una sezione nel
modulo **Fatture** (raggruppate per cliente, "Crea fattura"; legame via ref sulle righe, nessun cambio schema) ·
**Documenti** rifatto: da "fatture fornitori con importi" a **archivio documenti aziendali** (barra di ricerca +
cartelle per categoria, niente importi/pagamenti; riusa le colonne esistenti, nessun cambio schema).
2026-09-01: **audit completo** (AUDIT.md/PIANO.md) + **"sistema tutto"** ~16 fix (Conti = incassi netti sempre,
numerazione fatture con reset anno + univocità, delete fattura libera i lavori, storico cliente cliccabile,
"✓ Fatta oggi", pellet bancali/consegnato, Lavagna salva anche i non-titolari, ecc.) · **backup reso completo
(lossless)** · **archiviazione fatture** · registro Fatture "da fatturare/fatturato" · **personalizzazione**
(7 sfondi + 6 colori) · hardening **sicurezza+GitHub** (secret scanning, push protection, Dependabot, SECURITY.md).
⚠️ richiede `schema.sql` (colonne `invoiced` su manut/cantieri/pellet + `archived` su fatture).
2026-09-02: **NUOVO modulo Sopralluoghi** (`surveys`, **19 moduli**) — pipeline commerciale (da valutare →
da preventivare → preventivo inviato → vinto/perso), clienti dell'anagrafica **o potenziali** (nome/telefono
liberi), foto sul posto, promemoria + calendario, storico cliente; da "vinto" → **trasforma in cantiere**
(se potenziale, chiede prima di aggiungere il cliente). · **Foto "📷 Scatta / 🖼 Galleria" ovunque**
(Cantieri, Cliente, Rapportini, Documenti) e **aggiunte alle Manutenzioni** (nuovo). ⚠️ richiede `schema.sql`
(tabella `surveys` + colonna `maintenances.photos`). · **"Trasforma in…" dal calendario**: da un appuntamento/nota,
un tocco crea il lavoro collegato (manutenzione/sopralluogo/cantiere/consegna) ereditando cliente/luogo/data;
meccanismo a **registro auto-estensibile** (`registerEventTarget`) → i moduli nuovi si aggiungono da soli.

## Stati → colori pill
online/pronto/template = success (verde) · scheletro = warning (ambra) · da fare/da strutturare = neutro.

---

## CODICE WIDGET (snapshot — ri-emettere via show_widget, aggiornando i dati sopra)

Il codice completo del widget è quello usato nella sessione del 2026-06-22 (chat dedicata).
Struttura: hub Modula centrato → SVG che disegna frecce verso 3 colonne (`[data-branch]`) →
card-link per ogni sezione (`.mk-node`, aprono gli URL live) → due pannelli "Resoconto" e
"Nuovi arrivi" → legenda stati. Connettori disegnati in JS da `#mk-map`/`#mk-svg` con ResizeObserver.
Per rigenerare: ricostruire l'HTML dai DATI qui sopra seguendo questa struttura.
