# Mappa progetto Modula — fonte per rigenerare il widget

Questa è la **mappa concettuale interattiva** del progetto Modula, da mostrare come widget in chat
(tool `show_widget` di visualize). L'utente la tiene fissata in una chat dedicata.

**Come rigenerarla:** quando l'utente la chiede ("rigenera/aggiorna la mappa"), aggiornare i DATI qui sotto
allo stato corrente del progetto e ri-emettere il widget con `show_widget` (title: `mappa_progetto_modula`).
Vincoli widget visualize: niente emoji (icone Tabler `ti-*`), niente `position:fixed`, colori via CSS vars
del host, font-weight 400/500, contenitore 680px. Vedi codice in fondo.

## DATI (aggiornare a ogni avanzamento)

Hub centrale: **Modula** — "gestionali su misura".

Base URL live: `https://yfy8b8j9jj-lgtm.github.io/modula`

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

### Nuovi arrivi
Catalogo settori→moduli su misura spuntabile (`FABBRICA/SETTORI-MODULI.md`, 15 settori) · richiesta modulo
su misura nel configuratore · landing/configuratore mostrano solo i moduli pronti · widget regia Fabbrica ·
modalità demo nelle app cliente · reparto Conversione.

## Stati → colori pill
online/pronto/template = success (verde) · scheletro = warning (ambra) · da fare/da strutturare = neutro.

---

## CODICE WIDGET (snapshot — ri-emettere via show_widget, aggiornando i dati sopra)

Il codice completo del widget è quello usato nella sessione del 2026-06-22 (chat dedicata).
Struttura: hub Modula centrato → SVG che disegna frecce verso 3 colonne (`[data-branch]`) →
card-link per ogni sezione (`.mk-node`, aprono gli URL live) → due pannelli "Resoconto" e
"Nuovi arrivi" → legenda stati. Connettori disegnati in JS da `#mk-map`/`#mk-svg` con ResizeObserver.
Per rigenerare: ricostruire l'HTML dai DATI qui sopra seguendo questa struttura.
