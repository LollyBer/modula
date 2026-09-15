/* ===== CONFIGURATORE — logica (4 step + anteprima + invio) ===== */
const $ = (s,r=document)=>r.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const byId = (arr,id)=>arr.find(x=>x.id===id);
const ALL_MODS = [...MODULI_BASE, ...MODULI_EXTRA];
const modById = id => byId(ALL_MODS, id);
const tr = (source, values={}) => {
  const translated=window.ModulaI18n?window.ModulaI18n.t(source):source;
  return translated.replace(/\{\{(\w+)\}\}/g,(match,key)=>Object.prototype.hasOwnProperty.call(values,key)?String(values[key]):match);
};
const moduleName = id => tr((modById(id)||{nome:id}).nome);

const STEPS = ['Azienda','Settore','Moduli','Riepilogo'];
const S = { step:1, azienda:'', referente:'', email:'', telefono:'', dipendenti:'', logo:'', settore:null, extra:new Set(), richiesta:'', dominio:false, migrazione:false, formula:'abbonamento', previewView:'hub', device:'phone', accent:'#FF453A' };
const FORMULE = {
  abbonamento: {nome:'Abbonamento', prezzo:null, descrizione:'Accesso alla piattaforma centrale, con aggiornamenti inclusi.'},
  licenza: {nome:'Licenza fai-da-te', prezzo:6000, descrizione:'Uso permanente della versione acquistata. Gestisci tu l’avvio e l’infrastruttura.'},
  setup: {nome:'Licenza con setup', prezzo:7000, descrizione:'La stessa licenza, con configurazione e avvio accompagnati da Modula.'}
};
const chf = valore => 'CHF '+Number(valore).toLocaleString('de-CH');
function setFormula(id){
  if(!FORMULE[id])return;
  S.formula=id;
  if(S.step===4)render({preserveScroll:true,focusSelector:'[name="formula"][value="'+id+'"]'});
}
function chooseLogo(input){
  S.logo=input.files&&input.files[0]?input.files[0].name:'';
  const info=$('#logo-ok');
  if(info)info.textContent=S.logo?tr('File scelto: {{file}}. Allegalo alla mail.',{file:S.logo}):tr('Il logo va allegato alla mail; qui conserviamo solo il nome del file.');
}
function toggleServizio(key){ S[key]=!S[key]; if(S.step===4)render({preserveScroll:true,focusSelector:'[data-service="'+key+'"]'}); }

/* ---------------- color picker (accento per-azienda) ---------------- */
const COLORI = [
  {h:'#FF453A',n:'Rosso'},  {h:'#E11D2A',n:'Cremisi'}, {h:'#FB923C',n:'Arancio'},
  {h:'#FBBF24',n:'Ambra'},  {h:'#34D399',n:'Verde'},   {h:'#2DD4BF',n:'Teal'},
  {h:'#60A5FA',n:'Blu'},    {h:'#818CF8',n:'Indaco'},  {h:'#A78BFA',n:'Viola'},
  {h:'#F472B6',n:'Rosa'}
];
function colorPicker(opts={}){
  const title = opts.title || 'Colore della tua app';
  const hint  = opts.hint || '';
  const sw = COLORI.map(c=>`<button type="button" class="sw ${S.accent.toLowerCase()===c.h.toLowerCase()?'on':''}" data-c="${c.h}" style="--swc:${c.h}" title="${esc(c.n)}" aria-label="${esc(c.n)}" aria-pressed="${S.accent.toLowerCase()===c.h.toLowerCase()}" onclick="setAccent('${c.h}')"></button>`).join('');
  return `<div class="cpick">
    <div class="cpick-h">${esc(title)}${hint?`<span class="cpick-hint">${esc(hint)}</span>`:''}</div>
    <div class="cpick-row">
      ${sw}
      <label class="sw sw-custom" title="Colore personalizzato"><input type="color" aria-label="Colore personalizzato" value="${S.accent}" oninput="setAccent(this.value)"></label>
    </div>
  </div>`;
}
function setAccent(hex){
  if(!hex) return;
  S.accent = hex;
  document.querySelectorAll('.cpick .sw[data-c]').forEach(s=>{
    const selected=s.getAttribute('data-c').toLowerCase()===hex.toLowerCase();
    s.classList.toggle('on',selected);s.setAttribute('aria-pressed',String(selected));
  });
  document.querySelectorAll('.cpick .sw-custom input').forEach(i=>{ i.value=hex; });
  if(S.step===4) refreshPreview();
}

