/* ===== PORTALE CLIENTI — logica (prenota / le mie prenotazioni / profilo) =====
   App per i CLIENTI FINALI di un'azienda. Nessun backend: dati demo + stato runtime.
   Tutto ciò che è "per azienda" sta in CONFIG → si modifica qui per ogni cliente Modula. */

/* ---------- CONFIG AZIENDA (modificabile per ogni cliente) ---------- */
const CONFIG = {
  azienda: 'Bellezza Studio',
  categoria: 'Parrucchiere & Estetica',
  accento: '#A78BFA',           // eredita il colore scelto nel configuratore
  logo: '💇',                    // emoji o, in produzione, un'immagine
  telefono: '+39 351 000 0000',
  indirizzo: 'Via Roma 24, Milano',
  servizi: [
    { id:'taglio',  nome:'Taglio & Piega',     ic:'✂️',  durata:45, prezzo:'35€' },
    { id:'colore',  nome:'Colore',             ic:'🎨',  durata:90, prezzo:'60€' },
    { id:'piega',   nome:'Piega',              ic:'💨',  durata:30, prezzo:'20€' },
    { id:'barba',   nome:'Barba & Rifinitura', ic:'🧔',  durata:25, prezzo:'15€' },
    { id:'mani',    nome:'Manicure',           ic:'💅',  durata:40, prezzo:'25€' },
    { id:'viso',    nome:'Trattamento viso',   ic:'🧖',  durata:60, prezzo:'45€' }
  ],
  // fasce orarie disponibili (demo)
  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30']
};

/* ---------- CLIENTE (chi accede via link — demo) ---------- */
const CLIENTE = { nome:'Giulia Bianchi', tel:'+39 333 12 34 567', email:'giulia.b@email.it', punti:120 };

/* ---------- helpers ---------- */
const $  = (s,r=document)=>r.querySelector(s);
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const servById = id => CONFIG.servizi.find(s=>s.id===id);
const DOW = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
const MON = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
const pad = n => String(n).padStart(2,'0');
const dkey = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function nextDays(n){
  const out=[]; const base=new Date(); base.setHours(0,0,0,0);
  for(let i=0;i<n;i++){ const d=new Date(base); d.setDate(base.getDate()+i); out.push(d); }
  return out;
}
function fmtData(key){
  const [y,m,dd]=key.split('-').map(Number); const d=new Date(y,m-1,dd);
  const t=new Date(); t.setHours(0,0,0,0);
  const diff=Math.round((d-t)/86400000);
  const rel = diff===0?'Oggi':diff===1?'Domani':'';
  return `${rel?rel+' · ':''}${DOW[d.getDay()]} ${dd} ${MON[m-1]}`;
}
// slot "pieni" deterministici per (giorno, servizio) → realismo senza random instabile
function slotFull(dateKey, servId, slot){
  const seed = (dateKey+servId+slot).split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  return seed % 5 === 0;
}

/* ---------- stato ---------- */
const S = { tab:'prenota', flow:null };  // flow = {servId, data, ora, done}

/* prenotazioni: una passata seed + le nuove create in sessione */
function seedPrenotazioni(){
  const past=new Date(); past.setDate(past.getDate()-12);
  return [
    { id:'seed1', servId:'colore', data:dkey(past), ora:'10:30', stato:'passata' }
  ];
}
let PRENOTAZIONI = seedPrenotazioni();
const isFuture = key => { const [y,m,d]=key.split('-').map(Number); const dt=new Date(y,m-1,d); const t=new Date(); t.setHours(0,0,0,0); return dt>=t; };

/* ============================================================ render ============================================================ */
function render(){
  const app=$('#app');
  app.innerHTML = header() + `<div class="main">${tabContent()}</div>` + nav();
}
function header(){
  return `<div class="hd">
    <div class="logo">${CONFIG.logo}</div>
    <div><div class="nm">${esc(CONFIG.azienda)}</div><div class="cat">${esc(CONFIG.categoria)}</div></div>
    <span class="dot"></span>
  </div>`;
}
function nav(){
  const future = PRENOTAZIONI.filter(p=>p.stato!=='annullata' && isFuture(p.data)).length;
  const item=(id,ic,label,badge)=>`<button class="nb ${S.tab===id?'on':''}" onclick="go('${id}')"><span class="i">${ic}</span>${label}${badge?` (${badge})`:''}</button>`;
  return `<div class="nav">
    ${item('prenota','📅','Prenota')}
    ${item('mie','📋','Prenotazioni', future)}
    ${item('profilo','👤','Profilo')}
  </div>`;
}
function tabContent(){
  if(S.tab==='prenota') return tabPrenota();
  if(S.tab==='mie')     return tabMie();
  return tabProfilo();
}
function go(tab){ S.tab=tab; render(); window.scrollTo({top:0,behavior:'smooth'}); }

