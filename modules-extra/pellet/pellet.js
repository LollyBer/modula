/* ===== MODULO EXTRA: PELLET (+ bolla consegna) ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= PELLET ================= */
let pelKind='sfuso';let pelView='dash';
const addDaysIso=(s,n)=>{const[y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d+n);return iso(dt);};
const spanDays=(a,b)=>{const[y1,m1,d1]=a.split('-').map(Number);const[y2,m2,d2]=b.split('-').map(Number);return Math.round((new Date(y2,m2-1,d2)-new Date(y1,m1-1,d1))/86400000);};
function sfusoForecast(){
  const byClient={};
  S.pellet.filter(p=>(p.kind||'sacchi')==='sfuso'&&p.status==='consegnato'&&p.clientId&&p.date&&p.qty).forEach(p=>{(byClient[p.clientId]=byClient[p.clientId]||[]).push(p);});
  const out=[];
  for(const cid in byClient){
    const ds=byClient[cid].sort((a,b)=>a.date<b.date?-1:1);
    const last=ds[ds.length-1];
    let ratePerDay=null,nextDate=null,days=null;
    if(ds.length>=2){
      const span=spanDays(ds[0].date,last.date);
      const consumed=ds.slice(0,-1).reduce((s,p)=>s+(p.qty||0),0);
      if(span>0&&consumed>0){
        ratePerDay=consumed/span;
        nextDate=addDaysIso(last.date,Math.round((last.qty||0)/ratePerDay));
        days=relDays(nextDate);
      }
    }
    out.push({clientId:cid,ds,last,ratePerDay,nextDate,days});
  }
  return out.sort((a,b)=>(a.days==null?9999:a.days)-(b.days==null?9999:b.days));
}
function monthlyTotals(kind,unit){
  // ultimi 12 mesi → [{label,val}]
  const now=new Date();const out=[];
  for(let i=11;i>=0;i--){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1);
    const key=d.getFullYear()+'-'+pad(d.getMonth()+1);
    const val=S.pellet.filter(p=>(p.kind||'sacchi')===kind&&p.status==='consegnato'&&p.date&&p.date.startsWith(key)&&(!unit||p.unit===unit||(kind==='sacchi'&&p.unit==='bancali'))).reduce((s,p)=>s+((p.unit==='bancali'?(p.qty||0)*(S.settings.bagsPerPallet||70):(p.qty||0))),0);
    out.push({label:MESI[d.getMonth()].slice(0,3),key,val});
  }
  return out;
}
function barChart(data,color,unitLbl){
  const max=Math.max(...data.map(d=>d.val),0.001);
  const bw=20,gap=8,W=14+data.length*(bw+gap),H=130,base=96;
  return`<div style="overflow-x:auto;background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:8px 4px">
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <line x1="6" y1="${base}" x2="${W-6}" y2="${base}" stroke="rgba(111,178,58,.15)"/>
    ${data.map((d,i)=>{
      const h=d.val?Math.max(3,Math.round(d.val/max*72)):0;
      const x=10+i*(bw+gap);
      return`<rect x="${x}" y="${base-h}" width="${bw}" height="${Math.max(h,1)}" rx="4" fill="${d.val?color:'rgba(82,113,138,.25)'}"/>
      ${d.val?`<text x="${x+bw/2}" y="${base-h-5}" text-anchor="middle" fill="#2B2A24" font-size="9" font-family="JetBrains Mono">${fmtQty(d.val)}</text>`:''}
      <text x="${x+bw/2}" y="${base+14}" text-anchor="middle" fill="#8A8170" font-size="8.5" font-family="JetBrains Mono">${d.label}</text>`;
    }).join('')}
  </svg></div>`;
}
function renderPellet(){
  if(pelView==='dash'){renderPelDash();return;}
  pelKind=pelView;
  const mine=visPellet();
  const booked=mine.filter(p=>(p.kind||'sacchi')===pelKind&&p.status==='prenotato').sort((a,b)=>(b.created||0)-(a.created||0));
  const open=mine.filter(p=>(p.kind||'sacchi')===pelKind&&p.status!=='consegnato'&&p.status!=='prenotato').sort((a,b)=>((a.date||'9999')<(b.date||'9999')?-1:1));
  const done=mine.filter(p=>(p.kind||'sacchi')===pelKind&&p.status==='consegnato').sort((a,b)=>((a.date||'')>(b.date||'')?-1:1));
  const fc=pelKind==='sfuso'?sfusoForecast():[];
  const alerts=fc.filter(f=>f.days!=null&&f.days<=30);
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--fire)"></span>Pellet — ${pelKind==='sfuso'?'🪵 Sfuso':'📦 Sacchi'}</div>
  <div class="tabs">
    <div class="tb" onclick="pelView='dash';render()">📊 Dashboard</div>
    <div class="tb ${pelView==='sfuso'?'on':''}" onclick="pelView='sfuso';render()">🪵 Sfuso</div>
    <div class="tb ${pelView==='sacchi'?'on':''}" onclick="pelView='sacchi';render()">📦 Sacchi</div>
  </div>
  ${pelKind==='sfuso'&&fc.length?`<div class="card" style="${alerts.length?'border-color:rgba(199,127,18,.45)':''}">
    <div class="sh"><span class="t" style="color:var(--amber)">⏳ Previsioni rifornimento</span></div>
    ${fc.map(f=>{
      const urgent=f.days!=null&&f.days<=0;const soon=f.days!=null&&f.days<=30;
      const col=urgent?'var(--coral)':soon?'var(--amber)':'var(--t3)';
      return`<div class="item" onclick="openPelClient('${f.clientId}')">
      <span class="led" style="background:${col}"></span>
      <div class="bd"><div class="ti">${esc(cName(f.clientId))}</div>
      <div class="su">${f.ratePerDay?'Consumo ~'+fmtQty(f.ratePerDay*30)+' t/mese · ultima: '+fmtQty(f.last.qty)+' t il '+fmtD(f.last.date):'Serve almeno una 2ª consegna per stimare'}</div></div>
      <div class="right"><div class="d1" style="color:${col}">${f.nextDate?(urgent?'ADESSO':f.days+' gg'):'—'}</div><div class="d2">${f.nextDate?fmtD(f.nextDate):''}</div></div></div>`;
    }).join('')}
  </div>`:''}
  <div class="card" style="${booked.length?'border-color:rgba(199,127,18,.45)':''}"><div class="sh"><span class="t" style="color:var(--amber)">📋 Prenotazioni (${booked.length})</span></div>
    <div class="subtle" style="margin:0 0 8px">Chi ha già prenotato ma non sai ancora quando arriva. Tocca «📅 Programma» quando hai la data.</div>
    ${booked.length?booked.map(pelRow).join(''):'<div class="empty">Nessuna prenotazione in attesa.</div>'}
  </div>
  <div class="card"><div class="sh"><span class="t">Da consegnare (${open.length})</span></div>
    ${open.length?open.map(pelRow).join(''):`<div class="empty">Niente in coda. Dall'Hub: «${pelKind==='sfuso'?'3 tonnellate sfuso a Rossi martedì':'30 sacchi a Bianchi venerdì'}»</div>`}
  </div>
  <div class="card"><div class="sh"><span class="t" style="color:var(--t2)">Consegnate</span></div>
    ${done.length?done.slice(0,30).map(pelRow).join(''):'<div class="empty">Nessuno storico ancora.</div>'}
  </div>
  <button class="fab" onclick="openPel(null)">+</button>`;
}
const pelRow=p=>{
  const booked=p.status==='prenotato';
  const late=p.date&&p.date<todayIso()&&p.status!=='consegnato'&&!booked;const done=p.status==='consegnato';
  const col=done?'#2E9E5E':booked?'#C77F12':(late?'#D64528':'#5E9E2E');
  const who=cName(p.clientId)||p.clientRaw||'';
  return`<div class="frw" style="border-left-color:${col}" onclick="openPel('${p.id}')">
    <div class="avat" style="width:34px;height:34px;background:${col}22;border:1px solid ${col}55;font-size:15px;font-weight:400">${booked?'📋':(p.kind==='sfuso'?'🪵':'📦')}</div>
    <div class="bd"><div class="ti">${p.qty?fmtQty(p.qty)+' '+esc(p.unit||'sacchi'):'Consegna'}${p.price?` · <span style="color:var(--teal)">CHF ${fmtQty(p.price)}</span>`:''}${who?` — <b>${esc(who)}</b>`:''}</div>
    <div class="su">${booked?'<span style="color:var(--amber)">📋 Prenotato — in attesa di data</span>':(p.date?'📅 '+fmtD(p.date)+(p.time?' · '+p.time:''):'senza data')}${empNames(p)?' · 👷 '+esc(empNames(p)):''}${p.signature?' · ✍':''}${late?' · <span style="color:#D64528">in ritardo</span>':''}</div></div>
    ${booked?`<button class="qbtn" onclick="event.stopPropagation();schedulePel('${p.id}')">📅 Programma</button>`:done?'':`<button class="qbtn" onclick="event.stopPropagation();startBolla('${p.id}')">✍ Bolla</button>`}
  </div>`;};
function renderPelDash(){
  const mT=monthlyTotals('sfuso');
  const mB=monthlyTotals('sacchi','sacchi');
  const totT=mT.reduce((s,d)=>s+d.val,0);
  const totB=mB.reduce((s,d)=>s+d.val,0);
  const topT=mT.slice().sort((a,b)=>b.val-a.val)[0];
  const topB=mB.slice().sort((a,b)=>b.val-a.val)[0];
  const openN=S.pellet.filter(p=>p.status!=='consegnato'&&p.status!=='prenotato').length;
  const bookedN=S.pellet.filter(p=>p.status==='prenotato').length;
  const yago=addMonthsIso(todayIso(),-12);
  const rev=S.pellet.filter(p=>p.status==='consegnato'&&p.date&&p.date>=yago).reduce((t,p)=>t+(p.price||0),0);
  const fc=sfusoForecast();const alerts=fc.filter(f=>f.days!=null&&f.days<=30);
  const all=S.pellet.slice().sort((a,b)=>((a.date||'')>(b.date||'')?-1:1));
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--fire)"></span>Pellet <span class="subtle">(${S.pellet.length})</span></div>
  <div class="tabs">
    <div class="tb on">📊 Dashboard</div>
    <div class="tb" onclick="pelView='sfuso';render()">🪵 Sfuso</div>
    <div class="tb" onclick="pelView='sacchi';render()">📦 Sacchi</div>
  </div>
  <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
    <div class="kpi"><div class="n" style="color:#5E9E2E;font-size:16px">${fmtQty(totT)}t</div><div class="l">Sfuso 12m</div></div>
    <div class="kpi"><div class="n" style="color:var(--amber);font-size:16px">${totB}</div><div class="l">Sacchi 12m</div></div>
    <div class="kpi"><div class="n" style="font-size:16px">${openN}</div><div class="l">Da cons.</div></div>
    ${bookedN?`<div class="kpi"><div class="n" style="color:var(--amber);font-size:16px">${bookedN}</div><div class="l">Prenotati</div></div>`:''}
    ${rev?`<div class="kpi"><div class="n" style="color:var(--teal);font-size:16px">${fmtQty(rev)}</div><div class="l">CHF 12m</div></div>`:`<div class="kpi"><div class="n" style="color:${alerts.length?'var(--amber)':'var(--t2)'};font-size:16px">${alerts.length}</div><div class="l">Rifornimenti</div></div>`}
  </div>
  ${alerts.length?`<div class="card" style="border-color:rgba(199,127,18,.45)"><div class="sh"><span class="t" style="color:var(--amber)">⏳ Da pianificare</span><span class="a" onclick="pelView='sfuso';render()">Sfuso →</span></div>
    ${alerts.map(f=>`<div class="item" onclick="openPelClient('${f.clientId}')"><span class="led" style="background:${f.days<=0?'var(--coral)':'var(--amber)'}"></span>
    <div class="bd"><div class="ti">${esc(cName(f.clientId))}</div><div class="su">~${fmtQty(f.ratePerDay*30)} t/mese</div></div>
    <div class="right"><div class="d1" style="color:${f.days<=0?'var(--coral)':'var(--amber)'}">${f.days<=0?'ADESSO':f.days+' gg'}</div><div class="d2">${fmtD(f.nextDate)}</div></div></div>`).join('')}</div>`:''}
  <div class="card"><div class="sh"><span class="t">🪵 Sfuso — tonnellate al mese</span></div>
    ${barChart(mT,'#E2722E','t')}
    ${topT&&topT.val?`<div class="subtle" style="margin-top:8px">Mese più intenso: <b style="color:var(--t1)">${topT.label}</b> con ${fmtQty(topT.val)} t</div>`:'<div class="subtle" style="margin-top:8px">Nessuna consegna sfuso registrata negli ultimi 12 mesi.</div>'}
  </div>
  <div class="card"><div class="sh"><span class="t">📦 Sacchi al mese</span></div>
    ${barChart(mB,'#C77F12','sacchi')}
    ${topB&&topB.val?`<div class="subtle" style="margin-top:8px">Mese più intenso: <b style="color:var(--t1)">${topB.label}</b> con ${topB.val} sacchi</div>`:'<div class="subtle" style="margin-top:8px">Nessuna consegna in sacchi registrata negli ultimi 12 mesi.</div>'}
  </div>
  <div class="card"><div class="sh"><span class="t">Tutte le consegne</span></div>
    ${all.length?all.slice(0,25).map(pelRow).join(''):'<div class="empty"><div class="big">🪵</div>Nessuna consegna. Dall\'Hub: «30 sacchi a Bianchi venerdì» o «3 t sfuso a Hotel Roma».</div>'}
  </div>
  <button class="fab" onclick="openPel(null)">+</button>`;
}
function openPelClient(cid){
  const f=sfusoForecast().find(x=>x.clientId===cid);if(!f)return;
  const ds=f.ds;
  const maxQ=Math.max(...ds.map(p=>p.qty||0),0.001);
  const n=ds.length;const bw=Math.min(54,Math.floor(560/n)-10);
  const W=Math.max(280,n*(bw+10)+20),H=170,base=128;
  let bars='';
  ds.forEach((p,i)=>{
    const h=Math.max(4,Math.round((p.qty/maxQ)*100));
    const x=14+i*(bw+10);
    bars+=`<rect x="${x}" y="${base-h}" width="${bw}" height="${h}" rx="5" fill="url(#pelg)"/>
    <text x="${x+bw/2}" y="${base-h-7}" text-anchor="middle" fill="#2B2A24" font-size="11" font-family="JetBrains Mono">${fmtQty(p.qty)}</text>
    <text x="${x+bw/2}" y="${base+16}" text-anchor="middle" fill="#8A8170" font-size="9" font-family="JetBrains Mono">${p.date.slice(8,10)}.${p.date.slice(5,7)}</text>
    <text x="${x+bw/2}" y="${base+27}" text-anchor="middle" fill="#8A8170" font-size="8" font-family="JetBrains Mono">${p.date.slice(2,4)}</text>`;
  });
  openSheet(`<h3>🪵 ${esc(cName(cid))} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="stats" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat"><div class="n" style="font-size:16px">${fmtQty(ds.reduce((s,p)=>s+p.qty,0))} t</div><div class="l">Totale consegnato</div></div>
    <div class="stat"><div class="n" style="font-size:16px">${f.ratePerDay?fmtQty(f.ratePerDay*30)+' t':'—'}</div><div class="l">Consumo / mese</div></div>
    <div class="stat"><div class="n" style="font-size:16px;color:${f.days!=null&&f.days<=0?'var(--coral)':f.days!=null&&f.days<=30?'var(--amber)':'var(--teal)'}">${f.nextDate?(f.days<=0?'ora':f.days+' gg'):'—'}</div><div class="l">Prossimo pieno</div></div>
  </div>
  <div class="fld"><label>Consegne sfuso (tonnellate)</label>
    <div style="overflow-x:auto;background:var(--bg2);border:1px solid var(--line);border-radius:12px;padding:8px 4px">
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="pelg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#B35415"/><stop offset="1" stop-color="#E2722E"/></linearGradient></defs>
      <line x1="8" y1="${base}" x2="${W-8}" y2="${base}" stroke="rgba(111,178,58,.18)"/>
      ${bars}
    </svg></div>
  </div>
  ${f.nextDate?`<div class="subtle" style="margin-bottom:12px">📅 Rifornimento stimato attorno al <b style="color:var(--t1)">${fmtD(f.nextDate)}</b> in base allo storico. La stima migliora a ogni consegna registrata.</div>`:'<div class="subtle" style="margin-bottom:12px">Con la prossima consegna registrata potrò stimare consumo e data del rifornimento.</div>'}
  <div class="actions">
    <button class="btn ghost" onclick="closeSheet()">Chiudi</button>
    <button class="btn pri" onclick="newPelForClient('${cid}')">+ Pianifica consegna</button>
  </div>`);
}
function newPelForClient(cid){
  const f=sfusoForecast().find(x=>x.clientId===cid);
  closeSheet();
  openPel(null,{kind:'sfuso',clientId:cid,qty:f&&f.last?f.last.qty:'',date:f&&f.nextDate&&relDays(f.nextDate)>0?f.nextDate:''});
}
function openPel(id,preset){
  const p=id?byId(S.pellet,id):Object.assign({clientId:null,qty:'',unit:pelKind==='sfuso'?'t':'sacchi',kind:pelKind,date:'',time:'',status:'da_consegnare',notes:''},preset||{});
  if(preset&&preset.kind==='sfuso')p.unit='t';
  openSheet(`<h3>${id?(p.status==='prenotato'?'Prenotazione pellet':'Consegna pellet'):'Nuova consegna / prenotazione'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Tipo</label><div class="seg" id="pl-k">
    <div class="sg ${p.kind==='sfuso'?'on':''}" data-k="sfuso" onclick="pelKindPick(this)">🪵 Sfuso (t)</div>
    <div class="sg ${p.kind!=='sfuso'?'on':''}" data-k="sacchi" onclick="pelKindPick(this)">📦 Sacchi</div>
  </div></div>
  <div class="frow">
  <div class="fld"><label>Quantità</label><input id="pl-q" type="number" inputmode="decimal" step="any" value="${p.qty||''}"></div>
  <div class="fld"><label>Unità</label><select id="pl-u">${(p.kind==='sfuso'?['t']:['sacchi','bancali','kg']).map(u=>`<option ${p.unit===u?'selected':''}>${u}</option>`).join('')}</select></div></div>
  <div class="fld"><label>Cliente</label>${cliInput('pl-c',p.clientId,'pl-cprev')}<div id="pl-cprev">${clientPreviewHTML(p.clientId)}</div></div>
  <div class="fld"><label>Assegna a (uno o più)</label>${empSeg('pl-e',empIdsOf(p))}</div>
  ${p.status!=='consegnato'?`<div class="fld"><label>Stato</label><div class="seg" id="pl-s">
    <div class="sg ${p.status==='prenotato'?'on':''}" data-s="prenotato" onclick="pelStatusPick(this)">📋 Prenotato</div>
    <div class="sg ${p.status!=='prenotato'?'on':''}" data-s="da_consegnare" onclick="pelStatusPick(this)">🚚 Da consegnare</div>
  </div><div class="subtle" style="margin-top:4px">📋 Prenotato = ha ordinato ma non sai ancora quando arriva (data non obbligatoria).</div></div>`:''}
  <div class="frow"><div class="fld"><label>Data</label><input id="pl-d" type="date" value="${p.date||''}"></div>
  <div class="fld"><label>Ora</label><input id="pl-h" type="time" value="${p.time||''}"></div></div>
  ${dateChips('pl-d')}
  <div class="fld"><label>Importo CHF ${p.kind==='sfuso'&&S.settings.pricePerTon?'(auto: q.tà × '+S.settings.pricePerTon+')':p.kind!=='sfuso'&&S.settings.pricePerBag?'(auto: q.tà × '+S.settings.pricePerBag+')':''}</label><input id="pl-pr" type="number" inputmode="decimal" step="any" value="${p.price||''}" placeholder="${autoPrice(p)||''}"></div>
  <div class="fld"><label>Note</label><textarea id="pl-n">${esc(p.notes||'')}</textarea></div>
  ${id&&p.status!=='consegnato'?`<button class="btn pri" style="width:100%;margin-bottom:10px" onclick="startBolla('${id}')">✍ Consegna con firma (bolla)</button>`:''}
  ${id&&p.signature?`<button class="btn" style="width:100%;margin-bottom:10px;border-color:var(--teal);color:var(--teal)" onclick="printBolla('${id}')">📄 Stampa bolla firmata</button>`:''}
  ${p.clientId&&moduleActive('zone')?`<button class="btn" style="width:100%;margin-bottom:10px;border-color:var(--blue);color:var(--blue)" onclick="zoneFromSheet('pl-c')">📍 Vedi il cliente sulla mappa</button>`:''}
  <div class="actions">
    ${id?`<button class="btn danger" onclick="delItem('pellet','${id}')">Elimina</button>
    <button class="btn" onclick="togglePel('${id}')">${p.status==='consegnato'?'Riapri':'✓ Consegnato'}</button>`:''}
    <button class="btn pri" onclick="savePel('${id||''}')">Salva</button></div>`);
}
function pelKindPick(el){
  el.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));el.classList.add('on');
  const k=el.dataset.k;
  $('#pl-u').innerHTML=(k==='sfuso'?['t']:['sacchi','bancali','kg']).map(u=>`<option>${u}</option>`).join('');
}
function pelStatusPick(el){el.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));el.classList.add('on');}
/* da una prenotazione → programmata: si sposta in «Da consegnare», poi aggiungi la data */
function schedulePel(id){const p=byId(S.pellet,id);if(p&&p.status==='prenotato'){p.status='da_consegnare';save();}openPel(id);}
const autoPrice=p=>{
  if(!p.qty)return null;
  if(p.kind==='sfuso'&&S.settings.pricePerTon)return Math.round(p.qty*S.settings.pricePerTon*100)/100;
  if(p.kind!=='sfuso'&&p.unit==='sacchi'&&S.settings.pricePerBag)return Math.round(p.qty*S.settings.pricePerBag*100)/100;
  return null;
};
function savePel(id){
  const kind=$('#pl-k .sg.on')?.dataset.k||'sacchi';
  const cid=$('#pl-c').value||null;const rawName=(!cid&&$('#pl-c').dataset&&$('#pl-c').dataset.raw)||null;
  const data={qty:parseFloat($('#pl-q').value)||null,unit:$('#pl-u').value,kind,clientId:cid,clientRaw:rawName,employees:empSegRead('pl-e'),date:$('#pl-d').value||null,time:$('#pl-h').value||null,notes:$('#pl-n').value.trim()};
  data.price=parseFloat($('#pl-pr').value)||autoPrice({...data})||null;
  const stSel=document.querySelector('#pl-s .sg.on')?.dataset.s;
  const oldP=id?byId(S.pellet,id):null;const prevEmps=oldP?empIdsOf(oldP):[];
  if(id){Object.assign(oldP,data);if(oldP.status!=='consegnato'&&stSel)oldP.status=stSel;}
  else{S.pellet.unshift({id:uid(),status:stSel||'da_consegnare',via:'manuale',created:Date.now(),...data});}
  const effStatus=id?oldP.status:(stSel||'da_consegnare');
  const added=data.employees.filter(e=>!prevEmps.includes(e)&&!(S.session&&e===S.session.empId));
  if(added.length&&effStatus==='da_consegnare')pushNotify(added,'🪵 Consegna pellet assegnata',`${data.qty?fmtQty(data.qty)+' '+(data.unit||'sacchi'):'Consegna'} a ${cName(data.clientId)||(oldP&&oldP.clientRaw)||''}${data.date?' · '+fmtD(data.date):''}`);
  save();closeSheet();render();toast('🪵 Salvato');
}
function togglePel(id){const p=byId(S.pellet,id);p.status=p.status==='consegnato'?'da_consegnare':'consegnato';save();closeSheet();render();}