/* ---------------- render router ---------------- */
function updateGuide(){
  const hints=['Nome, contatti e stile','Il tuo settore di attività','La base e le funzioni extra','Formula e richiesta finale'];
  const available=S.azienda.trim()?(S.settore?4:2):1;
  $('#steps').innerHTML = STEPS.map((t,i)=>{
    const n=i+1; const cls = n===S.step?'on':(n<S.step?'done':'');
    return `<button type="button" class="s ${cls}" onclick="goStep(${n})" ${n>available?'disabled':''} ${n===S.step?'aria-current="step"':''}><span class="step-number" aria-hidden="true">${n<S.step?'✓':String(n).padStart(2,'0')}</span><span class="step-copy"><strong>${esc(tr(t))}</strong><small>${esc(tr(hints[i]))}</small></span></button>`;
  }).join('');
  const P=calcPrezzo(), subscription=S.formula==='abbonamento';
  $('#live-summary').innerHTML=`<span class="summary-eyebrow">${esc(tr('La configurazione prende forma'))}</span>${S.azienda.trim()?`<p class="summary-company" data-i18n-ignore>${esc(S.azienda.trim())}</p>`:''}<p class="guide-plan">${esc(tr(subscription?'Abbonamento indicativo':FORMULE[S.formula].nome))}</p><div class="guide-price">${chf(subscription?P.canone:FORMULE[S.formula].prezzo)}<small>${esc(tr(subscription?'/mese':'una tantum'))}</small></div><p class="guide-modules">${esc(tr(P.tutti&&subscription?'Tutti i moduli inclusi':P.extra?'5 moduli base + {{count}} extra':'5 moduli base inclusi',{count:P.extra}))}</p>${P.custom?`<p class="guide-custom">${esc(tr('Su misura: da valutare'))}</p>`:''}`;
}
function goStep(step){
  const available=S.azienda.trim()?(S.settore?4:2):1;
  if(step<1||step>available)return;
  S.step=step;render({focusHeading:true});
}
function render(options={}){
  updateGuide();
  const v = $('#view');
  const content=S.step===1?step1():S.step===2?step2():S.step===3?step3():step4();
  v.dataset.step=String(S.step);
  v.innerHTML='<p class="stage-label">'+esc(tr('Passaggio {{current}} di 4',{current:S.step}))+'</p>'+content;
  setupPreview();
  if(!options.preserveScroll)window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  if(options.focusHeading)$('.h1')?.focus({preventScroll:true});
  if(options.focusSelector)$(options.focusSelector)?.focus({preventScroll:true});
  if(S.step===1)$('#az')?.addEventListener('keydown',e=>{if(e.key==='Enter')next();});
}

/* ---------------- STEP 1 — nome azienda ---------------- */
function step1(){
  return `
  <h1 class="h1" tabindex="-1">Crea la tua app</h1>
  <div class="lead">In pochi passi componi il gestionale della tua attività. Iniziamo dal nome: comparirà nella tua app.</div>
  <section class="card identity-card">
    <h2 class="card-title">La tua attività</h2>
    <div class="bigfield">
      <label for="az">Nome dell'azienda</label>
      <input id="az" value="${esc(S.azienda)}" autocomplete="organization" placeholder="es. La Mia Azienda S.r.l." oninput="S.azienda=this.value;updateGuide()" maxlength="48">
    </div>
  <div class="identity-color">
    ${colorPicker({title:"Colore richiesto per la tua app", hint:"Lo includiamo nella richiesta. La demo mantiene i suoi colori."})}
  </div></section>
  <section class="card contact-card">
    <h2 class="card-title">Come possiamo ricontattarti?</h2>
    <div class="bigfield"><label for="ref">Referente — chi gestirà l'app</label>
      <input id="ref" value="${esc(S.referente)}" placeholder="es. Mario Rossi" oninput="S.referente=this.value" maxlength="60"></div>
    <div class="field-grid">
      <div class="bigfield"><label for="eml">Email per la risposta</label><input id="eml" type="email" autocomplete="email" value="${esc(S.email)}" placeholder="tu@azienda.ch" oninput="S.email=this.value"></div>
      <div class="bigfield"><label for="tel">Telefono</label><input id="tel" type="tel" autocomplete="tel" value="${esc(S.telefono)}" placeholder="+41 ..." oninput="S.telefono=this.value"></div>
    </div>
    <div class="field-grid">
      <div class="bigfield"><label for="dip">Quanti utenti useranno l'app?</label><input id="dip" type="number" min="1" step="1" value="${esc(S.dipendenti)}" placeholder="es. 4" oninput="S.dipendenti=this.value"><p class="field-help">Il numero ci aiuta a preparare la proposta. Gli utenti inclusi sono da concordare.</p></div>
      <div class="bigfield"><label for="logo">Logo (facoltativo)</label><label class="file-picker" for="logo"><span>Scegli file</span><span data-i18n-ignore>${S.logo?esc(S.logo):esc(tr('Nessun file selezionato'))}</span></label><input id="logo" class="file-input" type="file" accept="image/*" aria-describedby="logo-ok" onchange="chooseLogo(this);this.previousElementSibling.lastElementChild.textContent=S.logo||tr('Nessun file selezionato')"><p class="field-help" id="logo-ok">${S.logo?esc(tr('File scelto: {{file}}. Allegalo alla mail.',{file:S.logo})):tr('Il logo va allegato alla mail; qui conserviamo solo il nome del file.')}</p></div>
    </div>
  </section>
  <div class="navbar">
    <div class="sp"></div>
    <button class="btn pri" onclick="next()">Continua →</button>
  </div>`;
}

