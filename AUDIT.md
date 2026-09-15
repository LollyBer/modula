# AUDIT — Modula

Audit completo sul working tree (con le modifiche non ancora pubblicate di questa sessione).
Metodo: mappatura + analisi statica (4 agenti su tutti i moduli) + test runtime in demo (flusso fatture end-to-end, conti, backup, round-trip dati). Zero errori console reali (i 2 osservati sono artefatti dei test di import in demo, dove non c'è backend).

Legenda gravità: 🔴 Alta · 🟠 Media · 🟡 Bassa.

> **Aggiornamento — "sistema tutto":** risolti e testati B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B19, B20, B21, B22 + i 3 top time-saver + backup lossless + archiviazione fatture. Restano aperti (strutturali/futuri): B23 riconciliazione ore, search senza re-render, B16-B18 (igiene), IT/CH, export file, invio fattura. Le modifiche sono nel working tree, non ancora pubblicate (schema `invoiced`/`archived` già eseguito).

---

## 1. Stato dei moduli

| Modulo | Stato | Note |
|---|---|---|
| Hub / quick-add | ✅ OK | Smistatore free-text ottimo; unico flusso "1 click" della app |
| Calendario | 🟠 da rivedere | header Mese si disallinea dalla navigazione Giorno/Settimana |
| Note & Appuntamenti | 🟠 da rivedere | perde il nome cliente digitato non in anagrafica; FAB "appuntamento" apre il quick-add generico |
| Da fare (todo) | ✅ OK | vicino al minimo |
| Notifiche / Chat | ✅ OK | inbox + azioni rapide corrette |
| Manutenzioni | 🟠 da rivedere | ricorrenza da bollettino perde `type` → 0 in Conti; nessun campo prezzo |
| Pellet / Consegne | 🟠 da rivedere | `bancali`/`kg` senza prezzo auto → 0; "✓ Consegnato" non mette data/prezzo |
| Cantieri | ✅ OK | ore = diario + rapportini (rischio doppio conteggio stesso giorno) |
| Rapportini | ✅ OK | campi start/end mai usati (colonne morte) |
| Fatture / Registro | 🟠 da rivedere | numerazione con buchi/possibili doppioni; nessun reset anno; delete lascia lavori "fatturati" orfani |
| Documenti | ✅ OK | rifatto: archivio, ricerca full-text (anche PDF), gruppi, "da sistemare", versioni, scadenze |
| Conti | 🔴 da rivedere | con Fatture attivo conta solo le fatture pagate in-app → **azzera gli incassi se fatturi fuori (Profix)**; lordo vs netto (IVA) |
| Clienti | 🟠 da rivedere | storico non cliccabile (dead-end); `openClientGeo` non gated |
| Personale / Presenze | ✅ OK | timbratura 1-tap ottima; 3 flussi ore che non si riconciliano |
| Zone / Mappa | ✅ OK | — |
| Lavagna | 🟠 da rivedere | le modifiche dei **non-titolari non si salvano** (settings sync solo per il titolare) |
| Impostazioni | ✅ OK | +sezione Aspetto (sfondi/colori) aggiunta questa sessione |
| Macchine (bespoke ptek) | ✅ OK | correttamente escluso dagli altri tenant |
| Backup / Import | ✅ OK (**risolto oggi**) | prima l'import perdeva 7 collezioni; ora è completo e lossless |

---

## 2. Bug trovati

### 🔴 Alta
**B1 — Conti azzera gli incassi se fatturi fuori dall'app (il tuo caso: Profix).** `modules-extra/conti/conti.js:40-44`.
Con il modulo Fatture attivo, `entrate = solo fatture pagate create in-app`; pellet/manutenzioni/cantieri **non** vengono contati. Riproduzione (verificata a runtime): attiva Fatture, non creare fatture in-app → Conti mostra Entrate = 0 anche con lavori consegnati/fatti. Il gate dovrebbe essere "il tenant emette davvero fatture in-app?", non "il modulo è presente".

### 🟠 Media
**B2 — Entrate lorde vs nette (IVA).** `conti.js` + `fatture.js:11`. Le fatture entrano IVA inclusa (`invTotal`), pellet/cantieri sono netti → accendere Fatture gonfia l'utile dell'IVA (verificato: stesso lavoro = 1081 con Fatture vs 3800 senza, per l'IVA + il fatto che solo la fattura è contata).

**B3 — Numeri fattura non univoci.** `fatture.js:180,187` + `supabase/schema.sql` (`invoices.number` senza vincolo unique). Il campo N. è editabile mentre il contatore avanza comunque; due dispositivi leggono lo stesso `nextNumber`; nessun vincolo DB. Possibili numeri duplicati.

**B4 — Cambio anno: nessun reset del contatore; cancellazione lascia un buco.** `fatture.js:124`. Contatore unico + prefisso a mano. Verificato: cambiando prefisso a `2027-` la prossima è `2027-0003` (non 0001); cancellando una fattura il contatore non torna indietro (numero saltato). Coerenza fiscale a rischio.

**B5 — Cancellare una fattura lascia i lavori bloccati su "fatturato".** `fatture.js:195` (`delInvoice`). `saveInvoice` mette `invoiced=true` sui lavori collegati, ma `delInvoice` non lo azzera → il lavoro sparisce da "Da fatturare" e nessuna fattura lo referenzia più: perso dal flusso. Stesso effetto togliendo una riga con `ref` da una fattura.

**B6 — Ricorrenza da bollettino perde il `type` → 0 in Conti.** `man.js:279` (manca `type`, presente invece in `saveMan:175`). La manutenzione dell'anno dopo ha `type=null` → `maintIncome` → `maintPrice(null)=null` → `m.price` (0). Completa la stessa manutenzione da "Avvia → bollettino" e la prossima conta 0.

**B7 — "✓ Consegnato" non mette data/prezzo → consegna invisibile.** `pellet.js:248` (`togglePel`). A differenza di `saveBolla`, non fa `if(!p.date)p.date=oggi` né `autoPrice`. Una consegna senza data/prezzo segnata consegnata sparisce da incassi e dashboard.

**B8 — `autoPrice` ignora `bancali` e `kg` → prezzo null → contato 0.** `pellet.js:228-233`. `bancali` è ricavabile (`qty × bagsPerPallet × pricePerBag`). Sottostima recuperabile.

**B9 — Le modifiche Lavagna dei non-titolari non si salvano.** `lavagna.js` (setBoard/lavSavePostit) + `core.js:201` (`syncNow` scrive settings solo `if(isOwner())`). Un dipendente aggiunge un post-it → al reload (o a un realtime) sparisce. La feature è editabile dai non-titolari ma la persistenza li scarta in silenzio.

**B10 — `openClientGeo` non gated.** `clients.js:103`. Il bottone 🎯 Posizione (modulo Zone) compare anche ai tenant senza Zone, mentre il vicino 📍 Mappa è gated. Perdita di una funzione a pagamento.

**B11 — Storico cliente non cliccabile (dead-end).** `clients.js:88-92`. Nella scheda cliente man/pellet/cantieri/appuntamenti/note sono testo non tappabile; per aprirli devi uscire e usare la ricerca globale. (Vedi anche attriti §3.)

### 🟡 Bassa
- **B12** — Totali sacchi 12m ignorano le consegne in `kg`. `pellet.js:35`.
- **B13** — Manutenzione senza tipo → 0 incasso senza segnale. `conti.js:29`.
- **B14** — Prezzo pellet `0` volontario viene sovrascritto dall'auto. `pellet.js:238/290`.
- **B15** — Fattura stampata: Imponibile+IVA può non fare il Totale (arrotondamento 5 cent). `fatture.js:298`.
- **B16** — `addDaysIso` usato da fatture ma definito in `pellet.js:6` (dipendenza incrociata fragile). `fatture.js:128`.
- **B17** — `invTotHTML` muta `invDraft.vatRate` come effetto collaterale del render. `fatture.js:170`.
- **B18** — Note scartano il nome cliente digitato non in anagrafica (niente `clientRaw`). `notes.js:78,97`.
- **B19** — Ordinamento appuntamenti si rompe con data nulla. `notes.js:8`.
- **B20** — Header mese calendario si disallinea dalla navigazione giorno/settimana. `cal.js:10` vs `20/54`.
- **B21** — Promuovere a titolare sovrascrive i permessi con lista fissa incompleta (manca todo/conti/fatture/documenti/...). `emps.js:580`.
- **B22** — Fattura a totale 0 salvabile senza avviso. `fatture.js` (verificato a runtime).
- **B23** — `siteHours` somma diario **e** rapportini: stesso giorno loggato due volte = ore gonfiate. `sites.js:6`.
- **B24** — Tecnico sul bollettino default `S.speaker`/'me' → `eName` vuoto in stampa. `man.js:296,348`.

### Codice morto / duplicato
- `quickAdd` const mai chiamata — `emps.js:41`.
- `sigDrawn` scritto e mai letto — `man.js`.
- `updClientPrev` definita e mai chiamata — `core.js:327`.
- `_new:true` sulle fatture: mai letto — `fatture.js:128`.
- Firma (pad) duplicata man vs pellet; template di stampa bollettino vs bolla duplicati.
- Upsert timbrature duplicato 3× — `emps.js:37,110,209`.
- `MAINT_KINDS`/`MAINT_ICONS` di proprietà di `conti.js` ma usati da `man.js` (accoppiamento).
- Colonne `reports.start_t/end_t` mai valorizzate; `settings.board` legacy (solo migrazione).

---

## 3. Attriti d'uso (passi attuali → proponibili)

| Operazione | Oggi | Ideale | Cosa tagliare |
|---|---|---|---|
| Aprire un lavoro dalla scheda cliente | esci + ricerca globale (≈4 tap) | 1 tap sulla riga | rendere cliccabile lo storico (`clients.js:88-92`) |
| Arrivare a Clienti / Conti | 2 tap (dietro ☰) | 1 tap | metterli nella barra in basso (`NAV_DEFAULT`, `core.js:618`) |
| Manutenzione "fatta oggi" | ~6 tap (data chip + stato seg) | 1 tap "✓ Fatta oggi" | + keyword "fatta" nel parser (`commitParsed:510`) |
| Nuovo cliente | form 13 campi (solo nome obbligatorio) | nome + tel | collassare macchina/pellet/manut. sotto "più dettagli" (`clients.js:120-123`) |
| Consegna già fatta | salva → riapri → "✓ Consegnato" (~7 tap) | "Salva come consegnato" nel form nuovo | `pellet.js:217` |
| Stampa fattura nuova | salva → riapri → Stampa (2 tap extra) | "🖨 Stampa ora" dopo il salvataggio | `fatture.js:155/187` |
| Assegnatario su manut/pellet/note | selezione ogni volta (parte vuota) | default = utente corrente | `empSeg`, `core.js:1310` |
| Cliente da record `clientRaw` | ridigiti il nome quando lo crei | bottone "crea cliente da questo nome" in openMan/openPel/openSite | — |
| Cercare in liste lunghe | `render()` a ogni tasto (lag) | aggiornare solo la lista | `cliSearchInput` `clients.js:61`, `docSearchInput` `documenti.js:136` |

Altri: FAB "appuntamento" apre il quick-add generico (può scegliere Manutenzione ecc.); ore loggabili in 3 sistemi che non si riconciliano (diario/presenze/rapportini); `lavDel` chiede conferma anche per un post-it.

---

## 4. Rischi sui dati

- **Backup/Import (RISOLTO oggi).** Prima l'import reimportava solo 11 collezioni → su restore perdevi **fatture, documenti, da-fare, rapportini, spese, ore, listino** e quasi tutte le impostazioni. Ora è completo, con remap di id e chiavi esterne e senza duplicare il titolare. Verificato round-trip di tutte le 16 collezioni + link.
- **File non nel backup .json.** Foto/PDF/allegati vivono solo nello Storage Supabase (il .json ne tiene i riferimenti). Se un giorno cambi progetto Supabase, i file non seguono il .json. → serve un export file separato (futuro).
- **Numerazione fatture (B3/B4/B5).** Buchi, possibili doppioni e lavori orfani dopo cancellazione: rischio di incoerenza contabile.
- **Persistenza non-titolari (B9 + note RLS).** Lavagna sicuramente non salva per i non-titolari; da confermare via policy RLS se anche `notes`/`note_groups` dei non-titolari passano.
- **Conti fuorviante (B1/B2).** Non è perdita di dato ma di *verità*: l'utile mostrato può essere 0 o gonfiato dell'IVA a seconda di come fatturi.

---

## 5. Fatto in questa sessione (già risolto / aggiunto)

- **11 fix di consistenza** (privacy note nel calendario, quick-add campi per tipo, gating Zone, clientRaw appuntamenti, Macchine fuori dal negozio, cantieri "Previsto" + inizio sul calendario, filtri per assegnatario, default promemoria, contatore/news landing).
- **Permessi Conti/Fatture delegabili** (non più solo-titolare).
- **Registro Fatture**: schede Da fatturare / Fatturati / Fatture, tasto "✓ Fatturato" per riga, click sul lavoro → apre la sua scheda, flag `invoiced` persistente.
- **Documenti rifatto**: archivio con ricerca full-text (anche dentro i PDF), gruppi, vassoio "Da sistemare", auto-riconoscimento (nome file + contenuto), versioni, tag, vista per mese, sezioni nella scheda cliente/cantiere, promemoria scadenze nel calendario.
- **Personalizzazione**: 7 sfondi + 6 colori (Impostazioni → Aspetto).
- **Backup lossless** (fix di oggi, priorità dati).
- **Archiviazione fatture create** (fix di oggi): click sulla fattura → 🗄 Archivia / ↩ Ripristina; tab Archivio.

> Le modifiche di questa sessione sono nel working tree, **non ancora pubblicate**. Lo schema `invoiced`/`archived` è già stato eseguito su Supabase.
