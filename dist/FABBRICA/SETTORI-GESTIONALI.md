# MODULA — Settori → Attività → Gestionali base

> Mappa di prodotto generata il 2026-06-27 da un'analisi multi-agente (18 macro-famiglie + critico di completezza + sintesi). Obiettivo: definire **pochi gestionali base personalizzabili**, ognuno che copre molte attività, per massimizzare i clienti per modulo costruito. Calibrata sul mercato PMI svizzero (beachhead Ticino, CHF). Vincoli di scope: niente fatturazione fiscale/IVA (si usa preventivi+conti), WhatsApp 'prossimamente'.

Vedi anche [SETTORI-MODULI.md](SETTORI-MODULI.md) (il catalogo tecnico di dettaglio per il field-service).

---

## Parte 1 — Gli 8 GESTIONALI BASE (la strategia)

Ogni gestionale base = uno **scheletro operativo** condiviso. Le attività con lo stesso scheletro usano lo stesso base; si personalizza accendendo 1-2 moduli verticali. In ordine di priorità per il Ticino:

| # | Gestionale base | Archetipo | Priorità | Backbone (moduli esistenti) | Da costruire |
|---|---|---|---|---|---|
| 1 | 📅 Su Appuntamento | su-appuntamento | **alta** | `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti` | `scheda-cliente (storico/anamnesi/foto prima-dopo/consensi)`, `ricorrenze (appuntamenti ricorrenti auto-generati)`, `richiami (richiami programmati su scadenza naturale)`, `prenota (prenotazioni online, IN CODA)`, `pacchetti (pacchetti/abbonamenti a sedute con saldo che cala)` |
| 2 | 🔧 Field Service (Tecnico & Impianti) | field-service | **alta** | `hub`, `cal`, `clients`, `emps`, `notif`, `conti`, `man`, `zone` | `interventi (rapportini firmati con foto)`, `impianti (parco impianti per cliente)`, `contratti-man (contratti ricorrenti/rinnovi)`, `scadenziario (scadenze obbligatorie con avvisi)`, `mezzi (mezzi/attrezzature con scadenze)`, `ricorrenze (interventi periodici auto-generati)` |
| 3 | 🏗️ Commessa & Progetti | commessa-progetti | **alta** | `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `sites` | `preventivi (preventivo→accettazione→lavoro→saldo, con acconto)`, `sal (stato avanzamento lavori / milestone / revisioni)`, `timesheet (ore a commessa per billabilità e utile a progetto)`, `documenti (archivio file di commessa, IN CODA)`, `scadenziario (scadenze di mandato/consegna/legge)` |
| 4 | 🎟️ Soci & Membership | soci-membership | **media** | `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti` | `abbonamenti (abbonamento/quota/retta che si esaurisce e va rinnovata)`, `corsi (calendario corsi/lezioni con posti limitati e prenotazione)`, `presenze (presenze/assenze, accessi)`, `rette (scadenzario importi ricorrenti, solleciti insoluti)`, `prenota (prenotazione slot/lezione, IN CODA)` |
| 5 | 🏔️ Ospitalità & Alloggi | ospitalita | **media** | `hub`, `cal`, `clients`, `emps`, `notif`, `conti`, `preventivi` | `planner-prenotazioni (griglia unità × giorni, disponibilità realtime, arrivi/partenze)`, `unita (camere/piazzole/posti letto come risorsa prenotabile)`, `tariffe (prezzi per stagione)`, `tassa-soggiorno (calcolo e rendiconto al Comune)`, `pulizie-camere (turni pulizia/turnover)` |
| 6 | 🛒 Retail — Cassa & Magazzino | retail | **bassa** | `hub`, `clients`, `emps`, `notif`, `conti` | `catalogo (listino prodotti/prezzi/barcode, IN CODA)`, `magazzino (scorte/giacenze, IN CODA)`, `cassa (cassa giornaliera/incasso, nuovo)`, `fidelity (punti/promo, IN CODA)`, `ordini-forn (riordini ai fornitori, nuovo)` |
| 7 | 🚐 Trasporti & Flotta | trasporti | **bassa** | `hub`, `cal`, `clients`, `emps`, `notif`, `conti`, `macchine`, `zone` | `corse (corse/ordini da assegnare e tracciare, dispatch)`, `mezzi (mezzi con scadenze obbligatorie: revisione, tachigrafo, assicurazione, vignetta)`, `scadenziario (scadenze di legge dei veicoli)`, `giri (giri di consegna, riusa pellet/consegne)`, `preventivi (per traslochi/noleggi)` |
| 8 | 🧩 Stato-lavorazione su oggetto/bene (Banco & Risorse) | altro | **bassa** | `hub`, `cal`, `clients`, `emps`, `notif`, `conti` | `riparazioni (stato lavorazione su oggetto: ritiro→lavorazione→pronto→ritirato, con etichetta/ticket)`, `prenota-risorsa (prenotazione di un bene o spazio per data/fascia)`, `abbonamenti (per detailing/parcheggi/spazi)`, `turni (turni/pattuglie/rapporti-servizio per vigilanza, IN CODA)`, `pratiche-funebri (pratiche con scadenziario e documenti)` |

### 1 📅 Su Appuntamento
- **Archetipo:** su-appuntamento
- **Priorità Ticino:** alta — è l'archetipo più vicino al prodotto attuale (BASE+cal+clients già pronti), domanda altissima e diffusa, oggi tutti su agenda cartacea/WhatsApp; ticket medio basso ma volume enorme.
- **A chi serve:** Bellezza & Benessere (parrucchieri, barbieri, estetiste, SPA, nail, tatuatori, solarium); Studio Salute (dentisti, fisio, psicologi, veterinari, ottici, podologi, cure a domicilio); Cura & Casa (assistenza anziani, pet care, baby sitting, colf, handyman domestico)
- **Backbone (già pronti/da accendere):** `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- **Moduli da costruire:** `scheda-cliente (storico/anamnesi/foto prima-dopo/consensi)`, `ricorrenze (appuntamenti ricorrenti auto-generati)`, `richiami (richiami programmati su scadenza naturale)`, `prenota (prenotazioni online, IN CODA)`, `pacchetti (pacchetti/abbonamenti a sedute con saldo che cala)`
- **Come si personalizza:** Si parte da agenda+scheda cliente+conti uguali per tutti; cambia solo il TIPO di scheda (colore/allergie per beauty, cartella clinica per salute, piano-assistenza per cura&casa) e 1-2 moduli (consensi, cabine/poltrone, fidelity, animali, ore-care a domicilio). La privacy si rinforza per il ramo sanitario.

### 2 🔧 Field Service (Tecnico & Impianti)
- **Archetipo:** field-service
- **Priorità Ticino:** alta — moduli man/sites/zone già pronti, PMI artigiane numerose e con buona disponibilità a pagare; le scadenze obbligatorie CH (revisioni, F-Gas, antincendio) sono un dolore vero che vende da solo.
- **A chi serve:** Termoidraulica, elettricisti, HVAC/frigoristi, fotovoltaico; Sicurezza & verifiche di legge (ascensori, antincendio); Verde & esterni, pulizie, disinfestazione, piscine; Autofficine e veicoli; Pulizie tecniche specializzate (spazzacamini, autospurghi)
- **Backbone (già pronti/da accendere):** `hub`, `cal`, `clients`, `emps`, `notif`, `conti`, `man`, `zone`
- **Moduli da costruire:** `interventi (rapportini firmati con foto)`, `impianti (parco impianti per cliente)`, `contratti-man (contratti ricorrenti/rinnovi)`, `scadenziario (scadenze obbligatorie con avvisi)`, `mezzi (mezzi/attrezzature con scadenze)`, `ricorrenze (interventi periodici auto-generati)`
- **Come si personalizza:** Spina dorsale comune = cliente con uno o più impianti + tecnico che ci va + rapportino firmato + contratto che si rinnova + verifica di legge che non deve scadere. Si accende solo il modulo del mestiere: F-Gas per il frigorista, libretto/bollino per il caldaista, presidi per l'antincendio, trattamenti per il verde, veicoli per l'officina.

### 3 🏗️ Commessa & Progetti
- **Archetipo:** commessa-progetti
- **Priorità Ticino:** alta — sites/conti già pronti; lo Studio Pro (fiduciarie/avvocati/architetti) ha la più alta disponibilità a pagare in Ticino (la billabilità è il margine). Edile e creativi sono volumi grandi e poco digitalizzati.
- **A chi serve:** Cantiere/edilizia (edili, imbianchini, serramentisti, falegnami, fabbri, lattonieri); Atelier creativi (foto/video, musica, design/web freelance, arti visive); Eventi & spettacolo (wedding/event planner, service AV, allestimenti); Studio Pro (fiduciarie, avvocati, architetti, agenzie, IT/MSP); Cascina (agricoltura, vino, produzione artigianale per lotti/raccolti)
- **Backbone (già pronti/da accendere):** `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `sites`
- **Moduli da costruire:** `preventivi (preventivo→accettazione→lavoro→saldo, con acconto)`, `sal (stato avanzamento lavori / milestone / revisioni)`, `timesheet (ore a commessa per billabilità e utile a progetto)`, `documenti (archivio file di commessa, IN CODA)`, `scadenziario (scadenze di mandato/consegna/legge)`
- **Come si personalizza:** Il cuore non è l'appuntamento ma la COMMESSA (sites): dal preventivo all'utile a progetto. Cambia cosa ci attacchi: SAL+mezzi per il cantiere, brief+revisioni+diritti per i creativi, timeline+fornitori+run-sheet per gli eventi, pratiche+timesheet+scadenze per gli studi pro, lotti+produzione+etichette per la cascina.

### 4 🎟️ Soci & Membership
- **Archetipo:** soci-membership
- **Priorità Ticino:** media — molto vendibile (rette/quote anticipate = cash flow sano, il gestionale si ripaga riducendo insoluti) ma richiede di costruire da zero il motore abbonamenti/rette; immobiliare e associazioni hanno bisogni laterali (documenti, condominio) parzialmente fuori scope.
- **A chi serve:** FitClub — sport & movimento (palestre, yoga, danza, scuole sci, personal trainer, noleggio sportivo); Scuola & Formazione (asili, scuole guida, lingue, musica, doposcuola); Gestione immobiliare (agenzie, amministratori condominio, property management); Soci & comunità (associazioni sportive/culturali, parrocchie, ONLUS, circoli)
- **Backbone (già pronti/da accendere):** `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- **Moduli da costruire:** `abbonamenti (abbonamento/quota/retta che si esaurisce e va rinnovata)`, `corsi (calendario corsi/lezioni con posti limitati e prenotazione)`, `presenze (presenze/assenze, accessi)`, `rette (scadenzario importi ricorrenti, solleciti insoluti)`, `prenota (prenotazione slot/lezione, IN CODA)`
- **Come si personalizza:** Cuore comune = anagrafica soci/atleti/allievi + un abbonamento/retta/quota che scade e si rinnova + un calendario di corsi/slot a posti limitati + incasso ricorrente. Cambia il modulo verticale: accessi/sala pesi per la palestra, livelli/saggi per la scuola, immobili/contratti per l'immobiliare, tesseramenti/volontari per le associazioni.

### 5 🏔️ Ospitalità & Alloggi
- **Archetipo:** ospitalita
- **Priorità Ticino:** media — domanda chiara e Ticino turistico, ma il planner-prenotazioni è tutto da costruire e i due veri punti di valore (channel manager Booking/Airbnb e pagamenti online) sono fuori scope e spingono il cliente serio verso strumenti esterni.
- **A chi serve:** Hotel, garni, pensioni; B&B e affittacamere; Affitti brevi / case vacanza (host Airbnb) — overlap con Gestione Immobiliare; Agriturismi, ostelli, campeggi, rifugi alpini
- **Backbone (già pronti/da accendere):** `hub`, `cal`, `clients`, `emps`, `notif`, `conti`, `preventivi`
- **Moduli da costruire:** `planner-prenotazioni (griglia unità × giorni, disponibilità realtime, arrivi/partenze)`, `unita (camere/piazzole/posti letto come risorsa prenotabile)`, `tariffe (prezzi per stagione)`, `tassa-soggiorno (calcolo e rendiconto al Comune)`, `pulizie-camere (turni pulizia/turnover)`
- **Come si personalizza:** Il modulo che tiene insieme tutto è UN planner a griglia (unità × giorni). Cambia solo cosa è l'unità: camera per l'hotel, piazzola per il campeggio, posto letto per il rifugio, appartamento per l'host. La tassa di soggiorno (specificità CH/comunale) è trasversale a tutti.

### 6 🛒 Retail — Cassa & Magazzino
- **Archetipo:** retail
- **Priorità Ticino:** bassa — archetipo più lontano dal prodotto attuale (richiede catalogo+magazzino+cassa, tutti IN CODA o nuovi), e dove un POS fiscale certificato CH può essere richiesto davvero; meglio aggredirlo dopo aver costruito catalogo/magazzino per altri base.
- **A chi serve:** Negozi al dettaglio (abbigliamento, ferramenta, ottica retail, librerie); Alimentari di vicinato e food specializzato (macelleria, panetteria, formaggi); E-commerce e ambulanti/mercati; Grossisti/B2B, edicole/tabaccherie, fiorai con negozio; Vendita diretta della Cascina (canale negozio/mercato)
- **Backbone (già pronti/da accendere):** `hub`, `clients`, `emps`, `notif`, `conti`
- **Moduli da costruire:** `catalogo (listino prodotti/prezzi/barcode, IN CODA)`, `magazzino (scorte/giacenze, IN CODA)`, `cassa (cassa giornaliera/incasso, nuovo)`, `fidelity (punti/promo, IN CODA)`, `ordini-forn (riordini ai fornitori, nuovo)`
- **Come si personalizza:** Qui il cuore è il PRODOTTO (codice/giacenza/prezzo) e la vendita ripetuta a clienti anonimi/fidelizzati, non l'appuntamento. Si accende solo il canale reale: punto fisico→cassa+scaffali, ambulante→carico-furgone+banchi, online→ordini-web+spedizioni, B2B→listini-cliente+consegne. Lotti/scadenze per il food.

### 7 🚐 Trasporti & Flotta
- **Archetipo:** trasporti
- **Priorità Ticino:** bassa — riusa macchine/pellet/zone (vicino al prodotto) ma il dispatch corse è da costruire e il valore vero (tracking, fattura B2B) tocca i limiti di scope; nicchia più piccola, da fare dopo aver maturato mezzi/scadenziario su field-service.
- **A chi serve:** Taxi/NCC, transfer & navette; Traslochi & sgomberi (overlap Cura&Casa); Corrieri & consegne ultimo miglio; Autonoleggio/noleggio mezzi; Autotrasporto merci conto terzi
- **Backbone (già pronti/da accendere):** `hub`, `cal`, `clients`, `emps`, `notif`, `conti`, `macchine`, `zone`
- **Moduli da costruire:** `corse (corse/ordini da assegnare e tracciare, dispatch)`, `mezzi (mezzi con scadenze obbligatorie: revisione, tachigrafo, assicurazione, vignetta)`, `scadenziario (scadenze di legge dei veicoli)`, `giri (giri di consegna, riusa pellet/consegne)`, `preventivi (per traslochi/noleggi)`
- **Come si personalizza:** Tre cardini comuni: corse/ordini da assegnare ogni giorno + mezzi con scadenze CH obbligatorie + autisti con turni e disponibilità. Si accende il verticale: dispatch+tariffe per taxi, inventario+squadre per traslochi, tracking+giri per corrieri, disponibilità+stato-veicolo per noleggio, tachigrafo+viaggi per autotrasporto.

### 8 🧩 Stato-lavorazione su oggetto/bene (Banco & Risorse)
- **Archetipo:** altro
- **Priorità Ticino:** bassa — nicchie redditizie e poco digitalizzate ma frammentate e con archetipi misti; conviene affrontarle solo dopo aver costruito i due trasversali (riparazioni, prenota-risorsa) che servono anche altrove.
- **A chi serve:** Sartoria, lavanderia, calzolaio, riparazioni al banco non-IT; Noleggio attrezzature/beni e spazi (coworking, self-storage); Car detailing / autolavaggi (abbonamenti + slot); Funerario (pratiche con scadenze e documenti); Vigilanza/sicurezza (turni, postazioni, rapporti-servizio)
- **Backbone (già pronti/da accendere):** `hub`, `cal`, `clients`, `emps`, `notif`, `conti`
- **Moduli da costruire:** `riparazioni (stato lavorazione su oggetto: ritiro→lavorazione→pronto→ritirato, con etichetta/ticket)`, `prenota-risorsa (prenotazione di un bene o spazio per data/fascia)`, `abbonamenti (per detailing/parcheggi/spazi)`, `turni (turni/pattuglie/rapporti-servizio per vigilanza, IN CODA)`, `pratiche-funebri (pratiche con scadenziario e documenti)`
- **Come si personalizza:** Due nuovi trasversali sbloccano da soli 6 delle 10 nicchie: 'stato lavorazione su oggetto' (ticket riparazioni con etichetta) e 'prenotazione di una risorsa' (bene/spazio per fascia). Sopra ci si innesta abbonamenti (detailing/spazi), turni+postazioni (vigilanza), pratiche+documenti (funerario).

---

## Parte 2 — Ordine di costruzione consigliato

- 1) SU APPUNTAMENTO — è già quasi pronto (BASE+cal+clients+conti). Costruisci scheda-cliente, ricorrenze, richiami, pacchetti. Massimo numero di attività sbloccate (beauty+salute+cura&casa) per minimo sforzo: il primo prodotto vendibile.
- 2) FIELD SERVICE — riusa man/sites/zone già pronti. Costruisci i 6 trasversali pesanti (interventi, impianti, contratti-man, scadenziario, mezzi, ricorrenze): sono il backbone più riutilizzato dell'intero catalogo.
- 3) COMMESSA & PROGETTI — riusa sites/conti + scadenziario/ricorrenze già fatti al punto 2. Aggiungi preventivi, sal, timesheet, documenti. Sblocca il segmento a più alta disponibilità a pagare (Studio Pro) + edilizia + creativi + eventi.
- 4) SOCI & MEMBERSHIP — costruisci il motore abbonamenti/rette/corsi/presenze (nuovo). Riusa prenota e ricorrenze. Sblocca fitness+scuola+associazioni+parte dell'immobiliare.
- 5) OSPITALITÀ — costruisci il planner-prenotazioni a griglia (unità×giorni) + tariffe + tassa-soggiorno. Condivide prenota-risorsa con l'archetipo Banco&Risorse del punto 7.
- 6) TRASPORTI & FLOTTA — riusa macchine/pellet(giri)/zone + mezzi/scadenziario già fatti al punto 2. Aggiungi solo corse/dispatch. Nicchia piccola ma a basso costo marginale.
- 7) RETAIL e BANCO&RISORSE — per ultimi: richiedono catalogo+magazzino+cassa+fidelity (tutti IN CODA/nuovi) e i trasversali riparazioni + prenota-risorsa. Più lontani dal prodotto attuale e più esposti ai limiti di scope (POS fiscale CH).

### Leva dei moduli condivisi (costruisci una volta → sblocca molti)

Pochi moduli costruiti una volta sbloccano quasi tutto. (A) I trasversali field-service — interventi (rapportino firmato), impianti, contratti-man, scadenziario, mezzi, ricorrenze — alimentano Field Service, ma scadenziario+ricorrenze+mezzi tornano in Trasporti, Commessa (scadenze di mandato), Soci (rette ricorrenti) e Cura&Casa (visite ricorrenti). (B) preventivi è il cuore di Commessa/Eventi/Studio Pro ma è anche il sostituto-fatturazione di tutti gli altri base (vincolo di scope). (C) prenota/prenota-risorsa è il singolo modulo che unisce il planner di Ospitalità, gli slot di Soci, il noleggio di Banco&Risorse e le prenotazioni online di Su Appuntamento. (D) scheda-cliente ricca serve a Su Appuntamento (beauty+salute) e a Cura&Casa. (E) catalogo+magazzino+cassa+fidelity, costruiti per Retail, servono anche alla vendita diretta della Cascina e al food di Gusto. Regola founder: prima i moduli a fan-out più alto (scadenziario, ricorrenze, preventivi, prenota-risorsa), poi i verticali a coda lunga.

### Note di scope (vincoli rispettati)

Vincoli rispettati così: NIENTE fatturazione fiscale/IVA — ogni base usa preventivi + conti (incassato/da incassare) come surrogato; dove serve la fattura vera si segnala il limite e MODULA resta complementare (bexio/Banana). WhatsApp resta 'prossimamente', mai dato per scontato nelle notif. Dove lo scope è sfidato davvero: (1) Retail/Banco — un POS fiscale certificato CH può essere richiesto, MODULA copre il ~90% (quaderno/Excel) ma non sostituisce la cassa fiscale; (2) Ospitalità — channel manager (Booking/Airbnb) e pagamenti online sono fuori scope e spingono verso strumenti esterni; (3) Studio Salute — fatturazione cassa malati (Tarmed/Tardoc, MediData) fuori: si copre solo l'operatività clinica; (4) Studio Pro/Immobiliare — QR-fattura e contabilità condominiale fiscale fuori scope; (5) Autotrasporto/corrieri B2B — la fattura vera servirebbe davvero. Specificità CH da tenere: lingue IT/DE/FR (beachhead Ticino IT), tassa di soggiorno comunale, scadenze obbligatorie locali (revisione veicoli, F-Gas, antincendio, controlli impianti), privacy/GDPR rinforzata sul ramo sanitario.

---

## Parte 3 — Appendice: tutti i settori → attività esempio → moduli

Dettaglio grezzo delle 18 macro-famiglie mappate. Per ogni sotto-settore: attività/aziende concrete, moduli esistenti riusabili e moduli specifici da costruire.

