# Modello scheda-ordine azienda

Modello copiato in `clienti/<slug>/ORDINE.md` quando si avvia un'azienda
(trigger: «creiamo l'app per <azienda>»). È il file di lavoro del cliente:
la richiesta entra qui, l'esito si aggiorna qui. Coppia con `CONSEGNA.md` (l'output).

---

# Ordine — <Azienda>

- **slug:** <slug>
- **data ordine:** <AAAA-MM-GG>
- **origine:** configuratore | a voce
- **stato:** bozza → in lavorazione → assemblata → online

## Richiesta del cliente (prompt / config)
<!-- Incolla qui la config del configuratore (anche solo la riga JSON) oppure la descrizione a parole -->
```
{ ... config ... }
```

## Smistamento (lo compila la Direzione)
- moduli **pronti** → Assemblaggio:
- moduli **da creare** → Laboratorio:
- accento:

## Esito
- cartella: `clienti/<slug>/`
- link live: `https://lollyber.github.io/modula/clienti/<slug>/app.html`
- TODO aperti: Supabase · logo · VAPID · moduli promessi
- note:
