/* ===== MODULO BASE: CALENDARIO ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= CALENDARIO ================= */
let calCur=new Date();let calSel=todayIso();let calMode='mese';
/* helpers date per giorno/settimana (nomi unici: non ridefinire iso/addDaysIso globali) */
function calAddDays(s,n){const[y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d);dt.setDate(dt.getDate()+n);return iso(dt);}
function weekMonday(s){const[y,m,d]=s.split('-').map(Number);const dow=(new Date(y,m-1,d).getDay()+6)%7;return calAddDays(s,-dow);}
function fmtDayLong(s){const[y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d);return GG[dt.getDay()].charAt(0).toUpperCase()+GG[dt.getDay()].slice(1)+' '+d+' '+MESI[m-1];}
function calStep(mode,n){calSel=calAddDays(calSel||todayIso(),mode==='settimana'?7*n:n);render();}
function calTabsBar(){
  const t=[['mese','Mese'],['settimana','Settimana'],['giorno','Giorno'],['agenda','Agenda']];
  return `<div class="tabs">${t.map(([m,l])=>`<div class="tb ${calMode===m?'on':''}" onclick="calMode='${m}';render()">${l}</div>`).join('')}</div>`;
}
function renderCal(){
  if(calMode==='agenda'){renderAgenda();return;}
  if(calMode==='giorno'){renderDay();return;}
  if(calMode==='settimana'){renderWeek();return;}
  const calTabs=calTabsBar();
  /* la vista Mese segue sempre il giorno selezionato (calSel) → niente disallineamento con Giorno/Settimana */
  const _cs=(calSel||todayIso()).split('-').map(Number);calCur=new Date(_cs[0],_cs[1]-1,1);
  const y=calCur.getFullYear(),m=calCur.getMonth();
  const first=new Date(y,m,1);let startDow=(first.getDay()+6)%7; // lun=0
  const daysIn=new Date(y,m+1,0).getDate();
  const map=calDayMap();
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
function calShift(n){calCur=new Date(calCur.getFullYear(),calCur.getMonth()+n,1);calSel=iso(calCur);render();}
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
  ${calTabsBar()}
  ${late.length?`<div class="card" style="border-color:rgba(214,69,40,.35)"><div class="sh"><span class="t" style="color:var(--coral)">⚠ In ritardo</span></div>${late.map(evRow).join('')}</div>`:''}
  ${daysHtml||'<div class="card"><div class="empty"><div class="big">🌊</div>Prossime 2 settimane libere.</div></div>'}`;
}
/* mappa giorno→eventi, espandendo gli eventi multi-giorno su ogni giornata coperta.
   Ogni voce è una copia dell'evento con `seg`: 'solo' | 'start' | 'mid' | 'end' e `day`. */
function calDayMap(){
  const map={};
  allEvents().forEach(e=>{
    const start=e.date; const end=(e.endDate&&e.endDate>start)?e.endDate:start;
    let d=start,guard=0;
    while(guard++<400){
      const seg=(start===end)?'solo':(d===start?'start':(d===end?'end':'mid'));
      (map[d]=map[d]||[]).push(Object.assign({},e,{seg,day:d}));
      if(d===end)break; d=calAddDays(d,1);
    }
  });
  const key=e=>e.seg==='end'?(e.endTime||'99:98'):(e.time||'99:99');
  Object.keys(map).forEach(k=>map[k].sort((a,b)=>key(a)<key(b)?-1:1));
  return map;
}
function evChipTime(e){if(e.seg==='end')return 'fine '+(e.endTime||'');if(e.seg==='mid')return '⋯';return e.time||'';}
function weekLabel(a,b){const[,am,ad]=a.split('-').map(Number);const[,bm,bd]=b.split('-').map(Number);return am===bm?`${ad}–${bd} ${MESI[bm-1]}`:`${ad} ${MESI[am-1].slice(0,3)} – ${bd} ${MESI[bm-1].slice(0,3)}`;}
function renderDay(){
  const d=calSel||todayIso();
  const evs=calDayMap()[d]||[];
  const allday=evs.filter(e=>!e.time&&e.seg!=='end');
  const timed=evs.filter(e=>e.time||e.seg==='end');
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Calendario</div>
  ${calTabsBar()}
  <div class="card hl">
    <div class="cal-head">
      <div class="mon">${fmtDayLong(d)}${d===todayIso()?' <span class="badge" style="border-color:var(--cy);color:var(--cy)">oggi</span>':''}</div>
      <button class="cal-nav" onclick="calStep('giorno',-1)">‹</button>
      <button class="cal-nav" onclick="calToday()" style="width:auto;padding:0 12px;font-size:11px;font-family:var(--mono)">oggi</button>
      <button class="cal-nav" onclick="calStep('giorno',1)">›</button>
    </div>
    ${allday.length?`<div class="subtle" style="margin:2px 0 6px">Tutto il giorno</div>${allday.map(evRow).join('')}`:''}
    ${timed.length?`${allday.length?'<div class="subtle" style="margin:12px 0 6px">Con orario</div>':''}${timed.map(evRow).join('')}`:''}
    ${!evs.length?'<div class="empty" style="padding:22px"><div class="big">🌊</div>Niente in programma.<br>Giornata libera.</div>':''}
  </div>
  <button class="fab" onclick="openQuickAdd('${d}')">+</button>`;
}
function renderWeek(){
  const base=calSel||todayIso();const mon=weekMonday(base);const map=calDayMap();
  const DOW=['LU','MA','ME','GI','VE','SA','DO'];
  let cols='';
  for(let i=0;i<7;i++){
    const di=calAddDays(mon,i);const dn=+di.split('-')[2];
    const evs=map[di]||[];const isToday=di===todayIso();
    const chips=evs.map(e=>{const M=TYPE_META[e.type];return `<div class="wk-chip" onclick="event.stopPropagation();openEv('${e.type}','${e.id}')" style="border-left:3px solid ${M.hex}"><b>${esc(evChipTime(e))}</b> ${esc(e.title)}</div>`;}).join('')||'<div class="wk-empty">—</div>';
    cols+=`<div class="wk-col ${isToday?'today':''}">
      <div class="wk-h" onclick="calSel='${di}';calMode='giorno';render()"><span class="wk-dow">${DOW[i]}</span><span class="wk-dn">${dn}</span></div>
      <div class="wk-body">${chips}</div>
      <button class="wk-add" onclick="openQuickAdd('${di}')">+ aggiungi</button>
    </div>`;
  }
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Calendario</div>
  ${calTabsBar()}
  <div class="card hl">
    <div class="cal-head">
      <div class="mon">${weekLabel(mon,calAddDays(mon,6))}</div>
      <button class="cal-nav" onclick="calStep('settimana',-1)">‹</button>
      <button class="cal-nav" onclick="calToday()" style="width:auto;padding:0 12px;font-size:11px;font-family:var(--mono)">oggi</button>
      <button class="cal-nav" onclick="calStep('settimana',1)">›</button>
    </div>
    <div class="wk-grid">${cols}</div>
  </div>`;
}
function calToday(){calCur=new Date();calSel=todayIso();render();}
function calPick(d){calSel=d;render();openDayPreview(d);}
function openDayPreview(d){
  const evs=calDayMap()[d]||[];
  const isToday=d===todayIso();
  openSheet(`<h3><span>📅 ${fmtD(d)}${isToday?' <span class="badge" style="border-color:var(--cy);color:var(--cy)">oggi</span>':''} <span class="subtle">(${evs.length})</span></span><span class="x" onclick="closeSheet()">✕</span></h3>
    ${evs.length?evs.map(evRow).join(''):'<div class="empty"><div class="big">🌊</div>Niente in programma.<br>Giornata libera.</div>'}
    <button class="btn pri" style="width:100%;margin-top:14px" onclick="closeSheet();openQuickAdd('${d}')">+ Aggiungi cosa da fare</button>`);
}
function openQuickAdd(date){
  openSheet(`<h3>Aggiungi al ${fmtD(date)} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Cosa</label><input id="qa-t" placeholder="es. Sopralluogo da Bernasconi"></div>
  <div class="frow">
    <div class="fld"><label>Tipo</label><select id="qa-type" onchange="qaSyncFields()">${calTypes().map(v=>`<option value="${v.id}">${v.ic||''} ${esc(v.label)}</option>`).join('')}</select></div>
    <div class="fld" id="qa-fld-time"><label>Ora inizio</label><input id="qa-time" type="time"></div>
  </div>
  <div class="frow" id="qa-frow-end">
    <div class="fld"><label>Ora fine (facolt.)</label><input id="qa-endtime" type="time"></div>
    <div class="fld"><label>Giorno fine (se dura più giorni)</label><input id="qa-enddate" type="date" value="${date}" min="${date}"></div>
  </div>
  <div class="fld"><label>Cliente (opzionale)</label>${cliInput('qa-cl','','qa-clprev')}<div id="qa-clprev"></div></div>
  <div class="fld" id="qa-fld-place"><label>Luogo (opzionale)</label><input id="qa-place" placeholder="es. Via Motta 3, Lugano"></div>
  <div class="fld"><label>Assegna a (opzionale)</label>${empSeg('qa-e',[])}</div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="quickAddSave('${date}')">Salva</button></div>`);
  qaSyncFields();
}
/* Mostra solo i campi che la voce scelta usa davvero:
   pellet → data+ora (niente luogo/ora-fine); cantiere → solo il giorno (niente ora/luogo/ora-fine).
   Così non si inseriscono dati che il modulo collegato ignorerebbe silenziosamente. */
function qaSyncFields(){
  const v=calTypeById(($('#qa-type')||{}).value)||calTypes()[0];
  const k=v?v.kind:'note';
  const showEnd=(k==='appointment'||k==='maintenance'||k==='note'); // luogo + ora-fine + giorno-fine
  const showTime=(k!=='site');                                      // il cantiere usa solo la data d'inizio
  const set=(id,show)=>{const el=document.getElementById(id);if(el)el.style.display=show?'':'none';};
  set('qa-fld-time',showTime);set('qa-frow-end',showEnd);set('qa-fld-place',showEnd);
}
function quickAddSave(date){
  const t=$('#qa-t').value.trim();if(!t){toast('Scrivi cosa devi fare');return;}
  const voce=calTypeById($('#qa-type').value)||calTypes()[0];
  const type=voce?voce.kind:'note';
  const clientId=$('#qa-cl').value||null;
  const rawName=(!clientId&&$('#qa-cl').dataset&&$('#qa-cl').dataset.raw)||null;
  const time=$('#qa-time').value||null;
  const endTime=($('#qa-endtime')&&$('#qa-endtime').value)||null;
  let endDate=($('#qa-enddate')&&$('#qa-enddate').value)||null;
  if(endDate&&endDate<=date)endDate=null; // fine oltre il giorno d'inizio → multi-giorno; altrimenti stesso giorno
  const place=($('#qa-place')&&$('#qa-place').value.trim())||null;
  const employees=(typeof empSegRead==='function')?empSegRead('qa-e'):[];
  const p={type,title:t,date,time,endTime,endDate,place,employees,person:clientId?{kind:'client',id:clientId,name:cName(clientId)}:(rawName?{kind:'raw',name:rawName}:null),qty:null,unit:null};
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

