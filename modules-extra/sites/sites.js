/* ===== MODULO EXTRA: CANTIERI ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= CANTIERI ================= */
let siteTab='aperto';
function siteHours(s){const diary=s.log.reduce((t,l)=>t+(l.hours||0),0);const rep=(moduleActive('reports')&&typeof repHours==='function'&&typeof repForSite==='function')?repHours(repForSite(s.id)):0;return diary+rep;}
function renderSites(){
  const groups={previsto:[],aperto:[],da_fatturare:[],chiuso:[]};
  visSites().forEach(s=>{const g=groups[s.status||'aperto'];if(g)g.push(s);});
  const list=groups[siteTab]||[];
  const card=s=>{
    const hrs=siteHours(s);
    const pct=s.estHours?Math.min(100,Math.round(hrs/s.estHours*100)):null;
    const dd=s.dueDate?relDays(s.dueDate):null;
    const ddCol=dd==null?'var(--t3)':dd<0?'var(--coral)':dd<=7?'var(--amber)':'var(--t3)';
    const stCol=s.status==='chiuso'?'#8A8170':s.status==='da_fatturare'?'#C77F12':s.status==='previsto'?'#2E9E5E':'#A9742F';
    const stLbl=s.status==='chiuso'?'ARCHIVIO':s.status==='da_fatturare'?'DA FATTURARE':s.status==='previsto'?'PREVISTO':'IN CORSO';
    return`<div class="card" style="border-left:3px solid ${stCol};padding:12px;margin-bottom:10px;cursor:pointer" onclick="openSite('${s.id}')">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:3px">
      <span style="font-size:13.5px;color:var(--t1);font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.name)}</span>
      <span class="badge" style="border-color:${stCol};color:${stCol};flex-shrink:0">${stLbl}</span></div>
    <div class="su" style="font-size:11px;color:var(--t2);margin-bottom:9px">${esc(cName(s.clientId)||s.clientRaw||'—')}${s.employees.length?' · 👷 '+s.employees.map(eName).filter(Boolean).join(', '):''}</div>
    ${s.estHours?`<div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--t2);margin-bottom:4px"><span>Ore lavorate</span><span style="font-family:var(--mono);color:${pct>=100?'var(--amber)':'var(--t1)'}">${hrs} / ${s.estHours}h · ${pct}%</span></div><div class="ck-bar" style="height:7px;margin-bottom:10px"><i style="width:${pct}%;background:${pct>=90?'var(--amber)':'var(--cy)'}"></i></div>`:`<div class="su" style="margin-bottom:9px">${hrs}h registrate</div>`}
    <div style="display:flex;gap:11px;font-size:10px;color:var(--t3);font-family:var(--mono);align-items:center">
      ${s.dueDate&&s.status!=='chiuso'?`<span style="color:${ddCol}">⏳ ${dd<0?Math.abs(dd)+'gg oltre':dd+' gg'}</span>`:''}
      ${s.attachments.length?`<span>📎 ${s.attachments.length}</span>`:''}
      <span>📝 ${s.log.length}</span>
      ${s.amount&&isOwner()?`<span style="margin-left:auto;color:var(--teal)">CHF ${fmtQty(s.amount)}</span>`:''}
    </div></div>`;
  };
  const totFatt=groups.da_fatturare.reduce((t,s)=>t+(s.amount||0),0);
  const totSites=groups.previsto.length+groups.aperto.length+groups.da_fatturare.length+groups.chiuso.length;
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--blue)"></span>Cantieri <span class="subtle">(${totSites})</span></div>
  <div class="kpis" style="grid-template-columns:repeat(3,1fr)">
    <div class="kpi"><div class="n" style="color:var(--blue)">${groups.aperto.length}</div><div class="l">In corso</div></div>
    <div class="kpi"><div class="n" style="color:var(--amber)">${groups.da_fatturare.length}</div><div class="l">Da fatturare</div></div>
    ${isOwner()?`<div class="kpi"><div class="n" style="color:var(--teal);font-size:15px">${fmtQty(totFatt)}</div><div class="l">CHF in attesa</div></div>`:`<div class="kpi"><div class="n">${groups.chiuso.length}</div><div class="l">Archiviati</div></div>`}
  </div>
  <div class="tabs">
    ${groups.previsto.length?`<div class="tb ${siteTab==='previsto'?'on':''}" onclick="siteTab='previsto';render()" style="${siteTab==='previsto'?'':'border-color:var(--teal);color:var(--teal)'}">📋 Previsti (${groups.previsto.length})</div>`:''}
    <div class="tb ${siteTab==='aperto'?'on':''}" onclick="siteTab='aperto';render()">🔨 In corso (${groups.aperto.length})</div>
    <div class="tb ${siteTab==='da_fatturare'?'on':''}" onclick="siteTab='da_fatturare';render()" style="${groups.da_fatturare.length?'border-color:var(--amber);color:var(--amber)':''}">💰 Da fatturare (${groups.da_fatturare.length})</div>
    <div class="tb ${siteTab==='chiuso'?'on':''}" onclick="siteTab='chiuso';render()">🗄 Archivio (${groups.chiuso.length})</div>
  </div>
  ${list.length?list.map(card).join(''):`<div class="empty tall"><div class="big">${siteTab==='da_fatturare'?'💰':siteTab==='chiuso'?'🗄':siteTab==='previsto'?'📋':'🏗'}</div>${siteTab==='aperto'?'Nessun cantiere in corso.':siteTab==='da_fatturare'?'Niente da fatturare. 👌':siteTab==='previsto'?'Nessun lavoro futuro in programma.':'Archivio vuoto.'}${siteTab==='aperto'?'<button class="btn pri sm cta" onclick="editSite(null)">+ Nuovo cantiere</button>':''}</div>`}
  <button class="fab" onclick="editSite(null)">+</button>`;
}
function openSite(id){
  const s=byId(S.sites,id);if(!s)return;
  ensureAttUrls(s);
  const hrs=siteHours(s);
  const pct=s.estHours?Math.min(100,Math.round(hrs/s.estHours*100)):null;
  const STAT={previsto:['📋 Lavoro futuro','var(--teal)'],aperto:['🏗 In corso','var(--blue)'],da_fatturare:['💰 Da fatturare','var(--amber)'],chiuso:['🗄 Archiviato','var(--t3)']};
  const[sl,sc]=STAT[s.status]||STAT.aperto;
  const cli=s.clientId?byId(S.clients,s.clientId):null;const cliAddr=cli?cAddr(cli):'';
  openSheet(`<h3>${esc(s.name)} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:10px">${esc(cName(s.clientId)||s.clientRaw||'Nessun cliente')} · <b style="color:${sc}">${sl}</b><br>
  ${cliAddr?'📍 '+esc(cliAddr):''}${cli&&cli.phone?(cliAddr?' · ':'')+'📞 <a href="tel:'+esc(cli.phone)+'" style="color:var(--cy)">'+esc(cli.phone)+'</a>':''}${cliAddr||(cli&&cli.phone)?'<br>':''}
  ${s.startDate?'Inizio: '+fmtD(s.startDate):''}${s.dueDate?' · Fine prevista: '+fmtD(s.dueDate):''}</div>
  ${s.estHours?`<div class="fld"><label>Avanzamento ore — ${hrs}h / ${s.estHours}h (${pct}%)</label>
    <div class="ck-bar" style="height:6px"><i style="width:${pct}%;${pct>=100?'background:var(--amber)':''}"></i></div>
    ${pct>=100?'<div class="subtle" style="color:var(--amber);margin-top:5px">⚠ Stima ore superata</div>':''}</div>`
   :`<div class="subtle" style="margin-bottom:10px">Ore registrate: ${hrs}h (nessuna stima impostata)</div>`}
  ${s.notes?`<div class="fld"><label>Note</label><div style="font-size:13px;line-height:1.5">${esc(s.notes)}</div></div>`:''}
  <div class="fld"><label>Squadra</label><div style="font-size:13px">${s.employees.length?s.employees.map(eName).filter(Boolean).join(', '):'—'}</div>
  ${(()=>{const per={};s.log.forEach(l=>{if(l.empId&&l.hours)per[l.empId]=(per[l.empId]||0)+l.hours;});const ks=Object.keys(per);return ks.length?`<div class="subtle" style="margin-top:5px">${ks.map(k=>esc(eName(k))+': <b style="color:var(--cy)">'+fmtQty(per[k])+'h</b>').join(' · ')}</div>`:'';})()}
  </div>
  <div class="fld"><label>📎 Foto e file (${s.attachments.length})</label>
    ${s.attachments.length?`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px;margin-bottom:8px">
      ${s.attachments.map(a=>a.type==='img'
        ?`<div style="position:relative">${attUrl[a.id]?`<img src="${attUrl[a.id]}" onclick="viewAtt('${id}','${a.id}')" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:9px;border:1px solid var(--line);cursor:pointer">`:`<div onclick="viewAtt('${id}','${a.id}')" style="width:100%;aspect-ratio:1;border-radius:9px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:11px;cursor:pointer">…</div>`}</div>`
        :`<div onclick="viewAtt('${id}','${a.id}')" style="aspect-ratio:1;border:1px solid var(--line);border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;background:var(--bg2)"><span style="font-size:20px">${a.name.match(/\.pdf$/i)?'📄':'📊'}</span><span style="font-size:8px;color:var(--t3);padding:0 4px;text-align:center;overflow:hidden;max-height:22px">${esc(a.name.slice(0,18))}</span></div>`).join('')}
    </div>`:''}
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn sm" onclick="$('#att-cam').click()">📷 Scatta</button>
      <button class="btn sm" onclick="$('#att-photo').click()">🖼 Galleria</button>
      <button class="btn sm" onclick="$('#att-file').click()">📎 PDF / Excel</button>
      <input type="file" id="att-cam" accept="image/*" capture="environment" style="display:none" onchange="addPhoto('${id}',event)">
      <input type="file" id="att-photo" accept="image/*" style="display:none" onchange="addPhoto('${id}',event)">
      <input type="file" id="att-file" accept=".pdf,.xls,.xlsx,.csv,.doc,.docx" style="display:none" onchange="addFile('${id}',event)">
    </div>
  </div>
  ${moduleActive('reports')?`<div class="fld"><label>📸 Rapportini — archivio (${repForSite(id).length})${(()=>{const h=repHours(repForSite(id));return h?' · '+fmtQty(h)+'h totali':'';})()}</label>
    ${(()=>{const rs=repForSite(id);return rs.length?`<div style="max-height:300px;overflow:auto;border:1px solid var(--line);border-radius:9px">`+rs.map(r=>`<div style="display:flex;gap:8px;align-items:baseline;padding:8px 10px;border-bottom:1px solid var(--line);font-size:12.5px;cursor:pointer" onclick="closeSheet();openReport('${r.id}')">
      <span style="font-family:var(--mono);color:var(--t2);flex-shrink:0">${fmtD(r.date)}</span>
      <span style="flex:1;min-width:0"><b>${esc((typeof repEmpNames==='function'?repEmpNames(r):eName(r.empId))||'—')}</b>${r.work?' · '+esc(r.work.slice(0,50)):''}</span>
      ${r.photos&&r.photos.length?`<span style="color:var(--t3)">📷${r.photos.length}</span>`:''}
      ${r.hours?`<span style="font-family:var(--mono);color:var(--cy)">${fmtQty(r.hours)}h</span>`:''}</div>`).join('')+`</div>`:'<div class="subtle">Nessun rapportino per questo cantiere.</div>';})()}
    <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">
      <button class="btn sm" onclick="closeSheet();openReport(null,'${id}')">+ Nuovo rapportino</button>
      ${repForSite(id).length?`<button class="btn sm" style="border-color:var(--blue);color:var(--blue)" onclick="siteSummary('${id}')">📄 Riepilogo (stampa/PDF)</button>`:''}
    </div>
  </div>`:''}
  ${moduleActive('fatture')&&isOwner()?`<button class="btn pri" style="width:100%;margin-bottom:10px" onclick="closeSheet();invoiceFromSite('${id}')">🧾 Fattura questo cantiere</button>`:''}
  <div class="fld"><label>Diario lavori (${s.log.length})</label>
    ${s.log.length?s.log.slice().reverse().slice(0,15).map(l=>`<div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid var(--line);font-size:12.5px">
      <span style="font-family:var(--mono);color:var(--t3);flex-shrink:0">${fmtD(l.date)}</span>
      <span style="flex:1">${esc(l.text)}${l.empId?` <span style=\"color:var(--t3)\">· ${esc(eName(l.empId))}</span>`:''}</span>
      ${l.hours?`<span style="font-family:var(--mono);color:var(--cy)">${l.hours}h</span>`:''}</div>`).join(''):'<div class="subtle">Nessuna registrazione. Anche dalla chat: «aggiungi 4 ore al cantiere ${esc(s.name)}»</div>'}
  </div>
  <div class="fld"><label>Aggiungi al diario</label>
    <div class="frow"><div class="fld" style="flex:2.4"><input id="sl-t" placeholder="es. Posato basamento, arrivato materiale"></div>
    <div class="fld"><input id="sl-h" type="number" inputmode="decimal" placeholder="ore"></div></div>
    <div class="frow"><div class="fld"><select id="sl-e"><option value="">Chi? —</option>${(s.employees.length?s.employees.map(eid=>byId(S.employees,eid)).filter(Boolean):S.employees).map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('')}</select></div>
    <div class="fld"><button class="btn sm" style="width:100%" onclick="addLog('${id}')">+ Registra oggi</button></div></div>
  </div>
  <div class="fld"><label>⚙️ Macchine sul cantiere</label><div id="site-machines"><div class="subtle">…</div></div></div>
  ${(moduleActive('documenti')&&can('documenti'))?`<div class="fld"><label>📁 Documenti (${S.documents.filter(d=>d.siteId===id).length})</label>
    ${(()=>{const ds=S.documents.filter(d=>d.siteId===id).sort((a,b)=>((a.date||'')>(b.date||'')?-1:1));return ds.length?ds.slice(0,8).map(d=>`<div class="subtle" style="padding:3px 0 3px 8px;cursor:pointer;color:var(--t1)" onclick="closeSheet();openDocument('${d.id}')">📄 ${esc(typeof docTitle==='function'?docTitle(d):(d.description||'documento'))}${d.date?' · '+fmtD(d.date):''}</div>`).join(''):'<div class="subtle" style="padding:2px 0">Nessun documento collegato.</div>';})()}
    <button class="btn sm ghost" style="margin-top:6px" onclick="closeSheet();docAddForSite('${id}')">+ Documento</button></div>`:''}
  <div class="actions" style="flex-wrap:wrap">
    <button class="btn danger" onclick="delSite('${id}')">Elimina</button>
    ${s.clientId&&moduleActive('zone')?`<button class="btn" style="border-color:var(--blue);color:var(--blue)" onclick="zoneFocusClient('${s.clientId}')">📍 Mappa</button>`:''}
    ${s.status==='previsto'?`<button class="btn" style="border-color:var(--blue);color:var(--blue)" onclick="setSiteStatus('${id}','aperto')">▶ Avvia → cantiere attivo</button>`:''}
    ${s.status==='aperto'?`<button class="btn" style="border-color:var(--amber);color:var(--amber)" onclick="setSiteStatus('${id}','da_fatturare')">✓ Finito → fattura</button>`:''}
    ${s.status==='da_fatturare'?`<button class="btn" onclick="setSiteStatus('${id}','aperto')">↩ Riapri</button>
    <button class="btn" style="border-color:var(--teal);color:var(--teal)" onclick="setSiteStatus('${id}','chiuso')">💰 Fatturato → archivio</button>`:''}
    ${s.status==='chiuso'?`<button class="btn" onclick="setSiteStatus('${id}','aperto')">↩ Riapri</button>`:''}
    <button class="btn pri" onclick="editSite('${id}')">Modifica</button></div>`);
  if(typeof macRenderSiteMachines==='function') macRenderSiteMachines(id,s.clientId||'','site-machines');
}
function setSiteStatus(id,st){const s=byId(S.sites,id);s.status=st;if(st==='chiuso'&&!s.closedDate)s.closedDate=todayIso();if(st!=='aperto'&&(st==='da_fatturare'||st==='chiuso'))siteTab=st;save();closeSheet();render();toast(st==='da_fatturare'?'💰 Spostato in Da fatturare':st==='chiuso'?'🗄 Archiviato':'🏗 Riaperto');}
function addLog(id){const s=byId(S.sites,id);const t=$('#sl-t').value.trim();if(!t){toast('Scrivi cosa è stato fatto');return;}
  s.log.push({id:uid(),date:todayIso(),text:t,hours:parseFloat($('#sl-h').value)||null,empId:$('#sl-e')?.value||null});save();openSite(id);toast('Registrato');}
