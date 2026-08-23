/* ============================================================================
   LANDING · interattività — esploratore moduli, price builder, personalizzazione
   Nessuna dipendenza. Si auto-inizializza a DOMContentLoaded.
   ============================================================================ */
(function(){
'use strict';
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const chf = n => 'CHF ' + Math.round(n).toLocaleString('de-CH');

/* ---- DATI MODULI: prezzo (0=base incluso, -1=in arrivo) + funzioni specifiche ---- */
const MODS = [
  {id:'hub', ic:'⚡', nm:'Hub', px:0, pitch:'Il cervello dell’app: scrivi come parli e lui smista da solo.',
   f:['Scrivi «appuntamento da Rossi domani alle 16» → l’app crea l’evento','Riconosce clienti, date, importi e tecnici dal testo','Oggi, settimana e «da fare» a colpo d’occhio','Incassi e scadenze sempre in evidenza']},
  {id:'cal', ic:'📅', nm:'Calendario', px:0, pitch:'Tutta l’attività in un’unica agenda condivisa.',
   f:['Appuntamenti, scadenze e promemoria insieme','Vista giorno · settimana · mese','Eventi colorati per tipo','Promemoria automatici prima della scadenza']},
  {id:'notes', ic:'📝', nm:'Note & Liste', px:0, pitch:'Appunti e liste che il team vede in tempo reale.',
   f:['Note condivise con tutta la squadra','Fissa in alto quelle importanti','Collega una nota a un cliente','Liste con spunte (ferramenta, spesa, to-do)']},
  {id:'clients', ic:'👥', nm:'Clienti', px:0, pitch:'L’anagrafica sempre in tasca, ovunque sei.',
   f:['Contatti, indirizzo, impianti e note in una scheda','Storico interventi per ogni cliente','Ricerca istantanea mentre scrivi','Indirizzo cliccabile per la navigazione']},
  {id:'emps', ic:'👷', nm:'Personale', px:0, pitch:'Il team con ruoli e permessi: decidi tu chi vede cosa.',
   f:['Ogni persona vede solo ciò che le serve','Carico di lavoro per dipendente','Accesso con codice invito monouso','Attivi/disattivi un accesso in un tocco']},

  {id:'conti', ic:'💰', nm:'Conti', px:12, pitch:'Entrate, spese e utile sempre sotto controllo.',
   f:['Incassi e spese aggiornati in tempo reale','Categorie e spese ricorrenti','Utile del mese a colpo d’occhio','Export pulito per il commercialista']},
  {id:'man', ic:'🔧', nm:'Manutenzioni', px:19, pitch:'Interventi, assistenza e storico, senza più foglietti.',
   f:['Programmi l’intervento e lo assegni al tecnico','Stato: da fare · in corso · fatta','Bollettino e firma del cliente sul telefono','Storico completo per cliente e per impianto']},
  {id:'macchine', ic:'⚙️', nm:'Macchine / Impianti', px:19, custom:true, pitch:'Il parco macchine con schede e scadenze.',
   f:['Scheda tecnica per ogni macchina','Scadenze di assistenza e revisione','Storico interventi per impianto','Collega la macchina al cliente']},
  {id:'pellet', ic:'🪵', nm:'Consegne', px:19, pitch:'Consegne, bolle e firma, dal telefono.',
   f:['Consegne programmate con quantità e prezzo','Firma del cliente direttamente sullo schermo','Stato: da consegnare · consegnato','Organizza i giri della giornata']},
  {id:'sites', ic:'🏗', nm:'Cantieri / Commesse', px:29, pitch:'Lavori in corso con ore, costi e avanzamento.',
   f:['Avanzamento del cantiere sempre aggiornato','Ore registrate per dipendente','Costi, materiali e foto sul posto','Scadenze e chiusura commessa con resoconto']},
  {id:'reports', ic:'📸', nm:'Rapportini', px:19, pitch:'Il rapporto giornaliero di cantiere, con foto, dal telefono.',
   f:['Ore, lavoro svolto e materiali per giornata','Foto del cantiere allegate al rapporto','Promemoria automatico a chi è in cantiere','Ore per commessa pronte per la fattura']},
  {id:'zone', ic:'🗺️', nm:'Zone & Mappa', px:29, pitch:'I tuoi clienti sulla mappa, i giri ottimizzati.',
   f:['Tutti i clienti visualizzati sulla mappa','Zone di consegna e di competenza','Raggruppa per area per organizzare i giri','Filtra per paese o quartiere']},
  {id:'lavagna', ic:'📋', nm:'Lavagna', px:12, pitch:'La tua dashboard componibile: la giornata a colpo d’occhio.',
   f:['Post-it e widget che sposti come vuoi','Vedi chi è dove e i cantieri aperti','Componi la tua vista su tela libera','Ogni modulo porta i suoi widget']},

  {id:'prenota', ic:'🗓️', nm:'Prenotazioni', px:-1, pitch:'Appuntamenti e prenotazioni online per i tuoi clienti.', f:['Il cliente prenota da solo online','Calendario sincronizzato col team','Conferme e promemoria automatici']},
  {id:'magazzino', ic:'📦', nm:'Magazzino', px:-1, pitch:'Scorte, carico/scarico e soglie minime.', f:['Carico e scarico in un tocco','Avviso quando un articolo sta finendo','Inventario sempre aggiornato']},
];

const MOD = id => MODS.find(m=>m.id===id);
const READY = MODS.filter(m=>m.px>=0 && !m.custom);
const EXTRA = MODS.filter(m=>m.px>0 && !m.custom);

/* ---- mini anteprima telefono per un modulo (mostra le sue funzioni come righe app) ---- */
function phoneFor(m){
  const rows = m.f.slice(0,4).map((t,i)=>`<div class="ph-card" style="animation:pop-in .4s ease ${i*0.07}s both"><span class="ci">${m.ic}</span><div><div class="ct">${escapeH(t.split('—')[0].split(':')[0].slice(0,30))}</div><div class="cs">${m.nm}</div></div></div>`).join('');
  return `<div class="phone" style="width:240px">
    <div class="notch"></div>
    <div class="ph-top"><span class="dot"></span><div><div class="nm">La tua app</div><div class="s">${escapeH(m.nm.toUpperCase())}</div></div></div>
    <div class="ph-body"><div class="ph-title"><span class="a"></span>${m.ic} ${escapeH(m.nm)}</div>${rows}</div>
  </div>`;
}
function escapeH(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

/* ============================ ESPLORATORE MODULI ============================ */
function initExplorer(){
  const list = $('#exp-list'), detail = $('#exp-detail');
  if(!list||!detail) return;
  const tagFor = m => m.px===0?'INCLUSO NELLA BASE':m.px>0?`MODULO · CHF ${m.px}/mese`:'IN ARRIVO';
  const pxChip = m => m.px===0?'<span class="ed-px base">incluso</span>':m.px>0?`<span class="ed-px">CHF ${m.px}/mese</span>`:'<span class="ed-px soon">in arrivo</span>';
  list.innerHTML = MODS.filter(m=>!m.custom).map((m,i)=>`<button class="exp-item ${i===0?'on':''}" data-id="${m.id}">
    <span class="ei-ic">${m.ic}</span>
    <div><div class="ei-nm">${escapeH(m.nm)}</div><div class="ei-tag">${tagFor(m)}</div></div>
    <span class="ei-px ${m.px===0?'base':''}">${m.px===0?'incluso':m.px>0?'CHF '+m.px:'⏳'}</span>
  </button>`).join('');
  function show(m){
    detail.classList.remove('show');
    void detail.offsetWidth;
    detail.innerHTML = `<div class="exp-info">
      <span class="ed-ic">${m.ic}</span>
      <div class="ed-nm">${escapeH(m.nm)} ${pxChip(m)}</div>
      <p class="ed-pitch">${escapeH(m.pitch)}</p>
      <div class="exp-funcs">${m.f.map((t,i)=>`<div class="exp-func" style="animation-delay:${i*0.06}s"><span class="efk">✓</span><span>${escapeH(t)}</span></div>`).join('')}</div>
    </div>
    <div class="exp-phone">${phoneFor(m)}</div>`;
    detail.classList.add('show');
    $$('#exp-list .exp-item').forEach(b=>b.classList.toggle('on', b.dataset.id===m.id));
  }
  list.addEventListener('click', e=>{const b=e.target.closest('.exp-item'); if(b) show(MOD(b.dataset.id));});
  show(MODS[0]);
}

/* ============================ PRICE BUILDER ============================ */
const BASE=59, TUTTO=190, INCL_USERS=4, WA_PX=39, DOM_PX=90;
let bldAnnual=false;
const bldSel = new Set();
const bldAddon = new Set();   // servizi extra: 'whatsapp', 'domain'
function initBuilder(){
  const grid = $('#bld-grid'); if(!grid) return;
  grid.innerHTML = READY.map(m=>{
    const lock = m.px===0;
    return `<div class="bld-mod ${lock?'lock on':''}" data-id="${m.id}">
      <span class="bm-check">${lock?'✓':''}</span>
      <span class="bm-ic">${m.ic}</span>
      <span class="bm-nm">${escapeH(m.nm)}</span>
      <span class="bm-px ${lock?'inc':''}">${lock?'incluso':'+'+m.px}</span>
    </div>`;
  }).join('')
  + `<div class="bld-mod addon soon" data-addon="whatsapp"><span class="bm-check"></span><span class="bm-ic">💬</span><span class="bm-nm">Notifiche WhatsApp</span><span class="bm-px" style="color:var(--amber)">presto</span></div>`
  + `<div class="bld-mod addon" data-addon="domain"><span class="bm-check"></span><span class="bm-ic">🌐</span><span class="bm-nm">Dominio tuo</span><span class="bm-px">+${DOM_PX}/a</span></div>`;
  grid.addEventListener('click', e=>{
    const el = e.target.closest('.bld-mod'); if(!el||el.classList.contains('lock')||el.classList.contains('soon')) return;
    if(el.dataset.addon){
      const a = el.dataset.addon;
      if(bldAddon.has(a)){bldAddon.delete(a);el.classList.remove('on');}
      else{bldAddon.add(a);el.classList.add('on');}
    } else {
      const id = el.dataset.id;
      if(bldSel.has(id)){bldSel.delete(id);el.classList.remove('on');}
      else{bldSel.add(id);el.classList.add('on');}
    }
    renderBuilder();
  });
  $$('#bld-period button').forEach(b=>b.addEventListener('click',()=>{
    bldAnnual = b.dataset.p==='annual';
    $$('#bld-period button').forEach(x=>x.classList.toggle('on',x===b));
    renderBuilder();
  }));
  renderBuilder();
}
function renderBuilder(){
  const extras = [...bldSel].map(MOD);
  const extrasSum = extras.reduce((a,m)=>a+m.px,0);
  const wa = bldAddon.has('whatsapp'), dom = bldAddon.has('domain');
  let monthly = BASE + extrasSum + (wa?WA_PX:0);
  const useTutto = monthly >= TUTTO;        // oltre il pacchetto conviene il Tutto compreso (include WhatsApp+dominio+utenti illimitati)
  if(useTutto) monthly = TUTTO;
  const domAnnual = (dom && !useTutto) ? DOM_PX : 0;     // il dominio è annuale; nel Tutto compreso è già incluso
  const display = bldAnnual ? monthly*10/12 : monthly;   // annuale: 2 mesi gratis → /12 per il "al mese effettivo"

  const totEl = $('#bld-total'); if(!totEl) return;
  totEl.innerHTML = chf(display) + '<small>/mese</small>';
  totEl.style.color = useTutto ? 'var(--cy)' : 'var(--t1)';
  const annualTot = monthly*10 + domAnnual;
  $('#bld-period-note').textContent = bldAnnual
    ? `fatturato annuale · ${chf(annualTot)}/anno (2 mesi gratis)`
    : `al mese · ${INCL_USERS} utenti inclusi${domAnnual?` · + dominio ${chf(DOM_PX)}/anno`:''}`;

  const rows = [`<div class="bld-row"><span>Base + ${INCL_USERS} utenti</span><span>${chf(BASE)}</span></div>`];
  if(useTutto){
    rows.push(`<div class="bld-row" style="color:var(--cy)"><span>★ Tutto compreso</span><span>${chf(TUTTO)}</span></div>`);
  }else{
    extras.forEach(m=>rows.push(`<div class="bld-row"><span>${m.ic} ${escapeH(m.nm)}</span><span>+${chf(m.px)}</span></div>`));
    if(wa) rows.push(`<div class="bld-row"><span>💬 Notifiche WhatsApp</span><span>+${chf(WA_PX)}</span></div>`);
    if(dom) rows.push(`<div class="bld-row"><span>🌐 Dominio tuo</span><span>+${chf(DOM_PX)}/anno</span></div>`);
    if(!extras.length && !wa && !dom) rows.push(`<div class="bld-row" style="color:var(--t3)"><span>Nessun extra</span><span>—</span></div>`);
  }
  $('#bld-rows').innerHTML = rows.join('');

  const saveEl = $('#bld-save');
  saveEl.innerHTML = `Con il <b>piano annuale</b> paghi 10 mesi invece di 12: <b>risparmi ${chf(monthly*2)}/anno</b> + attivazione dimezzata.`;

  const tip = $('#bld-tip');
  if(useTutto){ tip.classList.add('show'); tip.innerHTML = '🎁 Con <b>Tutto compreso CHF 190</b> hai <b>tutti</b> i moduli + dominio + WhatsApp + utenti illimitati. Già applicato qui sopra.'; }
  else if(monthly>=150){ tip.classList.add('show'); tip.innerHTML = `Ti manca poco al <b>Tutto compreso (CHF 190)</b>: avresti <b>tutto</b> incluso (anche dominio e WhatsApp) e utenti illimitati.`; }
  else tip.classList.remove('show');
}

/* ============================ PERSONALIZZAZIONE ============================ */
function initPerso(){
  const wrap = $('#perso'); if(!wrap) return;
  wrap.addEventListener('click', e=>{
    const s = e.target.closest('.swatch'); if(!s) return;
    document.documentElement.style.setProperty('--cy', s.dataset.c);
    $$('#perso .swatch').forEach(x=>x.classList.toggle('on',x===s));
  });
}

/* ============================ CONTATORI ANIMATI ============================ */
function initCounters(){
  const els = $$('[data-count]');
  if(!els.length) return;
  const io = new IntersectionObserver(es=>{
    es.forEach(en=>{
      if(!en.isIntersecting) return; io.unobserve(en.target);
      const el = en.target, end = parseFloat(el.dataset.count), pre = el.dataset.pre||'', suf = el.dataset.suf||'';
      const dur = 1200, t0 = performance.now();
      (function tick(t){
        const k = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-k,3);
        el.textContent = pre + Math.round(end*e).toLocaleString('de-CH') + suf;
        if(k<1) requestAnimationFrame(tick); else el.classList.add('counting');
      })(t0);
    });
  },{threshold:.5});
  els.forEach(el=>io.observe(el));
}

/* ============================ EFFETTI ============================ */
function initFx(){
  // barra di avanzamento scroll
  const bar = $('#scrollbar');
  const onScroll = ()=>{ const h = document.documentElement.scrollHeight - innerHeight; if(bar) bar.style.width = (h>0 ? scrollY/h*100 : 0) + '%'; };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // spotlight che segue il cursore sulle card
  ['.step','.vcard','.mod','.pm-card','.tier','.extra-card','.disc-card','.exp-detail','.bld-sum','.bld-pick','.ncard','.cmp','.final'].forEach(sel=>$$(sel).forEach(el=>el.classList.add('spot')));
  let raf=0, lastEl=null, lx=0, ly=0;
  addEventListener('mousemove', e=>{
    const el = e.target.closest && e.target.closest('.spot'); if(!el) return;
    lastEl=el; const r=el.getBoundingClientRect(); lx=e.clientX-r.left; ly=e.clientY-r.top;
    if(!raf) raf=requestAnimationFrame(()=>{ raf=0; if(lastEl){ lastEl.style.setProperty('--mx',lx+'px'); lastEl.style.setProperty('--my',ly+'px'); } });
  }, {passive:true});

  // tilt 3D del telefono hero al movimento del mouse
  const dev = $('.hero-device'), phone = $('.hero-device .phone');
  if(dev && phone && matchMedia('(pointer:fine)').matches){
    dev.addEventListener('mousemove', e=>{
      const r=dev.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
      phone.style.transform=`rotateY(${px*10}deg) rotateX(${(-py*10)}deg)`;
    });
    dev.addEventListener('mouseleave', ()=>{ phone.style.transform=''; });
  }
}

/* ============================ BOOT ============================ */
function boot(){ initExplorer(); initBuilder(); initPerso(); initCounters(); initFx(); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
