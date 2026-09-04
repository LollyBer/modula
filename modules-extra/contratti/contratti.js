/* ================= CONTRATTI =================
   Contratti collegati ai clienti. Il titolare crea i propri MODELLI (testo con
   segnaposto tipo {cliente}, {indirizzo}…, salvati in settings.contractTemplates).
   Nuovo contratto: scegli modello + cliente → il testo si compila coi dati del
   cliente → completi ciò che manca → firma col dito (opzionale) → salva/stampa.
   Si possono anche IMPORTARE contratti già esistenti (PDF) e archiviarli.
   Dipende dal core (S, esc, save, render, openSheet, cliInput, cAddr, cTown,
   TENANT_ID, sb, isOwner, moduleActive...). */

let ctTab='attivi';
let ctDraft=null;
const CT_STAT={
  bozza:{l:'Bozza',c:'var(--t2)'},
  attivo:{l:'Attivo',c:'var(--teal)'},
  firmato:{l:'Firmato',c:'var(--cy)'},
  scaduto:{l:'Scaduto',c:'var(--coral)'},
  disdetto:{l:'Disdetto',c:'var(--t3)'},
};
const ctIt=s=>{if(!s)return'';const[y,m,d]=s.split('-');return d+'.'+m+'.'+y;};
const ctName=c=>cName(c.clientId)||c.clientRaw||'—';
function ctTemplates(){return (S.settings&&Array.isArray(S.settings.contractTemplates))?S.settings.contractTemplates:[];}

/* sostituisce i segnaposto {…} coi dati del cliente / azienda */
function ctFillBody(body,cli,extra){
  extra=extra||{};
  const map={
    cliente:cli?(cli.name||''):'',
    indirizzo:cli?cAddr(cli):'',
    telefono:cli?(cli.phone||''):'',
    email:cli?(cli.email||''):'',
    citta:cli?cTown(cli):'', paese:cli?cTown(cli):'',
    data:ctIt(todayIso()),
    azienda:(S.settings&&S.settings.companyName)||'',
    numero:extra.number||''
  };
  return String(body||'').replace(/\{(\w+)\}/g,(m,k)=>{const v=map[k.toLowerCase()];return v!==undefined?v:m;});
}