/* ---------------- STEP 2 — settore ---------------- */
function step2(){
  return `
  <h1 class="h1" tabindex="-1">Che attività fai?</h1>
  <div class="lead">Scegli il settore più vicino al tuo: ti proporremo i moduli più utili. Potrai comunque aggiungere tutti gli altri.</div>
  <div class="grid sector-grid">
    ${SETTORI.map(s=>`
      <button type="button" class="tile ${S.settore===s.id?'on':''}" data-sector="${s.id}" aria-pressed="${S.settore===s.id}" onclick="pickSettore('${s.id}')">
        <span class="ic">${s.ic}</span>
        <span class="nm">${esc(tr(s.nome))}</span>
        <span class="ds">${esc(tr(s.desc))}</span>
      </button>`).join('')}
  </div>
  <div class="navbar">
    <button class="btn ghost" onclick="back()">← Indietro</button>
    <div class="sp"></div>
    <button class="btn pri" id="nx2" onclick="next()" ${S.settore?'':'disabled'}>Continua →</button>
  </div>`;
}
function pickSettore(id){
  S.settore=id;
  // pre-seleziona i moduli proposti del settore (solo quelli già pronti)
  const st=byId(SETTORI,id);
  if(st) st.proposti.forEach(m=>{ const mod=modById(m); if(mod && mod.stato!=='arrivo') S.extra.add(m); });
  render({preserveScroll:true,focusSelector:'[data-sector="'+id+'"]'});
}

