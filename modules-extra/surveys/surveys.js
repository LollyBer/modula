/* ================= SOPRALLUOGHI =================
   Registro dei sopralluoghi (visite di valutazione prima del lavoro/preventivo),
   con foto sul posto e pipeline commerciale. Dipende dal core (S, esc, save, render,
   openSheet, cliInput, empSeg, TENANT_ID, sb, moduleActive, isOwner, can...).
   Un sopralluogo può essere per un CLIENTE dell'anagrafica o per un POTENZIALE
   cliente (nome/telefono liberi). Da "vinto" → si trasforma in cantiere (e se è un
   potenziale cliente, chiede prima di aggiungerlo all'anagrafica). */

let svTab='aperti';
const SV_STAT={
  da_valutare:{l:'Da valutare',c:'var(--t2)',ic:'🔍'},
  da_preventivare:{l:'Da preventivare',c:'var(--amber)',ic:'📝'},
  preventivo_inviato:{l:'Preventivo inviato',c:'var(--blue)',ic:'📤'},
  vinto:{l:'Vinto',c:'var(--teal)',ic:'✅'},
  perso:{l:'Perso',c:'var(--coral)',ic:'✗'},
};
const SV_OPEN=['da_valutare','da_preventivare','preventivo_inviato'];
const svName=s=>cName(s.clientId)||s.clientRaw||'—';

