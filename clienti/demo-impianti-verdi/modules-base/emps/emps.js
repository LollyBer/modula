/* ===== MODULO BASE: PERSONALE ===== */
/* Due sezioni:
   1) PRESENZE (vista normale) — elenco persone → tocca → registra/modifica orari,
      presenze, assenze, malattie, ferie, permessi. Conteggio ore mese/anno + PDF.
   2) GESTIONE (solo titolare, via pulsante ⚙️) — aggiungi/modifica/elimina persone,
      codici invito, permessi.
   Dipende dal core (S, esc, save, openSheet, byId, uid, fmtQty, toast, isOwner...). */

/* ---- tipi di giornata ---- */
const TT={
  lavoro:{i:'🟢',l:'Lavoro',work:true,c:'#2E9E5E'},
  ferie:{i:'🏖️',l:'Ferie',c:'#2F80ED'},
  malattia:{i:'🤒',l:'Malattia',c:'#D64528'},
  permesso:{i:'🕐',l:'Permesso',c:'#C77F12'},
  assenza:{i:'⚪',l:'Assenza',c:'#8892A0'},
  festivo:{i:'🎉',l:'Festivo',c:'#7C5CBF'}
};
/* ore di una registrazione: da orario (start/end - pausa) se presente, altrimenti manuale */
function teHours(t){
  if(t.start&&t.end){
    const p=s=>{const[a,b]=String(s).split(':').map(Number);return(a||0)*60+(b||0);};
    let d=p(t.end)-p(t.start); if(d<0)d+=1440; d-=(+t.brk||0);
    return Math.max(0,Math.round(d/6)/10);
  }
  return +t.hours||0;
}
/* orario abituale: ultimo giorno di LAVORO con dalle/alle (per l'inserimento rapido).
   Se non c'è storico usa un default sensato 08:00–17:00 con 60 min di pausa. */
function lastSchedule(empId){
  const w=S.timeEntries.filter(t=>t.empId===empId&&t.type==='lavoro'&&t.start&&t.end).sort((a,b)=>a.date<b.date?1:-1);
  return w.length?{start:w[0].start,end:w[0].end,brk:w[0].brk||''}:{start:'08:00',end:'17:00',brk:'60'};
}
/* inserimento a un tocco per una data qualsiasi (sovrascrive se il giorno c'è già) */
function quickAddDate(empId,date,type){
  const d={empId,date,type,start:'',end:'',brk:'',note:'',hours:0};
  if(type==='lavoro'){const s=lastSchedule(empId);d.start=s.start;d.end=s.end;d.brk=s.brk;d.hours=teHours(s);}
  const ex=S.timeEntries.find(t=>t.empId===empId&&t.date===date);
  if(ex)Object.assign(ex,d); else S.timeEntries.push({id:uid(),...d});
  save();openTimesheet(empId,date.slice(0,7));toast('✓ '+TT[type].l);
}
const quickAdd=(empId,type)=>quickAddDate(empId,todayIso(),type);

/* ---- mini calendario del mese (Lu→Do), colorato per tipo giornata ---- */
function tsCalendar(empId,ym){
  const[y,m]=ym.split('-').map(Number);
  const days=new Date(y,m,0).getDate();
  let off=(new Date(y,m-1,1).getDay()+6)%7; // lunedì-first
  const today=todayIso(), sel=window._tsSel||{};
  const head=['Lu','Ma','Me','Gi','Ve','Sa','Do'].map(d=>`<div style="text-align:center;font-size:9.5px;color:var(--t2);padding-bottom:2px">${d}</div>`).join('');
  let cells='';for(let i=0;i<off;i++)cells+='<div></div>';
  for(let d=1;d<=days;d++){
    const dd=String(d).padStart(2,'0'), date=ym+'-'+dd;
    const e=S.timeEntries.find(t=>t.empId===empId&&t.date===date);
    const c=e?TT[e.type].c:'', badge=e?(TT[e.type].work?fmtQty(teHours(e))+'h':TT[e.type].i):'';
    cells+=`<div onclick="dayTap(event,'${empId}','${date}')" style="aspect-ratio:1;border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;${e?`background:${c}22;border:1px solid ${c}66`:'background:var(--bg2);border:1px solid var(--line)'};${sel[date]?'outline:2px solid var(--cy);outline-offset:1px;':''}${date===today?'box-shadow:inset 0 0 0 2px var(--cy);':''}">
      <div style="font-size:12px;color:var(--t1);font-weight:${e?'700':'400'}">${d}</div>
      ${badge?`<div style="font-size:8px;color:${c};line-height:1;margin-top:1px">${esc(badge)}</div>`:''}
    </div>`;
  }
  return`<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">${head}</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">${cells}</div>`;
}
/* tocco su un giorno: in modalità selezione lo (de)seleziona; altrimenti apre modifica o scelta rapida */
function dayTap(ev,empId,date){
  if(window._tsSelMode){
    window._tsSel=window._tsSel||{};
    if(window._tsSel[date]){delete window._tsSel[date];ev.currentTarget.style.outline='';}
    else{window._tsSel[date]=1;ev.currentTarget.style.outline='2px solid var(--cy)';ev.currentTarget.style.outlineOffset='1px';}
    const n=Object.keys(window._tsSel).length;
    const c=document.getElementById('ts-seln');if(c)c.textContent=n;
    const b=document.getElementById('ts-apply');if(b)b.disabled=!n;
    return;
  }
  const e=S.timeEntries.find(t=>t.empId===empId&&t.date===date);
  if(e)editTimeEntry(empId,e.id); else dayChooser(empId,date);
}
/* scelta rapida per un giorno vuoto (anche passato) */
function dayChooser(empId,date){
  const s=lastSchedule(empId),h=teHours(s);
  openSheet(`<h3>${dLabel(date)} <span class="x" onclick="openTimesheet('${empId}','${date.slice(0,7)}')">✕</span></h3>
  <div class="subtle" style="margin:-6px 0 12px">Cosa registri per questo giorno?</div>
  <button class="btn pri" style="width:100%;margin-bottom:8px" onclick="quickAddDate('${empId}','${date}','lavoro')">🟢 Lavoro · ${s.start}–${s.end} (${fmtQty(h)}h)</button>
  <div class="seg" style="gap:7px;flex-wrap:wrap;margin-bottom:12px">${['ferie','malattia','permesso','assenza','festivo'].map(t=>`<div class="sg" onclick="quickAddDate('${empId}','${date}','${t}')">${TT[t].i} ${TT[t].l}</div>`).join('')}</div>
  <button class="btn ghost" style="width:100%" onclick="editTimeEntry('${empId}','','${date}')">✏️ Personalizza (orario, note)…</button>`);
}
/* selezione multi-giorno */
function tsSelStart(empId){window._tsSelMode=true;window._tsSel={};openTimesheet(empId,window._tsMonth);}
function tsSelCancel(empId){window._tsSelMode=false;window._tsSel={};openTimesheet(empId,window._tsMonth);}
function bulkDaysSheet(empId){
  const dates=Object.keys(window._tsSel||{});if(!dates.length)return;
  const s=lastSchedule(empId);
  const seg=Object.entries(TT).map(([v,o])=>`<div class="sg ${v==='lavoro'?'on':''}" data-v="${v}" onclick="[...this.parentNode.children].forEach(x=>x.classList.remove('on'));this.classList.add('on')">${o.i} ${o.l}</div>`).join('');
  openSheet(`<h3>${dates.length} giorni <span class="x" onclick="openTimesheet('${empId}','${window._tsMonth}')">✕</span></h3>
  <div class="subtle" style="margin:-6px 0 12px">Stessa registrazione applicata a tutti i giorni selezionati.</div>
  <div class="fld"><label>Tipo giornata</label><div class="seg" id="bk-type" style="gap:7px;flex-wrap:wrap">${seg}</div></div>
  <div class="fld"><label>Orario (solo per il Lavoro)</label><div class="frow">
    <div class="fld" style="margin:0"><label>Dalle</label><input id="bk-s" type="time" value="${esc(s.start)}"></div>
    <div class="fld" style="margin:0"><label>Alle</label><input id="bk-e" type="time" value="${esc(s.end)}"></div>
    <div class="fld" style="margin:0"><label>Pausa (min)</label><input id="bk-b" inputmode="numeric" value="${esc(s.brk||'')}"></div>
  </div></div>
  <div class="fld"><label>Nota (facoltativa)</label><input id="bk-note" placeholder=""></div>
  <div class="actions"><button class="btn pri" onclick="saveBulkDays('${empId}')">Applica a ${dates.length} giorni</button></div>`);
}
function saveBulkDays(empId){
  const dates=Object.keys(window._tsSel||{});
  const type=(document.querySelector('#bk-type .sg.on')||{dataset:{}}).dataset.v||'lavoro';
  const start=$('#bk-s').value||'',end=$('#bk-e').value||'',brk=$('#bk-b').value||'',note=$('#bk-note').value.trim();
  const work=type==='lavoro';
  const hours=(work&&start&&end)?teHours({start,end,brk}):0;
  dates.forEach(date=>{
    const base={empId,date,type,start:work?start:'',end:work?end:'',brk:work?brk:'',note,hours};
    const ex=S.timeEntries.find(t=>t.empId===empId&&t.date===date);
    if(ex)Object.assign(ex,base);else S.timeEntries.push({id:uid(),...base});
  });
  window._tsSelMode=false;window._tsSel={};
  save();openTimesheet(empId,window._tsMonth);toast('✓ '+dates.length+' giorni registrati');
}
/* registrazioni di una persona, filtrabili per mese (YYYY-MM) o anno (YYYY) */
const tsMonth=(empId,ym)=>S.timeEntries.filter(t=>t.empId===empId&&t.date&&t.date.slice(0,7)===ym).sort((a,b)=>a.date<b.date?-1:1);
const tsYearL=(empId,y)=>S.timeEntries.filter(t=>t.empId===empId&&t.date&&t.date.slice(0,4)===y);
/* riepilogo: ore lavorate totali + conteggio giorni per tipo */
function tsSum(list){
  const s={hours:0,lavoro:0,ferie:0,malattia:0,permesso:0,assenza:0,festivo:0};
  list.forEach(t=>{s.hours+=teHours(t);s[t.type]=(s[t.type]||0)+1;});
  return s;
}
/* straordinari (saldo ore): somma su tutte le giornate di LAVORO di (ore fatte − ore previste/giorno).
   null se il dipendente non ha 'ore previste' impostate. Positivo = straordinario, negativo = a debito. */
