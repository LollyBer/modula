/* ===== MODULO BASE: NOTE & APPUNTAMENTI ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= NOTE & APPUNTAMENTI ================= */
let notesTab='app';let noteGroupSel='all';
function renderNotes(){
  const t=todayIso();
  const apps=visApp().slice().sort((a,b)=>((a.done?'z':'a')+a.date+(a.time||''))<((b.done?'z':'a')+b.date+(b.time||''))?-1:1);
  let notes=S.notes.slice();
  if(noteGroupSel==='arch')notes=notes.filter(n=>n.archived);
  else{notes=notes.filter(n=>!n.archived);if(noteGroupSel!=='all')notes=notes.filter(n=>n.groupId===noteGroupSel);}
  notes=notes.filter(n=>!n.groupId||groupVisible(byId(S.noteGroups,n.groupId)));
  notes.sort((a,b)=>(b.pinned-a.pinned)||(b.created-a.created));
  const gName=id=>{const g=byId(S.noteGroups,id);return g?g.name:''};
  const archN=S.notes.filter(n=>n.archived).length;
  const noteCard=n=>{const col=n.pinned?'#C77F12':(n.groupId?avColor(gName(n.groupId)||n.groupId):'#8A8170');const meta=[n.groupId?'📁 '+esc(gName(n.groupId)):'',n.clientId?'👤 '+esc(cName(n.clientId)):'',n.date?'📅 '+fmtD(n.date):''].filter(Boolean).join(' · ');return`<div style="background:var(--bg1);border:1px solid var(--line);border-left:3px solid ${col};border-radius:12px;padding:10px 11px;cursor:pointer;position:relative" onclick="openNote('${n.id}')"><div style="font-size:12.5px;color:var(--t1);line-height:1.4">${n.pinned?'📌 ':''}${esc(n.text)}</div>${meta?`<div style="font-size:9.5px;color:var(--t2);margin-top:7px">${meta}</div>`:''}${noteGroupSel!=='arch'?`<span onclick="event.stopPropagation();var nn=byId(S.notes,'${n.id}');nn.archived=true;save();render();toast('🗄 Archiviata')" style="position:absolute;top:6px;right:9px;font-size:11px;color:var(--t3)">🗄</span>`:''}</div>`;};
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--teal)"></span>Note & Appuntamenti</div>
  <div class="tabs">
    <div class="tb ${notesTab==='app'?'on':''}" onclick="notesTab='app';render()">📅 Appuntamenti (${visApp().filter(a=>!a.done).length})</div>
    <div class="tb ${notesTab==='note'?'on':''}" onclick="notesTab='note';render()">📝 Note (${S.notes.filter(n=>!n.archived).length})</div>
  </div>
  ${notesTab==='note'?`<div class="tabs" style="margin-top:-4px">
    <div class="tb ${noteGroupSel==='all'?'on':''}" onclick="noteGroupSel='all';render()">Tutte</div>
    ${S.noteGroups.filter(groupVisible).map(g=>`<div class="tb ${noteGroupSel===g.id?'on':''}" onclick="noteGroupSel==='${g.id}'?groupMenu('${g.id}'):(noteGroupSel='${g.id}',render())">📁 ${esc(g.name)}${g.members&&g.members.length?' 🔒':''}${noteGroupSel===g.id?' ⋯':''}</div>`).join('')}
    <div class="tb" onclick="newGroup()">＋ Gruppo</div>
    <div class="tb ${noteGroupSel==='arch'?'on':''}" style="${archN?'':'opacity:.5'}" onclick="noteGroupSel='arch';render()">🗄 Archivio (${archN})</div>
  </div>`:''}
  ${notesTab==='app'
    ?`<div class="card">`+(apps.length?apps.map(a=>`<div class="item" onclick="openApp('${a.id}')">
        <span class="led" style="background:${a.done?'var(--t3)':a.date<t?'#D64528':'#5BA02C'}"></span>
        <div class="bd"><div class="ti" style="${a.done?'text-decoration:line-through;color:var(--t3)':''}">${esc(a.title)}</div>
        <div class="su">${esc(cName(a.clientId)||a.clientRaw||'')}${empNames(a)?' · 👷 '+esc(empNames(a)):''}</div></div>
        <div class="right"><div class="d1">${a.time||''}</div><div class="d2">${fmtD(a.date)}</div></div></div>`).join('')
      :'<div class="empty"><div class="big">📅</div>Nessun appuntamento.<br>Scrivilo nell\'Hub o premi +.</div>')+`</div>`
    :(notes.length
      ?(notes.filter(n=>n.pinned).length?`<div style="display:flex;flex-direction:column;gap:9px;margin-bottom:9px">`+notes.filter(n=>n.pinned).map(noteCard).join('')+`</div>`:'')
       +`<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px">`+notes.filter(n=>!n.pinned).map(noteCard).join('')+`</div>`
      :`<div class="empty"><div class="big">${noteGroupSel==='arch'?'🗄':'📝'}</div>${noteGroupSel==='arch'?'Archivio vuoto.':'Nessuna nota qui.'}</div>`)}
  <button class="fab" onclick="${notesTab==='app'?`openQuickAdd('${todayIso()}')`:'newNote()'}">+</button>`;
}
/* gruppi note: un gruppo con membri è privato (solo loro + i titolari); vuoto = visibile a tutti */
function groupVisible(g){if(isOwner())return true;if(!g)return false;return !g.members||g.members.length===0||(!!S.session&&g.members.includes(S.session.empId));}
function groupMembersField(members){
  if(!S.employees.length)return '';
  return `<div class="fld"><label>👥 Chi può vedere questo gruppo</label>
    <div class="seg" id="ng-mem" style="flex-wrap:wrap;gap:7px">${S.employees.map(e=>`<div class="sg ${(members||[]).includes(e.id)?'on':''}" data-v="${e.id}" onclick="this.classList.toggle('on')">${esc(e.name)}${e.isOwner?' 👑':''}</div>`).join('')}</div>
    <div class="subtle" style="margin-top:7px">Lascia tutto spento = visibile a tutti. Seleziona delle persone = gruppo privato, visibile solo a loro (e ai titolari).</div></div>`;
}
const groupMembersRead=()=>[...document.querySelectorAll('#ng-mem .sg.on')].map(x=>x.dataset.v);
function newGroup(){
  openSheet(`<h3>Nuovo gruppo note <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Nome</label><input id="ng-n" placeholder="es. Fornitori, Idee, Cantiere Via Roma"></div>
  ${groupMembersField([])}
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveNewGroup()">Crea</button></div>`);
}
function saveNewGroup(){const n=$('#ng-n').value.trim();if(!n)return;S.noteGroups.push({id:uid(),name:n,members:groupMembersRead()});save();closeSheet();render();toast('📁 Gruppo creato');}
function groupMenu(gid){
  const g=byId(S.noteGroups,gid);if(!g)return;
  openSheet(`<h3>📁 ${esc(g.name)} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Rinomina</label><input id="gm-n" value="${esc(g.name)}"></div>
  ${groupMembersField(g.members||[])}
  <div class="actions">
    <button class="btn danger" onclick="if(confirm('Eliminare il gruppo? Le note restano, senza gruppo.')){S.noteGroups=S.noteGroups.filter(x=>x.id!=='${gid}');S.notes.forEach(n=>{if(n.groupId==='${gid}')n.groupId=null;});noteGroupSel='all';save();closeSheet();render();}">Elimina gruppo</button>
    <button class="btn pri" onclick="saveGroupEdit('${gid}')">Salva</button></div>`);
}
function saveGroupEdit(gid){const g=byId(S.noteGroups,gid);if(!g)return;g.name=$('#gm-n').value.trim()||g.name;g.members=groupMembersRead();save();closeSheet();render();}
const groupOpts=sel=>`<option value="">— nessun gruppo —</option>`+S.noteGroups.filter(groupVisible).map(g=>`<option value="${g.id}" ${sel===g.id?'selected':''}>${esc(g.name)}</option>`).join('');
function newNote(){
  openSheet(`<h3>Nuova nota <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Testo</label><textarea id="nn-t" placeholder="Scrivi…"></textarea></div>
  <div class="fld"><label>Gruppo</label><select id="nn-g">${groupOpts(noteGroupSel!=='all'&&noteGroupSel!=='arch'?noteGroupSel:null)}</select></div>
  <div class="frow"><div class="fld"><label>Data (va a calendario)</label><input id="nn-d" type="date"></div>
  <div class="fld"><label>Cliente</label><select id="nn-c"><option value="">—</option>${cOpt('')}</select></div></div>
  <div class="fld"><label>Assegna a (uno o più, facoltativo)</label>${empSeg('nn-e',[])}</div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveNewNote()">Salva</button></div>`);
}
function saveNewNote(){const t=$('#nn-t').value.trim();if(!t)return;const employees=empSegRead('nn-e');S.notes.unshift({id:uid(),text:t,clientId:$('#nn-c').value||null,groupId:$('#nn-g').value||null,employees,date:$('#nn-d').value||null,pinned:false,archived:false,via:'manuale',created:Date.now()});if(employees.length)pushNotify(employees,'📝 Nota per te',t.slice(0,90));save();closeSheet();render();toast('📝 Nota salvata');}
function openNote(id){
  const n=byId(S.notes,id);if(!n)return;
  openSheet(`<h3>Nota <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Testo</label><textarea id="en-t">${esc(n.text)}</textarea></div>
  <div class="fld"><label>Gruppo</label><select id="en-g">${groupOpts(n.groupId)}</select></div>
  <div class="frow"><div class="fld"><label>Data (va a calendario)</label><input id="en-d" type="date" value="${n.date||''}"></div>
  <div class="fld"><label>Cliente</label><select id="en-c"><option value="">—</option>${cOpt(n.clientId)}</select></div></div>
  <div class="fld"><label>Assegna a (uno o più, facoltativo)</label>${empSeg('en-e',empIdsOf(n))}</div>
  <div class="actions">
    <button class="btn danger" onclick="delItem('notes','${id}')">Elimina</button>
    <button class="btn" onclick="const n=byId(S.notes,'${id}');n.archived=!n.archived;save();closeSheet();render();toast(n.archived?'🗄 Archiviata':'Ripristinata')">${n.archived?'↩ Ripristina':'🗄 Archivia'}</button>
    <button class="btn" onclick="togglePin('${id}')">${n.pinned?'Stacca':'📌 Fissa'}</button>
    <button class="btn pri" onclick="saveNote('${id}')">Salva</button></div>`);
}
function saveNote(id){const n=byId(S.notes,id);const prevEmps=empIdsOf(n);n.text=$('#en-t').value.trim()||n.text;n.date=$('#en-d').value||null;n.clientId=$('#en-c').value||null;n.groupId=$('#en-g').value||null;n.employees=empSegRead('en-e');const added=n.employees.filter(e=>!prevEmps.includes(e));if(added.length)pushNotify(added,'📝 Nota per te',(n.text||'').slice(0,90));save();closeSheet();render();toast('Salvato');}
function togglePin(id){const n=byId(S.notes,id);n.pinned=!n.pinned;save();closeSheet();render();}
function delItem(coll,id){if(!confirm('Eliminare definitivamente?'))return;S[coll]=S[coll].filter(x=>x.id!==id);save();closeSheet();render();toast('Eliminato');}


