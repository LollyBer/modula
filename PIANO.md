# PIANO — refactor Modula (ordinato per priorità)

> ## ✅ Applicato in questa sessione ("sistema tutto")
> Fatti e testati dal vivo (zero errori): **top-3** (storico cliente cliccabile · Clienti+Conti nella barra bassa · "✓ Fatta oggi" + parser "fatta") · **B1/B2** Conti = lavori netti (non più azzerati/gonfiati dall'IVA) · **B5** delete fattura libera i lavori · **B3/B4** numerazione: reset anno + numero univoco · **B6** ricorrenza copia il tipo · **B7** "✓ Consegnato" mette data/prezzo (+ "Salva consegnato" su nuova consegna) · **B8** autoPrice bancali · **B9** Lavagna salva anche per i non-titolari · **B10** geo gated a Zone · **B20** header mese segue la navigazione · **B19** ordinamento appuntamenti senza data · **B21** titolare non azzera i permessi · **B22** avviso fattura a totale 0 · **stampa dopo salvataggio**. Più (già prima) backup lossless e archiviazione fatture.
> **Restano aperti** (per scelta/complessità): riconciliazione ore (strutturale), search senza re-render, "crea cliente da nome", e i futuri (IT/CH, export file, invio fattura). Vedi sotto.


Ogni riga: **cosa** · perché (cosa ottieni) · file · impatto · tempo · rischio.
Riferimenti bug: vedi `AUDIT.md` (B1…B24).

---

## ⭐ I 3 interventi che ti fanno risparmiare più tempo ogni settimana

1. **Storico cliente cliccabile** — dalla scheda cliente tocchi una manutenzione/consegna/cantiere e si apre. *Oggi: esci + ricerca globale (~4 tap). Dopo: 1 tap.* `clients.js:88-92`. Impatto **alto**, ~1h, rischio basso.
2. **Clienti e Conti nella barra in basso** — le due cose che apri di più a 1 tap invece di 2. `core.js:618` (`NAV_DEFAULT`). Impatto **alto** (decine di aperture/settimana), 10 min, rischio nullo.
3. **"✓ Fatta oggi" sulle manutenzioni + keyword "fatta" nel parser** — chiudi una manutenzione in 1 tap e la scrivi dall'Hub. `man.js:143`, `commitParsed` `core.js:510`. Impatto **alto**, ~1h, rischio basso.

---

## 1) Da fare subito — bug e blocchi

| Cosa | Perché | File | Impatto | Tempo | Rischio |
|---|---|---|---|---|---|
| **Conti: non azzerare gli incassi se fatturi fuori** (B1). Contare i lavori "fatturati" (flag `invoiced`) come incasso, non solo le fatture in-app; oppure basare Conti su pellet/man/cantieri sempre e usare le fatture solo per l'IVA. | Oggi Conti può mostrare Entrate = 0 col tuo flusso Profix | `conti.js:40-44` | alto | 2-3h (decisione modello) | medio |
| **Delete fattura: liberare i lavori** (B5). In `delInvoice` azzerare `invoiced` sui lavori collegati alle righe. | Lavori non spariscono dal flusso | `fatture.js:195` | alto | 30 min | basso |
| **Numerazione fattura** (B3/B4): numero unico + reset per anno + niente riuso. Rendere il N. non editabile (o avvisare), aggiungere `unique` su `(tenant, number)` in schema, reset contatore al cambio anno. | Coerenza fiscale | `fatture.js:124/180`, `schema.sql` | alto | 2-3h | medio (schema) |
| **Lavagna dei non-titolari** (B9): salvare `boards` anche per i non-titolari (o rendere la lavagna per-utente indipendente da `isOwner` nel sync). | Feature oggi silenziosamente rotta per i dipendenti | `core.js:201`, `lavagna.js` | medio | 1-2h | medio (RLS) |
| **`openClientGeo` gated a Zone** (B10). | Non regalare una funzione a pagamento | `clients.js:103` | basso | 5 min | nullo |
| **"✓ Consegnato" mette data+prezzo** (B7) e **`autoPrice` gestisce bancali/kg** (B8). | Consegne non più invisibili in Conti/dashboard | `pellet.js:248,228` | medio | 1h | basso |
| **Ricorrenza bollettino copia `type`** (B6). | La manutenzione dell'anno dopo non conta più 0 | `man.js:279` | medio | 15 min | nullo |

## 2) Grandi guadagni con poco lavoro

| Cosa | Perché | File | Impatto | Tempo | Rischio |
|---|---|---|---|---|---|
| **Storico cliente cliccabile** (⭐1). | -4 tap per lavoro | `clients.js:88-92` | alto | 1h | basso |
| **Clienti+Conti in barra bassa** (⭐2). | -1 tap su ogni apertura | `core.js:618` | alto | 10 min | nullo |
| **"✓ Fatta oggi" + parser "fatta"** (⭐3). | chiusura manutenzione 1 tap | `man.js:143`, `core.js:510` | alto | 1h | basso |
| **Default assegnatario = utente corrente** in manut/pellet/note. | -1 seg-tap per record | `core.js:1310` (empSeg) | medio | 30 min | basso |
| **"Crea cliente da questo nome"** nelle schede quando c'è `clientRaw`. | niente ridigitare + niente record scollegati | `man.js/pellet.js/sites.js` | medio | 1h | basso |
| **Ricerca senza re-render totale** (solo la lista, non `render()` a ogni tasto). | liste lunghe reattive | `clients.js:61`, `documenti.js:136` | medio | 45 min | basso |
| **"🖨 Stampa ora" dopo salvataggio fattura** + **"Salva come consegnato" nel nuovo pellet**. | -2 tap per fattura/consegna | `fatture.js:187`, `pellet.js:217` | medio | 45 min | basso |
| **Avviso su fattura a totale 0** (B22). | evita fatture vuote per errore | `fatture.js` | basso | 10 min | nullo |

## 3) Miglioramenti strutturali

| Cosa | Perché | File | Impatto | Tempo | Rischio |
|---|---|---|---|---|---|
| **Riconciliare le ore** (diario vs presenze vs rapportini) in un unico punto per contesto; `siteHours` non deve sommare due volte lo stesso giorno (B23). | dato ore affidabile | `sites.js:6`, `emps.js`, `reports.js` | alto | mezza giornata | medio |
| **Spostare le costanti condivise in core** (`MAINT_KINDS`/`MAINT_ICONS`, `addDaysIso`) e **fattorizzare i duplicati** (firma pad, template stampa, upsert timbrature). | robustezza + meno bug futuri | `conti.js/man.js/pellet.js/emps.js/core.js` | medio | mezza giornata | basso |
| **Fix calendario**: allineare `calCur`/`calSel` tra le viste (B20). | navigazione coerente | `cal.js:10` | basso | 30 min | basso |
| **Rimuovere codice morto** (B: quickAdd, sigDrawn, updClientPrev, _new, reports start/end). | pulizia | vari | basso | 1h | nullo |
| **Conti lordo/netto (B2)**: decidere se mostrare l'utile al netto dell'IVA in modo coerente. | utile veritiero | `conti.js` | medio | 2h | medio |

## 4) Opzionali / futuri

| Cosa | Perché | Impatto | Tempo | Rischio |
|---|---|---|---|---|
| **🇮🇹🇨🇭 Doppia versione moduli Italia / Svizzera** (memoria dedicata già salvata). Flag `country` all'onboarding; sdoppiare i moduli country-specific (Fatture per primo: SdI/IT vs QR/CH; IVA, valuta), non toccare i neutri. | mercato IT oltre al CH | **alto** | grande (settimane) | alto |
| **Export file completo** (foto/PDF oltre ai metadati) o backup pianificato. | vero disaster-recovery | medio | 1-2 giorni | medio |
| **Vista "storico/archivio" per calendario** o auto-clear delle scadenze passate. | le cose fatte/scadute non restano in "In ritardo" per sempre | basso | 2-3h | basso |
| **Widget Lavagna Fase 2** (2-3 per modulo, lista già pronta). | dashboard più utile | medio | 1-2 giorni | basso |
| **Invio fattura** (email/PDF) oltre alla stampa. | -passaggi manuali | medio | mezza giornata | medio |
| **Vincolo unique DB sul numero fattura** + numerazione lato server. | robustezza multi-dispositivo | medio | mezza giornata | medio |

---

### Note
- Le modifiche di questa sessione (registro Fatture, Documenti, personalizzazione, **backup lossless**, **archiviazione fatture**) sono nel working tree, **non ancora pubblicate**. Schema `invoiced`/`archived` già eseguito su Supabase.
- Prima di pubblicare: `AGGIORNA E CHIUDI` (salva + pubblica + security review).