### 🔧 Tecnico & Impianti (Field Service)  *(archetipo: field-service)*
_Gestionale base per le PMI artigiane che vivono di interventi a domicilio, manutenzioni ricorrenti e scadenze di legge: idraulici/termotecnici, elettricisti, frigoristi/HVAC, ascensoristi, antincendio, allarmi/TVCC, fotovoltaico, pulizie, disinfestazione, piscine, verde, autofficine. Il cuore è sempre lo stesso: un cliente con uno o più impianti, un tecnico che ci va, un rapportino firmato con foto, un contratto che si rinnova e una verifica obbligatoria che non deve scadere. Si accendono solo i moduli del mestiere specifico (es. F-Gas per il frigorista, bollino per la caldaia, presidi per l'antincendio) sopra una spina dorsale comune (interventi + impianti + scadenziario + contratti-man)._

> 🇨🇭 **Mercato CH:** Domanda: è la famiglia con la domanda più solida tra le PMI svizzere. Sono migliaia di micro-imprese artigiane (1-15 persone) in CH, tipicamente con un titolare-tecnico, qualche dipendente in furgone e una segreteria part-time o la moglie che gestisce telefono e carte. Oggi lavorano con agenda cartacea, WhatsApp e Excel; il dolore vero è perdere manutenzioni a contratto e scadenze obbligatorie (= multe o responsabilità) e non avere il rapportino firmato a prova di contestazione. Disponibilità a pagare: alta e ricorrente. In CH il costo orario di un tecnico è 90-130+ CHF, quindi anche solo evitare un giro a vuoto o recuperare ore non fatturate ripaga subito un canone mensile; un prezzo per-utente di ~20-40 CHF/posto/mese è dentro la soglia di non-dolore per queste aziende, abituate a software svizzeri costosi. Specificità locali e normative: (1) Lingue — il Ticino è IT, ma molte di queste PMI lavorano anche con clienti/proprietà DE e fornitori d'Oltralpe; l'app deve nascere IT con predisposizione DE/FR per scalare verso Svizzera interna e romanda. (2) Le scadenze NON sono quelle italiane: niente 'bollino blu' regionale né DiCo/DM37 né F-Gas UE pari pari — in CH valgono OIBT (controlli periodici impianti elettrici e rapporti di sicurezza), le verifiche cantonali degli impianti termici, l'ordinanza sui prodotti chimici per i gas refrigeranti, le verifiche ascensori e i controlli antincendio secondo direttive AICAA/cantonali. I moduli 'libretto', 'conformita', 'fgas', 'scadenziario' vanno quindi pensati con etichette/loghi svizzeri, non importati dall'Italia. (3) Scope fatturazione: queste ditte emettono molte fatture, ma per restare nello scope conviene fermarsi a 'preventivi' + 'conti' e all'export; una vera fatturazione con IVA svizzera (aliquote CH, QR-fattura/QR-IBAN ormai standard nel Paese) è un bisogno reale e ricorrente — da segnalare come possibile modulo 'fatture-ch' dedicato se un cliente la richiede, perché la QR-fattura è ormai attesa di default. (4) WhatsApp per avvisi al cliente (intervento in arrivo, scadenza vicina) è molto desiderato qui ma resta 'prossimamente': per ora avvisi via notifiche interne ed email.

**Termoidraulica & Riscaldamento (idraulico, caldaista, termotecnico)**
- *Attività esempio:* Termoidraulica artigianale del Mendrisiotto che fa caldaie, sanitari e pronto-intervento perdite; Installatore di pompe di calore e solare termico nel Luganese; Spurghi/sturatura e idraulica d'emergenza 24h sul Bellinzonese; Service caldaie a gas/gasolio con contratto annuale per condomini e ville; Posatore di bagni e riscaldamento a pavimento in ristrutturazione
- *Flusso:* Chiamata cliente (guasto o manutenzione programmata) → appuntamento → tecnico in loco compila rapportino (lavoro, ore, materiali, foto prima/dopo, firma cliente) → se è caldaia registra il controllo fumi/manutenzione annuale → contratto manutenzione si rinnova e rigenera l'appuntamento dell'anno dopo. Da tracciare ogni giorno: chi è dove, quali interventi chiusi, quali contratti in scadenza, quali clienti senza manutenzione fatta nell'anno.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `man`, `conti`, `zone`
- *Moduli specifici da costruire:*
    - `interventi` — Rapportino d'intervento firmato in loco: lavoro svolto, ore, materiali usati, foto prima/dopo, firma del cliente su schermo, esito → PDF inviabile
    - `contratti-man` — Contratti di manutenzione caldaia annuali/semestrali con canone, rinnovo automatico e alert 'in scadenza'
    - `impianti` — Parco impianti per cliente (caldaia, boiler, pompa di calore): marca/modello, matricola, ubicazione, foto, storico interventi, prossima manutenzione
    - `libretto` — Libretto d'impianto termico + registro controlli combustione: dati apparecchio, valori fumi, data prossimo controllo (in CH gestione cantonale, non il bollino IT)

**Elettrico & Sistemi (elettricista, allarmi/videosorveglianza, fotovoltaico)**
- *Attività esempio:* Impresa elettrica autorizzata (concessione ESTI/Ispettorato) per case e uffici nel Luganese; Installatore di allarmi e videosorveglianza con contratto di assistenza per negozi e ville; Ditta fotovoltaico+batterie che segue pratica al gestore di rete e Pronovo per gli incentivi; Domotica/smart-home e ricariche per auto elettriche (wallbox) in Ticino; Manutentore di impianti elettrici condominiali e quadri con controlli periodici
- *Flusso:* Sopralluogo → preventivo (materiale + manodopera) → accettazione → cantiere/installazione → collaudo e documento di conformità (in CH: avviso d'installazione + protocollo di controllo / rapporto di sicurezza secondo OIBT) → impianto va a catasto cliente → eventuale contratto di assistenza con verifiche periodiche. Da tracciare: preventivi in attesa di risposta, impianti installati con relativi controlli OIBT in scadenza, chiamate di assistenza.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `man`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `interventi` — Rapportino d'intervento firmato con foto: usato sia per installazioni che per assistenza su chiamata
    - `impianti` — Catasto impianti per cliente: quadri elettrici, centrali allarme, telecamere, inverter FV (kWp, n. moduli) con schemi e foto
    - `conformita` — Documenti di conformità/sicurezza impianto: in CH avviso d'installazione + rapporto di sicurezza/protocollo di controllo periodico OIBT, archiviati per cliente con scadenza del prossimo controllo
    - `contratti-man` — Contratti di assistenza/vigilanza (allarmi, FV) con canone e rinnovo

**Clima & Refrigerazione (HVAC, condizionamento, frigoristi)**
- *Attività esempio:* Ditta di climatizzazione che installa e fa manutenzione split per uffici e ristoranti del Sottoceneri; Frigorista che segue celle frigo, banchi e impianti di ristoranti, macellerie e supermercati; Service pompe di calore aria-acqua con contratto stagionale; Manutentore di unità di trattamento aria (UTA) e ventilazione per palestre e centri commerciali; Installatore di climatizzatori residenziali con campagna estate/inverno
- *Flusso:* Contratto/chiamata → intervento stagionale o di guasto → il tecnico registra l'eventuale ricarica di gas refrigerante e il controllo perdite (obbligatorio per gas a effetto serra) → rapportino firmato → la campagna stagionale rigenera in automatico le manutenzioni di tutti i clienti. Da tracciare: ricariche e tipi di gas per apparecchio, controlli perdite con cadenza obbligatoria, contratti stagionali.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `man`, `conti`
- *Moduli specifici da costruire:*
    - `fgas` — Registro gas refrigeranti: per ogni apparecchiatura tipo e quantità di gas, ricariche, recuperi e controlli perdite con scadenza (in CH: ordinanza sulla riduzione dei rischi dei prodotti chimici / permesso d'esercizio, equivalente del registro F-Gas UE)
    - `impianti` — Parco impianti clima/frigo per cliente: split, UTA, celle, pompe di calore con matricola, gas contenuto e storico
    - `ricorrenze` — Campagne stagionali: genera in automatico le manutenzioni split estate/inverno per tutti i clienti a contratto
    - `contratti-man` — Contratti di assistenza stagionale con canone e rinnovo

**Sicurezza & Verifiche di legge (ascensori, antincendio/estintori)**
- *Attività esempio:* Ditta di manutenzione ascensori per condomini e RSA con reperibilità 24h sul Luganese; Manutentore di porte e cancelli automatici con verifiche periodiche; Service estintori, idranti e manichette per aziende e uffici del Ticino; Ditta antincendio che fa estintori, porte tagliafuoco (REI) e impianti di rivelazione fumo; Manutentore di porte automatiche e barriere per supermercati
- *Flusso:* Ogni impianto/presidio ha una verifica obbligatoria a scadenza fissa (semestrale/annuale/biennale) → lo scadenziario avvisa prima → si pianifica il giro → il tecnico fa il controllo, compila il registro e firma → si emette il certificato/verbale per il cliente → si fissa la prossima scadenza. In parallelo, per gli ascensori, chiamate urgenti con persone bloccate (SLA, reperibilità). Da tracciare: TUTTE le scadenze obbligatorie, lo storico verifiche per presidio, le chiamate urgenti.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `man`, `zone`
- *Moduli specifici da costruire:*
    - `scadenziario` — Scadenzario dei controlli obbligatori: per ogni cliente/impianto le date delle verifiche di legge con avvisi automatici prima della scadenza
    - `presidi` — Censimento presidi antincendio: estintori, manichette, idranti, porte REI per ubicazione, matricola e scadenza ricarica/collaudo
    - `impianti` — Parco ascensori/porte automatiche: matricola, condominio/cliente, ubicazione, storico e prossima verifica periodica
    - `chiamate` — Chiamate urgenti e reperibilità: ticket di guasto, segnalazione persone bloccate, tempi d'intervento (SLA) e turni di reperibilità
    - `registro-an` — Registro e certificati antincendio: verbali di controllo, firme e storico per cliente in PDF

**Verde & Esterni (giardinaggio, manutenzione verde, piscine)**
- *Attività esempio:* Giardiniere paesaggista che fa sfalci e potature stagionali per ville e condomini del Malcantone; Ditta di manutenzione verde per giardini privati con contratto annuale a giro fisso; Costruttore e manutentore piscine con assistenza settimanale estiva nel Mendrisiotto; Service piscine condominiali e di hotel con apertura/chiusura stagionale; Impresa di sgombero neve e cura esterni per immobili commerciali
- *Flusso:* Cliente a contratto → calendario stagionale ricorrente (sfalcio mensile, potatura primaverile, trattamento piscina settimanale) → il giro giornaliero assegna squadra + mezzi a una lista di clienti, ottimizzando l'ordine sulla mappa → per le piscine si registrano i valori acqua (cloro/pH) e i prodotti dosati → rapportino e ore. Da tracciare: ricorrenze stagionali per cliente, giri del giorno con mezzi assegnati, log trattamenti acqua.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `man`, `sites`, `zone`, `conti`
- *Moduli specifici da costruire:*
    - `ricorrenze` — Manutenzioni programmate ricorrenti: genera in automatico i prossimi appuntamenti (sfalcio mensile, potatura stagionale, trattamento piscina settimanale)
    - `giri` — Giri giornalieri: assegna squadra + mezzi a un giro di clienti e ottimizza l'ordine delle tappe sulla mappa
    - `mezzi` — Mezzi e attrezzature (rasaerba, decespugliatori, furgoni) con assegnazione al giro/squadra e scadenze (revisione, tagliando)
    - `trattamenti` — Trattamenti acqua piscina: valori cloro/pH misurati, prodotti dosati, log per piscina e checklist apertura/chiusura stagionale

**Igiene & Ambienti (imprese di pulizia, disinfestazione/pest control)**
- *Attività esempio:* Impresa di pulizie per uffici, banche e studi medici con squadre fisse a Lugano; Ditta di pulizie condominiali e fine cantiere nel Bellinzonese; Disinfestatore/derattizzatore con contratti HACCP per ristoranti e panetterie; Pest control per industrie alimentari e supermercati con stazioni esca monitorate; Impresa di sanificazione e pulizia vetri per centri commerciali
- *Flusso:* Pulizie: commesse/sedi cliente ricorrenti con planning settimanale, turni delle squadre per sede, checklist qualità firmata sul posto a fine servizio. Pest control: mappa delle stazioni esca per sito, interventi periodici programmati, registrazione catture/ricariche e registro HACCP con certificato per il cliente. Da tracciare: planning settimanale per sede, presenze/turni squadre, controlli qualità e (per il pest control) stazioni e registro HACCP.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `commesse` — Commesse/sedi cliente ricorrenti con planning settimanale dei servizi e delle squadre assegnate
    - `qualita` — Checklist di controllo qualità del lavoro svolto, compilata e firmata sul posto a fine servizio
    - `stazioni` — Mappa delle stazioni esca/monitoraggio per sito: planimetria, catture, ricariche e stato per ogni punto
    - `haccp` — Registro HACCP e certificati di intervento per cliente (ristoranti, panetterie, industrie alimentari)
    - `ricorrenze` — Interventi periodici programmati (sanificazioni, derattizzazioni) generati in automatico

**Veicoli (autofficina, gommista, elettrauto)**
- *Attività esempio:* Autofficina multimarca con cambio gomme stagionale per privati del Mendrisiotto; Gommista/centro pneumatici con deposito gomme per clienti a Chiasso; Elettrauto e specialista auto elettriche/ibride nel Luganese; Officina con preparazione al collaudo (controllo periodico veicoli); Carrozzeria con gestione preventivi e rapporti per le assicurazioni
- *Flusso:* Cliente prenota (tagliando, gomme, riparazione) → accettazione veicolo → preventivo ricambi + manodopera → accettazione cliente → lavorazione → scheda veicolo aggiornata (km, storico interventi) → consegna. Picchi stagionali fortissimi sul cambio gomme (con deposito pneumatici del cliente). Da tracciare: agenda officina molto fitta, preventivi accettati/rifiutati, storico per targa, dove sono depositate le gomme di ogni cliente.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `man`, `conti`, `magazzino`
- *Moduli specifici da costruire:*
    - `veicoli` — Schede veicolo: targa, modello, km, storico tagliandi e interventi, promemoria prossimo servizio/collaudo
    - `preventivi` — Preventivo ricambi + manodopera → invio → accettazione del cliente → diventa ordine di lavoro
    - `prenota` — Prenotazione online degli appuntamenti officina con slot e tipo di servizio (gestisce i picchi del cambio gomme)
    - `depositi` — Deposito gomme/pneumatici per cliente: set, posizione a magazzino, stagione e promemoria per il cambio successivo

---

### 🏗️ Cantiere — Gestionale base per edilizia, costruzioni e artigianato edile  *(archetipo: commessa-progetti)*
_Il gestionale base per chi lavora su commessa e in cantiere: impresa edile, ristrutturatori, imbianchini, muratori, posatori, cartongessisti, falegnami su misura, fabbri, lattonieri, serramentisti. Il cuore non è l'appuntamento ma la COMMESSA: dal preventivo (manodopera + materiali) all'accettazione, al cantiere con ore squadra e mezzi, fino al SAL (stato avanzamento lavori) e alla consegna. Si appoggia sul modulo cantieri 'sites' già pronto e lo arricchisce con preventivi, avanzamenti, rapportini firmati e gestione sicurezza/documenti di cantiere. Niente fatturazione fiscale completa: si ferma a preventivo + conti (incassi/spese/utile a commessa). Pensato per PMI artigiane svizzere/ticinesi dove il titolare è anche in cantiere e vuole sapere quanto guadagna su ogni lavoro._

> 🇨🇭 **Mercato CH:** Domanda reale ALTA e disponibilita a pagare ALTA: l'edilizia e tra i settori piu forti dell'economia ticinese/svizzera, con migliaia di PMI artigiane (muratori, pittori, serramentisti, falegnami) dove il titolare e spesso anche in cantiere e gestisce ancora con Excel, blocco note e fatture cartacee. Il dolore numero uno e 'quanto guadagno davvero su questa commessa?' (ore squadra + materiali + noli vs. preventivo): qui MODULA con sites+conti+preventivi+sal colpisce esattamente dove bexio e debole, restando complementare (bexio fa la contabilita/fattura QR, MODULA l'operativita di cantiere). SPECIFICITA LOCALI: (1) i SAL e la committenza pubblica cantonale/comunale chiedono documentazione formale di avanzamento e sicurezza -> moduli sal/sicurezza/documenti hanno valore percepito alto. (2) SUVA: la sicurezza sul lavoro in edilizia e fortemente normata (lavori in quota, ponteggi, formazione) e i controlli SUVA sono temuti -> il modulo sicurezza con scadenze formazione e DPI e un argomento di vendita concreto. (3) Manodopera frontaliera/CCL edilizia: tante imprese ticinesi hanno operai frontalieri con rilevamento ore rigoroso (CCL, ore notturne, indennita) -> il rilevamento ore a cantiere e prezioso, ma attenzione: NON e un sistema di timbratura conforme nel senso giuridico (positioning come 'rapportino ore', non 'libro paga'). (4) Lingue: Ticino italofono e coperto subito; per scalare a Svizzera tedesca (dove l'edilizia e enorme) e Romandia servono DE/FR, qui solo dopo. VINCOLO DI SCOPE da rispettare: niente fatturazione fiscale/IVA ne QR-fattura completa -> ci si ferma a preventivo + conti a commessa; va detto chiaramente al cliente edile che per la fattura QR svizzera continua a usare il suo gestionale contabile. WhatsApp (utile per mandare foto/preventivi al cliente) resta 'prossimamente'. Prezzo sostenibile: un'impresa edile con 5-15 operai sta tranquillamente nei CHF 59-190/mese, e il pacchetto 'Tutto compreso' a utenti illimitati ha senso per chi mette in mano l'app a tutta la squadra in cantiere.

**Imprese di costruzione e ristrutturazione (generale)**
- *Attività esempio:* Impresa di costruzioni generale che fa rustici e ristrutturazioni di palazzine in Ticino; Impresa edile per ristrutturazioni chiavi in mano di appartamenti (Lugano, Bellinzona); Impresa di muratura e opere in cemento armato per villette unifamiliari; Capomastro / impresa che coordina sottoappalti (scavi, gettate, finiture); Impresa di risanamento facciate e cappotto termico (isolamento)
- *Flusso:* Sopralluogo -> preventivo dettagliato (voci manodopera + materiali + noli) -> accettazione cliente -> apertura cantiere con squadra assegnata -> registrazione ore squadra e materiali giorno per giorno -> avanzamento per fasi (SAL) -> incassi acconti/saldo a commessa -> consegna. Il titolare deve sapere ogni sera ore fatte, materiali usati e margine residuo per cantiere.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `preventivi` — Preventivo a voci (manodopera + materiali + noli) con quantita e prezzo unitario -> invio PDF -> stato bozza/inviato/accettato/rifiutato -> alla conferma genera in automatico il cantiere collegato. Trasversale, da costruire presto.
    - `sal` — Stati Avanzamento Lavori: suddivide la commessa in fasi/lotti con percentuale completata, importo maturato a SAL e residuo; storico avanzamenti con data per chiedere acconti al cliente.
    - `mezzi` — Mezzi e attrezzature (betoniera, ponteggi, gru a torre, escavatore) assegnati al cantiere, con scadenze revisione/manutenzione e noli a carico commessa. Trasversale.

**Finiture e decorazione (imbianchini, intonacatori, cartongessisti, pavimentisti)**
- *Attività esempio:* Pittore/gessatore (imbianchino) per interni ed esterni di abitazioni e uffici; Impresa di intonaci e stucchi a calce / spatolati decorativi; Posatore di pavimenti e rivestimenti (piastrelle, parquet, resina) per bagni e cucine; Cartongessista per controsoffitti, pareti divisorie e velette in studi/negozi; Posatore di pavimenti industriali in resina per capannoni e officine
- *Flusso:* Rilievo superfici in loco (mq pareti/pavimenti) -> preventivo a mq con materiali -> conferma -> lavorazione per ambienti/locali con checklist (preparazione, prima mano, finitura) -> foto prima/dopo -> rapportino firmato a fine lavoro -> incasso. Spesso piu cantieri piccoli in parallelo nella stessa settimana, conta organizzare la squadra giorno per giorno.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `rilievi` — Rilievo misure in loco: per cliente/cantiere registra dimensioni (mq pareti, mq pavimento, ml battiscopa), foto quotate e note ambiente per ambiente; alimenta direttamente il preventivo a mq.
    - `interventi` — Rapportino di lavoro firmato: lavoro svolto, ore, materiali usati, foto prima/dopo, firma cliente su schermo, esito -> PDF. Trasversale, utile a tutte le finiture.
    - `preventivi` — Preventivo a mq / a corpo con voci materiali e manodopera -> invio -> accettazione -> diventa cantiere. Trasversale.

**Serramenti, infissi e facciate continue**
- *Attività esempio:* Serramentista che produce e posa finestre in PVC/alluminio/legno su misura; Installatore di porte blindate, portoni da garage e tapparelle/avvolgibili; Posatore di facciate continue e vetrate per edifici commerciali; Azienda di zanzariere, tende da sole e pergole bioclimatiche; Rivenditore-posatore di porte interne e armadiature su misura
- *Flusso:* Rilievo misure precise in loco (ogni foro e diverso) -> preventivo con codici prodotto e accessori -> conferma e acconto -> ordine al fornitore / produzione -> attesa consegna materiale -> planning pose con squadra -> posa + collaudo apertura/chiusura -> consegna firmata e saldo. Il punto critico e collegare il rilievo all'ordine e non sbagliare le misure.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `rilievi` — Rilievo misure infissi in loco: scheda per ogni foro (larghezza, altezza, controtelaio, verso apertura, colore, accessori), foto; diventa la base di preventivo e ordine. Trasversale con le finiture.
    - `pose` — Planning delle pose: pianifica le giornate di posa per cantiere con squadra assegnata, stato (in attesa materiale / pronto / posato / collaudato), checklist consegna e collaudo apertura/chiusura.
    - `ordini-forn` — Ordini a fornitore collegati alla commessa: cosa e stato ordinato (codici/quantita), data prevista consegna, alert merce arrivata -> sblocca la posa. Evita di posare prima che il materiale sia in magazzino.

**Falegnameria e arredo su misura**
- *Attività esempio:* Falegnameria che realizza cucine, armadi e librerie su misura; Laboratorio di mobili e scale in legno per chalet e residenze di montagna; Falegname per restauro mobili antichi e infissi storici; Allestitore di negozi e stand fieristici in legno; Produttore di rivestimenti, perline e arredo per ristoranti/hotel
- *Flusso:* Sopralluogo e rilievo -> progetto/disegno e preventivo -> conferma con acconto -> produzione in laboratorio (lavorazioni e tempi banco) -> finitura -> consegna e montaggio in loco -> saldo. Qui c'e una doppia anima: ore di LABORATORIO (produzione) + ore di CANTIERE (montaggio), e materiali pregiati da rendicontare per commessa.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `commesse-lab` — Commessa di laboratorio: oltre alle ore di cantiere traccia le ore di produzione in officina per fase (taglio, assemblaggio, verniciatura, montaggio), cosi il titolare vede il costo manodopera totale del mobile/arredo.
    - `preventivi` — Preventivo a corpo con distinta materiali (essenze, ferramenta, elettrodomestici) e ore stimate -> accettazione -> commessa. Trasversale.
    - `portfolio` — Portfolio lavori realizzati: galleria foto per commessa/cliente con descrizione e materiali usati, riutilizzabile come riferimento commerciale per nuovi clienti.

**Lattoneria, coperture e impermeabilizzazioni (tetti)**
- *Attività esempio:* Lattoniere per grondaie, scossaline e rivestimenti in rame/zinco-titanio; Impresa di coperture in tegole, lose o lamiera per tetti a falde; Specialista in impermeabilizzazione di tetti piani e terrazze (guaine, PVC); Posatore di lucernari, abbaini e linee vita anticaduta sui tetti; Manutentore tetti: pulizia gronde, riparazioni infiltrazioni, controlli stagionali
- *Flusso:* Sopralluogo sul tetto (spesso con foto/drone) -> preventivo -> conferma -> montaggio ponteggio/linea vita -> lavoro in quota con squadra -> rapportino con foto -> consegna. Ad alto rischio: la sicurezza in quota e i controlli di cantiere sono obbligatori, e c'e una componente di manutenzione ricorrente (controllo tetti, pulizia gronde) che si presta a contratti.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `man`, `conti`
- *Moduli specifici da costruire:*
    - `sicurezza` — Sicurezza cantiere: DPI e dispositivi anticaduta assegnati, checklist montaggio ponteggio/linea vita, scadenze formazione operai (lavori in quota) e documenti obbligatori per cantiere. Critico in copertura.
    - `interventi` — Rapportino con foto prima/dopo e firma cliente, indispensabile per documentare riparazioni e infiltrazioni in quota. Trasversale.
    - `contratti-man` — Contratti di manutenzione ricorrenti (controllo tetti / pulizia gronde annuale o semestrale) con rinnovo e alert 'in scadenza'. Trasversale.

**Carpenteria metallica e fabbri**
- *Attività esempio:* Fabbro per cancelli, ringhiere, inferriate e parapetti su misura; Carpenteria metallica per strutture in acciaio (capannoni, soppalchi, scale); Realizzatore di scale e balaustre in ferro/inox e vetro; Officina di saldatura per tettoie, pensiline e pergole metalliche; Pronto intervento serrature, serrande e porte automatiche
- *Flusso:* Rilievo e disegno -> preventivo (kg acciaio + ore officina + posa) -> conferma -> produzione in officina (taglio, saldatura, zincatura/verniciatura) -> trasporto e posa in cantiere -> collaudo -> saldo. Come la falegnameria ha ore officina + ore cantiere; in piu spesso fa pronto intervento (serrature/serrande) che e lavoro a chiamata, non a commessa.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `commesse-lab` — Ore di officina per fase (taglio, saldatura, trattamento, posa) accanto alle ore di cantiere, per il costo manodopera reale del manufatto in ferro. Condiviso con la falegnameria.
    - `interventi` — Rapportino firmato con foto per il pronto intervento (serrature, serrande, porte automatiche) fatto a chiamata fuori commessa. Trasversale.
    - `preventivi` — Preventivo con voci materiale (kg/ml profilati, ferramenta) + ore + posa -> accettazione -> commessa. Trasversale.

**Movimento terra, demolizioni e opere esterne**
- *Attività esempio:* Impresa di scavi, sbancamenti e movimento terra con escavatori; Ditta di demolizioni e smaltimento macerie (gestione discarica/inerti); Pavimentazioni esterne: posa autobloccanti, cordoli, asfaltatura vialetti; Opere di urbanizzazione e sottoservizi (fognature, allacciamenti); Posa muri di sostegno, recinzioni e sistemazioni di giardini/terrazzamenti
- *Flusso:* Sopralluogo e preventivo (spesso a misura: mc scavo, mq pavimentazione) -> conferma -> mobilitazione mezzi pesanti e personale -> lavoro a giornata con rilevamento mezzi/ore -> gestione viaggi camion e smaltimento -> avanzamento e consegna. Il cuore qui sono i MEZZI pesanti (costi orari alti) e i viaggi di trasporto/smaltimento da imputare alla commessa.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `mezzi` — Parco mezzi pesanti (escavatori, camion, dumper) con ore/giornate per cantiere, costo orario, scadenze revisione/tagliando e manutenzioni. Cuore di questo settore. Trasversale.
    - `viaggi` — Registro viaggi e smaltimento: numero viaggi camion per cantiere, materiale trasportato (terra/inerti/macerie), destinazione (discarica/cava) e costo, da imputare alla commessa.
    - `sal` — Avanzamento a misura per le voci quantificabili (mc scavati, mq pavimentati) con maturato e residuo. Condiviso con l'edile generale.

**Cantieri pubblici e appalti (impresa strutturata)**
- *Attività esempio:* Impresa edile che lavora ad appalti del Cantone/Comune (strade, edifici pubblici); General contractor che coordina piu sottoappaltatori su grandi cantieri; Impresa con piano di sicurezza e coordinamento (PSC) e direzione lavori; Consorzio di artigiani per opere su edifici scolastici/sanitari; Impresa che deve documentare ore, sicurezza e SAL per la committenza pubblica
- *Flusso:* Gara/appalto -> commessa con capitolato a voci -> pianificazione fasi e sottoappalti -> esecuzione con rilevamento ore squadra e mezzi -> SAL formali firmati per liberare i pagamenti dalla committenza -> gestione documentale sicurezza (POS/PSC, formazione) -> collaudo e consegna. Qui SAL e SICUREZZA non sono un di piu ma un obbligo contrattuale con la committenza.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `sal` — SAL formali: fasi/voci di capitolato con % e importo maturato, generazione documento di avanzamento per la committenza e storico pagamenti collegati. Trasversale con l'edile.
    - `sicurezza` — Gestione sicurezza cantiere: archivio POS/PSC, registro DPI, scadenze formazione e idoneita sanitaria degli operai, checklist controlli con avvisi. Condiviso con coperture/tetti.
    - `documenti` — Archivio documenti di commessa (capitolato, contratti, certificati materiali, verbali, foto consegna) ordinato per cantiere, accessibile in loco dal telefono. Gia in coda nel catalogo.

---

### 🏔️ Ricezione & Alloggi  *(archetipo: ospitalita)*
_Gestionale base per chi affitta posti letto: dalla camera d'hotel al rifugio alpino, dal B&B all'appartamento su Airbnb. Cuore comune: una mappa visiva delle unità (camere/piazzole/posti letto) su un calendario, con disponibilità in tempo reale, arrivi/partenze del giorno, tariffe che cambiano per stagione, e la tassa di soggiorno calcolata e rendicontata al Comune. Un solo planner prenotazioni con vista a griglia (unità × giorni) è il modulo che tiene insieme tutta la famiglia; sopra ci si innesta ciò che distingue un hotel da un campeggio o da un host con 2 appartamenti. NB: niente fatturazione fiscale piena (si usano preventivi+conti); il channel manager verso i portali (Booking/Airbnb) e i pagamenti online sono i due punti dove una PMI seria potrebbe voler integrare strumenti esterni — lo segnalo come limite di scope._

> 🇨🇭 **Mercato CH:** Domanda reale e disponibilità a pagare: il turismo è un pilastro economico ticinese (Lago Maggiore/Lugano, valli, Tenero capitale dei camping in CH). Tante micro-strutture (B&B, garni, host Airbnb, agriturismi, rifugi) oggi lavorano con carta+Excel o con un PMS estero costoso e sovradimensionato: c'è spazio per un gestionale semplice in italiano a prezzo PMI. Gli host plurinmobile e i property manager sono i clienti più disposti a pagare un canone perché il dolore (overbooking, pulizie, rendiconti) è alto.

Specificità locali/normative: (1) Tassa di soggiorno cantonale/comunale obbligatoria — il calcolo per notte×persona con esenzioni e il rendiconto al Comune è IL gancio commerciale che differenzia dai PMS generici; va modellata su Ticino ma resa configurabile perché aliquote/regole cambiano per Cantone e Comune. (2) Notifica degli alloggiati alla polizia (schedine ospiti) prevista per legge per le strutture ricettive: il modulo checkin deve raccogliere i dati richiesti — qui scatta la skill dati-sensibili/GDPR perché si trattano documenti d'identità. (3) I rifugi sono spesso legati a CAS/SAT con tariffe soci.

Lingue: beachhead in italiano, ma il turismo è il settore dove serve prima il multilingue — un albergo a Lugano o un camping a Tenero ha clienti DE/FR/EN; almeno le viste rivolte all'ospite (conferme, schede) andrebbero pensate multilingua presto.

Limiti di scope da segnalare: (a) Channel manager bidirezionale verso Booking/Airbnb (push prezzi+disponibilità) è oltre lo scope attuale — si parte con import .ics e gestione manuale; è però la richiesta n.1 di host e hotel, quindi è il primo candidato a integrazione esterna. (b) Pagamenti online/caparre con carta richiedono un gateway: per ora preventivi+conti, con incasso registrato a mano. (c) Niente fatturazione fiscale/IVA piena: per hotel/residence che la richiedono davvero (clientela business, IVA al 3.8% alloggio in CH) va segnalato come confine del prodotto, eventualmente coperto con preventivi+conti o export verso il commercialista.

**Hotel, garni e pensioni**
- *Attività esempio:* Hotel 3 stelle a Lugano-Paradiso (30-50 camere, mezza pensione); Garni / albergo familiare in Val Verzasca o a Locarno (10-20 camere, colazione); Pensione storica a Bellinzona gestita da una famiglia; Boutique hotel sul lungolago di Ascona con ristorante interno; Hotel di montagna ad Airolo aperto solo stagione sci+estate
- *Flusso:* Ogni giorno: vista del planner camere (chi parte, chi arriva, camere da rifare per le pulizie), check-in con documento ospite e assegnazione camera, check-out con conto, blocco camere fuori servizio. Tariffe diverse per stagione/giorno settimana e per trattamento (B&B vs mezza pensione). A fine soggiorno: tassa di soggiorno per notte/persona e rendiconto periodico al Comune.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `preventivi`
- *Moduli specifici da costruire:*
    - `camere` — Anagrafica unità alloggio: camere/suite con tipologia, n. letti, piano, dotazioni, stato (libera/occupata/pulizia/fuori servizio); base per planner e pulizie.
    - `planner-prenotazioni` — Griglia visiva unità × giorni con drag per spostare/allungare un soggiorno; mostra disponibilità in tempo reale, overbooking warning, arrivi/partenze del giorno. È il modulo-cardine della famiglia.
    - `tariffe` — Listino tariffario per stagione/periodo e tipologia camera, con prezzi diversi per trattamento (solo notte, B&B, mezza pensione) e regole min-stay.
    - `tassa-soggiorno` — Calcolo automatico tassa di soggiorno per notte×persona (con esenzioni bambini/residenti), riepilogo mensile/trimestrale pronto per il rendiconto al Comune.
    - `pulizie-camere` — Housekeeping: lista camere da rifare oggi (partenze + fermate), assegnazione alla cameriera ai piani, spunta 'pulita/controllata', stato che si riflette sul planner.
    - `checkin` — Check-in/out digitale: registrazione ospite (dati per la notifica alloggiati alla polizia), assegnazione camera, conto soggiorno a fine stay.

**B&B e affittacamere**
- *Attività esempio:* B&B a conduzione familiare sulle colline del Mendrisiotto (3-5 camere); Affittacamere sopra un'osteria in un grotto ticinese; Camere con colazione in una casa d'epoca a Morcote; B&B di campagna con 4 camere e prima colazione a km zero in Valle di Muggio
- *Flusso:* Poche camere, gestione di una persona sola dal telefono: vedere il mese a colpo d'occhio, segnare una prenotazione presa per telefono/email, sapere chi arriva domani e a che ora, preparare la colazione in base alle presenze, incassare a fine soggiorno e tenere il conto della tassa di soggiorno.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `camere` — Le poche camere con n. letti e stato; versione leggera dell'anagrafica unità.
    - `planner-prenotazioni` — Calendario mese/camera semplificato per segnare a mano le prenotazioni e vedere il libero/occupato senza overbooking.
    - `tariffe` — Prezzo a notte per camera con eventuale tariffa alta/bassa stagione; niente complessità da hotel.
    - `tassa-soggiorno` — Conteggio notti×persone per il rendiconto comunale della tassa di soggiorno, anche per chi non ha un gestionale.
    - `colazioni` — Lista presenze a colazione per data (n. persone, intolleranze/note dieta) per organizzare la spesa e la preparazione.

**Affitti brevi / case vacanza (host Airbnb)**
- *Attività esempio:* Host con 3 appartamenti su Airbnb/Booking tra Lugano e Ascona; Property manager che gestisce 8-15 case vacanza per proprietari terzi sul lago Maggiore; Rustico ristrutturato in Valle Maggia affittato a settimana; Monolocale per turismo di lavoro a Mendrisio gestito a distanza; Chalet a Airolo affittato su più portali in stagione
- *Flusso:* Più unità sparse, prenotazioni che arrivano da portali diversi: evitare doppie prenotazioni, sapere ogni giorno quali appartamenti hanno cambio ospite (check-out + check-in), coordinare pulizie e consegna chiavi/codici, registrare l'incasso e la commissione del portale, e per chi gestisce case altrui rendicontare al proprietario quanto gli spetta.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`, `zone`
- *Moduli specifici da costruire:*
    - `unita-affitto` — Anagrafica appartamenti/case: indirizzo, n. ospiti max, dotazioni, codice serratura/box chiavi, note d'accesso e wifi; sostituisce 'camere' per il caso multi-immobile.
    - `planner-prenotazioni` — Griglia multi-unità con disponibilità e blocco date; cuore per evitare overbooking tra le case.
    - `canali-portali` — Registro prenotazioni per canale (Airbnb/Booking/diretto) con commissione e netto incassato; import calendario .ics dai portali per allineare le date (sync automatico verso i portali = prossimamente).
    - `turni-pulizie` — Pianificazione cambi: per ogni partenza genera il task pulizia con orario finestra check-out→check-in, assegnato all'addetto/impresa, con checklist e foto.
    - `rendiconto-proprietari` — Per i property manager: report periodico per ogni proprietario con incassi, commissioni, costi pulizia e netto da girare.
    - `tassa-soggiorno` — Calcolo e riepilogo tassa di soggiorno per Comune, anche con immobili in comuni diversi.

**Agriturismi e alberghi diffusi**
- *Attività esempio:* Agriturismo con camere e ristoro in collina nel Malcantone; Azienda agricola con alloggio e vendita prodotti propri (formaggi, vino) nel Mendrisiotto; Albergo diffuso in un nucleo storico di valle (Corippo, modello tipico ticinese); Fattoria didattica con pernottamento e attività per gruppi/scuole
- *Flusso:* Alloggio intrecciato ad altre attività: camere/unità sparse nel nucleo, ristoro per gli ospiti e per esterni, vendita di prodotti dell'azienda, a volte attività/esperienze prenotabili. Serve gestire le presenze a tavola insieme ai pernottamenti, tenere il conto unico dell'ospite (notti + cena + prodotti) e la tassa di soggiorno.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `preventivi`
- *Moduli specifici da costruire:*
    - `camere` — Unità di alloggio (camere/casette del nucleo) con stato e planner.
    - `planner-prenotazioni` — Disponibilità delle unità anche quando sono distribuite su più edifici del borgo.
    - `ristoro-ospiti` — Presenze a cena/pranzo per data e tavolo, menù del giorno, abbinabile al conto camera dell'ospite.
    - `esperienze` — Attività/esperienze prenotabili (degustazione, visita fattoria, trekking) con posti, orario e partecipanti.
    - `tassa-soggiorno` — Conteggio e rendiconto comunale della tassa di soggiorno.

**Ostelli e residence (soggiorni lunghi)**
- *Attività esempio:* Ostello della gioventù a Lugano o Bellinzona con camerate e camere private; Residence per soggiorni di lavoro/medio termine a Mendrisio o Chiasso; Foresteria aziendale per stagionali e cantieri; Studentato/alloggio temporaneo vicino a USI/SUPSI
- *Flusso:* Si vende il posto-letto (non solo la camera): camerate condivise miste, prezzo a letto, ospiti che entrano/escono in giorni diversi nella stessa stanza. Per i residence: contratti a settimana/mese, caparra, pulizia periodica. Serve sapere quanti letti liberi per data e gestire chi resta a lungo.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `posti-letto` — Gestione a livello di singolo letto dentro camerate condivise: assegnazione letto per ospite, disponibilità per posto e non solo per camera.
    - `planner-prenotazioni` — Griglia letti × giorni per le camerate, più camere private; vede i letti liberi anche con ospiti sovrapposti.
    - `tariffe` — Prezzo a letto/notte, tariffe a settimana/mese per i soggiorni lunghi dei residence, sconti per durata.
    - `contratti-soggiorno` — Per medio termine: contratto con caparra, periodo, rinnovo e scadenza, alert fine soggiorno (riusa la logica di contratti-man).
    - `tassa-soggiorno` — Conteggio notti per il rendiconto comunale, con casistica soggiorni lunghi/esenzioni.

**Campeggi e villaggi turistici**
- *Attività esempio:* Campeggio sul lago Maggiore (Tenero-Gordola, zona ad alta densità di camping); Camping con piazzole tende/camper e bungalow/mobil-home a Muralto; Area sosta camper attrezzata in una valle ticinese; Villaggio turistico con piazzole stagionali e casette in affitto
- *Flusso:* Si prenotano piazzole e casette, non camere: mappa del campeggio con piazzole numerate, disponibilità per tipo (tenda/camper/bungalow), allacci luce/acqua, ospiti che arrivano per più notti. Tariffa per piazzola + persona + auto + corrente, e tassa di soggiorno. Spesso piazzole 'stagionali' occupate tutta l'estate.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `zone`
- *Moduli specifici da costruire:*
    - `piazzole` — Anagrafica piazzole/casette: numero, tipo (tenda/camper/bungalow), dimensione, allacci disponibili, posizione sulla mappa; variante di 'camere' per l'aria aperta.
    - `planner-prenotazioni` — Griglia piazzole × giorni con disponibilità per tipo e blocco delle piazzole stagionali.
    - `tariffe-camping` — Tariffa composta: piazzola + a persona + auto/camper + corrente + animale, per alta/bassa stagione.
    - `mappa-campeggio` — Pianta visiva del campeggio con stato piazzole (libera/occupata/in arrivo); appoggiata a 'zone' per la parte mappa.
    - `tassa-soggiorno` — Calcolo per notte×persona e rendiconto comunale (i camping muovono grandi volumi di tassa).

**Rifugi alpini e capanne**
- *Attività esempio:* Capanna CAS/SAT in alta quota (es. Capanna Cristallina, Adula, Cadlimo); Rifugio di valle con cucina e camerate per escursionisti; Capanna sociale gestita da volontari nel weekend; Bivacco/agriturismo d'alpe con posti letto e ristoro stagionale
- *Flusso:* Stagione corta e posti limitati: prenotazione del posto-letto in camerata, mezza pensione quasi obbligata (cena + pernotto + colazione), gestione di gruppi (club alpini, scuole), conferma e a volte caparra. Il gestore deve sapere quanti posti restano per ogni notte e quante persone cucinare; pagamento spesso in contanti, niente fatturazione complessa.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `posti-letto` — Posti in camerata per il rifugio: disponibilità per notte a livello di singolo posto, gestione gruppi e soci club alpino.
    - `planner-prenotazioni` — Calendario posti per notte nella stagione di apertura, con tetto massimo e lista d'attesa.
    - `mezza-pensione` — Conteggio coperti cena/colazione per data e gruppo, note diete/allergie, per organizzare la cucina e il conto a persona.
    - `tassa-soggiorno` — Conteggio pernottamenti per il rendiconto, dove dovuto (alcune capanne/comuni la applicano).

---

### 🍽️ Gusto — Gestionale base ristorazione, bar & food  *(archetipo: ristorazione)*
_Un unico gestionale base per tutto il mondo food&beverage: dalla trattoria al food truck, dalla pasticceria al catering. Il cuore comune a tutti è la gestione del personale a turni (il costo più pesante e variabile del settore), il controllo del food cost / magazzino con i fornitori, e il flusso di servizio quotidiano (sala, banco, asporto, eventi). Da questa base comune ogni attività accende solo i moduli che le servono: chi ha la sala accende prenotazioni tavoli e mappa sala; chi è bar/asporto accende fila e cassa veloce; chi produce (pasticceria, panetteria, gelateria) accende laboratorio/produzione e ricette con food cost; chi fa catering accende preventivi evento e logistica. NON è un POS fiscale né una fatturazione IVA completa (vincolo di scope): per i conti si usano conti + preventivi per gli eventi. Il valore vero per il titolare PMI è capire ogni giorno quanto incassa, quanto spende in personale e materie prime, e quanto margine resta — cose che oggi gestisce a memoria o su Excel._

> 🇨🇭 **Mercato CH:** DOMANDA REALE: la ristorazione è il settore con più PMI in Ticino (migliaia di esercizi tra grotti, ristoranti, bar, pasticcerie) e con marginalità sottilissima: il controllo di food cost e costo-personale è una necessità sentita, non un lusso. Oggi quasi tutti gestiscono a memoria, su agenda cartacea o Excel. La leva di vendita più forte non è la prenotazione tavoli (esistono già OpenTable/Lastminute/Fortytwo) ma il binomio TURNI + FOOD COST/MAGAZZINO che nessuno dei competitor offre a prezzo PMI in modo semplice. DISPONIBILITÀ A PAGARE: i margini risicati rendono il ristoratore prudente sul costo fisso; conviene un abbonamento mensile basso in CHF con pochi posti-dipendente inclusi (sala+cucina di una trattoria sono 5-10 persone) e prezzo per posto aggiuntivo. Il catering/banqueting ha margini migliori ed è disposto a pagare di più (lavoro a commessa, ticket medio alto). SPECIFICITÀ LOCALI/NORMATIVE: (1) HACCP è obbligatorio per legge in CH — un futuro modulo haccp (già previsto per disinfestazione) con registro temperature/pulizie/scadenze e foto sarebbe un forte argomento di vendita e si riusa cross-settore; segnalo come opportunità trasversale. (2) Personale stagionale ed extra a chiamata è la norma (eventi, stagione lido/montagna) → i turni devono gestire avventizi e contratti brevi; attenzione ai permessi di lavoro frontalieri/stagionali, molto diffusi in Ticino. (3) Mance e gestione cassa in contanti ancora rilevanti. (4) LINGUE: Ticino italiano, ma per scalare a Grigioni/Svizzera interna e romanda serve presto IT/DE/FR — il menù/listino e le comunicazioni al cliente (promemoria prenotazione) vanno multilingua. VINCOLO SCOPE: niente fatturazione fiscale/IVA; per il fine-dining e il catering basta preventivi + conti, ma segnalo che alcune attività (catering aziendale verso aziende) chiederanno fatture vere → valutare in futuro un ponte verso un gestionale fiscale terzo, non costruirlo dentro Gusto.

**Ristoranti, pizzerie & trattorie (servizio a tavola)**
- *Attività esempio:* Grotto ticinese (es. Grotto della Salute, Lugano) con menù del giorno e tavolate weekend; Pizzeria al taglio + sala ad Bellinzona con forno a legna; Trattoria/osteria a conduzione familiare in valle (Vallemaggia) aperta solo a pranzo + venerdì-sabato sera; Ristorante fine-dining a Ascona con menù degustazione e carta vini; Ristorante etnico (asiatico/indiano) a Lugano con sala + asporto serale
- *Flusso:* Ogni giorno: prendere e gestire prenotazioni tavoli, assegnare i posti in sala (turni di servizio pranzo/cena, due servizi nel weekend), coprire i turni di camerieri e cucina, ordinare le materie prime ai fornitori in base al magazzino e alle prenotazioni attese, tracciare a fine servizio incasso e coperti per capire il margine. Punto critico: no-show prenotazioni e costo personale che mangia il margine.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `prenota-tavoli` — Prenotazioni tavoli con n. coperti, fascia/turno (1°/2° servizio), allergie/note, conferma e promemoria automatico al cliente; lista no-show per cliente abituale
    - `mappa-sala` — Piantina sala con tavoli e numero posti; stato tavolo (libero/prenotato/occupato), unione tavoli per tavolate, vista del turno a colpo d'occhio
    - `turni` — Turni e presenze del personale di sala e cucina con timbrature; copre il costo-lavoro per servizio (già in coda nel catalogo)
    - `food-cost` — Ricette dei piatti con costo ingredienti e prezzo di vendita → calcola food cost % e margine per piatto; rivaluta i costi quando cambiano i prezzi fornitore
    - `magazzino` — Scorte materie prime con soglia minima e scadenze; genera la lista ordini per fornitore (già in coda nel catalogo)

**Bar, caffetterie & lounge**
- *Attività esempio:* Caffè storico in Piazza Riforma a Lugano (colazioni, pranzi veloci, aperitivo); Bar di quartiere a Chiasso con tavolini, lotto e tabacchi; Cocktail bar / lounge a Lugano serale con eventi e DJ; Caffetteria specialty coffee a Locarno con torrefazione e brunch weekend; Bar dello stabilimento balneare / lido (stagionale, Lago Maggiore)
- *Flusso:* Ritmo a banco e turni lunghi: aprire/chiudere cassa, coprire i turni dei baristi (mattina presto colazioni, pranzo veloce, aperitivo serale), tenere sotto controllo scorte di caffè, bibite, alcolici e prodotti freschi, gestire eventuali tavolini con servizio. Punto critico: gestione turni con orari spezzati e controllo ammanchi cassa + consumi alcolici.
- *Moduli core:* `hub`, `cal`, `emps`, `notes`, `notif`, `conti`, `clients`
- *Moduli specifici da costruire:*
    - `turni` — Turni baristi con orari spezzati e cambio turno; presenze/timbrature (in coda nel catalogo)
    - `cassa-giornata` — Chiusura cassa di fine giornata: incasso per fascia, ammanchi/eccedenze, mance, confronto con i giorni precedenti — senza essere un POS fiscale
    - `magazzino` — Scorte banco (caffè, bibite, alcolici, snack) con soglia minima e riordino fornitori (in coda nel catalogo)
    - `eventi-bar` — Agenda serate/eventi (aperitivo a tema, DJ, sport in TV) con personale extra previsto e nota incasso atteso

**Pasticcerie, panetterie & gelaterie (produzione + vendita)**
- *Attività esempio:* Panetteria-pasticceria di paese (Mendrisiotto) con produzione notturna e vendita al banco; Pasticceria con laboratorio a Bellinzona che fa torte su ordinazione e cerimonie; Gelateria artigianale sul lungolago di Lugano (stagionale, vaschette + coni); Confiserie/Confiseur in stile svizzero-tedesco con cioccolateria; Forno bio con consegna pane a ristoranti e negozi della zona
- *Flusso:* Doppia anima produzione + vendita: pianificare la produzione del giorno/notte in base agli ordini su commissione (torte, cerimonie) e al venduto storico, gestire le ricette con il food cost (incidenza burro, cioccolato, frutta), tracciare scorte e scadenze materie prime, prendere e organizzare le ordinazioni dei clienti con data/ora di ritiro. Punto critico: ordini su commissione (torte cerimonie) e sfrido/invenduto a fine giornata.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `ordini-banco` — Ordinazioni su commissione (torte, cerimonie, vassoi): cliente, prodotto, data/ora ritiro, acconto, stato (da fare/pronto/ritirato); promemoria al cliente
    - `produzione` — Piano di produzione giornaliero/notturno: cosa e quanto produrre in base a ordini + storico venduto; checklist per il laboratorio
    - `food-cost` — Ricette con costo ingredienti e resa → food cost % e prezzo consigliato; ricalcolo automatico al variare dei prezzi materie prime
    - `magazzino` — Scorte materie prime (farine, burro, cioccolato, frutta) con soglie e scadenze, lista riordino fornitori (in coda nel catalogo)

**Catering, banqueting & eventi**
- *Attività esempio:* Catering aziendale per banche/uffici a Lugano (pranzi e coffee break); Banqueting matrimoni e cerimonie in tenuta/villa nel Sopraceneri; Servizio buffet per eventi fieristici e congressi (LAC, centri congressi); Personal chef / catering privato a domicilio per ville sul lago; Cucina da asporto per eventi sportivi e sagre di paese (Festa, polenta)
- *Flusso:* Lavoro a commessa per singolo evento: richiesta cliente → preventivo (menù, n. ospiti, personale, noleggi) → accettazione → pianificazione (spesa, produzione, squadra, mezzi/attrezzature, trasporto sul posto) → esecuzione evento → consuntivo costi/margine. Punto critico: preventivo evento accurato e logistica (personale + attrezzature + trasporto) per ogni data.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `preventivi` — Preventivo evento (menù + n. ospiti + personale + noleggi) → invio → accettazione → diventa commessa/evento pianificato (modulo trasversale del catalogo)
    - `eventi` — Scheda evento: data, luogo, n. ospiti, menù, timeline servizio, squadra assegnata, attrezzature e mezzi, checklist carico/scarico
    - `turni` — Assegnazione personale (anche extra/stagionali a chiamata) ai singoli eventi con ore e costo (in coda nel catalogo)
    - `mezzi` — Attrezzature e mezzi per evento (furgone, banchi, frigo, stoviglie a noleggio) con disponibilità per data (modulo trasversale del catalogo)

**Food truck & street food**
- *Attività esempio:* Food truck burger/piadine che gira mercati e fiere del Ticino; Ape-car caffè/aperitivo per eventi aziendali e matrimoni; Stand street food fisso al mercato del sabato (Bellinzona, Mendrisio); Truck pizza a domicilio per feste private in valle; Chiosco stagionale gelato/bibite in zona lido o passeggiata lago
- *Flusso:* Itinerante e a calendario eventi: decidere dove andare ogni giorno (mercati, fiere, eventi privati su prenotazione), caricare il truck con scorte sufficienti per la giornata, vendere a fila veloce, chiudere cassa a fine evento e capire se quella piazza/evento ha reso. Punto critico: scelta delle piazze redditizie e logistica scorte/permessi per location itinerante.
- *Moduli core:* `hub`, `cal`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `calendario-piazze` — Agenda location/eventi (mercato, fiera, evento privato) con indirizzo, orari, permesso/posteggio richiesto e incasso storico per piazza
    - `cassa-giornata` — Chiusura cassa per evento/piazza con incasso e raffronto resa per location, così si sceglie dove tornare
    - `magazzino` — Carico scorte del truck per la giornata e riordino minimo (in coda nel catalogo)
    - `zone` — Mappa delle piazze/eventi e dei clienti per eventi privati (modulo già pronto)

**Enoteche, gastronomie & negozi gastronomici**
- *Attività esempio:* Enoteca con mescita e vendita vini ticinesi (Merlot del Ticino) a Lugano; Gastronomia/salumeria con piatti pronti da asporto e tavola calda; Bottega di formaggi e prodotti alpini ticinesi con degustazioni; Drogheria-gastronomia di paese con consegna a domicilio; Wine bar con piccola carta e vendita bottiglie da portar via
- *Flusso:* Mix vendita prodotto + somministrazione: tenere il listino e le scorte (bottiglie, salumi, formaggi, piatti pronti) con scadenze, gestire la mescita/degustazione con qualche tavolo, organizzare eventi (degustazioni, serate a tema) su prenotazione, e per i clienti abituali gestire ordini e consegne. Punto critico: gestione listino + scorte con scadenze e clienti fidelizzati con ordini ricorrenti.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `catalogo` — Listino prodotti/etichette con prezzi e fornitore; base per ordini e scorte (in coda nel catalogo)
    - `magazzino` — Scorte con lotti e scadenze (vini per annata, salumi/formaggi a peso) e riordino fornitori (in coda nel catalogo)
    - `degustazioni` — Eventi degustazione/serate a tema su prenotazione: posti disponibili, iscritti, note, incasso atteso
    - `fidelity` — Clienti abituali con punti/promo e storico acquisti per ordini ricorrenti (in coda nel catalogo)

---

### 💇 Bellezza & Benessere  *(archetipo: su-appuntamento)*
_Gestionale base per tutto il mondo della cura della persona su appuntamento: parrucchieri, barbieri, estetiste/SPA, nail e make-up artist, tatuatori, solarium, centri massaggi e depilazione. Cuore comune: agenda con prestazioni e durate variabili, scheda cliente con storico trattamenti (colore, allergie, foto prima/dopo, consensi), fidelizzazione (punti/pacchetti/abbonamenti) e gestione del personale/poltrone. Si parte dai moduli BASE (hub, cal, clients, emps, notes, notif) + conti, e si accendono pochi moduli specifici per tipo di attività. NB scope: niente fatturazione fiscale/IVA, si usa conti per incassi e — se serve un'offerta scritta — preventivi; le prenotazioni online (prenota) e il magazzino prodotti (magazzino) sono ancora in coda e vanno costruiti/promessi. Il vero valore qui è l'agenda intelligente, la scheda trattamento e la fidelity, più che la contabilità._

> 🇨🇭 **Mercato CH:** Domanda reale e alta disponibilità a pagare: il Ticino ha una densità altissima di saloni e centri estetici (settore frammentato di micro-imprese, spesso 1-3 persone), con scontrini medi elevati (un colore + piega supera facilmente CHF 120-180, un'ora di massaggio CHF 100-140). Oggi molti usano agende cartacee o app gratuite straniere (Treatwell, Fresha) che però prendono commissione sulle prenotazioni online: MODULA può posizionarsi come 'la TUA agenda, senza commissioni e con i dati in Svizzera', argomento di vendita forte. Il punto debole degli incumbent come bexio è proprio l'operatività di salone (agenda multi-poltrona, schede colore, fidelity): qui MODULA è complementare, non sfida la contabilità. Specificità locali: (1) Lingue — il Ticino basta in italiano per il beachhead, ma per scalare oltre Gottardo servono DE e FR (mercato CH tedesco enorme); (2) Pagamenti — Twint è quasi obbligatorio come metodo, va previsto almeno come voce d'incasso in 'conti'; (3) Normative — tatuaggi/piercing e laser estetico sono soggetti a regole cantonali d'igiene e all'ordinanza federale sui prodotti cosmetici/radiazioni non ionizzanti: consenso informato e tracciabilità delle sedute non sono un 'nice to have' ma spesso un obbligo, il che rende i moduli consensi/scheda-tratt un vero argomento di vendita; (4) Dati sensibili — anamnesi, allergie, foto del corpo e PMU sono PII/dati sanitari: serve rigore GDPR/LPD (consensi, cancellazione, foto solo con consenso pubblicazione), allineato con la skill dati-sensibili. Scope da rispettare: niente fatturazione fiscale (basta 'conti' + eventuali 'ricevute-cm'/'preventivi'); la prenotazione online 'prenota' e il 'magazzino' prodotti rivendita sono in coda e vanno costruiti o venduti come 'prossimamente'; WhatsApp per i promemoria resta 'prossimamente'. Ostacolo realistico: il titolare-artigiano è poco digitale e tempo-povero — vince chi offre migrazione dati assistita (dall'agenda cartacea/Fresha) e un onboarding 'chiavi in mano'.

**Parrucchieri / Saloni hair**
- *Attività esempio:* Salone unisex con 4 poltrone a Lugano (taglio, piega, colore); Parrucchiere di quartiere a Bellinzona con clientela fissa anziana; Salone hair premium a Locarno con consulenza colore e trattamenti botox capelli; Hairstylist a noleggio poltrona ('chair rental') dentro uno spazio condiviso a Mendrisio; Salone con reparto extension e cheratina a Chiasso
- *Flusso:* Prenotazione per prestazione con durata variabile (un colore + piega occupa 2h e tiene libera la poltrona; un taglio uomo 30'); all'arrivo si apre la scheda cliente col 'ricettario colore' (marca, numeri tinta, ossigeno, tempi di posa) e le note sull'ultimo servizio; a fine servizio si registra l'incasso e si propongono prodotti da rivendita; si fissa il richiamo a 4-6 settimane.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `scheda-colore` — Ricettario colore/tecnico per cliente: formule tinta (marca, numeri, volumi ossigeno, grammi), tempi di posa, foto prima/dopo, storico servizi così che qualunque collega replichi il risultato.
    - `poltrone` — Agenda per risorsa (poltrona/postazione lavaggio) oltre che per operatore: evita doppie prenotazioni sulla stessa poltrona e gestisce i tempi morti (posa colore) sovrapponendo due clienti.
    - `ricorrenze` — Appuntamento di richiamo auto-proposto a intervallo (es. ricrescita ogni 4-6 settimane) con promemoria; trasversale, già pianificato.

**Barber shop**
- *Attività esempio:* Barbershop in stile vintage a Lugano con taglio + rasoio + barba; Barbiere tradizionale a Bellinzona con clientela walk-in; Catena di 2 barber a Mendrisio/Chiasso con più barbieri per turno; Barbiere con servizio 'fast' su prenotazione app per pausa pranzo; Barber con abbonamento mensile taglio illimitato
- *Flusso:* Mix di prenotazioni e walk-in: serve una coda/lista d'attesa oltre all'agenda; servizi brevi e ripetitivi (taglio, barba, contorno), scelta del barbiere preferito; incasso rapido spesso in contanti/Twint; fidelizzazione tipo 'la 10a barba in regalo' o abbonamento mensile.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `coda` — Lista d'attesa walk-in: il cliente che entra senza appuntamento prende un posto in coda, vede il tempo stimato e si incastra tra le prenotazioni; display 'prossimo'.
    - `fidelity` — Tessera punti/timbri digitale (es. 10 tagli = 1 gratis) e gestione abbonamento mensile; trasversale già pianificato in coda.
    - `operatore-pref` — Preferenza barbiere per cliente + statistica semplice incassi/clienti per operatore, utile col chair-rental e per le mance.

**Estetiste / Centri estetici**
- *Attività esempio:* Istituto di bellezza a Lugano (visi, manicure, ceretta, trucco sposa); Estetista a domicilio in Vallemaggia; Centro estetico avanzato a Bellinzona con laser/luce pulsata e radiofrequenza; Cabina estetica dentro una palestra a Locarno; Centro a Chiasso con pacchetti dimagrimento/anticellulite a sedute
- *Flusso:* Vendita di pacchetti a più sedute (es. 6 cerette, 10 sedute laser) da scalare nel tempo; ogni seduta richiede consenso informato e scheda con parametri (zona trattata, intensità apparecchio, reazioni cutanee, controindicazioni); promemoria seduta successiva; rivendita prodotti homecare.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `pacchetti` — Pacchetti/carnet di sedute prepagate: vendi 'X trattamenti', scali 1 ad ogni seduta, vedi saldo residuo e scadenza; base anche per abbonamenti.
    - `consensi` — Consenso informato e anamnesi firmati su schermo (allergie, gravidanza, farmaci, controindicazioni laser), archiviati nella scheda cliente con data — rilevante GDPR/dati sensibili.
    - `scheda-tratt` — Scheda trattamento per seduta: zona, prodotto/apparecchio, parametri (intensità, durata), foto prima/dopo, reazioni; storico consultabile.

**SPA / Centri benessere & massaggi**
- *Attività esempio:* SPA di hotel a Ascona con sauna, hammam e massaggi su prenotazione; Centro massaggi terapeutici a Lugano (operatori con diploma riconosciuto); Day-SPA a Locarno con percorso benessere a fasce orarie; Studio di massaggio sportivo/decontratturante a Bellinzona; Centro olistico (shiatsu, riflessologia) a Mendrisio con rimborso cassa malati complementare
- *Flusso:* Prenotazione di cabine/risorse (sala massaggi, vasca, percorso SPA) e dell'operatore insieme; durate lunghe (60-90'); turni del personale e disponibilità cabine come vincolo; per il massaggio terapeutico serve un mini-documento per il rimborso dell'assicurazione complementare del cliente; gestione no-show con caparra.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `turni`
- *Moduli specifici da costruire:*
    - `cabine` — Prenotazione per risorsa fisica (cabina, sala, vasca, lettino) oltre che per operatore: la stessa logica di 'poltrone' applicata alle cabine SPA, con capienza percorso benessere a fasce.
    - `ricevute-cm` — Ricevuta/attestato per rimborso assicurazione complementare (massaggi terapeutici): dati operatore, numero registro, prestazione, importo — NON è una fattura fiscale ma il documento che il cliente porta alla cassa malati.
    - `caparre` — Caparra/anticipo alla prenotazione e regola no-show: registra l'acconto, lo scala dall'incasso o lo trattiene se il cliente non si presenta.

**Nail artist / Onicotecniche**
- *Attività esempio:* Nail bar a Lugano (gel, ricostruzione, nail art); Onicotecnica freelance a domicilio nel Mendrisiotto; Centro unghie + ciglia (lash) a Bellinzona; Studio nail dentro un salone hair a Locarno (postazione affittata); Nail artist con clientela su Instagram e prenotazione via DM
- *Flusso:* Servizi a forte componente estetica/social: durate medie (refill 60', ricostruzione 90'), portfolio fotografico dei lavori fondamentale per attrarre e per ricordare lo stile preferito di ogni cliente; richiamo a 3 settimane per il refill; rivendita/upsell di nail art e trattamenti aggiuntivi.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `portfolio` — Galleria foto dei lavori per cliente e generale: salvi gli esiti (modello/colore/forma scelti), li ritrovi alla visita dopo e li riusi come book/social — attenzione consenso pubblicazione foto.
    - `ricorrenze` — Richiamo refill auto-proposto (es. ogni 3 settimane) con promemoria; trasversale già pianificato.
    - `listino-srv` — Listino prestazioni con durata e prezzo (refill, ricostruzione, nail art, lash) che alimenta l'agenda e l'incasso; variante leggera del modulo 'catalogo' in coda.

**Make-up artist & estetica sposa/evento**
- *Attività esempio:* MUA freelance per matrimoni in Ticino (prova trucco + giorno evento); Truccatrice per shooting/TV con sede a Lugano; Trucco semipermanente / PMU (sopracciglia, eyeliner) a Bellinzona; Make-up + acconciatura sposa in pacchetto a Locarno; Corsi di self make-up serali a Mendrisio
- *Flusso:* Lavoro a evento più che a poltrona: appuntamenti sparsi (prova + data evento, spesso fuori sede, anche all'estero per le spose), preventivo scritto e acconto, trasferte da calcolare; per il PMU servono consensi/foto e sedute di ritocco; gestione di poche clienti ad alto valore.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `preventivi` — Preventivo evento (servizi + trasferta + acconto) → invio → accettazione → diventa appuntamento confermato; trasversale già in lista, qui essenziale al posto della fattura.
    - `eventi` — Gestione 'giornata evento': prova + data definitiva collegate, luogo/trasferta, numero persone da truccare, timeline del giorno; più ricco del semplice appuntamento.
    - `consensi` — Consenso + scheda per trucco semipermanente (anamnesi, pigmenti usati, foto prima/dopo, ritocco) — dato sensibile, condiviso con estetica.

**Tatuatori & piercing**
- *Attività esempio:* Tattoo studio a Lugano con 3 artisti e stili diversi; Tatuatore freelance ospite ('guest') a rotazione a Bellinzona; Studio piercing + tattoo a Chiasso con clientela frontaliera; Artista specializzato in coperture/realismo su appuntamento lungo; Studio con caparra obbligatoria e progetto custom
- *Flusso:* Pochi appuntamenti molto lunghi (anche multi-seduta per pezzi grandi); preventivo a progetto con caparra non rimborsabile; obbligo di consenso e dichiarazione (età, salute, allergie a inchiostri/lattice) per legge cantonale d'igiene; foto del progetto e dei risultati; cura post-tatuaggio inviata al cliente.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `consensi` — Consenso informato e dichiarazione igienico-sanitaria firmati (maggiore età, stato di salute, allergie, post-cura accettata) archiviati per cliente — richiesto dalle norme cantonali d'igiene, dato sensibile.
    - `caparre` — Caparra di progetto alla prenotazione (spesso non rimborsabile) scalata sul totale a fine lavoro; protegge dalle cancellazioni su sedute lunghe.
    - `progetti-tattoo` — Progetto/commessa per pezzo grande: più sedute collegate, bozza/stencil, zona del corpo, ore stimate, foto avanzamento e finale per cliente.

**Solarium, depilazione & beauty 'a sedute'**
- *Attività esempio:* Centro abbronzatura self-service con lettini e docce a Lugano; Studio epilazione laser/luce pulsata a Bellinzona; Centro ceretta express + epilazione a filo a Locarno; Solarium + criolipolisi/pressoterapia dentro una palestra a Mendrisio; Studio 'lash & brow' (extension ciglia, laminazione) a Chiasso
- *Flusso:* Modello a sedute e a prepagato: cicli di trattamento ripetuti (laser ogni 4-8 settimane per X sedute), accesso a risorse a tempo (lettino solarium a minuti), tessera prepagata/ricaricabile; promemoria della seduta successiva e fine ciclo; controllo igiene/manutenzione apparecchi e lampade.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `pacchetti` — Carnet di sedute/minuti prepagati e tessera ricaricabile (es. 6 sedute laser, 200 minuti solarium): scala automaticamente ad ogni uso, mostra residuo e scadenza; condiviso con estetiste.
    - `ricorrenze` — Pianifica il ciclo (es. 8 sedute laser ogni 6 settimane) generando in automatico i prossimi appuntamenti del cliente; trasversale già pianificato.
    - `apparecchi` — Registro apparecchi/lampade: ore d'uso, sostituzione lampade solarium, manutenzione e controllo periodico — riusa la logica di 'macchine' applicata agli apparecchi estetici.

---

### 🩺 Studio Salute  *(archetipo: su-appuntamento)*
_Gestionale base per studi sanitari e di cura: chi vive di appuntamenti, di una cartella/anamnesi per paziente e di richiami programmati. Cuore comune = agenda visite + scheda paziente con storia clinica + richiami automatici + privacy sanitaria rinforzata. Si accendono i moduli su misura per il singolo mestiere (denti, fisio, occhi, animali, medico). Niente fatturazione fiscale/IVA completa né tariffazione cassa malati (Tarmed/Tardoc): MODULA copre l'operatività (chi viene, cosa gli ho fatto, quando torna), non la fatturazione sanitaria, che in CH passa quasi sempre da software certificati o trust factoring (es. MediData, Medidoc)._

> 🇨🇭 **Mercato CH:** Domanda reale e alta capacità di spesa. Il Ticino è denso di micro-studi sanitari (dentisti, fisio, psico, vet, ottici), quasi tutti PMI da 1–6 persone: il profilo ideale per MODULA. Oggi molti usano agende cartacee, Excel o software pesanti/costosi (Vitodata, Denteo, Aeskulap per i vet, tomedo, Medical Office) che costano spesso CHF 100–300+/mese e sono sovradimensionati per il piccolo studio. MODULA può vincere come 'agenda + scheda paziente + richiami' leggera e in italiano, a CHF 59–190/mese: i richiami automatici (igiene a 6 mesi, vaccino vet, controllo vista) hanno ROI diretto perché riempiono l'agenda.

PERICOLO/SCOPE: in CH la sanità ha due cose che MODULA NON deve promettere: (1) la FATTURAZIONE cassa malati con tariffari Tarmed/Tardoc e l'invio elettronico via MediData/trust (questo è l'ostacolo numero uno e va detto chiaro: MODULA fa 'conti' + stima costi, non la fattura sanitaria — eventuale integrazione/export è 'prossimamente'); (2) la cartella clinica certificata / dossier elettronico paziente (DEP/EPD, Cartella Informatizzata del Paziente) con i requisiti legali — il modulo cartella è una scheda operativa, non un dossier certificato. Vanno segnalati entrambi al cliente.

PRIVACY: i dati sono dati sanitari = categoria particolarmente degna di protezione sotto la nLPD svizzera (revisione 2023) e GDPR per pazienti UE. Servono consenso esplicito, RLS per tenant rigorosa, note per-curante (psico) visibili solo all'autore, storage cifrato/isolato per foto cliniche e referti, log accessi e cancellazione su richiesta. Il template MODULA resta a ZERO dati reali; le app cliente vere richiedono GDPR/nLPD pieno (skill dati-sensibili + owasp-security-review). Punto di forza vendibile in CH: hosting dati in Svizzera (Supabase Zurigo) — molti studi lo chiedono esplicitamente.

LINGUE: per il beachhead Ticino l'italiano basta. Ma i fornitori sanitari svizzeri lavorano spesso oltre Gottardo: per scalare a tutta la CH (e a catene/studi associati) servono DE e FR, qui più che in altri settori perché la concorrenza tedesca è forte e radicata. Disponibilità a pagare medio-alta, ma il ciclo di vendita è lento (professionisti prudenti, vincolati dal collega più scettico dello studio): puntare su referral tra studi e su demo con i loro dati di esempio.

**Studi dentistici e igiene dentale**
- *Attività esempio:* Studio dentistico associato a Lugano (2 dentisti + igienista + assistente); Studio ortodontico a Bellinzona (apparecchi, controlli mensili); Igienista dentale indipendente a Locarno (solo sedute di igiene su richiamo); Centro implantologia a Mendrisio; Odontotecnico/laboratorio che lavora per più studi
- *Flusso:* Prenotazione visita -> apertura cartella odontoiatrica (denti su odontogramma, trattamenti per dente) -> piano di cura a step -> seduta dopo seduta si segna cosa fatto -> richiamo igiene a 6 mesi generato in automatico -> avviso scadenza controllo. Ogni giorno lo studio deve sapere chi viene, su quale dente si lavora, e chi va richiamato.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `cartella` — Cartella clinica paziente: anamnesi, allergie, storico visite/diagnosi/trattamenti in ordine cronologico, campi medici. Base condivisa da tutta la famiglia.
    - `odontogramma` — Schema denti interattivo: stato per ogni dente (sano/carie/otturato/estratto/impianto), trattamenti per dente, storico per dente.
    - `piano-cura` — Piano di trattamento a step: elenco prestazioni da fare, ordine sedute, stato (da fare/fatto), stima costo paziente (NON fattura cassa malati).
    - `richiami` — Richiami automatici di igiene/controllo: a X mesi dall'ultima seduta genera promemoria e lista pazienti da richiamare (trasversale a tutta la famiglia).

**Fisioterapia, osteopatia e riabilitazione**
- *Attività esempio:* Studio di fisioterapia a Chiasso convenzionato cassa malati; Osteopata D.O. indipendente a Lugano; Centro di riabilitazione post-operatoria con 3 fisioterapisti; Massaggiatore medicale / terapista manuale a Locarno; Fisio dello sport che segue una società sportiva ticinese
- *Flusso:* Paziente arriva con prescrizione medica (es. 9 sedute) -> si apre cartella + ciclo di sedute -> ogni seduta si segna trattamento svolto, zona, progressi, scala dolore -> si tiene il conto delle sedute residue sulla prescrizione -> alert quando il ciclo sta per finire -> appuntamenti spesso ricorrenti (es. 2/settimana). Ogni giorno: chi viene, a che ciclo è, quante sedute restano.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `cartella` — Cartella paziente con anamnesi e storico (condivisa di famiglia).
    - `sedute` — Cicli di sedute con prescrizione: numero sedute prescritte, residue, scadenza prescrizione, diario per ogni seduta (zona, tecnica, dolore/progressi).
    - `ricorrenze` — Appuntamenti ricorrenti auto-generati (es. 2 sedute/settimana per N settimane) — modulo trasversale già previsto a catalogo.
    - `richiami` — Richiami a fine ciclo / controllo periodico.

**Salute mentale: psicologi, psicoterapeuti, dietisti, logopedisti**
- *Attività esempio:* Psicoterapeuta riconosciuto a Lugano (sedute settimanali da 50'); Studio di psicologi associati con sale condivise a Bellinzona; Dietista/nutrizionista a Locarno (piani alimentari + controlli peso); Logopedista per bambini convenzionata a Mendrisio; Coach / consulente del benessere (prestazioni non mediche)
- *Flusso:* Prima seduta -> apertura cartella riservatissima (note di seduta, obiettivi) -> appuntamenti fissi ricorrenti (stesso slot ogni settimana) -> tra una seduta e l'altra appunti privati visibili solo al curante -> per dietisti: misure (peso, BMI) e piano da rivedere. Privacy massima: i dati di salute mentale sono i piu sensibili.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `cartella` — Cartella paziente con note di seduta protette (visibili solo al curante assegnato).
    - `sedute` — Diario sedute: obiettivi, note riservate per ogni incontro, riservatezza per-curante.
    - `ricorrenze` — Slot fisso ricorrente settimanale auto-generato (trasversale).
    - `misure` — Misurazioni nel tempo (peso, BMI, circonferenze, valori) con grafico andamento — utile soprattutto a dietisti/nutrizionisti.

**Studi medici e ambulatori (medico di base / specialisti)**
- *Attività esempio:* Studio medico di famiglia a Bellinzona (medico + 2 assistenti di studio MPA); Studio dermatologico/cardiologico specialistico a Lugano; Ambulatorio di gruppo (Permanence) a Locarno; Pediatra di base con richiami vaccinali a Mendrisio; Ginecologo con controlli periodici programmati
- *Flusso:* Agenda visite (prima visita/controllo/urgenza) -> cartella paziente con anamnesi, diagnosi, terapie, allergie -> scadenziario controlli e richiami (vaccini, screening, esami periodici) -> archivio referti/documenti del paziente. NB: la VERA cartella clinica certificata e la fatturazione Tarmed/Tardoc restano fuori scope MODULA; qui si copre agenda + scheda operativa + richiami, non il dossier clinico legale.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `documenti`, `conti`
- *Moduli specifici da costruire:*
    - `cartella` — Scheda paziente operativa: anamnesi, allergie, diagnosi/terapie in corso, storico visite (NON cartella clinica certificata).
    - `scadenziario` — Scadenziario controlli/screening/vaccini con avvisi automatici prima della scadenza (trasversale già a catalogo).
    - `richiami` — Richiami pazienti per controlli periodici e campagne (es. richiamo vaccinale).
    - `documenti` — Archivio referti/esami per paziente (modulo già in coda) con storage isolato per tenant.

**Veterinari e cliniche per animali**
- *Attività esempio:* Ambulatorio veterinario per piccoli animali a Lugano; Clinica veterinaria con pronto soccorso e degenza a Bellinzona; Veterinario equino/rurale itinerante nel Mendrisiotto; Toelettatura + veterinario a Locarno; Veterinario comportamentalista su appuntamento
- *Flusso:* Si registra il PROPRIETARIO (cliente) e i suoi ANIMALI (uno o piu pazienti per cliente) -> per ogni animale: specie/razza, microchip, peso, anamnesi -> visita -> libretto vaccinale e richiami (sverminazione, vaccini annuali) -> promemoria al proprietario. Differenza chiave: la relazione e 1 cliente -> N animali.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `animali` — Anagrafica animali legata al proprietario (cliente): specie, razza, microchip, peso, foto; un cliente può avere più animali.
    - `cartella` — Cartella per animale: anamnesi, visite, terapie, peso nel tempo.
    - `libretto-vet` — Libretto sanitario: vaccini, sverminazioni, profilassi con date e scadenze per animale.
    - `richiami` — Richiami automatici al proprietario per vaccino/profilassi in scadenza.

**Ottici e optometristi**
- *Attività esempio:* Ottica indipendente a Lugano (esame vista + vendita occhiali); Optometrista con controllo vista su appuntamento a Bellinzona; Negozio di ottica con laboratorio molatura lenti a Locarno; Centro lenti a contatto con controlli periodici a Chiasso
- *Flusso:* Appuntamento per controllo vista -> scheda cliente con misurazioni refrazione (diottrie OD/OS, asse, addizione) storiche -> proposta occhiale/lenti (montatura + lenti) -> ordine al fornitore/laboratorio -> avviso 'occhiale pronto' -> richiamo controllo vista a ~2 anni. Misto tra studio (appuntamento+scheda) e retail (vendita prodotto).
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`, `catalogo`
- *Moduli specifici da costruire:*
    - `refrazione` — Schede misurazione vista per cliente nel tempo: diottrie OD/OS, asse, addizione, note, confronto con misure precedenti.
    - `ordini-lab` — Ordini montatura+lenti al laboratorio/fornitore: stato (ordinato/in lavorazione/pronto/consegnato) e avviso al cliente quando pronto.
    - `richiami` — Richiamo controllo vista periodico (~24 mesi) e scadenza lenti a contatto.
    - `catalogo` — Listino montature/lenti/prodotti (modulo già in coda) per la parte retail.

**Podologi, logopedisti e piccole terapie su appuntamento**
- *Attività esempio:* Podologo/pedicure medicale a Lugano (cura del piede diabetico); Logopedista per adulti post-ictus a Bellinzona; Studio di plantari ortopedici su misura a Locarno; Ergoterapista indipendente nel Luganese
- *Flusso:* Appuntamento -> cartella con anamnesi e zona trattata -> trattamento svolto per seduta + foto prima/dopo (es. lesione del piede) -> piano sedute / richiamo periodico. Studio piccolo, spesso un solo professionista: serve leggerezza, non un gestionale ospedaliero.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `cartella` — Cartella paziente con anamnesi e storico (condivisa di famiglia).
    - `sedute` — Diario sedute con zona trattata e progressi.
    - `foto-clin` — Foto cliniche prima/dopo per seduta (es. lesioni del piede, postura), legate alla cartella, con storage isolato e consenso.
    - `richiami` — Richiamo controllo periodico.

**Cure a domicilio: infermieri, Spitex e assistenza**
- *Attività esempio:* Servizio infermieristico a domicilio privato (Spitex privato) nel Luganese; Infermiera indipendente con giro pazienti a Bellinzona; Assistenza anziani a domicilio (medicazioni, terapie, prelievi); Equipe di cure palliative domiciliari in Ticino; Fisioterapista domiciliare itinerante
- *Flusso:* Lista pazienti a domicilio -> pianificazione GIRO giornaliero per ogni operatore (chi va da chi, in che ordine, a che ora) -> sul posto si registra la prestazione svolta + firma del paziente/familiare -> mappa indirizzi per ottimizzare gli spostamenti -> note clinica del paziente. È field-service applicato alla sanità: il lavoro va dove sta il paziente.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `zone`, `conti`
- *Moduli specifici da costruire:*
    - `cartella` — Cartella paziente a domicilio: anamnesi, terapie in corso, recapiti del caregiver.
    - `giri-cura` — Pianificazione giri giornalieri per operatore: sequenza visite a domicilio, orari, assegnazione infermiere (variante sanitaria del modulo giri).
    - `interventi` — Rapportino di prestazione a domicilio con firma paziente/familiare su schermo e foto (trasversale già previsto a catalogo).
    - `zone` — Mappa indirizzi pazienti per ottimizzare il giro (modulo già pronto).

---

### 🏋️ FitClub — Sport & Movimento  *(archetipo: soci-membership)*
_Gestionale base per chi vive di abbonamenti, corsi a calendario e lezioni prenotabili: palestre, studi yoga/pilates, scuole di danza e arti marziali, box crossfit, personal trainer, maestri di tennis/sci e guide alpine, noleggio attrezzatura, piscine sportive. Il cuore è sempre lo stesso: anagrafica atleti/soci, un abbonamento (o pacchetto lezioni) che si esaurisce e va rinnovato, un calendario di corsi/lezioni con posti limitati che i clienti prenotano, e l'incasso quotidiano. Sopra questa base ogni attività accende il modulo specifico (sala pesi e accessi per la palestra, livelli e saggi per la danza, meteo e gruppi per lo sci, parco attrezzi per il noleggio). Niente fatturazione fiscale completa: per gli incassi si usano conti + preventivi/pacchetti._

> 🇨🇭 **Mercato CH:** Domanda reale e alta disponibilità a pagare. La Svizzera (e il Ticino) ha tassi di pratica sportiva tra i più alti d'Europa: fitness, sci, tennis/padel e outdoor sono di massa, con clientela abituata ad abbonamenti annuali e prezzi premium — un canone software di 30-80 CHF/mese per studio è ampiamente sostenibile, e i club più strutturati pagano volentieri di più per utente. Oggi molti studi usano Eversports, Mindbody, Bsport o fogli Excel: c'è spazio per un'alternativa più semplice, in italiano e local. Specificità locali da curare: (1) Lingue — interfaccia almeno IT/DE/FR, perché lo stesso club a Lugano e a Coira ha clientela diversa e i turisti sulle piste sono internazionali (utile anche EN per scuole sci e noleggi). (2) Stagionalità marcata — sci/outdoor/lidi lavorano a stagioni con picchi enormi e meteo decisivo: i moduli meteo-rinvii, uscite e noleggio sono distintivi. (3) Tesseramenti federali e ASD/club — molte realtà sono associazioni (Swiss Ski, federazioni tennis/nuoto/arti marziali) con soci e quote sociali: il taglio 'membership' calza meglio della logica negozio. (4) Idoneità e sicurezza — certificato medico per agonisti/corsi, liberatorie outdoor e dati dei minori (genitori, consensi) richiedono attenzione GDPR/LPD: attivare la skill dati-sensibili su clients, minori e cert-medico. (5) Pagamenti — Twint è ormai standard al bancone in CH: prevederlo come metodo negli incassi (conti). Scope: niente fatturazione IVA piena — bastano conti + pacchetti/abbonamenti per gli incassi; WhatsApp per promemoria corsi è 'prossimamente', quindi i reminder passano per notif/email. Beachhead consigliato: studi yoga/pilates e box crossfit del Luganese (decisione rapida, dolore reale sulle prenotazioni), poi scuole sci e noleggi delle valli per la stagione invernale.

**Palestre & fitness club**
- *Attività esempio:* Palestra di quartiere multisala a Lugano (sala pesi + sale corsi); Fitness club con abbonamenti annuali a Bellinzona; Catena low-cost / palestra h24 con accesso a badge a Chiasso; Centro funzionale / EMS studio a Mendrisio; Sala pesi indipendente con personal trainer interni a Locarno
- *Flusso:* Ogni giorno: vendere/rinnovare abbonamenti, controllare chi entra (e se ha l'abbonamento attivo e il certificato medico in regola), riempire i corsi della giornata, segnare gli incassi del bancone e i pacchetti PT. La metrica chiave è quanti abbonamenti scadono questo mese e quanti si rinnovano.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `abbonamenti` — Cuore del settore: abbonamenti e tessere (mensile/trimestrale/annuale, congelamenti/pause, pacchetti a ingressi che scalano), scadenza con alert e rinnovo. Trasversale a tutta la famiglia.
    - `accessi` — Controllo accessi: check-in al bancone o a badge/QR, blocco se abbonamento scaduto o sospeso, conta presenze e affollamento in tempo reale.
    - `corsi` — Calendario corsi di gruppo con posti limitati (spinning, functional, GAG): orari ricorrenti, capienza sala, lista d'attesa, presenze. Trasversale (yoga, danza, crossfit).
    - `cert-medico` — Idoneità: scadenza certificato medico/visita per ogni socio, blocco o avviso all'ingresso se scaduto, promemoria di rinnovo.

**Personal trainer & coach**
- *Attività esempio:* Personal trainer indipendente che gira tra studi e domicili a Lugano; Coach online + in presenza con schede di allenamento; Preparatore atletico per squadre dilettantistiche ticinesi; Nutrizionista sportivo / osteopata-coach in studio condiviso; Studio EMS one-to-one su appuntamento a Bellinzona
- *Flusso:* Vende pacchetti di sedute (10/20 lezioni) che si scalano a ogni allenamento, fissa gli appuntamenti uno-a-uno in agenda, assegna e aggiorna le schede di allenamento, e tiene i progressi del cliente. La preoccupazione è che il pacchetto non si 'sciolga' e che le sedute restino tracciate.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `pacchetti` — Pacchetti di sedute prepagate che scalano a ogni lezione svolta, saldo residuo visibile, alert 'ti restano 2 sedute' e rinnovo. Variante a consumo dell'abbonamento.
    - `schede-allenamento` — Schede di allenamento per cliente: esercizi, serie/ripetizioni, progressioni, assegnazione e storico modifiche, consultabili dall'atleta.
    - `prenota` — Prenotazione/conferma online delle sedute one-to-one direttamente dal cliente (modulo già in coda).
    - `progressi` — Misurazioni e obiettivi: peso, circonferenze, massimali, foto progresso, grafico nel tempo per motivare il cliente.

**Studi yoga, pilates & wellness**
- *Attività esempio:* Studio yoga con lezioni a calendario e carnet a Lugano; Studio pilates reformer (posti = numero di macchine) a Massagno; Centro meditazione / mindfulness con cicli a tema; Studio di danza del benessere / barre fitness a Locarno; Sala polivalente affittata a insegnanti freelance a Mendrisio
- *Flusso:* Lezioni a calendario con posti molto limitati (specie reformer dove i posti = le macchine), i clienti acquistano carnet/abbonamenti e prenotano il posto online, con regola di disdetta entro X ore. L'insegnante segna chi era presente e quante lezioni restano nel carnet.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `corsi` — Calendario lezioni con capienza per posto (es. 8 reformer), prenotazione del singolo posto, lista d'attesa, presenze (trasversale).
    - `abbonamenti` — Carnet a ingressi e abbonamenti mensili che scalano sulle lezioni prenotate, con scadenza e rinnovo (trasversale).
    - `disdette` — Regole di cancellazione: disdetta entro X ore restituisce la lezione al carnet, oltre la soglia la lezione viene persa; gestione no-show e liberazione automatica del posto.
    - `insegnanti` — Affitto sala a freelance e quote insegnante: chi tiene quale corso, percentuale/affitto dovuto, calcolo compenso a fine mese.

**Scuole di danza, arti marziali & crossfit**
- *Attività esempio:* Scuola di danza con corsi per livello e saggio di fine anno a Bellinzona; Box CrossFit con WOD giornaliero e classi orarie a Lugano; Dojo karate/judo con gradi (cinture) ed esami a Chiasso; Palestra di boxe / MMA con corsi e tessere FSU/federali; Scuola di ballo latino con coppie e stage nel weekend a Locarno
- *Flusso:* Iscritti divisi in corsi per livello/età/grado, frequenza ricorrente settimanale con registro presenze (importante con i minori), quota di iscrizione + retta mensile/trimestrale, ed eventi/esami/saggi che muovono i livelli. Tiene traccia di cinture/livelli raggiunti e di chi ha pagato la retta.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `corsi` — Corsi ricorrenti per livello/età con iscritti fissi e registro presenze settimanale (trasversale).
    - `abbonamenti` — Quota iscrizione + rette ricorrenti (mensile/trimestrale/annuale) con scadenza e solleciti pagamento (trasversale).
    - `livelli` — Gradi e livelli: cinture/passaggi nelle arti marziali, livelli di danza, esami con data ed esito, storico avanzamento dell'allievo.
    - `minori` — Anagrafica genitore/tutore, consensi e deleghe al ritiro, contatti d'emergenza per gli allievi minorenni (lavora con la skill dati-sensibili).
    - `eventi` — Saggi, stage, gare ed esami: iscrizioni, quote, liste partecipanti e incasso dedicato dell'evento.

**Scuole sci/snowboard, guide alpine & outdoor**
- *Attività esempio:* Scuola sci e snowboard ad Airolo / Bosco Gurin; Guida alpina UIAGM per scialpinismo e arrampicata in Vallemaggia; Maestro di sci freelance che prende lezioni private; Organizzatore escursioni/trekking ed e-bike guidate sul San Salvatore; Scuola di kayak/SUP e canyoning sul Verzasca; Asd / club outdoor con uscite sociali e tesseramento
- *Flusso:* Lezioni e uscite per lo più stagionali e meteo-dipendenti, vendute come private (1 maestro-1 cliente) o collettive (gruppo per livello), con assegnazione del maestro/guida giusto e attenzione al meteo e alla sicurezza. Si prenota la lezione/uscita, si forma il gruppo per livello, si incassa e si gestiscono i rinvii per maltempo.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `lezioni-sport` — Lezioni private e collettive con assegnazione del maestro/guida, livello allievo, durata, punto di ritrovo; agenda per istruttore.
    - `gruppi-livello` — Composizione gruppi per livello/età nei corsi collettivi stagionali (es. corso settimanale principianti), spostamento allievi tra gruppi.
    - `meteo-rinvii` — Gestione rinvii/annullamenti per meteo o condizioni: avviso al gruppo, recupero della lezione o rimborso, calendario condizioni.
    - `uscite` — Uscite/tour guidati a programma: posti disponibili, livello e difficoltà, lista partecipanti, ritrovo e materiale richiesto.
    - `sicurezza-out` — Sicurezza e idoneità outdoor: liberatorie firmate, contatti emergenza, check materiale/DPI (imbrago, ARVA), assicurazione partecipante.

**Maestri di tennis & sport con campo/court**
- *Attività esempio:* Tennis club con campi prenotabili e maestri a Lugano; Maestro di tennis freelance con corsi SAT/junior a Bellinzona; Centro padel con 4 campi prenotabili a slot a Mendrisio; Scuola di squash / badminton con court su prenotazione; Campo da beach volley / calcetto affittato a ore
- *Flusso:* Doppia gestione: prenotazione dei campi a fasce orarie (soci e non soci, tariffe diverse, luce serale) e i corsi/lezioni dei maestri sopra i campi. Si tiene l'occupazione dei campi a slot, le quote sociali, gli abbonamenti scuola tennis e l'incasso ore campo + lezioni.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `campi` — Prenotazione campi/court a fasce orarie: griglia per campo, tariffe socio/ospite e diurno/serale, supplemento luce, ricorrenza dell'ora fissa settimanale.
    - `abbonamenti` — Quote sociali annuali e abbonamenti scuola tennis/padel, scadenza e rinnovo (trasversale).
    - `lezioni-sport` — Lezioni private e corsi SAT/junior con maestro assegnato sopra il campo prenotato (condiviso con scuole sci).
    - `tornei` — Tornei e tabelloni interni: iscrizioni, gironi/eliminazione, risultati e calendario incontri sui campi.

**Noleggio attrezzatura sportiva (rental)**
- *Attività esempio:* Noleggio sci/snowboard e ciaspole ai piedi delle piste (Airolo); Bike shop con noleggio e-bike/MTB sul Lago Maggiore; Noleggio SUP, kayak e mute sul lungolago di Lugano; Ski depot / deposito attrezzi stagionale in stazione; Rental ferrata/arrampicata (imbraghi, kit, scarpette)
- *Flusso:* Gestisce un parco attrezzi a noleggio: chi ha preso cosa, da quando a quando, taglia/misura, cauzione, riconsegna e stato (manutenzione/sciolinatura). Deve sapere in tempo reale cosa è disponibile per la prossima prenotazione e quando un mezzo torna; più la manutenzione del parco attrezzi.
- *Moduli core:* `hub`, `cal`, `clients`, `notes`, `notif`, `conti`, `magazzino`
- *Moduli specifici da costruire:*
    - `noleggio` — Cuore del rental: bene a noleggio con disponibilità a calendario, uscita/rientro, taglia/misura, cauzione, tariffa a ore/giorno/stagione, contratto e stato del bene.
    - `parco-attrezzi` — Inventario attrezzi serializzati (sci, e-bike, SUP) con scheda, foto, taglia e manutenzione/sciolinatura/tagliando per singolo pezzo.
    - `deposito` — Ski/bike depot stagionale: armadietti/posti assegnati per cliente, abbonamento deposito e ritiro a fine stagione.
    - `prenota` — Prenotazione online del noleggio con verifica disponibilità del pezzo (modulo già in coda).

**Piscine sportive & impianti acquatici**
- *Attività esempio:* Piscina comunale / lido sportivo con corsi nuoto a Bellinzona; Scuola nuoto e acquagym con corsi a livelli a Lugano; Centro acquatico con abbonamenti corsie libere a Chiasso; Società di nuoto agonistico con atleti e turni vasca; Centro benessere con piscina, ingressi e pacchetti SPA
- *Flusso:* Vende ingressi singoli e abbonamenti alle corsie libere, organizza corsi di nuoto per livello con bambini (registro presenze e bagnini assegnati), e ripartisce le corsie/turni vasca tra corsi, pubblico e società. Tiene incassi ingressi, abbonamenti, e l'idoneità medica degli iscritti ai corsi.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `corsi` — Corsi di nuoto per livello con iscritti, registro presenze e istruttore/bagnino assegnato (trasversale).
    - `abbonamenti` — Ingressi singoli, carnet e abbonamenti corsie libere con scadenza e rinnovo (trasversale).
    - `corsie` — Pianificazione corsie/vasca: ripartizione a fasce tra corsi, nuoto libero e società, capienza per corsia.
    - `cert-medico` — Idoneità medica obbligatoria per iscritti ai corsi/agonisti, scadenze e blocco/avviso (condiviso con palestre).

---

### 🎨 Atelier — gestionale per creativi, artisti & media  *(archetipo: commessa-progetti)*
_Gestionale base per chi vende creatività e tempo: musicisti/DJ, fotografi e videomaker, artisti visivi, designer e sviluppatori freelance, copywriter, performer e artigiani d'arte. Il cuore non è il magazzino ma il TRIANGOLO portfolio → commessa creativa → diritti & incassi: ogni lavoro è un progetto con brief, milestone, revisioni, acconto + saldo, scadenze di consegna, e la gestione di chi possiede cosa (diritti d'autore, licenze d'uso, liberatorie). Si parte da BASE (hub, calendario per date/ingaggi, clients come committenti/gallerie/agenzie, notes, notif) e si accende ciò che serve per il sotto-settore. Forte taglio freelance/micro-studio: poche persone, tanti progetti paralleli, fatturazione leggera (preventivi + conti, non IVA piena). Nota di scope: niente fatturazione fiscale completa; per chi emette molte fatture serve un gestionale contabile a valle._

> 🇨🇭 **Mercato CH:** Domanda reale: tantissime micro-attività in CH (foto matrimoni, DJ, designer e sviluppatori freelance, agenzie 2-3 persone). Sono però abituate a strumenti generici (Google Calendar + Excel + WeTransfer + tool esteri come HoneyBook/Bonsai/Studio Ninja, spesso solo in inglese). Spazio reale per un gestionale leggero in italiano, calato sul Ticino. Disponibilità a pagare: medio-buona ma sensibile al prezzo per i freelance puri (meglio fascia entry CHF bassa, per-utente); più alta per studi foto/video e service/rental, dove il doppio-booking e gli acconti persi costano denaro vero. Specificità locali/normative: (1) DIRITTI MUSICA — in Svizzera la SUISA gestisce diritti d'autore e dichiarazioni per esecuzioni dal vivo: il modulo scalette deve produrre la rendicontazione brani per SUISA, forte argomento di vendita per band/DJ/locali. (2) PRIVACY/IMMAGINE — nuova LPD svizzera (revDSG, in vigore 2023) oltre al GDPR per clienti UE: liberatorie immagine e consenso uso foto sono obbligatori e vanno archiviati (collega la skill dati-sensibili). (3) DIRITTO DI SEGUITO — a differenza della UE, la Svizzera NON ha il droit de suite sulla rivendita di opere d'arte; utile saperlo per non promettere funzioni inesistenti, ma la provenienza/certificato resta richiesta dalle gallerie. (4) LINGUE — il Ticino lavora molto con committenti DE-CH (Zurigo) e clienti internazionali: interfaccia e modelli (preventivi, liberatorie, licenze) dovrebbero essere pronti almeno IT/DE, idealmente IT/DE/FR/EN, vero vantaggio competitivo. (5) SCOPE FATTURE — molti creativi sotto i CHF 100k di fatturato non sono soggetti IVA: preventivi + conti bastano per la maggior parte; segnalare che chi supera la soglia o fattura molto avrà bisogno di un gestionale contabile vero a valle (non in scope MODULA). WhatsApp per inviare gallerie/conferme date è molto richiesto nel settore ma resta 'prossimamente'.

**Musica & spettacolo dal vivo (band, DJ, musicisti, performer)**
- *Attività esempio:* DJ per matrimoni e feste aziendali nel Luganese / Mendrisiotto; Cover band e gruppi che suonano in grotti, sagre e piazze ticinesi; Musicista classico / insegnante che fa concerti ed eventi privati; Compagnia di danza o performer per fiere ed eventi corporate a Lugano; Service audio-luci che noleggia e monta per serate ed eventi
- *Flusso:* Arriva una richiesta data → si verifica disponibilità su calendario → preventivo (ingaggio + ore + trasferta + service) → conferma con acconto → si bloccano data, location e formazione/musicisti → il giorno dell'evento check tecnico/scaletta → saldo a fine serata → eventuale rendicontazione diritti SUISA per i brani eseguiti. Il rischio principale è il doppio-booking e gli acconti non incassati.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `date-ingaggi` — Agenda ingaggi/gig: ogni data ha stato (opzione→confermata→suonata), location, orari, cachet, formazione assegnata; blocca i conflitti di data ed evidenzia opzioni in scadenza
    - `acconti` — Acconto + saldo per evento: importo caparra, scadenza, stato pagamento, saldo a evento; lista 'chi deve ancora pagare'
    - `scalette` — Scaletta/repertorio per serata: brani eseguiti, durata, note tecniche; base per la rendicontazione SUISA dei diritti
    - `rider` — Rider tecnico e logistica: impianto richiesto, palco, alimentazione, parcheggio, contatti location; checklist montaggio/smontaggio

**Fotografia & video (fotografi, videomaker, studi)**
- *Attività esempio:* Fotografo di matrimoni ed eventi in Ticino (servizi weekend stagionali); Studio di fotografia di prodotto/still-life per e-commerce e cataloghi; Videomaker per spot aziendali, video corporate e social; Fotografo ritrattista / newborn con studio a Bellinzona; Drone/foto immobiliare per agenzie del Luganese
- *Flusso:* Richiesta servizio → preventivo a pacchetto (shooting + ore montaggio + n. foto/consegne) → contratto con liberatoria immagine e acconto → giorno dello shooting (shot-list) → post-produzione con revisioni cliente → consegna galleria/file → saldo. Punti critici: liberatoria/privacy dei soggetti, diritti d'uso concessi (web vs stampa vs esclusiva), e backup/consegna dei file pesanti.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `shooting` — Servizio fotografico come progetto: data, location, shot-list, n. scatti pattuiti, stato (da fare→shooting fatto→in post→consegnato)
    - `liberatorie` — Liberatorie immagine/model & property release: modello firmabile dal soggetto, archivio per servizio, consenso privacy uso foto (web/social/stampa)
    - `consegne-file` — Galleria/consegna digitale: link alla raccolta finale, selezione foto da parte del cliente, scadenza download, stato 'consegnato/scaricato'
    - `licenze-uso` — Diritti d'uso concessi: ambito (web/stampa/affissione), durata, territorio, esclusiva sì/no; scadenza licenza con avviso di rinnovo

**Design, web & sviluppo freelance (graphic/web designer, sviluppatori, copywriter)**
- *Attività esempio:* Graphic designer freelance per loghi e brand identity di PMI ticinesi; Studio web / sviluppatore che fa siti e piccole app a commessa; Copywriter / social media manager con clienti in abbonamento mensile; Agenzia di comunicazione 2-3 persone (Lugano/Chiasso); UX/UI designer freelance per progetti DE-CH e IT-CH
- *Flusso:* Brief cliente → preventivo a pacchetto o a giornate → acconto e via → lavoro per milestone con round di revisioni inclusi → approvazione → consegna file sorgente + cessione/licenza diritti → saldo. Per i ricorrenti (social, manutenzione sito) c'è un canone mensile. Critico: tracciare le revisioni 'fuori pacchetto' (extra a pagamento) e le ore reali vs preventivate.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `commesse-creative` — Progetto creativo a milestone: brief, fasi, deliverable, stato; barra avanzamento e scadenza consegna
    - `revisioni` — Giri di revisione: round inclusi nel preventivo vs extra a pagamento, feedback cliente, approvazione finale che 'chiude' la fase
    - `ore-progetto` — Time tracking leggero per progetto/cliente: ore per fase, confronto con il preventivato, base per saldo a consuntivo
    - `canoni` — Abbonamenti/retainer mensili: canone ricorrente per cliente (social, manutenzione), generazione automatica della voce mensile e stato incasso

**Arti visive & artigianato d'arte (pittori, scultori, illustratori, ceramisti)**
- *Attività esempio:* Pittore/scultore che vende opere e fa mostre in gallerie ticinesi; Illustratore freelance per editoria e packaging; Ceramista / orafo / artigiano d'arte con atelier e pezzi unici; Artista che lavora su commissione (ritratti, opere personalizzate); Incisore / restauratore d'arte con piccola bottega
- *Flusso:* Doppio binario: (a) OPERE in catalogo vendute/esposte e (b) COMMISSIONI su misura. Per le opere: schedo l'opera, la metto in mostra o in conto-vendita in galleria, ne traccio dove si trova e a chi è venduta. Per le commissioni: accordo + acconto → realizzazione → consegna → saldo. Critico per il mercato CH: rapporto con gallerie (percentuale), tracciare opere 'in prestito/in conto vendita' e il diritto di seguito sulla rivendita.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `opere` — Catalogo opere: titolo, anno, tecnica, dimensioni, foto, prezzo, stato (disponibile/venduta/in mostra/in conto vendita), ubicazione attuale
    - `commissioni` — Opere su commissione: accordo, acconto, tempi, stato avanzamento, consegna; lega l'opera finita al catalogo
    - `esposizioni` — Mostre/gallerie/conto-vendita: quali opere dove, periodo, percentuale galleria, opere prestate da rientrare, esiti di vendita
    - `provenienza` — Provenienza & certificati: certificato d'autenticità per opera, storico passaggi/proprietari, supporto al diritto di seguito su rivendita

**Insegnamento creativo & workshop (corsi, lezioni, atelier)**
- *Attività esempio:* Insegnante di musica/canto con allievi a lezione settimanale; Fotografo o designer che tiene workshop e corsi serali; Scuola di danza / atelier di pittura per bambini e adulti in Ticino; Maestro d'arte che fa corsi di ceramica/disegno in bottega; Coach creativo / formatore per aziende
- *Flusso:* Calendario lezioni ricorrenti (settimanali) o workshop a date → iscrizioni e posti disponibili → pacchetti lezioni con saldo residuo → registro presenze → incasso a pacchetto/mensile. Critico: gestire pacchetti prepagati (quante lezioni restano), recuperi assenze e i posti limitati dei workshop.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `lezioni` — Lezioni ricorrenti per allievo: orario fisso settimanale, generazione automatica appuntamenti, registro presenze/assenze e recuperi
    - `pacchetti` — Pacchetti prepagati: n. lezioni acquistate, scalate a ogni presenza, saldo residuo, avviso 'pacchetto in esaurimento'
    - `iscrizioni` — Workshop/corsi a date: posti disponibili, lista iscritti, acconto iscrizione, lista d'attesa

**Service & noleggio creativo (audio-luci, attrezzatura foto/video)**
- *Attività esempio:* Service audio/luci per eventi e concerti nel Sopraceneri; Rental house di attrezzatura foto/video per professionisti; Noleggio strumenti musicali / backline; Studio di registrazione o sala prove che affitta a ore; Noleggio set/scenografie e arredi per shooting
- *Flusso:* Richiesta noleggio per date → verifica disponibilità del materiale in quel periodo → preventivo (giorni × tariffa + cauzione) → uscita materiale (check condizioni) → rientro (check danni, sblocco cauzione) → saldo. Critico: evitare il doppio-prenotato sullo stesso pezzo e tracciare manutenzione/condizioni dell'attrezzatura.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `macchine`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `noleggio` — Noleggio attrezzatura a calendario: ogni pezzo prenotabile per periodo, blocco doppio-booking, tariffa giornaliera, cauzione, stato uscito/rientrato
    - `check-materiale` — Check-out/check-in: foto e condizioni alla consegna e al rientro, danni rilevati, sblocco o trattenuta cauzione
    - `preventivi` — Preventivo noleggio/service (giorni + materiale + manodopera tecnici) → accettazione → diventa ordine/lavoro (modulo trasversale già pianificato)

---

### 🎉 Eventi & Spettacolo — Regia Eventi  *(archetipo: commessa-progetti)*
_Gestionale base per chi organizza, allestisce e anima eventi (matrimoni, feste aziendali, fiere, concerti, congressi). Il cuore non è il cliente singolo come nei servizi su appuntamento, ma l'EVENTO come progetto a data fissa e irreversibile: una commessa con timeline, fornitori da coordinare, attrezzature/personale da prenotare nello stesso slot, e un preventivo "a pacchetto" che evolve fino al saldo. L'app tiene insieme cinque cose che oggi le PMI del Ticino gestiscono su Excel + WhatsApp + agenda cartacea: (1) il calendario degli eventi con il rischio di doppia-prenotazione di sala/attrezzatura/personale nello stesso giorno; (2) la distinta fornitori e sub-service con i loro acconti e scadenze; (3) la timeline minuto-per-minuto del giorno-evento (run-sheet); (4) il preventivo a voci/pacchetti che diventa contratto con acconto e saldo; (5) il magazzino del materiale a nolo che esce e rientra. Si parte dalla BASE (hub, cal, clients, emps, notes, notif) + conti + sites (la commessa-evento) e si accendono i moduli specifici a seconda del mestiere. Volutamente NIENTE fatturazione IVA piena: si resta su preventivi a pacchetto + conti, con nota dove servirebbe davvero (location/agenzie strutturate)._

> 🇨🇭 **Mercato CH:** DOMANDA. Il Ticino ha un mercato eventi denso per le sue dimensioni: matrimoni destination (coppie svizzero-tedesche e lombarde attratte da ville, grotti e Lago di Lugano/Maggiore), forte stagione congressi/MICE (LAC, hotel 4-5*, Palazzo dei Congressi di Lugano), sagre e feste di paese estive che alimentano service audio-luci e noleggi, fiere e gala aziendali. È un settore frammentato in micro-PMI e freelance (planner, fioristi, DJ, service) che oggi lavorano su Excel + WhatsApp + agenda cartacea: dolore reale e ricorrente sul doppio-booking di sala/attrezzatura/personale e sul coordinamento fornitori.

DISPONIBILITÀ A PAGARE. Medio-alta ma stagionale e a due velocità: planner di fascia alta, location e service strutturati hanno margini buoni e pagano volentieri per non sbagliare una data (un errore su un matrimonio è irreparabile e reputazionalmente costoso) — qui un canone CHF mensile per-utente è sostenibile. Animatori/DJ/fioristi piccoli sono più sensibili al prezzo e stagionali: meglio un piano base economico con pochi moduli (evento + preventivi + conti) e upgrade nei mesi caldi. La leva di vendita è il calendario anti-conflitto + il preventivo a pacchetto, non funzioni gestionali astratte.

SPECIFICITÀ LOCALI / LINGUE. (1) Lingue: il Ticino è italofono ma la clientela eventi è fortemente IT/DE (sposi e aziende d'oltralpe) e in parte FR/EN per il MICE internazionale — preventivi, contratti e timeline andrebbero esportabili almeno IT/DE/EN. (2) Multi-valuta di fatto: clienti che ragionano in EUR (Lombardia) anche se si fattura in CHF. (3) Normativa: per concerti/sagre contano permessi comunali, SUISA (diritti d'autore musica, voce di costo ricorrente per DJ/band/service), notifiche AVS/lavoro per hostess e personale a chiamata, e per il catering interno alle location l'igiene alimentare — la nostra app li tratta come scadenze/voci di costo, NON come adempimenti automatizzati.

VINCOLO DI SCOPE DA SEGNALARE. Location strutturate e agenzie eventi che fatturano servizi compositi (affitto sala + catering + extra, con IVA svizzera all'8.1%) toccano i limiti del nostro 'preventivi + conti': qui una vera fatturazione IVA con acconti/saldi e note di credito servirebbe davvero. Da valutare un modulo 'fatture-ch' dedicato (preventivo→acconto→saldo→fattura QR svizzera) prima di vendere ai segmenti più strutturati; per planner/fioristi/animatori il combo preventivi+conti resta sufficiente. WhatsApp per conferme e timeline ai fornitori sarebbe il canale naturale ma resta 'prossimamente'.

**Wedding & event planner**
- *Attività esempio:* Wedding planner freelance sul Lago di Lugano (matrimoni in ville e grotti ticinesi); Agenzia eventi aziendali di Lugano/Bellinzona (convention, cene di gala, team building); Organizzatrice di battesimi/cresime/compleanni a tema in Mendrisiotto; Planner specializzata in matrimoni destination per coppie svizzero-tedesche e lombarde; Agenzia per congressi e meeting (MICE) con sedi al LAC e in hotel 4-5 stelle
- *Flusso:* Ogni evento è una commessa con UNA data fissa e irreversibile. Dal primo contatto: brief cliente e budget, poi preventivo a pacchetti (base/plus/premium), acconto alla firma, costruzione della distinta fornitori (catering, fiorista, fotografo, musica, location), una timeline/run-sheet del giorno con orari minuto-per-minuto, e il saldo a evento concluso. Il planner deve vedere a colpo d'occhio: quali eventi sono in quale fase (lead→preventivo→confermato→in produzione→fatto), quali fornitori sono ancora da bloccare, quali acconti/scadenze incombono.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `sites`, `preventivi`, `documenti`
- *Moduli specifici da costruire:*
    - `evento` — Scheda Evento come commessa a data fissa: tipo (matrimonio/aziendale/privato), data, location, n. invitati, budget, stato nel pipeline (lead→preventivo→confermato→in corso→concluso→saldato). È il contenitore a cui si agganciano fornitori, timeline, pacchetto e costi. Diverso da sites: ruota attorno a una data-evento unica e alla guest list, non alle ore-cantiere.
    - `fornitori` — Rubrica fornitori/sub-service (catering, fiorista, DJ, fotografo, noleggi) con specialità, listino indicativo, affidabilità; per ogni evento la distinta dei fornitori ingaggiati con stato (da contattare/opzionato/confermato), acconto versato e scadenza saldo.
    - `timeline` — Run-sheet del giorno-evento: scaletta minuto-per-minuto (arrivo allestitori, cerimonia, aperitivo, taglio torta, fine musica) con responsabile per ogni voce, condivisibile col team e i fornitori. Genera anche la checklist pre-evento.
    - `pacchetti` — Preventivo a pacchetto: comporre l'offerta da blocchi predefiniti (es. 'matrimonio chiavi in mano', 'aperitivo + cena', 'allestimento sala') con prezzo a pacchetto, opzioni e supplementi, in CHF; il cliente sceglie il livello e l'offerta diventa contratto. Si appoggia a preventivi per accettazione/acconto.

**Noleggio attrezzature & allestimenti eventi**
- *Attività esempio:* Noleggio audio/luci/palchi per feste e concerti (service tecnico) nel Luganese; Noleggio tavoli, sedie Chiavari, tovagliato, stoviglie e gazebo per banchetti; Allestitore di stand fieristici e gazebo per sagre e mercatini ticinesi; Noleggio strutture: tensostrutture, pedane da ballo, pista LED, riscaldatori; Service luci architetturali e proiezioni per inaugurazioni e gala
- *Flusso:* Il cuore è la DISPONIBILITÀ nel tempo: lo stesso pezzo (mixer, set tavoli, gazebo) non può essere a due eventi nello stesso weekend. Flusso: richiesta cliente per una data → si verifica disponibilità del materiale in quel periodo → preventivo a nolo (tariffa a giorno/weekend + trasporto + montaggio) → conferma con acconto/cauzione → uscita materiale (carico furgone, bolla) → evento → rientro con controllo danni/mancanze → saldo e svincolo cauzione. Servono: planning a calendario per articolo, checklist di carico/scarico, gestione cauzioni e ammanchi.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `preventivi`, `mezzi`
- *Moduli specifici da costruire:*
    - `nolo` — Inventario a noleggio con DISPONIBILITÀ a calendario: ogni articolo (o lotto: '120 sedie Chiavari') ha un planning prenotazioni per data; blocca il pezzo nelle date impegnate ed evita il doppio-booking. Tariffa a giorno/weekend, quantità disponibile, stato (libero/opzionato/fuori/in manutenzione). È il magazzino declinato sul tempo, non sulle scorte di vendita.
    - `uscite` — Bolle di uscita/rientro materiale: checklist carico furgone per evento, lista pezzi consegnati con firma, controllo al rientro (mancanze, danni), cauzione trattenuta/restituita. Collega l'attrezzatura uscita all'evento e al furgone/squadra.
    - `evento` — Scheda Evento/ordine-nolo a data fissa che raggruppa: articoli prenotati, montaggio/smontaggio, trasporto, squadra assegnata; serve come commessa attorno a cui ruotano nolo e uscite.

**Fiorista & allestimento floreale eventi**
- *Attività esempio:* Fiorista di Lugano con linea matrimoni (bouquet, centrotavola, archi floreali); Flower designer freelance per gala aziendali e vetrine stagionali; Negozio di fiori con consegne ricorrenti a hotel, studi e ristoranti; Allestitore floreale per chiese e ville (cerimonie, anniversari); Atelier botanico per shooting, eventi moda e inaugurazioni
- *Flusso:* Doppio binario: (a) commesse-evento (matrimonio, gala) con sopralluogo, moodboard, preventivo a composizioni, ordine fiori al grossista calibrato sulla data, allestimento in loco e ritiro; (b) abbonamenti ricorrenti (fiori freschi ogni lunedì a un hotel). Il fiorista deve tracciare: cosa serve per ogni evento (distinta composizioni), quando ordinare il fresco (deperibile, no scorta!), le consegne ricorrenti dei contratti, e il preventivo per tipologia di pezzo.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `preventivi`, `ricorrenze`, `zone`
- *Moduli specifici da costruire:*
    - `composizioni` — Catalogo composizioni floreali (bouquet sposa, centrotavola, arco) con foto, fiori/materiali necessari e prezzo; per ogni evento la distinta delle composizioni richieste, da cui generare l'ordine fiori al grossista calibrato sulla data (il fresco non si stocca).
    - `consegne-ric` — Consegne floreali ricorrenti (abbonamenti hotel/ristoranti/studi): giro settimanale auto-generato, cosa consegnare a chi e quando, rinnovo abbonamento. Si appoggia a ricorrenze e zone per il giro.
    - `evento` — Scheda Evento floreale a data fissa: location cerimonia, orario allestimento e orario ritiro, distinta composizioni, sopralluogo e moodboard allegati.

**Location, sale & ville per eventi**
- *Attività esempio:* Villa storica o grotto ticinese affittato per matrimoni e ricevimenti; Sala polivalente / sala feste comunale gestita da un'associazione; Agriturismo o cantina con spazi per eventi privati e degustazioni; Spazio coworking/loft affittato per workshop, shooting e meeting aziendali; Boutique hotel con sale meeting e terrazza per cerimonie
- *Flusso:* Il vincolo è la SALA: uno spazio, una data, un evento. Flusso: richiesta sopralluogo → preventivo (affitto sala + servizi: catering interno/esterno, allestimento, pulizie) → opzione con scadenza ('tengo la data fino al...') → conferma con acconto → consegna spazio il giorno → riconsegna e saldo cauzione. Va evitata la doppia prenotazione della stessa sala/data, gestite le 'opzioni' che scadono, e regolato l'ingresso dei fornitori esterni (chi entra, quando, regole della struttura).
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `preventivi`, `documenti`
- *Moduli specifici da costruire:*
    - `sale` — Calendario di occupazione degli spazi: ogni sala/spazio (salone, terrazza, giardino) con disponibilità per data e capienza; gestisce le OPZIONI con scadenza (data tenuta in attesa di conferma, rilasciata se non si conferma) ed evita doppie prenotazioni dello stesso spazio.
    - `evento` — Scheda Evento/prenotazione sala a data fissa: spazio, n. invitati, orari di accesso e uscita, servizi inclusi, fornitori esterni autorizzati a entrare, cauzione.
    - `regolamento` — Regole e logistica della struttura per ogni evento: orari max musica, accesso fornitori, pulizie finali, checklist consegna/riconsegna spazio con stato (per gestire cauzione e danni).

**Service audio-video & tecnici palco**
- *Attività esempio:* Service audio-luci per concerti, sagre e feste di paese in Ticino; Ditta di noleggio + tecnici per congressi al LAC e in hotel (regia, schermi); Service per livestreaming e riprese di eventi aziendali e matrimoni; Allestitore palchi e americane (truss) per concerti e premiazioni; Tecnico luci/DJ per discoteche, club e serate private
- *Flusso:* Mette insieme due cose: ATTREZZATURA (come il noleggio) e PERSONALE TECNICO (fonici, datori luci, riggers, cameraman) — entrambi non duplicabili nello stesso slot. Flusso: richiesta per una data → check disponibilità materiale + tecnici → preventivo (nolo + giornate uomo + trasporto) → conferma → scheda tecnica/rider e plot luci → montaggio, evento, smontaggio → consuntivo ore tecnici e saldo. Il nodo è il planning incrociato: né il mixer né il fonico possono stare in due posti il sabato sera.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `preventivi`, `mezzi`, `turni`
- *Moduli specifici da costruire:*
    - `nolo` — Inventario tecnico a noleggio con disponibilità a calendario (casse, mixer, fari, truss, schermi LED): evita il doppio-booking del materiale nello stesso slot; tariffa a giorno/evento, stato libero/fuori/manutenzione. Condiviso con il sotto-settore noleggio.
    - `tecnici` — Disponibilità del personale tecnico per data/turno (fonico, datore luci, rigger, cameraman): assegna le persone all'evento, segnala conflitti se già impegnate, e a consuntivo somma le giornate/ore uomo per la paga e il costo evento. Si appoggia a emps e turni.
    - `scheda-tecnica` — Rider/scheda tecnica e plot per evento: lista materiale, schema palco/luci, requisiti location (corrente, accessi, carico/scarico), allegati PDF condivisi col cliente e con la squadra.

**Animazione, intrattenimento & artisti**
- *Attività esempio:* Agenzia di animazione per feste bimbi, baby parking e gonfiabili; DJ / band / gruppo musicale per matrimoni e feste aziendali; Artisti da spettacolo: mago, trampolieri, sputafuoco, caricaturista; Agenzia hostess/steward e promoter per fiere e congressi (es. fiere di Lugano); Animazione per villaggi turistici e centri benessere stagionali
- *Flusso:* Si vende TEMPO DI PERSONE (artisti, animatori, hostess) su date precise. Flusso: richiesta per una data/orario → si verifica chi è libero (artista interno o in cast) e a che cachet → preventivo (cachet + trasferta + extra) → conferma con acconto → ingaggio/contratto artista → giorno dell'evento con call-time e dotazione → saldo a cachet, e per le hostess il consuntivo ore. Il nodo è il planning del cast: chi è disponibile quel giorno, dove, e quanto costa.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`, `preventivi`, `turni`
- *Moduli specifici da costruire:*
    - `cast` — Roster di artisti/animatori/hostess (interni + collaboratori esterni) con specialità, zona, cachet/tariffa e disponibilità a calendario; per ogni evento assegna chi va, con call-time e luogo, segnalando i conflitti di data. È emps esteso a collaboratori a chiamata.
    - `ingaggi` — Ingaggi/scritture artistiche per evento: cachet pattuito, acconto, trasferta, dotazione richiesta (impianto, camerino), e per le hostess il consuntivo ore lavorate da liquidare; produce il foglio-ingaggio per l'artista.
    - `evento` — Scheda Evento/spettacolo a data fissa: tipo intrattenimento, orario performance, durata, location, artisti assegnati e referente sul posto.

---

### 🛒 Banco — Cassa & Magazzino  *(archetipo: retail)*
_Gestionale base per chi vende prodotti al bancone, in negozio, online o al mercato: tiene insieme listino, scorte, cassa giornaliera, fidelity e riordini ai fornitori. A differenza dei gestionali "su appuntamento", qui il cuore è il prodotto (codice/barcode, prezzo, giacenza) e la vendita ripetuta a clienti anonimi o fidelizzati, non l'intervento programmato. Si accendono solo i moduli del canale di vendita reale del negozio: chi ha solo il punto fisico non vede l'e-commerce, l'ambulante non vede gli scaffali fissi. Restano fuori la fatturazione fiscale completa (si usano preventivi + conti) e l'IVA strutturata: per le PMI ticinesi che ce l'hanno davvero, va segnalato come limite. Non sostituisce un POS fiscale certificato dove serve, ma copre il 90% di chi oggi lavora con quaderno, Excel e calcolatrice._

> 🇨🇭 **Mercato CH:** Domanda reale: alta ma frammentata. In Ticino moltissime PMI del commercio lavorano ancora con quaderno, Excel e un registratore di cassa "muto" che non parla col magazzino. Il dolore numero uno è non sapere cosa c'è in giacenza e cosa riordinare; il secondo è la chiusura cassa serale a mano. Disponibilità a pagare: medio-bassa per il negozietto di vicinato (margini risicati, sensibilità al prezzo: il canone CHF 59/mese va giustificato col tempo risparmiato sugli ordini e sull'inventario), medio-alta per grossisti/distributori e per chi vende anche online (lì il valore di una giacenza unica omnicanale e dei giri consegna è evidente e giustifica il piano superiore). Specificità locali da rispettare: (1) lingue IT in Ticino, ma per scalare alla Svizzera tedesca/romanda serviranno DE e FR fin dall'inizio nel design; (2) La Posta Svizzera è lo standard de facto per le spedizioni e-commerce, integrare etichette/tracking CH (non corrieri esteri) è un plus concreto; (3) pagamenti: contanti ancora molto usati al banco e ai mercati, ma TWINT è ormai atteso ovunque — almeno registrarlo come metodo di incasso. Vincolo IVA/fiscale: questo è il punto critico per il retail. Molte attività superano la soglia di assoggettamento IVA (CHF 100'000 di fatturato) e hanno bisogno di scontrini/rendiconti IVA corretti; MODULA per scelta non fa fatturazione fiscale né IVA strutturata. Va detto chiaro al cliente: la cassa MODULA è gestionale (scarico magazzino, incassi, chiusura), non un POS fiscale certificato. Per chi ha l'obbligo IVA pieno, posizionarlo come affiancamento al cassetto fiscale esistente, non come sostituto — oppure mettere a roadmap un modulo IVA/scontrino conforme se il segmento lo richiede in massa. WhatsApp per avvisi "il tuo ordine è pronto/spedito" è molto richiesto nel retail/e-commerce ticinese, ma resta "prossimamente".

**Negozio al dettaglio non alimentare (abbigliamento, calzature, ferramenta, librerie, giocattoli, ottica retail)**
- *Attività esempio:* Boutique abbigliamento donna in centro a Lugano (taglie/colori, cambi di stagione); Negozio di calzature a Bellinzona (numeri, modelli, resi); Ferramenta di paese in Valle (migliaia di articoli sfusi, viti a peso/pezzo); Libreria indipendente a Locarno (ISBN, ordini su richiesta, conto deposito); Negozio di ottica a Chiasso (montature a magazzino, lenti su ordinazione); Negozio di giocattoli stagionale (picco Natale, riordini rapidi)
- *Flusso:* Ogni giorno: vendere al bancone scaricando la giacenza, gestire taglie/colori/varianti, chiudere la cassa, riordinare al fornitore ciò che scende sotto scorta minima, registrare resi/cambi. Picchi stagionali (saldi, Natale) e tanti articoli con varianti.
- *Moduli core:* `hub`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `catalogo` — Listino prodotti con codice/barcode, prezzo acquisto e vendita, categoria, foto, IVA per riga (solo come campo, non calcolo fiscale)
    - `magazzino` — Giacenze per articolo, carico/scarico, scorta minima con alert, inventario periodico
    - `varianti` — Taglie/colori/misure di uno stesso articolo con giacenza per singola variante (matrice taglia x colore)
    - `cassa` — Vendita rapida al bancone (scansione/ricerca articolo) che scarica il magazzino, scontrino non fiscale, chiusura cassa giornaliera, contante/carte
    - `fidelity` — Tessera punti/promozioni cliente, raccolta punti per spesa, buoni sconto, storico acquisti
    - `resi` — Resi e cambi merce: rientro in giacenza, buono/rimborso, motivo, collegato alla vendita originale

**Alimentari di vicinato e negozi specializzati food (drogheria, macelleria, panetteria-vendita, salumeria, formaggi)**
- *Attività esempio:* Alimentari di quartiere a Lugano con prodotti regionali ticinesi; Macelleria-salumeria con vendita al banco a peso e lotti/scadenze; Negozio di formaggi e prodotti del territorio (Sbrinz, formaggini ticinesi); Drogheria/negozio bio a Mendrisio con sfusi e secchi; Enoteca-vendita con bottiglie a magazzino e annate; Panetteria con angolo vendita pane e dolci freschi del giorno
- *Flusso:* Vendita a peso o a pezzo, gestione di lotti e scadenze (deperibili), invenduto del giorno, riordino frequente di freschi, rispetto delle regole igieniche. Margini bassi, rotazione alta, controllo sprechi.
- *Moduli core:* `hub`, `conti`, `clients`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `catalogo` — Articoli a peso o a pezzo, prezzo al kg, fornitore, reparto
    - `magazzino` — Giacenze, carico merce, scorta minima
    - `lotti-scadenze` — Lotti con data di scadenza per deperibili, alert prodotti in scadenza, registro per tracciabilità alimentare
    - `cassa` — Vendita a peso/pezzo con bilancia manuale, chiusura cassa giornaliera
    - `ordini-forn` — Ordini ai fornitori (freschi quotidiani), bozza ordine da scorte basse, conferma e carico all'arrivo
    - `sprechi` — Registro invenduto/scaduto/buttato per capire gli sprechi e correggere gli ordini

**E-commerce e vendita online (PMI, artigiani che vendono, drop locale)**
- *Attività esempio:* Brand ticinese di prodotti artigianali che vende online (miele, cosmetici naturali); Negozio fisico con anche shop online (omnicanale); Vendita su marketplace (Ricardo.ch, Galaxus) gestita a parte; Cantina/azienda agricola che spedisce vino e prodotti in tutta la CH; Piccolo e-commerce di accessori con magazzino in casa/garage
- *Flusso:* Arrivano ordini (dal sito o marketplace), si prepara il pacco scaricando il magazzino, si stampa l'etichetta, si spedisce con La Posta/corriere, si traccia, si gestiscono resi e clienti. La giacenza deve essere unica tra negozio fisico e online.
- *Moduli core:* `hub`, `clients`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `catalogo` — Schede prodotto con prezzo, foto, descrizione, disponibilità per il canale online
    - `magazzino` — Giacenza unica condivisa tra punto fisico e online, scorta minima
    - `ordini-web` — Ordini in entrata (manuali o importati), stato (nuovo/preparato/spedito/consegnato), dati cliente e indirizzo
    - `spedizioni` — Preparazione spedizioni, etichetta La Posta/corriere, numero di tracciamento, costi spedizione CH
    - `resi` — Gestione resi e rimborsi con rientro a magazzino
    - `fidelity` — Codici sconto e clienti ricorrenti per il canale online

**Mercati e ambulanti (banco mobile, fiere, mercatini)**
- *Attività esempio:* Ambulante di abbigliamento sui mercati settimanali ticinesi (Lugano martedì/venerdì, Bellinzona sabato); Bancarella di frutta e verdura al mercato di Mendrisio; Produttore di formaggi/salumi che gira i mercati di paese e le sagre; Venditore di fiori e piante su mercato e per eventi; Hobbista/artigiano che vende a fiere e mercatini stagionali
- *Flusso:* Carica il furgone, gira più piazze/giornate, vende per lo più in contanti senza connessione affidabile, a fine giornata conta l'incasso e il venduto per banco/mercato. Deve sapere cosa portare e cosa ricaricare. Niente scaffale fisso: il magazzino è il furgone.
- *Moduli core:* `hub`, `conti`, `zone`, `notes`, `clients`
- *Moduli specifici da costruire:*
    - `catalogo` — Listino semplice con prezzi tondi da banco, categorie
    - `cassa` — Vendita rapida offline (funziona senza rete), contanti, chiusura per giornata
    - `banchi` — Anagrafica mercati/piazze e calendario presenze (quale mercato che giorno), incasso per banco/giornata
    - `carico-furgone` — Cosa carico stamattina e cosa torna invenduto: lista di carico/scarico per giornata, scorte nel furgone
    - `fidelity` — Clienti affezionati del mercato, prenotazioni del prodotto per la settimana dopo

**Distributori e grossisti (vendita B2B, all'ingrosso)**
- *Attività esempio:* Grossista alimentare che rifornisce ristoranti e bar del Ticino; Distributore di materiale elettrico/idraulico per installatori; Cash & carry per professionisti dell'edilizia; Grossista di bevande con consegna a locali; Distributore di cancelleria/forniture ufficio per aziende
- *Flusso:* Clienti professionali fissi con listino dedicato e sconti, ordini ripetuti, consegna su giro o ritiro, pagamento differito (fido/scadenze), grandi volumi di magazzino. Conta il margine per cliente e il giro consegne.
- *Moduli core:* `hub`, `clients`, `conti`, `zone`, `notif`
- *Moduli specifici da costruire:*
    - `catalogo` — Listino articoli all'ingrosso con prezzi a scaglioni/quantità
    - `magazzino` — Giacenze a volume, ubicazioni, scorta minima, carico da fornitore
    - `listini-cliente` — Listini e sconti personalizzati per cliente B2B, condizioni concordate
    - `ordini-b2b` — Ordini cliente ripetibili, bolla di consegna, riordino rapido dell'ordine precedente
    - `consegne` — Giri di consegna ai clienti (riusa la logica di pellet/giri): pianifica le tappe, conferma consegnato
    - `fidi-scadenze` — Pagamenti differiti: fido per cliente, scadenze incassi, esposizione/insoluti

**Edicole, tabaccherie e punti servizi di vicinato**
- *Attività esempio:* Edicola-tabaccheria di paese con giornali, riviste, ricariche e biglietti; Chiosco con giornali, sigarette, articoli da regalo e Lotto/Sport-Toto; Cartoleria-edicola con scuola e ufficio; Punto vendita con servizi (ricariche telefoniche, bollettini, biglietti bus/treno); Negozietto multiservizi di stazione/quartiere
- *Flusso:* Tanti prodotti a basso valore e alta rotazione, resa quotidiana dei giornali invenduti, clienti abituali, vendita servizi (ricariche, biglietti) con commissione. Margini risicati: conta tenere d'occhio cosa rende e gestire le rese editore.
- *Moduli core:* `hub`, `conti`, `clients`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `catalogo` — Articoli con margine/commissione, categorie (stampa, tabacchi, regalo, servizi)
    - `cassa` — Vendita veloce con tasti rapidi per i più venduti, chiusura cassa giornaliera
    - `rese-editore` — Giornali/riviste: copie ricevute, vendute e rese all'editore, accredito reso, scadenze testate
    - `servizi-punto` — Registro vendita servizi (ricariche, bollettini, biglietti, Lotto) con commissione incassata
    - `fidelity` — Clienti abituali, abbonamenti riviste/giornali da consegnare o tenere da parte

**Fiorai e garden con negozio (vendita piante, fiori, composizioni)**
- *Attività esempio:* Fioraio in centro con vendita banco + ordini per matrimoni/funerali; Garden center di periferia con piante, sementi, vasi, terriccio; Negozio di fiori con servizio consegna a domicilio in zona; Vivaio-negozio con vendita stagionale (Pasqua, Ognissanti, Natale); Floricoltore che vende diretto e fa consegne per eventi
- *Flusso:* Vende prodotti freschissimi e deperibili (fiori), piante stagionali, e su ordinazione composizioni per eventi/cerimonie con consegna a data e ora precise. Mix tra vendita al banco e ordini su commessa con consegna. Forte stagionalità.
- *Moduli core:* `hub`, `clients`, `conti`, `cal`, `zone`
- *Moduli specifici da costruire:*
    - `catalogo` — Prodotti (fiori a stelo, piante, vasi, accessori) e composizioni a listino con prezzo
    - `magazzino` — Giacenze piante/articoli, freschi deperibili con scarto, scorta minima stagionale
    - `cassa` — Vendita al banco con scarico magazzino e chiusura giornaliera
    - `ordini-comp` — Ordini composizioni per cerimonie/eventi: cosa, per quando, per chi, consegna a data/ora, acconto
    - `consegne` — Giro consegne a domicilio (fiori/piante) con tappe e conferma consegnato

---

### 📂 Studio Pro — gestionale per studi professionali e servizi B2B  *(archetipo: commessa-progetti)*
_Gestionale base per chi vende tempo, competenza e documenti: studi professionali e agenzie B2B. Il cuore non sono cantieri o consegne, ma la PRATICA/DOSSIER per cliente — un fascicolo che raccoglie attività, ore lavorate (timesheet), scadenze obbligatorie, documenti e comunicazioni, dalla presa in carico alla chiusura. Su questa spina dorsale si accendono i moduli specifici del singolo studio (fiduciaria, avvocato, architetto, agenzia, IT/MSP). Confine di scope netto: MODULA gestisce l'operatività dello studio (chi fa cosa, su quale pratica, entro quando, con quante ore e quali file), NON la contabilità fiscale né la fatturazione IVA/QR-fattura — per la parcella si usa 'preventivi' + 'conti', e dove serve davvero fatturazione fiscale lo studio resta su bexio/Banana e MODULA gli sta complementare. Differenza chiave rispetto ai settori field-service del catalogo: qui il valore vendibile è 'non perderti una scadenza, sappi quante ore hai messo su ogni cliente e ritrova ogni documento in 3 secondi'. Forte richiesta in Ticino dove gli studi sono piccoli (1–15 persone), oggi gestiti a Excel + cartelle + Outlook, e dove la billabilità delle ore e il rispetto delle scadenze (fiscali, legali, di mandato) sono il margine stesso dello studio._

> 🇨🇭 **Mercato CH:** Mercato reale e disponibilità a pagare: il Ticino conta migliaia di micro-studi professionali (fiduciarie, studi legali e d'architettura, agenzie) per lo più 1–15 persone, oggi inchiodati a Excel + cartelle di rete + Outlook. È un segmento ad alta marginalità e alta disponibilità a pagare: questi studi già spendono CHF 50–150/utente/mese per software verticali (es. WebTimeSheet, AbaWeb, Klyck, Bexio, gestionali legali italiani/svizzeri), quindi il canone MODULA (CHF 59 base 4 utenti + CHF 4/dipendente, moduli a CHF 15/25/39, o 'Tutto compreso' CHF 190) è perfettamente in target e spesso più economico del verticale dedicato. Il dolore numero uno che apre il portafoglio è la SCADENZA MANCATA (fiscale, processuale, di mandato) e il NON SAPERE quante ore si sono messe su un cliente: due cose che MODULA vende benissimo con 'scadenziario' + 'timesheet'. CONFINE DI SCOPE da dichiarare al cliente: gli studi vogliono spesso anche la fatturazione/parcella; MODULA NON fa fatturazione fiscale né QR-fattura né IVA — per la fiduciaria e l'avvocato questo è un limite reale, quindi va posizionato come complementare (loro tengono bexio/Banana/AbaNinja per fatture e contabilità; MODULA fa pratiche, ore, scadenze, documenti). Per la nota d'onorario/preventivo bastano 'preventivi' + 'conti'. Specificità locali: (1) plurilinguismo — il Ticino è IT ma per scalare a un'agenzia/MSP con clienti oltre Gottardo serve DE/FR, e per i traduttori il multilingua è il prodotto stesso; (2) protezione dati molto sentita — questi studi trattano PII e dati sensibilissimi (dati fiscali, CV con permessi di lavoro, atti legali, dati salariali), quindi RLS rigorose, residenza dati in CH (Supabase Zurigo, già in valutazione) e conformità nLPD/GDPR sono argomenti di vendita, non dettagli tecnici; (3) il commercialista/fiduciario è anche un CANALE: chi convince una fiduciaria spesso entra nelle sue PMI clienti. WhatsApp (oggi 'prossimamente') sarebbe molto richiesto da agenzie e MSP per i ticket, ma non darlo per scontato in offerta.

**Fiduciarie / Commercialisti / Contabilità esterna**
- *Attività esempio:* Fiduciaria a Lugano che tiene la contabilità a 60 PMI ticinesi (libro mastro su Banana/bexio, dichiarazioni IVA); Studio di consulenza fiscale e fiscalità a Bellinzona (dichiarazioni imposte persone fisiche e giuridiche); Ufficio paghe / amministrazione del personale esternalizzata (salari, AVS, LPP, certificati di salario); Fiduciaria immobiliare che amministra condomini e stabili a Locarno; Revisore contabile / ufficio di revisione per piccole SA e Sagl
- *Flusso:* Ogni cliente = un mandato ricorrente. Lo studio deve tracciare per cliente: le pratiche aperte (chiusura conti, dichiarazione IVA trimestrale, dichiarazione d'imposta annuale, conteggi AVS/LPP), lo scadenziario fiscale (date che si ripetono ogni anno e non si possono mancare), le ore messe su ciascun cliente (per capire se il forfait annuo è ancora redditizio), i documenti ricevuti/prodotti (giustificativi, bilanci, dichiarazioni) e a che punto è la pratica (in attesa documenti dal cliente / in lavorazione / da firmare / depositata).
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `pratiche` — Fascicolo-pratica per cliente: tipo (IVA / dichiarazione / paghe / chiusura conti), stato (attesa-docs / in-lavorazione / da-firmare / depositata), responsabile, collegamento a ore-documenti-scadenze. È la spina dorsale del gestionale.
    - `scadenziario` — Scadenze fiscali/legali ricorrenti per cliente con avvisi automatici: IVA trimestrale, dichiarazione d'imposta cantonale, conteggi AVS, termini di deposito. Riusabile trasversale (già pianificato).
    - `timesheet` — Ore lavorate per cliente/pratica/collaboratore, fatturabili o no, con tariffa oraria; report ore-per-cliente per capire redditività del mandato.
    - `checklist-pratica` — Liste di controllo riusabili per tipo di pratica (es. checklist chiusura conti, checklist dichiarazione) così nessun passo viene saltato; spunta + responsabile per ogni step.
    - `portale-cliente` — Area dove il cliente carica i suoi giustificativi/documenti e lo studio carica i prodotti finiti (bilancio, dichiarazione da firmare); riduce lo scambio via email e WhatsApp.

**Avvocati / Notai / Studi legali**
- *Attività esempio:* Studio legale a Lugano con 3 avvocati (diritto civile, contrattuale, successioni); Avvocato penalista / patrocinatore che lavora molto su gratuito patrocinio e termini processuali; Notaio in Ticino (rogiti, compravendite immobiliari, costituzioni di società, successioni); Studio specializzato in diritto del lavoro e diritto della locazione (sfratti, disdette); Consulente legale aziendale / fiduciario legale per PMI
- *Flusso:* Tutto ruota attorno al fascicolo (pratica legale / incarto) per cliente e controparte. Lo studio deve gestire: anagrafica clienti E controparti con check anti conflitto d'interessi, termini perentori e udienze (la scadenza mancata = responsabilità professionale), il time tracking dettagliato per onorario (il legale spesso fattura a ore o a valore di causa), tutti gli atti e documenti del fascicolo, e — per il notaio — il flusso del rogito (bozza atto, appuntamento firma, registrazioni, repertorio). Riservatezza dei dati altissima.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `documenti`, `conti`
- *Moduli specifici da costruire:*
    - `fascicoli` — Incarto legale per pratica: cliente + controparte/i, materia, foro/autorità, stato, avvocato responsabile, collegamento a termini-atti-ore. Variante 'legal' di pratiche.
    - `scadenze-legali` — Termini perentori, udienze, scadenze processuali con avviso anticipato a più giorni e doppia conferma; la dimenticanza qui è il rischio numero uno dello studio.
    - `timesheet` — Registro prestazioni a ore per fascicolo e per avvocato, con tariffa, voce di prestazione e indicatore fatturabile; base per la nota d'onorario (non fattura fiscale).
    - `conflitti` — Verifica conflitto d'interessi: cerca se cliente o controparte sono già presenti in altri fascicoli prima di accettare l'incarico.
    - `rogiti` — (Notai) Flusso atto notarile: bozza, parti, appuntamento firma, registrazioni/RF, numero di repertorio, archivio atti.

**Architetti / Ingegneri / Geometri / Studi tecnici**
- *Attività esempio:* Studio di architettura a Mendrisio (progettazione, domande di costruzione, direzione lavori); Studio d'ingegneria civile/strutturale per calcoli e progetti esecutivi; Geometra / ufficio di misurazione (frazionamenti, rilievi, confini, mutazioni catastali); Studio di ingegneria impiantistica RVCS (riscaldamento, ventilazione, sanitario); Progettista certificato Minergie / consulente energetico per edifici
- *Flusso:* Il lavoro è organizzato per COMMESSA/progetto (mandato di progettazione), spesso lungo mesi e suddiviso in fasi SIA (avamprogetto, progetto, appalto, esecuzione/direzione lavori). Lo studio deve tracciare: ogni commessa con le sue fasi e il budget ore, le ore dei collaboratori per fase (per verificare se l'onorario a percentuale o forfait regge), le scadenze (consegna domanda di costruzione, termini autorizzazioni, milestone di cantiere), i documenti/piani con il loro versioning, e i sopralluoghi/verbali di cantiere durante la direzione lavori.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `sites`, `conti`
- *Moduli specifici da costruire:*
    - `commesse-pro` — Commessa di progettazione per cliente con fasi SIA (avamprogetto→progetto→appalto→DL), budget ore per fase, % avanzamento e responsabile; è il fascicolo dello studio tecnico.
    - `timesheet` — Ore per commessa/fase/collaboratore con tariffa; confronto ore preventivate vs consuntivate per fase, per non andare in perdita sull'onorario.
    - `elaborati` — Archivio piani/elaborati con versione e revisione (es. P-01 rev.C), tipo (architettonico/strutturale/impianti) e stato; ritrova sempre l'ultima versione approvata.
    - `verbali` — Verbali di sopralluogo e riunione di cantiere: presenti, decisioni, foto, punti aperti con responsabile e scadenza; PDF firmabile.
    - `domande-costruzione` — Iter pratiche edilizie / domande di costruzione: dossier per pratica, ente (Comune/Cantone), stato (deposito→pubblicazione→licenza), scadenze e documenti richiesti.

**Agenzie marketing / comunicazione / social / web**
- *Attività esempio:* Agenzia di comunicazione a Lugano (branding, campagne, social media management per PMI); Agenzia web / web studio (siti, e-commerce, manutenzione e hosting a retainer); Social media manager / freelance content che gestisce i canali di più clienti; Agenzia di performance marketing / ADV (gestione budget Google/Meta a fee mensile); Studio di grafica e stampati / video maker per eventi aziendali
- *Flusso:* Modello misto progetto + abbonamento ricorrente (retainer mensile). L'agenzia deve gestire: i progetti dei clienti con le loro fasi e deliverable, le ore del team per progetto/cliente (la marginalità di un'agenzia è tutta lì), i clienti a retainer con il monte-ore mensile incluso e l'alert quando si sfora, il calendario editoriale dei contenuti social (cosa pubblicare, su quale canale, quando, stato approvato), e il flusso di approvazione delle bozze con il cliente. Spesso serve anche un piccolo CRM della pipeline commerciale (lead → offerta → cliente).
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `progetti-kanban` — Progetti cliente con board a colonne (da-fare/in-corso/in-review/fatto), task assegnati e deliverable; vista per cliente e per collaboratore.
    - `timesheet` — Ore per progetto/cliente/collaboratore con tariffa interna; report marginalità progetto (ore fatturate vs ore spese), il KPI vitale dell'agenzia.
    - `retainer` — Clienti ad abbonamento mensile: monte-ore/deliverable inclusi nel canone, consumo del mese e alert di sforamento per rinegoziare o fatturare l'extra.
    - `calendario-editoriale` — Piano editoriale social: post pianificati per canale e data, stato (bozza→da-approvare→approvato→pubblicato), anteprima testo/immagine.
    - `approvazioni` — Flusso di revisione bozze col cliente: link di approvazione, commenti, OK/modifiche richieste, storico versioni del deliverable.

**Consulenti / Traduttori / Servizi professionali B2B vari**
- *Attività esempio:* Consulente direzionale / business coach per PMI ticinesi; Agenzia o freelance di traduzione e localizzazione IT/DE/FR/EN (mercato CH plurilingue); Consulente HR / formatore aziendale e organizzatore di corsi; Consulente privacy/GDPR-LPD e compliance per aziende; Consulente in sussidi/finanziamenti e contributi pubblici
- *Flusso:* Lavoro a incarico/progetto, spesso con preventivo a monte e consuntivo a ore. Deve tracciare: ogni incarico per cliente con scadenza di consegna, le ore o le giornate lavorate, il preventivo accettato e il confronto con il consuntivo, i documenti prodotti (report, traduzioni consegnate, dossier), e le scadenze di consegna. Per il traduttore in più: progetti misurati a parole/cartelle e in più lingue, con consegne puntuali. Per il consulente sussidi: scadenze dei bandi (data ultima di presentazione).
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `incarichi` — Incarico/mandato per cliente: oggetto, scadenza consegna, stato, responsabile e collegamento a ore-preventivo-documenti; versione 'leggera' di pratiche per consulenti e freelance.
    - `preventivi` — Preventivo → invio → accettazione → diventa incarico; poi confronto preventivo vs ore effettive. Trasversale già pianificato.
    - `timesheet` — Ore o giornate per incarico/cliente con tariffa; per i traduttori conteggio a parole/cartelle invece che a ore.
    - `lingue-progetto` — (Traduttori) Progetto di traduzione multi-lingua: coppia linguistica, volume (parole/cartelle), traduttore/revisore assegnato, stato e consegna per ciascuna lingua.

**Agenzie di collocamento / lavoro interinale (HR)**
- *Attività esempio:* Agenzia di collocamento e lavoro temporaneo a Lugano/Chiasso (autorizzazione SECO); Società di selezione del personale / head hunting per PMI e industria; Agenzia interinale per edilizia, industria, sanità (frontalieri inclusi); Ufficio che gestisce il payroll e i contratti dei temporanei collocati
- *Flusso:* Doppia anagrafica: aziende clienti (che cercano personale) e candidati/lavoratori (che cercano lavoro). Deve gestire: le posizioni aperte richieste dai clienti, il matching candidato↔posizione e lo stato del candidato nel processo (colloquio→proposto→assunto), i contratti dei temporanei con date di inizio/fine missione e scadenze (permessi di lavoro, contratti a termine), e le ore lavorate dai temporanei presso il cliente (base per fatturare al cliente e pagare il lavoratore). Tema dati personali molto sensibile (CV, permessi, dati salariali).
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `conti`
- *Moduli specifici da costruire:*
    - `candidati` — Anagrafica candidati/lavoratori: competenze, disponibilità, CV, permesso di lavoro e scadenza, stato (disponibile/in-missione). Distinta dai clienti aziende.
    - `posizioni` — Posizioni aperte richieste dalle aziende clienti: profilo cercato, sede, stato; pipeline candidati per posizione (proposto→colloquio→assunto).
    - `missioni` — Missioni dei temporanei: lavoratore↔azienda, date inizio/fine, tariffa al cliente e paga al lavoratore, scadenza contratto/permesso con avviso.
    - `ore-missione` — Ore lavorate dal temporaneo presso il cliente (foglio ore approvato), base per fatturare al cliente e conteggiare il salario.

**IT / MSP / Assistenza informatica gestita**
- *Attività esempio:* MSP ticinese che gestisce IT e rete di studi e PMI (server, backup, sicurezza); Negozio/laboratorio di assistenza informatica e riparazione PC per aziende e privati; Software house / sviluppatori con clienti a manutenzione e supporto; Consulente cybersecurity / GDPR-LPD informatico per PMI; Installatore di centralini VoIP, reti e videosorveglianza per uffici
- *Flusso:* Modello a ticket di assistenza + contratti di manutenzione ricorrenti + inventario asset del cliente. Deve gestire: i ticket di supporto (chi ha aperto, priorità, stato, SLA), i contratti di assistenza ricorrenti con il loro canone e rinnovo, l'inventario degli asset IT presso ogni cliente (PC, server, licenze, scadenze garanzie/abbonamenti), le ore consumate per ticket/cliente (dentro o fuori contratto), e i progetti più grandi (migrazioni, nuovi impianti di rete). Forte sovrapposizione con i moduli field-service già esistenti.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notes`, `notif`, `man`, `conti`
- *Moduli specifici da costruire:*
    - `ticket` — Ticket di assistenza: cliente, priorità, stato (aperto→in-lavorazione→risolto), tecnico assegnato, SLA e ore consumate; con possibile apertura dal cliente.
    - `contratti-man` — Contratti di assistenza ricorrenti: canone, periodicità, ore incluse, rinnovo e alert scadenza. Trasversale già pianificato.
    - `asset-it` — Inventario asset IT per cliente: PC/server/dispositivi/licenze, numeri di serie, scadenze garanzie e abbonamenti con avviso di rinnovo.
    - `timesheet` — Ore per ticket/contratto/cliente, distinguendo ore dentro contratto da extra da fatturare; report consumo ore per cliente.

---

### 🏢 Gestione Immobiliare  *(archetipo: soci-membership)*
_Gestionale base per chi vive di immobili: il filo conduttore è il PORTAFOGLIO (oggetti immobiliari) collegato a CONTATTI/INQUILINI/PROPRIETARI, con CONTRATTI che generano SCADENZE ricorrenti (canoni, indicizzazioni, disdette, controlli) e un flusso di MANUTENZIONE dello stabile. Non è un gestionale di "interventi sul campo" come gli artigiani: qui il cuore è anagrafica-ricca + documenti + scadenziario + conti per oggetto. Si accende per agenzie di compravendita/locazione, amministratori di condominio (PPP — proprietà per piani), property manager di reddito, gestori di affitti brevi e valutatori. Forte overlap col template Ospitalità sul ramo affitti brevi (camere/calendario/prenotazioni) e col mondo field-service solo sul ramo manutenzione stabili. Scope volutamente SENZA contabilità condominiale fiscale completa e SENZA fatturazione IVA: si copre con preventivi + conti + documenti, segnalando dove un cliente reale spingerebbe oltre._

> 🇨🇭 **Mercato CH:** Domanda reale alta ma frammentata. Il Ticino è denso di studi fiduciari e di amministrazione stabili (settore storicamente forte, spesso PMI di 2–15 persone) e gli affitti brevi sono in piena crescita su Lago Maggiore/Ceresio: questi due rami sono i beachhead più caldi. Disponibilità a pagare: medio-alta per amministratori condominio e property manager (gestiscono valori importanti, oggi usano spesso Excel + software svizzeri datati e costosi come ImmoTop2/Garaio/W&W Immo — c'è spazio per un'alternativa leggera in CHF a canone PMI), più contenuta per il singolo mediatore. Specificità locali CRITICHE da rispettare: (1) PPP — la proprietà per piani svizzera (art. 712a CC) con i millesimi, non il 'condominio' all'italiana; (2) diritto di locazione federale con termini di disdetta e preavvisi rigidi, deposito di garanzia su conto vincolato, formulario ufficiale per aumenti di pigione e indicizzazione ISPI — il modulo contratti-loc/disdette deve parlare questa lingua o è inutile; (3) tassa di soggiorno gestita a livello comunale/cantonale (per gli affitti brevi serve export per Comune); (4) lingue: il Ticino lavora in italiano ma molti proprietari/investitori sono di lingua tedesca o esteri, quindi etichette/PDF almeno IT+DE (e l'espansione oltre Gottardo richiede DE/FR nativo). Vincolo di scope da segnalare a Loris: gli AMMINISTRATORI DI CONDOMINIO sono l'unico sotto-settore che spinge davvero verso una contabilità più strutturata (riparto spese, consuntivo, conto corrente per stabile, eventuale conto IVA su stabili commerciali); con preventivi + conti + spese-condo + documenti si copre l'80% operativo, ma un cliente reale potrebbe chiedere l'integrazione/export verso un contabile o un vero modulo fatture — da valutare come modulo a pagamento dedicato, non incluso nel base.

**Agenzia immobiliare (compravendita & locazione)**
- *Attività esempio:* Agenzia di mediazione a Lugano-Paradiso (vendita ville/appartamenti lago); Studio immobiliare a Bellinzona con ramo locazioni residenziali; Agenzia a Locarno specializzata in case di vacanza e seconde case; Mediatore indipendente (courtier) iscritto SVIT/USPI a Mendrisio; Agenzia commerciale a Chiasso (uffici, capannoni, superfici retail di frontiera)
- *Flusso:* Acquisisci il mandato sull'oggetto (vendita o affitto) → pubblichi l'annuncio → raccogli i lead/interessati e li qualifichi → organizzi e tracci le VISITE → raccogli offerte/candidature inquilini → porti a rogito o a firma contratto → incassi la provvigione. Ogni giorno devi sapere: quali oggetti ho a portafoglio e in che stato (mandato/attivo/opzionato/venduto), chi ha visitato cosa, quali lead vanno richiamati, quali mandati scadono.
- *Moduli core:* `hub`, `clients`, `cal`, `notes`, `notif`, `conti`, `documenti`
- *Moduli specifici da costruire:*
    - `immobili` — Portafoglio oggetti: scheda immobile (indirizzo, tipologia, mq, locali, prezzo/canone, stato mandato vendita o affitto), foto, planimetria, mappatura su zona. È l'anagrafica-cuore di tutto il template.
    - `visite` — Agenda visite collegate a immobile + interessato: appuntamento, esito (interessato/no/offerta), feedback, follow-up automatico. Estende cal con il concetto di 'visita su un oggetto'.
    - `lead` — Pipeline acquirenti/inquilini: richieste in entrata, criteri di ricerca (budget, zona, locali), matching con gli immobili a portafoglio, stato trattativa, provenienza del lead.
    - `mandati` — Mandati di mediazione: tipo (esclusiva/non), scadenza, provvigione pattuita (% o forfait), avviso di rinnovo/scadenza mandato. Si appoggia a scadenziario per gli avvisi.
    - `candidature` — Dossier candidatura inquilino (per le locazioni): documenti richiesti (estratto esecuzioni, garanzia, buste paga), checklist completezza, confronto candidati, esito.

**Amministrazione condomini (PPP / proprietà per piani)**
- *Attività esempio:* Studio di amministrazione stabili a Lugano che gestisce 40 condomìni PPP; Fiduciaria immobiliare a Bellinzona con ramo amministrazione PPP; Amministratore di condominio indipendente a Mendrisio; Società di gestione stabili reddito + PPP a Locarno; Amministratore part-time di residence turistici (Ascona/Brissago)
- *Flusso:* Per ogni stabile gestisci: l'elenco unità e i proprietari (con millesimi/quote PPP), il preventivo annuale e il consuntivo spese, la convocazione e i verbali dell'assemblea, le richieste di intervento dei condòmini, i fornitori e i contratti ricorrenti (pulizia, ascensore, riscaldamento, giardinaggio), le scadenze di legge dello stabile. Ogni giorno: ticket guasti aperti, fornitori da chiamare, scadenze in arrivo, e a quale stabile imputare ogni spesa.
- *Moduli core:* `hub`, `clients`, `emps`, `cal`, `notes`, `notif`, `conti`, `documenti`, `man`
- *Moduli specifici da costruire:*
    - `stabili` — Anagrafica stabili amministrati: indirizzo, unità/appartamenti, proprietari con quote/millesimi PPP, fornitori collegati, documenti dello stabile. Variante 'condominio' del modulo immobili.
    - `assemblee` — Gestione assemblee PPP: convocazione (ordine del giorno + invio), foglio presenze e deleghe, calcolo quorum sui millesimi, verbale e delibere, archivio per stabile.
    - `spese-condo` — Riparto spese per stabile: imputi una spesa a un capitolo (riscaldamento, ascensore, ordinarie) e la ripartisci sui proprietari secondo le quote. NB: non è contabilità fiscale completa, è preventivo/consuntivo + riparto.
    - `ticket` — Segnalazioni dei condòmini: guasto/richiesta → assegnazione a fornitore/tecnico → stato (aperto/in corso/chiuso) → storico per unità e per stabile. Collega man e documenti.
    - `scadenziario` — TRASVERSALE già previsto: scadenze obbligatorie dello stabile (revisione ascensore, controllo cisterna, antincendio, contratti fornitori, assicurazione stabile) con avvisi automatici.

**Property management / gestione locazioni a reddito**
- *Attività esempio:* Gestore di un parco di 120 appartamenti a reddito per investitori a Lugano; Family office che amministra immobili di reddito sul Ceresio; Società di gestione stabili reddito a Bellinzona (incasso pigioni); Fiduciaria che gestisce locazioni per proprietari esteri (frontalieri/seconde case); Gestore di superfici commerciali/uffici a Manno-Bioggio
- *Flusso:* Per ogni proprietario gestisci i suoi immobili e gli inquilini: stipuli/rinnovi i contratti di locazione, monitori gli incassi canoni mensili (chi ha pagato, solleciti morosità), gestisci subentri e disdette (con i termini legali svizzeri), tracci le manutenzioni dello stabile e rendiconti al proprietario. Ogni giorno: canoni in ritardo da sollecitare, contratti in scadenza/indicizzazione, disdette ricevute e relè da rilocare, interventi aperti.
- *Moduli core:* `hub`, `clients`, `cal`, `notes`, `notif`, `conti`, `documenti`, `man`, `zone`
- *Moduli specifici da costruire:*
    - `contratti-loc` — Contratti di locazione: inquilino, oggetto, canone + spese accessorie, deposito di garanzia, durata, termini di disdetta legali (preavvisi CH), indicizzazione/ISPI. Genera le scadenze in scadenziario.
    - `canoni` — Registro incassi pigioni: scadenza mensile per contratto, stato pagato/da pagare, solleciti morosità a livelli, storico per immobile e per proprietario. Si appoggia a conti.
    - `proprietari` — Anagrafica proprietari/mandanti con i loro immobili: rendiconto periodico (entrate canoni − spese), comunicazioni, documenti. Vista 'per chi possiede l'immobile' separata dagli inquilini.
    - `disdette` — Gestione disdette e subentri: data disdetta, termine legale, stato consegna/riconsegna, protocollo di consegna con foto stato dell'alloggio, conteggio deposito di garanzia.
    - `scadenziario` — TRASVERSALE: indicizzazioni canoni, scadenze contratti, termini di disdetta, scadenze tecniche dello stabile, con avvisi automatici al gestore.

**Gestione affitti brevi / case vacanza (overlap Ospitalità)**
- *Attività esempio:* Gestore di 15 appartamenti vacanza a Ascona/Locarno su Airbnb e Booking; Property manager di chalet e rustici in Vallemaggia/Verzasca; Società di short-let a Lugano per clientela business e turistica; Proprietario-gestore di B&B + appartamenti sul Monte Brè; Gestore di seconde case affittate per stagione (Bosco Gurin, Airolo)
- *Flusso:* Gestisci più alloggi su più canali (Airbnb/Booking/diretto): prenotazioni e calendario per evitare overbooking, check-in/check-out (spesso self check-in con codici), pulizie e turnover tra un ospite e l'altro, incassi e tassa di soggiorno. Ogni giorno: arrivi/partenze del giorno, pulizie da schedulare, alloggi liberi/occupati, e quanto ho incassato per alloggio.
- *Moduli core:* `hub`, `clients`, `cal`, `notes`, `notif`, `conti`, `documenti`
- *Moduli specifici da costruire:*
    - `alloggi` — Anagrafica unità affittabili (variante 'camere'/immobili per lo short-let): foto, dotazioni, prezzo per notte/stagione, regole, codici accesso. Cuore del ramo affitti brevi.
    - `prenota` — IN CODA già previsto: calendario prenotazioni multi-alloggio con stati (richiesta/confermata/in casa/uscito), blocco date, anti-overbooking. Base del turnover.
    - `turnover` — Pulizie e preparazione tra ospiti: genera il task pulizia ad ogni check-out, assegna alla squadra, checklist e foto 'pronto'. Lega prenota + emps + man.
    - `soggiorno` — Tassa di soggiorno e registro ospiti: conteggio notti/persone per Comune, importo dovuto, export per la dichiarazione comunale (obbligo CH variabile per cantone/Comune).
    - `canali` — Riepilogo per canale (Airbnb/Booking/diretto): prenotazioni e incasso netto per canale e per alloggio, commissioni piattaforma. NB: sincronizzazione iCal automatica = prossimamente, all'inizio inserimento/import.

**Valutazione / perizia immobiliare**
- *Attività esempio:* Perito immobiliare indipendente a Lugano (stime per banche e privati); Studio di valutazione per finanziamenti ipotecari a Bellinzona; Architetto-estimatore che fa expertise per successioni/divorzi; Società di due diligence per investitori su stabili reddito; Valutatore certificato (CEI/RICS) per portafogli istituzionali
- *Flusso:* Ricevi l'incarico di stima su un oggetto → raccogli i dati (registro fondiario, planimetrie, foto sopralluogo) → applichi il metodo (valore reale, reddituale/DCF, comparativo) → produci la perizia/report → consegni e fatturi l'onorario. Ogni giorno: incarichi in corso e a che punto sono, sopralluoghi da pianificare, scadenze di consegna, parcelle da incassare.
- *Moduli core:* `hub`, `clients`, `cal`, `notes`, `notif`, `conti`, `documenti`
- *Moduli specifici da costruire:*
    - `perizie` — Fascicolo incarico di stima: oggetto, committente, scopo (ipoteca/successione/vendita), metodo, valore stimato, stato (incarico/sopralluogo/redazione/consegnato), documento finale. Cuore del ramo valutatori.
    - `comparabili` — Archivio dati comparativi: prezzi/canoni di transazioni e oggetti simili per zona, riutilizzabili nelle stime comparative. Si lega a immobili e zone.
    - `preventivi` — TRASVERSALE: preventivo dell'onorario di perizia → accettazione committente → diventa incarico. Evita la fatturazione IVA piena, copre l'offerta + il consuntivo con conti.
    - `sopralluogo` — Scheda sopralluogo in loco: checklist rilievo, foto geolocalizzate, note, misure, da cui si alimenta la perizia. Variante 'rilievo' del template field.

**Promozione / sviluppo immobiliare (nuove costruzioni in vendita)**
- *Attività esempio:* Promotore di una residenza nuova di 12 appartamenti a Lugano-Pregassona; Impresa generale che vende sulla carta una palazzina a Bellinzona; Sviluppatore di residence di lusso fronte lago a Paradiso/Bissone; Cooperativa edilizia che assegna alloggi ai soci a Locarno; Promotore di case a schiera nel Mendrisiotto
- *Flusso:* Hai un progetto con N unità in vendita: gestisci lo stato di vendita per ogni lotto (libero/opzionato/venduto), i clienti acquirenti e le loro scelte/varianti (capitolato), gli acconti per stato di avanzamento, e i contatti con notaio e banca fino al rogito. Ogni giorno: unità ancora libere, opzioni in scadenza, acconti da incassare, scelte capitolato da chiudere.
- *Moduli core:* `hub`, `clients`, `cal`, `notes`, `notif`, `conti`, `documenti`, `sites`
- *Moduli specifici da costruire:*
    - `promozione` — Progetto di vendita con elenco lotti/unità: stato commerciale per unità (libero/opzionato/riservato/venduto), prezzo, acquirente, vista d'insieme 'quanto venduto / quanto resta'.
    - `capitolato` — Scelte e varianti dell'acquirente: capitolato base + opzioni (finiture, extra), costo variante, stato approvazione, scadenza scelta. Genera supplementi su conti.
    - `acconti` — Piano pagamenti per stato di avanzamento: rate/acconti per unità venduta, scadenze, incassato vs dovuto. Lega sites (avanzamento) a conti.
    - `rogiti` — Iter fino all'atto: documenti per notaio e banca, checklist pre-rogito, data atto, passaggio a 'venduto'. Si appoggia a documenti + scadenziario.

---

### 🎓 Scuola & Formazione 🎓 — gestionale base per chi insegna, forma o accudisce: iscrizioni allievi, calendario lezioni/corsi, presenze, rette e pagamenti, certificati. Una sola base, si accende ciò che serve per asilo, scuola guida, scuola di lingua/musica o doposcuola.  *(archetipo: soci-membership)*
_Gestionale base per il mondo che insegna, forma o accudisce persone. Il cuore è sempre lo stesso: una persona (allievo/bambino/corsista) si iscrive, segue lezioni o un corso a calendario, accumula presenze/assenze e ore, e paga una retta (mensile, a pacchetto o a corso). Attorno a questo nucleo cambiano i dettagli: l'asilo traccia entrate/uscite e diario giornaliero, la scuola guida traccia ore di guida e teoria verso l'esame, la scuola di lingua/musica gestisce livelli, gruppi e insegnanti, il doposcuola gestisce pacchetti di ore e abbinamento allievo-tutor. Per questo conviene UN gestionale base 'Scuola & Formazione' altamente personalizzabile, invece di quattro app separate: i moduli core (clienti=allievi, cal=lezioni, emps=docenti, conti=incassi, notif) sono identici, e si aggiunge 1-2 moduli specifici per sotto-settore. Niente fatturazione fiscale completa: per le rette bastano 'conti' (incassato/da incassare) + un modulo 'rette' che genera lo scadenzario degli importi ricorrenti; se un cliente vuole la fattura vera si segnala come limite. Mercato CH/Ticino reale e con buona disponibilità a pagare (rette anticipate = cash flow sano, il gestionale si ripaga subito riducendo insoluti e ore perse)._

> 🇨🇭 **Mercato CH:** Domanda reale e solida in Ticino: il settore è frammentato in tante PMI/microimprese (autoscuole, scuole di musica, nidi, centri ripetizioni) che oggi lavorano con Excel, agende cartacee e WhatsApp coi genitori. La disponibilità a pagare è buona perche le rette sono pagate in anticipo: il gestionale migliora subito il cash flow (riduce insoluti, ore vuote e no-show) e si ripaga in fretta — un canone CHF 20-60/mese per utente è digeribile. Specificità locali da tenere a mente: (1) MULTILINGUA indispensabile — interfaccia e comunicazioni ai genitori/allievi in IT, e per molte realtà anche DE e FR (scuole di lingua e nidi bilingui lo richiedono di default). (2) PRIVACY rigorosa: si trattano dati di minori (schede sanitarie, allergie, vaccinazioni, foto del diario, deleghe al ritiro) → serve GDPR/nLPD pieno sulle app cliente, consensi foto e RLS stretta; è un punto da gestire con la skill dati-sensibili. (3) Autoscuole regolate dall'asa/USTRA: corsi obbligatori (sensibilizzazione del traffico, primo soccorso), istruttori con abilitazione, durate minime — il modulo esami/ore-guida deve riflettere le tappe svizzere, non quelle italiane. (4) Nidi spesso accreditati dal Cantone con tariffe calmierate e sussidi famiglia (retta in base al reddito): il modulo rette deve permettere tariffe personalizzate e riduzioni. (5) LIMITE di scope da dichiarare: i centri di formazione professionale e i corsi aziendali a volte vogliono la FATTURA vera (IVA, all'azienda committente) — MODULA copre con 'preventivi' + 'conti' lo scadenzario incassi, ma non la fatturazione fiscale completa; per quei clienti è un limite da segnalare in fase di vendita o da risolvere con export verso il loro fatturatore. WhatsApp ai genitori è molto richiesto ma resta 'prossimamente': per ora le comunicazioni passano da 'notif' (in-app/email).

**Asili nido / Scuole dell'infanzia / Nidi famiglia**
- *Attività esempio:* Asilo nido privato bilingue a Lugano (IT/DE) 0-3 anni; Scuola dell'infanzia parrocchiale in Valle di Blenio; Nido aziendale presso una banca a Bellinzona; Mamma diurna / nido famiglia (accreditata Chiasso-Mendrisiotto); Asilo Montessori a Mendrisio con lista d'attesa
- *Flusso:* Iscrizione bambino con scheda anagrafica e contatti genitori → assegnazione a sezione/gruppo e a una fascia oraria (tempo pieno / mezza giornata / pasto) → ogni giorno si registra entrata e uscita (chi accompagna/ritira), presenza/assenza e il diario giornaliero (pasti, sonno, umore, episodi) → a fine mese si calcola la retta in base ai giorni/fascia e si incassa → si tiene il registro vaccinazioni/allergie/deleghe al ritiro e si avvisano i genitori per chiusure, eventi, pagamenti in ritardo.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `bambini` — Scheda bambino estesa: genitori/tutori, contatti d'emergenza, allergie/intolleranze, vaccinazioni, persone autorizzate al ritiro (deleghe), sezione/gruppo di appartenenza.
    - `presenze-nido` — Registro entrate/uscite giornaliere: timbra arrivo e ritiro, chi ha accompagnato/ritirato, presenti del giorno per sezione, conteggio giorni di presenza per la retta.
    - `diario` — Diario giornaliero per bambino condiviso coi genitori: pasti, sonno/riposo, pannolino/bagno, umore, attività, foto del giorno, note delle educatrici.
    - `rette` — Calcolo e scadenzario rette ricorrenti: tariffe per fascia (tempo pieno/parziale, pasto incluso), riduzioni/sussidi, generazione mensile importi → confluisce in conti, avvisi pagamenti in ritardo.

**Scuole guida / Autoscuole (auto, moto, camion, nautica)**
- *Attività esempio:* Autoscuola a Lugano per cat. B e moto A; Scuola guida camion/autobus (cat. C/D) a Giubiasco con istruttore OACP; Istruttore di guida indipendente che gira tra Locarno e Bellinzona; Scuola nautica per licenza barca sul Lago Maggiore; Autoscuola che organizza i corsi obbligatori (sensibilizzazione + soccorritori)
- *Flusso:* L'allievo si iscrive con i dati della licenza per allievo conducente → si pianificano le ore di guida (una alla volta o a pacchetto) e i moduli teoria/corsi obbligatori → ogni lezione si segna durata, percorso/competenze affrontate e progressi verso l'esame → si vendono pacchetti di ore prepagate e si scala il credito man mano → si fissano date esame teoria/pratica → si incassa per ora o per pacchetto e si tiene il conto del residuo.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `conti`, `notif`
- *Moduli specifici da costruire:*
    - `ore-guida` — Libretto guide dell'allievo: ogni lezione con durata, veicolo/istruttore, competenze affrontate e valutazione, totale ore svolte verso il minimo richiesto per l'esame.
    - `pacchetti` — Pacchetti di ore prepagate (es. 10 guide): vendita, scalo automatico a ogni lezione, saldo residuo, avviso quando il credito sta finendo.
    - `esami` — Gestione tappe obbligatorie e date d'esame: corso sensibilizzazione, corso soccorritori, esame teoria, esame pratico, validità licenza allievo, promemoria scadenze.
    - `veicoli` — Parco veicoli scuola (auto/moto/camion): assegnazione alle lezioni, scadenze (collaudo/vignetta/tagliando/assicurazione), km e manutenzioni.

**Scuole di lingua / Centri linguistici**
- *Attività esempio:* Scuola di italiano per stranieri e tedesco a Lugano; Centro linguistico che prepara a Goethe-Zertifikat / DELF / Cambridge; Corsi d'inglese aziendali in-house per una PMI del Mendrisiotto; Insegnante privata di francese con lezioni individuali e a coppie; Scuola che fa corsi di integrazione e tedesco per permesso di soggiorno
- *Flusso:* L'allievo fa un test di livello (A1-C2) → viene inserito in un corso/gruppo del livello giusto a un certo orario, oppure in lezioni individuali → si segue il calendario delle lezioni del corso e si fanno le presenze a ogni incontro → si incassa la quota corso (intera, a rate o a pacchetto di lezioni) → a fine corso si rilascia attestato di frequenza/livello → si gestiscono iscrizioni alla sessione successiva e liste d'attesa.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `corsi` — Anagrafica corsi/edizioni: livello (A1-C2), lingua, docente, aula, orario ricorrente, posti totali e iscritti, date inizio/fine; gli allievi si iscrivono a un corso.
    - `presenze-corso` — Foglio presenze per ogni lezione del corso: presente/assente/giustificato per allievo, percentuale di frequenza (utile per attestati e corsi di integrazione).
    - `livelli` — Test di livello e progressione QCER dell'allievo: livello attuale, esito test d'ingresso, passaggio al livello successivo, certificazioni esterne preparate (Goethe/DELF/Cambridge).
    - `attestati` — Generazione attestati di frequenza/livello in PDF a fine corso, con monte ore e percentuale presenze, archiviati per allievo.

**Scuole di musica / Accademie d'arte (musica, danza, canto, recitazione)**
- *Attività esempio:* Scuola di musica privata a Bellinzona (pianoforte, chitarra, batteria); Accademia di danza classica e moderna a Lugano con saggio di fine anno; Insegnante di canto con lezioni individuali in studio; Banda/filarmonica del paese con corso allievi (sapore ticinese); Scuola di teatro/recitazione per ragazzi a Locarno
- *Flusso:* L'allievo si iscrive a uno strumento/disciplina e viene abbinato a un insegnante → si fissa la lezione settimanale ricorrente (slot fisso) individuale o di gruppo → ogni lezione si fa la presenza e si annotano i progressi/brani assegnati → si incassa la retta mensile/trimestrale (spesso a slot fisso anche se la lezione salta) → si gestiscono recuperi delle lezioni perse, noleggio strumenti e l'organizzazione di saggi/esami di fine anno.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `lezioni-ric` — Lezioni settimanali ricorrenti a slot fisso allievo-insegnante (individuali o di gruppo): genera in automatico gli appuntamenti del trimestre/anno, gestisce sospensioni e festività.
    - `recuperi` — Gestione lezioni saltate e recuperi: registra assenza giustificata, credito di recupero, ricollocazione in uno slot libero, scadenza del recupero.
    - `rette` — Rette ricorrenti per disciplina (mensile/trimestrale a slot fisso): scadenzario importi, sconto fratelli/seconda disciplina, confluisce in conti con avvisi morosi.
    - `saggi` — Organizzazione saggi/esami/concerti di fine periodo: data ed evento, allievi partecipanti per insegnante, brani/programma, comunicazione ai genitori.
    - `strumenti` — Noleggio strumenti/attrezzature agli allievi: chi ha cosa, scadenza/rinnovo del noleggio, stato e manutenzione dello strumento.

**Doposcuola / Ripetizioni / Centri di sostegno allo studio**
- *Attività esempio:* Centro di ripetizioni e aiuto compiti a Chiasso (medie e liceo); Doposcuola che prepara agli esami di maturità/recupero a Lugano; Tutor di matematica e fisica freelance che gira a domicilio; Centro DSA con tutor specializzati (dislessia/discalculia); Aiuto compiti pomeridiano organizzato da un'associazione di quartiere
- *Flusso:* Lo studente/famiglia si iscrive indicando le materie in cui serve aiuto → si abbina lo studente a un tutor adatto (materia/livello) → si vendono pacchetti di ore di ripetizione e si pianificano le sessioni (in centro o a domicilio) → a ogni sessione si registra ora svolta, materia e argomento e si scala il pacchetto → si incassa per pacchetto/abbonamento mensile → si comunica con i genitori sui progressi e si avvisa quando le ore stanno finendo.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `pacchetti` — Pacchetti/monte ore di ripetizione prepagate per studente e materia: vendita, scalo automatico a ogni sessione, saldo residuo, avviso esaurimento.
    - `abbinamenti` — Abbinamento studente-tutor per materia e livello scolastico (medie/liceo/uni), gestione disponibilità dei tutor e compatibilità orari.
    - `sessioni` — Registro sessioni svolte: materia, argomento trattato, compiti assegnati, breve valutazione progresso; alimenta lo scalo del pacchetto e i report ai genitori.
    - `rette` — Quote/abbonamenti mensili o a pacchetto: scadenzario incassi, confluisce in conti, avvisi pagamenti in ritardo.

**Centri di formazione professionale / Corsi e workshop / Accademie**
- *Attività esempio:* Centro che eroga corsi di formazione continua per adulti a Lugano (informatica, gestionale); Scuola di estetica/parrucchieri con percorso e stage a Bellinzona; Accademia di cucina con workshop serali a tema (Ticino food); Ente che organizza corsi di formazione continua/sicurezza per aziende (SUVA, primo soccorso); Scuola di fotografia con corsi a moduli e diploma finale
- *Flusso:* Si pubblica un catalogo di corsi/edizioni con date, posti e prezzo → i partecipanti si iscrivono a un'edizione (singolo o gruppo aziendale) → si gestiscono presenze per modulo/giornata e materiale didattico → si incassa la quota (intera o a rate, talvolta fattura all'azienda) → a fine corso si valuta/esamina e si rilascia attestato o certificazione → si tiene lo storico per ex allievi e si comunicano le prossime edizioni.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `corsi` — Catalogo corsi/edizioni: titolo, docente, sede/aula, date e calendario, posti disponibili vs iscritti, prezzo; iscrizione individuale o per conto di un'azienda cliente.
    - `iscrizioni` — Gestione iscrizioni a un'edizione con lista d'attesa, conferma posto, dati di fatturazione del partecipante o dell'azienda committente, stato pagamento per iscritto.
    - `attestati` — Esito/valutazione finale e generazione attestati/certificati in PDF (con monte ore e crediti formativi), archiviati per partecipante.
    - `presenze-corso` — Registro presenze per giornata/modulo: presente/assente, ore frequentate (obbligatorie per molte certificazioni e per la formazione finanziata).

---

### 🤲 Cura & Casa  *(archetipo: su-appuntamento)*
_Gestionale base per chi porta servizi alla persona e alla casa a domicilio: assistenza anziani/badanti, cure a domicilio private (spitex), pet care, baby sitting/tate, colf e servizi domestici, piccoli traslochi. Il cuore non è il magazzino o il cantiere, ma la RELAZIONE RICORRENTE: lo stesso cliente, gli stessi giorni e orari, gli stessi operatori, settimana dopo settimana. Tutto ruota attorno a tre cose che devono sempre tornare: chi va da chi (assegnazione operatore↔cliente), quando (turni/visite ricorrenti a domicilio con orari fissi) e quante ore sono state davvero fatte (consuntivo ore per la paga dell'operatore e per la fattura/conto del cliente). Si accendono pochi moduli base (clienti, personale, calendario, conti) e si aggiunge il modulo che genera le visite ricorrenti, traccia le ore a domicilio e firma la presenza in casa del cliente. Niente fatturazione fiscale/IVA: si resta su preventivi+conti, segnalando dove invece servirebbe davvero._

> 🇨🇭 **Mercato CH:** Domanda reale forte e in crescita: la Svizzera invecchia e il Ticino ha una delle quote di over-65 più alte del Paese, quindi assistenza anziani a domicilio e spitex privata hanno domanda strutturale; pet care e colf seguono il modello svizzero di alto reddito e poco tempo. Disponibilità a pagare: medio-alta lato cliente finale (le famiglie pagano già care queste prestazioni), ma le PMI/agenzie e le cooperative sono attente ai costi e vogliono uno strumento semplice, in italiano, su telefono per l'operatore in casa del cliente. Specificità locali/normative: (1) Lingue IT/DE/FR fondamentali, specie per le agenzie di tate/badanti che servono famiglie germanofone o frontaliere; l'app va pensata multilingue. (2) Il rapporto di lavoro domestico in CH è regolato (Contratto normale di lavoro per l'economia domestica, salari minimi cantonali, notifica AVS/contributi tramite procedura semplificata, permessi per personale frontaliero/estero): il modulo 'ore-care' deve produrre consuntivi ore solidi per buste paga e contributi, ma SENZA diventare un software paghe completo. (3) La cura a domicilio vera (spitex con prestazioni mediche/LAMal) tocca dati sanitari e fatturazione alle casse malati: qui MODULA deve restare sul coordinamento (turni, visite, ore, piano assistenza) e NON entrare nella fatturazione medica/cassa malati né nella cartella clinica — va segnalato chiaramente al cliente. (4) Forte richiesta del 'trasloco + pulizia di consegna' per le disdette d'affitto, peculiarità svizzera. (5) Dati molto sensibili (anziani, bambini, chiavi di casa, salute): serve attenzione GDPR/LPD con accessi ristretti, da trattare con la skill dati-sensibili. Vincolo scope: niente IVA/fatturazione fiscale completa, si resta su preventivi+conti; va però segnalato che spitex e agenzie strutturate prima o poi chiederanno una vera fatturazione (a famiglie e, per la parte sanitaria, alle casse) — candidato a integrazione esterna futura.

**Assistenza anziani a domicilio (badanti / cure a domicilio private, spitex privato)**
- *Attività esempio:* Agenzia badanti Ticino che colloca e coordina assistenti familiari conviventi e a ore; Spitex privata (es. tipo Home Instead / Spitex privata luganese) con operatori che fanno giri di visite a domicilio; Cooperativa di cura a domicilio che assiste anziani soli nel Mendrisiotto; Assistente familiare indipendente con 8-10 clienti fissi su Lugano-Bellinzona; Servizio di accompagnamento e aiuto domiciliare per disabili a Locarno
- *Flusso:* Ogni giorno bisogna sapere: quale operatore va da quale assistito, in che fascia oraria, e cosa deve fare (igiene, pasti, farmaci, accompagnamenti). Le visite sono RICORRENTI (es. lun-mer-ven 8:00-11:00). A fine visita l'operatore segna l'ora di arrivo/uscita e le attività svolte; le ore confluiscono nella paga e nel conto del cliente/famiglia. Va gestita la sostituzione quando un operatore è malato e il consenso/contatto del familiare di riferimento.
- *Moduli core:* `hub`, `clients`, `emps`, `cal`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `ricorrenze` — Genera in automatico le visite a domicilio ricorrenti per cliente (giorni+orari fissi della settimana), così non si ricrea l'agenda a mano ogni settimana
    - `visite-domicilio` — Registro visita a domicilio: check-in/check-out con ora, attività svolte (checklist igiene/pasti/farmaci/accompagnamento), note sulle condizioni, firma del cliente o familiare sul posto
    - `ore-care` — Consuntivo ore per operatore↔cliente dalle visite registrate: totale ore mese da pagare all'operatore e da addebitare alla famiglia (alimenta conti)
    - `piano-assistenza` — Piano di assistenza per assistito: bisogni, terapia/farmaci con orari, contatti familiari di riferimento e medico, allergie, consensi
    - `sostituzioni` — Quando un operatore manca, mostra le visite scoperte del giorno e propone chi è libero per coprire, avvisando il cliente

**Pet care (toelettatura, dog/cat sitter, dog walker, pensioni per animali)**
- *Attività esempio:* Toelettatura per cani a Lugano con prenotazioni su appuntamento; Dog walker di Bellinzona con giri di gruppo e clienti fissi settimanali; Cat sitter che fa visite a domicilio durante le vacanze dei proprietari; Pensione/asilo per cani nel Luganese con posti limitati e soggiorni a notti; Educatore cinofilo + pet sitter combinato sul Mendrisiotto
- *Flusso:* Due flussi: (a) toelettatura e pensione lavorano su PRENOTAZIONE con posti/slot limitati (un solo tavolo di toelettatura, X box in pensione) e soggiorni a notti; (b) dog walker e sitter lavorano su VISITE RICORRENTI a domicilio (passeggiata quotidiana, visita al gatto). In tutti i casi serve la scheda dell'animale (razza, carattere, vaccini, cibo, veterinario) legata al proprietario-cliente, e il conteggio per fatturare (a prestazione o a pacchetto).
- *Moduli core:* `hub`, `clients`, `cal`, `conti`, `emps`, `notes`
- *Moduli specifici da costruire:*
    - `animali` — Scheda animale legata al proprietario: specie/razza, carattere e avvertenze, vaccini e scadenze, cibo/farmaci, veterinario, foto
    - `prenota` — Prenotazione slot toelettatura / posti pensione con disponibilità limitata (già in coda nel catalogo)
    - `soggiorni` — Soggiorni in pensione a notti: check-in/check-out, box assegnato, posti liberi per data, conteggio notti per il conto
    - `giri` — Giri di passeggiate/visite del dog walker: chi raccoglie quali cani, ordine del giro, durata, ricorrenti settimanali
    - `pacchetti` — Pacchetti prepagati (es. 10 passeggiate / 5 toelettature): scala le prestazioni usate e avvisa quando il pacchetto è esaurito

**Baby sitting / agenzie tate (nanny) e aiuto bambini**
- *Attività esempio:* Agenzia di tate/nanny a Lugano che abbina famiglie e baby sitter selezionate; Tata indipendente con 3-4 famiglie fisse e orari scolastici; Servizio doposcuola/accompagnamento bambini a Chiasso; Babysitting a chiamata serale per hotel e famiglie turistiche sul Lago Maggiore; Maman de jour / mamma diurna riconosciuta nel Luganese (custodia diurna)
- *Flusso:* L'agenzia abbina la famiglia (con esigenze: età bimbi, orari, lingue) alla tata giusta e tiene traccia delle prestazioni; la tata segna le ore effettive di custodia che diventano paga e conto per la famiglia. Molte prestazioni sono ricorrenti (uscita da scuola tutti i giorni) ma con frequenti chiamate spot la sera/weekend. Conta la disponibilità per fascia oraria delle tate e i requisiti (lingue, primo soccorso, referenze).
- *Moduli core:* `hub`, `clients`, `emps`, `cal`, `conti`, `notif`
- *Moduli specifici da costruire:*
    - `ricorrenze` — Custodie ricorrenti auto-generate (es. uscita scuola lun-ven), riusabile dai trasversali del catalogo
    - `abbinamento` — Matching famiglia↔tata: requisiti della famiglia (età bimbi, orari, lingue IT/DE/FR) vs profilo tata (disponibilità, lingue, certificazioni primo soccorso, referenze)
    - `ore-care` — Ore di custodia effettive per tata↔famiglia → paga della tata e conto della famiglia (condiviso con assistenza anziani)
    - `schede-bimbi` — Scheda bambino/famiglia: età, allergie/intolleranze, abitudini, contatti di emergenza, autorizzazioni (chi può ritirarlo)

**Colf e servizi domestici (pulizie casa, stiro, spesa a domicilio)**
- *Attività esempio:* Agenzia di collaboratrici domestiche a Lugano che fornisce colf fisse alle famiglie; Servizio di pulizie domestiche a ore con squadra che ruota su appartamenti privati; Stireria/servizio stiro a domicilio nel Mendrisiotto; Aiuto domestico + spesa per anziani autosufficienti a Bellinzona; Impresa di pulizie domestiche dopo-cantiere / cambio inquilino
- *Flusso:* La stessa colf/squadra torna nelle stesse case in giorni e orari fissi (mar mattina dai Rossi, gio pomeriggio dai Bianchi). Serve l'agenda ricorrente per casa cliente, il consuntivo ore per pagare l'operatrice e addebitare la famiglia, e spesso le chiavi/codici d'accesso e una checklist delle stanze/attività. Gestione sostituzioni quando l'operatrice è assente.
- *Moduli core:* `hub`, `clients`, `emps`, `cal`, `conti`, `notes`
- *Moduli specifici da costruire:*
    - `ricorrenze` — Turni domestici ricorrenti per casa cliente (giorno+ora fissi), trasversale dal catalogo
    - `ore-care` — Ore lavorate per colf↔famiglia → paga e conto, modulo condiviso della famiglia 'Cura & Casa'
    - `checklist-casa` — Checklist attività per abitazione (stanze, mansioni stiro/pulizie/spesa) con spunta a fine intervento e firma cliente opzionale
    - `accessi-chiavi` — Gestione chiavi/codici d'accesso per abitazione cliente: chi ha le chiavi, codici allarme, istruzioni di accesso (dato sensibile, accesso ristretto)
    - `sostituzioni` — Copertura assenze: case scoperte del giorno e operatrici libere per sostituire

**Piccoli traslochi e servizi alla casa (sgomberi, montaggio mobili, handyman domestico)**
- *Attività esempio:* Ditta di piccoli traslochi privati Lugano-Bellinzona con 2-3 squadre; Servizio sgomberi cantine/appartamenti e smaltimento per cambio inquilino; Montaggio mobili e tuttofare domestico a chiamata nel Luganese; Trasloco + pulizia finale 'consegna chiavi' per fine locazione (molto richiesto in CH); Trasporto e consegna elettrodomestici/mobili a domicilio per negozi locali
- *Flusso:* Si lavora a JOB prenotato a data e ora (mezza giornata / giornata), con assegnazione squadra + furgone, e spesso un sopralluogo/preventivo prima. Serve sapere chi va dove con quale mezzo, le ore impiegate (a forfait o a ore), e gestire la consegna pulizie-finali tipica delle disdette d'affitto svizzere. Il preventivo accettato diventa il job pianificato.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `conti`, `notes`
- *Moduli specifici da costruire:*
    - `preventivi` — Preventivo (squadra+ore+furgone+forfait) → invio → accettazione → diventa job pianificato, trasversale dal catalogo
    - `job-squadre` — Pianificazione job a data/ora con assegnazione squadra + mezzo e durata stimata; vista giornaliera di chi è impegnato dove
    - `mezzi` — Furgoni/attrezzature con assegnazione al job e scadenze (revisione, vignetta, assicurazione), trasversale dal catalogo
    - `sopralluoghi` — Sopralluogo pre-trasloco: foto, metratura/piani, accesso (ascensore, parcheggio), note per stimare ore e mezzi

**Coordinamento operatori a domicilio (livello agenzia, trasversale a tutta la famiglia)**
- *Attività esempio:* Cooperativa che gestisce 30 operatori tra cura anziani, colf e baby sitting; Agenzia multi-servizio 'aiuto in casa' del Sopraceneri; Centrale operativa di una spitex privata che smista visite in giornata; Gruppo di assistenti familiari che condividono backoffice e clienti
- *Flusso:* Vista di centrale: chi è disponibile oggi, dove deve essere e a che ora, chi è scoperto. Quando un operatore dà forfait, si vede subito quali visite/case restano scoperte e chi può coprire. Si tiene il monte ore di ciascun operatore (limiti contratto), le competenze/abilitazioni e le distanze/zone per non far attraversare il cantone inutilmente. È il collante che riusa ricorrenze, ore-care e sostituzioni degli altri sotto-settori.
- *Moduli core:* `hub`, `emps`, `cal`, `clients`, `zone`, `notif`
- *Moduli specifici da costruire:*
    - `disponibilita` — Disponibilità operatore per fascia oraria/giorno + competenze e abilitazioni (lingue, primo soccorso, patente); base per assegnare e sostituire
    - `turni` — Turni/presenze degli operatori sul territorio con monte ore e limiti di contratto, trasversale già in coda
    - `zone` — Mappa clienti/operatori per assegnare per vicinanza ed evitare spostamenti inutili nel cantone, modulo pronto del catalogo
    - `sostituzioni` — Cruscotto coperture: visite/case scoperte del giorno e chi è libero e idoneo per coprire, con avviso al cliente

---

### 🚐 Flotta — Gestionale Trasporti, Logistica & Mobilità  *(archetipo: trasporti)*
_Il gestionale base per chi muove persone o merci con un parco mezzi: taxi/NCC e transfer, traslochi, corrieri e consegne ultimo miglio, autonoleggio e noleggio furgoni/mezzi, autotrasporto, navette e scuole nautiche. Tre cardini comuni: (1) le CORSE/ORDINI da assegnare e tracciare ogni giorno, (2) i MEZZI con le loro scadenze obbligatorie (revisione, tachigrafo, assicurazione, vignetta), (3) gli AUTISTI con turni, ore di guida e disponibilità. Su questo scheletro si accendono i moduli specifici del sotto-settore. Volutamente FUORI scope la fatturazione fiscale/IVA piena: si copre con preventivi + conti, e si segnala dove il settore esigerebbe davvero la fattura vera (corrieri B2B, autotrasporto)._

> 🇨🇭 **Mercato CH:** Domanda reale e forte in Ticino/CH, ma è un mercato regolato che alza sia il bisogno di software sia la disponibilità a pagare. (1) TAXI/NCC: licenze comunali (a Lugano/Bellinzona/Locarno numero chiuso), tariffe spesso fissate dal Comune; ottimo abbonamento mensile per artigiano del taxi e piccole flotte. (2) AUTOTRASPORTO/CORRIERI: la LPMC/OLR1 impone tempi di guida e riposo, libretto di lavoro e tachigrafo digitale (scarico dati ogni 28 giorni, archiviazione anni); qui il modulo `tachigrafo`/`scadenziario` ha un valore percepito alto e la PMI paga volentieri. Per il transito merci attraverso le Alpi pesano TTPCP/LSVA (tassa sul traffico pesante a km), dogana e Gottardo. (3) MEZZI: revisione periodica (controllo ufficiale cantonale, non annuale come in IT), vignetta autostradale annuale, assicurazione RC; le scadenze sono il dolore numero uno. (4) NAUTICA: licenza di navigazione svizzera (categoria A motore / D vela), esami cantonali sui laghi Ceresio/Verbano/Lemano; nicchia ma a margine alto. (5) Multilingua indispensabile: IT in Ticino, DE per Svizzera interna, FR per Romandia, più EN per i transfer aeroportuali (Lugano-Agno, Milano-Malpensa) e la clientela frontaliera/turistica. (6) Frontiera: molti flussi sono transfrontalieri (Italia↔Ticino), utile gestire dogana/ZollAnmeldung sui traslochi e corrieri internazionali. WhatsApp per avvisare il cliente "autista in arrivo" è molto richiesto ma resta "prossimamente": oggi conferma corsa via SMS/email/link. Disponibilità a pagare: medio-alta per autotrasporto e noleggio (il software evita multe e fermi mezzo), media per taxi singolo (sensibile al prezzo, meglio piano per-utente economico).

**Taxi / NCC / Transfer & Navette**
- *Attività esempio:* Taxi del Ticino con licenza comunale a Lugano e stazione FFS; Servizio NCC / limousine con transfer aeroportuale Lugano-Agno e Milano-Malpensa; Navetta hotel-aeroporto per alberghi del Locarnese (Ascona); Bus navetta aziendale / scuolabus per istituto privato a Bellinzona; Driver privato per matrimoni ed eventi sul Ceresio
- *Flusso:* Arriva una richiesta corsa (telefono, app, hotel, azienda) → si registra cliente, luogo di presa, destinazione, ora, n. passeggeri → si assegna autista + veicolo libero → corsa in stato 'assegnata→in corso→conclusa' → si calcola il prezzo (tariffa fissa transfer o a tassametro/km) → incasso a conti. Per le navette: tratte e fermate ricorrenti con orari fissi, non singole corse. Ogni giorno il dispatcher deve vedere a colpo d'occhio quali corse sono coperte e quali autisti sono liberi.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `notif`, `zone`, `conti`
- *Moduli specifici da costruire:*
    - `corse` — Registro corse/transfer: presa, destinazione, ora, passeggeri, stato (richiesta→assegnata→in corso→conclusa→pagata), prezzo. È il cuore operativo del dispatcher.
    - `dispatch` — Plancia di assegnazione: vista del giorno con autisti e veicoli liberi/occupati, drag della corsa sull'autista, conferma al cliente con link/SMS (WhatsApp prossimamente).
    - `tariffe` — Listino tariffe corsa: forfait transfer per tratta (es. Lugano→Malpensa), supplementi notte/festivo/bagagli, tariffa a km; calcola in automatico il prezzo della corsa.
    - `ricorrenze` — Navette e corse fisse ricorrenti (scuolabus, navetta hotel, transfer settimanale): genera in automatico le corse del calendario.

**Traslochi & Sgomberi**
- *Attività esempio:* Ditta di traslochi Lugano-Zurigo con montascale esterno; Trasloco internazionale Italia↔Ticino con pratica doganale; Sgombero cantine, soffitte e liquidazioni eredità in Ticino; Trasloco uffici / aziende con smontaggio e rimontaggio mobili; Piccoli trasporti su richiesta (consegna mobili, ritiro ingombranti)
- *Flusso:* Richiesta di sopralluogo → preventivo (volume m³, piani, montascale, imballaggio, distanza, dogana) → accettazione → si pianifica la giornata: squadra + furgone/camion + eventuale montascale a noleggio → giorno del trasloco con checklist carico/scarico e inventario oggetti → firma del cliente a consegna → incasso. La PMI vive di preventivi: convertire il sopralluogo in lavoro pianificato è il flusso chiave.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `sites`, `conti`, `notif`
- *Moduli specifici da costruire:*
    - `preventivi` — Preventivo trasloco (volume, piani, montascale, imballaggio, km, supplementi) → invio → accettazione → diventa lavoro pianificato. Trasversale, qui è centrale.
    - `inventario-trasloco` — Lista oggetti/colli del trasloco con foto stato 'prima', etichette per stanza di destinazione, checklist carico e scarico, segnalazione danni.
    - `squadre` — Pianificazione della giornata: assegna squadra (operai) + mezzo + attrezzature (montascale, transpallet) al singolo trasloco, evita doppie assegnazioni.
    - `dogana` — Pratica doganale per traslochi internazionali Italia↔CH: lista valori, documenti di sdoganamento, stato pratica. (Specificità svizzera di frontiera.)

**Corrieri & Consegne ultimo miglio**
- *Attività esempio:* Corriere espresso locale per pacchi tra Mendrisiotto e Luganese; Consegne a domicilio per ristoranti/spesa (food & grocery delivery) a Lugano; Distribuzione farmaci/campioni medicali per farmacie e studi; Pony express / trasporto documenti per studi legali e fiduciarie; Consegna ricambi e materiale edile dai grossisti ai cantieri
- *Flusso:* Entrano gli ordini di consegna (da app, da cliente B2B, da e-commerce) → si raggruppano per zona in un GIRO → si assegna autista + furgone → ottimizzazione ordine delle fermate → l'autista esegue il giro segnando ogni consegna come 'consegnata/fallita/da riprogrammare' con prova (foto pacco, firma) → rendiconto fine giro → incasso/conteggio contrassegni. Il pattern è già parente di `pellet` (giri/consegne) e va riusato.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `pellet`, `zone`, `conti`, `notif`
- *Moduli specifici da costruire:*
    - `giri` — Giri di consegna del giorno: raggruppa ordini per zona, assegna autista+mezzo, ordina le fermate, mostra avanzamento giro in tempo reale.
    - `consegne` — Singola consegna con prova: stato (in transito→consegnata→fallita→da riprogrammare), foto pacco, firma destinatario, gestione contrassegno/contanti.
    - `ordini` — Coda ordini di consegna in entrata (manuale o da clienti B2B): mittente, destinatario, finestra oraria, priorità; da smistare nei giri.
    - `tracking` — Link di tracciamento per il destinatario: stato spedizione e 'autista in arrivo' via link/SMS (WhatsApp prossimamente).

**Autonoleggio & Noleggio mezzi/furgoni**
- *Attività esempio:* Autonoleggio breve termine (RAC) con sede a Lugano e Chiasso frontiera; Noleggio furgoni e camion per traslochi fai-da-te; Noleggio con conducente di pullman/minibus per gite e gruppi; Noleggio mezzi da cantiere e attrezzature (sollevatori, piattaforme) a Biasca; Car sharing aziendale / flotta condivisa per una PMI
- *Flusso:* Cliente prenota un mezzo per un periodo → si verifica disponibilità sul calendario del mezzo → contratto di noleggio (patente, deposito cauzionale, condizioni, assicurazione) → consegna con stato del veicolo (km, carburante, foto giro-vettura, danni preesistenti) → riconsegna con confronto stato e calcolo extra (km, ritardo, carburante, danni) → incasso e svincolo cauzione. Il dolore è il calendario disponibilità per mezzo e lo stato-veicolo alla consegna/riconsegna.
- *Moduli core:* `hub`, `cal`, `clients`, `macchine`, `conti`, `documenti`, `notif`
- *Moduli specifici da costruire:*
    - `noleggi` — Contratti di noleggio: mezzo, cliente, periodo, tariffa (giorno/km/settimana), cauzione, stato (prenotato→consegnato→rientrato→chiuso) ed extra a riconsegna.
    - `disponibilita` — Calendario disponibilità per mezzo: vista a griglia mezzi×giorni, evita doppie prenotazioni, blocca mezzi in manutenzione.
    - `stato-veicolo` — Check-in/check-out veicolo: km, carburante, foto giro-vettura, danni preesistenti e nuovi, firma cliente; confronto consegna vs riconsegna per calcolare gli extra.

**Autotrasporto merci (camion / conto terzi)**
- *Attività esempio:* Autotrasportatore conto terzi con trattori e semirimorchi sull'asse del Gottardo; Trasporto rifiuti/inerti per cantieri ticinesi (cassoni scarrabili); Trasporto a temperatura controllata (frigo) per agroalimentare; Trasporto cisterna (gasolio, latte) per il Sopraceneri; Padroncino con motrice per distribuzione regionale CH
- *Flusso:* Arriva l'ordine di trasporto/viaggio (carico A → scarico B, peso, tipo merce, data) → si assegna mezzo + autista rispettando tempi di guida e riposo → viaggio con documenti (DDT/CMR, tachigrafo) → registrazione km, ore, carburante, pedaggi → controllo costante delle SCADENZE del mezzo e del libretto di lavoro autista → conteggio costi/ricavi della tratta. Qui il rischio multa (tachigrafo, tempi di guida, revisione scaduta) rende il software quasi obbligatorio.
- *Moduli core:* `hub`, `cal`, `clients`, `emps`, `macchine`, `conti`, `notif`
- *Moduli specifici da costruire:*
    - `viaggi` — Ordini di trasporto/viaggi: origine, destinazione, merce, peso, mezzo+autista, km, costi tratta (carburante, pedaggi/LSVA), ricavo; stato del viaggio.
    - `tachigrafo` — Tempi di guida e riposo + scarico dati tachigrafo digitale (ogni 28 gg) e libretto di lavoro; allerta sforamenti e archiviazione obbligatoria. Critico in CH (OLR1).
    - `scadenziario` — Scadenze obbligatorie del mezzo e dell'autista: revisione, assicurazione RC, vignetta/LSVA, ADR, carta tachigrafica, patente CQC; avvisi automatici prima della scadenza. Trasversale.
    - `costi-mezzo` — Costo per veicolo: carburante (€/km), pedaggi, manutenzioni, pneumatici; calcola il costo-km reale e la redditività per mezzo/tratta.

**Mezzi & Officina interna (parco veicoli, trasversale alla famiglia)**
- *Attività esempio:* Responsabile flotta di una ditta di trasporti con 15 mezzi; Coop/azienda con parco furgoni di servizio (idraulici, tecnici); Comune o ente con mezzi comunali e scadenze da presidiare; Noleggiatore che gestisce la manutenzione della propria flotta; Officina interna che fa tagliandi e gomme ai mezzi aziendali
- *Flusso:* Per ogni mezzo: scheda (targa, telaio, km, assegnazione ad autista/reparto) → si presidiano TUTTE le scadenze (revisione, assicurazione, vignetta, tagliando, gomme estive/invernali, tachigrafo) con avvisi → si registrano gli interventi di manutenzione (tagliandi, riparazioni, fermo mezzo) e i rifornimenti → si tiene il costo totale di possesso. È lo strato 'mezzi' comune a tutti i sotto-settori sopra, riusabile dalla famiglia manutenzioni.
- *Moduli core:* `hub`, `cal`, `emps`, `macchine`, `man`, `conti`, `notif`
- *Moduli specifici da costruire:*
    - `mezzi` — Parco mezzi: scheda veicolo (targa, telaio, km, categoria), assegnazione ad autista/squadra, libretto, foto, storico. Trasversale già previsto a catalogo.
    - `scadenziario` — Scadenze del veicolo (revisione cantonale, assicurazione, vignetta, tagliando, gomme stagionali, tachigrafo) con avvisi automatici. Trasversale, evita fermi e multe.
    - `rifornimenti` — Registro carburante/ricariche per mezzo: litri/kWh, costo, km, consumo medio; serve al costo-km e a scovare anomalie.

---

### 🌾 Cascina — gestionale per agricoltura, vino e produzione artigianale  *(archetipo: commessa-progetti)*
_Un'unica base pensata per chi PRODUCE e VENDE: si lavora per lotti/raccolti stagionali, si tracciano scorte e magazzino, si vende su più canali (vendita diretta in azienda, mercati/sagre, B2B a ristoranti e negozi) e si gestiscono clienti ricorrenti. Il cuore comune è: anagrafica clienti (con i B2B horeca separati), un magazzino/lotti di prodotto finito, un listino, ordini ricorrenti, conti e un calendario molto stagionale. Sopra questa base ogni mestiere accende il suo modulo di produzione specifico (vinificazione, smielatura, stagionatura, cotte, semina/raccolta). Volutamente NON è una vera fatturazione fiscale/IVA: si resta su preventivi + conti, con bolle/DDV per le consegne B2B. Etichette e tracciabilità (lotto, scadenza, ingredienti/allergeni) sono il filo conduttore di quasi tutti i sotto-settori, perché in Svizzera la dichiarazione su etichetta è obbligatoria._

> 🇨🇭 **Mercato CH:** Domanda e disponibilità a pagare: in Ticino e in Svizzera il segmento "produzione + vendita diretta" è vivace (cantine Merlot, mieli, formaggi d'alpe, microbirrifici, vivai, cassette di verdura) e questi produttori incassano bene grazie a margini sulla vendita diretta e a un cliente sensibile al km0/bio: la disponibilità a pagare un canone PMI esiste, ma sono micro-aziende (spesso 1-5 persone, stagionali) quindi serve un prezzo contenuto e un'app semplicissima, mobile, usabile in cantina/campo/mercato anche con poca rete. Specificità locali e normative: (1) Etichettatura alimentare obbligatoria e severa (denominazione, ingredienti, allergeni, lotto, quantità, conservazione, indirizzo produttore) → il modulo etichette è un vero argomento di vendita; (2) Tracciabilità di lotto richiesta dall'autocontrollo igienico (concetto HACCP) per latticini, miele, conserve, birra → i moduli per-lotto coprono questo bisogno reale; (3) vini con denominazioni cantonali (es. Merlot del Ticino DOC, AOC vallesane) e registro vendemmia; (4) i conferimenti/lavorazioni conto terzi (frantoi, cantine sociali) sono tipici e poco serviti dai gestionali generici. Lingue: il template va pensato IT-first per il Ticino ma con riuso DE/FR per scalare a Vallese, Grigioni e Svizzera tedesca (formaggi/birrifici), quindi le etichette e le diciture vanno tenute multilingua. Scope/fatturazione: la vendita B2B verso ristoranti e negozi richiede una bolla/documento di consegna (DDV) e, prima o poi, una fattura; coerentemente con i vincoli MODULA si copre con preventivi + conti + una semplice bolla di consegna, ma per i caseifici/cantine che vendono molto B2B una fatturazione vera (con IVA al 2.5% sui generi alimentari) sarà la richiesta che spinge oltre lo scope attuale: va segnalata come limite e gestita con il modulo fatture quando uscirà dalla coda.

**Viticoltori & cantine**
- *Attività esempio:* Cantina Merlot in Malcantone (Ticino) con vendita diretta + ristoranti della zona; Vignaiolo a Mendrisiotto che vinifica Merlot del Ticino DOC e bianchi; Piccola cantina del Vallese (Fendant, Petite Arvine) con spaccio e spedizioni; Azienda vitivinicola biologica con barrique e gamma annate diverse
- *Flusso:* Vendemmia → vinificazione per lotto/annata e per vasca/barrique → imbottigliamento (numero bottiglie per lotto) → giacenza per etichetta+annata → vendita su 3 canali (spaccio, mercati, ristoranti B2B) con prezzi diversi → spedizioni cartoni. Deve sapere ogni giorno: quante bottiglie restano per annata, quali ristoranti vanno riforniti, cosa è uscito dallo spaccio.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `vinificazione` — Diario di cantina per lotto/annata: vasca o barrique, travasi, analisi (zuccheri/acidità/solforosa), bottiglie prodotte per lotto, stato (in affinamento/imbottigliato).
    - `cantina-stock` — Giacenza prodotto finito per etichetta+annata+formato (75cl/magnum), carico da imbottigliamento, scarico da vendite, soglia minima.
    - `vendita-diretta` — Spaccio/cassa rapida: vendite al banco per prodotto a listino, scontrino interno, scarico automatico dalla giacenza; distingue canale spaccio/mercato/ristorante.
    - `ordini-b2b` — Ordini ricorrenti dei clienti horeca (ristoranti/enoteche): righe da listino, bolla di consegna/DDV, storico riordini, da-consegnare della settimana.

**Apicoltori & produttori di miele/conserve**
- *Attività esempio:* Apicoltore del Sopraceneri con miele di castagno e millefiori, vendita ai mercatini; Azienda apistica con 80 arnie su più postazioni (montagna/piano) + vendita diretta; Laboratorio di conserve e confetture artigianali (Valle di Muggio) per gastronomie; Produttore di sciroppi, mostarde e miele venduto in Gault&Millau locali
- *Flusso:* Gestione postazioni/arnie e visite stagionali → smielatura per lotto (origine fiorale + postazione) → invasettamento in formati diversi (250g/500g/1kg) con lotto e scadenza → vendita a mercati, negozi del territorio e online. Etichetta a norma (origine, lotto, peso) è obbligatoria. Ogni giorno: vasetti per tipo in giacenza, ordini dei negozi, prossime visite agli apiari.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `apiario` — Registro postazioni e arnie: numero arnie per postazione, visite/trattamenti (es. varroa), produzione attesa, note sanitarie.
    - `lotti-prod` — Lotti di produzione generici (miele, conserve): materia prima → lotto con data, quantità, scadenza, resa; base per la tracciabilità.
    - `invasettamento` — Confezionamento: da lotto a vasetti per formato/etichetta, giacenza per prodotto+formato, carico/scarico.
    - `etichette` — Generatore etichetta a norma CH: nome prodotto, ingredienti/allergeni, lotto, peso, scadenza, produttore → PDF stampabile per formato.

**Caseifici & alpeggi (latte, formaggi)**
- *Attività esempio:* Alpe del Bedretto con produzione estiva di formaggio d'alpe e burro; Caseificio di valle che lavora latte di capra (formaggini, büscion); Azienda con caseificio aziendale e vendita allo spaccio + mercati; Produttore di formaggi affinati venduti a gastronomie e ristoranti ticinesi
- *Flusso:* Latte conferito/munto → caseificazione per giornata/caldaia (forme prodotte, lotto) → stagionatura in cantina (forme su scalere, rivoltamenti, peso, data di maturazione) → vendita a peso/forma su spaccio, mercati e B2B. Deve seguire: cosa è pronto in cantina, lotti per tracciabilità, ordini gastronomie. Stagionalità forte (alpeggio estivo).
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `caseificazione` — Diario di lavorazione per giornata/caldaia: litri latte, tipo prodotto, numero forme, lotto, resa.
    - `stagionatura` — Gestione cantina di affinamento: forme in maturazione, posizione/scalera, rivoltamenti, peso, data 'pronto', alert di maturazione.
    - `vendita-diretta` — Spaccio/cassa a peso: vendita per prodotto e peso, scarico dalla stagionatura, canale spaccio/mercato/B2B.
    - `ordini-b2b` — Ordini ricorrenti di gastronomie/ristoranti con bolla di consegna e storico riordini.

**Birrifici & distillerie artigianali**
- *Attività esempio:* Microbirrificio del Locarnese con 5 birre fisse + stagionali, vendita a bar e pub; Birrificio brewpub che vende in azienda e rifornisce locali della regione; Piccola distilleria di grappa/acquavite di mele (Vallemaggia); Birrificio che fa anche cotte 'a contratto' per terzi (gypsy/contract brewing)
- *Flusso:* Pianificazione cotte → produzione per batch (ricetta, fermentatore, litri, lotto) → confezionamento in fusti/bottiglie/lattine → giacenza per birra+formato → vendita B2B a bar/ristoranti (con fusti a rendere) + spaccio. Ogni giorno: cosa è in fermentazione, fusti fuori in deposito presso i locali, riordini dei bar.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `cotte` — Pianificazione e diario cotte/batch: ricetta, fermentatore, date attacco/travaso/confezionamento, litri, lotto.
    - `confez-bevande` — Confezionamento in fusti/bottiglie/lattine: da batch a giacenza per prodotto+formato, carico/scarico.
    - `fusti-vuoto` — Gestione fusti/cauzioni a rendere: fusti consegnati per cliente, fuori/dentro, deposito da recuperare.
    - `ordini-b2b` — Ordini ricorrenti di bar/ristoranti con bolla di consegna e storico riordini.

**Aziende agricole & orticole (vendita diretta)**
- *Attività esempio:* Azienda orticola del Piano di Magadino con cassette settimanali a domicilio; Fattoria con self-harvest, banco vendita in azienda e bancarella al mercato di Bellinzona; Azienda con abbonamento ortaggi (modello 'cassetta' / contadini a domicilio); Produttore di patate, mele e piccoli frutti venduto a Migros/Coop locali e gastronomie
- *Flusso:* Pianificazione colturale (cosa semino/raccolgo per appezzamento e stagione) → raccolto per coltura/lotto → composizione cassette/ordini settimanali → consegne a domicilio o ritiri + mercati. Forte ricorrenza (abbonamenti settimanali) e forte stagionalità. Ogni giorno: cosa è disponibile oggi, cassette da preparare, giro di consegne.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `zone`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `colture` — Piano colturale per appezzamento: cosa è seminato dove, finestre di semina/raccolta, rotazioni, disponibilità attesa per settimana.
    - `raccolto` — Registro raccolto per coltura/lotto: quantità raccolta, data, destinazione (cassette/B2B/mercato), giacenza fresca.
    - `cassette` — Abbonamenti e composizione cassette: clienti in abbonamento, contenuto settimanale, pausa/ripresa, lista da preparare.
    - `giri-consegna` — Giri di consegna a domicilio/punti di ritiro: assegna cassette a un giro, ordine ottimizzato, consegnato sì/no (si appoggia a zone).

**Florovivaisti & garden**
- *Attività esempio:* Vivaio del Mendrisiotto con piante ornamentali, stagionali e fioriture a calendario; Garden center con vendita al banco + servizio piantumazione/manutenzione verde; Floricoltore che rifornisce fiorai e allestisce eventi/matrimoni; Vivaio specializzato in camelie/azalee (Centovalli) con vendita diretta e per corrispondenza
- *Flusso:* Produzione/acquisto piante per partita (semina/talea/messa a dimora, fioritura attesa) → catalogo a listino con disponibilità stagionale → vendita al banco + ordini fiorai/paesaggisti + eventuali commesse di piantumazione. Ogni giorno: cosa è in fioritura/pronto vendita, ordini B2B, lavori di posa programmati. Stagionalità marcata (primavera/Ognissanti/Natale).
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `sites`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `vivaio-stock` — Giacenza piante per specie/varietà/formato vaso, stato (in coltivazione/pronta vendita/in fioritura), disponibilità stagionale.
    - `listino-piante` — Catalogo/listino con foto e prezzi per canale (privato/B2B), evidenza disponibilità del momento.
    - `ordini-b2b` — Ordini ricorrenti di fiorai/paesaggisti con bolla di consegna e storico.
    - `preventivi` — Preventivo per commesse di piantumazione/allestimento (piante + manodopera) → accettazione → diventa lavoro/cantiere (modulo trasversale esistente).

**Frantoi & trasformatori (olio, succhi, sidro)**
- *Attività esempio:* Piccolo frantoio del Sottoceneri che molisce olive proprie e conto terzi; Azienda con torchiatura mele/pere per succo e sidro (Valli); Produttore di olio di noci/zucca e oli speciali venduti a gastronomie; Laboratorio di trasformazione frutta in succhi, confetture e essiccati
- *Flusso:* Conferimento materia prima (propria o di terzi) → lavorazione per lotto (molitura/torchiatura, resa, litri ottenuti) → imbottigliamento per formato con lotto/scadenza → vendita diretta + B2B. Importante la parte 'conto terzi' (chi ha portato cosa, quanto reso). Ogni giorno: lotti in lavorazione, rese, ordini, conferimenti da restituire.
- *Moduli core:* `hub`, `cal`, `clients`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `molitura` — Lotti di trasformazione: materia prima conferita, kg in entrata, litri/kg ottenuti, resa %, lotto e scadenza.
    - `conto-terzi` — Lavorazioni per terzi: chi ha conferito, quantità, prodotto reso, tariffa lavorazione, da-restituire.
    - `invasettamento` — Imbottigliamento/confezionamento in formati con lotto, giacenza per prodotto+formato, carico/scarico.
    - `etichette` — Generatore etichetta a norma CH (prodotto, ingredienti/allergeni, lotto, quantità, scadenza, produttore) → PDF per formato.

---

### 🤝 Gestionale Soci & Comunità  *(archetipo: soci-membership)*
_Gestionale base per associazioni, no-profit ed enti di comunità: tiene l'albo soci/tesserati con stato quota, organizza eventi e attività, coordina volontari e turni, e manda comunicazioni di massa. Tutto ruota attorno a tre cose che ogni ente vive ogni anno: chi è socio (e ha pagato), cosa facciamo (eventi/attività/prove) e chi ci aiuta (volontari/dirigenti). Niente contabilità fiscale: per il denaro bastano "conti" (entrate/spese/utile) più la tracciatura quote; per i flussi formali si usano preventivi e ricevute semplici, non fatturazione IVA. Pensato per realtà gestite da pochi volontari, spesso non tecnici, quindi pochi moduli accesi e flussi guidati._

> 🇨🇭 **Mercato CH:** Domanda reale e ampia ma con disponibilità a pagare bassa e disomogenea: la Svizzera è il paese delle associazioni (l'art. 60 e segg. CC rende fondare un'associazione gratuito e rapidissimo, ci sono decine di migliaia di Vereine/associazioni, e quasi ogni adulto ne fa parte). Il problema è che molte vivono di quote modeste e lavoro volontario, quindi un canone mensile per ente va tenuto basso (fascia tipo 9–25 CHF/mese) o impacchettato per federazione/comune. Le associazioni più strutturate e disposte a pagare sono quelle sportive (FTAB basket, FTC calcio ticinese, club affiliati Swiss Olympic con obblighi J+S), le bande/filarmoniche e cori (Federazione bandistica, calendario fitto di concerti), le parrocchie/oratori del cattolicissimo Ticino, e le cooperative/ONLUS con dipendenti. Specificità locali decisive: (1) lingua — in Ticino tutto in italiano, ma per vendere oltre Gottardo servono DE/FR, ed è un forte argomento di vendita avere un gestionale "anche in italiano" che i prodotti tedeschi non hanno; (2) pagamenti — la quota si incassa quasi sempre con polizza/QR-fattura svizzera (QR-bill con IBAN+riferimento), TWINT è ormai atteso, e l'integrazione "genera QR per la quota" è il vero gancio di valore (da segnalare come modulo da costruire, attenzione: è incasso quote, non fatturazione fiscale); (3) sport — il sistema J+S (Gioventù+Sport) impone registri presenze allenamenti per ottenere i sussidi federali, ed è un dolore concreto che un modulo presenze risolve; (4) volontariato — esiste il Dossier Bénévolat / attestato volontariato riconosciuto a livello nazionale, utile poterlo generare; (5) privacy — la nuova LPD svizzera (in vigore da set. 2023) e i dati sensibili (minori negli oratori e nelle squadre giovanili, certificati medici sportivi, dati religiosi nelle parrocchie) impongono attenzione GDPR/LPD seria, da gestire nelle app cliente reali. Concorrenza: tanti gestiscono ancora con Excel + WhatsApp + Doodle; esistono tool tedeschi (es. per Vereine) e svizzeri, ma raramente italofoni e su misura per la micro-associazione ticinese. Posizionamento vincente: pochissimi moduli, italiano nativo, QR-quota e presenze J+S come killer feature locali.

**Associazioni sportive e club**
- *Attività esempio:* ASD/società di basket affiliata FTAB con squadre giovanili a Lugano; Club di calcio dilettantistico di paese (es. FC del Mendrisiotto) con settore giovanile J+S; Società di nuoto/atletica/pallavolo con allenamenti settimanali; Scuola di hockey o club di tennis con tesserati e tornei; Gruppo di mountain bike / sci club con uscite stagionali
- *Flusso:* Ogni stagione: iscrivere/rinnovare i tesserati per categoria (giovanili/seniori), incassare la quota annua, comporre squadre e gruppi di allenamento, registrare le PRESENZE agli allenamenti (obbligo J+S per i sussidi), calendarizzare partite/tornei e convocare, tenere i certificati medici e i contatti dei genitori dei minori.
- *Moduli core:* `hub`, `clients`, `cal`, `emps`, `notif`, `notes`, `conti`
- *Moduli specifici da costruire:*
    - `tesseramenti` — albo tesserati per stagione con categoria (giovanile/senior), numero tessera, scadenza e stato quota (pagata/scaduta); rinnovo annuale di massa con un clic
    - `presenze-js` — registro presenze allenamenti/attività per gruppo, pensato per il rendiconto J+S Gioventù+Sport; conta le ore svolte e segnala i minimi per i sussidi
    - `convocazioni` — convoca i giocatori a partite/eventi (presente/assente/forse) e raccoglie le risposte, sostituendo i gruppi WhatsApp
    - `certificati` — tiene i certificati medici sportivi e i documenti minori con data di scadenza e avviso prima della scadenza

**Associazioni culturali, bande e cori**
- *Attività esempio:* Filarmonica/banda di paese affiliata alla Federazione bandistica ticinese; Coro parrocchiale o coro misto con concerto annuale; Filodrammatica / compagnia teatrale amatoriale; Associazione culturale che organizza rassegne, mostre e conferenze; Gruppo folkloristico o scuola di danza popolare
- *Flusso:* Tenere l'organico (sezioni/voci/strumenti) e i soci, calendarizzare PROVE settimanali e concerti/spettacoli, registrare le presenze alle prove, gestire prestiti di strumenti/divise/spartiti, incassare la quota sociale e vendere/tracciare i biglietti dell'evento.
- *Moduli core:* `hub`, `clients`, `cal`, `notif`, `notes`, `conti`, `emps`
- *Moduli specifici da costruire:*
    - `tesseramenti` — albo soci con sezione/voce/strumento, stato quota e anzianità; rinnovo annuale di massa
    - `presenze-js` — registro presenze alle prove e agli eventi, utile per statistiche di partecipazione e (per le bande giovanili) rendiconto J+S
    - `prestiti` — inventario di strumenti, divise e spartiti assegnati ai soci, con chi ha cosa e stato di restituzione
    - `biglietteria` — gestione semplice di posti/inviti per concerti e spettacoli: liste, conferme e incassi al botteghino (non ticketing fiscale)

**Parrocchie, oratori e gruppi giovanili**
- *Attività esempio:* Parrocchia con oratorio e catechismo in un comune del Luganese; Colonia / centro estivo parrocchiale o comunale per bambini; Gruppo scout (es. sezione scout ticinese) con uscite e campi; Patronato / gruppo Caritas locale con attività di sostegno; Associazione genitori della scuola (comitato genitori)
- *Flusso:* Iscrivere i bambini/ragazzi alle attività (catechismo, colonia, doposcuola), raccogliere autorizzazioni e dati dei genitori, formare gruppi con animatori/volontari, registrare le presenze giornaliere, gestire intolleranze/allergie e contatti d'emergenza, comunicare con le famiglie e tenere la cassa attività.
- *Moduli core:* `hub`, `clients`, `cal`, `notif`, `emps`, `notes`, `conti`
- *Moduli specifici da costruire:*
    - `iscrizioni` — modulo d'iscrizione attività (catechismo/colonia/campo) con dati bambino, genitore-referente e autorizzazioni; gestisce posti e liste d'attesa
    - `presenze-js` — appello giornaliero per attività con minori (colonia/doposcuola), entrate/uscite e chi ritira il bambino
    - `schede-minori` — scheda sensibile del minore con allergie/intolleranze, farmaci, contatto d'emergenza e consenso immagini (dati sensibili: LPD/GDPR)
    - `volontari` — anagrafica animatori/catechisti/volontari con ruoli, disponibilità e turni assegnati alle attività

**Circoli, club ricreativi e società di paese**
- *Attività esempio:* Circolo/grotto sociale o società del carnevale (es. comitato Rabadan-style); Club di bocce / pesca / caccia / filatelia con sede sociale; Pro Loco o società degli amici del paese che organizza la sagra; Comitato organizzatore di una festa/fiera annuale; Club service (Lions/Rotary-like) o associazione ricreativa aziendale
- *Flusso:* Tenere i soci e rinnovare le tessere, organizzare l'EVENTO clou dell'anno (sagra/festa/carnevale) con tutta la macchina di volontari e turni ai banchi, gestire la cassa e i piccoli incassi, prenotare la sede sociale per attività, e comunicare a tutti i soci convocazioni e assemblee.
- *Moduli core:* `hub`, `clients`, `cal`, `notif`, `conti`, `notes`, `emps`
- *Moduli specifici da costruire:*
    - `tesseramenti` — albo soci con tessera annuale, stato quota e anzianità; rinnovo di massa e stampa tessere
    - `eventi` — scheda evento (sagra/festa) con programma, banchi/postazioni, fornitori e budget entrate/uscite dedicato
    - `turni-volontari` — pianificazione turni dei volontari ai banchi/postazioni durante l'evento, con copertura buchi e conferme via notifica
    - `assemblee` — convocazione assemblea con ordine del giorno, registro presenze/deleghe e verbale; supporto al quorum

**ONLUS, fondazioni e cooperative sociali**
- *Attività esempio:* Fondazione di pubblica utilità ticinese con personale e progetti; Cooperativa sociale che inserisce al lavoro persone fragili; Associazione di volontariato sanitario/assistenza anziani a domicilio; Banco alimentare / mensa sociale / emporio solidale; ONG locale che raccoglie fondi per progetti di cooperazione
- *Flusso:* Gestire soci sostenitori e DONATORI (con storico donazioni e ricevute per la deduzione fiscale), coordinare volontari su progetti/turni di servizio, rendicontare i progetti finanziati, tenere la contabilità entrate/spese e — se ci sono dipendenti — anagrafica e presenze del personale, il tutto con forte attenzione alla privacy dei beneficiari.
- *Moduli core:* `hub`, `clients`, `emps`, `cal`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `donazioni` — registro donatori e donazioni (anche ricorrenti) con causale, importo e generazione ricevuta annuale per deduzione fiscale; non è fatturazione IVA
    - `volontari` — anagrafica volontari con competenze e disponibilità, ore di servizio svolte e generazione attestato di volontariato (Dossier Bénévolat)
    - `progetti` — schede progetto con obiettivo, budget assegnato, spese collegate e stato avanzamento per la rendicontazione ai finanziatori
    - `beneficiari` — anagrafica riservata dei beneficiari/utenti con accesso ristretto e dati sensibili (LPD/GDPR), separata dai soci

**Federazioni, comitati e reti di associazioni**
- *Attività esempio:* Federazione sportiva cantonale che coordina i club affiliati (es. federazione regionale); Associazione mantello / cartello di società di un comune; Comitato organizzatore di un torneo o di una manifestazione intercomunale; Rete di oratori o consorzio di parrocchie del vicariato; Gruppo di acquisto / consorzio di piccole associazioni
- *Flusso:* Coordinare più enti affiliati (anagrafica delle associazioni membro e dei loro referenti), riscuotere le quote di affiliazione, distribuire calendari e comunicazioni a cascata su tutte le società, gestire iscrizioni a tornei/manifestazioni comuni e tenere lo scadenziario degli obblighi (affiliazioni, assicurazioni, rendiconti) verso l'alto.
- *Moduli core:* `hub`, `clients`, `cal`, `notif`, `conti`, `notes`, `emps`
- *Moduli specifici da costruire:*
    - `affiliati` — anagrafica delle associazioni membro con referenti, numero tesserati dichiarati e stato quota di affiliazione; vista 'federazione' multi-club
    - `comunicazioni` — invio comunicazioni e calendari a cascata a tutti gli affiliati e ai loro referenti, con conferma di lettura
    - `iscrizioni` — gestione iscrizioni dei club a tornei/manifestazioni comuni, con categorie, posti e stato pagamento
    - `scadenziario` — scadenze obbligatorie ricorrenti (affiliazioni, assicurazioni, rendiconti, assemblee) con avvisi anticipati ai referenti

---

### 🧩 Settori aggiuntivi  *(archetipo: altro)*
_Dieci macro-aree mancanti segnalate dal critico, raggruppate sotto un unico template "Settori aggiuntivi". Coprono nicchie svizzere/ticinesi redditizie e poco digitalizzate che NON entrano nei settori campo/assistenza già a catalogo perché hanno archetipi operativi diversi: ritiro→lavorazione→pronto→ritirato su capo/oggetto (sartoria, lavanderia, riparazioni al banco), prenotazione di un BENE o SPAZIO per data/fascia (noleggio, coworking, self-storage), abbonamenti+slot ad alta ricorrenza (car detailing, autolavaggi, posteggi), retail sanitario regolato con controlli periodici e convenzioni (ottica/acustica/ortopedia), pratiche con scadenze di legge e forte componente documentale (funerario), pianificazione turni/pattuglie con rapportini sui siti cliente (vigilanza), e pulizie tecniche su commessa con controlli a norma CH (spazzacamini, autospurghi). Il filo conduttore di gran parte di queste aree è un nuovo trasversale di "stato lavorazione su oggetto/bene" (ticket riparazioni) e uno di "prenotazione di una risorsa" (bene o spazio), che da soli sbloccano sei delle dieci aree._

> 🇨🇭 **Mercato CH:** Aree scelte per densità reale in Ticino e disponibilità a pagare alta: funerario (imprese famigliari, alta marginalità, scadenze di legge), microservizi urbani su capo/oggetto (Lugano/Bellinzona/Locarno, oggi su quaderno), rental e self-storage/coworking (forte crescita nelle città CH, ricavi ricorrenti), detailing/autolavaggi premium e posteggi in abbonamento, retail sanitario regolato con convenzioni AI/AVS e casse malati, vigilanza e pulizie tecniche a norma CH (canna fumaria, fosse). Specificità locali: multilingua IT/DE/FR per scalare oltre il Ticino; normative CH (controllo spazzacamino obbligatorio, registro presenze su siti, garanzie/convenzioni sanitarie). VINCOLO DI SCOPE confermato: dove servirebbe vera fatturazione/IVA (funerario con fattura agli eredi, retail sanitario con rimborso cassa malati, vigilanza B2B) si resta su `preventivi`+`conti` e si segnala il limite — il rimborso assicurativo vero e proprio resta fuori perimetro. WhatsApp per gli avvisi "lavoro pronto/ritira" è "prossimamente": nel frattempo l'avviso è via `notif`/email.

**Funerario & Onoranze funebri**
- *Attività esempio:* Imprese di onoranze funebri / pompe funebri (a conduzione famigliare, Ticino); Fioristi specializzati in composizioni e addobbi funebri; Marmisti, lapidi e arti funerarie; Servizi di cremazione, trasporto e rimpatrio salme
- *Flusso:* Dalla chiamata della famiglia parte una pratica unica (il defunto e la commessa di servizio) con una catena di appuntamenti e adempimenti a tempo: rilievo salma, documenti (atto di morte, permessi, autorizzazione cremazione/trasporto), prenotazione cerimonia/cimitero/forno crematorio, coordinamento fornitori (fiori, marmista, trasporto, celebrante), e tutto deve rispettare scadenze di legge rigide. Ogni giorno si traccia: a che punto è ogni pratica, quali documenti mancano, quali scadenze incombono, quali fornitori vanno sollecitati, e il preventivo/consuntivo dei servizi resi alla famiglia.
- *Moduli core:* `clients`, `cal`, `notes`, `emps`, `conti`, `notif`
- *Moduli specifici da costruire:*
    - `pratiche-funebri` — Fascicolo per defunto/famiglia: dati salma e committente, catena servizi (veglia, cerimonia, sepoltura/cremazione, trasporto), stato avanzamento e fornitori coinvolti; il cruscotto unico della pompa funebre.
    - `scadenziario` — ♻️ trasversale — scadenze e adempimenti di legge per pratica (permessi, autorizzazioni, tempi cremazione/trasporto) con avvisi automatici prima del termine.
    - `documenti` — Archivio file per pratica (atti, autorizzazioni, permessi, foto lapide); già in coda, qui è centrale per la forte componente documentale.
    - `preventivi` — ♻️ trasversale — preventivo servizi alla famiglia (cofano, fiori, cerimonia, trasporto) → accettazione → consuntivo; NIENTE fattura IVA piena, si appoggia a conti.

**Sartoria, Lavanderia & Calzolaio (servizi su capo/oggetto)**
- *Attività esempio:* Sarti e sartorie: riparazioni, orli e su misura; Lavanderie e tintorie (anche self e professionali); Calzolai e riparazione pelletteria; Affilatura, riparazione orologi e piccoli oggetti
- *Flusso:* Non è un appuntamento né un cantiere: è un ticket sul capo/oggetto. Il cliente consegna l'oggetto, si apre una scheda (cosa fare, prezzo, data ritiro prevista), l'oggetto passa per stati lavorazione (in attesa → in lavorazione → pronto → ritirato), e quando è pronto si avvisa il cliente. Ogni giorno si traccia: quali ticket sono aperti, cosa è pronto da ritirare, cosa è in ritardo, e l'incasso al ritiro. Tanti capi, scontrino piccolo, alta frequenza.
- *Moduli core:* `clients`, `notes`, `conti`, `notif`, `cal`
- *Moduli specifici da costruire:*
    - `riparazioni` — ♻️ NUOVO trasversale — ticket su capo/oggetto con stato (accettato → in lavorazione → pronto → ritirato), numero ritiro, prezzo, data prevista e avviso 'pronto da ritirare'; cuore di sartoria, lavanderia, calzolaio E delle riparazioni al banco.
    - `etichette` — Stampa scontrino/etichetta di ritiro col numero pratica da agganciare al capo/oggetto, così cliente e operatore ritrovano la lavorazione.
    - `ricorrenze` — ♻️ trasversale — per clienti business ricorrenti (es. ristoranti/hotel che portano tovagliato a lavare ogni settimana): giri/raccolte programmate.

**Noleggio attrezzature & beni (rental non sportivo)**
- *Attività esempio:* Noleggio attrezzature e macchinari edili (ponteggi, gru, trabattelli); Noleggio abiti da cerimonia, costumi e accessori; Noleggio gonfiabili, stoviglie, gazebo e arredo per feste; Noleggio biciclette / e-bike (turismo Ticino)
- *Flusso:* Il cuore è la disponibilità del BENE per data: il cliente prenota un oggetto specifico (o una quantità) per un periodo, si blocca a calendario, si gestisce cauzione, stato uscita/rientro, controllo usura/danni e ritardi. Ogni giorno si traccia: cosa esce oggi, cosa rientra, cosa è libero/occupato in una certa data, cauzioni da restituire, beni in manutenzione. Ricavo ricorrente e ad alta marginalità, ma logica opposta all'appuntamento.
- *Moduli core:* `clients`, `cal`, `conti`, `notes`, `notif`
- *Moduli specifici da costruire:*
    - `noleggio-beni` — ♻️ NUOVO trasversale — catalogo beni noleggiabili con calendario disponibilità per data, prenotazione del singolo bene/quantità, cauzione, stato uscita/rientro, danni/usura; richiesto anche da edili, eventi e atelier.
    - `macchine` — Parco beni a noleggio (matricola, manutenzioni, ore/km); già pronto, qui usato come anagrafica del bene.
    - `preventivi` — ♻️ trasversale — preventivo noleggio (tariffa/giorno + cauzione + extra) → accettazione → contratto di noleggio.

**Lavaggio e cura veicoli (car detailing & autolavaggi)**
- *Attività esempio:* Car detailing e nano-rivestimenti / trattamenti premium; Autolavaggi a mano e a programma; Sanificazione e pulizia tappezzeria interni auto; Wrapping e pellicole (servizio a prenotazione)
- *Flusso:* Servizio rapido, spesso a pacchetti o abbonamento/tessera, su prenotazione di uno slot. Diverso dall'autofficina: non serve la scheda tecnica del veicolo né i tagliandi, serve gestire abbonamenti/tessere (quanti lavaggi residui, scadenza) e riempire bene gli slot della giornata. Ogni giorno si traccia: prenotazioni dello slot, tessere/abbonamenti attivi e consumi, pacchetti venduti, incasso. Alta ricorrenza e marginalità; detailing premium in forte crescita in CH.
- *Moduli core:* `clients`, `cal`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `prenota` — Prenotazione slot di lavaggio/detailing online o a calendario; già in coda, qui è il core operativo.
    - `abbonamenti` — ♻️ NUOVO trasversale — tessere/abbonamenti a consumo o a tempo (es. 10 lavaggi, lavaggio illimitato mensile): saldo residuo, scadenza, scalo automatico a ogni passaggio; utile anche a posteggi e coworking.
    - `fidelity` — Punti/promo e clienti ricorrenti; già in coda, leva sulla forte ricorrenza del lavaggio.

**Ottico-audioprotesista retail & ortopedia sanitaria**
- *Attività esempio:* Audioprotesisti / centri acustici; Sanitarie e ortopedia (plantari, tutori, calzature); Negozi di ottica con laboratorio e controlli vista; Forniture per mobilità e ausili per anziani
- *Flusso:* Doppia anima: appuntamento clinico (controllo vista/udito, adattamento) PIÙ retail-sanitario con vendita di dispositivi, garanzie e controlli periodici. Ogni giorno si traccia: appuntamenti di controllo/adattamento, dispositivi venduti con garanzia e scadenze, richiami per controllo periodico (richiamo annuale), e le convenzioni (AI/AVS, casse malati) per la parte rimborsata. Alto scontrino, clientela ricorrente per controlli e adattamenti, settore regolato e molto presente in CH.
- *Moduli core:* `clients`, `cal`, `conti`, `notif`, `notes`, `emps`
- *Moduli specifici da costruire:*
    - `dispositivi` — ♻️ NUOVO — anagrafica dispositivi venduti per cliente (occhiali, apparecchi acustici, plantari/tutori): modello, matricola, garanzia, scadenza, controllo/adattamento successivo.
    - `richiami` — ♻️ NUOVO trasversale — richiami periodici cliente (controllo vista/udito annuale, manutenzione dispositivo) generati in automatico con avviso; vicino a ricorrenze ma centrato sul cliente, non sull'impianto.
    - `convenzioni` — Gestione pratiche convenzionate (AI/AVS, casse malati): stato pratica e quota a carico cliente. NB scope: NIENTE rimborso/fatturazione assicurativa vera — si registra la quota e si resta su preventivi+conti, da segnalare al cliente reale.

**Riparazione & assistenza tecnica al banco (non-IT)**
- *Attività esempio:* Riparazione smartphone, tablet e PC al banco; Riparazione e service biciclette / e-bike; Riparazione elettrodomestici e piccola elettronica; Riparazione e service strumenti musicali
- *Flusso:* Flusso accettazione → diagnosi → preventivo → riparazione → consegna, con avviso al cliente. Diverso sia dall'officina auto sia dall'IT/MSP: è un ticket-riparazione sull'oggetto portato al banco, con eventuali pezzi di ricambio ordinati. Ogni giorno si traccia: oggetti in accettazione, preventivi da approvare, ricambi in attesa, riparazioni pronte da consegnare e incasso al ritiro. Microimprese diffuse.
- *Moduli core:* `clients`, `notes`, `conti`, `notif`, `cal`
- *Moduli specifici da costruire:*
    - `riparazioni` — ♻️ trasversale (stesso modulo di sartoria/lavanderia) — ticket sull'oggetto con stati accettato → in diagnosi → in attesa ricambio → riparato → consegnato, numero ritiro e avviso 'pronto'.
    - `preventivi` — ♻️ trasversale — preventivo riparazione (diagnosi + ricambi + manodopera) → accettazione del cliente prima di procedere.
    - `ricambi` — ♻️ NUOVO — pezzi di ricambio per ticket: ordinato/arrivato/montato e costo; versione leggera del futuro magazzino orientata alla riparazione.

**Mobilità dolce, parcheggi & stazioni di servizio**
- *Attività esempio:* Autorimesse e posteggi in abbonamento; Stazioni di servizio / distributori con shop e cassa; Stazioni di ricarica e gestione colonnine EV; Soccorso stradale / carro attrezzi (reperibilità)
- *Flusso:* Il bisogno è abbonamenti/posti + cassa + turni, non appuntamenti. Per i posteggi: assegnazione del posto a un abbonato, canone mensile, scadenze e rinnovi, posti liberi/occupati. Per stazioni e shop: turni del personale e piccola cassa. Per il soccorso stradale: reperibilità e chiamate urgenti. Ogni giorno si traccia: chi occupa quali posti, canoni in scadenza, turni coperti, incasso cassa, chiamate gestite.
- *Moduli core:* `clients`, `conti`, `emps`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `posti-abbonati` — ♻️ NUOVO — assegnazione posto/box a un abbonato con canone mensile ricorrente, scadenza e rinnovo, mappa posti liberi/occupati; cuore di autorimesse e posteggi.
    - `turni` — Turni e presenze del personale di stazione/shop; già in coda.
    - `chiamate` — ♻️ Reperibilità e chiamate urgenti per il soccorso stradale (ticket, turni di reperibilità, SLA); stesso modulo richiesto da ascensori.

**Pulizie tecniche specializzate (oltre le pulizie civili)**
- *Attività esempio:* Spazzacamini / pulizia canne fumarie (controllo a norma CH); Autospurghi e pulizia fosse biologiche / condotte; Pulizia vetrate e facciate in quota; Sanificazione, bonifiche e disinfezione ambienti
- *Flusso:* Segmento tecnico ad alta marginalità, spesso B2B con contratti ricorrenti, su commessa con rapportini e scadenze a norma. Ogni giorno si traccia: interventi programmati ricorrenti per cliente/impianto (es. controllo canna fumaria obbligatorio), rapportino firmato sul posto con foto ed esito, contratti ricorrenti in rinnovo e scadenze di legge in avvicinamento. Vicino a man/interventi/ricorrenze ma con esigenze proprie di conformità CH.
- *Moduli core:* `clients`, `cal`, `man`, `conti`, `emps`, `notif`
- *Moduli specifici da costruire:*
    - `interventi` — ♻️ trasversale — rapportino d'intervento firmato con foto prima/dopo, esito e a norma (es. attestato controllo spazzacamino) → PDF al cliente.
    - `ricorrenze` — ♻️ trasversale — interventi periodici programmati (canna fumaria, fossa, sanificazione) generati in automatico per cliente.
    - `contratti-man` — ♻️ trasversale — contratti di manutenzione ricorrenti B2B con canone, rinnovo e alert in scadenza.

**Coworking, self-storage & spazi a noleggio**
- *Attività esempio:* Spazi coworking e uffici flessibili; Self-storage / box e magazzini in affitto; Sale riunioni / sale prove / studi a ore; Garage e cantine in locazione mensile
- *Flusso:* Il core è la prenotazione di uno spazio/box per fascia oraria o mese, con abbonamenti e accessi. Non è ricezione alberghiera né eventi: serve un calendario di RISORSE prenotabili (postazioni, box, sale) e contratti ricorrenti. Ogni giorno si traccia: quali spazi sono liberi/occupati per data o fascia, abbonamenti attivi e canoni in scadenza, prenotazioni sale a ore, accessi. Margini ricorrenti, gestione semplice e in crescita nelle città svizzere.
- *Moduli core:* `clients`, `cal`, `conti`, `notif`, `notes`
- *Moduli specifici da costruire:*
    - `spazi` — ♻️ NUOVO trasversale — risorse prenotabili (postazioni, box, sale) con calendario disponibilità per fascia/mese, prenotazione e occupazione; gemello 'spazio' del modulo noleggio-beni.
    - `abbonamenti` — ♻️ trasversale (stesso di detailing) — contratti/abbonamenti ricorrenti per postazione o box: canone mensile, scadenza, rinnovo.
    - `prenota` — Prenotazione online di sale/studi a ore; già in coda, qui per la parte 'a fascia oraria'.

**Sicurezza, vigilanza & servizi alla persona**
- *Attività esempio:* Istituti di vigilanza e guardie giurate; Servizi steward / sicurezza eventi; Portierato e reception in appalto; Investigazioni private e controllo accessi
- *Flusso:* Settore regolato con forte pianificazione turni, reperibilità e rapportini di servizio sui siti cliente. Ogni giorno si traccia: chi è in turno e su quale postazione/sito cliente, pattuglie e giri di ronda con registro presenze, rapportino di servizio (cosa è successo nel turno, eventi/anomalie), reperibilità e coperture mancanti. Contratti B2B ricorrenti e buona disponibilità a pagare; vicino a turni/interventi ma con postazioni e pattuglie proprie.
- *Moduli core:* `clients`, `emps`, `cal`, `notif`, `notes`, `conti`
- *Moduli specifici da costruire:*
    - `turni` — Pianificazione turni e presenze del personale di vigilanza, copertura postazioni e reperibilità; già in coda, qui è il core.
    - `postazioni` — ♻️ NUOVO — postazioni/siti cliente da presidiare con giri di ronda, registro presenze (timbratura sul sito) e assegnazione guardia al posto.
    - `rapporti-servizio` — ♻️ NUOVO — rapportino di servizio per turno/sito: eventi, anomalie, foto, firma e consegna al cliente B2B; cugino di interventi ma orientato al presidio, non alla riparazione.

---

## Parte 4 — Nicchie segnalate dal critico di completezza

Aree extra ad alta marginalità e poco digitalizzate in CH/Ticino, in gran parte già assorbite nel base #8 (Banco & Risorse) e nei verticali:

- **Funerario & Onoranze funebri** — Settore stabile, ad alta marginalita e poco digitalizzato, molto presente anche in Ticino con imprese famigliari. Gestiscono pratiche, scadenze, fornitori e una catena di servizi su appuntamento con forte componente documentale e di rispetto delle tempistiche di legge. Nessun gestionale generalista lo copre e la disponibilita a pagare e alta.
  - es: Imprese di onoranze funebri / pompe funebri, Fioristi specializzati in composizioni funebri, Marmisti / lapidi e arti funerarie, Servizi di cremazione e trasporto salme
- **Sartoria, Lavanderia & Calzolaio (servizi su capo/oggetto con ritiro-consegna)** — Microattivita diffusissime nei centri urbani ticinesi (Lugano, Bellinzona, Locarno), oggi gestite su carta o quaderno. Hanno un flusso tipico ticket-> lavorazione-> pronto-> ritirato che non e un appuntamento ne un cantiere: serve un modulo riparazioni/commesse con stato e avviso al cliente quando il lavoro e pronto. Bassa barriera, tante unita.
  - es: Sarti e sartorie / riparazioni e su misura, Lavanderie e tintorie (anche self/pro), Calzolai e riparazione pelletteria, Affilatura, riparazione orologi e piccoli oggetti
- **Noleggio attrezzature & beni (rental non sportivo)** — Il noleggio e una nicchia redditizia e ricorrente (ponteggi, attrezzi edili, gru, abiti, gonfiabili) molto presente in Svizzera. Il cuore gestionale e diverso da appuntamento/cantiere: serve disponibilita per data, prenotazione a calendario del bene, cauzione, stato uscita/rientro e usura. E un modulo trasversale (rental/noleggio-beni) richiesto anche da edili, eventi e atelier.
  - es: Noleggio attrezzature e macchinari edili, Noleggio abiti / abiti da cerimonia e costumi, Noleggio gonfiabili, stoviglie, gazebo per feste, Noleggio biciclette / e-bike (turismo Ticino)
- **Lavaggio e cura veicoli (car detailing & autolavaggi)** — Distinto dall'autofficina gia coperta: e un servizio rapido, spesso a pacchetti/abbonamento e a prenotazione, con alta ricorrenza e marginalita. Il detailing premium e in forte crescita in Svizzera. Serve gestione abbonamenti/tessere e prenotazione slot piu che schede tecniche veicolo.
  - es: Car detailing / nano-rivestimenti, Autolavaggi a mano e a programma, Sanificazione e tappezzeria interni auto, Wrapping e pellicole (servizio a prenotazione)
- **Ottico-audioprotesista retail & ortopedia sanitaria** — Gli ottici come professione clinica su appuntamento sono citati, ma manca tutta l'area retail-sanitaria con vendita di dispositivi, garanzie, controlli periodici e convenzioni (AI/AVS, casse malati). Settore ad alto scontrino, regolato e con clientela ricorrente per controlli e adattamenti, molto presente in CH.
  - es: Audioprotesisti / centri acustici, Sanitarie e ortopedia (plantari, tutori), Negozi di ottica con laboratorio e controlli vista, Forniture per mobilita e ausili anziani
- **Riparazione & assistenza tecnica al banco (non-IT)** — Officine di riparazione elettrodomestici, bici, telefoni, elettronica: microimprese diffuse che lavorano per ticket-riparazione con preventivo, pezzi di ricambio e ritiro. Diverso sia da officina auto sia da IT/MSP gia coperti. Flusso accettazione-> diagnosi-> preventivo-> riparazione-> consegna con avviso cliente.
  - es: Riparazione smartphone / tablet / PC al banco, Riparazione e service biciclette/e-bike, Riparazione elettrodomestici e piccola elettronica, Riparazione e service strumenti musicali
- **Mobilita dolce, parcheggi & stazioni di servizio** — Nicchie locali con ricavi ricorrenti poco coperte: gestione abbonamenti, posti, turni e piccola cassa. In Ticino i posteggi privati, le stazioni di servizio con shop e officine mobili sono diffusi. Il bisogno e abbonamenti/posti + cassa + turni, non appuntamenti.
  - es: Autorimesse e posteggi in abbonamento, Stazioni di servizio / distributori con shop, Stazioni di ricarica e gestione colonnine EV, Soccorso stradale / carro attrezzi (reperibilita)
- **Pulizie tecniche specializzate (oltre le pulizie civili)** — Le imprese di pulizia civile sono coperte, ma il segmento tecnico ad alta marginalita no: e un mercato CH redditizio con interventi su commessa, ricorrenze e rapportini. Spesso B2B con contratti ricorrenti, vicino a man/interventi/ricorrenze gia previsti ma con esigenze proprie (canna fumaria a norma, fossa biologica, scadenze).
  - es: Spazzacamini / pulizia canne fumarie (controllo a norma CH), Autospurghi e pulizia fosse/condotte, Pulizia vetrate e facciate in quota, Sanificazione, bonifiche e disinfezione ambienti
- **Coworking, self-storage & spazi a noleggio** — Modello a forte crescita nelle citta svizzere: il core e la prenotazione di uno spazio/box per fascia oraria o mese, con abbonamenti e accessi. Non e ne ricezione alberghiera ne eventi: serve un modulo spazi/risorse prenotabili a calendario con contratti ricorrenti. Margini ricorrenti e gestione semplice.
  - es: Spazi coworking e uffici flessibili, Self-storage / box e magazzini in affitto, Sale riunioni / sale prove / studi a ore, Garage e cantine in locazione mensile
- **Sicurezza, vigilanza & servizi alla persona** — Settore regolato e in crescita in Svizzera con forte componente di pianificazione turni, reperibilita e rapportini di servizio. Vicino a turni/interventi gia previsti ma con esigenze di pattuglie, postazioni e registro presenze sui siti cliente. Contratti B2B ricorrenti e buona disponibilita a pagare.
  - es: Istituti di vigilanza e guardie giurate, Servizi steward / sicurezza eventi, Portierato e reception in appalto, Investigazioni private e controllo accessi