/* ---------------- STEP 3 — moduli ---------------- */
function step3(){
  const st = byId(SETTORI, S.settore) || {proposti:[]};
  const pronti   = MODULI_EXTRA.filter(m=>m.stato!=='arrivo' && !m.custom);  /* niente moduli su misura di altri */
  const proposti = pronti.filter(m=>st.proposti.includes(m.id));
  const altri    = pronti.filter(m=>!st.proposti.includes(m.id));
  const tile = (m,extra=true)=>`
    <${extra?'button type="button"':'div'} class="tile ${extra?(S.extra.has(m.id)?'on':''):'locked'} ${extra&&m.stato==='arrivo'?'dim':''}" data-included="${esc(tr('incluso'))}" ${extra?`data-extra="${m.id}" aria-pressed="${S.extra.has(m.id)}" onclick="toggleExtra('${m.id}')"`:''}>
      <span class="ic">${m.ic}</span>
      <span class="nm">${esc(tr(m.nome))}</span>
      <span class="ds">${esc(tr(m.desc))}</span>
      ${extra&&st.proposti.includes(m.id)?'<span class="tag">consigliato</span>':''}${extra&&m.stato==='arrivo'?'<span class="soon">in arrivo</span>':''}
    </${extra?'button':'div'}>`;
  return `
  <h1 class="h1" tabindex="-1">Componi la tua app</h1>
  <div class="lead">I moduli <b>base</b> ci sono sempre. Aggiungi quelli che ti servono: i <b style="color:var(--amber)">consigliati</b> sono pensati per il tuo settore.</div>

  <div class="section-label first">Inclusi sempre — la base</div>
  <div class="grid base-grid">${MODULI_BASE.map(m=>tile(m,false)).join('')}</div>

  ${proposti.length?`<div class="section-label">Consigliati per il tuo settore</div>
  <div class="grid">${proposti.map(m=>tile(m)).join('')}</div>`:''}

  <div class="section-label">Tutti gli altri moduli</div>
  <div class="grid">${altri.map(m=>tile(m)).join('')}</div>

  <div class="custom-mod">
    <div class="cm-h"><span class="ic">✨</span>Non trovi quello che ti serve?</div>
    <div class="cm-sub">Descrivi il <b>modulo su misura</b> che vorresti: a cosa serve, cosa deve gestire, chi lo usa. Ne valuteremo insieme fattibilità, tempi e prezzo.</div>
    <div class="bigfield">
      <label for="rich">Modulo su misura — descrizione</label>
      <textarea id="rich" placeholder="es. «Mi serve un modulo per registrare i controlli F-Gas dei condizionatori: per ogni apparecchio data del controllo, kg di gas, e un avviso quando scade.»" oninput="S.richiesta=this.value;updCount()" maxlength="1200">${esc(S.richiesta)}</textarea>
    </div>
  </div>

  <div class="navbar">
    <button class="btn ghost" onclick="back()">← Indietro</button>
    <div class="sp"></div>
    <span class="count">${esc(moduleCountText())}</span>
    <button class="btn pri" onclick="next()">Formula e riepilogo →</button>
  </div>`;
}
function toggleExtra(id){ S.extra.has(id)?S.extra.delete(id):S.extra.add(id); render({preserveScroll:true,focusSelector:'[data-extra="'+id+'"]'}); }
function moduleCountText(){return tr('{{count}} moduli',{count:MODULI_BASE.length+S.extra.size})+(S.richiesta.trim()?' '+tr('+ 1 su misura'):'');}
function updCount(){ const c=$('.count'); if(c) c.textContent=moduleCountText(); updateGuide(); }

/* ---------------- STEP 4 — anteprima + invio ---------------- */
function chosenMods(){ return [...MODULI_BASE, ...MODULI_EXTRA.filter(m=>S.extra.has(m.id))]; }

/* ---- prezzi indicativi, coerenti con la landing ---- */
const PREZZI={base:59,extra:10,tetto:129,soglia:7};
function calcPrezzo(){
  const extra=[...S.extra].filter(id=>{const m=modById(id);return m && m.stato!=='arrivo' && !m.custom;});
  const modSum=extra.length*PREZZI.extra;
  const tutti=extra.length>=PREZZI.soglia;
  const canone=tutti?PREZZI.tetto:Math.min(PREZZI.tetto,PREZZI.base+modSum);
  return {extra:extra.length,modSum,canone,tutti,custom:!!S.richiesta.trim()};
}