/* ================= BOLLA CONSEGNA PELLET ================= */
let bolla=null;
function startBolla(id){
  const p=byId(S.pellet,id);if(!p)return;
  bolla={pid:id,signature:null,signedName:cName(p.clientId)||p.clientRaw||''};
  openSheet(`<h3>✍ Bolla di consegna <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px"><b style="color:var(--t1)">${esc(cName(p.clientId)||p.clientRaw||'Cliente')}</b><br>
  ${p.kind==='sfuso'?'🪵 Sfuso':'📦 Sacchi'} — ${fmtQty(p.qty||0)} ${esc(p.unit||'')} · ${fmtD(todayIso())}${p.price?' · CHF '+fmtQty(p.price):''}</div>
  <div class="fld"><label>Firma del cliente alla consegna</label>
    <div class="sig-wrap"><canvas class="sig-canvas" id="bsigpad"></canvas><div class="sig-hint" id="bsighint">firma qui con il dito</div></div>
    <div class="sig-tools">
      <input value="${esc(bolla.signedName)}" oninput="bolla.signedName=this.value" placeholder="Nome di chi firma" style="background:var(--bg2);border:1px solid var(--line);border-radius:9px;color:var(--t1);font-size:12.5px;padding:7px 10px;outline:none;flex:1;margin-right:8px">
      <button class="btn sm ghost" onclick="bsigClear()">Cancella</button>
    </div></div>
  <div class="actions">
    <button class="btn ghost" onclick="closeSheet()">Annulla</button>
    <button class="btn pri" onclick="saveBolla()">✓ Consegnato</button></div>`);
  setTimeout(bsigInit,50);
}
function bsigInit(){
  const c=$('#bsigpad');if(!c)return;
  const dpr=window.devicePixelRatio||1;const w=c.offsetWidth,h=c.offsetHeight;
  c.width=w*dpr;c.height=h*dpr;
  const ctx=c.getContext('2d');ctx.scale(dpr,dpr);
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#16243a';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';
  let down=false,lx=0,ly=0;
  const pos=e=>{const r=c.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];};
  c.addEventListener('pointerdown',e=>{e.preventDefault();down=true;[lx,ly]=pos(e);$('#bsighint').style.display='none';c.setPointerCapture(e.pointerId);});
  c.addEventListener('pointermove',e=>{if(!down)return;e.preventDefault();const[x,y]=pos(e);ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(x,y);ctx.stroke();lx=x;ly=y;});
  const up=()=>{if(down){down=false;bolla.signature=c.toDataURL('image/png');}};
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
}
function bsigClear(){bolla.signature=null;const c=$('#bsigpad');const dpr=window.devicePixelRatio||1;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width/dpr,c.height/dpr);$('#bsighint').style.display='flex';}
function saveBolla(){
  const p=byId(S.pellet,bolla.pid);if(!p)return;
  if(!bolla.signature&&!confirm('Manca la firma. Segnare consegnato comunque?'))return;
  const wasDone=p.status==='consegnato';
  p.status='consegnato';p.signature=bolla.signature;p.signedName=bolla.signedName;
  if(!p.date)p.date=todayIso();
  if(!p.price)p.price=autoPrice(p)||null;
  if(!wasDone){const doer=(me()&&me().name)||'';pushNotify(ownerIds(),'🪵 Consegna fatta',`${doer}: ${p.qty?fmtQty(p.qty)+' '+(p.unit||'sacchi'):'consegna'} a ${cName(p.clientId)||p.clientRaw||''}`);}
  save();closeSheet();render();toast('🪵 Consegnato'+(p.signature?' e firmato':''));
  if(p.signature)setTimeout(()=>printBollaAsk(p.id),350);
}
function printBollaAsk(id){
  openSheet(`<h3>📄 Bolla salvata <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:14px">Vuoi stampare subito la bolla firmata?</div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Dopo</button>
  <button class="btn pri" onclick="closeSheet();printBolla('${id}')">🖨 Stampa / PDF</button></div>`);
}
function printBolla(id){
  const p=byId(S.pellet,id);if(!p)return;
  const c=byId(S.clients,p.clientId);
  const company=S.settings.companyName||'';
  const w=window.open('','_blank');
  if(!w){toast('⚠ Consenti i popup per stampare');return;}
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bolla — ${esc(cName(p.clientId)||p.clientRaw||'')}</title>
  <style>body{font-family:Helvetica,Arial,sans-serif;color:#16243a;max-width:760px;margin:30px auto;padding:0 24px;font-size:13px;line-height:1.5}
  h1{font-size:19px;border-bottom:2.5px solid #16243a;padding-bottom:10px;display:flex;justify-content:space-between;align-items:baseline}
  h1 small{font-size:11px;font-weight:normal;color:#667}
  h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#667;margin:22px 0 6px;border-bottom:1px solid #ccd;padding-bottom:3px}
  table{width:100%;border-collapse:collapse}td{padding:3px 0}td:first-child{width:160px;color:#667}
  .qty{font-size:24px;font-weight:bold;border:2px solid #16243a;display:inline-block;padding:8px 20px;border-radius:6px;margin:8px 0}
  .sig{margin-top:40px;display:flex;justify-content:space-between;gap:40px}.sig div{flex:1;text-align:center}
  .sig img{max-height:90px;max-width:100%}
  .sigline{border-top:1px solid #16243a;padding-top:5px;font-size:11px;color:#667;margin-top:6px}
  @media print{body{margin:0 auto}}</style></head><body>
  <h1>${company?esc(company):'BOLLA DI CONSEGNA PELLET'} <small>${company?'Bolla di consegna — ':''}N. ${p.id.slice(-6).toUpperCase()} · ${(p.date||todayIso()).split('-').reverse().join('.')}</small></h1>
  <h2>Cliente</h2>
  <table><tr><td>Nome</td><td><b>${esc(cName(p.clientId)||p.clientRaw||'—')}</b></td></tr>
  ${c&&c.address?`<tr><td>Indirizzo</td><td>${esc(c.address)}</td></tr>`:''}
  ${c&&c.phone?`<tr><td>Telefono</td><td>${esc(c.phone)}</td></tr>`:''}</table>
  <h2>Consegna</h2>
  <table><tr><td>Tipo</td><td>${p.kind==='sfuso'?'Pellet sfuso':'Pellet in sacchi'}</td></tr>
  <tr><td>Data</td><td>${(p.date||'').split('-').reverse().join('.')} ${p.time||''}</td></tr>
  ${p.notes?`<tr><td>Note</td><td>${esc(p.notes)}</td></tr>`:''}
  ${p.price?`<tr><td>Importo</td><td><b>CHF ${fmtQty(p.price)}</b></td></tr>`:''}</table>
  <div class="qty">${fmtQty(p.qty||0)} ${esc(p.unit||'')}</div>
  <div class="sig">
    <div><div style="height:90px"></div><div class="sigline">Per consegna — ${esc(company||'')}</div></div>
    <div>${p.signature?`<img src="${p.signature}">`:'<div style="height:90px"></div>'}<div class="sigline">Firma del cliente — ${esc(p.signedName||'')}</div></div>
  </div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script>
  </body></html>`);
  w.document.close();
}