function overtime(empId,list){
  const e=byId(S.employees,empId), dh=+((e||{}).dayHours);
  if(!(dh>0))return null;
  return list.reduce((o,t)=>o+(t.type==='lavoro'?teHours(t)-dh:0),0);
}
/* saldo ferie annuo: {tot, used, left}. null se non sono impostati i giorni spettanti. */
function ferieResiduo(empId,y){
  const e=byId(S.employees,empId), tot=+((e||{}).holidayDays);
  if(!(tot>0))return null;
  const used=tsYearL(empId,y).filter(t=>t.type==='ferie').length;
  return {tot,used,left:tot-used};
}
const sgn=n=>(n>0?'+':'')+fmtQty(n);
function shiftMonth(ym,d){let[y,m]=ym.split('-').map(Number);m+=d;while(m<1){m+=12;y--;}while(m>12){m-=12;y++;}return y+'-'+String(m).padStart(2,'0');}
const MN=['','Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const monthName=ym=>MN[+ym.split('-')[1]]+' '+ym.split('-')[0];
const dLabel=d=>{const dt=new Date(d+'T00:00:00');return['Dom','Lun','Mar','Mer','Gio','Ven','Sab'][dt.getDay()]+' '+d.slice(8,10)+'/'+d.slice(5,7);};

/* ================= VISTA NORMALE: PRESENZE ================= */
function renderEmps(){
  if(window._empsTab==='gestione'&&isOwner())return renderEmpsManage();
  const ym=todayIso().slice(0,7), y=ym.slice(0,4);
  const selMode=!!window._empSelMode, sel=window._empSel||{}, nSel=Object.keys(sel).length;
  $('#main').innerHTML=`
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
    <div class="pagetitle" style="margin:0;flex:1"><span class="accent" style="background:var(--cy)"></span>Personale</div>
    ${isOwner()&&!selMode?`<button class="btn sm ghost" onclick="window._empsTab='gestione';render()">⚙️ Gestione</button>`:''}
  </div>
  ${selMode
    ?`<div class="card" style="padding:10px 11px;margin-bottom:11px;display:flex;align-items:center;gap:9px;border-color:var(--cy)"><div style="flex:1"><b>${nSel}</b> persone selezionate</div><button class="btn sm ghost" onclick="empSelCancel()">Annulla</button><button class="btn sm pri" ${nSel?'':'disabled'} onclick="empBulkSheet()">Registra…</button></div>`
    :`<div class="subtle" style="margin:-2px 0 9px">Tocca una persona per registrare orari, presenze, assenze, malattie e ferie.</div>
      ${S.employees.length?`<div style="display:flex;gap:7px;margin-bottom:11px;flex-wrap:wrap">
        <button class="btn ghost sm" style="flex:1;min-width:90px" onclick="window._empWho=!window._empWho;render()">👀 Chi c'è</button>
        ${isOwner()&&S.employees.length>1?`<button class="btn ghost sm" style="flex:1;min-width:90px" onclick="empSelStart()">☑️ Più persone</button>`:''}
        ${isOwner()?`<button class="btn ghost sm" style="flex:1;min-width:90px" onclick="monthReportSheet()">🖨 Riepilogo</button>`:''}
      </div>${window._empWho?whoPanel():''}`:''}`}
  ${S.employees.length?S.employees.map(e=>{
    const mh=tsSum(tsMonth(e.id,ym)).hours, yh=tsSum(tsYearL(e.id,y)).hours;
    const col=e.isOwner?'#5BA02C':(e.active!==false?'#2E9E5E':'#D64528');
    const on=!!sel[e.id];
    return`<div class="card" style="padding:11px;margin-bottom:9px;cursor:pointer;${on?'outline:2px solid var(--cy);outline-offset:1px':''}" onclick="empCardTap(event,'${e.id}')">
      <div style="display:flex;align-items:center;gap:11px">
        ${selMode?`<div style="width:22px;height:22px;border-radius:6px;flex-shrink:0;display:flex;align-items:center;justify-content:center;${on?'background:var(--cy);border:1px solid var(--cy);color:#fff':'background:var(--bg2);border:1px solid var(--line2)'}">${on?'✓':''}</div>`:''}
        <div class="avat" style="width:42px;height:42px;background:${col}22;border:1px solid ${col}55;color:${col};font-size:15px">${esc(cInitials(e.name))}</div>
        <div style="flex:1;min-width:0"><div style="font-size:14px;color:var(--t1);font-weight:600">${esc(e.name)}${e.isOwner?' 👑':''}</div><div class="su" style="font-size:10.5px">${esc(e.role||'—')}</div></div>
        <div style="text-align:right;flex-shrink:0"><div style="font-size:15px;color:var(--t1);font-weight:600">${fmtQty(mh)}h</div><div class="su" style="font-size:9.5px">questo mese</div></div>
      </div>
      ${!selMode?`<div class="mt" style="margin-top:8px">📅 ${fmtQty(yh)}h nell'anno ${y}</div>`:''}
    </div>`;
  }).join(''):`<div class="card" style="padding:16px;text-align:center;color:var(--t2)">Nessuna persona.${isOwner()?' Apri <b style="color:var(--t1)">⚙️ Gestione</b> per aggiungerne.':''}</div>`}`;
}
/* selezione multi-persona (solo titolare) */
function empCardTap(ev,id){
  if(window._empSelMode){window._empSel=window._empSel||{};if(window._empSel[id])delete window._empSel[id];else window._empSel[id]=1;render();return;}
  openTimesheet(id);
}
function empSelStart(){window._empSelMode=true;window._empSel={};render();}
function empSelCancel(){window._empSelMode=false;window._empSel={};render();}
function empBulkSheet(){
  const ids=Object.keys(window._empSel||{});if(!ids.length)return;
  const names=ids.map(id=>esc((byId(S.employees,id)||{}).name||'')).join(', ');
  const seg=Object.entries(TT).map(([v,o])=>`<div class="sg ${v==='lavoro'?'on':''}" data-v="${v}" onclick="[...this.parentNode.children].forEach(x=>x.classList.remove('on'));this.classList.add('on')">${o.i} ${o.l}</div>`).join('');
  openSheet(`<h3>${ids.length} persone <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin:-6px 0 12px">Registro la stessa giornata a: <b style="color:var(--t1)">${names}</b></div>
  <div class="fld"><label>Data</label><input id="eb-d" type="date" value="${todayIso()}"></div>
  <div class="fld"><label>Tipo giornata</label><div class="seg" id="eb-type" style="gap:7px;flex-wrap:wrap">${seg}</div></div>
  <div class="fld"><label>Orario (solo per il Lavoro)</label><div class="frow">
    <div class="fld" style="margin:0"><label>Dalle</label><input id="eb-s" type="time" value="08:00"></div>
    <div class="fld" style="margin:0"><label>Alle</label><input id="eb-e" type="time" value="17:00"></div>
    <div class="fld" style="margin:0"><label>Pausa (min)</label><input id="eb-b" inputmode="numeric" value="60"></div>
  </div></div>
  <div class="actions"><button class="btn pri" onclick="saveEmpBulk()">Registra a ${ids.length} persone</button></div>`);
}
function saveEmpBulk(){
  const ids=Object.keys(window._empSel||{});
  const date=$('#eb-d').value;if(!date){toast('Manca la data');return;}
  const type=(document.querySelector('#eb-type .sg.on')||{dataset:{}}).dataset.v||'lavoro';
  const work=type==='lavoro';
  const start=$('#eb-s').value||'',end=$('#eb-e').value||'',brk=$('#eb-b').value||'';
  const hours=(work&&start&&end)?teHours({start,end,brk}):0;
  ids.forEach(empId=>{
    const base={empId,date,type,start:work?start:'',end:work?end:'',brk:work?brk:'',note:'',hours};
    const ex=S.timeEntries.find(t=>t.empId===empId&&t.date===date);
    if(ex)Object.assign(ex,base);else S.timeEntries.push({id:uid(),...base});
  });
  window._empSelMode=false;window._empSel={};
  save();closeSheet();render();toast('✓ Registrato a '+ids.length+' persone');
}

/* apre il cartellino di una persona per un dato mese (YYYY-MM) */
function openTimesheet(empId,ym){
  const e=byId(S.employees,empId);if(!e)return;
  ym=ym||todayIso().slice(0,7);
  window._tsEmp=empId;window._tsMonth=ym;
  const y=ym.slice(0,4);
  const list=tsMonth(empId,ym), sm=tsSum(list), ysm=tsSum(tsYearL(empId,y));
  const chip=(t,n)=>n?`<span class="badge" style="border-color:var(--line2);color:var(--t2)">${TT[t].i} ${n}</span>`:'';
  const today=todayIso(), isCur=ym===today.slice(0,7);
  const todayE=list.find(t=>t.date===today);
  const sch=lastSchedule(empId), schH=teHours(sch);
  const selMode=!!window._tsSelMode, nSel=Object.keys(window._tsSel||{}).length;
  const timbraOggi=(isCur&&!selMode)?(todayE
    ?`<div class="card" style="padding:10px 11px;margin-bottom:9px;display:flex;align-items:center;gap:9px;cursor:pointer" onclick="editTimeEntry('${empId}','${todayE.id}')"><span style="font-size:17px">${TT[todayE.type].i}</span><div style="flex:1;color:var(--t1)">Oggi: <b>${TT[todayE.type].l}</b>${todayE.type==='lavoro'?' · '+fmtQty(teHours(todayE))+'h':''}</div><span class="badge" style="border-color:var(--cy);color:var(--cy)">Modifica</span></div>`
    :`<button class="btn pri" style="width:100%;margin-bottom:9px" onclick="quickAddDate('${empId}','${today}','lavoro')">🟢 Timbra oggi · ${sch.start}–${sch.end} (${fmtQty(schH)}h)</button>`):'';
  openSheet(`<h3>${esc(e.name)} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin:-6px 0 10px">${esc(e.role||'Personale')}</div>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
    <button class="btn sm ghost" onclick="openTimesheet('${empId}','${shiftMonth(ym,-1)}')">◀</button>
    <div style="flex:1;text-align:center;font-size:14px;color:var(--t1);font-weight:600">${monthName(ym)}</div>
    <button class="btn sm ghost" onclick="openTimesheet('${empId}','${shiftMonth(ym,1)}')">▶</button>
  </div>
  ${timbraOggi}
  ${tsCalendar(empId,ym)}
  ${selMode
    ?`<div class="card" style="padding:10px 11px;margin:10px 0;display:flex;align-items:center;gap:9px;border-color:var(--cy)"><div style="flex:1"><b id="ts-seln">${nSel}</b> giorni selezionati</div><button class="btn sm ghost" onclick="tsSelCancel('${empId}')">Annulla</button><button class="btn sm pri" id="ts-apply" ${nSel?'':'disabled'} onclick="bulkDaysSheet('${empId}')">Applica…</button></div>`
    :`<div style="display:flex;gap:8px;margin:10px 0">
        <button class="btn sm ghost" style="flex:1" onclick="tsSelStart('${empId}')">☑️ Più giorni</button>
        <button class="btn sm ghost" style="flex:1" onclick="editTimeEntry('${empId}','')">➕ Altro giorno</button>
      </div>
      <div class="subtle" style="margin:-2px 0 10px;text-align:center">Tocca un giorno del calendario per registrarlo o modificarlo.</div>`}
  ${(function(){
    const otM=overtime(empId,list), otY=overtime(empId,tsYearL(empId,y)), fr=ferieResiduo(empId,y);
    return`<div class="card" style="padding:12px;margin-bottom:11px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="subtle">Ore lavorate nel mese</span><span style="font-size:22px;color:var(--cy);font-weight:700">${fmtQty(sm.hours)}h</span></div>
    ${otM!=null?`<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:5px"><span class="subtle">Saldo ore (straordinari)</span><span style="font-size:14px;font-weight:700;color:${otM>=0?'var(--cy)':'var(--amber)'}">${sgn(otM)}h</span></div>`:''}
    <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:9px">${['ferie','malattia','permesso','assenza','festivo'].map(t=>chip(t,sm[t])).join('')||'<span class="subtle">Nessuna assenza registrata</span>'}</div>
    ${fr?`<div class="subtle" style="margin-top:9px;border-top:1px solid var(--line);padding-top:8px">🏖️ Ferie ${y}: <b style="color:var(--t1)">${fmtQty(fr.left)} gg residui</b> (${fmtQty(fr.used)} usati su ${fmtQty(fr.tot)})</div>`:''}
    <div class="subtle" style="margin-top:9px;${fr?'':'border-top:1px solid var(--line);'}padding-top:8px">📅 Totale anno ${y}: <b style="color:var(--t1)">${fmtQty(ysm.hours)}h</b> lavorate${otY!=null?' ('+sgn(otY)+'h saldo)':''} · ${ysm.ferie||0} gg ferie · ${ysm.malattia||0} gg malattia</div>
  </div>`;})()}
  <div class="actions">
    <button class="btn ghost" onclick="printTimesheet('${empId}','${ym}')">🖨 PDF mese</button>
    <button class="btn ghost" onclick="printYear('${empId}','${y}')">🖨 PDF anno</button>
  </div>`);
}

/* form nuova/modifica registrazione (date = data preimpostata per una nuova) */
function editTimeEntry(empId,id,date){
  const sch=lastSchedule(empId);
  const def=date||((window._tsMonth&&window._tsMonth!==todayIso().slice(0,7))?window._tsMonth+'-01':todayIso());
  const t=id?byId(S.timeEntries,id):{date:def,type:'lavoro',start:sch.start,end:sch.end,brk:sch.brk,hours:'',note:''};
  const back=`openTimesheet('${empId}','${(t.date||todayIso()).slice(0,7)}')`;
  const seg=Object.entries(TT).map(([v,o])=>`<div class="sg ${t.type===v?'on':''}" data-v="${v}" onclick="[...this.parentNode.children].forEach(x=>x.classList.remove('on'));this.classList.add('on')">${o.i} ${o.l}</div>`).join('');
  openSheet(`<h3>${id?'Modifica giornata':'Nuova giornata'} <span class="x" onclick="${back}">✕</span></h3>
  <div class="fld"><label>Data</label><input id="te-d" type="date" value="${esc(t.date||'')}"></div>
  <div class="fld"><label>Tipo giornata</label><div class="seg" id="te-type" style="gap:7px;flex-wrap:wrap">${seg}</div></div>
  <div class="fld"><label>Orario di lavoro (per il calcolo automatico delle ore)</label>
    <div class="frow">
      <div class="fld" style="margin:0"><label>Dalle</label><input id="te-s" type="time" value="${esc(t.start||'')}"></div>
      <div class="fld" style="margin:0"><label>Alle</label><input id="te-e" type="time" value="${esc(t.end||'')}"></div>
      <div class="fld" style="margin:0"><label>Pausa (min)</label><input id="te-b" inputmode="numeric" value="${esc(t.brk!=null?String(t.brk):'')}" placeholder="0"></div>
    </div>
  </div>
  <div class="fld"><label>Oppure ore totali a mano (se non usi l'orario)</label><input id="te-h" inputmode="decimal" value="${t.hours!=null?esc(String(t.hours)):''}" placeholder="es. 8"></div>
  <div class="fld"><label>Nota (facoltativa)</label><input id="te-note" value="${esc(t.note||'')}" placeholder="es. straordinario, mezza giornata..."></div>
  <div class="actions">
    ${id?`<button class="btn danger" onclick="delTimeEntry('${empId}','${id}')">Elimina</button>`:''}
    <button class="btn pri" onclick="saveTimeEntry('${empId}','${id||''}')">Salva</button></div>`);
}
function saveTimeEntry(empId,id){
  const date=$('#te-d').value;if(!date){toast('Manca la data');return;}
  const tEl=document.querySelector('#te-type .sg.on');const type=tEl?tEl.dataset.v:'lavoro';
  const start=$('#te-s').value||'',end=$('#te-e').value||'',brk=$('#te-b').value||'',hIn=$('#te-h').value;
  const data={empId,date,type,start,end,brk,note:$('#te-note').value.trim()};
  data.hours=(start&&end)?teHours({start,end,brk}):(+hIn||0);
  if(id){Object.assign(byId(S.timeEntries,id),data);}
  else{S.timeEntries.push({id:uid(),...data});}
  save();openTimesheet(empId,date.slice(0,7));toast('✓ Salvato');
}
function delTimeEntry(empId,id){
  if(!confirm('Eliminare questa registrazione?'))return;
  S.timeEntries=S.timeEntries.filter(x=>x.id!==id);
  save();openTimesheet(empId,window._tsMonth);toast('Eliminato');
}

/* ---- PDF: cartellino mensile ---- */
function printTimesheet(empId,ym){
  const e=byId(S.employees,empId);if(!e)return;
  const y=ym.slice(0,4);
  const list=tsMonth(empId,ym), sm=tsSum(list), ysm=tsSum(tsYearL(empId,y));
  const logo=(typeof BRAND!=='undefined'&&BRAND.logo)?BRAND.logo:'';
  const company=(S.settings&&S.settings.companyName)||'';
  const w=window.open('','_blank');if(!w){toast('⚠ Consenti i popup per stampare');return;}
  const rows=list.map(t=>{const orario=(t.start&&t.end)?`${t.start}–${t.end}${(+t.brk)?' (−'+t.brk+'m)':''}`:'';
    return`<tr><td>${dLabel(t.date)}</td><td>${TT[t.type].i} ${TT[t.type].l}</td><td>${esc(orario)}</td><td style="text-align:right">${TT[t.type].work?fmtQty(teHours(t))+' h':'—'}</td><td>${esc(t.note||'')}</td></tr>`;
  }).join('')||'<tr><td colspan="5" style="color:#889">Nessuna registrazione nel mese</td></tr>';
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cartellino ${esc(e.name)} — ${monthName(ym)}</title>
  <style>
    body{font-family:Helvetica,Arial,sans-serif;color:#16243a;max-width:760px;margin:30px auto;padding:0 24px;font-size:13px;line-height:1.5}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#667;margin:22px 0 6px;border-bottom:1px solid #ccd;padding-bottom:3px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{padding:5px 6px;text-align:left;border-bottom:1px solid #e2e6ee;vertical-align:top}
    th{color:#667;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
    .tot{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px}
    .tot div{border:1px solid #ccd;border-radius:6px;padding:8px 14px}
    .tot b{font-size:18px;display:block}
    @media print{body{margin:0 auto}}
  </style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:2.5px solid #16243a;padding-bottom:10px;margin-bottom:4px;min-height:70px">
    <div>
      <div style="font-size:19px;font-weight:bold">${company?esc(company):'CARTELLINO PRESENZE'}</div>
      <div style="font-size:11px;color:#667;margin-top:3px">Cartellino presenze · ${esc(e.name)}${e.role?' — '+esc(e.role):''}</div>
      <div style="font-size:14px;font-weight:bold;margin-top:6px">${monthName(ym)}</div>
    </div>
    ${logo?`<img src="${logo}" alt="" style="max-height:70px;max-width:210px;object-fit:contain;flex-shrink:0" onerror="this.style.display='none'">`:''}
  </div>
  <h2>Giornate</h2>
  <table><thead><tr><th>Giorno</th><th>Tipo</th><th>Orario</th><th style="text-align:right">Ore</th><th>Nota</th></tr></thead><tbody>${rows}</tbody></table>
  <h2>Totali del mese</h2>
  <div class="tot">
    <div>Ore lavorate<b>${fmtQty(sm.hours)} h</b></div>
    <div>Ferie<b>${sm.ferie||0} gg</b></div>
    <div>Malattia<b>${sm.malattia||0} gg</b></div>
    <div>Permessi<b>${sm.permesso||0} gg</b></div>
    <div>Assenze<b>${sm.assenza||0} gg</b></div>
  </div>
  <h2>Totale anno ${y}</h2>
  <div class="tot">
    <div>Ore lavorate<b>${fmtQty(ysm.hours)} h</b></div>
    <div>Ferie<b>${ysm.ferie||0} gg</b></div>
    <div>Malattia<b>${ysm.malattia||0} gg</b></div>
  </div>
  <div style="margin-top:40px;display:flex;justify-content:space-between;gap:40px">
    <div style="flex:1;text-align:center"><div style="height:50px"></div><div style="border-top:1px solid #16243a;padding-top:5px;font-size:11px;color:#667">Firma dipendente</div></div>
    <div style="flex:1;text-align:center"><div style="height:50px"></div><div style="border-top:1px solid #16243a;padding-top:5px;font-size:11px;color:#667">Firma responsabile</div></div>
  </div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script>
  </body></html>`);
  w.document.close();
}

/* ---- PDF: riepilogo annuale (12 mesi) ---- */
function printYear(empId,y){
  const e=byId(S.employees,empId);if(!e)return;
  const logo=(typeof BRAND!=='undefined'&&BRAND.logo)?BRAND.logo:'';
  const company=(S.settings&&S.settings.companyName)||'';
  const w=window.open('','_blank');if(!w){toast('⚠ Consenti i popup per stampare');return;}
  const yl=tsYearL(empId,y), ysm=tsSum(yl);
  const rows=Array.from({length:12},(_,i)=>{
    const ym=y+'-'+String(i+1).padStart(2,'0');const sm=tsSum(tsMonth(empId,ym));
    return`<tr><td>${MN[i+1]}</td><td style="text-align:right">${fmtQty(sm.hours)}</td><td style="text-align:right">${sm.ferie||0}</td><td style="text-align:right">${sm.malattia||0}</td><td style="text-align:right">${sm.permesso||0}</td><td style="text-align:right">${sm.assenza||0}</td></tr>`;
  }).join('');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Riepilogo ${esc(e.name)} — ${y}</title>
  <style>
    body{font-family:Helvetica,Arial,sans-serif;color:#16243a;max-width:760px;margin:30px auto;padding:0 24px;font-size:13px;line-height:1.5}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#667;margin:22px 0 6px;border-bottom:1px solid #ccd;padding-bottom:3px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{padding:6px;border-bottom:1px solid #e2e6ee}th{color:#667;font-size:10px;text-transform:uppercase}
    tfoot td{font-weight:bold;border-top:2px solid #16243a}
    @media print{body{margin:0 auto}}
  </style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:2.5px solid #16243a;padding-bottom:10px;margin-bottom:4px;min-height:70px">
    <div>
      <div style="font-size:19px;font-weight:bold">${company?esc(company):'RIEPILOGO ANNUALE'}</div>
      <div style="font-size:11px;color:#667;margin-top:3px">Riepilogo annuale · ${esc(e.name)}${e.role?' — '+esc(e.role):''}</div>
      <div style="font-size:14px;font-weight:bold;margin-top:6px">Anno ${y}</div>
    </div>
    ${logo?`<img src="${logo}" alt="" style="max-height:70px;max-width:210px;object-fit:contain;flex-shrink:0" onerror="this.style.display='none'">`:''}
  </div>
  <h2>Per mese</h2>
  <table><thead><tr><th>Mese</th><th style="text-align:right">Ore</th><th style="text-align:right">Ferie</th><th style="text-align:right">Malattia</th><th style="text-align:right">Permessi</th><th style="text-align:right">Assenze</th></tr></thead>
  <tbody>${rows}</tbody>
  <tfoot><tr><td>TOTALE ${y}</td><td style="text-align:right">${fmtQty(ysm.hours)}</td><td style="text-align:right">${ysm.ferie||0}</td><td style="text-align:right">${ysm.malattia||0}</td><td style="text-align:right">${ysm.permesso||0}</td><td style="text-align:right">${ysm.assenza||0}</td></tr></tfoot>
  </table>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script>
  </body></html>`);
  w.document.close();
}

/* ---- "Chi c'è": stato oggi / settimana di tutte le persone ---- */
const isoOf=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function weekDates(){const t=new Date(todayIso()+'T00:00:00');const off=(t.getDay()+6)%7;const mon=new Date(t);mon.setDate(t.getDate()-off);return Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return isoOf(d);});}
function whoPanel(){
  const today=todayIso(), week=window._whoWeek;
  let body;
  if(!week){
    body=S.employees.map(e=>{const t=S.timeEntries.find(x=>x.empId===e.id&&x.date===today);
      const st=t?`<span style="color:${TT[t.type].c};font-weight:600;font-size:12.5px">${TT[t.type].i} ${TT[t.type].l}${t.type==='lavoro'?' · '+fmtQty(teHours(t))+'h':''}</span>`:'<span class="subtle">— non registrato</span>';
      return`<div style="display:flex;align-items:center;gap:9px;padding:5px 0;border-top:1px solid var(--line)"><div style="flex:1;color:var(--t1);font-size:13px">${esc(e.name)}</div>${st}</div>`;}).join('');
  }else{
    const wd=weekDates(), dl=['Lu','Ma','Me','Gi','Ve','Sa','Do'];
    body=`<div style="display:grid;grid-template-columns:1fr repeat(7,18px);gap:3px;align-items:center;margin-bottom:3px"><div></div>${dl.map((d,i)=>`<div style="text-align:center;font-size:8.5px;color:${wd[i]===today?'var(--cy)':'var(--t2)'}">${d}</div>`).join('')}</div>`
      +S.employees.map(e=>{const cells=wd.map(date=>{const t=S.timeEntries.find(x=>x.empId===e.id&&x.date===date);const c=t?TT[t.type].c:'';return`<div title="${date}" style="width:18px;height:18px;border-radius:5px;${t?`background:${c}`:'background:var(--bg2);border:1px solid var(--line)'}"></div>`;}).join('');
        return`<div style="display:grid;grid-template-columns:1fr repeat(7,18px);gap:3px;align-items:center;padding:3px 0;border-top:1px solid var(--line)"><div style="color:var(--t1);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.name)}</div>${cells}</div>`;}).join('');
  }
  return`<div class="card" style="padding:11px;margin-bottom:11px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <div style="flex:1;font-size:13px;color:var(--t1);font-weight:600">👀 Chi c'è${week?' — questa settimana':' — oggi'}</div>
      <div class="seg" style="gap:5px"><div class="sg ${!week?'on':''}" onclick="window._whoWeek=false;render()">Oggi</div><div class="sg ${week?'on':''}" onclick="window._whoWeek=true;render()">Settimana</div></div>
    </div>${body||'<span class="subtle">Nessuna persona.</span>'}</div>`;
}
/* ---- Riepilogo mensile di TUTTI (per la fiduciaria): PDF + CSV ---- */
function monthReportSheet(ym){
  ym=ym||todayIso().slice(0,7);
  openSheet(`<h3>Riepilogo mese <span class="x" onclick="closeSheet()">✕</span></h3>
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
    <button class="btn sm ghost" onclick="monthReportSheet('${shiftMonth(ym,-1)}')">◀</button>
    <div style="flex:1;text-align:center;font-size:14px;color:var(--t1);font-weight:600">${monthName(ym)}</div>
    <button class="btn sm ghost" onclick="monthReportSheet('${shiftMonth(ym,1)}')">▶</button>
  </div>
  <div class="subtle" style="margin-bottom:10px">Riepilogo di tutte le persone, pronto da mandare alla fiduciaria.</div>
  ${S.employees.map(e=>{const list=tsMonth(e.id,ym),s=tsSum(list),ot=overtime(e.id,list);
    return`<div class="card" style="padding:10px 11px;margin-bottom:7px">
      <div style="font-size:13px;color:var(--t1);font-weight:600;margin-bottom:3px">${esc(e.name)}${e.role?' <span class="subtle" style="font-weight:400">· '+esc(e.role)+'</span>':''}</div>
      <div class="subtle" style="font-size:11.5px">⏱ ${fmtQty(s.hours)}h${ot!=null?' · saldo '+sgn(ot)+'h':''} · 🏖️ ${s.ferie||0} · 🤒 ${s.malattia||0} · 🕐 ${s.permesso||0} · ⚪ ${s.assenza||0}</div>
    </div>`;}).join('')||'<div class="subtle">Nessuna persona.</div>'}
  <div class="actions">
    <button class="btn ghost" onclick="csvMonthAll('${ym}')">⬇️ CSV</button>
    <button class="btn pri" onclick="printMonthAll('${ym}')">🖨 PDF</button>
  </div>`);
}
function csvMonthAll(ym){
  const head=['Dipendente','Ruolo','Ore lavorate','Saldo ore','Ferie (gg)','Malattia (gg)','Permesso (gg)','Assenza (gg)'];
  const rows=[head];
  S.employees.forEach(e=>{const list=tsMonth(e.id,ym),s=tsSum(list),ot=overtime(e.id,list);
    rows.push([e.name,e.role||'',fmtQty(s.hours),ot!=null?fmtQty(ot):'',s.ferie||0,s.malattia||0,s.permesso||0,s.assenza||0]);});
  /* anti CSV-injection: neutralizza celle che iniziano con =,+,-,@ (ma non i numeri) */
  const cell=v=>{let s=String(v);if(/^[=+\-@\t\r]/.test(s)&&!/^-?[\d.,]+$/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
  const csv=rows.map(r=>r.map(cell).join(';')).join('\r\n');
  const blob=new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='presenze-'+ym+'.csv';document.body.appendChild(a);a.click();a.remove();
  toast('⬇️ CSV scaricato');
}
function printMonthAll(ym){
  const logo=(typeof BRAND!=='undefined'&&BRAND.logo)?BRAND.logo:'';
  const company=(S.settings&&S.settings.companyName)||'';
  const w=window.open('','_blank');if(!w){toast('⚠ Consenti i popup per stampare');return;}
  const tot={h:0,f:0,m:0,p:0,a:0};
  const rows=S.employees.map(e=>{const list=tsMonth(e.id,ym),s=tsSum(list),ot=overtime(e.id,list);
    tot.h+=s.hours;tot.f+=s.ferie||0;tot.m+=s.malattia||0;tot.p+=s.permesso||0;tot.a+=s.assenza||0;
    return`<tr><td>${esc(e.name)}</td><td>${esc(e.role||'')}</td><td style="text-align:right">${fmtQty(s.hours)}</td><td style="text-align:right">${ot!=null?sgn(ot):'—'}</td><td style="text-align:right">${s.ferie||0}</td><td style="text-align:right">${s.malattia||0}</td><td style="text-align:right">${s.permesso||0}</td><td style="text-align:right">${s.assenza||0}</td></tr>`;}).join('');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Riepilogo presenze — ${monthName(ym)}</title>
  <style>
    body{font-family:Helvetica,Arial,sans-serif;color:#16243a;max-width:820px;margin:30px auto;padding:0 24px;font-size:13px;line-height:1.5}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#667;margin:22px 0 6px;border-bottom:1px solid #ccd;padding-bottom:3px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{padding:6px;border-bottom:1px solid #e2e6ee}th{color:#667;font-size:10px;text-transform:uppercase;text-align:left}
    tfoot td{font-weight:bold;border-top:2px solid #16243a}
    @media print{body{margin:0 auto}}
  </style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;border-bottom:2.5px solid #16243a;padding-bottom:10px;margin-bottom:4px;min-height:70px">
    <div>
      <div style="font-size:19px;font-weight:bold">${company?esc(company):'RIEPILOGO PRESENZE'}</div>
      <div style="font-size:11px;color:#667;margin-top:3px">Riepilogo presenze del personale</div>
      <div style="font-size:14px;font-weight:bold;margin-top:6px">${monthName(ym)}</div>
    </div>
    ${logo?`<img src="${logo}" alt="" style="max-height:70px;max-width:210px;object-fit:contain;flex-shrink:0" onerror="this.style.display='none'">`:''}
  </div>
  <h2>Personale</h2>
  <table><thead><tr><th>Dipendente</th><th>Ruolo</th><th style="text-align:right">Ore</th><th style="text-align:right">Saldo</th><th style="text-align:right">Ferie</th><th style="text-align:right">Malattia</th><th style="text-align:right">Permessi</th><th style="text-align:right">Assenze</th></tr></thead>
  <tbody>${rows||'<tr><td colspan="8" style="color:#889">Nessuna persona</td></tr>'}</tbody>
  <tfoot><tr><td colspan="2">TOTALE</td><td style="text-align:right">${fmtQty(tot.h)}</td><td></td><td style="text-align:right">${tot.f}</td><td style="text-align:right">${tot.m}</td><td style="text-align:right">${tot.p}</td><td style="text-align:right">${tot.a}</td></tr></tfoot>
  </table>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script>
  </body></html>`);
  w.document.close();
}

/* ================= GESTIONE (solo titolare) ================= */
function renderEmpsManage(){
  const mKey=todayIso().slice(0,7);
  const PI={cal:['📅','Cal.'],man:['🔧','Manut.'],pellet:['🪵','Pellet'],sites:['🏗','Cant.'],notes:['📝','Note'],chat:['💬','Chat'],clients:['👥','Clienti']};
  const seatInfo=MAX_EMP!=null?`${seatCount()} / ${MAX_EMP} posti`:`${S.employees.length}`;
  $('#main').innerHTML=`
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
    <div class="pagetitle" style="margin:0;flex:1"><span class="accent" style="background:var(--cy)"></span>Gestione personale <span class="subtle" style="${seatFull()?'color:var(--amber)':''}">(${seatInfo})</span></div>
    <button class="btn sm ghost" onclick="window._empsTab='presenze';render()">← Presenze</button>
  </div>
  ${seatFull()?`<div class="card" style="padding:11px;margin-bottom:9px;border-color:rgba(199,127,18,.4);display:flex;align-items:center;gap:10px"><span style="font-size:18px">⚠️</span><div style="flex:1"><div style="font-size:13px;color:var(--t1)">Hai usato tutti i ${MAX_EMP} posti del tuo piano.</div><div class="subtle">Per aggiungere altri dipendenti, richiedi più posti.</div></div>${isOwner()?`<button class="btn sm pri" onclick="requestMoreSeats()">Richiedi posti</button>`:''}</div>`:''}
  ${S.employees.map(e=>{
    const tasks=S.maintenances.filter(m=>empIdsOf(m).includes(e.id)&&m.status!=='fatta').length+S.appointments.filter(a=>empIdsOf(a).includes(e.id)&&!a.done).length;
    const sites=S.sites.filter(s=>s.status!=='chiuso'&&s.employees.includes(e.id)).length;
    const hrsM=S.sites.reduce((t,s)=>t+s.log.filter(l=>l.empId===e.id&&l.date&&l.date.startsWith(mKey)).reduce((a,l)=>a+(l.hours||0),0),0);
    const col=e.isOwner?'#5BA02C':e.userId?(e.active?'#2E9E5E':'#D64528'):'#C77F12';
    const badge=e.isOwner?'TITOLARE':e.userId?(e.active?'✓ ATTIVO':'⛔ DISATTIVATO'):'🔑 IN ATTESA';
    const pending=!e.isOwner&&!e.userId&&e.inviteCode;
    return`<div class="card" style="padding:11px;margin-bottom:9px;cursor:pointer" onclick="editEmp('${e.id}')">
      <div style="display:flex;align-items:center;gap:11px">
        <div class="avat" style="width:42px;height:42px;background:${col}22;border:1px solid ${col}55;color:${col};font-size:15px">${esc(cInitials(e.name))}</div>
        <div style="flex:1;min-width:0"><div style="font-size:14px;color:var(--t1);font-weight:600">${esc(e.name)}${e.isOwner?' 👑':''}</div><div class="su" style="font-size:10.5px">${esc(e.role||'—')}</div></div>
        <span class="badge" style="border-color:${col};color:${col};flex-shrink:0">${badge}</span>
      </div>
      ${!e.isOwner&&e.perms&&e.perms.length?`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:9px">${e.perms.map(p=>`<span class="badge" style="border-color:var(--line2);color:var(--t2)">${(PI[p]||['','']) [0]} ${(PI[p]||['',p])[1]}</span>`).join('')}</div>`:''}
      ${!e.isOwner?`<div class="mt" style="margin-top:8px">${tasks} incarichi${sites?' · '+sites+' cantieri':''}${hrsM?' · ⏱ '+fmtQty(hrsM)+'h mese':''}</div>`:''}
      ${pending?`<div onclick="event.stopPropagation();if(navigator.clipboard)navigator.clipboard.writeText('${e.inviteCode}');toast('📋 Codice copiato')" style="display:flex;align-items:center;gap:8px;margin-top:9px;background:var(--bg2);border:1px dashed rgba(199,127,18,.4);border-radius:10px;padding:8px 11px"><span style="font-size:9px;color:var(--t2)">CODICE INVITO</span><span style="font-family:var(--mono);font-size:13px;color:var(--amber);letter-spacing:1px">${esc(e.inviteCode)}</span><span style="margin-left:auto;font-size:10px;color:var(--cy)">📋 Copia</span></div>`:''}
    </div>`;
  }).join('')}
  <button class="fab" onclick="addEmp()">+</button>`;
}
/* aggiunta dipendente con guardia sul limite di posti del piano */
function addEmp(){
  if(seatFull()){
    if(isOwner())openSheet(`<h3>⚠️ Posti esauriti <span class="x" onclick="closeSheet()">✕</span></h3>
      <div class="subtle" style="margin-bottom:12px">Il tuo piano include <b style="color:var(--t1)">${MAX_EMP} posti</b> dipendente e li hai usati tutti. Per aggiungerne altri serve aumentare il piano.</div>
      <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="requestMoreSeats()">✉️ Richiedi più posti</button></div>`);
    else toast('Posti del piano esauriti — chiedi al titolare');
    return;
  }
  editEmp(null);
}
function editEmp(id){
  const e=id?byId(S.employees,id):{name:'',role:'',phone:'',perms:['cal','man','chat'],isOwner:false};
  const isMe=!!(id&&S.session&&id===S.session.empId);
  const tasks=id?[
    ...S.maintenances.filter(m=>empIdsOf(m).includes(id)&&m.status!=='fatta').map(m=>'🔧 '+(cName(m.clientId)||'')+' '+m.title+(m.date?' — '+fmtD(m.date):'')),
    ...S.appointments.filter(a=>empIdsOf(a).includes(id)&&!a.done).map(a=>'📅 '+a.title+' — '+fmtD(a.date)),
    ...S.sites.filter(s=>s.status!=='chiuso'&&s.employees.includes(id)).map(s=>'🏗 '+s.name)
  ]:[];
  const PERMS=[['cal','📅 Calendario'],['man','🔧 Manutenzioni'],['pellet','🪵 Pellet'],['sites','🏗 Cantieri'],['macchine','⚙️ Macchine'],['notes','📝 Note'],['chat','💬 Chat'],['clients','👥 Clienti']];
  openSheet(`<h3>${id?'Scheda personale':'Nuova persona'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Nome</label><input id="em-n" value="${esc(e.name)}"></div>
  <div class="frow"><div class="fld"><label>Ruolo</label><input id="em-r" value="${esc(e.role||'')}" placeholder="es. Tecnico"></div>
  <div class="fld"><label>Telefono</label><input id="em-p" inputmode="tel" value="${esc(e.phone||'')}"></div></div>
  <div class="frow"><div class="fld"><label>Ore previste/giorno</label><input id="em-dh" inputmode="decimal" value="${e.dayHours!=null?esc(String(e.dayHours)):''}" placeholder="es. 8.4"></div>
  <div class="fld"><label>Giorni ferie/anno</label><input id="em-hd" inputmode="decimal" value="${e.holidayDays!=null?esc(String(e.holidayDays)):''}" placeholder="es. 25"></div></div>
  <div class="subtle" style="margin:-4px 0 4px">Facoltativi: servono per calcolare gli straordinari (saldo ore) e il residuo ferie.</div>
  <div class="fld"><label>Sezioni assegnate — tocca per attivare</label>
    <div class="seg" id="em-perms" style="gap:7px">${PERMS.map(([v,l])=>`<div class="sg ${(e.perms||[]).includes(v)?'on':''}" data-v="${v}" onclick="this.classList.toggle('on')">${l}</div>`).join('')}</div>
    <div class="subtle" style="margin-top:7px">Definisce cosa vede e riceve questa persona: sezioni nell'app condivisa, notifiche personalizzate e comandi bot Telegram (si attiva con la fase cloud).</div>
  </div>
  ${isOwner()&&!isMe?`<div class="fld"><label>👑 Ruolo titolare</label>
    <div class="seg"><div class="sg ${e.isOwner?'on':''}" id="em-owner" onclick="this.classList.toggle('on')">👑 Titolare — accesso completo</div></div>
    <div class="subtle" style="margin-top:7px">Se attivo, questa persona vede e gestisce <b>tutto</b> come te (clienti, dipendenti, incarichi, prezzi) e le sezioni qui sopra diventano tutte attive. Puoi attivarlo su più persone.</div></div>`:''}
  ${id&&!isMe&&isOwner()?`<div class="fld"><label>🔑 Accesso</label>
    ${e.userId?`<div class="subtle">✓ Registrato — entra con la sua email e password.</div>
      <div style="display:flex;gap:8px;margin-top:7px">
      <button class="btn sm" onclick="const u=byId(S.employees,'${id}');u.userId=null;u.inviteCode=genInvite(u.name);save();editEmp('${id}');toast('Accesso scollegato, nuovo codice generato')">↻ Resetta accesso</button>
      <button class="btn sm danger" onclick="const u=byId(S.employees,'${id}');u.active=!u.active;save();editEmp('${id}');toast(u.active?'Riattivato':'Accesso disattivato')">${e.active?'⛔ Disattiva':'✓ Riattiva'}</button></div>`
    :e.inviteCode?`<div class="subtle">Non ancora registrato. Dagli questo codice:</div>
      <div style="font-family:var(--mono);font-size:19px;letter-spacing:2px;color:var(--cy);background:var(--bg2);border:1px dashed var(--cy);border-radius:10px;padding:11px;text-align:center;margin:8px 0">${e.inviteCode}</div>
      <div style="display:flex;gap:8px">
      <button class="btn sm" onclick="navigator.clipboard&&navigator.clipboard.writeText('${e.inviteCode}');toast('Codice copiato')">📋 Copia</button>
      <button class="btn sm ghost" onclick="const u=byId(S.employees,'${id}');u.inviteCode=genInvite(u.name);save();editEmp('${id}')">↻ Rigenera</button></div>
      <div class="subtle" style="margin-top:7px">Lui apre l'app → si registra con email e password → inserisce questo codice. Il codice è monouso.</div>`
    :''}
  </div>`:''}
  ${tasks.length?`<div class="fld"><label>Incarichi aperti (${tasks.length})</label>${tasks.map(t=>`<div class="subtle" style="padding:3px 0">• ${esc(t)}</div>`).join('')}</div>`:''}
  <div class="actions">
    ${id&&!isMe&&isOwner()?`<button class="btn danger" onclick="delEmp('${id}')">Elimina</button>`:''}
    <button class="btn pri" onclick="saveEmp('${id||''}')">Salva</button></div>`);
}
/* elimina una persona E i suoi cartellini (GDPR: niente dati orfani, evita errori FK in sync) */
function delEmp(id){
  if(!confirm('Eliminare definitivamente questa persona e tutti i suoi cartellini?'))return;
  S.timeEntries=S.timeEntries.filter(t=>t.empId!==id);
  S.employees=S.employees.filter(e=>e.id!==id);
  save();closeSheet();render();toast('Eliminato');
}
function saveEmp(id){
  const name=$('#em-n').value.trim();if(!name){toast('Manca il nome');return;}
  let perms=[...document.querySelectorAll('#em-perms .sg.on')].map(x=>x.dataset.v);
  const ot=$('#em-owner');
  const makeOwner=(ot&&isOwner())?ot.classList.contains('on'):null; // null = toggle non mostrato → non cambiare
  if(makeOwner===true)perms=['hub','cal','notes','chat','man','pellet','sites','clients','emps']; // titolare = tutte le sezioni
  const data={name,role:$('#em-r').value.trim(),phone:$('#em-p').value.trim(),perms};
  const dh=$('#em-dh'),hd=$('#em-hd');
  if(dh)data.dayHours=dh.value.trim()?+dh.value.replace(',','.'):null;
  if(hd)data.holidayDays=hd.value.trim()?+hd.value.replace(',','.'):null;
  if(makeOwner!==null)data.isOwner=makeOwner;
  if(id){Object.assign(byId(S.employees,id),data);}else{
    if(seatFull()){toast('Posti del piano esauriti ('+MAX_EMP+')');closeSheet();return;}
    S.employees.push({id:uid(),inviteCode:genInvite(name),userId:null,isOwner:false,active:true,...data});toast('🔑 Codice invito generato — aprilo dalla scheda');}
  save();closeSheet();render();toast('👷 Salvato');
}
