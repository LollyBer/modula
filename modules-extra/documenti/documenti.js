/* ===== MODULO: DOCUMENTI — archivio documenti/fatture fornitori (SENZA IA) =====
   Carichi un file (PDF/foto), compili i dati (tipo, fornitore, importo, scadenza),
   ritrovi tutto con ricerca/filtri; vista "Da pagare" per le scadenze; totali per fornitore.
   File nello Storage (bucket allegati, <tenant>/doc/<id>/...). Nessuna dipendenza esterna.
   Dipende dal core (S, uid, save, render, openSheet, closeSheet, esc, toast, byId, fmtD,
   todayIso, moduleActive, norm, TENANT_ID, sb, $). */

const DOC_TIPI=[['fattura','🧾 Fattura'],['ddt','📦 DDT / Bolla'],['contratto','📝 Contratto'],['spesa','💸 Spesa / Ricevuta'],['preventivo','📄 Preventivo'],['altro','📁 Altro']];
const DOC_TIPO_LABEL=k=>{const t=DOC_TIPI.find(x=>x[0]===k);return t?t[1]:'📁 '+(k||'');};
const docChf=n=>(n!=null&&n!=='')?'CHF '+(Math.round((+n||0)*100)/100).toLocaleString('de-CH',{minimumFractionDigits:2,maximumFractionDigits:2}):'';

