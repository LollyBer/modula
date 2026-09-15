/* ===== MODULO BASE: HUB ===== */
/* Estratto da ptek index.html (righe 1296-1442). Dipende dal core (S, parseInput, esc, nav, save, openSheet...) e usa typeof-guards per i moduli extra. */

/* ================= HUB ================= */
let hubParsed=null;
function renderHub(){
  const ev=allEvents();const t=todayIso();const mk=t.slice(0,7);
  const todayEv=ev.filter(e=>e.date===t&&!e.done);
  const next=ev.filter(e=>e.date>t&&!e.done).slice(0,5);
  const late=ev.filter(e=>e.date<t&&!e.done).slice(0,4);
  const openMan=S.maintenances.filter(m=>m.status!=='fatta').length;
  const openPel=S.pellet.filter(p=>p.status!=='consegnato').length;
  let contiCard='';
  if(isOwner()){const e=entrate(mk);const sp=speseTot(mk);const ut=e.tot-sp;contiCard=`<div class="card hl" style="border-color:rgba(46,158,94,.28);cursor:pointer" onclick="nav('conti')"><div class="sh"><span class="t" style="color:var(--t2)">🔒 Conti · ${monthLabel(mk)}</span><span class="a">Apri →</span></div><div style="display:flex;justify-content:space-between;margin-top:2px"><div><div class="subtle" style="font-size:10px">Entrate</div><div style="font-size:16px;font-weight:700;color:var(--teal)">${fmtQty(e.tot)}</div></div><div><div class="subtle" style="font-size:10px">Spese</div><div style="font-size:16px;font-weight:700;color:var(--coral)">${fmtQty(sp)}</div></div><div><div class="subtle" style="font-size:10px">Utile</div><div style="font-size:16px;font-weight:700;color:${ut>=0?'var(--cy)':'var(--coral)'}">${ut>=0?'+':''}${fmtQty(ut)}</div></div></div></div>`;}
  const cantieri=visSites().filter(s=>s.status==='aperto').sort((a,b)=>b.created-a.created).slice(0,5);
  const cantieriCard=`<div class="card"><div class="sh"><span class="t">🏗 Cantieri in corso</span><span class="a" onclick="nav('sites')">Cantieri →</span></div>
    ${cantieri.length?cantieri.map(s=>{const hrs=siteHours(s);const pct=s.estHours?Math.min(100,Math.round(hrs/s.estHours*100)):null;return`<div class="item" onclick="openSite('${s.id}')"><div class="bd"><div class="ti">${esc(s.name)}</div><div class="su">${esc(cName(s.clientId)||s.clientRaw||'—')}${s.employees.length?' · 👷 '+s.employees.map(eName).filter(Boolean).join(', '):''}</div>${s.estHours?`<div class="ck-bar" style="margin:6px 0 3px;max-width:220px"><i style="width:${pct}%;${pct>=100?'background:var(--amber)':''}"></i></div>`:''}<div class="mt">${hrs}h${s.estHours?' / '+s.estHours+'h':''}${pct!=null?' · '+pct+'%':''}</div></div></div>`;}).join(''):'<div class="empty"><div class="big">🏗</div>Nessun cantiere in corso.</div>'}
  </div>`;
  const listsCard=`<div class="card"><div class="sh"><span class="t">☑️ Liste</span><span class="a" onclick="newList()">+ Nuova lista</span></div>
    ${S.lists.length?S.lists.map(L=>{
      const done=L.items.filter(i=>i.done).length,tot=L.items.length;
      return`<div class="cklist">
      <div class="ck-head" onclick="listMenu('${L.id}')"><span class="ck-name">${esc(L.name)}</span><span class="ck-prog">${done}/${tot}</span><span style="color:var(--t3);font-size:13px">⋯</span></div>
      ${tot?`<div class="ck-bar"><i style="width:${tot?Math.round(done/tot*100):0}%"></i></div>`:''}
      ${L.items.map(i=>`<div class="ck-it ${i.done?'done':''}" onclick="ckToggle('${L.id}','${i.id}')"><span class="ck-box">${i.done?'✓':''}</span><span class="ck-tx">${esc(i.text)}</span></div>`).join('')}
      <div class="ck-add"><input id="cka-${L.id}" placeholder="Aggiungi voce…" onkeydown="if(event.key==='Enter')ckAdd('${L.id}')" onclick="event.stopPropagation()"><button onclick="ckAdd('${L.id}')">+</button></div>
      </div>`;
    }).join(''):'<div class="empty">Nessuna lista. Creane una qui o dall\'Hub:<br>«lista ferramenta: viti, tasselli, silicone»</div>'}
  </div>`;
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent"></span>Hub</div>
  <div class="hub" id="hub"><div class="ring"></div>
    <div class="hub-box">
      <textarea id="hubinput" rows="2" placeholder="Scrivi qui e ci penso io a smistare…&#10;es. «aggiungi manutenzione a Rossi domani alle 4»"></textarea>
      <div class="hub-foot" id="hubchips"><span class="chip">🔧 manutenzioni</span><span class="chip">🪵 pellet</span><span class="chip">📅 appuntamenti</span><span class="chip">📝 note</span><span class="chip">🏗 cantieri</span><span class="chip">☑️ liste</span></div>
      <div id="hubpreview"></div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:12px">
    <div class="stat" style="text-align:center;padding:10px 4px"><div style="font-size:20px;font-weight:700;color:var(--cy)">${todayEv.length}</div><div class="subtle" style="font-size:10px">Oggi</div></div>
    <div class="stat" style="text-align:center;padding:10px 4px;${late.length?'border-color:rgba(214,69,40,.35)':''}"><div style="font-size:20px;font-weight:700;color:var(--coral)">${late.length}</div><div class="subtle" style="font-size:10px">In ritardo</div></div>
    <div class="stat" style="text-align:center;padding:10px 4px"><div style="font-size:20px;font-weight:700;color:var(--amber)">${openMan}</div><div class="subtle" style="font-size:10px">Manut.</div></div>
    <div class="stat" style="text-align:center;padding:10px 4px"><div style="font-size:20px;font-weight:700;color:var(--fire)">${openPel}</div><div class="subtle" style="font-size:10px">Pellet</div></div>
  </div>
  ${contiCard}
  ${cantieriCard}
  ${late.length?`<div class="card" style="border-color:rgba(214,69,40,.35)"><div class="sh"><span class="t" style="color:var(--coral)">⚠ In ritardo</span></div>${late.map(evRow).join('')}</div>`:''}
  ${typeof zoneHubCardHTML==='function'?zoneHubCardHTML():''}
  <div class="card hl"><div class="sh"><span class="t">Oggi</span><span class="a" onclick="nav('cal')">Calendario →</span></div>
    ${todayEv.length?todayEv.map(evRow).join(''):'<div class="empty"><div class="big">🌊</div>Niente in programma oggi.</div>'}
  </div>
  <div class="card"><div class="sh"><span class="t">Prossimi</span></div>
    ${next.length?next.map(evRow).join(''):'<div class="empty">Nessun evento futuro.</div>'}
  </div>
  ${listsCard}`;
  const ta=$('#hubinput');
  ta.addEventListener('input',()=>{
    const v=ta.value.trim();const hub=$('#hub');
    if(!v){hub.classList.remove('live');hubParsed=null;$('#hubpreview').innerHTML='';resetChips();return;}
    hub.classList.add('live');hubParsed=parseInput(v);showPreview();
  });
  ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();hubCommit();}});
}
function resetChips(){document.querySelectorAll('#hubchips .chip').forEach(c=>c.classList.remove('on'));}
function showPreview(){
  const p=hubParsed;if(!p)return;
  resetChips();
  const order={maintenance:0,pellet:1,appointment:2,note:3,site:4,list:5};
  const chips=document.querySelectorAll('#hubchips .chip');
  if(chips[order[p.type]])chips[order[p.type]].classList.add('on');
  const M=TYPE_META[p.type];
  if(p.type==='list'){
    $('#hubpreview').innerHTML=`<div class="preview">
    <div class="row"><span class="k">SEZIONE</span><span class="badge" style="border-color:${M.hex};color:${M.hex}">${M.ic} ${M.label}</span></div>
    <div class="row"><span class="k">LISTA</span><span class="v">${esc(p.listName||'')}</span></div>
    <div class="row"><span class="k">VOCI</span><span class="v ${p.listItems&&p.listItems.length?'':'miss'}">${p.listItems&&p.listItems.length?p.listItems.map(esc).join(' · '):'lista vuota'}</span></div>
    <div class="row" style="margin-top:4px;gap:10px">
      <button class="btn pri sm" onclick="hubCommit()">✓ Conferma</button>
      <button class="btn ghost sm" onclick="cycleType()">↻ Cambia sezione</button>
    </div></div>`;
    return;
  }
  $('#hubpreview').innerHTML=`<div class="preview">
    <div class="row"><span class="k">SEZIONE</span><span class="badge" style="border-color:${M.hex};color:${M.hex}">${M.ic} ${M.label}</span></div>
    <div class="row"><span class="k">TESTO</span><span class="v">${esc(p.title)}</span></div>
    <div class="row"><span class="k">CLIENTE</span><select onchange="hubSetClient(this.value)"><option value="">— nessuno</option>${p.person&&p.person.kind==='raw'?`<option value="__new__" selected>➕ ${esc(p.person.name)} (nuovo)</option>`:''}${cOpt(p.person&&p.person.kind==='client'?p.person.id:'')}</select>${p.person&&p.person.kind==='raw'?`<button class="btn sm" style="border-color:var(--teal);color:var(--teal)" onclick="createClientFromPreview()">✚ Crea in anagrafica</button>`:''}</div>
    ${(p.type==='maintenance'||p.type==='appointment'||p.type==='pellet')?`<div class="row"><span class="k">DIPENDENTE</span><select onchange="hubSetEmp(this.value)"><option value="">— nessuno</option>${S.employees.map(e=>`<option value="${e.id}" ${p.employee&&p.employee.id===e.id?'selected':''}>${esc(e.name)}</option>`).join('')}</select></div>`:''}
    <div class="row"><span class="k">QUANDO</span><span class="v ${p.date?'':'miss'}">${p.date?fmtD(p.date)+(p.time?' · '+p.time:''):'senza data'}</span></div>
    ${p.qty?`<div class="row"><span class="k">QUANTITÀ</span><span class="v">${p.qty} ${p.unit||''}</span></div>`:''}
    <div class="row" style="margin-top:4px;gap:10px">
      <button class="btn pri sm" onclick="hubCommit()">✓ Conferma</button>
      <button class="btn ghost sm" onclick="cycleType()">↻ Cambia sezione</button>
    </div></div>`;
}
function createClientFromPreview(){
  if(!hubParsed||!hubParsed.person||hubParsed.person.kind!=='raw')return;
  const name=hubParsed.person.name;
  const c={id:uid(),name,phone:'',zone:'',address:'',notes:'',created:Date.now()};
  S.clients.unshift(c);save();
  hubParsed.person={kind:'client',id:c.id,name,len:name.length};
  showPreview();toast('👥 Cliente «'+name+'» creato — completa la scheda quando vuoi');
}
function hubSetClient(val){
  if(!hubParsed)return;
  if(val===''){hubParsed.person=null;}
  else if(val==='__new__'){/* mantieni il cliente nuovo rilevato */}
  else{const c=byId(S.clients,val);if(c)hubParsed.person={kind:'client',id:c.id,name:c.name,len:norm(c.name).length};}
  showPreview();
}
function hubSetEmp(val){
  if(!hubParsed)return;
  if(val===''){hubParsed.employee=null;}
  else{const e=byId(S.employees,val);if(e)hubParsed.employee={kind:'employee',id:e.id,name:e.name,len:norm(e.name).length};}
}
function cycleType(){
  if(!hubParsed)return;
  const seq=['maintenance','pellet','appointment','note','site','list'];
  hubParsed.type=seq[(seq.indexOf(hubParsed.type)+1)%seq.length];
  showPreview();
}
function hubCommit(){
  if(!hubParsed){const v=$('#hubinput').value.trim();if(!v)return;hubParsed=parseInput(v);}
  const msg=commitParsed(hubParsed,'hub');
  hubParsed=null;toast(msg);render();
}
function ckToggle(lid,iid){const L=byId(S.lists,lid);const i=byId(L.items,iid);i.done=!i.done;save();render();}
function ckAdd(lid){const inp=$('#cka-'+lid);const t=inp.value.trim();if(!t)return;byId(S.lists,lid).items.push({id:uid(),text:t,done:false});save();render();setTimeout(()=>{const n=$('#cka-'+lid);if(n)n.focus();},0);}
function newList(){
  openSheet(`<h3>Nuova lista <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Nome</label><input id="nl-n" placeholder="es. Ferramenta, Furgone, Da ordinare"></div>
  <div class="fld"><label>Voci (una per riga, opzionale)</label><textarea id="nl-i" placeholder="viti 6x40&#10;tasselli&#10;silicone"></textarea></div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveNewList()">Crea</button></div>`);
}
function saveNewList(){
  const n=$('#nl-n').value.trim();if(!n){toast('Manca il nome');return;}
  const items=$('#nl-i').value.split('\n').map(x=>x.trim()).filter(Boolean).map(t=>({id:uid(),text:t,done:false}));
  S.lists.unshift({id:uid(),name:n,items,via:'manuale',created:Date.now()});
  save();closeSheet();render();toast('☑️ Lista creata');
}
function listMenu(lid){
  const L=byId(S.lists,lid);if(!L)return;
  const done=L.items.filter(i=>i.done).length;
  openSheet(`<h3>${esc(L.name)} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px">${done}/${L.items.length} fatte</div>
  <div class="fld"><label>Rinomina</label><input id="lm-n" value="${esc(L.name)}"></div>
  <div class="actions">
    <button class="btn danger" onclick="if(confirm('Eliminare la lista?')){S.lists=S.lists.filter(x=>x.id!=='${lid}');save();closeSheet();render();toast('Eliminata');}">Elimina</button>
    <button class="btn" onclick="const L=byId(S.lists,'${lid}');L.items=L.items.filter(i=>!i.done);save();closeSheet();render();toast('Voci fatte rimosse')">Pulisci fatte</button>
    <button class="btn pri" onclick="const L=byId(S.lists,'${lid}');L.name=$('#lm-n').value.trim()||L.name;save();closeSheet();render()">Salva</button></div>`);
}
