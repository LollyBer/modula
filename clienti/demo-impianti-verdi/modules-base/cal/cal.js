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
    <div class="legend">${Object.values(TYPE_META).filter(t=>t.label!=='Lista').map(t=>`<span><i style="background:${t.hex}"></i>${t.label}</span>`).join('')}</div>
  </div>
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
    <div class="fld"><label>Tipo</label><select id="qa-type"><option value="appointment">Appuntamento</option><option value="maintenance">Manutenzione</option><option value="pellet">Consegna pellet</option><option value="note">Nota</option></select></div>
    <div class="fld"><label>Ora</label><input id="qa-time" type="time"></div>
  </div>
  <div class="fld"><label>Cliente (opzionale)</label><select id="qa-cl"><option value="">—</option>${cOpt('')}</select></div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="quickAddSave('${date}')">Salva</button></div>`);
}
function quickAddSave(date){
  const t=$('#qa-t').value.trim();if(!t){toast('Scrivi cosa devi fare');return;}
  const type=$('#qa-type').value,time=$('#qa-time').value||null,clientId=$('#qa-cl').value||null;
  const p={type,title:t,date,time,person:clientId?{kind:'client',id:clientId,name:cName(clientId)}:null,qty:null,unit:null};
  const msg=commitParsed(p,'cal');closeSheet();toast(msg);render();
}

