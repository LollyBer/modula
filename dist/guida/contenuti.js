/* ============================================================
   GUIDA — CONTENUTI (testo dei capitoli, una fonte per tutti)
   ------------------------------------------------------------
   Scritto per il CLIENTE FINALE: semplice, senza gergo.
   - INTRO: sezioni universali (accesso, installazione, muoversi, notifiche)
   - MODMETA: nome+icona di OGNI modulo (anche quelli senza guida ancora)
   - GUIDE:  il capitolo di ogni modulo (man mano li scriviamo tutti)

   Struttura di un capitolo:
     { occhiello, aCosaServe, illus, schermata:[{n,label,desc}],
       passi:[{t,d}], trucchi:[...] }
   `illus` = nome di una funzione in illustrazioni.js (ILLUS).
   ============================================================ */

/* nome + icona di tutti i moduli (per titoli/indice, anche senza capitolo) */
const MODMETA = {
  hub:      { ic:'⚡',  nome:'Hub' },
  cal:      { ic:'📅',  nome:'Calendario' },
  notes:    { ic:'📝',  nome:'Note' },
  clients:  { ic:'👥',  nome:'Clienti' },
  emps:     { ic:'👷',  nome:'Personale' },
  notif:    { ic:'🔔',  nome:'Notifiche' },
  conti:    { ic:'💰',  nome:'Conti' },
  man:      { ic:'🔧',  nome:'Manutenzioni' },
  sites:    { ic:'🏗',  nome:'Cantieri' },
  macchine: { ic:'⚙️',  nome:'Macchine' },
  pellet:   { ic:'🪵',  nome:'Consegne' },
  zone:     { ic:'🗺️',  nome:'Zone & Mappa' },
};

/* --- INTRO: vale per ogni cliente, sempre in testa al manuale --- */
const GUIDE_INTRO = {
  titolo: 'Benvenuto',
  sezioni: [
    {
      h: 'Come entri la prima volta',
      illus: 'introAccesso',
      testo: 'La prima volta usi il <b>codice invito</b> che ti abbiamo dato. Serve una volta sola: collega il tuo account all’azienda.',
      passi: [
        { t: 'Apri il link dell’app', d: 'Lo trovi nel messaggio di benvenuto. Si apre la schermata “Modula”.' },
        { t: 'Incolla il codice invito', d: 'Il codice che ti abbiamo mandato (es. NOME-A1B2C).' },
        { t: 'Scegli la tua password', d: 'Una password tua, che ricorderai. Da qui in poi entri con email + password.' },
      ],
    },
    {
      h: 'Come entri ogni giorno',
      testo: 'Da dopo la prima volta entri con <b>email e password</b>. Se dimentichi la password, tocca <b>“Password dimenticata?”</b> nella schermata di accesso: ti arriva una mail per sceglierne una nuova.',
    },
    {
      h: 'Metti l’app sul telefono',
      illus: 'introInstalla',
      testo: 'Modula si installa come un’app normale, senza App Store. Avrai l’icona sulla Home.',
      passi: [
        { t: 'Su iPhone (Safari)', d: 'Tocca il tasto Condividi ⬆️ → “Aggiungi a Home”.' },
        { t: 'Su Android (Chrome)', d: 'Tocca il menu ⋮ → “Installa app” / “Aggiungi a schermata Home”.' },
      ],
    },
    {
      h: 'Muoverti nell’app',
      illus: 'introMenu',
      testo: 'In basso (o a lato sul computer) c’è la <b>barra dei moduli</b>: tocchi un’icona per cambiare sezione. Il tasto <b>☰ Menu</b> apre le impostazioni, il profilo e “Cambia password”.',
      schermata: [
        { n: 1, label: 'Barra dei moduli', desc: 'Le sezioni attive per la tua azienda. Cambia toccando un’icona.' },
        { n: 2, label: 'Menu ☰', desc: 'Profilo, tema chiaro/scuro, notifiche, esci.' },
      ],
    },
    {
      h: 'Le notifiche',
      testo: 'Nel modulo <b>🔔 Notifiche</b> (o dal Menu) puoi attivare gli avvisi sul telefono. Il telefono ti chiederà il permesso una volta: tocca “Consenti”. Così ricevi un avviso quando succede qualcosa che ti riguarda.',
    },
  ],
};