function step4(){
  const nome = S.azienda.trim() || 'La tua app';
  const settore = byId(SETTORI,S.settore);
  const extraChosen = MODULI_EXTRA.filter(m=>S.extra.has(m.id));
  const P = calcPrezzo();
  const formula=FORMULE[S.formula]||FORMULE.abbonamento;
  const svc=(key,label)=>`<button type="button" class="service-option ${S[key]?'on':''}" data-service="${key}" aria-pressed="${S[key]}" onclick="toggleServizio('${key}')"><span>${S[key]?'✓':'+'} ${esc(tr(label))}</span><small>Da concordare</small></button>`;
  // assicura una schermata valida selezionata
  const validi = new Set([...chosenMods().map(m=>m.id),'altro']);
  if(!validi.has(S.previewView)) S.previewView='hub';

  return `
  <h1 class="h1" tabindex="-1">La tua configurazione</h1>
  <div class="lead">${esc(tr('Scegli come avere Modula e controlla la richiesta per {{azienda}}. Prezzi indicativi: definiremo insieme la proposta finale.',{azienda:nome}))}</div>

  <fieldset class="purchase-options">
    <legend>Come vuoi avere Modula?</legend>
    <div class="purchase-grid">${Object.entries(FORMULE).map(([id,f])=>`<label class="purchase-option ${S.formula===id?'on':''}">
      <input type="radio" name="formula" value="${id}" ${S.formula===id?'checked':''} onchange="setFormula(this.value)">
      <span class="purchase-name">${esc(tr(f.nome))}</span>
      <strong>${chf(id==='abbonamento'?P.canone:f.prezzo)}<small>${id==='abbonamento'?'/mese':' una tantum'}</small></strong>
      <span class="purchase-desc">${esc(tr(f.descrizione))}</span>
    </label>`).join('')}</div>
  </fieldset>

  <div class="preview-intro"><h3>Esplora la demo base</h3><p>È la vera app con dati di esempio e i 5 moduli base. Il nome, il logo, i colori e gli extra che hai scelto fanno parte della richiesta e non modificano questa demo.</p><p class="field-help">La demo dell’app è in italiano.</p></div>

  <div id="preview-area">${previewArea()}</div>

  <div class="summary" style="margin-top:18px">
    <h3>Riepilogo</h3>
    <div class="rowl"><span class="k">AZIENDA</span><span data-i18n-ignore>${esc(nome)}</span></div>
    <div class="rowl"><span class="k">FORMULA</span><span>${esc(tr(formula.nome))}</span></div>
    <div class="rowl"><span class="k">SETTORE</span><span>${settore?esc(settore.ic+' '+tr(settore.nome)):'—'}</span></div>
    <div class="rowl"><span class="k">COLORE</span><span>${esc(S.accent)} · ${esc(tr('richiesto per la tua app'))}</span></div>
    ${S.logo?`<div class="rowl"><span class="k">LOGO</span><span>${esc(tr('{{file}} · da allegare alla mail',{file:S.logo}))}</span></div>`:''}
    <div class="rowl"><span class="k">BASE</span><div class="chips">${MODULI_BASE.map(m=>`<span class="chip b">${m.ic} ${esc(tr(m.nome))}</span>`).join('')}</div></div>
    <div class="rowl"><span class="k">EXTRA</span><div class="chips">${extraChosen.length?extraChosen.map(m=>`<span class="chip">${m.ic} ${esc(tr(m.nome))}${m.stato==='arrivo'?' · '+esc(tr('in arrivo')):''}</span>`).join(''):'<span class="cs" style="color:var(--t3)">'+esc(tr('nessuno'))+'</span>'}</div></div>
    ${S.richiesta.trim()?`<div class="rowl"><span class="k">SU MISURA</span><div class="chips"><span class="chip" data-i18n-ignore style="white-space:normal;line-height:1.45;text-align:left">✨ ${esc(S.richiesta.trim())}</span></div></div>`:''}

    <div style="margin-top:18px;border-top:1px solid var(--line);padding-top:16px">
      <h3>Servizi da valutare insieme</h3>
      <div class="service-options">
        ${svc('dominio','Dominio personalizzato')}
        ${svc('migrazione','Migrazione dati')}
      </div>
      <p class="field-help">Indica se hai bisogno di un indirizzo personalizzato o di trasferire i dati dal gestionale che usi oggi. Modalità e costi dipendono dalla formula e dai dati da trasferire.</p>
    </div>

    <div style="margin-top:18px;border-top:1px solid var(--line);padding-top:16px">
      <h3>La formula scelta</h3>
      ${S.formula==='abbonamento'?`
        <div class="rowl"><span class="k">BASE</span><span>${esc(tr('{{prezzo}}/mese · 5 moduli inclusi',{prezzo:chf(PREZZI.base)}))}</span></div>
        <div class="rowl"><span class="k">EXTRA</span><span>${esc(tr('{{numero}} selezionati · {{prezzo}}/mese ciascuno',{numero:P.extra,prezzo:chf(PREZZI.extra)}))}</span></div>
        <div class="price-summary"><span>Canone indicativo</span><strong>${chf(P.canone)}<small>/mese</small></strong></div>
        <p class="price-help">${P.tutti?'Hai raggiunto il tetto: a CHF 129/mese accedi a tutti i moduli disponibili.':'Dal settimo extra il canone si ferma a CHF 129/mese, con accesso a tutti i moduli disponibili.'}</p>
      `:`
        <div class="price-summary"><span>Licenza indicativa</span><strong>${chf(formula.prezzo)}<small> una tantum</small></strong></div>
        <p class="price-help">${esc(tr('Uso permanente della versione acquistata.'))} ${S.formula==='setup'?esc(tr('Configurazione e avvio con Modula.'))+' ':''}${esc(tr('Hosting, dominio e servizi esterni comportano costi separati. Moduli inclusi e assistenza si definiscono nella proposta; nuove funzioni e upgrade possono essere acquistati separatamente.'))}</p>
      `}
      ${P.custom?'<p class="price-help">Il modulo su misura richiede una valutazione separata di fattibilità, tempi e prezzo.</p>':''}
      <p class="field-help">Prezzi indicativi in CHF. IVA, utenti inclusi, condizioni di assistenza e servizi aggiuntivi saranno precisati nella proposta.</p>
    </div>

    <div class="send-box">
      <h3>Invia la richiesta, senza impegno</h3>
      <p>${esc(tr('Il pulsante apre il tuo programma di posta con il riepilogo già compilato: controlla il messaggio e invialo. Ti ricontatteremo per definire proposta e attivazione. L’account non viene creato in questo passaggio.'))}${S.logo?' '+esc(tr('Ricorda di allegare il logo alla mail.')):''}</p>
      <div class="send-actions">
        <button class="btn pri" onclick="sendToRegia()">Invia richiesta</button>
        ${CONTATTO.whatsapp?`<button class="btn" onclick="sendWhatsApp()">💬 WhatsApp</button>`:''}
        <button class="btn ghost" onclick="copyConfig()">⧉ Copia configurazione</button>
      </div>
      <p class="email-help">Se non si apre il programma di posta, copia la configurazione e incollala in una mail a <a href="mailto:${esc(CONTATTO.email)}">${esc(CONTATTO.email)}</a>.</p>
      <details class="request-details"><summary>Dettagli della richiesta</summary><div class="code" id="code" data-i18n-ignore>${esc(buildText())}</div></details>
    </div>
  </div>

  <div class="navbar">
    <button class="btn ghost" onclick="back()">← Modifica i moduli</button>
    <div class="sp"></div>
  </div>`;
}

