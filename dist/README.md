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
