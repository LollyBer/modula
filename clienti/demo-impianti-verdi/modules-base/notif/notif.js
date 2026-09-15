/* ===== MODULO BASE: NOTIFICHE + CHAT ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= CHAT ================= */
/* ================= NOTIFICHE (inbox personale + chat) ================= */
let notifTab='inbox';
function myWork(){
  if(!S.session)return{man:[],app:[],sit:[],pel:[],total:0};
  const id=S.session.empId;
  const man=S.maintenances.filter(m=>empIdsOf(m).includes(id)&&m.status!=='fatta');
  const app=S.appointments.filter(a=>empIdsOf(a).includes(id)&&!a.done);
  const sit=S.sites.filter(s=>(s.employees||[]).includes(id)&&s.status==='aperto');
  const pel=S.pellet.filter(p=>empIdsOf(p).includes(id)&&p.status!=='consegnato');
  return{man,app,sit,pel,total:man.length+app.length+sit.length+pel.length};
}
function notifCount(){return myWork().total;}
function renderNotif(){
  const w=myWork();const showChat=can('chat');
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Notifiche</div>
  <div class="tabs">
    <div class="tb ${notifTab==='inbox'?'on':''}" onclick="notifTab='inbox';render()">🔔 Da fare${w.total?` (${w.total})`:''}</div>
    ${showChat?`<div class="tb ${notifTab==='chat'?'on':''}" onclick="notifTab='chat';render()">💬 Chat squadra</div>`:''}
  </div>
  <div id="notifbody"></div>`;
  if(notifTab==='chat'&&showChat){renderChatPanel();}else{renderInbox(w);}
}
function renderInbox(w){
  const t=todayIso();const blocks=[];
  const nLate=[...w.man,...w.pel].filter(x=>x.date&&x.date<t).length;
  const m0=me();const hi=m0?esc(m0.name.split(' ')[0]):'';
  const greet=`<div class="card" style="text-align:center;padding:11px;border-color:rgba(111,178,58,.2)"><span style="font-size:12.5px">Ciao ${hi} 👋 — hai <b style="color:var(--cy)">${w.total} cos${w.total===1?'a':'e'}</b> da fare${nLate?`, <b style="color:var(--coral)">${nLate} in ritardo</b>`:''}</span></div>`;
  if(w.man.length){
    blocks.push(`<div class="grp">🔧 MANUTENZIONI (${w.man.length})</div>`+w.man.map(m=>{
      const who=cName(m.clientId)||m.clientRaw||'';const late=m.date&&m.date<t;const col=late?'#D64528':'#5BA02C';
      return`<div class="frw" style="border-left-color:${col}" onclick="openMan('${m.id}')">
      <div class="bd"><div class="ti">${who?`<b>${esc(who)}</b> — `:''}${esc(m.title)}</div>
      <div class="su">${m.date?'📅 '+fmtD(m.date)+(m.time?' · '+m.time:''):'senza data'}${late?' · <span style="color:#D64528">in ritardo</span>':''}</div></div>
      <div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0">
        <button class="qbtn ghost" onclick="event.stopPropagation();startBollettino('${m.id}')">✍ Bollett.</button>
        <button class="qbtn" onclick="event.stopPropagation();markManDone('${m.id}')">✓ Fatta</button></div></div>`;
    }).join(''));
  }
  if(w.app.length){
    blocks.push(`<div class="grp">📅 APPUNTAMENTI (${w.app.length})</div>`+w.app.map(a=>{
      const who=cName(a.clientId)||a.clientRaw||'';
      return`<div class="frw" style="border-left-color:#5BA02C" onclick="openApp('${a.id}')">
      <div class="bd"><div class="ti">${esc(a.title)}</div>
      <div class="su">${who?esc(who)+' · ':''}${a.date?'📅 '+fmtD(a.date)+(a.time?' · '+a.time:''):'senza data'}</div></div>
      <button class="qbtn" onclick="event.stopPropagation();markAppDone('${a.id}')">✓ Fatto</button></div>`;
    }).join(''));
  }
  if(w.sit.length){
    blocks.push(`<div class="grp">🏗 CANTIERI (${w.sit.length})</div>`+w.sit.map(s=>{
      const who=cName(s.clientId)||s.clientRaw||'';
      return`<div class="frw" style="border-left-color:var(--amber)" onclick="openSite('${s.id}')">
      <div class="bd"><div class="ti">${esc(s.name)}</div><div class="su">${who?esc(who):'cantiere'}</div></div>
      <button class="qbtn ghost" onclick="event.stopPropagation();openSite('${s.id}')">Apri ›</button></div>`;
    }).join(''));
  }
  if(w.pel&&w.pel.length){
    blocks.push(`<div class="grp">🪵 PELLET (${w.pel.length})</div>`+w.pel.map(p=>{
      const who=cName(p.clientId)||p.clientRaw||'';const late=p.date&&p.date<t;const col=late?'#D64528':'#5E9E2E';
      return`<div class="frw" style="border-left-color:${col}" onclick="openPel('${p.id}')">
      <div class="avat" style="width:34px;height:34px;background:#5E9E2E22;border:1px solid #5E9E2E55;font-size:15px;font-weight:400">🪵</div>
      <div class="bd"><div class="ti">${p.qty?fmtQty(p.qty)+' '+esc(p.unit||'sacchi'):'Consegna'}${who?` — <b>${esc(who)}</b>`:''}</div>
      <div class="su">${p.date?'📅 '+fmtD(p.date)+(p.time?' · '+p.time:''):'senza data'}${late?' · <span style="color:#D64528">in ritardo</span>':''}</div></div>
      <button class="qbtn" onclick="event.stopPropagation();markPelDone('${p.id}')">✓ Consegnata</button></div>`;
    }).join(''));
  }
  $('#notifbody').innerHTML=(w.total?greet:'')+(blocks.length?blocks.join(''):`<div class="empty tall"><div class="big">✅</div>Nessuna cosa da fare assegnata a te.<br><span class="subtle">Qui arrivano manutenzioni, appuntamenti, cantieri e consegne assegnati a te.</span></div>`);
}
function markManDone(id){const m=byId(S.maintenances,id);if(!m)return;m.status='fatta';const doer=(me()&&me().name)||'';pushNotify(ownerIds(),'✓ Manutenzione fatta',`${doer}: ${cName(m.clientId)||m.clientRaw||''} — ${m.title}`);save();render();toast('✓ Manutenzione segnata come fatta');}
function markAppDone(id){const a=byId(S.appointments,id);if(!a)return;a.done=true;const doer=(me()&&me().name)||'';pushNotify(ownerIds(),'✓ Appuntamento fatto',`${doer}: ${a.title}`);save();render();toast('✓ Appuntamento fatto');}
function openApp(id){
  const a=id?byId(S.appointments,id):{title:'',clientId:null,clientRaw:null,employeeId:null,date:todayIso(),time:'',done:false};
  if(!a)return;
  openSheet(`<h3>${id?'Appuntamento':'Nuovo appuntamento'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Titolo</label><input id="ap-t" value="${esc(a.title)}" placeholder="es. Sopralluogo Via Roma"></div>
  <div class="fld"><label>Cliente</label><select id="ap-c" onchange="updClientPrev(this,'ap-cprev')"><option value="">${(a.clientRaw&&!a.clientId)?'🆕 '+esc(a.clientRaw)+' (nuovo)':'—'}</option>${cOpt(a.clientId)}</select><div id="ap-cprev">${clientPreviewHTML(a.clientId)}</div></div>
  <div class="fld"><label>Assegna a (uno o più)</label>${empSeg('ap-e',empIdsOf(a))}</div>
  <div class="frow"><div class="fld"><label>Data</label><input id="ap-d" type="date" value="${a.date||''}"></div>
  <div class="fld"><label>Ora</label><input id="ap-h" type="time" value="${a.time||''}"></div></div>
  ${dateChips('ap-d')}
  <div class="fld"><label>Stato</label><div class="seg" id="ap-s"><div class="sg ${!a.done?'on':''}" data-d="0" onclick="this.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));this.classList.add('on')">Da fare</div><div class="sg ${a.done?'on':''}" data-d="1" onclick="this.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));this.classList.add('on')">Fatto</div></div></div>
  <div class="actions">
    ${id?`<button class="btn danger" onclick="delApp('${id}')">Elimina</button>`:''}
    <button class="btn pri" onclick="saveApp('${id||''}')">Salva</button></div>`);
}
function saveApp(id){
  const data={title:$('#ap-t').value.trim(),clientId:$('#ap-c').value||null,employees:empSegRead('ap-e'),date:$('#ap-d').value||null,time:$('#ap-h').value||null,done:$('#ap-s .sg.on')?.dataset.d==='1'};
  if(!data.title){toast('Manca il titolo');return;}
  const oldA=id?byId(S.appointments,id):null;const prevEmps=oldA?empIdsOf(oldA):[];
  if(id){Object.assign(oldA,data);}else{S.appointments.unshift({id:uid(),clientRaw:null,via:'manuale',created:Date.now(),...data});}
  const added=data.employees.filter(e=>!prevEmps.includes(e));
  if(added.length&&!data.done)pushNotify(added,'📅 Appuntamento assegnato',`${data.title}${data.date?' · '+fmtD(data.date):''}${data.time?' '+data.time:''}`);
  save();closeSheet();render();toast('📅 Salvato');
}
function delApp(id){if(!confirm('Eliminare questo appuntamento?'))return;S.appointments=S.appointments.filter(x=>x.id!==id);save();closeSheet();render();toast('🗑 Eliminato');}
function markPelDone(id){const p=byId(S.pellet,id);if(!p)return;p.status='consegnato';const doer=(me()&&me().name)||'';pushNotify(ownerIds(),'🪵 Consegna fatta',`${doer}: ${p.qty?fmtQty(p.qty)+' '+(p.unit||'sacchi'):'consegna'} a ${cName(p.clientId)||p.clientRaw||''}`);save();render();toast('🪵 Consegna registrata');}
function renderChatPanel(){
  $('#notifbody').innerHTML=`
  <div class="wa-note">📲 <b>WhatsApp:</b> il ponte diretto richiede un server (WhatsApp Business API) — non è possibile da app locale. Il parser qui sotto è già pronto: quando attiveremo il server, gli stessi comandi funzioneranno anche via WhatsApp.</div>
  <div class="speaker-row"><div class="speaker on">✎ Scrivi come ${esc(me().name)}</div></div>
  <div class="chatwrap">
    <div class="chat-scroll" id="chatscroll">
      ${S.chat.length?S.chat.map(m=>{
        if(m.sys)return`<div class="msg sys">${esc(m.text)}</div>`;
        const mine=m.who===S.speaker;
        return`<div class="msg ${mine?'me':'them'}">${mine?'':`<div class="who">${esc(eName(m.who)||'?')}</div>`}${esc(m.text)}<div class="tm">${new Date(m.ts).toLocaleTimeString('it-CH',{hour:'2-digit',minute:'2-digit'})}</div></div>`;
      }).join(''):'<div class="empty"><div class="big">💬</div>Chat interna della squadra.<br>Scrivi «aggiungi manutenzione a Rossi domani alle 4»<br>e la registro da sola nella sezione giusta.</div>'}
    </div>
    <div class="chat-input">
      <textarea id="chatinput" rows="1" placeholder="Messaggio o comando…"></textarea>
      <button class="send" onclick="sendChat()">➤</button>
    </div>
  </div>`;
  const ta=$('#chatinput');
  if(ta)ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
  const sc=$('#chatscroll');if(sc)sc.scrollTop=sc.scrollHeight;
}
const CMD_RE=/^\s*(aggiungi|segna|metti|crea|ricordami|ricorda|programma|inserisci)\b|^\//i;
async function sendChat(){
  const ta=$('#chatinput');const text=ta.value.trim();if(!text)return;
  const rows=[{id:uid(),emp_id:S.speaker,text,sys:false}];
  S.chat.push({id:rows[0].id,who:S.speaker,text,ts:Date.now()});
  if(CMD_RE.test(text)){
    const p=parseInput(text.replace(/^\//,''));
    const msg=commitParsed(p,'chat'); // commitParsed chiama save() → sync
    rows.push({id:uid(),emp_id:null,text:msg,sys:true});
    S.chat.push({id:rows[1].id,who:null,text:msg,sys:true,ts:Date.now()});
  }
  render();
  const{error}=await sb.from('chat').insert(rows);
  if(error)toast('⚠ Chat: '+error.message);
}