/* ---- anteprima navigabile (telefono / pc) ---- */
const _short = n => esc(n.split(/[\s\/]/)[0]);
function previewArea(){
  const view=MODULI_BASE.some(m=>m.id===S.previewView)?S.previewView:'hub';
  return `<div class="demo-tabs" role="group" aria-label="Esplora la demo base">${MODULI_BASE.map(m=>`<button type="button" data-preview-view="${m.id}" aria-pressed="${m.id===view}" onclick="setPreviewView('${m.id}')">${esc(tr(m.nome))}</button>`).join('')}</div><div class="monitor"><div class="monitor-top" aria-hidden="true"><i></i></div><div class="monitor-viewport"><iframe title="Demo reale Modula con dati di esempio e moduli base" src="../app.html?demo=1&screen=${view}" loading="lazy"></iframe></div><div class="monitor-chin" aria-hidden="true">modula<i></i></div></div><div class="monitor-support" aria-hidden="true"><div class="monitor-neck"></div><div class="monitor-base"></div></div><div class="demo-bottom"><p>La demo mantiene i colori e i dati dell’app reale.</p><button type="button" onclick="openConfigDemo()">Ingrandisci la demo <span aria-hidden="true">⤢</span></button></div>`;
}
let previewObserver;
function setupPreview(){
  previewObserver?.disconnect();
  const viewport=$('.monitor-viewport');
  if(!viewport)return;
  const resize=()=>viewport.style.setProperty('--demo-scale',String(viewport.clientWidth/1440));
  resize();if('ResizeObserver'in window){previewObserver=new ResizeObserver(resize);previewObserver.observe(viewport);}
}
function openConfigDemo(){
  const frame=document.createElement('iframe');
  frame.title=tr('Demo reale Modula con dati di esempio e moduli base');
  frame.src='../app.html?demo=1&screen='+S.previewView;
  $('#config-demo-host').replaceChildren(frame);$('#config-demo-dialog').showModal();document.body.classList.add('modal-open');
}
function refreshPreview(){ const a=$('#preview-area'); if(a){a.innerHTML=previewArea();setupPreview();} }
function setPreviewView(id){ if(!MODULI_BASE.some(m=>m.id===id))return;S.previewView=id; refreshPreview();$('[data-preview-view="'+id+'"]')?.focus({preventScroll:true}); }
function setDevice(d){ S.device=d; if(d==='pc'&&S.previewView==='altro') S.previewView='hub'; refreshPreview(); }

