/* Modula landing: real demo, product exploration and commercial model. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = () => reducedMotion.matches ? 'auto' : 'smooth';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const modules = [
    {id:'hub', icon:'⚡', name:'Hub', base:true, intro:'La visione della giornata, con un campo di testo per aggiungere e organizzare attività.', items:['Appuntamenti di oggi, prossimi eventi e attività in ritardo.','Inserimento in linguaggio naturale con riconoscimento di date e clienti.','Liste spuntabili per cose da ricordare e preparare.']},
    {id:'cal', icon:'📅', name:'Calendario', base:true, intro:'Una sola agenda per appuntamenti e scadenze delle attività collegate.', items:['Viste mese, settimana, giorno e agenda.','Eventi associati a clienti e persone del team.','Scadenze provenienti dai moduli attivi.']},
    {id:'notes', icon:'📝', name:'Note', base:true, intro:'Informazioni che rimangono a disposizione delle persone coinvolte.', items:['Note collegate a un cliente, a una data e a persone.','Gruppi per organizzare gli appunti e note fissate.','Archivio e liste per ritrovare quello che serve.']},
    {id:'clients', icon:'👥', name:'Clienti', base:true, intro:'Un punto di riferimento per contatti, informazioni e storia del rapporto.', items:['Ricerca di clienti e aziende, contatti e indirizzi.','Note e appuntamenti nella scheda cliente.','Storico arricchito dalle attività dei moduli extra.']},
    {id:'emps', icon:'👷', name:'Personale', base:true, intro:'Le persone della tua attività, con accessi e registrazione del tempo di lavoro.', items:['Ruoli e permessi per decidere cosa vede ciascuno.','Orari, ore lavorate, ferie e assenze.','Riepiloghi mensili, annuali e stampe.']},
    {id:'man', icon:'🔧', name:'Manutenzioni', intro:'Programmi gli interventi e ne conservi la documentazione.', items:['Cliente, tecnico, data e stato dell’intervento.','Bollettino di lavoro e firma del cliente.','Storico e interventi ricorrenti.']},
    {id:'surveys', icon:'🔍', name:'Sopralluoghi', intro:'Dalla prima visita al prossimo passo commerciale.', items:['Foto, misure, note e valore del lavoro.','Stato della trattativa e prossimo passo.','Conversione in cantiere con il modulo Cantieri attivo.']},
    {id:'sites', icon:'🏗', name:'Cantieri', intro:'Lavori e commesse organizzati per cliente e squadra.', items:['Scadenze, persone assegnate e stato del lavoro.','Ore, note e informazioni della commessa.','Collegamento con sopralluoghi e rapportini.']},
    {id:'reports', icon:'📸', name:'Rapportini', intro:'Il lavoro svolto sul campo, registrato mentre le informazioni sono fresche.', items:['Ore per persona, materiali e lavoro svolto.','Foto scattate sul posto e collegate al rapporto.','Riepilogo dei rapporti mancanti nella giornata.']},
    {id:'fatture', icon:'🧾', name:'Fatture', intro:'Prepari i documenti di vendita partendo anche dai lavori da fatturare.', items:['Righe, IVA, totali e lavori raggruppati per cliente.','Stampa e salvataggio PDF tramite browser.','QR-fattura svizzera con dati di fatturazione configurati.']},
    {id:'conti', icon:'💰', name:'Conti', intro:'Una vista operativa su entrate e spese della tua attività.', items:['Riepiloghi mensili e annuali.','Categorie di spesa e spese ricorrenti.','Lavori chiusi e consegne nel riepilogo degli incassi.']},
    {id:'todo', icon:'✅', name:'Da fare', intro:'Le attività da completare, anche quando non hanno ancora una data.', items:['Liste spuntabili e attività assegnate.','Scadenze collegate al calendario.','Lavoro da completare visibile al team.']},
    {id:'pellet', icon:'🪵', name:'Consegne', intro:'Organizzi e documenti le consegne dei prodotti.', items:['Cliente, quantità, prezzo e data prevista.','Stato della consegna e persona assegnata.','Firma del cliente sullo schermo.']},
    {id:'zone', icon:'🗺️', name:'Zone e mappa', intro:'Una lettura geografica dei clienti e delle zone di lavoro.', items:['Clienti visualizzati sulla mappa.','Zone, filtri territoriali e punti utili.','Indirizzi e collegamenti per la navigazione.']},
    {id:'lavagna', icon:'📋', name:'Lavagna', intro:'Componi una vista di lavoro con quello che vuoi avere sott’occhio.', items:['Post-it e widget su una superficie componibile.','Informazioni dei moduli attivi.','Posizione e organizzazione personalizzabili.']},
    {id:'documenti', icon:'📁', name:'Documenti', intro:'Un archivio ordinato, collegato alle informazioni dei clienti.', items:['Caricamento e ricerca dei documenti.','Organizzazione per categorie.','Collegamenti a clienti e scadenze.']},
    {id:'contratti', icon:'📄', name:'Contratti', intro:'Dai modelli ai documenti firmati, con le date sotto controllo.', items:['Modelli compilabili con i dati del cliente.','Firma sullo schermo e importazione di PDF.','Scadenze collegate al calendario.']}
  ];

  function initMenu() {
    const toggle = $('.menu-toggle'), links = $('#nav-links');
    const close = () => {toggle.setAttribute('aria-expanded','false');links.classList.remove('open');};
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('open', open);
    });
    $$('a', links).forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {if(event.key === 'Escape') close();});
  }

  function initDemo() {
    const monitor = $('#monitor'), viewport = $('.monitor-viewport'), frame = $('#live-demo');
    const tabs = $$('[data-demo-view]');
    let current = 'hub';
    const resize = () => viewport.style.setProperty('--demo-scale', String(viewport.clientWidth / 1440));
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(viewport);
    else addEventListener('resize', resize, {passive:true});
    frame.addEventListener('load', () => monitor.classList.add('ready'));
    // DOMContentLoaded may run after a cached same-origin frame completed loading.
    try {if(frame.contentDocument?.readyState === 'complete' && frame.contentDocument.querySelector('#app')) monitor.classList.add('ready');} catch (_) {}
    tabs.forEach(tab => tab.addEventListener('click', () => {
      current = tab.dataset.demoView;
      frame.src = '../app.html?demo=1&screen=' + current;
      tabs.forEach(button => {
        const active = button === tab;
        button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
      });
    }));
    const dialog = $('#demo-dialog'), host = $('#expanded-demo-host');
    $('#demo-expand').addEventListener('click', () => {
      const expanded = document.createElement('iframe');
      expanded.title = 'Modula — demo interattiva dei moduli base';
      expanded.src = '../app.html?demo=1&screen=' + current;
      host.replaceChildren(expanded);
      dialog.showModal();document.body.classList.add('modal-open');
    });
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {host.replaceChildren();document.body.classList.remove('modal-open');});
    dialog.addEventListener('click', event => {if(event.target === dialog) dialog.close();});
  }

  function initImages() {
    const dialog = $('#image-dialog'), image = $('#dialog-image'), caption = $('#dialog-caption');
    $$('[data-image]').forEach(button => button.addEventListener('click', () => {
      image.src = button.dataset.image;
      const thumbnail = button.querySelector('img');
      image.alt = window.ModulaI18n?.sourceAttribute(thumbnail,'alt') ?? thumbnail.alt;
      caption.textContent = window.ModulaI18n?.sourceAttribute(button,'data-caption') ?? button.dataset.caption;
      dialog.showModal();document.body.classList.add('modal-open');
    }));
    $('.dialog-close',dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('click', event => {if(event.target === dialog) dialog.close();});
  }

  function swap(element) {
    element.classList.remove('swap-in');
    void element.offsetWidth;
    element.classList.add('swap-in');
  }

  function initModules() {
    const makeButton = module => '<button class="module-button" type="button" data-module="'+module.id+'" aria-pressed="false" aria-controls="module-detail"><span aria-hidden="true">'+module.icon+'</span><span>'+escape(module.name)+'</span></button>';
    $('#base-modules').innerHTML = modules.filter(module => module.base).map(makeButton).join('');
    $('#extra-modules').innerHTML = modules.filter(module => !module.base).map(makeButton).join('');
    const detail = $('#module-detail'), buttons = $$('[data-module]');
    function show(id) {
      const module = modules.find(item => item.id === id);
      if(!module) return;
      detail.innerHTML = '<div class="module-detail-top"><span class="module-detail-icon" aria-hidden="true">'+module.icon+'</span><span class="module-detail-tag">'+(module.base?'Incluso nella base':'Extra · CHF 10/mese')+'</span></div><h3>'+escape(module.name)+'</h3><p>'+escape(module.intro)+'</p><ul>'+module.items.map(item=>'<li>'+escape(item)+'</li>').join('')+'</ul>';
      buttons.forEach(button => {const on=button.dataset.module===id;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on));});
      swap(detail);
    }
    buttons.forEach(button => button.addEventListener('click', event => {
      show(button.dataset.module);
      if(innerWidth < 801 && event.detail > 0) detail.scrollIntoView({behavior:motion(),block:'center'});
    }));
    show('hub');
  }

  function initComparison() {
    const panel = $('#compare-panel'), tabs = $$('[data-compare]');
    const content = {
      fit:{beforeTitle:'Quando scegli un pacchetto standard',before:'La domanda da farti è: quali funzioni userò davvero e quanto sarà possibile adattarle al mio lavoro?',afterTitle:'Con Modula componi le funzioni',after:'Cinque moduli di base e dodici extra già disponibili. Scegli quelli utili alla tua attività e puoi richiedere gli altri quando servono.'},
      team:{beforeTitle:'Quando lavori con strumenti separati',before:'Clienti, agenda e appunti possono finire in posti diversi. Passare le informazioni da una persona all’altra diventa parte del lavoro.',afterTitle:'Con Modula le informazioni sono collegate',after:'Un cliente può avere appuntamenti, note e attività nella stessa app. Con l’account online, i dati si sincronizzano fra le persone del team.'},
      choice:{beforeTitle:'Quando valuti un nuovo software',before:'Oltre al prezzo iniziale, considera cosa succede quando aggiungi funzioni e quali diritti mantieni nel tempo.',afterTitle:'Con Modula sai quali formule scegliere',after:'Abbonamento da CHF 59 con tetto a CHF 129 per tutti i moduli, oppure diritto d’uso permanente della versione acquistata con licenza perpetua.'}
    };
    function select(tab, focus = false) {
      const data=content[tab.dataset.compare];
      tabs.forEach(button => {const on=button===tab;button.setAttribute('aria-selected',String(on));button.tabIndex=on?0:-1;});
      panel.setAttribute('aria-labelledby',tab.id);
      panel.innerHTML='<div><h4>'+data.beforeTitle+'</h4><p>'+data.before+'</p></div><div class="with-modula"><h4>'+data.afterTitle+'</h4><p>'+data.after+'</p></div>';
      swap(panel);if(focus)tab.focus();
    }
    tabs.forEach((tab,index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if(event.key==='ArrowRight')next=(index+1)%tabs.length;
        if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
        if(event.key==='Home')next=0;
        if(event.key==='End')next=tabs.length-1;
        if(next!==undefined){event.preventDefault();select(tabs[next],true);}
      });
    });
    select(tabs[0]);
  }

  function initPricing() {
    const range=$('#module-range'), price=$('#subscription-price'), count=$('#module-count'), description=$('#subscription-description');
    function update() {
      const extras=Number(range.value), all=extras>=7;
      price.textContent=String(Math.min(59+extras*10,129));
      count.textContent=all?extras+' · tutti inclusi':String(extras);
      description.textContent=all?'Hai accesso a tutti i moduli, anche oltre quelli selezionati.':extras===0?'L’app con i cinque moduli base.':'Cinque moduli base + '+extras+' '+(extras===1?'modulo extra.':'moduli extra.');
      $('.subscription-card').classList.toggle('at-cap',all);
      range.setAttribute('aria-valuetext',extras+' moduli extra, CHF '+price.textContent+' al mese'+(all?', tutti i moduli inclusi':''));
    }
    range.addEventListener('input',update);update();
    const variants=$$('[data-license]');
    variants.forEach(button=>button.addEventListener('click',()=>{
      const setup=button.dataset.license==='setup';
      $('#license-price').textContent=setup?'7’000':'6’000';
      $('#license-description').textContent=setup?'La stessa licenza, con installazione, configurazione e avvio seguiti da Modula.':'Consegna della versione acquistata per installazione e gestione autonome.';
      variants.forEach(item=>{const on=item===button;item.classList.toggle('active',on);item.setAttribute('aria-pressed',String(on));});
    }));
  }

  function initNews() {
    const news=[
      {label:'Dal sopralluogo al lavoro',title:'Il prossimo passo è già collegato.',text:'Trasforma un sopralluogo in cantiere, portando con te cliente, valore, squadra e note.',modules:'Sopralluoghi + Cantieri'},
      {label:'Il lavoro sul campo',title:'Ore, materiali e foto. Sul posto.',text:'Con i rapportini registri la giornata e colleghi le informazioni al cantiere.',modules:'Rapportini + Cantieri'},
      {label:'Documenti di vendita',title:'Dai lavori alla fattura.',text:'Raggruppa i lavori da fatturare per cliente e prepara righe, IVA, totali e QR-fattura.',modules:'Fatture'},
      {label:'Organizzazione quotidiana',title:'La tua vista di lavoro.',text:'Con la Lavagna disponi post-it e widget delle funzioni attive come preferisci.',modules:'Lavagna'},
      {label:'Relazioni con i clienti',title:'Contratti con una storia.',text:'Modelli, firma sullo schermo e scadenze: i contratti rimangono collegati ai clienti.',modules:'Contratti'},
      {label:'Sul territorio',title:'Una mappa del tuo lavoro.',text:'Visualizza i clienti, organizza le zone e ritrova i punti che usi per l’attività.',modules:'Zone e mappa'}
    ];
    const track=$('#news-track');
    track.innerHTML=news.map(item=>'<article class="news-card"><span>'+item.label+'</span><h3>'+item.title+'</h3><p>'+item.text+'</p><small>'+item.modules+'</small></article>').join('');
    $$('[data-news-dir]').forEach(button=>button.addEventListener('click',()=>track.scrollBy({left:Number(button.dataset.newsDir)*(track.firstElementChild.getBoundingClientRect().width+18),behavior:motion()})));
    track.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();track.scrollBy({left:(event.key==='ArrowRight'?1:-1)*340,behavior:motion()});}
    });
  }

  function initMotion() {
    const monitor=$('#monitor'), showcase=$('.product-showcase'), figures=$$('.product-figure');
    let queued=false;
    const update=()=>{
      queued=false;
      if(reducedMotion.matches)return;
      const rect=showcase.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/innerHeight));
      monitor.style.setProperty('--monitor-angle',String(5*(1-progress))+'deg');
      if(innerWidth>900)figures.forEach(figure=>{
        const box=figure.getBoundingClientRect();
        if(box.top<innerHeight+100&&box.bottom>-100)figure.style.setProperty('--figure-shift',String(Math.max(-9,Math.min(9,(box.top-innerHeight*.45)*.018)))+'px');
      });
    };
    const request=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
    addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
    reducedMotion.addEventListener('change',request);update();
  }

  initMenu();initDemo();initImages();initModules();initComparison();initPricing();initNews();initMotion();
})();
