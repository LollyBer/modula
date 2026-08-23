/* ===== MODULO: RAPPORTINI DI CANTIERE =====
   Un rapportino = un giorno · un cantiere · un operaio (ore, lavoro, materiali, foto).
   Collegamenti: ← Cantieri (site_id), ← Personale (emp_id, ore per commessa/dipendente),
   → Notifiche/Lavagna (promemoria "da compilare oggi").
   Ruoli: il dipendente compila/vede i SUOI; il titolare vede/gestisce tutti.
   Dipende dal core (S, uid, save, render, openSheet, closeSheet, esc, toast, isOwner,
   me, eName, cName, byId, fmtD, fmtQty, todayIso, moduleActive, TENANT_ID, sb, $). */

/* ---- viste per ruolo ---- */
const repVis=()=>isOwner()?S.reports:S.reports.filter(r=>r.empId===(S.session&&S.session.empId));
const repForSite=id=>S.reports.filter(r=>r.siteId===id).sort((a,b)=>(a.date<b.date?1:-1));
const repHours=list=>list.reduce((t,r)=>t+(+r.hours||0),0);

/* ---- promemoria: cantieri aperti dove l'operaio è in squadra e manca il rapportino di OGGI ---- */
function myOpenSites(empId){return S.sites.filter(s=>s.status==='aperto'&&(s.employees||[]).includes(empId));}
function reportsToFill(empId){
  if(!moduleActive('reports')||!moduleActive('sites')||!empId)return [];
  const t=todayIso();
  return myOpenSites(empId).filter(s=>!S.reports.some(r=>r.siteId===s.id&&r.empId===empId&&r.date===t));
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
      <div class="subtle" style="font-size:11px">${r.date?fmtD(r.date):''} · 👷 ${esc(eName(r.empId)||'—')}${r.hours?' · ⏱ '+fmtQty(r.hours)+'h':''}</div></div>
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
   <div class="frow">
     ${owner?`<div class="fld"><label>Operaio</label><select id="rp-emp">${emps.map(e=>`<option value="${e.id}" ${repDraft.empId===e.id?'selected':''}>${esc(e.name)}${e.isOwner?' 👑':''}</option>`).join('')}</select></div>`:`<input type="hidden" id="rp-emp" value="${meId||''}">`}
     <div class="fld"><label>Ore</label><input id="rp-hours" type="number" inputmode="decimal" step="any" value="${repDraft.hours||''}" placeholder="es. 8"></div>
   </div>
   <div class="fld"><label>Lavoro svolto</label><textarea id="rp-work" rows="3" placeholder="Cosa è stato fatto oggi in cantiere…">${esc(repDraft.work||'')}</textarea></div>
   <div class="fld"><label>Materiali usati</label><textarea id="rp-mat" rows="2" placeholder="es. 20 m² gres, 3 sacchi colla, fuga grigia">${esc(repDraft.materials||'')}</textarea></div>
   <div class="fld"><label>📷 Foto</label>
     <div id="rp-photos" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px;margin-bottom:8px">${repDraft.photos.map(repTile).join('')}</div>
     <input type="file" id="rp-file" accept="image/*" capture="environment" style="display:none" onchange="repAddPhoto(event)">
     <button class="btn sm ghost" onclick="document.getElementById('rp-file').click()">📷 Aggiungi foto</button>
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
  const empId=$('#rp-emp')?$('#rp-emp').value:(S.session&&S.session.empId);
  if(!siteId){toast('Scegli il cantiere');return;}
  const data={siteId,empId,date:($('#rp-date').value||todayIso()),hours:parseFloat($('#rp-hours').value)||null,work:$('#rp-work').value.trim(),materials:$('#rp-mat').value.trim(),photos:repDraft.photos,status:'inviato'};
  if(id){const r=byId(S.reports,id);if(r)Object.assign(r,data);}
  else S.reports.unshift({id:repDraft.id,created:Date.now(),...data});
  repDraft=null;save();closeSheet();render();toast('✓ Rapportino salvato');
}
function delReport(id){
  if(!confirm('Eliminare il rapportino?'))return;
  const r=byId(S.reports,id);
  if(r&&r.photos)r.photos.forEach(p=>{if(p.storagePath)sb.storage.from('allegati').remove([p.storagePath]).catch(()=>{});});
  S.reports=S.reports.filter(x=>x.id!==id);repDraft=null;save();closeSheet();render();toast('Rapportino eliminato');
}
