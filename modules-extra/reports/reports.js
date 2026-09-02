/* ===== MODULO: RAPPORTINI DI CANTIERE =====
   Un rapportino = un giorno · un cantiere · un operaio (ore, lavoro, materiali, foto).
   Collegamenti: ← Cantieri (site_id), ← Personale (emp_id, ore per commessa/dipendente),
   → Notifiche/Lavagna (promemoria "da compilare oggi").
   Ruoli: il dipendente compila/vede i SUOI; il titolare vede/gestisce tutti.
   Dipende dal core (S, uid, save, render, openSheet, closeSheet, esc, toast, isOwner,
   me, eName, cName, byId, fmtD, fmtQty, todayIso, moduleActive, TENANT_ID, sb, $). */

/* ---- operai di un rapportino (uno o più) ---- */
const repPeople=r=>(r&&r.employees&&r.employees.length)?r.employees:((r&&r.empId)?[r.empId]:[]);
const repHas=(r,empId)=>repPeople(r).includes(empId);
const repEmpNames=r=>repPeople(r).map(eName).filter(Boolean).join(', ');
/* ---- viste per ruolo ---- */
const repVis=()=>isOwner()?S.reports:S.reports.filter(r=>repHas(r,S.session&&S.session.empId));
const repForSite=id=>S.reports.filter(r=>r.siteId===id).sort((a,b)=>(a.date<b.date?1:-1));
/* ore-uomo: le ore del rapporto sono a testa → moltiplicate per il numero di operai */
const repHours=list=>list.reduce((t,r)=>t+((+r.hours||0)*Math.max(1,repPeople(r).length)),0);

/* ---- promemoria: cantieri aperti dove l'operaio è in squadra e manca il rapportino di OGGI ---- */
function myOpenSites(empId){return S.sites.filter(s=>s.status==='aperto'&&(s.employees||[]).includes(empId));}
function reportsToFill(empId){
  if(!moduleActive('reports')||!moduleActive('sites')||!empId)return [];
  const t=todayIso();
  return myOpenSites(empId).filter(s=>!S.reports.some(r=>r.siteId===s.id&&repHas(r,empId)&&r.date===t));
}

