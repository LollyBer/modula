# MEMORIA — il Convertitore

Quaderno append-only. **Prima** di convertire lo leggo; **dopo** ci scrivo il tracciato del gestionale.

## Regole di partenza
- Fonte di verità dello schema = `const MAPS={…}` in `core/core.js`. La skill `importa-dati` la rispetta.
- Entità Modula importabili: **clients · pellet · maintenances · appointments**.
- Importa solo le entità dei moduli che il cliente ha attivato (guarda la sua `app.html`).
- Nomi cliente: ragioni sociali tutte in `lastName`. Indirizzo spezzato in street/streetNo/cap/town.
- Date sempre ISO; mai inventare campi mancanti.
- GDPR: file reali solo in locale; mai nel repo pubblico.

## Tracciati gestionali mappati (cresce ad ogni gestionale nuovo)
<!-- formato:
### <Nome gestionale> [AAAA-MM-GG]
- entità: <quali fogli/file>
- colonne → campi Modula: "Cognome/Ragione sociale" → lastName · "Indirizzo" → street+streetNo · ...
- trabocchetti: <es. date in formato US, importi con virgola, ...>
-->
_(ancora vuoto — il primo tracciato arriva col primo cliente che migra da un altro gestionale)_

## Apprendimenti vari
_(ancora vuoto)_
