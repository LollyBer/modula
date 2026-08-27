/* ===== MODULO: DA FARE (to-do) — liste spuntabili, con o senza scadenza =====
   Voce: {id,text,done,due,time,priority,clientId,employees[],list,via,created}.
   Le voci CON scadenza entrano nel calendario (allEvents type 'todo') e fanno
   scattare il promemoria pre-scadenza. Dipende dal core (S, uid, save, render,
   openSheet, closeSheet, esc, toast, isOwner, byId, cName, empNames, empIdsOf,
   empSeg, empSegRead, cliInput, clientPreviewHTML, fmtD, todayIso, pushNotify). */

const todoVis=()=>isOwner()?(S.todos||[]):(S.todos||[]).filter(t=>{const a=empIdsOf(t);return !a.length||a.includes(S.session&&S.session.empId);});
const todoOverdue=t=>!!(t.due&&!t.done&&t.due<todayIso());

const todoRow=t=>{
  const od=todoOverdue(t);
  const col=t.done?'#2E9E5E':(od?'#D64528':(t.priority?'#C77F12':'#7C5CBF'));
  const due=t.due?`<span style="font-family:var(--mono);font-size:11px;color:${od?'#D64528':'var(--t2)'}">${od?'⚠ ':'📅 '}${fmtD(t.due)}${t.time?' '+t.time:''}</span>`:'';
  const sub=[cName(t.clientId)||'',empNames(t)||'',t.list?'#'+t.list:''].filter(Boolean).join(' · ');
  return `<div class="frw" style="border-left-color:${col};align-items:center">
    <button onclick="event.stopPropagation();toggleTodo('${t.id}')" style="flex-shrink:0;width:24px;height:24px;border-radius:50%;border:1.8px solid ${t.done?'#2E9E5E':'var(--line2)'};background:${t.done?'#2E9E5E':'transparent'};color:#fff;font-size:13px;cursor:pointer;line-height:1;padding:0">${t.done?'✓':''}</button>
    <div class="bd" onclick="openTodo('${t.id}')" style="cursor:pointer">
      <div class="ti" style="${t.done?'text-decoration:line-through;color:var(--t3)':''}">${t.priority&&!t.done?'⭐ ':''}${esc(t.text||'')}</div>
      ${(due||sub)?`<div class="su">${due}${due&&sub?' · ':''}${esc(sub)}</div>`:''}</div>
  </div>`;
};

function renderTodo(){
  const all=todoVis();
  const open=all.filter(t=>!t.done);
  const withDue=open.filter(t=>t.due).sort((a,b)=>((a.due+(a.time||'99'))<(b.due+(b.time||'99'))?-1:1));
  const noDue=open.filter(t=>!t.due).sort((a,b)=>(b.priority||0)-(a.priority||0));
  const done=all.filter(t=>t.done).sort((a,b)=>(b.created||0)-(a.created||0));
  const overdue=withDue.filter(todoOverdue);
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:#7C5CBF"></span>Da fare</div>
  <button class="btn pri" style="width:100%;margin-bottom:12px" onclick="openTodo()">+ Nuova cosa da fare</button>
  ${overdue.length?`<div class="card" style="border-color:rgba(214,69,40,.4)"><div class="sh"><span class="t" style="color:var(--coral)">⚠ In ritardo (${overdue.length})</span></div>${overdue.map(todoRow).join('')}</div>`:''}
  <div class="card"><div class="sh"><span class="t">Da fare (${open.length})</span></div>
    ${open.length?(withDue.filter(t=>!todoOverdue(t)).map(todoRow).join('')+noDue.map(todoRow).join('')):'<div class="empty"><div class="big">✅</div>Niente da fare. 🎉<br><span class="subtle">Aggiungi le cose da ricordare, con o senza scadenza.</span></div>'}
  </div>
  ${done.length?`<details style="margin-top:8px"><summary style="cursor:pointer;padding:9px 4px;color:var(--t2);font-size:13px">✓ Fatte (${done.length})</summary><div class="card" style="margin-top:6px">${done.slice(0,50).map(todoRow).join('')}</div></details>`:''}`;
}

function openTodo(id){
  const t=id?byId(S.todos,id):{id:uid(),text:'',done:false,due:'',time:'',priority:0,clientId:null,employees:[],list:''};
  const lists=[...new Set((S.todos||[]).map(x=>x.list).filter(Boolean))];
  openSheet(`<h3>${id?'Cosa da fare':'Nuova cosa da fare'} <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="fld"><label>Cosa c'è da fare</label><textarea id="td-t" rows="2" placeholder="es. Ordinare la colla per il cantiere Rossi">${esc(t.text||'')}</textarea></div>
   <div class="frow">
     <div class="fld"><label>Scadenza (opzionale)</label><input id="td-d" type="date" value="${t.due||''}"></div>
     <div class="fld"><label>Ora (opz.)</label><input id="td-h" type="time" value="${t.time||''}"></div>
   </div>
   ${typeof dateChips==='function'?dateChips('td-d'):''}
   <div class="fld"><label>Lista (opzionale)</label><input id="td-l" list="td-lists" value="${esc(t.list||'')}" placeholder="es. Ufficio, Cantiere Rossi"><datalist id="td-lists">${lists.map(l=>`<option value="${esc(l)}">`).join('')}</datalist></div>
   <div class="fld"><label>Cliente (opzionale)</label>${cliInput('td-c',t.clientId,'td-cprev')}<div id="td-cprev">${clientPreviewHTML(t.clientId)}</div></div>
   <div class="fld"><label>Assegna a (opzionale)</label>${empSeg('td-e',t.employees||[])}</div>
   <label class="set-check" style="margin:2px 0 4px"><input type="checkbox" id="td-pri" ${t.priority?'checked':''}> ⭐ Priorità alta</label>
   <div class="actions">${id?`<button class="btn danger" onclick="delTodo('${id}')">Elimina</button>`:''}<button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveTodo('${id||''}')">Salva</button></div>`);
}

function saveTodo(id){
  const text=$('#td-t').value.trim();if(!text){toast('Scrivi cosa fare');return;}
  const data={text,due:$('#td-d').value||null,time:$('#td-h').value||null,list:$('#td-l').value.trim(),clientId:$('#td-c').value||null,employees:empSegRead('td-e'),priority:$('#td-pri').checked?1:0};
  const oldT=id?byId(S.todos,id):null;const prevEmps=oldT?empIdsOf(oldT):[];
  if(id){Object.assign(oldT,data);}else{S.todos.unshift({id:uid(),done:false,via:'manuale',created:Date.now(),...data});}
  const added=data.employees.filter(e=>!prevEmps.includes(e)&&!(S.session&&e===S.session.empId));
  if(added.length)pushNotify(added,'✅ Da fare per te',text.slice(0,90)+(data.due?' · scad. '+fmtD(data.due):''));
  save();closeSheet();render();toast('✓ Salvato');
}
function toggleTodo(id){const t=byId(S.todos,id);if(!t)return;t.done=!t.done;save();render();}
function delTodo(id){if(!confirm('Eliminare questa voce?'))return;S.todos=(S.todos||[]).filter(x=>x.id!==id);save();closeSheet();render();toast('Eliminato');}
window.renderTodo=renderTodo;