/* ---------------- LISTA ---------------- */
function renderContratti(){
  const all=S.contracts||[];
  const nAtt=all.filter(c=>c.status==='attivo'||c.status==='firmato').length;
  const nExp=all.filter(c=>c.endDate&&c.endDate<todayIso()&&c.status!=='disdetto').length;
  let list=all.slice();
  if(ctTab==='attivi')list=list.filter(c=>c.status==='attivo'||c.status==='firmato'||c.status==='bozza');
  else if(ctTab==='scaduti')list=list.filter(c=>(c.endDate&&c.endDate<todayIso())||c.status==='scaduto'||c.status==='disdetto');
  const q=norm(ctQ||'');
  if(q)list=list.filter(c=>norm([c.title,c.type,c.number,ctName(c),cTown(byId(S.clients,c.clientId)||{})].filter(Boolean).join(' ')).includes(q));
  list.sort((a,b)=>((a.created||0)<(b.created||0)?1:-1));
  const body=list.length?list.map(ctRow).join(''):`<div class="empty tall"><div class="big">📄</div>Nessun contratto qui.<button class="btn pri sm cta" onclick="newContract()">+ Nuovo contratto</button></div>`;
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:#7C5CBF"></span>Contratti <span class="subtle">(${all.length})</span></div>
  <input class="searchbar" id="ct-q" placeholder="🔍 Cerca per titolo, tipo, cliente, numero…" value="${esc(ctQ||'')}" oninput="ctSearch(this.value)">
  <div class="row" style="gap:8px;margin:2px 0 10px;flex-wrap:wrap">
    <button class="btn sm" style="border-color:#7C5CBF;color:#7C5CBF" onclick="newContract()">+ Nuovo contratto</button>
    <button class="btn sm ghost" onclick="ctImportNew()">📎 Importa PDF</button>
    ${isOwner()?`<button class="btn sm ghost" onclick="openContractTemplates()">📐 Modelli</button>`:''}
  </div>
  <div class="tabs">
    <div class="tb ${ctTab==='attivi'?'on':''}" onclick="ctTab='attivi';render()">Attivi (${nAtt})</div>
    <div class="tb ${ctTab==='scaduti'?'on':''}" onclick="ctTab='scaduti';render()">Scaduti/Chiusi (${nExp})</div>
    <div class="tb ${ctTab==='tutti'?'on':''}" onclick="ctTab='tutti';render()">Tutti</div>
  </div>
  ${body}
  <button class="fab" onclick="newContract()">+</button>`;
}
let ctQ='';
function ctSearch(v){ctQ=v;render();const e=document.getElementById('ct-q');if(e){e.focus();try{e.setSelectionRange(v.length,v.length);}catch(_){}}}
function ctRow(c){
  const st=CT_STAT[c.status]||CT_STAT.bozza;
  const exp=c.endDate&&c.endDate<todayIso();
  const meta=[c.type,c.endDate?('scad. '+ctIt(c.endDate)):''].filter(Boolean).join(' · ');
  return`<div class="item" onclick="openContract('${c.id}')">
    <span class="led" style="background:${exp?'var(--coral)':st.c}"></span>
    <div class="bd"><div class="ti">${esc(c.title||'Contratto')}${c.signature?' ✍':''}${c.storagePath?' 📎':''}</div>
    <div class="su">${esc(ctName(c))}${meta?' · '+esc(meta):''}</div>
    <div class="mt">${c.number?'N° '+esc(c.number)+' · ':''}${c.created?ctIt(new Date(c.created).toISOString().slice(0,10)):''}</div></div>
    <div class="right"><span class="badge" style="border-color:${exp?'var(--coral)':st.c};color:${exp?'var(--coral)':st.c}">${exp?'Scaduto':st.l}</span></div></div>`;
}

/* ---------------- NUOVO / MODIFICA ---------------- */
function newContract(prefClientId){
  ctDraft={id:uid(),clientId:prefClientId||null,clientRaw:null,type:'',title:'',number:ctNextNumber(),body:'',startDate:todayIso(),endDate:'',amount:null,status:'bozza',signature:null,signedName:'',signedDate:'',fileName:'',storagePath:'',mime:'',templateId:'',via:'manuale',created:Date.now(),_new:true};
  openContract(null);
}
function ctNextNumber(){
  const yr=new Date().getFullYear();const n=(S.contracts||[]).filter(c=>c.number&&c.number.indexOf(yr+'-')===0).length+1;
  return yr+'-'+String(n).padStart(3,'0');
}
function openContract(id){
  const c=id?byId(S.contracts,id):ctDraft;
  if(!c)return;
  ctDraft=id?{...c}:c;
  const tpls=ctTemplates();
  const tplOpts=`<option value="">— nessun modello (testo libero) —</option>`+tpls.map(t=>`<option value="${t.id}" ${ctDraft.templateId===t.id?'selected':''}>${esc(t.name)}${t.type?' ('+esc(t.type)+')':''}</option>`).join('');
  openSheet(`<h3>${id?'Contratto':'Nuovo contratto'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="frow"><div class="fld"><label>Modello</label><select id="ct-tpl" onchange="ctPickTemplate()">${tplOpts}</select></div>
  <div class="fld"><label>Tipo</label><input id="ct-type" value="${esc(ctDraft.type||'')}" placeholder="es. Manutenzione" list="ct-typelist"><datalist id="ct-typelist">${[...new Set(tpls.map(t=>t.type).concat((S.contracts||[]).map(x=>x.type)).filter(Boolean))].map(t=>`<option value="${esc(t)}">`).join('')}</datalist></div></div>
  <div class="fld"><label>Cliente</label>${cliInput('ct-cl',ctDraft.clientId,'ct-clprev')}<div id="ct-clprev">${clientPreviewHTML(ctDraft.clientId)}</div></div>
  <div class="fld"><label>Titolo / oggetto</label><input id="ct-title" value="${esc(ctDraft.title||'')}" placeholder="es. Contratto di manutenzione annuale"></div>
  <div class="frow"><div class="fld"><label>Numero</label><input id="ct-num" value="${esc(ctDraft.number||'')}"></div>
  <div class="fld"><label>Importo / canone (CHF)</label><input id="ct-amount" type="number" inputmode="decimal" step="any" value="${ctDraft.amount!=null?ctDraft.amount:''}" placeholder="opz."></div></div>
  <div class="frow"><div class="fld"><label>Inizio</label><input id="ct-start" type="date" value="${ctDraft.startDate||''}"></div>
  <div class="fld"><label>Scadenza</label><input id="ct-end" type="date" value="${ctDraft.endDate||''}"></div></div>
  <div class="fld"><label>Stato</label><div class="seg" id="ct-status" style="flex-wrap:wrap;gap:7px">${Object.keys(CT_STAT).map(k=>`<div class="sg ${ctDraft.status===k?'on':''}" data-s="${k}" onclick="this.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));this.classList.add('on')">${CT_STAT[k].l}</div>`).join('')}</div></div>
  <div class="fld"><label>Testo del contratto <span class="subtle">— «↻ Compila» inserisce i dati del cliente</span></label>
    <div class="row" style="gap:8px;margin-bottom:6px;flex-wrap:wrap"><button class="btn sm ghost" onclick="ctCompile()">↻ Compila dal modello + cliente</button></div>
    <textarea id="ct-body" rows="9" style="font-family:var(--mono);font-size:12px;line-height:1.5" placeholder="Il testo del contratto (puoi partire da un modello o scriverlo qui).">${esc(ctDraft.body||'')}</textarea></div>
  <div class="fld"><label>📎 PDF del contratto (facolt., per importare un contratto già firmato)</label>
    <div id="ct-file">${ctFileHTML()}</div>
    <input type="file" id="ct-fileinput" accept="application/pdf,.pdf,image/*" style="display:none" onchange="ctAddFile(event)">
    <button class="btn sm ghost" onclick="document.getElementById('ct-fileinput').click()">📎 ${ctDraft.storagePath?'Sostituisci PDF':'Carica PDF'}</button></div>
  <div class="fld"><label>✍ Firma del cliente <span class="subtle">(facolt. — puoi anche stampare e far firmare a mano)</span></label>
    <div class="sig-wrap"><canvas class="sig-canvas" id="ct-sig"></canvas><div class="sig-hint" id="ct-sighint">firma qui con il dito</div></div>
    <div class="sig-tools"><input id="ct-signame" value="${esc(ctDraft.signedName||'')}" placeholder="Nome di chi firma" style="background:var(--bg2);border:1px solid var(--line);border-radius:9px;color:var(--t1);font-size:12.5px;padding:7px 10px;outline:none;flex:1;margin-right:8px"><button class="btn sm ghost" onclick="ctSigClear()">Cancella firma</button></div></div>
  <div class="actions" style="flex-wrap:wrap">
    ${id?`<button class="btn danger" onclick="delContract('${id}')">Elimina</button>`:''}
    <button class="btn" style="border-color:var(--blue);color:var(--blue)" onclick="ctPrint()">🖨 Stampa / PDF</button>
    <button class="btn pri" onclick="saveContract()">Salva</button></div>`);
  setTimeout(ctSigInit,60);
  if(ctDraft.storagePath)ctLoadFileUrl();
}
function ctReadForm(){
  if(!ctDraft)return;
  ctDraft.templateId=$('#ct-tpl')?$('#ct-tpl').value:ctDraft.templateId;
  ctDraft.type=$('#ct-type').value.trim();
  ctDraft.clientId=$('#ct-cl').value||null;
  ctDraft.clientRaw=(!ctDraft.clientId&&$('#ct-cl').dataset&&$('#ct-cl').dataset.raw)||null;
  ctDraft.title=$('#ct-title').value.trim();
  ctDraft.number=$('#ct-num').value.trim();
  ctDraft.amount=num($('#ct-amount').value);
  ctDraft.startDate=$('#ct-start').value||null;
  ctDraft.endDate=$('#ct-end').value||'';
  ctDraft.status=$('#ct-status .sg.on')?.dataset.s||'bozza';
  ctDraft.body=$('#ct-body').value;
  ctDraft.signedName=$('#ct-signame').value.trim();
}
function ctPickTemplate(){
  const tid=$('#ct-tpl').value;const t=ctTemplates().find(x=>x.id===tid);
  if(t&&t.type&&!$('#ct-type').value.trim())$('#ct-type').value=t.type;
  ctDraft.templateId=tid;
  // se il testo è vuoto, compila subito dal modello
  if(t&&!$('#ct-body').value.trim())ctCompile();
}
function ctCompile(){
  ctReadForm();
  const t=ctTemplates().find(x=>x.id===ctDraft.templateId);
  const src=t?t.body:(ctDraft.body||'');
  const cli=ctDraft.clientId?byId(S.clients,ctDraft.clientId):null;
  const filled=ctFillBody(src,cli,{number:ctDraft.number});
  $('#ct-body').value=filled;ctDraft.body=filled;
  toast('↻ Testo compilato coi dati del cliente');
}
function saveContract(){
  ctReadForm();
  if(!ctDraft.title&&!ctDraft.clientId&&!ctDraft.clientRaw&&!ctDraft.storagePath){toast('Scrivi almeno titolo o cliente');return;}
  if(ctDraft.signature&&ctDraft.status==='bozza')ctDraft.status='firmato';
  const ex=byId(S.contracts,ctDraft.id);
  if(ex)Object.assign(ex,ctDraft); else S.contracts.unshift({...ctDraft});
  save();closeSheet();render();toast('📄 Contratto salvato');
}
function delContract(id){if(!confirm('Eliminare il contratto?'))return;const c=byId(S.contracts,id);if(c&&c.storagePath&&window.sb)sb.storage.from('allegati').remove([c.storagePath]).catch(()=>{});S.contracts=S.contracts.filter(x=>x.id!==id);save();closeSheet();render();toast('Eliminato');}

/* ---------------- FIRMA ---------------- */
function ctSigInit(){
  const c=$('#ct-sig');if(!c)return;
  const dpr=window.devicePixelRatio||1;const w=c.offsetWidth,h=c.offsetHeight;
  c.width=w*dpr;c.height=h*dpr;const ctx=c.getContext('2d');ctx.scale(dpr,dpr);
  ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#16243a';ctx.lineWidth=2.2;ctx.lineCap='round';ctx.lineJoin='round';
  if(ctDraft&&ctDraft.signature){const img=new Image();img.onload=()=>ctx.drawImage(img,0,0,w,h);img.src=ctDraft.signature;$('#ct-sighint').style.display='none';}
  let down=false,lx=0,ly=0;const pos=e=>{const r=c.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];};
  c.addEventListener('pointerdown',e=>{e.preventDefault();down=true;[lx,ly]=pos(e);$('#ct-sighint').style.display='none';c.setPointerCapture(e.pointerId);});
  c.addEventListener('pointermove',e=>{if(!down)return;e.preventDefault();const[x,y]=pos(e);ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(x,y);ctx.stroke();lx=x;ly=y;});
  const up=()=>{if(down){down=false;ctDraft.signature=c.toDataURL('image/png');}};
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
}
function ctSigClear(){if(ctDraft)ctDraft.signature=null;const c=$('#ct-sig');if(!c)return;const dpr=window.devicePixelRatio||1;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width/dpr,c.height/dpr);$('#ct-sighint').style.display='flex';}

/* ---------------- PDF ALLEGATO (import) ---------------- */
const ctFileUrl={};
function ctFileHTML(){
  if(!ctDraft||!ctDraft.storagePath)return '<div class="subtle" style="padding:2px 0">Nessun file allegato.</div>';
  const u=ctFileUrl[ctDraft.storagePath];
  return `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--line);border-radius:9px;background:var(--bg2)"><span style="font-size:20px">📄</span><div style="flex:1;min-width:0"><div style="font-size:12.5px;color:var(--t1)">${esc(ctDraft.fileName||'contratto.pdf')}</div></div>${u?`<a href="${u}" target="_blank" rel="noopener" class="btn sm ghost" style="text-decoration:none">Apri</a>`:'<span class="subtle">…</span>'}</div>`;
}
function ctLoadFileUrl(){
  if(!ctDraft||!ctDraft.storagePath||ctFileUrl[ctDraft.storagePath]||!window.sb)return;
  sb.storage.from('allegati').createSignedUrl(ctDraft.storagePath,3600).then(({data})=>{if(data){ctFileUrl[ctDraft.storagePath]=data.signedUrl;const el=$('#ct-file');if(el)el.innerHTML=ctFileHTML();}}).catch(()=>{});
}
async function ctAddFile(ev){
  const f=ev.target.files&&ev.target.files[0];ev.target.value='';if(!f||!ctDraft)return;
  if(!window.sb){toast('📎 I file si salvano con l\'account online');return;}
  if(f.size>25*1024*1024){toast('⚠ File oltre 25MB');return;}
  toast('📤 Carico…');
  try{
    const path=TENANT_ID+'/contract/'+ctDraft.id+'/'+uid()+'-'+f.name;
    const{error}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'application/pdf'});
    if(error)throw error;
    ctDraft.storagePath=path;ctDraft.fileName=f.name;ctDraft.mime=f.type||'application/pdf';
    ctFileUrl[path]=null;const el=$('#ct-file');if(el)el.innerHTML=ctFileHTML();ctLoadFileUrl();
    toast('📎 Allegato caricato');
  }catch(e){toast('⚠ '+(e.message||e));}
}
function ctImportNew(){
  newContract();
  ctDraft.title='Contratto importato';ctDraft.status='firmato';
  openContract(null);
  setTimeout(()=>{const b=document.getElementById('ct-fileinput');if(b)b.click();},200);
}

