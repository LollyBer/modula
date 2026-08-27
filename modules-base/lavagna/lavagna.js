/* ===== MODULO: LAVAGNA — dashboard componibile su tela libera =====
   Post-it e widget trascinabili liberamente (x/y). PER-UTENTE: ogni amministratore
   ha la sua, in S.settings.boards[empId] (jsonb). Ogni tessera: {id, kind:'postit'|'widget', ..., x,y,w}.
   Dipende dal core (S, uid, save, render, openSheet, esc, toast, moduleActive,
   allEvents, cName, eName, empIdsOf, isOwner, visSites, siteHours, todayIso...). */

let boardEdit=false;
let lavFresh=false; /* true subito dopo aver generato i default → un riordino automatico iniziale */
const LAV_PAD=12; /* margine interno: le tessere non toccano mai la cornice */

/* ---- catalogo widget (Fase 1). module = modulo richiesto per mostrarlo ---- */
const LAV_WIDGETS={
  oggi:{label:'Oggi',ic:'☀️',module:'cal',render:lavwOggi},
  dipendenti:{label:'Dove sono i dipendenti',ic:'👷',module:'emps',render:lavwDip},
  cantieri:{label:'Cantieri aperti',ic:'🏗',module:'sites',render:lavwCantieri},
  rapportini:{label:'Rapportini da compilare',ic:'📸',module:'reports',render:lavwRapportini},
};
const lavWidgetActive=wid=>{const w=LAV_WIDGETS[wid];return w?moduleActive(w.module):false;};

/* ---- colori post-it: [sfondo, testo] ---- */
const POSTIT_COLORS=[['#FBEAC9','#5c3a06'],['#CFF0E1','#0c4a37'],['#FAD9CC','#7a2f14'],['#E6F1FB','#123a5e'],['#DDEFC2','#31530c'],['#EDE0F7','#3d2a5c'],['#FBE3EE','#5c1f3a'],['#FFF4B8','#5a4a06']];
const postitFg=bg=>{const f=POSTIT_COLORS.find(c=>c[0]===bg);return f?f[1]:'#3a3320';};

/* ---- store: lavagna PER-UTENTE — ogni amministratore ha la sua (settings.boards[empId]).
   La vecchia lavagna condivisa (settings.board) resta come sorgente di migrazione: alla
   prima apertura ognuno parte da quel contenuto e poi la sua diverge. ---- */
function myBoardKey(){return (S.session&&S.session.empId)||'x';}
function board(){const bs=(S.settings&&S.settings.boards)||{};const b=bs[myBoardKey()];return Array.isArray(b)?b:[];}
function setBoard(arr){if(!S.settings.boards)S.settings.boards={};S.settings.boards[myBoardKey()]=arr;}
function boardEnsure(){
  if(!S.settings.boards)S.settings.boards={};
  let b=S.settings.boards[myBoardKey()];
  if(!Array.isArray(b)){
    const legacy=Array.isArray(S.settings.board)?S.settings.board:null;
    if(legacy&&legacy.length)b=JSON.parse(JSON.stringify(legacy)); // migra dalla condivisa
    else{b=defaultBoard();lavFresh=true;}
    S.settings.boards[myBoardKey()]=b;
  }
}
function defaultBoard(){
  const t=[];let y=10;
  t.push({id:uid(),kind:'postit',text:'Benvenuto nella Lavagna 📌\nTocca ✏️ per spostare le tessere, e ➕ per aggiungere post-it e widget.',color:'#FBEAC9',done:false,x:10,y,w:210});y+=150;
  ['oggi','dipendenti','cantieri'].forEach(wid=>{if(lavWidgetActive(wid)){t.push({id:uid(),kind:'widget',widget:wid,color:'#5BA02C',x:10,y,w:330});y+=210;}});
  return t;
}