/* ---------- TAB: PRENOTA ---------- */
function tabPrenota(){
  const first = CLIENTE.nome.split(' ')[0];
  return `
  <div class="greet">Ciao <span class="g">${esc(first)}</span> 👋</div>
  <div class="subtitle">Prenota il tuo prossimo appuntamento da ${esc(CONFIG.azienda)}.</div>
  <div class="sect-h">Scegli un servizio</div>
  ${CONFIG.servizi.map((s,i)=>`
    <div class="serv" style="animation-delay:${i*40}ms" onclick="openFlow('${s.id}')">
      <div class="si">${s.ic}</div>
      <div class="sb"><div class="sn">${esc(s.nome)}</div><div class="sd">Durata ~${s.durata} min</div></div>
      <div class="sp"><div class="pr">${esc(s.prezzo)}</div><div class="du">prenota</div></div>
      <div class="arrow">›</div>
    </div>`).join('')}`;
}

/* ---------- TAB: LE MIE PRENOTAZIONI ---------- */
function tabMie(){
  const att = PRENOTAZIONI.filter(p=>p.stato==='confermata' && isFuture(p.data)).sort((a,b)=>a.data.localeCompare(b.data));
  const stor = PRENOTAZIONI.filter(p=>p.stato==='passata' || (p.stato==='confermata' && !isFuture(p.data)));
  if(!att.length && !stor.length){
    return `<div class="empty"><div class="ei">📭</div><h3>Nessuna prenotazione</h3><p>Quando prenoti un servizio lo trovi qui, con tutti i dettagli.</p><button class="btn" onclick="go('prenota')">Prenota ora</button></div>`;
  }
  let h='';
  if(att.length){ h+=`<div class="sect-h">Prossimi appuntamenti</div>`+att.map(p=>bkCard(p,true)).join(''); }
  if(stor.length){ h+=`<div class="sect-h">Storico</div>`+stor.map(p=>bkCard(p,false)).join(''); }
  return h;
}
function bkCard(p, attivo){
  const s=servById(p.servId)||{nome:p.servId,ic:'•',prezzo:''};
  return `<div class="bk ${attivo?'':'past'}">
    <div class="bk-top">
      <div class="bk-ic">${s.ic}</div>
      <div><div class="bk-nm">${esc(s.nome)}</div><div class="bk-meta">${esc(s.prezzo)} · ~${s.durata||''} min</div></div>
      <span class="bk-badge ${attivo?'ok':'done'}">${attivo?'confermata':'completata'}</span>
    </div>
    <div class="bk-when">
      <span class="bk-chip">📅 <b>${esc(fmtData(p.data))}</b></span>
      <span class="bk-chip">🕐 <b>${esc(p.ora)}</b></span>
    </div>
    ${attivo?`<div class="bk-actions">
      <button class="lnk" onclick="openFlow('${p.servId}')">Riprenota</button>
      <button class="lnk danger" onclick="cancelBk('${p.id}')">Annulla</button>
    </div>`:`<div class="bk-actions"><button class="lnk" onclick="openFlow('${p.servId}')">Prenota di nuovo</button></div>`}
  </div>`;
}
function cancelBk(id){
  const p=PRENOTAZIONI.find(x=>x.id===id); if(!p) return;
  p.stato='annullata';
  PRENOTAZIONI=PRENOTAZIONI.filter(x=>x.id!==id);
  toast('Prenotazione annullata');
  render();
}

/* ---------- TAB: PROFILO ---------- */
function tabProfilo(){
  const initials = CLIENTE.nome.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return `
  <div class="prof-card">
    <div class="prof-av">${esc(initials)}</div>
    <div class="prof-nm">${esc(CLIENTE.nome)}</div>
    <div class="prof-sub">Cliente di ${esc(CONFIG.azienda)}</div>
    <div class="prof-pts">⭐ <b>${CLIENTE.punti}</b> punti fedeltà</div>
  </div>
  <div class="sect-h">I tuoi dati</div>
  <div class="field"><label>Nome e cognome</label><input value="${esc(CLIENTE.nome)}" oninput="CLIENTE.nome=this.value"></div>
  <div class="field"><label>Telefono</label><input value="${esc(CLIENTE.tel)}" oninput="CLIENTE.tel=this.value"></div>
  <div class="field"><label>Email</label><input value="${esc(CLIENTE.email)}" oninput="CLIENTE.email=this.value"></div>
  <div class="sect-h">${esc(CONFIG.azienda)}</div>
  <div class="info-row" onclick="toast('Apertura mappa…')"><span class="ii">📍</span><div><div class="it">${esc(CONFIG.indirizzo)}</div><div class="is">Indicazioni stradali</div></div><span class="arrow">›</span></div>
  <div class="info-row" onclick="toast('Chiamata…')"><span class="ii">📞</span><div><div class="it">${esc(CONFIG.telefono)}</div><div class="is">Chiama il salone</div></div><span class="arrow">›</span></div>
  <div class="powered">Powered by <b>Modula</b></div>`;
}

