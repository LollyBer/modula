# FABBRICA Modula — SETTORI → MODULI SU MISURA

Catalogo **vivo** delle attività che hanno **manutenzioni · cantieri · dipendenti · appuntamenti**,
e per ognuna i **moduli specifici** da costruire. Si spunta man mano che i moduli passano a `pronto`.

> Come si usa: ogni modulo è una casella. La spunti quando è **pronto** (Contratto Modulo in
> [LABORATORIO.md](LABORATORIO.md) soddisfatto). Quando tutti i moduli di un settore sono pronti,
> spunti anche il settore. Aggiungi nuovi settori in fondo.

**Legenda moduli**
- ✅ già pronto nel catalogo (riusabile subito)
- 🔨 da costruire (Laboratorio)
- ♻️ **trasversale**: serve a tanti settori → conviene costruirlo presto (lo costruisci una volta, lo riusi)

---

## 0 · Mattoni già pronti (da riusare in ogni settore)

- **BASE** (sempre inclusa): `hub` · `cal` (appuntamenti) · `clients` · `emps` (dipendenti) · `notes` · `notif`
- **EXTRA pronti**: `man` (manutenzioni) · `sites` (cantieri) · `macchine` · `zone` (mappa) · `conti` · `pellet`
- **In arrivo (coda)**: `prenota` · `magazzino` · `catalogo` · `fatture` · `documenti` · `report` · `fidelity` · `turni`

---

## ⭐ Moduli TRASVERSALI da costruire per primi (sbloccano più settori)

Costruendo questi pochi, accendi mezza lista. Priorità alta.

- [ ] ♻️ **`interventi`** — Rapportini d'intervento firmati: il tecnico compila in loco (lavoro svolto,
      ore, materiali), **foto prima/dopo**, **firma cliente** su schermo, esito → PDF. *(idraulico, elettricista, HVAC, ascensori, allarmi…)*
- [ ] ♻️ **`contratti-man`** — Contratti di manutenzione ricorrenti: scadenza annuale/semestrale, **rinnovo**,
      alert "in scadenza", canone. *(caldaie, HVAC, ascensori, antincendio, allarmi…)*
- [ ] ♻️ **`scadenziario`** — Scadenzario controlli obbligatori: per ogni cliente/impianto le date dei
      controlli di legge, con **avvisi automatici** prima della scadenza. *(antincendio, ascensori, F-gas, bollino caldaie…)*
- [ ] ♻️ **`impianti`** — Parco impianti per cliente: matricola, ubicazione, foto, storico, prossima verifica.
      *(ascensori, fotovoltaico, allarmi, antincendio…)*
- [ ] ♻️ **`mezzi`** — Mezzi e attrezzature: assegnazione a cantiere/squadra, noleggi, **scadenze** (bollo, revisione, tagliando).
      *(edile, giardinaggio, pulizie…)*
- [ ] ♻️ **`preventivi`** — Preventivi (manodopera + materiali) → invio → **accettazione** → diventa lavoro/cantiere.
      *(serramenti, officina, edile, tutti)*
- [ ] ♻️ **`ricorrenze`** — Manutenzioni programmate ricorrenti: genera in automatico i prossimi appuntamenti
      (sfalcio mensile, tagliando 6 mesi, trattamento piscina settimanale…). *(giardinaggio, piscine, disinfestazione, HVAC…)*

---

## SETTORI

### ✅ Pellet / Stufe e caldaie a biomassa — **FATTO** (cliente tipo *Pellet Tek*)
Manut. ✓ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [x] `man` (manutenzioni) ✅
- [x] `pellet` (consegne/giri pellet) ✅
- [x] `macchine` ✅ · `sites` (cantieri) ✅ · `zone` (mappa) ✅ · `conti` ✅
- [x] `turni` *(promesso/in chiusura)*

---

### ⬜ Termoidraulica / Caldaie (idraulico-termotecnico)
Manut. ✓ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`libretto`** — Libretto impianto + **bollino blu**: catasto impianti termici, controllo fumi,
      numero bollino regionale, scadenze.
- [ ] ♻️ **`interventi`** — rapportini firmati con foto (vedi trasversali).
- [ ] ♻️ **`contratti-man`** — contratti manutenzione caldaia annuali.

### ⬜ Elettricista / Impianti elettrici
Manut. ✓ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`dichiaraz`** — Dichiarazioni di conformità (DiCo, DM 37/08): genera il documento per cliente/cantiere, archivio.
- [ ] 🔨 **`quadri`** — Anagrafica quadri/impianti per cliente: schemi, foto, revisioni.
- [ ] ♻️ **`interventi`** — rapportini intervento.

### ⬜ Climatizzazione / Condizionatori (HVAC)
Manut. ✓ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`fgas`** — Registro **F-Gas**: apparecchiature, ricariche gas refrigerante, controlli perdite e scadenze.
- [ ] 🔨 **`stagioni`** — Campagne stagionali: manutenzioni split estate/inverno generate per tutti i clienti.
- [ ] ♻️ **`contratti-man`** — contratti di assistenza.

