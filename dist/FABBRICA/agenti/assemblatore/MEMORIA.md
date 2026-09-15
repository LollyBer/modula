# MEMORIA — l'Assemblatore

Quaderno append-only. **Prima** di assemblare lo leggo; **dopo** ci scrivo cosa ho imparato.

## Regole di partenza (bundle consigliati per settore — dai SETTORI del catalogo)
Sono suggerimenti di default: il cliente può sempre cambiare. Servono a proporre in fretta.
- **impianti** → man · macchine · sites · pellet · zone · conti · fatture
- **edilizia** → sites · man · documenti · fatture · conti
- **ristorazione** → prenota · magazzino · fidelity · conti
- **retail** → catalogo · magazzino · fidelity · conti
- **beauty** → prenota · fidelity · conti
- **altro** → conti · fatture

## Regole tecniche fisse (dal MANIFEST)
- `macchine` e `zone` hanno file in **root**, non in `modules-extra/`.
- `zone` dipende da **Leaflet** (`vendor/leaflet.*`); ordine js: leaflet → zone-data → zone.
- `notif` c'è **sempre** (non è nel catalogo).
- Moduli `inArrivo` scelti → NON assemblare, segnare come *promessi* (li costruisce l'Inventore).
- Accento = override `--cy`; i glow rgba() fissi in core.css non lo seguono (limite noto v1).

## Apprendimenti (cresce ad ogni cliente)
<!-- formato: - [AAAA-MM-GG · cliente <slug>] cosa ho imparato -->
- [2026-06-22 · cliente demo-impianti-verdi] Primo assemblaggio end-to-end riuscito. Validato l'intero flusso RICETTA su Claude.
- [2026-06-22 · cliente demo-impianti-verdi] **Verifica coerenza affidabile senza aprire il browser**: i `render*` dei moduli sono assegnati a `window.renderX` a runtime, quindi `grep "window.render"` da solo non li trova tutti. Meglio verificare con un loop che cerca ogni funzione del dispatcher tra TUTTI i file caricati (`function fn`/`fn=`/`window.fn`), e un `node --check core/core.js` per la sintassi. Aggiungere un loop che fa `curl` su ogni `src`/`href` relativo di app.html quando c'è un preview server → conferma zero 404.
- [2026-06-22 · cliente demo-impianti-verdi] **`man` non ha css** (la sua voce in MANIFEST ha `css:[]`): nel template app.html NON c'è `man.css`, quindi nessun link da rimuovere/aggiungere. Stesso per conti. Solo `macchine`/`zone`/`leaflet` hanno css extra.
- [2026-06-22 · cliente demo-impianti-verdi] Il template app.html di partenza include già pellet+sites+conti+macchine+zone negli script: ricordarsi di rimuovere TUTTI quelli non scelti (qui pellet, sites, macchine), non solo macchine.css. Tenuti: man, conti, zone(leaflet→zone-data→zone).
- [2026-06-22 · cliente demo-impianti-verdi] Settore `impianti` → uso il nome settore come `BRAND.tagline` (es. 'Impianti'): tocco gratis che personalizza il login senza dati reali.