/* allegati (Supabase Storage) */
const attUrl={};let attFetching={};
function ensureAttUrls(s){
  const miss=s.attachments.filter(a=>!attUrl[a.id]&&!attFetching[a.id]&&a.storagePath);
  if(!miss.length)return;
  miss.forEach(a=>attFetching[a.id]=true);
  Promise.all(miss.map(a=>sb.storage.from('allegati').createSignedUrl(a.storagePath,3600).then(({data})=>{if(data)attUrl[a.id]=data.signedUrl;})))
    .then(()=>{const o=$('#overlay');if(o)openSite(s.id);})
    .catch(()=>{});
}
async function addPhoto(id,ev){
  const f=ev.target.files[0];if(!f)return; ev.target.value='';
  if(!window.sb){toast('📷 Le foto si salvano con l\'account online');return;}
  toast('📤 Carico foto…');
  try{
    const{blob,ext,type}=await preparePhoto(f);
    const name='foto-'+todayIso()+'.'+ext;
    const path=TENANT_ID+'/site/'+id+'/'+uid()+'-'+name;
    const{error:e1}=await sb.storage.from('allegati').upload(path,blob,{contentType:type||'application/octet-stream'});
    if(e1)throw e1;
    const row={id:uid(),site_id:id,name,type:'img',storage_path:path,date:todayIso()};
    const{error:e2}=await sb.from('attachments').insert(row);
    if(e2)throw e2;
    const s=byId(S.sites,id);
    s.attachments.push({id:row.id,name,type:'img',storagePath:path,date:row.date});
    openSite(id);toast('📷 Foto caricata ('+Math.round(blob.size/1024)+'KB)');
  }catch(err){toast('⚠ Upload: '+(err.message||err));}
}
async function addFile(id,ev){
  const f=ev.target.files[0];if(!f)return;
  if(f.size>25*1024*1024){toast('⚠ File oltre 25MB');return;}
  try{
    const path=TENANT_ID+'/site/'+id+'/'+uid()+'-'+f.name;
    const{error:e1}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'application/octet-stream'});
    if(e1)throw e1;
    const row={id:uid(),site_id:id,name:f.name,type:'file',storage_path:path,date:todayIso()};
    const{error:e2}=await sb.from('attachments').insert(row);
    if(e2)throw e2;
    const s=byId(S.sites,id);
    s.attachments.push({id:row.id,name:f.name,type:'file',storagePath:path,date:row.date});
    openSite(id);toast('📎 '+f.name+' caricato');
  }catch(err){toast('⚠ Upload: '+(err.message||err));}
}
function viewAtt(sid,aid){
  const s=byId(S.sites,sid);const a=byId(s.attachments,aid);if(!a)return;
  const url=attUrl[a.id]||'';
  openSheet(`<h3>${a.type==='img'?'📷':'📎'} ${esc(a.name)} <span class="x" onclick="openSite('${sid}')">✕</span></h3>
  ${a.type==='img'?(url?`<img src="${url}" style="width:100%;border-radius:12px">`:'<div class="empty">Carico…</div>'):`<div class="empty"><div class="big">${a.name.match(/\.pdf$/i)?'📄':'📊'}</div>${esc(a.name)}<br>aggiunto ${fmtD(a.date)}</div>`}
  <div class="actions">
    <button class="btn danger" onclick="delAtt('${sid}','${aid}')">Elimina</button>
    ${url?`<a class="btn pri" style="text-align:center;text-decoration:none" href="${url}" target="_blank" download="${esc(a.name)}">⬇ Apri / Scarica</a>`:''}
  </div>`);
}
async function delAtt(sid,aid){
  if(!confirm("Eliminare l'allegato?"))return;
  const s=byId(S.sites,sid);const a=byId(s.attachments,aid);
  try{
    if(a.storagePath)await sb.storage.from('allegati').remove([a.storagePath]);
    await sb.from('attachments').delete().eq('id',aid);
    s.attachments=s.attachments.filter(x=>x.id!==aid);
    openSite(sid);toast('Eliminato');
  }catch(e){toast('⚠ '+(e.message||e));}
}


/* auto-registrazione come destinazione "Trasforma in" del calendario (vedi core.js) */
if(typeof registerEventTarget==='function')registerEventTarget({
  id:'site', module:'sites', order:30, label:'🏗 Cantiere', name:'cantiere',
  make:base=>{const id=uid();S.sites.unshift({id,name:base.title||'Cantiere',clientId:base.clientId||null,clientRaw:base.clientId?null:(base.clientRaw||null),status:'previsto',employees:base.employees||[],estHours:null,amount:null,startDate:base.date||null,dueDate:null,closedDate:null,notes:base.place?('Luogo: '+base.place):'',via:'calendario',log:[],attachments:[],created:Date.now()});return id;},
  open:id=>{if(typeof openSite==='function')openSite(id);}
});
