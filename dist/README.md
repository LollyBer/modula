# Modula — gestionali su misura

Sito vetrina + configuratore per **Modula** (nome provvisorio): app gestionali modulari su misura per piccole aziende italiane.

## Struttura

- **`/landing/`** — sito vetrina dark premium (homepage del sito)
- **`/configuratore/`** — web app a 4 step per comporre la propria app e inviare la configurazione
- **`/core/`, `/modules-base/`, `/modules-extra/`** — app gestionale modulare (template, senza dati reali)
- **`app.html`** — entry point dell'app gestionale template
- **`index.html`** — redirect alla landing

## Online

Pubblicato con GitHub Pages. L'URL principale apre la landing; il configuratore è raggiungibile da lì.

## Sviluppo locale

```bash
python3 -m http.server 8000
```

Poi apri <http://localhost:8000/> (landing) o <http://localhost:8000/configuratore/>.

## Configuratore rinnovato — 15 settembre 2026

La copia locale usa `configuratore/studio.css`: identità antracite/corallo della landing, navigazione dei quattro passaggi, prezzo indicativo aggiornato durante la scelta e demo reale dei moduli base dentro un monitor ingrandibile. Le nuove stringhe sono in `configuratore/studio-translations.js`, con italiano, inglese, tedesco e francese; la demo dell’app rimane in italiano.

Le formule restano CHF 59 + CHF 10 per extra, con tetto CHF 129 dal settimo extra, oppure licenza indicativa da CHF 6’000 / CHF 7’000. Il pulsante finale prepara una mail nel programma di posta del visitatore: non invia automaticamente e non crea account. L’anteprima non modifica nome, colori o moduli dell’app reale in base alla richiesta.

Verificati i quattro passaggi, conservazione delle selezioni, quattro lingue, tre formule, demo ingrandita e layout da 320 a 1920 px. Nessuna pubblicazione e nessuna modifica al sito originale.
