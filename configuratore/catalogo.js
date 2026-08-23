/* ============================================================
   CATALOGO — dati del configuratore (settori + moduli)
   Modifica QUI per cambiare l'offerta.
   stato: 'pronto'  = modulo già costruito e funzionante → MOSTRATO nel configuratore
          'arrivo'  = ancora da costruire → NASCOSTO dal configuratore (coda di lavoro).
                      Chi lo desidera lo descrive nella card "modulo su misura".
   Man mano che costruiamo un modulo, basta mettere stato:'pronto' e ricompare da solo.
   ============================================================ */

/* --- MODULI BASE: ci sono SEMPRE in ogni app (non disattivabili) --- */
const MODULI_BASE = [
  { id:'hub',     ic:'⚡',  nome:'Hub',         desc:'La schermata iniziale: tutto a colpo d’occhio.', stato:'pronto' },
  { id:'cal',     ic:'📅',  nome:'Calendario',  desc:'Appuntamenti, scadenze e promemoria.',           stato:'pronto' },
  { id:'notes',   ic:'📝',  nome:'Note',        desc:'Appunti e liste condivise col team.',             stato:'pronto' },
  { id:'clients', ic:'👥',  nome:'Clienti',     desc:'Anagrafica clienti sempre a portata di mano.',    stato:'pronto' },
  { id:'emps',    ic:'👷',  nome:'Dipendenti',  desc:'Il tuo team, ruoli e permessi.',                  stato:'pronto' },
];

/* --- MODULI GENERALI: opzionali, l'azienda li sceglie tutti liberamente --- */
const MODULI_EXTRA = [
  /* già pronti (ereditati dal gestionale esistente) */
  { id:'conti',    ic:'💰',  nome:'Conti',                desc:'Entrate, spese e utile sotto controllo.',  stato:'pronto' },
  { id:'man',      ic:'🔧',  nome:'Manutenzioni',         desc:'Interventi, assistenza e storico.',        stato:'pronto' },
  { id:'sites',    ic:'🏗',  nome:'Cantieri / Commesse',  desc:'Lavori in corso, ore e avanzamento.',      stato:'pronto' },
  { id:'reports',  ic:'📸',  nome:'Rapportini',           desc:'Rapporti di cantiere giornalieri con ore, materiali e foto.', stato:'pronto' },
  { id:'macchine', ic:'⚙️',  nome:'Macchine / Impianti',  desc:'Parco macchine, schede e assistenza.',     stato:'pronto', custom:'ptek' },  /* su misura per ptek: NON proposto agli altri */
  { id:'pellet',   ic:'🪵',  nome:'Consegne prodotto',    desc:'Consegne, bolle e scorte.',                stato:'pronto' },
  { id:'zone',     ic:'🗺️',  nome:'Zone & Mappa',         desc:'Zone di consegna e clienti sulla mappa.',  stato:'pronto' },
  { id:'lavagna',  ic:'📋',  nome:'Lavagna',              desc:'Dashboard componibile: post-it e widget dei tuoi moduli su tela libera.', stato:'pronto' },
  /* in arrivo (visibili nel catalogo, si costruiscono man mano) */
  { id:'prenota',  ic:'🗓️',  nome:'Prenotazioni',         desc:'Appuntamenti e prenotazioni online.',      stato:'arrivo' },
  { id:'magazzino',ic:'📦',  nome:'Magazzino',            desc:'Scorte, carico/scarico e soglie.',         stato:'arrivo' },
  { id:'catalogo', ic:'🏷️',  nome:'Catalogo / Listino',   desc:'Prodotti, prezzi e disponibilità.',        stato:'arrivo' },
  { id:'documenti',ic:'📁',  nome:'Documenti',            desc:'Archivio file, contratti e schede.',       stato:'arrivo' },
  { id:'report',   ic:'📊',  nome:'Report & Statistiche', desc:'Andamento attività in numeri e grafici.',  stato:'arrivo' },
  { id:'fidelity', ic:'🎁',  nome:'Fidelity & Promo',     desc:'Punti, tessere e promozioni clienti.',     stato:'arrivo' },
  { id:'turni',    ic:'⏱️',  nome:'Turni & Presenze',     desc:'Turni del personale e timbrature.',        stato:'arrivo' },
];

/* --- SETTORI ---
   "proposti" = id dei moduli evidenziati come consigliati per quel settore
   (sono solo suggerimenti: l'azienda può aggiungere tutti gli altri). */
const SETTORI = [
  { id:'impianti', ic:'🔥', nome:'Impianti & Energia',
    desc:'Caldaie, riscaldamento, fotovoltaico, assistenza tecnica.',
    proposti:['man','sites','pellet','zone','conti'] },

  { id:'edilizia', ic:'🧱', nome:'Edilizia & Cantieri',
    desc:'Imprese edili, ristrutturazioni, artigiani del costruire.',
    proposti:['sites','man','documenti','conti'] },

  { id:'ristorazione', ic:'🍽️', nome:'Ristorazione',
    desc:'Ristoranti, bar, pizzerie, catering.',
    proposti:['prenota','magazzino','fidelity','conti'] },

  { id:'retail', ic:'🛍️', nome:'Negozi / Retail',
    desc:'Negozi, e-commerce, punti vendita.',
    proposti:['catalogo','magazzino','fidelity','conti'] },

  { id:'beauty', ic:'💈', nome:'Servizi & Beauty',
    desc:'Parrucchieri, estetica, studi e servizi su appuntamento.',
    proposti:['prenota','fidelity','conti'] },

  { id:'altro', ic:'🧩', nome:'Altro / Su misura',
    desc:'Non trovi il tuo settore? Parti da una base e scegli tu.',
    proposti:['conti'] },
];

/* --- CONTATTO: dove arriva la configurazione finita --- */
const CONTATTO = {
  email:    'lollyberry00@gmail.com',
  whatsapp: '',   /* numero internazionale senza +, es. '393331234567' — vuoto = pulsante nascosto */
};