function renderSurveys(){
  const t=todayIso();
  const all=visSurveys();
  const nOpen=all.filter(s=>SV_OPEN.includes(s.status)).length;
  const nWon=all.filter(s=>s.status==='vinto').length;
  const val=all.filter(s=>SV_OPEN.includes(s.status)).reduce((a,s)=>a+(+s.value||0),0);
  const byDate=(a,b)=>((a.date||'')>(b.date||'')?-1:1);
  let list=all.slice();
  if(svTab==='aperti')list=list.filter(s=>SV_OPEN.includes(s.status));
  else if(svTab==='vinti')list=list.filter(s=>s.status==='vinto');
  else if(svTab==='persi')list=list.filter(s=>s.status==='perso');
  list.sort(byDate);
  let body;
  if(svTab==='aperti'){
    body=SV_OPEN.map(st=>{
      const g=list.filter(s=>s.status===st);
      if(!g.length)return'';
      return`<div class="grp" style="color:${SV_STAT[st].c}">${SV_STAT[st].ic} ${SV_STAT[st].l.toUpperCase()} (${g.length})</div>`+g.map(svRow).join('');
    }).join('')||'<div class="empty tall"><div class="big">🔍</div>Nessun sopralluogo aperto.<button class="btn pri sm cta" onclick="openSurvey(null)">+ Nuovo sopralluogo</button></div>';
  }else{
    body=list.length?list.map(svRow).join(''):`<div class="empty"><div class="big">🔍</div>Nessun sopralluogo qui.</div>`;
  }
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Sopralluoghi <span class="subtle">(${all.length})</span></div>
  <div class="tabs">
    <div class="tb ${svTab==='aperti'?'on':''}" onclick="svTab='aperti';render()">Aperti (${nOpen})</div>
    <div class="tb ${svTab==='vinti'?'on':''}" onclick="svTab='vinti';render()">Vinti (${nWon})</div>
    <div class="tb ${svTab==='persi'?'on':''}" onclick="svTab='persi';render()">Persi</div>
    <div class="tb ${svTab==='tutti'?'on':''}" onclick="svTab='tutti';render()">Tutti</div>
  </div>
  <div class="kpis" style="grid-template-columns:repeat(3,1fr)">
    <div class="kpi"><div class="n" style="color:var(--amber)">${nOpen}</div><div class="l">In corso</div></div>
    <div class="kpi"><div class="n" style="color:var(--teal)">${nWon}</div><div class="l">Vinti</div></div>
    <div class="kpi"><div class="n" style="color:var(--cy);font-size:17px">${fmtQty(val)}</div><div class="l">CHF potenziali</div></div>
  </div>
  ${body}
  <button class="fab" onclick="openSurvey(null)">+</button>`;
}
function svRow(s){
  const st=SV_STAT[s.status]||SV_STAT.da_valutare;
  const np=s.photos&&s.photos.length?` · 📷${s.photos.length}`:'';
  const nx=(SV_OPEN.includes(s.status)&&s.nextDate)?` · ⏰ ${fmtD(s.nextDate)}`:'';
  const linked=s.siteId?' · 🏗 cantiere':'';
  return`<div class="item" onclick="openSurvey('${s.id}')">
    <span class="led" style="background:${st.c}"></span>
    <div class="bd"><div class="ti">${esc(s.title||'Sopralluogo')}${s.value?` · <span style="color:var(--cy)">CHF ${fmtQty(s.value)}</span>`:''}</div>
    <div class="su">${esc(svName(s))}${s.place?' · 📍 '+esc(s.place):''}</div>
    <div class="mt">${s.date?fmtD(s.date):'senza data'}${np}${nx}${linked}</div></div>
    <div class="right"><span class="badge" style="border-color:${st.c};color:${st.c}">${st.l}</span></div></div>`;
}

function openSurvey(id){
  const s=id?byId(S.surveys,id):{title:'',clientId:null,clientRaw:'',clientPhone:'',place:'',date:todayIso(),employees:S.session?[S.session.empId]:[],notes:'',measures:'',status:'da_valutare',value:null,nextDate:'',nextNote:'',photos:[],siteId:null};
  const stSeg=Object.keys(SV_STAT).map(k=>`<div class="sg ${s.status===k?'on':''}" data-s="${k}" onclick="this.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));this.classList.add('on')">${SV_STAT[k].l}</div>`).join('');
  openSheet(`<h3>${id?'Sopralluogo':'Nuovo sopralluogo'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Oggetto</label><input id="sv-t" value="${esc(s.title||'')}" placeholder="es. Ristrutturazione bagno"></div>
  <div class="fld"><label>Cliente <span class="subtle">(o potenziale — scrivi il nome a mano)</span></label>${cliInput('sv-c',s.clientId,'sv-cprev')}<div id="sv-cprev">${clientPreviewHTML(s.clientId)}</div></div>
  ${!s.clientId?`<div class="fld"><label>Telefono <span class="subtle">(se potenziale cliente)</span></label><input id="sv-cph" value="${esc(s.clientPhone||'')}" placeholder="es. 079 123 45 67" inputmode="tel"></div>`:`<input type="hidden" id="sv-cph" value="${esc(s.clientPhone||'')}">`}
  <div class="fld"><label>Luogo / indirizzo</label><input id="sv-place" value="${esc(s.place||'')}" placeholder="Via, paese"></div>
  <div class="frow"><div class="fld"><label>Data sopralluogo</label><input id="sv-d" type="date" value="${s.date||''}"></div>
  <div class="fld"><label>Valore stimato CHF</label><input id="sv-val" type="number" inputmode="decimal" step="any" value="${s.value!=null?s.value:''}" placeholder="opz."></div></div>
  ${dateChips('sv-d')}
  <div class="fld"><label>Fatto da</label>${empSeg('sv-e',empIdsOf(s))}</div>
  <div class="fld"><label>Stato</label><div class="seg" id="sv-s" style="flex-wrap:wrap;gap:7px">${stSeg}</div></div>
  <div class="fld"><label>Misure / quantità</label><textarea id="sv-meas" rows="2" placeholder="es. 20 m² pavimento, 3 finestre, altezza 2,7 m">${esc(s.measures||'')}</textarea></div>
  <div class="fld"><label>Note</label><textarea id="sv-n" rows="3" placeholder="Cosa c'è da fare, criticità, materiali…">${esc(s.notes||'')}</textarea></div>
  <div class="frow"><div class="fld"><label>Prossimo passo</label><input id="sv-nn" value="${esc(s.nextNote||'')}" placeholder="es. Richiamare / inviare preventivo"></div>
  <div class="fld"><label>Promemoria il</label><input id="sv-nd" type="date" value="${s.nextDate||''}"></div></div>
  ${id?svPhotosSection(s):'<div class="subtle" style="margin:-2px 0 10px">📷 Salva il sopralluogo per allegare le foto.</div>'}
  ${id&&moduleActive('sites')&&!s.siteId?`<button class="btn pri" style="width:100%;margin-bottom:10px" onclick="surveyToSite('${id}')">🏗 Trasforma in cantiere</button>`:''}
  ${id&&s.siteId?`<button class="btn" style="width:100%;margin-bottom:10px;border-color:var(--blue);color:var(--blue)" onclick="closeSheet();openSite('${s.siteId}')">🏗 Apri il cantiere collegato</button>`:''}
  ${s.place&&moduleActive('zone')?`<button class="btn" style="width:100%;margin-bottom:10px;border-color:var(--blue);color:var(--blue)" onclick="zoneFromSheet('sv-c')">📍 Vedi sulla mappa</button>`:''}
  <div class="actions">
    ${id?`<button class="btn danger" onclick="delItem('surveys','${id}')">Elimina</button>`:''}
    <button class="btn pri" onclick="saveSurvey('${id||''}')">Salva</button></div>`);
  if(id)svLoadUrls(id);
}
function saveSurvey(id){
  const cid=$('#sv-c').value||null;
  const raw=(!cid&&$('#sv-c').dataset&&$('#sv-c').dataset.raw)||null;
  const data={
    title:$('#sv-t').value.trim(),
    clientId:cid,clientRaw:raw,clientPhone:($('#sv-cph')?.value||'').trim(),
    place:$('#sv-place').value.trim(),
    date:$('#sv-d').value||null,
    value:num($('#sv-val').value),
    employees:empSegRead('sv-e'),
    status:$('#sv-s .sg.on')?.dataset.s||'da_valutare',
    measures:$('#sv-meas').value.trim(),
    notes:$('#sv-n').value.trim(),
    nextNote:$('#sv-nn').value.trim(),
    nextDate:$('#sv-nd').value||'',
  };
  if(!data.title&&!data.clientId&&!raw){toast('Scrivi almeno oggetto o cliente');return;}
  if(id){Object.assign(byId(S.surveys,id),data);}
  else{S.surveys.unshift({id:uid(),via:'manuale',created:Date.now(),photos:[],siteId:null,...data});}
  save();closeSheet();render();toast('🔍 Sopralluogo salvato');
}

/* --- trasforma un sopralluogo in cantiere (crea prima il cliente se è un potenziale) --- */
function surveyToSite(id){
  const s=byId(S.surveys,id);if(!s)return;
  if(!moduleActive('sites')){toast('Attiva il modulo Cantieri');return;}
  let clientId=s.clientId;
  if(!clientId){
    const nm=(s.clientRaw||'').trim();
    if(nm&&confirm(`«${nm}» non è in anagrafica. Vuoi aggiungerlo ai clienti?`)){
      clientId=uid();
      S.clients.unshift({id:clientId,created:Date.now(),name:nm,phone:s.clientPhone||'',address:s.place||'',notes:'Da sopralluogo del '+fmtD(s.date||todayIso())});
      s.clientId=clientId;s.clientRaw='';
    }
  }
  const notes=[s.notes,s.measures?('Misure: '+s.measures):''].filter(Boolean).join('\n');
  const sid=uid();
  S.sites.unshift({id:sid,name:s.title||('Cantiere '+svName(s)),clientId:clientId||null,clientRaw:clientId?null:(s.clientRaw||null),status:'previsto',employees:s.employees||[],estHours:null,amount:s.value||null,startDate:null,dueDate:null,closedDate:null,notes,via:'sopralluogo',log:[],attachments:[],created:Date.now()});
  s.siteId=sid;s.status='vinto';
  save();closeSheet();render();
  if(typeof openSite==='function')openSite(sid);
  toast('🏗 Cantiere creato dal sopralluogo');
}

/* ================= FOTO SOPRALLUOGO (stesso schema dei rapportini) ================= */
const svUrls={};
function svPhotosSection(s){
  const ps=s.photos||[];
  return `<div class="fld"><label>📷 Foto (${ps.length})</label>
    <div id="sv-photos" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px;margin-bottom:8px">${ps.map(svTile).join('')}</div>
    <input type="file" id="sv-cam" accept="image/*" capture="environment" style="display:none" onchange="svAddPhoto('${s.id}',event)">
    <input type="file" id="sv-gal" accept="image/*" style="display:none" onchange="svAddPhoto('${s.id}',event)">
    <div class="row" style="gap:8px">
      <button class="btn sm ghost" onclick="document.getElementById('sv-cam').click()">📷 Scatta</button>
      <button class="btn sm ghost" onclick="document.getElementById('sv-gal').click()">🖼 Galleria</button>
    </div></div>`;
}
function svTile(p){
  const u=svUrls[p.storagePath];
  return `<div style="position:relative;aspect-ratio:1;border-radius:9px;overflow:hidden;background:var(--bg3)">${u?`<img src="${u}" style="width:100%;height:100%;object-fit:cover">`:'<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:20px">📷</div>'}<button onclick="svDelPhoto('${p.id}')" style="position:absolute;top:2px;right:2px;background:var(--coral);color:#fff;border:0;border-radius:6px;width:20px;height:20px;font-size:11px;cursor:pointer;line-height:1">✕</button></div>`;
}
function svRefreshPhotos(id){const el=$('#sv-photos');const s=byId(S.surveys,id);if(el&&s)el.innerHTML=(s.photos||[]).map(svTile).join('');}
async function svLoadUrls(id){
  const s=byId(S.surveys,id);if(!s)return;
  const miss=(s.photos||[]).filter(p=>p.storagePath&&!svUrls[p.storagePath]);
  if(!miss.length)return;
  await Promise.all(miss.map(p=>sb.storage.from('allegati').createSignedUrl(p.storagePath,3600).then(({data})=>{if(data)svUrls[p.storagePath]=data.signedUrl;}).catch(()=>{})));
  svRefreshPhotos(id);
}
async function svAddPhoto(id,ev){
  const f=ev.target.files&&ev.target.files[0]; ev.target.value=''; if(!f)return;
  if(!window.sb){toast('📷 Le foto si salvano con l\'account online');return;}
  const s=byId(S.surveys,id);if(!s)return;
  if(!s.photos)s.photos=[];
  toast('📤 Carico foto…');
  const img=new Image();const r=new FileReader();
  r.onload=()=>{img.onload=()=>{
    const max=1280;let w=img.width,h=img.height;
    if(w>max||h>max){const k=max/Math.max(w,h);w=Math.round(w*k);h=Math.round(h*k);}
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;
    cv.getContext('2d').drawImage(img,0,0,w,h);
    cv.toBlob(async blob=>{
      try{
        const path=TENANT_ID+'/survey/'+id+'/'+uid()+'.jpg';
        const{error}=await sb.storage.from('allegati').upload(path,blob,{contentType:'image/jpeg'});
        if(error)throw error;
        s.photos.push({id:uid(),name:'foto-'+todayIso()+'.jpg',storagePath:path});
        const{data}=await sb.storage.from('allegati').createSignedUrl(path,3600);if(data)svUrls[path]=data.signedUrl;
        save();svRefreshPhotos(id);toast('📷 Foto caricata ('+Math.round(blob.size/1024)+'KB)');
      }catch(e){toast('⚠ Foto: '+(e.message||e));}
    },'image/jpeg',.72);
  };img.src=r.result;};
  r.readAsDataURL(f);
}
function svDelPhoto(pid){
  const s=S.surveys.find(x=>(x.photos||[]).some(p=>p.id===pid));if(!s)return;
  const p=s.photos.find(x=>x.id===pid);
  if(p&&p.storagePath&&window.sb)sb.storage.from('allegati').remove([p.storagePath]).catch(()=>{});
  s.photos=s.photos.filter(x=>x.id!==pid);
  save();svRefreshPhotos(s.id);toast('Foto rimossa');
}

/* auto-registrazione come destinazione "Trasforma in" del calendario (vedi core.js) */
if(typeof registerEventTarget==='function')registerEventTarget({
  id:'survey', module:'surveys', order:20, label:'🔍 Sopralluogo', name:'sopralluogo',
  make:base=>{const id=uid();S.surveys.unshift({id,title:base.title||'Sopralluogo',clientId:base.clientId||null,clientRaw:base.clientId?null:(base.clientRaw||null),clientPhone:'',place:base.place||'',date:base.date||null,employees:base.employees||[],status:'da_valutare',value:null,measures:'',notes:'',nextNote:'',nextDate:'',photos:[],siteId:null,via:'calendario',created:Date.now()});return id;},
  open:id=>{if(typeof openSurvey==='function')openSurvey(id);}
});