/* ============================================================ flusso prenotazione ============================================================ */
function openFlow(servId){
  S.tab='prenota';
  S.flow={ servId, data:null, ora:null, done:false };
  renderSheet();
}
function closeFlow(){ S.flow=null; $('#sheet')?.remove(); }
function pickData(k){ S.flow.data=k; S.flow.ora=null; renderSheet(); }
function pickOra(o){ S.flow.ora=o; renderSheet(); }

function renderSheet(){
  $('#sheet')?.remove();
  const f=S.flow; if(!f) return;
  const s=servById(f.servId);
  let inner;
  if(f.done){ inner=sheetDone(s); }
  else{
    const days=nextDays(12);
    const dayChips = days.map(d=>{ const k=dkey(d); return `
      <div class="day ${f.data===k?'on':''}" onclick="pickData('${k}')">
        <div class="dow">${DOW[d.getDay()]}</div>
        <div class="dn">${d.getDate()}</div>
        <div class="dm">${MON[d.getMonth()]}</div>
      </div>`; }).join('');
    const slotEls = CONFIG.slots.map(sl=>{
      const full = f.data?slotFull(f.data,f.servId,sl):false;
      return `<div class="slot ${f.ora===sl?'on':''} ${full?'full':''}" ${full||!f.data?'':`onclick="pickOra('${sl}')"`}>${sl}</div>`;
    }).join('');
    const ready=f.data&&f.ora;
    inner=`
      <div class="sheet-h">
        <div class="si">${s.ic}</div>
        <div><div class="sn">${esc(s.nome)}</div><div class="sd">${esc(s.prezzo)} · ~${s.durata} min</div></div>
        <button class="x" onclick="closeFlow()">✕</button>
      </div>
      <div class="step-lab">1 · Scegli il giorno</div>
      <div class="days">${dayChips}</div>
      <div class="step-lab">2 · Scegli l'ora${f.data?'':' <span style="color:var(--t3);text-transform:none;letter-spacing:0"> — prima seleziona un giorno</span>'}</div>
      <div class="slots" style="${f.data?'':'opacity:.4;pointer-events:none'}">${slotEls}</div>
      <div class="sheet-cta">
        ${ready?`<div class="recap"><span>${esc(fmtData(f.data))} alle <b>${esc(f.ora)}</b></span><b>${esc(s.prezzo)}</b></div>`:''}
        <button class="btn" ${ready?'':'disabled'} onclick="confirmBk()">${ready?'Conferma prenotazione':'Scegli giorno e ora'}</button>
      </div>`;
  }
  const bg=document.createElement('div');
  bg.className='sheet-bg'; bg.id='sheet';
  bg.innerHTML=`<div class="sheet"><div class="sheet-grip"></div>${inner}</div>`;
  bg.addEventListener('click',e=>{ if(e.target===bg && !S.flow?.done) closeFlow(); });
  document.body.appendChild(bg);
}
function sheetDone(s){
  return `<div class="done-screen">
    <div class="done-check">✓</div>
    <h2>Prenotazione confermata!</h2>
    <p>Ti aspettiamo da <b style="color:var(--t1)">${esc(CONFIG.azienda)}</b>. Trovi i dettagli in “Prenotazioni”. Riceverai un promemoria.</p>
    <button class="btn" onclick="closeFlow(); go('mie')">Vedi le mie prenotazioni</button>
    <div style="height:10px"></div>
    <button class="btn ghost" onclick="closeFlow()">Chiudi</button>
  </div>`;
}
let _bkN=0;
function confirmBk(){
  const f=S.flow; if(!f||!f.data||!f.ora) return;
  PRENOTAZIONI.push({ id:'bk'+(++_bkN)+Date.now(), servId:f.servId, data:f.data, ora:f.ora, stato:'confermata' });
  f.done=true;
  renderSheet();
}

/* ---------- toast ---------- */
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2000); }

/* ---------- boot ---------- */
(function init(){
  document.documentElement.style.setProperty('--cy', CONFIG.accento);
  // testo leggibile sopra il colore accento (accenti chiari → ink scuro)
  document.documentElement.style.setProperty('--ink', '#071018');
  render();
})();
