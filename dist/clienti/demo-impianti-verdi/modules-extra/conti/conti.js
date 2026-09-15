/* ===== MODULO EXTRA: CONTI ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= CONTI (solo titolari) ================= */
const EXP_CATS=['Acquisto pellet','Affitto / Locazione','Stipendi','Veicoli','Gasolio/carburante','Materiali','Attrezzatura / Ricambi','Assicurazioni','Utenze (luce/gas/tel)','Tasse / Imposte','Altro'];
const EXP_RECUR=[[0,'Una tantum'],[1,'Ogni mese'],[3,'Ogni 3 mesi'],[6,'Ogni 6 mesi'],[12,'Ogni anno']];
const recurLabel=r=>({1:'🔁 ogni mese',3:'🔁 ogni 3 mesi',6:'🔁 ogni 6 mesi',12:'🔁 ogni anno'}[r]||'');
const MAINT_KINDS=[['stufa','Stufa'],['camino','Camino'],['caldaia','Caldaia'],['altro','Altro']];
const MAINT_ICONS={stufa:'🔥',camino:'🪵',caldaia:'♨️',altro:'🔧'};
let contiTab='riepilogo';let contiMonth=null;let contiSiteTab='attivi';let contiSpeseView='mese';
const curMonth=()=>todayIso().slice(0,7);
const cMonth=()=>contiMonth||curMonth();
function monthLabel(mk){const[y,m]=mk.split('-');const nm=MESI[+m-1]||'';return nm.charAt(0).toUpperCase()+nm.slice(1)+' '+y;}
function shiftMonth(mk,n){let[y,m]=mk.split('-').map(Number);m+=n;while(m<1){m+=12;y--;}while(m>12){m-=12;y++;}return y+'-'+String(m).padStart(2,'0');}
function contiSetMonth(n){contiMonth=shiftMonth(cMonth(),n);render();}
function contiSetYear(n){contiMonth=shiftMonth(cMonth(),n*12);render();}
function monthsOfYear(yr){const a=[];for(let m=1;m<=12;m++)a.push(yr+'-'+String(m).padStart(2,'0'));return a;}
function speseAnnoByMonth(yr){return monthsOfYear(yr).map((k,i)=>({label:MESI[i].slice(0,3),key:k,val:speseTot(k)}));}
function speseAnnoTot(yr){return monthsOfYear(yr).reduce((t,k)=>t+speseTot(k),0);}
function speseCatMese(mk){const o={};speseMese(mk).forEach(e=>{const c=e.category||'Altro';o[c]=(o[c]||0)+(e.amount||0);});return o;}
function speseCatAnno(yr){const o={};monthsOfYear(yr).forEach(k=>speseMese(k).forEach(e=>{const c=e.category||'Altro';o[c]=(o[c]||0)+(e.amount||0);}));return o;}
function catBars(obj){
  const ents=Object.entries(obj).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  if(!ents.length)return'<div class="subtle" style="padding:6px 2px">Nessuna spesa.</div>';
  const max=Math.max(...ents.map(e=>e[1]));
  return ents.map(([c,v])=>`<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:3px"><span>${esc(c)}</span><span style="font-family:var(--mono);color:var(--coral)">CHF ${fmtQty(v)}</span></div><div class="ck-bar" style="height:7px"><i style="width:${Math.round(v/max*100)}%;background:var(--coral)"></i></div></div>`).join('');
}
function maintPrice(kind){const r=S.maintPrices.find(x=>x.kind===kind);return r&&r.price!=null?r.price:null;}
function maintIncome(m){const lp=maintPrice(m.type);return lp!=null?lp:(m.price||0);}
function siteIncomeMonth(s){const d=s.closedDate||s.dueDate||s.startDate||(s.created?iso(new Date(s.created)):'');return d?d.slice(0,7):'';}
function siteSpese(sid){return S.expenses.filter(e=>e.siteId===sid).reduce((t,e)=>t+(e.amount||0),0);}
function monthsDiff(a,b){const[ya,ma]=a.split('-').map(Number);const[yb,mb]=b.split('-').map(Number);return(yb-ya)*12+(mb-ma);}
function expenseInMonth(e,mk){if(!e.date)return false;const em=e.date.slice(0,7);if(!e.recur)return em===mk;const d=monthsDiff(em,mk);return d>=0&&d%e.recur===0;}
function speseMese(mk){return S.expenses.filter(e=>expenseInMonth(e,mk));}
function speseTot(mk){return speseMese(mk).reduce((t,e)=>t+(e.amount||0),0);}
function entrate(mk){
  const pellet=S.pellet.filter(p=>p.status==='consegnato'&&p.date&&p.date.slice(0,7)===mk).reduce((t,p)=>t+(p.price||0),0);
  const man=S.maintenances.filter(m=>m.status==='fatta'&&m.date&&m.date.slice(0,7)===mk).reduce((t,m)=>t+maintIncome(m),0);
  const cant=S.sites.filter(s=>s.status==='chiuso'&&siteIncomeMonth(s)===mk).reduce((t,s)=>t+(s.amount||0),0);
  return{pellet,man,cant,tot:pellet+man+cant};
}
const entrRow=(label,val)=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line);font-size:13px"><span class="subtle">${label}</span><span style="font-family:var(--mono);color:var(--teal)">CHF ${fmtQty(val)}</span></div>`;
function expRow(e){const sn=e.siteId?(byId(S.sites,e.siteId)||{}).name:'';const rl=recurLabel(e.recur);return`<div class="item" onclick="openExpense('${e.id}')"><div class="bd"><div class="ti">${esc(e.category||'Spesa')} · <span style="color:var(--coral)">CHF ${fmtQty(e.amount||0)}</span>${rl?` <span class="badge" style="border-color:var(--cy);color:var(--cy)">${rl}</span>`:''}</div><div class="su">${fmtD(e.date)}${e.note?' · '+esc(e.note):''}${sn?' · 🏗 '+esc(sn):''}</div></div></div>`;}
function renderConti(){
  if(!isOwner()){view='hub';renderHub();return;}
  const mk=cMonth();
  const tabs=[['riepilogo','📊 Riepilogo'],['spese','💸 Spese'],['cantieri','🏗 Cantieri'],['listino','🏷 Listino']];
  let body='';
  if(contiTab==='spese')body=contiSpese(mk);
  else if(contiTab==='cantieri')body=contiCantieri();
  else if(contiTab==='listino')body=contiListino();
  else body=contiRiepilogo(mk);
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent"></span>💰 Conti</div>
  <div class="tabs">${tabs.map(([id,l])=>`<div class="tb ${contiTab===id?'on':''}" onclick="contiTab='${id}';render()">${l}</div>`).join('')}</div>
  ${body}`;
}
const monthBar=mk=>`<div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px"><button class="cal-nav" onclick="contiSetMonth(-1)">‹</button><b style="font-size:15px">${monthLabel(mk)}</b><button class="cal-nav" onclick="contiSetMonth(1)">›</button></div>`;
function lastMonths(mk,n){const a=[];let k=mk;for(let i=0;i<n;i++){a.unshift(k);k=shiftMonth(k,-1);}return a;}
function contiTrend(mk){
  const data=lastMonths(mk,6).map(k=>({k,e:entrate(k).tot,s:speseTot(k)}));
  const max=Math.max(0.001,...data.map(d=>Math.max(d.e,d.s)));
  const bars=data.map(d=>{const he=d.e?Math.max(3,Math.round(d.e/max*50)):0;const hs=d.s?Math.max(3,Math.round(d.s/max*50)):0;const lab=(MESI[+d.k.split('-')[1]-1]||'').slice(0,3);return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:74px"><div style="display:flex;gap:3px;align-items:flex-end;height:52px"><div style="width:8px;height:${he}px;background:var(--teal);border-radius:2px"></div><div style="width:8px;height:${hs}px;background:var(--coral);border-radius:2px"></div></div><span style="font-size:8.5px;color:var(--t3);margin-top:5px">${lab}</span></div>`;}).join('');
  return`<div class="card"><div class="sh"><span class="t">📈 Entrate vs Spese · 6 mesi</span><span style="font-size:10px;color:var(--t3)"><span style="color:var(--teal)">▮</span> entr. <span style="color:var(--coral)">▮</span> spese</span></div><div style="display:flex;gap:6px;margin-top:4px">${bars}</div></div>`;
}
function contiRiepilogo(mk){
  const e=entrate(mk);const sp=speseTot(mk);const ut=e.tot-sp;
  const pmk=shiftMonth(mk,-1);const put=entrate(pmk).tot-speseTot(pmk);
  const delta=put?Math.round((ut-put)/Math.abs(put)*100):null;
  const list=speseMese(mk).slice().sort((a,b)=>(a.date<b.date?1:-1));
  const emax=Math.max(e.pellet,e.man,e.cant,0.001);
  const ebar=(ic,label,val,col)=>`<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span style="color:var(--t2)">${ic} ${label}</span><span style="font-family:var(--mono);color:var(--teal)">CHF ${fmtQty(val)}</span></div><div class="ck-bar" style="height:6px"><i style="width:${Math.round(val/emax*100)}%;background:${col}"></i></div></div>`;
  return`${monthBar(mk)}
  <div class="card" style="border-color:rgba(46,158,94,.4);background:rgba(46,158,94,.05);text-align:center;padding:14px">
    <div class="subtle" style="font-size:11px;letter-spacing:.5px">UTILE DI ${monthLabel(mk).toUpperCase()}</div>
    <div style="font-size:30px;font-weight:700;color:${ut>=0?'var(--teal)':'var(--coral)'};margin:3px 0">${ut>=0?'+':''}${fmtQty(ut)}<span style="font-size:14px;color:var(--t3);font-weight:400"> CHF</span></div>
    ${delta!=null?`<div style="font-size:10.5px;color:${delta>=0?'var(--teal)':'var(--coral)'}">${delta>=0?'▲':'▼'} ${Math.abs(delta)}% rispetto a ${MESI[+pmk.split('-')[1]-1]}</div>`:'<div class="subtle" style="font-size:10px">entrate − spese del mese</div>'}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px">
    <div class="stat"><div class="subtle" style="font-size:11px">↘ Entrate</div><div style="font-size:19px;font-weight:700;color:var(--teal)">${fmtQty(e.tot)}</div><div class="subtle" style="font-size:10px">CHF</div></div>
    <div class="stat"><div class="subtle" style="font-size:11px">↗ Spese</div><div style="font-size:19px;font-weight:700;color:var(--coral)">${fmtQty(sp)}</div><div class="subtle" style="font-size:10px">CHF</div></div>
  </div>
  ${contiTrend(mk)}
  <div class="card"><div class="sh"><span class="t">📥 Da dove arrivano le entrate</span></div>
    ${ebar('🪵','Pellet',e.pellet,'#5E9E2E')}
    ${ebar('🔧','Manutenzioni',e.man,'var(--amber)')}
    ${ebar('🏗','Cantieri',e.cant,'var(--blue)')}
  </div>
  <div class="card"><div class="sh"><span class="t">📤 Spese del mese</span><button class="btn sm pri" onclick="openExpense('')">+ Spesa</button></div>
    ${list.length?list.map(expRow).join(''):'<div class="subtle" style="padding:6px 2px">Nessuna spesa in questo mese.</div>'}
  </div>`;
}
function contiSpese(mk){
  const yr=mk.slice(0,4);
  const seg=`<div class="seg" style="margin-bottom:10px"><div class="sg ${contiSpeseView==='mese'?'on':''}" onclick="contiSpeseView='mese';render()">📅 Mese</div><div class="sg ${contiSpeseView==='anno'?'on':''}" onclick="contiSpeseView='anno';render()">📆 Anno</div></div>`;
  const addBtn=`<button class="btn pri" style="width:100%;margin-bottom:10px" onclick="openExpense('')">+ Aggiungi spesa</button>`;
  if(contiSpeseView==='anno'){
    const months=speseAnnoByMonth(yr);const tot=speseAnnoTot(yr);const avg=Math.round(tot/12);
    return`${seg}
    <div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px"><button class="cal-nav" onclick="contiSetYear(-1)">‹</button><b style="font-size:15px">Anno ${yr}</b><button class="cal-nav" onclick="contiSetYear(1)">›</button></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="stat"><div class="subtle" style="font-size:11px">Totale anno</div><div style="font-size:18px;font-weight:700;color:var(--coral)">${fmtQty(tot)}</div><div class="subtle" style="font-size:10px">CHF</div></div>
      <div class="stat"><div class="subtle" style="font-size:11px">Media al mese</div><div style="font-size:18px;font-weight:700;color:var(--amber)">${fmtQty(avg)}</div><div class="subtle" style="font-size:10px">CHF</div></div>
    </div>
    ${addBtn}
    <div class="card"><div class="sh"><span class="t">📊 Andamento mensile ${yr}</span></div>${barChart(months,'#D64528')}</div>
    <div class="card"><div class="sh"><span class="t">🏷 Per categoria</span></div>${catBars(speseCatAnno(yr))}</div>`;
  }
  const list=speseMese(mk).slice().sort((a,b)=>(a.date<b.date?1:-1));const tot=speseTot(mk);
  return`${seg}${monthBar(mk)}
  <div class="card"><div class="sh"><span class="t">Totale del mese</span><span class="t" style="font-family:var(--mono);color:var(--coral)">CHF ${fmtQty(tot)}</span></div></div>
  ${addBtn}
  <div class="card"><div class="sh"><span class="t">🏷 Per categoria</span></div>${catBars(speseCatMese(mk))}</div>
  <div class="card"><div class="sh"><span class="t">📋 Dettaglio (${list.length})</span></div>${list.length?list.map(expRow).join(''):'<div class="empty"><div class="big">💸</div>Nessuna spesa in questo mese.</div>'}</div>`;
}
function openExpense(id){
  const e=id?byId(S.expenses,id):{date:todayIso(),category:EXP_CATS[0],amount:null,note:'',siteId:null,recur:0};
  if(!e)return;
  const stdCat=EXP_CATS.includes(e.category);
  const selCat=stdCat?e.category:(e.category?'Altro':EXP_CATS[0]);
  const othCat=stdCat?'':(e.category||'');
  openSheet(`<h3>${id?'Modifica spesa':'Nuova spesa'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="frow"><div class="fld"><label>Data</label><input id="ex-d" type="date" value="${e.date||todayIso()}"></div>
    <div class="fld"><label>Importo CHF</label><input id="ex-a" type="number" inputmode="decimal" step="any" value="${e.amount||''}"></div></div>
  <div class="frow"><div class="fld"><label>Categoria</label><select id="ex-cat" onchange="$('#ex-cat-oth').style.display=this.value==='Altro'?'block':'none'">${EXP_CATS.map(c=>`<option ${selCat===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="fld"><label>Ricorrenza</label><select id="ex-r">${EXP_RECUR.map(([v,l])=>`<option value="${v}" ${(e.recur||0)===v?'selected':''}>${l}</option>`).join('')}</select></div></div>
  <div class="fld" id="ex-cat-oth" style="display:${selCat==='Altro'?'block':'none'}"><label>Nome categoria</label><input id="ex-cat-c" value="${esc(othCat)}" placeholder="es. Multe, Bolli, Pubblicità"></div>
  <div class="fld"><label>Cantiere collegato (facoltativo)</label><select id="ex-s"><option value="">— nessuno</option>${S.sites.map(s=>`<option value="${s.id}" ${e.siteId===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
  <div class="fld"><label>Nota</label><textarea id="ex-n">${esc(e.note||'')}</textarea></div>
  <div class="actions">${id?`<button class="btn danger" onclick="delExpense('${id}')">Elimina</button>`:''}<button class="btn pri" onclick="saveExpense('${id||''}')">Salva</button></div>`);
}
function saveExpense(id){
  let category=$('#ex-cat').value;
  if(category==='Altro'){const oth=($('#ex-cat-c')?.value||'').trim();if(oth)category=oth;}
  const data={date:$('#ex-d').value||todayIso(),amount:parseFloat($('#ex-a').value)||null,category,recur:+($('#ex-r')?.value||0),siteId:$('#ex-s').value||null,note:$('#ex-n').value.trim()};
  if(!data.amount){toast('Manca l’importo');return;}
  if(id){Object.assign(byId(S.expenses,id),data);}else{S.expenses.unshift({id:uid(),created:Date.now(),...data});}
  save();closeSheet();render();toast('💸 Spesa salvata');
}
function delExpense(id){if(!confirm('Eliminare questa spesa?'))return;S.expenses=S.expenses.filter(x=>x.id!==id);save();closeSheet();render();toast('🗑 Eliminata');}
function contiCantieri(){
  const tabs=[['futuri','📋 Futuri'],['attivi','🔨 Attivi'],['finiti','✅ Finiti']];const t=contiSiteTab;
  let sites;
  if(t==='futuri')sites=S.sites.filter(s=>s.status==='previsto');
  else if(t==='finiti')sites=S.sites.filter(s=>s.status==='chiuso');
  else sites=S.sites.filter(s=>s.status==='aperto'||s.status==='da_fatturare');
  sites=sites.slice().sort((a,b)=>b.created-a.created);
  const totAmount=sites.reduce((x,s)=>x+(s.amount||0),0);
  const totMargin=sites.reduce((x,s)=>x+((s.amount||0)-siteSpese(s.id)),0);
  const row=s=>{const sp=siteSpese(s.id);const mg=(s.amount||0)-sp;return`<div class="item" onclick="openSite('${s.id}')"><div class="bd"><div class="ti">${esc(s.name)}</div><div class="su">${esc(cName(s.clientId)||s.clientRaw||'—')}</div><div class="mt">Importo <b style="color:var(--amber)">${fmtQty(s.amount||0)}</b> · Spese <b style="color:var(--coral)">${fmtQty(sp)}</b> · Margine <b style="color:${mg>=0?'var(--teal)':'var(--coral)'}">${mg>=0?'+':''}${fmtQty(mg)}</b></div></div></div>`;};
  return`<div class="tabs">${tabs.map(([id,l])=>`<div class="tb ${t===id?'on':''}" onclick="contiSiteTab='${id}';render()">${l}</div>`).join('')}</div>
  ${t==='futuri'?`<button class="btn pri" style="width:100%;margin-bottom:10px" onclick="newFutureSite()">+ Nuovo lavoro futuro</button>`:''}
  <div class="card"><div class="sh"><span class="t">${t==='futuri'?'Incasso previsto':t==='attivi'?'Margine in corso':'Margine finale'}</span><span class="t" style="font-family:var(--mono);color:var(--cy)">CHF ${fmtQty(t==='futuri'?totAmount:totMargin)}</span></div></div>
  <div class="card">${sites.length?sites.map(row).join(''):`<div class="empty"><div class="big">🏗</div>${t==='futuri'?'Nessun lavoro futuro. Aggiungine uno per pianificare.':t==='attivi'?'Nessun cantiere attivo.':'Nessun cantiere finito.'}</div>`}</div>`;
}
function newFutureSite(){editSite(null,'previsto');}
function contiListino(){
  return`<div class="card"><div class="subtle" style="line-height:1.5">Imposta il prezzo fisso di ogni tipo di manutenzione. L'incasso delle manutenzioni «fatte» si calcola da solo con queste cifre. Questi prezzi li vedi solo tu.</div></div>
  <div class="card">
  ${MAINT_KINDS.map(([k,l])=>`<div class="fld"><label>${l} — CHF</label><input type="number" inputmode="decimal" step="any" id="lp-${k}" value="${maintPrice(k)!=null?maintPrice(k):''}" placeholder="es. ${k==='stufa'?'80':k==='camino'?'120':k==='caldaia'?'150':'0'}"></div>`).join('')}
  <button class="btn pri" style="width:100%" onclick="saveListino()">Salva listino</button>
  </div>`;
}
function saveListino(){
  MAINT_KINDS.forEach(([k])=>{const raw=$('#lp-'+k).value;const v=parseFloat(raw);const val=(raw===''||isNaN(v))?null:v;const r=S.maintPrices.find(x=>x.kind===k);if(r){r.price=val;}else{S.maintPrices.push({id:uid(),kind:k,price:val});}});
  save();render();toast('🏷 Listino salvato');
}