/* ============ RENDER ============ */
function renderLavagna(){
  boardEnsure();
  const tiles=board().filter(t=>t.kind!=='widget'||lavWidgetActive(t.widget));
  $('#main').innerHTML=`
  ${typeof homeToggle==='function'?homeToggle('lavagna'):''}
  <div class="lav-bar">
    <div class="lav-title"><span class="accent" style="background:var(--cy)"></span>Lavagna</div>
    <div style="display:flex;gap:7px">
      <button class="btn sm ${boardEdit?'pri':'ghost'}" onclick="lavToggleEdit()">${boardEdit?'✓ Fatto':'✏️ Modifica'}</button>
      <button class="btn sm ghost" onclick="lavAddSheet()">➕</button>
    </div>
  </div>
  ${boardEdit?`<div class="lav-hint">Trascina le tessere dalla maniglia ⠿. Tocca una tessera per modificarla.</div>`:''}
  <div class="lav-canvas ${boardEdit?'editing':''}" id="lavcanvas">
    ${tiles.length?tiles.map(tileHTML).join(''):'<div class="empty" style="padding:40px 10px">Lavagna vuota. Tocca ➕ per aggiungere.</div>'}
  </div>`;
  requestAnimationFrame(()=>{if(lavFresh){lavFresh=false;lavStack();}lavClamp();lavFit();lavBindDrag();});
}
/* riordino automatico a colonna (misura le altezze reali) — usato solo al primo avvio */
function lavStack(){const c=$('#lavcanvas');if(!c)return;let y=LAV_PAD;const b=board();c.querySelectorAll('.lav-tile').forEach(el=>{const t=b.find(x=>x.id===el.dataset.id);if(!t)return;t.x=LAV_PAD;t.y=y;el.style.left=LAV_PAD+'px';el.style.top=y+'px';y+=el.offsetHeight+12;});save();lavFit();}
/* riporta dentro la cornice le tessere finite fuori/sul bordo (posizioni vecchie) */
function lavClamp(){const c=$('#lavcanvas');if(!c)return;const cw=c.clientWidth;let changed=false;const b=board();
  c.querySelectorAll('.lav-tile').forEach(el=>{const t=b.find(x=>x.id===el.dataset.id);if(!t)return;const ew=el.offsetWidth;
    const maxX=Math.max(LAV_PAD,cw-ew-LAV_PAD);
    const nx=Math.max(LAV_PAD,Math.min(t.x||LAV_PAD,maxX)),ny=Math.max(LAV_PAD,t.y||LAV_PAD);
    if(nx!==t.x||ny!==t.y){t.x=Math.round(nx);t.y=Math.round(ny);el.style.left=t.x+'px';el.style.top=t.y+'px';changed=true;}});
  if(changed){save();lavFit();}
}
function lavToggleEdit(){boardEdit=!boardEdit;render();}

function tileHTML(t){
  const w=t.w||(t.kind==='postit'?170:320);
  const x=Math.max(LAV_PAD,t.x||LAV_PAD),y=Math.max(LAV_PAD,t.y||LAV_PAD);
  /* larghezza limitata così il bordo destro non supera mai il margine: la tessera resta dentro la cornice */
  const pos=`left:${x}px;top:${y}px;width:min(${w}px, calc(100% - ${x+LAV_PAD}px))`;
  const handle=boardEdit?`<div class="lav-drag" data-id="${t.id}">⠿</div><button class="lav-del" onclick="lavDel('${t.id}')">✕</button>`:'';
  if(t.kind==='postit'){
    const bg=t.color||'#FBEAC9',fg=postitFg(bg);
    return `<div class="lav-tile postit ${t.done?'done':''}" data-id="${t.id}" style="${pos};background:${bg};color:${fg}" onclick="${boardEdit?'':`lavPostit('${t.id}')`}">
      ${handle}
      ${boardEdit?'':`<button class="pit-chk" style="border-color:${fg}88;${t.done?`background:${fg}`:''}" onclick="event.stopPropagation();lavPostitDone('${t.id}')">${t.done?'✓':''}</button>`}
      <div class="pit-txt">${esc(t.text||'').replace(/\n/g,'<br>')||'<span style="opacity:.5">post-it vuoto</span>'}</div>
    </div>`;
  }
  const W=LAV_WIDGETS[t.widget]||{label:t.widget,ic:'▫️',render:()=>''};
  const acc=t.color||'#5BA02C';
  return `<div class="lav-tile widget" data-id="${t.id}" style="${pos}" onclick="${boardEdit?`lavTileCfg('${t.id}')`:''}">
    ${handle}
    <div class="lavw-head" style="border-color:${acc}"><span style="font-size:14px">${W.ic}</span><span class="lavw-t">${esc(t.title||W.label)}</span></div>
    <div class="lavw-body">${W.render(t)}</div>
  </div>`;
}

