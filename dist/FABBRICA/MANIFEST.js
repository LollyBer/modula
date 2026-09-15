/* ============================================================
   FABBRICA — MANIFEST: mappa autorevole "modulo → file"
   ------------------------------------------------------------
   È la fonte di verità per assemblare l'app di un cliente dal
   template. La legge sia Claude (per eseguire la RICETTA) sia,
   in futuro, uno script generatore (opzione B).

   Per ogni modulo: quali .js / .css caricare, il nome della
   funzione render (per il dispatcher) e la voce di menù (VIEWS).
   Aggiornare QUI quando si aggiunge/sposta un modulo o un file.
   ============================================================ */

const FABBRICA_MANIFEST = {

  /* --- File SEMPRE inclusi: core + shell PWA (mai rimuovere) --- */
  core: {
    files: [
      'app.html',
      'core/core.js', 'core/core.css',
      'manifest.json', 'sw.js', 'version.json',
      'icon-192.png', 'icon-512.png',
    ],
    cdn: ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'], // già in <head> di app.html
  },

  /* --- Moduli BASE: presenti in OGNI app (non disattivabili) --- */
  base: {
    hub:     { js:['modules-base/hub/hub.js'],         css:[], render:'renderHub',     view:{ic:'⚡',  label:'Hub'} },
    cal:     { js:['modules-base/cal/cal.js'],         css:[], render:'renderCal',     view:{ic:'📅', label:'Calendario'} },
    notes:   { js:['modules-base/notes/notes.js'],     css:[], render:'renderNotes',   view:{ic:'📝', label:'Note'} },
    notif:   { js:['modules-base/notif/notif.js'],     css:[], render:'renderNotif',   view:{ic:'🔔', label:'Notifiche'}, always:true }, // NON è nel catalogo: c'è sempre
    clients: { js:['modules-base/clients/clients.js'], css:[], render:'renderClients', view:{ic:'👥', label:'Clienti'} },
    emps:    { js:['modules-base/emps/emps.js'],       css:[], render:'renderEmps',    view:{ic:'👷', label:'Personale'} },
  },

  /* --- Moduli EXTRA PRONTI: assemblabili (stato:'pronto' nel catalogo) --- */
  extra: {
    conti:    { js:['modules-extra/conti/conti.js'], css:[], render:'renderConti',  view:{ic:'💰', label:'Conti'} },
    man:      { js:['modules-extra/man/man.js'],     css:[], render:'renderMan',    view:{ic:'🔧', label:'Manut.'} },
    sites:    { js:['modules-extra/sites/sites.js'], css:[], render:'renderSites',  view:{ic:'🏗', label:'Cantieri'} },
    pellet:   { js:['modules-extra/pellet/pellet.js'], css:[], render:'renderPellet', view:{ic:'🪵', label:'Pellet'} },
    /* SPECIALE: file in ROOT (non in modules-extra/) */
    macchine: { js:['macchine.js'], css:['macchine.css'], render:'renderMacchine', view:{ic:'⚙️', label:'Macchine'}, root:true },
    /* SPECIALE: file in ROOT + dipende da Leaflet (mappa). Ordine js: leaflet → dati → modulo */
    zone:     { js:['vendor/leaflet.js','zone-data.js','zone.js'], css:['vendor/leaflet.css','zone.css'], render:'renderZone', view:{ic:'🗺️', label:'Zone'}, root:true, deps:'leaflet' },
  },

  /* --- Moduli "in arrivo": nel catalogo ma SENZA file → NON assemblabili oggi.
         Se un cliente li sceglie: NON includerli, segnarli come "promessi" in CONSEGNA.md. --- */
  inArrivo: ['prenota','magazzino','catalogo','fatture','documenti','report','fidelity','turni'],

  /* --- Ordine canonico delle voci di menù (VIEWS in core.js).
         Quando si pota VIEWS, tenere SOLO i moduli scelti ma in QUEST'ordine. --- */
  viewOrder: ['hub','cal','notes','notif','man','pellet','sites','macchine','clients','zone','conti','emps'],

  /* --- Punti di iniezione nel template (ancore per le edit) --- */
  inject: {
    brand:      { file:'core/core.js', anchor:'const BRAND={',            campi:['name','tagline','logo'] },
    accento:    { come:'override della CSS var --cy', dove:'<style> nel <head> di app.html DOPO il link a core.css', default:'#5BA02C' },
    supabase:   { file:'core/core.js', placeholder:['__SUPABASE_URL__','__SUPABASE_ANON_KEY__'] },
    vapid:      { file:'core/core.js', placeholder:['__VAPID_PUBLIC_KEY__'] },
    views:      { file:'core/core.js', anchor:'const VIEWS=[' },
    dispatcher: { file:'core/core.js', anchor:'const R={hub:window.renderHub' },
    scriptTags: { file:'app.html',     anchor:'<!-- moduli BASE' },
    cssLinks:   { file:'app.html',     anchor:'MODULI EXTRA (stili)' },
  },
};

if (typeof module !== 'undefined') module.exports = FABBRICA_MANIFEST;
