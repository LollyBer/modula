/* ===== MODULO BASE: CALENDARIO ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= CALENDARIO ================= */
let calCur=new Date();let calSel=todayIso();let calMode='mese';
function renderCal(){
  if(calMode==='agenda'){renderAgenda();return;}
  const calTabs=`<div class="tabs"><div class="tb on">Mese</div><div class="tb" onclick="calMode='agenda';render()">Agenda</div></div>`;
  const y=calCur.getFullYear(),m=calCur.getMonth();
  const first=new Date(y,m,1);let startDow=(first.getDay()+6)%7; // lun=0
  const daysIn=new Date(y,m+1,0).getDate();
  const ev=allEvents();const map={};ev.forEach(e=>{(map[e.date]=map[e.date]||[]).push(e)});
  let cells='';
  const prevDays=new Date(y,m,0).getDate();
  for(let i=0;i<42;i++){
    let d,mm=m,yy=y,dim=false;
    if(i<startDow){d=prevDays-startDow+1+i;mm=m-1;dim=true;}
    else if(i<startDow+daysIn){d=i-startDow+1;}
    else{d=i-startDow-daysIn+1;mm=m+1;dim=true;}
    const dt=new Date(yy,mm,d);const di=iso(dt);
    const evs=map[di]||[];
    const dots=evs.slice(0,4).map(e=>`<i style="background:${TYPE_META[e.type].hex}"></i>`).join('');
    cells+=`<div class="cal-cell ${dim?'dim':''} ${di===todayIso()?'today':''} ${di===calSel?'sel':''}" onclick="calPick('${di}')">
      <span class="dn">${d}</span><span class="cal-dots">${dots}</span>${evs.length>4?`<span class="more">+${evs.length-4}</span>`:''}</div>`;
    if(i>=startDow+daysIn-1&&(i+1)%7===0)break;
  }
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Calendario</div>
  ${calTabs}
  <div class="card hl">
    <div class="cal-head">
      <div class="mon">${MESI[m]} ${y}</div>
      <button class="cal-nav" onclick="calShift(-1)">‹</button>
      <button class="cal-nav" onclick="calToday()" style="width:auto;padding:0 12px;font-size:11px;font-family:var(--mono)">oggi</button>
      <button class="cal-nav" onclick="calShift(1)">›</button>
    </div>
    <div class="cal-grid">${['LU','MA','ME','GI','VE','SA','DO'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}${cells}</div>
    <div class="legend">${calTypes().map(v=>`<span><i style="background:${v.hex}"></i>${esc(v.label)}</span>`).join('')}</div>
  </div>
  ${isOwner()?`<div style="display:flex;justify-content:flex-end;margin:-2px 0 8px"><button class="btn sm ghost" onclick="openCalTypes()">⚙️ Voci calendario</button></div>`:''}
  <button class="fab" onclick="openQuickAdd('${calSel}')">+</button>`;
}
function calShift(n){calCur=new Date(calCur.getFullYear(),calCur.getMonth()+n,1);render();}
function renderAgenda(){
  const ev=allEvents().filter(e=>!e.done);
  const t=todayIso();
  const late=ev.filter(e=>e.date<t);
  const now=new Date();now.setHours(0,0,0,0);
  let daysHtml='';
  for(let i=0;i<14;i++){
    const d=new Date(now);d.setDate(d.getDate()+i);const di=iso(d);
    const evs=ev.filter(e=>e.date===di);
    if(!evs.length&&i>0)continue;
    daysHtml+=`<div class="card ${i===0?'hl':''}"><div class="sh"><span class="t" style="${i===0?'color:var(--cy)':''}">${fmtD(di)}</span><span class="a" onclick="openQuickAdd('${di}')">+ Aggiungi</span></div>
    ${evs.length?evs.map(evRow).join(''):'<div class="empty" style="padding:18px">Libero.</div>'}</div>`;
  }
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Calendario</div>
  <div class="tabs"><div class="tb" onclick="calMode='mese';render()">Mese</div><div class="tb on">Agenda</div></div>
  ${late.length?`<div class="card" style="border-color:rgba(214,69,40,.35)"><div class="sh"><span class="t" style="color:var(--coral)">⚠ In ritardo</span></div>${late.map(evRow).join('')}</div>`:''}
  ${daysHtml||'<div class="card"><div class="empty"><div class="big">🌊</div>Prossime 2 settimane libere.</div></div>'}`;
}
function calToday(){calCur=new Date();calSel=todayIso();render();}
function calPick(d){calSel=d;render();openDayPreview(d);}
function openDayPreview(d){
  const evs=allEvents().filter(e=>e.date===d).sort((a,b)=>((a.time||'99:99')<(b.time||'99:99')?-1:1));
  const isToday=d===todayIso();
  openSheet(`<h3><span>📅 ${fmtD(d)}${isToday?' <span class="badge" style="border-color:var(--cy);color:var(--cy)">oggi</span>':''} <span class="subtle">(${evs.length})</span></span><span class="x" onclick="closeSheet()">✕</span></h3>
    ${evs.length?evs.map(evRow).join(''):'<div class="empty"><div class="big">🌊</div>Niente in programma.<br>Giornata libera.</div>'}
    <button class="btn pri" style="width:100%;margin-top:14px" onclick="closeSheet();openQuickAdd('${d}')">+ Aggiungi cosa da fare</button>`);
}
function openQuickAdd(date){
  openSheet(`<h3>Aggiungi al ${fmtD(date)} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Cosa</label><input id="qa-t" placeholder="es. Sopralluogo da Bernasconi"></div>
  <div class="frow">
    <div class="fld"><label>Tipo</label><select id="qa-type">${calTypes().map(v=>`<option value="${v.id}">${v.ic||''} ${esc(v.label)}</option>`).join('')}</select></div>
    <div class="fld"><label>Ora</label><input id="qa-time" type="time"></div>
  </div>
  <div class="fld"><label>Cliente (opzionale)</label><select id="qa-cl"><option value="">—</option>${cOpt('')}</select></div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="quickAddSave('${date}')">Salva</button></div>`);
}
function quickAddSave(date){
  const t=$('#qa-t').value.trim();if(!t){toast('Scrivi cosa devi fare');return;}
  const voce=calTypeById($('#qa-type').value)||calTypes()[0];
  const type=voce?voce.kind:'note';
  const time=$('#qa-time').value||null,clientId=$('#qa-cl').value||null;
  const p={type,title:t,date,time,person:clientId?{kind:'client',id:clientId,name:cName(clientId)}:null,qty:null,unit:null};
  const msg=commitParsed(p,'cal');closeSheet();toast(msg);render();
}

/* ================= ⚙️ VOCI DEL CALENDARIO (gestione, solo titolare) ================= */
/* Se il titolare non ha ancora personalizzato, materializza i default (così sono modificabili). */
function calTypesEnsure(){if(!Array.isArray(S.settings.eventTypes)||!S.settings.eventTypes.length){S.settings.eventTypes=defaultCalTypes().map(v=>({label:v.label,ic:v.ic,hex:v.hex,kind:v.kind,id:uid()}));}}
function openCalTypes(){
  const list=calTypes();
  openSheet(`<h3>⚙️ Voci del calendario <span class="x" onclick="closeSheet();render()">✕</span></h3>
  <div class="subtle" style="margin-bottom:10px">Crea le voci che usi e collega ognuna a un modulo: quando scegli quella voce in un evento, l'app crea in automatico la scheda nel modulo giusto (col cliente). Compaiono solo le voci dei moduli che hai attivi.</div>
  ${list.map(v=>{const link=KIND_LINK[v.kind]||v.kind;return`<div class="frw" style="cursor:pointer" onclick="editCalType('${v.id}')">
    <div class="avat" style="width:34px;height:34px;background:${v.hex}22;border:1px solid ${v.hex}77;font-size:16px">${v.ic||'📌'}</div>
    <div class="bd"><div class="ti">${esc(v.label)}</div><div class="su">${esc(link)}</div></div>
    <span style="color:var(--t3);font-size:14px">✏️</span></div>`;}).join('')||'<div class="empty">Nessuna voce.</div>'}
  <button class="btn pri" style="width:100%;margin-top:10px" onclick="editCalType()">+ Nuova voce</button>`);
}
function editCalType(id){
  calTypesEnsure();
  const v=id?S.settings.eventTypes.find(x=>x.id===id):null;
  const cur=v||{label:'',ic:'📌',hex:'#5BA02C',kind:(defaultCalTypes()[0]||{kind:'note'}).kind};
  const kinds=Object.keys(EVENT_KINDS).filter(k=>moduleActive(EVENT_KINDS[k].module));
  openSheet(`<h3>${id?'Modifica voce':'Nuova voce'} <span class="x" onclick="openCalTypes()">✕</span></h3>
  <div class="fld"><label>Nome</label><input id="ct-label" value="${esc(cur.label)}" placeholder="es. Manutenzione caldaia"></div>
  <div class="frow">
    <div class="fld"><label>Emoji</label><input id="ct-ic" value="${esc(cur.ic||'')}" maxlength="2" style="text-align:center;font-size:18px"></div>
    <div class="fld"><label>Colore</label><input id="ct-hex" type="color" value="${cur.hex||'#5BA02C'}" style="height:40px;padding:4px"></div>
  </div>
  <div class="fld"><label>Collega al modulo</label><select id="ct-kind">${kinds.map(k=>`<option value="${k}" ${cur.kind===k?'selected':''}>${esc(KIND_LINK[k]||k)}</option>`).join('')}</select></div>
  <div class="actions">${id?`<button class="btn danger" onclick="delCalType('${id}')">Elimina</button>`:''}<button class="btn ghost" onclick="openCalTypes()">Annulla</button><button class="btn pri" onclick="saveCalType('${id||''}')">Salva</button></div>`);
}
function saveCalType(id){
  calTypesEnsure();
  const label=$('#ct-label').value.trim();if(!label){toast('Dai un nome alla voce');return;}
  const data={label,ic:$('#ct-ic').value.trim()||'📌',hex:$('#ct-hex').value||'#5BA02C',kind:$('#ct-kind').value};
  if(id){const v=S.settings.eventTypes.find(x=>x.id===id);if(v)Object.assign(v,data);}
  else S.settings.eventTypes.push({id:uid(),...data});
  save();openCalTypes();toast('✓ Voce salvata');
}
function delCalType(id){S.settings.eventTypes=(S.settings.eventTypes||[]).filter(x=>x.id!==id);save();openCalTypes();toast('Voce eliminata');}