/* ============ WIDGET RENDERERS ============ */
function lavwOggi(){
  const t=todayIso();
  const ev=allEvents().filter(e=>e.date===t).sort((a,b)=>((a.time||'99')<(b.time||'99')?-1:1));
  if(!ev.length)return `<div class="lavw-empty">Niente in programma oggi 🌊</div>`;
  return ev.slice(0,8).map(e=>{const M=(typeof TYPE_META!=='undefined'&&TYPE_META[e.type])||{hex:'#888'};return `<div class="lavw-row">
    <span class="lavw-time">${e.time||'—'}</span><span class="lavw-bar" style="background:${M.hex}"></span>
    <span class="lavw-main"><span class="lavw-ti ${e.done?'done':''}">${esc(e.title||'')}</span>${e.sub?`<span class="lavw-su">${esc(e.sub)}</span>`:''}</span></div>`;}).join('');
}
function lavEmpToday(id){
  const t=todayIso(),out=[];
  if(moduleActive('man'))S.maintenances.forEach(m=>{if(m.date===t&&empIdsOf(m).includes(id))out.push('🔧 '+(cName(m.clientId)||m.clientRaw||m.title||'manutenzione'));});
  if(moduleActive('sites'))S.sites.forEach(s=>{if(s.status==='aperto'&&(s.employees||[]).includes(id))out.push('🏗 '+s.name);});
  S.appointments.forEach(a=>{if(a.date===t&&empIdsOf(a).includes(id))out.push('📅 '+(a.title||'appuntamento'));});
  if(moduleActive('pellet'))S.pellet.forEach(p=>{if(p.date===t&&empIdsOf(p).includes(id))out.push('🪵 '+(cName(p.clientId)||p.clientRaw||'consegna'));});
  return out;
}
const LAV_AV=['#C77F12','#5E9E2E','#A9742F','#2E9E5E','#D64528','#7C5CBF','#3B6D91'];
const lavAvColor=s=>LAV_AV[([...String(s||'')].reduce((a,c)=>a+c.charCodeAt(0),0))%LAV_AV.length];
function lavInitials(n){return String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';}
function lavwDip(){
  const emps=S.employees.filter(e=>e.active!==false);
  if(!emps.length)return `<div class="lavw-empty">Nessun dipendente.</div>`;
  return emps.slice(0,10).map(e=>{const w=lavEmpToday(e.id);const col=lavAvColor(e.name);const busy=w.length;return `<div class="lavw-emp">
    <span class="lavw-av" style="background:${col}">${esc(lavInitials(e.name))}</span>
    <span class="lavw-main"><span class="lavw-ti">${esc(e.name)}${e.isOwner?' 👑':''}</span><span class="lavw-su">${busy?esc(w[0]):'nessun incarico oggi'}${w.length>1?' · +'+(w.length-1):''}</span></span>
    <span class="lavw-dot" style="background:${busy?'#2E9E5E':'#9C9384'}"></span></div>`;}).join('');
}
function lavwCantieri(){
  const sites=(typeof visSites==='function'?visSites():S.sites).filter(s=>s.status==='aperto');
  if(!sites.length)return `<div class="lavw-empty">Nessun cantiere aperto 🏗</div>`;
  return sites.slice(0,8).map(s=>{const hrs=typeof siteHours==='function'?siteHours(s):0;const pct=s.estHours?Math.min(100,Math.round(hrs/s.estHours*100)):null;return `<div class="lavw-site">
    <div class="lavw-ti">${esc(s.name)}</div><div class="lavw-su">${esc(cName(s.clientId)||s.clientRaw||'—')}</div>
    ${s.estHours?`<div class="lavw-prog"><i style="width:${pct}%;${pct>=100?'background:var(--amber)':''}"></i></div><div class="lavw-su">${hrs}h / ${s.estHours}h · ${pct}%</div>`:`<div class="lavw-su">${hrs}h</div>`}</div>`;}).join('');
}

function lavwRapportini(){
  const id=S.session&&S.session.empId;
  const todo=(typeof reportsToFill==='function')?reportsToFill(id):[];
  if(!todo.length)return `<div class="lavw-empty">Nessun rapportino da compilare 👍</div>`;
  return todo.map(s=>`<div class="lavw-row" style="cursor:pointer" onclick="openReport(null,'${s.id}')"><span class="lavw-bar" style="background:#C77F12"></span><span class="lavw-main"><span class="lavw-ti">${esc(s.name)}</span><span class="lavw-su">tocca per il rapporto di oggi ›</span></span></div>`).join('');
}

/* ============ DRAG (tela libera, mouse + touch) ============ */
function lavFit(){const c=$('#lavcanvas');if(!c)return;let max=0;c.querySelectorAll('.lav-tile').forEach(el=>{max=Math.max(max,el.offsetTop+el.offsetHeight);});c.style.height=(max+60)+'px';}
function lavBindDrag(){
  if(!boardEdit)return;const c=$('#lavcanvas');if(!c)return;
  c.querySelectorAll('.lav-drag').forEach(h=>{
    h.addEventListener('pointerdown',e=>{
      e.preventDefault();e.stopPropagation();
      const el=h.closest('.lav-tile');const id=h.dataset.id;const t=board().find(x=>x.id===id);if(!t)return;
      const sx=e.clientX,sy=e.clientY,ox=t.x||0,oy=t.y||0,cw=c.clientWidth,ew=el.offsetWidth;
      let nx=ox,ny=oy;
      h.setPointerCapture(e.pointerId);el.classList.add('dragging');
      const mv=ev=>{nx=Math.max(LAV_PAD,Math.min(ox+(ev.clientX-sx),Math.max(LAV_PAD,cw-ew-LAV_PAD)));ny=Math.max(LAV_PAD,oy+(ev.clientY-sy));el.style.left=nx+'px';el.style.top=ny+'px';};
      const up=()=>{h.releasePointerCapture(e.pointerId);h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);el.classList.remove('dragging');t.x=Math.round(nx);t.y=Math.round(ny);save();lavFit();};
      h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);
    });
  });
}