### ⬜ Edile / Impresa di costruzioni
Manut. ~ · Cantieri ✓✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`sal`** — Stati Avanzamento Lavori: % avanzamento per cantiere, fatturazione a SAL.
- [ ] 🔨 **`sicurezza`** — Sicurezza cantiere: POS/PSC, DPI, scadenze documenti e formazione operai.
- [ ] ♻️ **`mezzi`** — mezzi/attrezzature assegnati ai cantieri.

### ⬜ Giardinaggio / Manutenzione del verde
Manut. ✓✓ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] ♻️ **`ricorrenze`** — sfalci/potature programmate per cliente (calendario stagionale).
- [ ] 🔨 **`giri`** — Giri giornalieri: assegna squadra + mezzi a un giro di clienti, ottimizza l'ordine.
- [ ] ♻️ **`mezzi`** — rasaerba, decespugliatori, furgoni.

### ⬜ Manutenzione ascensori
Manut. ✓✓ · Cantieri ~ · Dipendenti ✓ · Appuntamenti ✓
- [ ] ♻️ **`impianti`** — parco ascensori (matricola, condominio, ubicazione).
- [ ] 🔨 **`chiamate`** — Chiamate urgenti / reperibilità: ticket guasto, **persone bloccate**, SLA, turni reperibilità.
- [ ] ♻️ **`scadenziario`** — verifiche periodiche biennali obbligatorie.

### ⬜ Antincendio / Estintori
Manut. ✓✓ · Cantieri ~ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`presidi`** — Censimento presidi: estintori, manichette, porte REI (posizione, matricola, scadenza ricarica/collaudo).
- [ ] ♻️ **`scadenziario`** — controlli semestrali/annuali con avvisi.
- [ ] 🔨 **`registro-an`** — Registro antincendio + certificati: PDF, firme, storico per cliente.

### ⬜ Piscine (costruzione e manutenzione)
Manut. ✓✓ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`trattamenti`** — Trattamenti acqua: valori cloro/pH, prodotti dosati, log per piscina.
- [ ] ♻️ **`ricorrenze`** — manutenzione settimanale programmata.
- [ ] 🔨 **`stagione`** — Aperture/chiusure stagionali con checklist.

### ⬜ Imprese di pulizia
Manut. ~ · Cantieri ✓✓ (sedi clienti) · Dipendenti ✓✓ · Appuntamenti ✓
- [ ] 🔨 **`commesse`** — Commesse/sedi cliente ricorrenti con planning settimanale.
- [ ] ♻️ **`turni`** — turni squadre per sede *(già in coda)*.
- [ ] 🔨 **`qualita`** — Checklist qualità + firma sul posto (controllo lavoro svolto).

### ⬜ Disinfestazione / Pest control
Manut. ✓✓ · Cantieri ~ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`stazioni`** — Mappa stazioni esca/monitoraggio per sito: catture, ricariche, planimetria.
- [ ] 🔨 **`haccp`** — Registro HACCP + certificati per cliente (ristoranti, industrie alimentari).
- [ ] ♻️ **`ricorrenze`** — interventi periodici programmati.

### ⬜ Autofficina / Gommista
Manut. ✓✓ · Cantieri ✗ · Dipendenti ✓ · Appuntamenti ✓✓
- [ ] 🔨 **`veicoli`** — Schede veicolo: targa, km, storico tagliandi e interventi.
- [ ] ♻️ **`prenota`** — appuntamenti officina *(già in coda)*.
- [ ] ♻️ **`preventivi`** — ricambi + manodopera → accettazione cliente.

### ⬜ Fotovoltaico / Energie rinnovabili
Manut. ✓ · Cantieri ✓✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] ♻️ **`impianti`** — impianti FV (kWp, inverter, pratica GSE).
- [ ] 🔨 **`monitor`** — Monitoraggio produzione: rendimento, allarmi calo, lavaggio pannelli.
- [ ] ♻️ **`man`** — manutenzione *(già pronto)*.

### ⬜ Serramenti / Infissi
Manut. ~ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] 🔨 **`rilievi`** — Rilievi misure in loco: per cliente/cantiere, foto, quote.
- [ ] ♻️ **`preventivi`** — preventivo → accettazione.
- [ ] 🔨 **`pose`** — Planning pose (cantieri) + collaudo/consegna.

### ⬜ Allarmi / Videosorveglianza
Manut. ✓ · Cantieri ✓ · Dipendenti ✓ · Appuntamenti ✓
- [ ] ♻️ **`impianti`** — impianti installati (centrali, telecamere).
- [ ] ♻️ **`contratti-man`** — contratti di assistenza/vigilanza.
- [ ] ♻️ **`interventi`** — interventi su chiamata.

---

## Note di strategia (per costruirli "pian piano")

1. **Parti dai ♻️ trasversali** (`interventi`, `contratti-man`, `scadenziario`, `impianti`, `mezzi`,
   `preventivi`, `ricorrenze`): con ~7 moduli copri il 70% dei settori qui sopra.
2. Poi **un modulo super-specifico per settore** (`fgas`, `libretto`, `presidi`, `sal`…) quando arriva
   un cliente reale di quel settore.
3. Ogni modulo nuovo segue il **Contratto Modulo** ([LABORATORIO.md](LABORATORIO.md)) e poi va in
   `MANIFEST.extra` + catalogo `stato:'pronto'`, e qui si spunta.