function altroScreen(){
  const mods = chosenMods();
  return `<div class="ph-title"><span class="a"></span>Tutti i moduli</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
    ${mods.map(m=>`<div onclick="setPreviewView('${m.id}')" style="background:var(--bg1);border:1px solid var(--line);border-radius:11px;padding:12px 6px;text-align:center;cursor:pointer"><div style="font-size:23px">${m.ic}</div><div style="font-size:9.5px;color:var(--t2);margin-top:5px;line-height:1.2">${esc(m.nome)}</div></div>`).join('')}
  </div>`;
}
function phoneMockup(){
  const nome = S.azienda.trim()||'La tua app';
  const mods = chosenMods();
  const first = mods.slice(0,5);
  let nav = first.map(m=>`<div class="nb ${S.previewView===m.id?'on':''}" onclick="setPreviewView('${m.id}')"><span class="i">${m.ic}</span>${_short(m.nome)}</div>`).join('');
  if(mods.length>5) nav += `<div class="nb ${S.previewView==='altro'?'on':''}" onclick="setPreviewView('altro')"><span class="i">☰</span>Altro</div>`;
  const body = S.previewView==='altro' ? altroScreen() : schermataDi(S.previewView);
  return `<div class="phone">
    <div class="notch"></div>
    <div class="ph-top"><span class="dot"></span><div><div class="nm">${esc(nome)}</div><div class="sub">GESTIONALE</div></div></div>
    <div class="ph-body">${body}</div>
    <div class="ph-nav">${nav}</div>
  </div>`;
}
function pcMockup(){
  const nome = S.azienda.trim()||'La tua app';
  const mods = chosenMods();
  const view = S.previewView==='altro' ? 'hub' : S.previewView;
  const slug = (nome.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'la-tua-app');
  return `<div class="pc">
    <div class="pc-bar"><span class="b r"></span><span class="b y"></span><span class="b g"></span><span class="url">${esc(slug)}.app</span></div>
    <div class="pc-app">
      <div class="pc-side">
        <div class="pc-brand"><span class="dot"></span>${esc(nome)}</div>
        <div class="pc-brand-sub">GESTIONALE</div>
        ${mods.map(m=>`<div class="pc-ni ${view===m.id?'on':''}" onclick="setPreviewView('${m.id}')"><span class="i">${m.ic}</span>${esc(m.nome)}</div>`).join('')}
      </div>
      <div class="pc-main">${schermataDi(view)}</div>
    </div>
  </div>`;
}