/* ============ AZIONI TESSERE ============ */
function lavDel(id){if(!confirm('Eliminare questa tessera?'))return;setBoard(board().filter(t=>t.id!==id));save();render();}
function lavPostitDone(id){const t=board().find(x=>x.id===id);if(!t)return;t.done=!t.done;save();render();}
function lavAddSheet(){
  const widgets=Object.keys(LAV_WIDGETS).filter(lavWidgetActive);
  openSheet(`<h3>➕ Aggiungi alla lavagna <span class="x" onclick="closeSheet()">✕</span></h3>
   <button class="btn pri" style="width:100%;margin-bottom:12px" onclick="closeSheet();lavPostit()">📌 Nuovo post-it</button>
   <div class="subtle" style="margin:6px 0 8px">Widget dai tuoi moduli attivi:</div>
   ${widgets.map(wid=>{const W=LAV_WIDGETS[wid];return `<button class="btn ghost" style="width:100%;justify-content:flex-start;margin-bottom:7px;text-align:left" onclick="lavAddWidget('${wid}')">${W.ic} ${esc(W.label)}</button>`;}).join('')||'<div class="empty">Nessun widget disponibile (dipende dai moduli attivi).</div>'}`);
}
function lavAddWidget(wid){const y=board().reduce((m,t)=>Math.max(m,(t.y||0)+140),10);setBoard(board().concat([{id:uid(),kind:'widget',widget:wid,color:'#5BA02C',x:10,y,w:330}]));save();closeSheet();boardEdit=true;render();toast('Widget aggiunto — trascinalo dove vuoi');}
function lavPostit(id){
  const t=id?board().find(x=>x.id===id):null;
  const cur=t||{text:'',color:'#FBEAC9'};
  openSheet(`<h3>${id?'Post-it':'Nuovo post-it'} <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="fld"><textarea id="pit-t" rows="4" placeholder="Cosa c'è da fare…">${esc(cur.text||'')}</textarea></div>
   <div class="fld"><label>Colore</label><div class="pit-cols">${POSTIT_COLORS.map(c=>`<span class="pit-col ${cur.color===c[0]?'on':''}" style="background:${c[0]}" onclick="lavPickCol(this,'${c[0]}')" data-c="${c[0]}"></span>`).join('')}</div></div>
   <div class="actions">${id?`<button class="btn danger" onclick="lavDel('${id}')">Elimina</button>`:''}<button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="lavSavePostit('${id||''}')">Salva</button></div>`);
}
function lavPickCol(el,c){el.parentNode.querySelectorAll('.pit-col').forEach(x=>x.classList.remove('on'));el.classList.add('on');window._pitCol=c;}
function lavSavePostit(id){
  const text=$('#pit-t').value.trim();
  const sel=document.querySelector('.pit-col.on');const color=window._pitCol||(sel&&sel.dataset.c)||'#FBEAC9';
  if(!text){toast('Scrivi qualcosa');return;}
  if(id){const t=board().find(x=>x.id===id);if(t){t.text=text;t.color=color;}}
  else{const y=board().reduce((m,t)=>Math.max(m,(t.y||0)+120),10);setBoard(board().concat([{id:uid(),kind:'postit',text,color,done:false,x:10,y,w:180}]));}
  window._pitCol=null;save();closeSheet();render();toast('✓ Post-it salvato');
}
/* configurazione widget: titolo, colore accento, larghezza */
function lavTileCfg(id){
  const t=board().find(x=>x.id===id);if(!t)return;
  const W=LAV_WIDGETS[t.widget]||{label:t.widget};
  const cols=['#5BA02C','#C77F12','#2E9E5E','#D64528','#A9742F','#7C5CBF'];
  openSheet(`<h3>Widget: ${esc(W.label)} <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="fld"><label>Titolo</label><input id="w-title" value="${esc(t.title||W.label)}"></div>
   <div class="fld"><label>Colore</label><div class="pit-cols">${cols.map(c=>`<span class="pit-col ${(t.color||'#5BA02C')===c?'on':''}" style="background:${c}" onclick="lavPickCol(this,'${c}')" data-c="${c}"></span>`).join('')}</div></div>
   <div class="fld"><label>Larghezza</label><div class="seg" id="w-size">${[['Stretta',220],['Media',330],['Larga',460]].map(o=>`<div class="sg ${(t.w||330)===o[1]?'on':''}" onclick="segPick(this)" data-w="${o[1]}">${o[0]}</div>`).join('')}</div></div>
   <div class="actions"><button class="btn danger" onclick="lavDel('${id}')">Elimina</button><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="lavSaveTile('${id}')">Salva</button></div>`);
}
function lavSaveTile(id){
  const t=board().find(x=>x.id===id);if(!t)return;
  t.title=$('#w-title').value.trim()||null;
  const sel=document.querySelector('#w-size .sg.on');if(sel)t.w=parseInt(sel.dataset.w)||t.w;
  const c=document.querySelector('.pit-col.on');if(c)t.color=c.dataset.c;
  save();closeSheet();render();toast('✓ Widget aggiornato');
}
