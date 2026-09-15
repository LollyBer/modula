/* ===== MODULO EXTRA: MANUTENZIONI (+ bollettino) ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= MANUTENZIONI ================= */
let manTab='aperte';
function getCall(clientId){
  const yr=new Date().getFullYear();
  let c=S.callLog.find(x=>x.clientId===clientId&&x.year===yr);
  if(!c){c={id:uid(),clientId,year:yr,called:false,outcome:'',note:'',maintId:null};S.callLog.push(c);}
  return c;
}
function manRow(m){
  const t=todayIso();
  const late=m.date&&m.date<t&&m.status!=='fatta';
  const col=late?'#D64528':(m.status==='fatta'?'#2E9E5E':m.status==='programmata'?'#5BA02C':'#C77F12');
  const who=cName(m.clientId)||m.clientRaw||'';
  const ic=MAINT_ICONS[m.type]||'🔧';
  return`<div class="frw" style="border-left-color:${col}" onclick="openMan('${m.id}')">
    <div class="avat" style="width:34px;height:34px;background:${col}22;border:1px solid ${col}55;font-size:15px;font-weight:400">${ic}</div>
    <div class="bd"><div class="ti">${who?`<b>${esc(who)}</b> — `:''}${esc(m.title)}</div>
    <div class="su">${m.date?'📅 '+fmtD(m.date)+(m.time?' · '+m.time:''):'senza data'}${empNames(m)?' · 👷 '+esc(empNames(m)):''}${late?' · <span style="color:#D64528">in ritardo</span>':''}</div></div>
    ${m.status!=='fatta'?`<button class="qbtn" onclick="event.stopPropagation();startBollettino('${m.id}')">▶ Avvia</button>`:(m.report?`<button class="qbtn ghost" onclick="event.stopPropagation();viewBollettino('${m.id}')">📄</button>`:'')}
  </div>`;
}
function renderMan(){
  const t=todayIso();const yr=new Date().getFullYear();const mk=t.slice(0,7);
  if(manTab==='chiamate'){if(!isOwner()&&!can('clients')){manTab='aperte';}else{renderCalls();return;}}
  const all=visMan();
  const nOpen=all.filter(m=>m.status!=='fatta').length;
  const nLate=all.filter(m=>m.status!=='fatta'&&m.date&&m.date<t).length;
  const nDoneM=all.filter(m=>m.status==='fatta'&&m.date&&m.date.slice(0,7)===mk).length;
  const byDate=(a,b)=>((a.date||'9999')<(b.date||'9999')?-1:1);
  let body;
  if(manTab==='aperte'){
    const open=all.filter(m=>m.status!=='fatta');
    const late=open.filter(m=>m.date&&m.date<t).sort(byDate);
    const upc=open.filter(m=>m.date&&m.date>=t).sort(byDate);
    const noD=open.filter(m=>!m.date);
    body=(late.length?`<div class="grp" style="color:var(--coral)">⚠ IN RITARDO (${late.length})</div>`+late.map(manRow).join(''):'')
      +(upc.length?`<div class="grp">📅 PROSSIME (${upc.length})</div>`+upc.map(manRow).join(''):'')
      +(noD.length?`<div class="grp">◷ DA PROGRAMMARE (${noD.length})</div>`+noD.map(manRow).join(''):'')
      +(!open.length?'<div class="empty tall"><div class="big">🔧</div>Niente da fare. 👌<button class="btn pri sm cta" onclick="openMan(null)">+ Nuova manutenzione</button></div>':'');
  }else{
    let list=all.slice();
    if(manTab==='fatte')list=list.filter(m=>m.status==='fatta');
    list.sort((a,b)=>((a.date||'')>(b.date||'')?-1:1));
    body=list.length?list.map(manRow).join(''):'<div class="empty"><div class="big">🔧</div>Nessuna manutenzione qui.</div>';
  }
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--amber)"></span>Manutenzioni <span class="subtle">(${all.length})</span></div>
  <div class="tabs">
    <div class="tb ${manTab==='aperte'?'on':''}" onclick="manTab='aperte';render()">Aperte (${nOpen})</div>
    <div class="tb ${manTab==='fatte'?'on':''}" onclick="manTab='fatte';render()">Fatte</div>
    <div class="tb ${manTab==='tutte'?'on':''}" onclick="manTab='tutte';render()">Tutte</div>
    ${isOwner()||can('clients')?`<div class="tb ${manTab==='chiamate'?'on':''}" onclick="manTab='chiamate';render()">📞 Chiamate ${yr}</div>`:''}
  </div>
  <div class="kpis" style="grid-template-columns:repeat(3,1fr)">
    <div class="kpi"><div class="n" style="color:var(--coral)">${nLate}</div><div class="l">In ritardo</div></div>
    <div class="kpi"><div class="n" style="color:var(--amber)">${nOpen}</div><div class="l">Da fare</div></div>
    <div class="kpi"><div class="n" style="color:var(--teal)">${nDoneM}</div><div class="l">Fatte (mese)</div></div>
  </div>
  ${body}
  <button class="fab" onclick="openMan(null)">+</button>`;
}
/* ---- campagna chiamate stagionali ---- */
function renderCalls(){
  const yr=new Date().getFullYear();
  const pool=S.clients.filter(c=>c.maintenance!=='no').sort((a,b)=>a.name.localeCompare(b.name));
  const states=pool.map(c=>{
    const cl=S.callLog.find(x=>x.clientId===c.id&&x.year===yr)||{called:false,outcome:''};
    return{c,cl};
  });
  const daChiamare=states.filter(s=>!s.cl.called);
  const chiamati=states.filter(s=>s.cl.called);
  const siN=states.filter(s=>s.cl.outcome==='si').length;
  const noN=states.filter(s=>s.cl.outcome==='no').length;
  const row=({c,cl})=>{
    const col=!cl.called?'var(--t3)':cl.outcome==='si'?'var(--teal)':cl.outcome==='no'?'var(--coral)':'var(--amber)';
    const lbl=!cl.called?'da chiamare':cl.outcome==='si'?'✓ la fa':cl.outcome==='no'?'✗ non la fa':'📞 chiamato';
    const m=cl.maintId?byId(S.maintenances,cl.maintId):null;
    return`<div class="item" onclick="openCall('${c.id}')">
    <span class="led" style="background:${col}"></span>
    <div class="bd"><div class="ti">${esc(c.name)}</div>
    <div class="su">${[c.group,c.zone,c.plant].filter(Boolean).map(esc).join(' · ')||'—'}</div>
    <div class="mt">${m&&m.date?'📅 fissata: '+fmtD(m.date):cl.note?esc(cl.note):''}</div></div>
    <div class="right"><span class="badge" style="border-color:${col};color:${col}">${lbl}</span>
    ${c.phone?`<div style="margin-top:7px"><a href="tel:${esc(c.phone)}" onclick="event.stopPropagation()" class="row-act">📞 CHIAMA</a></div>`:''}</div></div>`;
  };
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--amber)"></span>Manutenzioni</div>
  <div class="tabs">
    <div class="tb" onclick="manTab='aperte';render()">Aperte</div>
    <div class="tb" onclick="manTab='fatte';render()">Fatte</div>
    <div class="tb" onclick="manTab='tutte';render()">Tutte</div>
    <div class="tb on">📞 Chiamate ${yr}</div>
  </div>
  <div class="stats">
    <div class="stat"><div class="n">${chiamati.length}/${pool.length}</div><div class="l">Chiamati</div></div>
    <div class="stat"><div class="n" style="color:var(--teal)">${siN}</div><div class="l">La fanno</div></div>
    <div class="stat"><div class="n" style="color:var(--coral)">${noN}</div><div class="l">Non la fanno</div></div>
  </div>
  <div class="card"><div class="sh"><span class="t">Da chiamare (${daChiamare.length})</span></div>
    ${daChiamare.length?daChiamare.map(row).join(''):'<div class="empty">Tutti chiamati! 🎉</div>'}</div>
  ${chiamati.length?`<div class="card"><div class="sh"><span class="t" style="color:var(--t2)">Chiamati</span></div>${chiamati.map(row).join('')}</div>`:''}
  ${pool.length===0?'<div class="card"><div class="empty">Nessun cliente. I clienti con "Fa manutenzione: no" sono esclusi da questa lista.</div></div>':''}`;
}
function openCall(clientId){
  const c=byId(S.clients,clientId);const cl=getCall(clientId);
  const m=cl.maintId?byId(S.maintenances,cl.maintId):null;
  openSheet(`<h3>📞 ${esc(c.name)} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px">${[c.phone?'📞 '+c.phone:'',c.group,c.zone,c.plant].filter(Boolean).map(esc).join(' · ')}</div>
  <div class="fld"><label>Chiamato?</label><div class="seg" id="cc-called">
    <div class="sg ${cl.called?'on':''}" data-v="1" onclick="segPick(this)">📞 Sì</div>
    <div class="sg ${!cl.called?'on':''}" data-v="0" onclick="segPick(this)">Non ancora</div></div></div>
  <div class="fld"><label>La fa?</label><div class="seg" id="cc-out">
    <div class="sg ${cl.outcome==='si'?'on':''}" data-v="si" onclick="segPick(this)">✓ Sì</div>
    <div class="sg ${cl.outcome==='no'?'on':''}" data-v="no" onclick="segPick(this)">✗ No</div>
    <div class="sg ${!cl.outcome?'on':''}" data-v="" onclick="segPick(this)">Da decidere</div></div></div>
  <div class="frow"><div class="fld"><label>Quando (fissa la manutenzione)</label><input id="cc-d" type="date" value="${m&&m.date?m.date:''}"></div>
  <div class="fld"><label>Ora</label><input id="cc-h" type="time" value="${m&&m.time?m.time:''}"></div></div>
  ${dateChips('cc-d')}
  <div class="fld"><label>Perché / note</label><textarea id="cc-n" placeholder="es. richiamare a settembre, ha cambiato stufa…">${esc(cl.note||'')}</textarea></div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveCall('${clientId}')">Salva</button></div>`);
}
function saveCall(clientId){
  const c=byId(S.clients,clientId);const cl=getCall(clientId);
  cl.called=$('#cc-called .sg.on')?.dataset.v==='1';
  cl.outcome=$('#cc-out .sg.on')?.dataset.v||'';
  cl.note=$('#cc-n').value.trim();
  const d=$('#cc-d').value||null,h=$('#cc-h').value||null;
  if(cl.outcome==='si'&&d){
    let m=cl.maintId?byId(S.maintenances,cl.maintId):null;
    if(m){m.date=d;m.time=h;m.status='programmata';}
    else{
      m={id:uid(),title:'Manutenzione '+(c.plant?c.plant.toLowerCase():'stagionale'),clientId,clientRaw:null,employeeId:null,date:d,time:h,status:'programmata',notes:cl.note,recur:12,via:'chiamate',created:Date.now()};
      S.maintenances.unshift(m);cl.maintId=m.id;
    }
    toast('🔧 Manutenzione fissata — '+fmtD(d));
  }else toast('📞 Salvato');
  save();closeSheet();render();
}
function openMan(id){
  const m=id?byId(S.maintenances,id):{title:'',clientId:null,employeeId:null,date:'',time:'',status:'da_fare',notes:'',recur:0};
  openSheet(`<h3>${id?'Manutenzione':'Nuova manutenzione'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Descrizione</label><input id="mn-t" value="${esc(m.title)}" placeholder="es. Pulizia caldaia pellet"></div>
  <div class="fld"><label>Cliente</label><select id="mn-c" onchange="updClientPrev(this,'mn-cprev')"><option value="">${(m.clientRaw&&!m.clientId)?'🆕 '+esc(m.clientRaw)+' (nuovo)':'—'}</option>${cOpt(m.clientId)}</select><div id="mn-cprev">${clientPreviewHTML(m.clientId)}</div></div>
  <div class="fld"><label>Assegna a (uno o più)</label>${empSeg('mn-e',empIdsOf(m))}</div>
  <div class="frow"><div class="fld"><label>Data</label><input id="mn-d" type="date" value="${m.date||''}"></div>
  <div class="fld"><label>Ora</label><input id="mn-h" type="time" value="${m.time||''}"></div></div>
  ${dateChips('mn-d')}
  <div class="frow"><div class="fld"><label>Tipo impianto</label><select id="mn-tp"><option value="" ${!m.type?'selected':''}>— tipo —</option>${MAINT_KINDS.map(([k,l])=>`<option value="${k}" ${m.type===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="fld"><label>Ricorrenza</label><select id="mn-r">${[[0,'Nessuna'],[6,'Ogni 6 mesi'],[12,'Ogni anno'],[24,'Ogni 2 anni']].map(([v,l])=>`<option value="${v}" ${(m.recur||0)===v?'selected':''}>${l}</option>`).join('')}</select></div></div>
  <div class="fld"><label>Stato</label><div class="seg" id="mn-s">${['da_fare','programmata','fatta'].map(s=>`<div class="sg ${m.status===s?'on':''}" data-s="${s}" onclick="this.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));this.classList.add('on')">${s.replace('_',' ')}</div>`).join('')}</div></div>
  <div class="fld"><label>Note</label><textarea id="mn-n">${esc(m.notes||'')}</textarea></div>
  ${id&&m.status!=='fatta'?`<button class="btn pri" style="width:100%;margin-bottom:10px" onclick="startBollettino('${id}')">▶ Avvia intervento (bollettino)</button>`:''}
  ${id&&typeof macCanCatalog==='function'&&macCanCatalog()?`<button class="btn" style="width:100%;margin-bottom:10px;border-color:var(--cy);color:var(--cy)" onclick="macFromMaint('${id}')">⚙️ Scheda macchina · compila tagliando</button>`:''}
  ${id&&m.report?`<button class="btn" style="width:100%;margin-bottom:10px;border-color:var(--teal);color:var(--teal)" onclick="viewBollettino('${id}')">📄 Vedi bollettino firmato</button>`:''}
  ${m.clientId?`<button class="btn" style="width:100%;margin-bottom:10px;border-color:var(--blue);color:var(--blue)" onclick="zoneFromSheet('mn-c')">📍 Vedi il cliente sulla mappa</button>`:''}
  <div class="actions">
    ${id?`<button class="btn danger" onclick="delItem('maintenances','${id}')">Elimina</button>`:''}
    <button class="btn pri" onclick="saveMan('${id||''}')">Salva</button></div>`);
}
function saveMan(id){
  const data={title:$('#mn-t').value.trim(),clientId:$('#mn-c').value||null,employees:empSegRead('mn-e'),date:$('#mn-d').value||null,time:$('#mn-h').value||null,status:$('#mn-s .sg.on')?.dataset.s||'da_fare',notes:$('#mn-n').value.trim(),recur:+($('#mn-r')?.value||0),type:$('#mn-tp')?.value||null};
  if(!data.title){toast('Manca la descrizione');return;}
  const old=id?byId(S.maintenances,id):null;
  const wasFatta=old?old.status==='fatta':false;const prevEmps=old?empIdsOf(old):[];
  if(id){Object.assign(old,data);}else{S.maintenances.unshift({id:uid(),clientRaw:null,via:'manuale',created:Date.now(),...data});}
  const added=data.employees.filter(e=>!prevEmps.includes(e));
  if(added.length&&data.status!=='fatta')pushNotify(added,'🔧 Manutenzione assegnata',`${cName(data.clientId)||(old&&old.clientRaw)||''} — ${data.title}${data.date?' · '+fmtD(data.date):''}${data.time?' '+data.time:''}`);
  let extra='';
  if(data.status==='fatta'&&!wasFatta&&data.recur>0){
    const nextDate=addMonthsIso(data.date||todayIso(),data.recur);
    S.maintenances.unshift({id:uid(),title:data.title,clientId:data.clientId,clientRaw:old?old.clientRaw:null,employees:data.employees,date:nextDate,time:data.time,status:'programmata',notes:'',recur:data.recur,type:data.type,via:'ricorrenza',created:Date.now()});
    extra=' · 🔁 prossima creata per '+fmtD(nextDate);
  }
  save();closeSheet();render();toast('🔧 Salvato'+extra);
}

/* ================= BOLLETTINO INTERVENTO ================= */
const DEFAULT_TASKS=['Pulizia braciere','Pulizia scambiatore di calore','Pulizia cassetto cenere','Pulizia giro fumi','Pulizia valvole di ispezione','Controllo componenti di usura (motoriduttori e estrattore fumi, ingranaggio pulizia automatica)','Pulizia serbatoio pellet','Prova di combustione'];
const LOGO_URL=(typeof BRAND!=='undefined'&&BRAND.logo)?BRAND.logo:''; /* logo nei report — per-azienda, da BRAND.logo */
let blt=null; // bozza bollettino corrente
function startBollettino(id){
  const m=byId(S.maintenances,id);if(!m)return;
  // prefill macchina dall'ultimo bollettino dello stesso cliente
  let machine={type:'Stufa pellet',brand:''};
  if(m.clientId){
    const prev=S.maintenances.find(x=>x.clientId===m.clientId&&x.report&&x.id!==id);
    if(prev)machine={...prev.report.machine};
  }
  blt={mid:id,machine,tasks:DEFAULT_TASKS.map(t=>({text:t,done:false})),parts:[],outcome:'completo',notes:'',techId:m.employeeId||S.speaker||'me',signature:null,signedName:cName(m.clientId)||m.clientRaw||''};
  renderBollettino();
}
function renderBollettino(){
  const m=byId(S.maintenances,blt.mid);
  openSheet(`<h3>📋 Bollettino d'intervento <span class="x" onclick="if(confirm('Uscire senza salvare il bollettino?'))closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px"><b style="color:var(--t1)">${esc(cName(m.clientId)||m.clientRaw||'Cliente')}</b> · ${esc(m.title)} · ${fmtD(todayIso())}</div>
  <div class="frow">
    <div class="fld"><label>Apparecchio</label><select id="bl-mt">${['Stufa pellet','Caldaia pellet','Stufa legna','Caldaia legna','Camino','Termocamino','Altro'].map(t=>`<option ${blt.machine.type===t?'selected':''}>${t}</option>`).join('')}</select></div>
    <div class="fld"><label>Marca / Modello</label><input id="bl-mb" value="${esc(blt.machine.brand)}" placeholder="es. NOBIS Polygon 25"></div>
  </div>
  <div class="fld"><label>Tecnico</label><select id="bl-te">${S.employees.map(e=>`<option value="${e.id}" ${blt.techId===e.id?'selected':''}>${esc(e.name)}</option>`).join('')}</select></div>
  <div class="fld"><label>Lavori eseguiti — tocca per spuntare</label>
    ${blt.tasks.map((t,i)=>`<div class="blt-task" onclick="blt.tasks[${i}].done=!blt.tasks[${i}].done;bltRefreshTask(${i},this)">
      <span class="ck-box ${t.done?'':''}" style="${t.done?'background:var(--teal);border-color:var(--teal)':''}">${t.done?'✓':''}</span>
      <span style="font-size:13px;flex:1;${t.done?'':'color:var(--t2)'}">${esc(t.text)}</span></div>`).join('')}
    <div class="ck-add"><input id="bl-newtask" placeholder="Altro lavoro eseguito…" onkeydown="if(event.key==='Enter')bltAddTask()"><button onclick="bltAddTask()">+</button></div>
  </div>
  <div class="fld"><label>Pezzi sostituiti / aggiunti</label>
    <div id="bl-parts">${blt.parts.map((p,i)=>`<div class="part-row"><input value="${esc(p.name)}" oninput="blt.parts[${i}].name=this.value" placeholder="Pezzo"><input value="${esc(p.qty)}" oninput="blt.parts[${i}].qty=this.value" placeholder="Q.tà"></div>`).join('')}</div>
    <button class="btn sm ghost" onclick="blt.parts.push({name:'',qty:'1'});renderBollettino()">+ Aggiungi pezzo</button>
  </div>
  <div class="fld"><label>Esito</label><div class="seg" id="bl-out">
    ${[['completo','✓ Tutto eseguito'],['parziale','⚠ Da completare'],['anomalia','✗ Anomalia riscontrata']].map(([v,l])=>`<div class="sg ${blt.outcome===v?'on':''}" onclick="blt.outcome='${v}';this.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));this.classList.add('on')">${l}</div>`).join('')}
  </div></div>
  <div class="fld"><label>Note / raccomandazioni</label><textarea id="bl-no" oninput="blt.notes=this.value">${esc(blt.notes)}</textarea></div>
  <div class="fld"><label>Firma del cliente</label>
    <div class="sig-wrap"><canvas class="sig-canvas" id="sigpad"></canvas><div class="sig-hint" id="sighint">firma qui con il dito</div></div>
    <div class="sig-tools">
      <input id="bl-sn" value="${esc(blt.signedName)}" oninput="blt.signedName=this.value" placeholder="Nome di chi firma" style="background:var(--bg2);border:1px solid var(--line);border-radius:9px;color:var(--t1);font-size:12.5px;padding:7px 10px;outline:none;flex:1;margin-right:8px">
      <button class="btn sm ghost" onclick="sigClear()">Cancella firma</button>
    </div>
  </div>
  <div class="actions">
    <button class="btn ghost" onclick="if(confirm('Uscire senza salvare?'))closeSheet()">Annulla</button>
    <button class="btn pri" onclick="saveBollettino()">✓ Concludi e firma</button>
  </div>`);
  setTimeout(sigInit,50);
}
function bltRefreshTask(i,el){
  const t=blt.tasks[i];
  el.querySelector('.ck-box').style.cssText=t.done?'background:var(--teal);border-color:var(--teal)':'';
  el.querySelector('.ck-box').textContent=t.done?'✓':'';
  el.querySelectorAll('span')[1].style.color=t.done?'':'var(--t2)';
}
function bltAddTask(){
  const inp=$('#bl-newtask');const v=inp.value.trim();if(!v)return;
  blt.tasks.push({text:v,done:true});renderBollettino();
}
/* firma */
let sigDrawn=false;
function sigInit(){
  const c=$('#sigpad');if(!c)return;
  const dpr=window.devicePixelRatio||1;
  const w=c.offsetWidth,h=c.offsetHeight;
  c.width=w*dpr;c.height=h*dpr;
  const ctx=c.getContext('2d');ctx.scale(dpr,dpr);
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#16243a';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';
  sigDrawn=!!blt.signature;
  if(blt.signature){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,w,h);img.src=blt.signature;$('#sighint').style.display='none';}
  let down=false,lx=0,ly=0;
  const pos=e=>{const r=c.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];};
  c.addEventListener('pointerdown',e=>{e.preventDefault();down=true;[lx,ly]=pos(e);$('#sighint').style.display='none';c.setPointerCapture(e.pointerId);});
  c.addEventListener('pointermove',e=>{if(!down)return;e.preventDefault();const[x,y]=pos(e);ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(x,y);ctx.stroke();lx=x;ly=y;sigDrawn=true;});
  const up=e=>{if(down){down=false;blt.signature=c.toDataURL('image/png');}};
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
}
function sigClear(){
  blt.signature=null;sigDrawn=false;
  const c=$('#sigpad');const dpr=window.devicePixelRatio||1;
  const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width/dpr,c.height/dpr);
  $('#sighint').style.display='flex';
}
function saveBollettino(){
  const m=byId(S.maintenances,blt.mid);if(!m)return;
  blt.machine.type=$('#bl-mt').value;blt.machine.brand=$('#bl-mb').value.trim();
  blt.techId=$('#bl-te').value;
  if(!blt.signature&&!confirm('Manca la firma del cliente. Salvare comunque?'))return;
  m.report={machine:blt.machine,tasks:blt.tasks,parts:blt.parts.filter(p=>p.name.trim()),outcome:blt.outcome,notes:blt.notes,techId:blt.techId,signature:blt.signature,signedName:blt.signedName,date:todayIso(),time:new Date().toLocaleTimeString('it-CH',{hour:'2-digit',minute:'2-digit'})};
  const wasFatta=m.status==='fatta';
  m.status='fatta';
  let extra='';
  if(!wasFatta&&m.recur>0){
    const nextDate=addMonthsIso(m.date||todayIso(),m.recur);
    S.maintenances.unshift({id:uid(),title:m.title,clientId:m.clientId,clientRaw:m.clientRaw,employees:empIdsOf(m),date:nextDate,time:m.time,status:'programmata',notes:'',recur:m.recur,via:'ricorrenza',created:Date.now()});
    extra=' · 🔁 prossima creata per '+fmtD(nextDate);
  }
  save();closeSheet();render();
  toast('📋 Bollettino salvato'+extra);
  setTimeout(()=>viewBollettino(m.id),350);
}
function viewBollettino(id){
  const m=byId(S.maintenances,id);if(!m||!m.report)return;
  const r=m.report;
  const OUT={completo:['✓ Tutto eseguito','var(--teal)'],parziale:['⚠ Da completare','var(--amber)'],anomalia:['✗ Anomalia riscontrata','var(--coral)']};
  const[ol,oc]=OUT[r.outcome]||OUT.completo;
  openSheet(`<h3>📋 Bollettino <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px">
    <b style="color:var(--t1);font-size:14px">${esc(cName(m.clientId)||m.clientRaw||'Cliente')}</b><br>
    ${esc(m.title)}<br>
    ${esc(r.machine.type)}${r.machine.brand?' — '+esc(r.machine.brand):''}<br>
    ${fmtD(r.date)} ${r.time||''} · Tecnico: ${esc(eName(r.techId)||'—')}<br>
    Esito: <b style="color:${oc}">${ol}</b>
  </div>
  <div class="fld"><label>Lavori eseguiti</label>${r.tasks.filter(t=>t.done).map(t=>`<div class="subtle" style="padding:2px 0">✓ ${esc(t.text)}</div>`).join('')||'<div class="subtle">—</div>'}</div>
  ${r.parts.length?`<div class="fld"><label>Pezzi</label>${r.parts.map(p=>`<div class="subtle" style="padding:2px 0">• ${esc(p.name)} × ${esc(p.qty)}</div>`).join('')}</div>`:''}
  ${r.notes?`<div class="fld"><label>Note</label><div class="subtle">${esc(r.notes)}</div></div>`:''}
  ${r.signature?`<div class="fld"><label>Firma — ${esc(r.signedName||'')}</label><img src="${r.signature}" style="width:100%;max-width:300px;border-radius:10px;background:#fff"></div>`:'<div class="subtle">⚠ Non firmato</div>'}
  <div class="actions">
    <button class="btn ghost" onclick="closeSheet()">Chiudi</button>
    <button class="btn pri" onclick="printBollettino('${id}')">🖨 Stampa / PDF</button>
  </div>`);
}
function printBollettino(id){
  const m=byId(S.maintenances,id);if(!m||!m.report)return;
  const r=m.report;const c=byId(S.clients,m.clientId);
  const company=S.settings.companyName||'';
  const OUT={completo:'Intervento completato',parziale:'Intervento da completare',anomalia:'Anomalia riscontrata'};
  const w=window.open('','_blank');
  if(!w){toast('⚠ Consenti i popup per stampare');return;}
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bollettino — ${esc(cName(m.clientId)||m.clientRaw||'')}</title>
  <style>
    body{font-family:Helvetica,Arial,sans-serif;color:#16243a;max-width:760px;margin:30px auto;padding:0 24px;font-size:13px;line-height:1.5}
    h1{font-size:19px;border-bottom:2.5px solid #16243a;padding-bottom:10px;display:flex;justify-content:space-between;align-items:baseline}
    h1 small{font-size:11px;font-weight:normal;color:#667}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#667;margin:22px 0 6px;border-bottom:1px solid #ccd;padding-bottom:3px}
    table{width:100%;border-collapse:collapse}td{padding:3px 0;vertical-align:top}td:first-child{width:160px;color:#667}
    ul{margin:4px 0;padding-left:20px}li{margin:2px 0}
    .sig{margin-top:34px;display:flex;justify-content:space-between;gap:40px}
    .sig div{flex:1;text-align:center}
    .sig img{max-height:90px;max-width:100%}
    .sigline{border-top:1px solid #16243a;padding-top:5px;font-size:11px;color:#667;margin-top:6px}
    .esito{display:inline-block;border:1.5px solid #16243a;padding:4px 12px;border-radius:4px;font-weight:bold;margin-top:4px}
    @media print{body{margin:0 auto}}
  </style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:2.5px solid #16243a;padding-bottom:10px;margin-bottom:4px;min-height:70px">
    <div>
      <div style="font-size:19px;font-weight:bold">${company?esc(company):'BOLLETTINO D\'INTERVENTO'}</div>
      <div style="font-size:11px;color:#667;margin-top:3px">${company?'Bollettino d\'intervento — ':''}N. ${m.id.slice(-6).toUpperCase()} · ${r.date.split('-').reverse().join('.')}</div>
    </div>
    <img src="${LOGO_URL}" alt="" style="max-height:70px;max-width:210px;object-fit:contain;flex-shrink:0" onerror="this.style.display='none'">
  </div>
  <h2>Cliente</h2>
  <table>
    <tr><td>Nome</td><td><b>${esc(cName(m.clientId)||m.clientRaw||'—')}</b></td></tr>
    ${c&&c.address?`<tr><td>Indirizzo</td><td>${esc(c.address)}</td></tr>`:''}
    ${c&&c.phone?`<tr><td>Telefono</td><td>${esc(c.phone)}</td></tr>`:''}
  </table>
  <h2>Intervento</h2>
  <table>
    <tr><td>Descrizione</td><td>${esc(m.title)}</td></tr>
    <tr><td>Apparecchio</td><td>${esc(r.machine.type)}${r.machine.brand?' — '+esc(r.machine.brand):''}</td></tr>
    <tr><td>Data e ora</td><td>${r.date.split('-').reverse().join('.')} ${r.time||''}</td></tr>
    <tr><td>Tecnico</td><td>${esc(eName(r.techId)||'—')}</td></tr>
  </table>
  <h2>Lavori eseguiti</h2>
  <ul>${r.tasks.filter(t=>t.done).map(t=>`<li>${esc(t.text)}</li>`).join('')||'<li>—</li>'}</ul>
  ${r.parts.length?`<h2>Pezzi sostituiti / aggiunti</h2><ul>${r.parts.map(p=>`<li>${esc(p.name)} — q.tà ${esc(p.qty)}</li>`).join('')}</ul>`:''}
  ${r.notes?`<h2>Note e raccomandazioni</h2><p>${esc(r.notes)}</p>`:''}
  <h2>Esito</h2><span class="esito">${OUT[r.outcome]||''}</span>
  <div class="sig">
    <div><div style="height:90px"></div><div class="sigline">Firma del tecnico — ${esc(eName(r.techId)||'')}</div></div>
    <div>${r.signature?`<img src="${r.signature}">`:'<div style="height:90px"></div>'}<div class="sigline">Firma del cliente — ${esc(r.signedName||'')}</div></div>
  </div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script>
  </body></html>`);
  w.document.close();
}