/* ---------------- invio / export ---------------- */
function buildConfig(){
  const slug = S.azienda.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const c = {
    azienda: S.azienda.trim(),
    slug: slug,
    settore: S.settore,
    accento: S.accent,
    referente: S.referente.trim(),
    email: S.email.trim(),
    telefono: S.telefono.trim(),
    dipendenti: S.dipendenti?Number(S.dipendenti):null,
    logo: S.logo||false,
    dominio: !!S.dominio,
    migrazione: !!S.migrazione,
    lingua_configuratore: window.ModulaI18n?window.ModulaI18n.language:'it',
    formula: S.formula,
    formula_nome: tr(FORMULE[S.formula].nome),
    prezzo_indicativo_chf: S.formula==='abbonamento'?calcPrezzo().canone:FORMULE[S.formula].prezzo,
    periodicita: S.formula==='abbonamento'?'mensile':'una_tantum',
    accesso_tutti_moduli: S.formula==='abbonamento'&&calcPrezzo().tutti,
    moduli_base: MODULI_BASE.map(m=>m.id),
    moduli_extra: [...S.extra],
    generato: 'configuratore'
  };
  if(S.richiesta.trim()) c.modulo_su_misura = S.richiesta.trim();
  return c;
}
function buildText(){
  const c = buildConfig();
  const settore = byId(SETTORI,S.settore);
  const P = calcPrezzo();
  const field=(label,value)=>tr(label)+': '+value;
  return [
    tr('NUOVA APP — configurazione'),
    field('Azienda',c.azienda||tr('(da indicare)')),
    field('Settore',settore?tr(settore.nome):'—'),
    field('Lingua della richiesta',c.lingua_configuratore.toUpperCase()),
    field('Colore accento',c.accento),
    field('Referente',c.referente||'-'),
    field('Email',c.email||'-')+'  ·  '+field('Tel',c.telefono||'-'),
    field('Utenti previsti',c.dipendenti||'-'),
    ...(c.logo?[field('Logo',c.logo+' '+tr('(allega il file alla mail)'))]:[]),
    field('Moduli base',c.moduli_base.map(moduleName).join(', ')),
    field('Moduli extra',c.moduli_extra.length?c.moduli_extra.map(moduleName).join(', '):tr('nessuno')),
    ``,
    field('FORMULA RICHIESTA',c.formula_nome),
    field('PREZZO INDICATIVO',chf(c.prezzo_indicativo_chf)+' '+tr(c.periodicita==='mensile'?'/mese':'una tantum')),
    ...(S.formula==='abbonamento'?[tr('Base CHF 59/mese + {{numero}} extra a CHF 10/mese ciascuno; tetto CHF 129/mese dal settimo extra.',{numero:P.extra}),...(P.tutti?[tr('Accesso a tutti i moduli disponibili incluso nel tetto di CHF 129/mese.')]:[])]:[tr('Uso permanente della versione acquistata. Hosting, dominio e servizi esterni separati. Moduli inclusi, assistenza e upgrade da definire nella proposta.')]),
    tr('Proposta finale da concordare: IVA, utenti inclusi e condizioni di assistenza da precisare.'),
    ...((S.dominio||S.migrazione)?[field('Servizi richiesti, con modalità e costi da concordare',[S.dominio?tr('Dominio personalizzato'):null,S.migrazione?tr('Migrazione dati'):null].filter(Boolean).join(', '))]:[]),
    ...(c.modulo_su_misura?['',tr('MODULO SU MISURA (da costruire, da concordare prezzo):'),c.modulo_su_misura]:[]),
    ``,
    tr('--- config (per l’assemblaggio) ---'),
    JSON.stringify(c)
  ].join('\n');
}
function sendEmail(){
  if(!S.azienda.trim()||!/^\S+@[^\s@]+\.[^\s@]+$/.test(S.email.trim())){
    const field=!S.azienda.trim()?'az':'eml';
    S.step=1;render();$('#'+field)?.focus();
    toast(field==='az'?'Scrivi il nome dell’azienda':'Indica un’email valida per ricevere la proposta');
    return;
  }
  const sub = tr('Nuova app — {{azienda}}',{azienda:S.azienda.trim()||tr('configurazione')});
  window.location.href = `mailto:${CONTATTO.email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(buildText())}`;
}
async function sendToRegia(){
  if(!S.azienda.trim()||!/^\S+@[^\s@]+\.[^\s@]+$/.test(S.email.trim())){sendEmail();return;}
  const cfg=window.MODULA_CONFIG;
  if(!cfg||!window.supabase){toast('Connessione TEST non disponibile');return;}
  const c=buildConfig();
  const db=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
  const{error}=await db.from('configurator_requests').insert({company_name:c.azienda,contact_name:c.referente,contact_email:c.email,contact_phone:c.telefono,configuration:c});
  if(error){toast('Invio non riuscito: '+error.message);return;}
  toast('Richiesta inviata alla Regia ✓');
}
function sendWhatsApp(){
  window.open(`https://wa.me/${CONTATTO.whatsapp}?text=${encodeURIComponent(buildText())}`,'_blank');
}
function copyConfig(){
  const t = buildText();
  (navigator.clipboard?.writeText(t) || Promise.reject()).then(()=>toast('Configurazione copiata ✓')).catch(()=>{
    const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');toast('Configurazione copiata ✓');}catch(e){toast('Copia non riuscita');}
    ta.remove();
  });
}
function toast(msg){ const t=$('#toast'); t.textContent=tr(msg); t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2200); }

/* ---------------- navigazione step ---------------- */
function next(){
  if(S.step===1 && !S.azienda.trim()){ $('#az')?.focus(); toast('Scrivi il nome dell\'azienda'); return; }
  if(S.step===2 && !S.settore){ toast('Scegli un settore'); return; }
  if(S.step<4){ S.step++; if(S.step===4){ S.previewView='hub'; S.device='pc'; } render({focusHeading:true}); }
}
function back(){ if(S.step>1){ S.step--; render({focusHeading:true}); } }

$('#config-demo-dialog').addEventListener('close',()=>{$('#config-demo-host').replaceChildren();document.body.classList.remove('modal-open');});
document.addEventListener('modula:languagechange',()=>render({preserveScroll:true}));
render();