/* ---- elenco ---- */
function renderReports(){
  const mine=repVis();
  const todo=S.session?reportsToFill(S.session.empId):[];
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Rapportini</div>
  ${todo.length?`<div class="card" style="border-color:rgba(199,127,18,.4)">
    <div class="sh"><span class="t" style="color:var(--amber)">📸 Da compilare oggi (${todo.length})</span></div>
    ${todo.map(s=>`<div class="frw" style="border-left-color:var(--amber)">
      <div class="bd"><div class="ti">${esc(s.name)}</div><div class="su">${esc(cName(s.clientId)||s.clientRaw||'cantiere')}</div></div>
      <button class="qbtn" onclick="openReport(null,'${s.id}')">Compila ›</button></div>`).join('')}
  </div>`:''}
  <button class="btn pri" style="width:100%;margin-bottom:12px" onclick="openReport()">+ Nuovo rapportino</button>
  ${mine.length?repList(mine):'<div class="card"><div class="empty"><div class="big">📸</div>Nessun rapportino ancora.<br><span class="subtle">Compila il rapporto giornaliero dei tuoi cantieri.</span></div></div>'}`;
}
function repList(list){
  const sorted=[...list].sort((a,b)=>(a.date<b.date?1:a.date>b.date?-1:(b.created||0)-(a.created||0)));
  return sorted.map(r=>{const s=byId(S.sites,r.siteId);return `<div class="card" style="cursor:pointer" onclick="openReport('${r.id}')">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div style="flex:1;min-width:0"><div style="font-weight:600">${esc(s?s.name:'Cantiere')}</div>
      <div class="subtle" style="font-size:11px">${r.date?fmtD(r.date):''} · 👷 ${esc(repEmpNames(r)||'—')}${r.hours?' · ⏱ '+fmtQty(r.hours)+'h'+(repPeople(r).length>1?'/testa':''):''}</div></div>
      ${r.photos&&r.photos.length?`<span class="badge" style="border-color:var(--line2);color:var(--t2)">📷 ${r.photos.length}</span>`:''}
    </div>
    ${r.work?`<div style="font-size:12.5px;color:var(--t2);margin-top:6px">${esc(r.work.slice(0,140))}${r.work.length>140?'…':''}</div>`:''}
  </div>`;}).join('');
}

/* ---- editor ---- */
let repDraft=null; let repUrls={};
function openReport(id,presetSite){
  const meId=S.session&&S.session.empId;
  const src=id?byId(S.reports,id):null;
  repDraft=src?{...src,photos:[...(src.photos||[])]}:{id:uid(),siteId:presetSite||'',empId:meId,date:todayIso(),hours:'',work:'',materials:'',photos:[],_new:true};
  if(!repDraft.siteId&&presetSite)repDraft.siteId=presetSite;
  const owner=isOwner();
  const sites=S.sites.filter(s=>s.status==='aperto'||s.id===repDraft.siteId);
  const emps=S.employees.filter(e=>e.active!==false);
  openSheet(`<h3>${id?'Rapportino':'Nuovo rapportino'} <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="frow">
     <div class="fld"><label>Cantiere</label><select id="rp-site">${sites.length?sites.map(s=>`<option value="${s.id}" ${repDraft.siteId===s.id?'selected':''}>${esc(s.name)}</option>`).join(''):'<option value="">— nessun cantiere aperto —</option>'}</select></div>
     <div class="fld"><label>Data</label><input id="rp-date" type="date" value="${repDraft.date||todayIso()}"></div>
   </div>
   <div class="fld"><label>Chi ha lavorato (spunta anche il collega se eravate in due)</label>${empSeg('rp-emp',(repDraft.employees&&repDraft.employees.length)?repDraft.employees:(repDraft.empId?[repDraft.empId]:(meId?[meId]:[])))}</div>
   <div class="fld"><label>Ore (a testa)</label><input id="rp-hours" type="number" inputmode="decimal" step="any" value="${repDraft.hours||''}" placeholder="es. 8"></div>
   <div class="fld"><label>Lavoro svolto</label><textarea id="rp-work" rows="3" placeholder="Cosa è stato fatto oggi in cantiere…">${esc(repDraft.work||'')}</textarea></div>
   <div class="fld"><label>Materiali usati</label><textarea id="rp-mat" rows="2" placeholder="es. 20 m² gres, 3 sacchi colla, fuga grigia">${esc(repDraft.materials||'')}</textarea></div>
   <div class="fld"><label>📷 Foto</label>
     <div id="rp-photos" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px;margin-bottom:8px">${repDraft.photos.map(repTile).join('')}</div>
     <input type="file" id="rp-cam" accept="image/*" capture="environment" style="display:none" onchange="repAddPhoto(event)">
     <input type="file" id="rp-file" accept="image/*" style="display:none" onchange="repAddPhoto(event)">
     <div class="row" style="gap:8px">
       <button class="btn sm ghost" onclick="document.getElementById('rp-cam').click()">📷 Scatta</button>
       <button class="btn sm ghost" onclick="document.getElementById('rp-file').click()">🖼 Galleria</button>
     </div>
   </div>
   <div class="actions">${id?`<button class="btn danger" onclick="delReport('${id}')">Elimina</button>`:''}<button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveReport('${id||''}')">Salva</button></div>`);
  repLoadUrls(repDraft.photos);
}
function repTile(p){
  const u=repUrls[p.storagePath];
  return `<div style="position:relative;aspect-ratio:1;border-radius:9px;overflow:hidden;background:var(--bg3)">${u?`<img src="${u}" style="width:100%;height:100%;object-fit:cover">`:'<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:20px">📷</div>'}<button onclick="repDelPhoto('${p.id}')" style="position:absolute;top:2px;right:2px;background:var(--coral);color:#fff;border:0;border-radius:6px;width:20px;height:20px;font-size:11px;cursor:pointer;line-height:1">✕</button></div>`;
}
function repRefresh(){const el=$('#rp-photos');if(el&&repDraft)el.innerHTML=repDraft.photos.map(repTile).join('');}
async function repLoadUrls(photos){
  const miss=(photos||[]).filter(p=>p.storagePath&&!repUrls[p.storagePath]);
  if(!miss.length)return;
  await Promise.all(miss.map(p=>sb.storage.from('allegati').createSignedUrl(p.storagePath,3600).then(({data})=>{if(data)repUrls[p.storagePath]=data.signedUrl;}).catch(()=>{})));
  repRefresh();
}
async function repAddPhoto(ev){
  const f=ev.target.files&&ev.target.files[0]; ev.target.value=''; if(!f||!repDraft)return;
  toast('📤 Carico foto…');
  try{
    const path=TENANT_ID+'/report/'+repDraft.id+'/'+uid()+'.jpg';
    const{error}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'image/jpeg'});
    if(error)throw error;
    repDraft.photos.push({id:uid(),name:f.name||'foto',storagePath:path});
    const{data}=await sb.storage.from('allegati').createSignedUrl(path,3600); if(data)repUrls[path]=data.signedUrl;
    repRefresh();
  }catch(e){toast('⚠ Foto: '+(e.message||e));}
}
function repDelPhoto(pid){
  if(!repDraft)return;
  const p=repDraft.photos.find(x=>x.id===pid);
  if(p&&p.storagePath)sb.storage.from('allegati').remove([p.storagePath]).catch(()=>{});
  repDraft.photos=repDraft.photos.filter(x=>x.id!==pid);repRefresh();
}
function saveReport(id){
  if(!repDraft)return;
  const siteId=$('#rp-site')?$('#rp-site').value:'';
  const meId=S.session&&S.session.empId;
  let employees=(typeof empSegRead==='function')?empSegRead('rp-emp'):[];
  if(!employees.length)employees=meId?[meId]:[];
  const empId=(meId&&employees.includes(meId))?meId:(employees[0]||meId); // autore = chi compila se presente
  if(!siteId){toast('Scegli il cantiere');return;}
  const data={siteId,empId,employees,date:($('#rp-date').value||todayIso()),hours:parseFloat($('#rp-hours').value)||null,work:$('#rp-work').value.trim(),materials:$('#rp-mat').value.trim(),photos:repDraft.photos,status:'inviato'};
  if(id){const r=byId(S.reports,id);if(r)Object.assign(r,data);}
  else S.reports.unshift({id:repDraft.id,created:Date.now(),...data});
  repDraft=null;save();closeSheet();render();toast('✓ Rapportino salvato');
}
/* ---- RIEPILOGO CANTIERE: un unico file stampabile con tutti i rapporti,
   totale ore (uomo), materiali e foto. Da archiviare a lavoro finito. ---- */