/* --- I CAPITOLI DEI MODULI --- */
const GUIDE = {

  clients: {
    occhiello: 'La tua rubrica di lavoro, sempre in tasca.',
    aCosaServe: 'Tieni tutti i clienti in un posto solo: nome, telefono, indirizzo, note. Cerchi in un secondo, chiami con un tocco, e da qui vedi anche i lavori collegati a ogni cliente.',
    illus: 'clientiHero',
    schermata: [
      { n: 1, label: 'Cerca', desc: 'Scrivi nome, paese, telefono o via: la lista si filtra mentre scrivi.' },
      { n: 2, label: 'Filtri', desc: 'Restringi per paese, gruppo o “fa manutenzione”.' },
      { n: 3, label: 'Scheda cliente', desc: 'Tocca un cliente per aprirlo: dati, storico e tasto chiama 📞.' },
      { n: 4, label: 'Pulsante +', desc: 'In basso a destra: aggiunge un nuovo cliente.' },
    ],
    passi: [
      { t: 'Aggiungere un cliente', d: 'Tocca il pulsante ➕ in basso a destra, compila nome e i dati che hai (telefono, indirizzo), poi Salva.', illus: 'clientiNuovo' },
      { t: 'Trovare un cliente', d: 'Usa la barra 🔍 in alto: basta una parte del nome o il paese.' },
      { t: 'Chiamare al volo', d: 'Nella riga del cliente tocca l’icona 📞: parte la chiamata senza uscire dall’app.' },
      { t: 'Modificare o correggere', d: 'Apri il cliente → “Modifica”, cambia quello che serve, Salva.' },
    ],
    trucchi: [
      'Metti sempre il <b>paese</b>: l’app raggruppa i clienti per zona da sola.',
      'Il campo <b>gruppo</b> è libero: usalo come vuoi (es. “Privati”, “Aziende”, “VIP”) per filtrare.',
    ],
  },

  cal: {
    occhiello: 'Appuntamenti e scadenze, a colpo d’occhio.',
    aCosaServe: 'Segna appuntamenti, scadenze e promemoria su un calendario condiviso con il team. Chi ha i permessi vede gli impegni e non dimentica più una data.',
    illus: 'calendarioHero',
    schermata: [
      { n: 1, label: 'Il giorno con impegni', desc: 'I giorni che hanno qualcosa sono evidenziati col colore dell’azienda.' },
      { n: 2, label: 'Elenco del giorno', desc: 'Sotto il calendario vedi la lista degli appuntamenti del giorno scelto.' },
      { n: 3, label: 'Pulsante +', desc: 'Aggiunge un nuovo appuntamento.' },
    ],
    passi: [
      { t: 'Aggiungere un appuntamento', d: 'Tocca ➕, scegli giorno e ora, scrivi cosa e (se vuoi) collega un cliente, poi Salva.' },
      { t: 'Vedere un altro giorno', d: 'Tocca il giorno sul calendario: sotto appare la sua lista.' },
      { t: 'Modificare o spostare', d: 'Apri l’appuntamento dalla lista, cambia data/ora o testo, Salva.' },
    ],
    trucchi: [
      'Collega l’appuntamento a un <b>cliente</b>: lo ritrovi anche dalla sua scheda.',
      'Attiva le <b>🔔 notifiche</b> per farti avvisare prima dell’impegno.',
    ],
  },

};

if (typeof module !== 'undefined') module.exports = { MODMETA, GUIDE_INTRO, GUIDE };