/* ---------------- STAMPA ---------------- */
function ctPrint(){
  ctReadForm();
  const c=ctDraft;const cli=c.clientId?byId(S.clients,c.clientId):null;
  const az=(S.settings&&S.settings.companyName)||'';
  const bodyHtml=esc(c.body||'').replace(/\n/g,'<br>');
  const w=window.open('','_blank');if(!w){toast('Consenti i popup per stampare');return;}
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(c.title||'Contratto')} — ${esc(ctName(c))}</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:800px;margin:24px auto;padding:0 24px;line-height:1.55;font-size:13px}
  h1{font-size:19px;margin:0 0 2px}.muted{color:#666;font-size:12px}.hr{border-top:1px solid #ccc;margin:14px 0}
  .body{white-space:normal;margin:12px 0}.sig{margin-top:40px;display:flex;justify-content:space-between;gap:30px}
  .sigbox{flex:1}.sigline{border-top:1px solid #333;margin-top:46px;padding-top:4px;font-size:12px;color:#333}
  img.sig{max-height:70px}</style></head><body>
  ${az?`<div style="font-weight:700;font-size:15px">${esc(az)}</div>`:''}
  <h1>${esc(c.title||'Contratto')}</h1>
  <div class="muted">${c.number?'N° '+esc(c.number)+' · ':''}${c.type?esc(c.type)+' · ':''}${c.startDate?'dal '+ctIt(c.startDate):''}${c.endDate?' al '+ctIt(c.endDate):''}${c.amount?' · CHF '+c.amount:''}</div>
  <div class="muted">Cliente: <b>${esc(ctName(c))}</b>${cli&&cAddr(cli)?' — '+esc(cAddr(cli)):''}${cli&&cli.phone?' — '+esc(cli.phone):''}</div>
  <div class="hr"></div>
  <div class="body">${bodyHtml||'<i>(nessun testo)</i>'}</div>
  <div class="sig">
    <div class="sigbox"><div class="sigline">L'azienda${az?' — '+esc(az):''}</div></div>
    <div class="sigbox">${c.signature?`<img class="sig" src="${c.signature}"><div class="sigline">Il cliente — ${esc(c.signedName||ctName(c))}</div>`:`<div class="sigline">Il cliente — ${esc(ctName(c))}</div>`}</div>
  </div>
  <script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>`);
  w.document.close();
}

/* ---------------- MODELLI (solo titolare) ---------------- */
function openContractTemplates(){
  const tpls=ctTemplates();
  openSheet(`<h3>📐 Modelli di contratto <span class="x" onclick="closeSheet();render()">✕</span></h3>
  <div class="subtle" style="margin-bottom:10px">Crea qui i tuoi modelli: scrivi il testo del contratto usando i segnaposto — <b>{cliente}</b>, <b>{indirizzo}</b>, <b>{telefono}</b>, <b>{email}</b>, <b>{citta}</b>, <b>{data}</b>, <b>{azienda}</b>, <b>{numero}</b> — verranno riempiti coi dati del cliente quando fai un nuovo contratto.</div>
  ${tpls.length?tpls.map(t=>`<div class="item" onclick="editContractTemplate('${t.id}')"><div class="bd"><div class="ti">${esc(t.name)}</div><div class="su">${t.type?esc(t.type)+' · ':''}${esc((t.body||'').slice(0,60))}…</div></div><div class="right">›</div></div>`).join(''):'<div class="subtle">Nessun modello ancora.</div>'}
  <div class="actions"><button class="btn pri" onclick="editContractTemplate(null)">+ Nuovo modello</button></div>`);
}
function editContractTemplate(id){
  const t=id?ctTemplates().find(x=>x.id===id):{id:uid(),name:'',type:'',body:''};
  openSheet(`<h3>${id?'Modello':'Nuovo modello'} <span class="x" onclick="openContractTemplates()">✕</span></h3>
  <div class="frow"><div class="fld"><label>Nome modello</label><input id="tpl-name" value="${esc(t.name||'')}" placeholder="es. Manutenzione annuale"></div>
  <div class="fld"><label>Tipo</label><input id="tpl-type" value="${esc(t.type||'')}" placeholder="es. Manutenzione"></div></div>
  <div class="fld"><label>Testo del contratto (con segnaposto {cliente}…)</label><textarea id="tpl-body" rows="12" style="font-family:var(--mono);font-size:12px;line-height:1.5" placeholder="Tra {azienda} e {cliente}, con sede in {indirizzo}, si conviene quanto segue…">${esc(t.body||'')}</textarea></div>
  <div class="actions">${id?`<button class="btn danger" onclick="delContractTemplate('${id}')">Elimina</button>`:''}<button class="btn pri" onclick="saveContractTemplate('${t.id}')">Salva modello</button></div>`);
}
function saveContractTemplate(id){
  const name=$('#tpl-name').value.trim();if(!name){toast('Dai un nome al modello');return;}
  const data={id,name,type:$('#tpl-type').value.trim(),body:$('#tpl-body').value};
  if(!Array.isArray(S.settings.contractTemplates))S.settings.contractTemplates=[];
  const ex=S.settings.contractTemplates.find(x=>x.id===id);
  if(ex)Object.assign(ex,data);else S.settings.contractTemplates.push(data);
  save();openContractTemplates();toast('📐 Modello salvato');
}
function delContractTemplate(id){if(!confirm('Eliminare il modello?'))return;S.settings.contractTemplates=(S.settings.contractTemplates||[]).filter(x=>x.id!==id);save();openContractTemplates();toast('Eliminato');}