async function siteSummary(id){
  const s=byId(S.sites,id);if(!s)return;
  const list=repForSite(id).slice().sort((a,b)=>(a.date<b.date?-1:1)); // cronologico
  toast('📄 Preparo il riepilogo…');
  const allPhotos=[];list.forEach(r=>(r.photos||[]).forEach(p=>{if(p.storagePath)allPhotos.push(p);}));
  const urls={};
  try{await Promise.all(allPhotos.map(p=>sb.storage.from('allegati').createSignedUrl(p.storagePath,3600).then(({data})=>{if(data)urls[p.storagePath]=data.signedUrl;}).catch(()=>{})));}catch(e){}
  const cli=s.clientId?byId(S.clients,s.clientId):null;const addr=cli&&typeof cAddr==='function'?cAddr(cli):'';
  const totH=repHours(list);const STAT={previsto:'Lavoro futuro',aperto:'In corso',da_fatturare:'Da fatturare',chiuso:'Archiviato'};
  const rows=list.map(r=>`<tr>
    <td class="mono">${fmtD(r.date)}</td>
    <td>${esc(repEmpNames(r)||'—')}</td>
    <td class="r mono">${r.hours?fmtQty(r.hours)+(repPeople(r).length>1?' ×'+repPeople(r).length:''):''}</td>
    <td>${esc(r.work||'')}</td>
    <td>${esc(r.materials||'')}</td>
    <td class="c">${(r.photos||[]).length||''}</td>
  </tr>`).join('')||'<tr><td colspan="6" style="color:#888">Nessun rapportino.</td></tr>';
  const photosHTML=allPhotos.length?`<h2>Foto (${allPhotos.length})</h2><div class="ph">${allPhotos.map(p=>urls[p.storagePath]?`<img src="${urls[p.storagePath]}">`:'').join('')}</div>`:'';
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Riepilogo cantiere — ${esc(s.name)}</title>
  <style>
   *{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a;margin:26px;font-size:12px}
   h1{font-size:20px;margin:0 0 4px}h2{font-size:14px;margin:22px 0 8px;border-bottom:1px solid #ccc;padding-bottom:3px}
   .meta{color:#555;margin-bottom:12px;line-height:1.5}
   .tot{background:#f3f1ea;border:1px solid #ddd;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:13px}
   table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}
   th{background:#f3f1ea;font-size:11px;text-transform:uppercase;letter-spacing:.4px}
   .r{text-align:right}.c{text-align:center}.mono{font-family:ui-monospace,Menlo,monospace;white-space:nowrap}
   .ph{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.ph img{width:100%;height:130px;object-fit:cover;border-radius:6px;border:1px solid #ddd}
   @media print{body{margin:12mm}a{color:inherit;text-decoration:none}}
  </style></head><body>
   <h1>${esc(s.name)}</h1>
   <div class="meta"><b>${esc(cName(s.clientId)||s.clientRaw||'—')}</b>${addr?' · 📍 '+esc(addr):''}${cli&&cli.phone?' · '+esc(cli.phone):''}<br>
   Stato: ${STAT[s.status]||s.status||'—'}${s.startDate?' · Inizio '+fmtD(s.startDate):''}${s.dueDate?' · Fine prevista '+fmtD(s.dueDate):''}${s.closedDate?' · Chiuso il '+fmtD(s.closedDate):''}<br>
   Riepilogo generato il ${fmtD(todayIso())}</div>
   <div class="tot"><b>${list.length}</b> rapporti · <b>${fmtQty(totH)} h</b> totali (ore-uomo)${s.estHours?' / '+fmtQty(s.estHours)+' h stimate':''} · <b>${allPhotos.length}</b> foto</div>
   <h2>Rapporti</h2>
   <table><thead><tr><th>Data</th><th>Chi</th><th>Ore/testa</th><th>Lavoro svolto</th><th>Materiali</th><th>Foto</th></tr></thead><tbody>${rows}</tbody></table>
   ${photosHTML}
   <script>window.onload=()=>setTimeout(()=>window.print(),450)<\/script>
  </body></html>`;
  const w=window.open('','_blank');
  if(!w){toast('Consenti i pop-up per aprire il riepilogo da stampare');return;}
  w.document.write(html);w.document.close();
}
function delReport(id){
  if(!confirm('Eliminare il rapportino?'))return;
  const r=byId(S.reports,id);
  if(r&&r.photos)r.photos.forEach(p=>{if(p.storagePath)sb.storage.from('allegati').remove([p.storagePath]).catch(()=>{});});
  S.reports=S.reports.filter(x=>x.id!==id);repDraft=null;save();closeSheet();render();toast('Rapportino eliminato');
}