let docTab='tutti', docQ='';
function renderDocumenti(){
  const q=norm(docQ);
  const t=todayIso();
  const daPagare=S.documents.filter(d=>d.payStatus==='da_pagare');
  const daPagareTot=daPagare.reduce((s,d)=>s+(+d.amount||0),0);
  const scadute=daPagare.filter(d=>d.dueDate&&d.dueDate<t).length;
  let list=(docTab==='dapagare'?daPagare:S.documents).filter(d=>!q||norm((d.fornitore||'')+' '+(d.number||'')+' '+(d.category||'')+' '+(d.description||'')+' '+DOC_TIPO_LABEL(d.tipo)).includes(q));
  const tabs=[['tutti','Tutti'],['dapagare','Da pagare'],['fornitori','Fornitori']];
  let body;
  if(docTab==='fornitori') body=docFornitori();
  else{
    const sorted=[...list].sort((a,b)=>docTab==='dapagare'?((a.dueDate||'9999')<(b.dueDate||'9999')?-1:1):((a.date||'')<(b.date||'')?1:-1));
    body=sorted.length?sorted.map(docRow).join(''):'<div class="card"><div class="empty"><div class="big">📁</div>Nessun documento.<br><span class="subtle">Carica fatture fornitori, DDT, contratti…</span></div></div>';
  }
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>📁 Documenti</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:4px 0 10px">
    <div class="stat"><div class="subtle" style="font-size:11px">Da pagare${scadute?` · <span style="color:var(--coral)">${scadute} scaduti</span>`:''}</div><div style="font-size:18px;font-weight:700;color:var(--amber)">${docChf(daPagareTot)||'CHF 0.00'}</div></div>
    <div class="stat"><div class="subtle" style="font-size:11px">Documenti</div><div style="font-size:18px;font-weight:700">${S.documents.length}</div></div>
  </div>
  <input class="searchbar" id="doc-q" placeholder="🔍 Cerca fornitore, numero, categoria…" value="${esc(docQ)}" oninput="docSearchInput(this.value)">
  <button class="btn pri" style="width:100%;margin:2px 0 10px" onclick="openDocument()">+ Nuovo documento</button>
  <div class="tabs">${tabs.map(([id,l])=>`<div class="tb ${docTab===id?'on':''}" onclick="docTab='${id}';render()">${l}</div>`).join('')}</div>
  ${body}`;
}
function docSearchInput(v){docQ=v;render();const e=document.getElementById('doc-q');if(e){e.focus();try{e.setSelectionRange(v.length,v.length);}catch(_){}}}
function docRow(d){
  const t=todayIso(); const overdue=d.payStatus==='da_pagare'&&d.dueDate&&d.dueDate<t; const paid=d.payStatus==='pagato';
  return `<div class="card" style="cursor:pointer" onclick="openDocument('${d.id}')">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div style="flex:1;min-width:0"><div style="font-weight:600">${d.pinned?'📌 ':''}${esc(d.fornitore||DOC_TIPO_LABEL(d.tipo))}</div>
      <div class="subtle" style="font-size:11px">${esc(DOC_TIPO_LABEL(d.tipo))}${d.number?' · N. '+esc(d.number):''}${d.date?' · '+fmtD(d.date):''}${d.storagePath?' · 📎':''}</div></div>
      <div style="text-align:right">${d.amount!=null?`<div style="font-family:var(--mono);font-weight:700">${docChf(d.amount)}</div>`:''}
      ${paid?`<span class="badge" style="border-color:var(--teal);color:var(--teal);font-size:9px">✓ pagato</span>`:(d.dueDate?`<span class="badge" style="border-color:${overdue?'var(--coral)':'var(--amber)'};color:${overdue?'var(--coral)':'var(--amber)'};font-size:9px">${overdue?'⚠ scad. ':'scad. '}${fmtD(d.dueDate)}</span>`:'')}</div>
    </div></div>`;
}
function docFornitori(){
  const by={};
  S.documents.forEach(d=>{const k=((d.fornitore||'').trim())||'—';if(!by[k])by[k]={n:0,tot:0,dap:0};by[k].n++;by[k].tot+=(+d.amount||0);if(d.payStatus==='da_pagare')by[k].dap+=(+d.amount||0);});
  const keys=Object.keys(by).sort((a,b)=>by[b].tot-by[a].tot);
  if(!keys.length)return '<div class="card"><div class="empty">Nessun fornitore ancora.</div></div>';
  return `<div class="card">${keys.map(k=>`<div class="frw" style="cursor:pointer" data-forn="${esc(k)}" onclick="docPickForn(this)"><div class="bd"><div class="ti">${esc(k)}</div><div class="su">${by[k].n} doc.${by[k].dap?' · <span style="color:var(--amber)">da pagare '+docChf(by[k].dap)+'</span>':''}</div></div><span style="font-family:var(--mono);font-weight:600">${docChf(by[k].tot)}</span></div>`).join('')}</div>`;
}
function docPickForn(el){docTab='tutti';docQ=(el&&el.dataset.forn)||'';render();}

/* ---- editor ---- */
let docDraft=null, docUrl=null;
function openDocument(id){
  const src=id?byId(S.documents,id):null;
  docDraft=src?{...src}:{id:uid(),tipo:'fattura',fornitore:'',number:'',amount:null,date:todayIso(),dueDate:'',category:'',payStatus:'da_pagare',description:'',fileName:'',storagePath:'',mime:''};
  docUrl=null;
  openSheet(`<h3>${id?'Documento':'Nuovo documento'} <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="frow">
     <div class="fld"><label>Tipo</label><select id="doc-tipo">${DOC_TIPI.map(([k,l])=>`<option value="${k}" ${docDraft.tipo===k?'selected':''}>${l}</option>`).join('')}</select></div>
     <div class="fld"><label>Stato</label><select id="doc-pay"><option value="da_pagare" ${docDraft.payStatus==='da_pagare'?'selected':''}>Da pagare</option><option value="pagato" ${docDraft.payStatus==='pagato'?'selected':''}>Pagato</option><option value="na" ${docDraft.payStatus==='na'?'selected':''}>— non applicabile</option></select></div>
   </div>
   <div class="fld"><label>Fornitore</label><input id="doc-forn" list="doc-fornlist" value="${esc(docDraft.fornitore||'')}" placeholder="es. Ferramenta Rossi SA" autocomplete="off"><datalist id="doc-fornlist">${[...new Set(S.documents.map(d=>d.fornitore).filter(Boolean))].map(f=>`<option value="${esc(f)}"></option>`).join('')}</datalist></div>
   <div class="frow">
     <div class="fld"><label>Numero</label><input id="doc-num" value="${esc(docDraft.number||'')}"></div>
     <div class="fld"><label>Importo CHF</label><input id="doc-amt" type="number" inputmode="decimal" step="any" value="${docDraft.amount!=null?docDraft.amount:''}"></div>
   </div>
   <div class="frow">
     <div class="fld"><label>Data</label><input id="doc-date" type="date" value="${docDraft.date||''}"></div>
     <div class="fld"><label>Scadenza</label><input id="doc-due" type="date" value="${docDraft.dueDate||''}"></div>
   </div>
   <div class="fld"><label>Categoria</label><input id="doc-cat" list="doc-catlist" value="${esc(docDraft.category||'')}" placeholder="es. Materiali, Utenze, Carburante" autocomplete="off"><datalist id="doc-catlist">${[...new Set(S.documents.map(d=>d.category).filter(Boolean))].map(c=>`<option value="${esc(c)}"></option>`).join('')}</datalist></div>
   <div class="fld"><label>Note</label><textarea id="doc-desc" rows="2" placeholder="Descrizione, riferimenti…">${esc(docDraft.description||'')}</textarea></div>
   <div class="fld"><label>📎 File allegato</label>
     <div id="doc-file">${docFileHTML()}</div>
     <input type="file" id="doc-fileinput" accept="image/*,application/pdf,.pdf,.xls,.xlsx,.doc,.docx,.csv" style="display:none" onchange="docAddFile(event)">
     <button class="btn sm ghost" onclick="document.getElementById('doc-fileinput').click()">📎 ${docDraft.storagePath?'Sostituisci file':'Carica file'}</button>
   </div>
   <div class="actions">${id?`<button class="btn danger" onclick="delDocument('${id}')">Elimina</button>`:''}<button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveDocument('${id||''}')">Salva</button></div>`);
  if(docDraft.storagePath)docLoadUrl();
}
function docFileHTML(){
  if(!docDraft||!docDraft.storagePath)return '<div class="subtle" style="margin-bottom:6px">Nessun file. Carica la fattura o il documento (PDF/foto).</div>';
  const isImg=(docDraft.mime||'').startsWith('image/');
  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">${isImg&&docUrl?`<img src="${docUrl}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid var(--line)">`:`<span style="font-size:26px">${(docDraft.mime||'').includes('pdf')?'📄':'📎'}</span>`}<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;word-break:break-word">${esc(docDraft.fileName||'file')}</div>${docUrl?`<a href="${docUrl}" target="_blank" style="font-size:12px;color:var(--cy)">Apri / scarica ↗</a>`:'<span class="subtle" style="font-size:11px">carico…</span>'}</div><button class="btn ghost sm" onclick="docDelFile()">✕</button></div>`;
}
function docRefreshFile(){const el=$('#doc-file');if(el)el.innerHTML=docFileHTML();const b=document.querySelector('#doc-file + input + button');if(b)b.innerHTML='📎 '+(docDraft&&docDraft.storagePath?'Sostituisci file':'Carica file');}
async function docLoadUrl(){if(!docDraft||!docDraft.storagePath)return;try{const{data}=await sb.storage.from('allegati').createSignedUrl(docDraft.storagePath,3600);if(data){docUrl=data.signedUrl;docRefreshFile();}}catch(e){}}
async function docAddFile(ev){
  const f=ev.target.files&&ev.target.files[0]; ev.target.value=''; if(!f||!docDraft)return;
  toast('📤 Carico il file…');
  try{
    if(docDraft.storagePath)sb.storage.from('allegati').remove([docDraft.storagePath]).catch(()=>{});
    const path=TENANT_ID+'/doc/'+docDraft.id+'/'+uid()+'-'+String(f.name||'file').replace(/[^\w.\-]/g,'_');
    const{error}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'application/octet-stream'});
    if(error)throw error;
    docDraft.storagePath=path; docDraft.fileName=f.name||'file'; docDraft.mime=f.type||''; docUrl=null;
    await docLoadUrl(); docRefreshFile(); toast('✓ File caricato');
  }catch(e){toast('⚠ File: '+(e.message||e));}
}
function docDelFile(){if(!docDraft)return;if(docDraft.storagePath)sb.storage.from('allegati').remove([docDraft.storagePath]).catch(()=>{});docDraft.storagePath='';docDraft.fileName='';docDraft.mime='';docUrl=null;docRefreshFile();}
function saveDocument(id){
  if(!docDraft)return;
  const data={tipo:$('#doc-tipo').value,payStatus:$('#doc-pay').value,fornitore:$('#doc-forn').value.trim(),number:$('#doc-num').value.trim(),amount:parseFloat($('#doc-amt').value)||null,date:$('#doc-date').value||null,dueDate:$('#doc-due').value||null,category:$('#doc-cat').value.trim(),description:$('#doc-desc').value.trim(),fileName:docDraft.fileName,storagePath:docDraft.storagePath,mime:docDraft.mime};
  if(data.payStatus==='pagato')data.paidDate=(id&&byId(S.documents,id)&&byId(S.documents,id).paidDate)||todayIso(); else data.paidDate=null;
  if(id){const d=byId(S.documents,id);if(d)Object.assign(d,data);}
  else S.documents.unshift({id:docDraft.id,pinned:false,clientId:null,siteId:null,currency:'CHF',created:Date.now(),...data});
  docDraft=null;save();closeSheet();render();toast('✓ Documento salvato');
}
function delDocument(id){if(!confirm('Eliminare il documento?'))return;const d=byId(S.documents,id);if(d&&d.storagePath)sb.storage.from('allegati').remove([d.storagePath]).catch(()=>{});S.documents=S.documents.filter(x=>x.id!==id);docDraft=null;save();closeSheet();render();toast('Documento eliminato');}
