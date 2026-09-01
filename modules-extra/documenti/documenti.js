/* ===== MODULO: DOCUMENTI — archivio documenti dell'azienda (SENZA IA, senza importi) =====
   Un archivio ordinato: ogni documento ha un titolo, una categoria (cartella), da chi arriva,
   una data e il file. Barra di ricerca in cima → scrivi e trovi. Niente importi/pagamenti.
   File nello Storage (bucket allegati, <tenant>/doc/<id>/...).
   Riusa le colonne esistenti della tabella `documents` (nessun cambio schema):
     description→titolo · category→categoria · fornitore→ente/da chi · number→n./rif ·
     doc_date→data · due_date→scadenza/validità (facolt.) · client_id/site_id→collegamenti · file.
   Dipende dal core (S, uid, save, render, openSheet, closeSheet, esc, toast, byId, fmtD, relDays,
   todayIso, moduleActive, norm, cName, cliInput, TENANT_ID, sb, $). */

/* categorie/cartelle suggerite (l'utente può comunque scriverne di sue) */
const DOC_CATS=['Contratti','Assicurazioni','Fatture fornitori','Ricevute','Certificati','Permessi','Personale','Fisco & IVA','Veicoli','Banca','Sicurezza','Altro'];
const docTitle=d=>(d.description||d.fornitore||d.fileName||d.category||'Documento');
const docFileIcon=d=>{const m=d.mime||'';if(m.startsWith('image/'))return '🖼';if(m.includes('pdf')||/\.pdf$/i.test(d.fileName||''))return '📄';if(/\.(xls|xlsx|csv)$/i.test(d.fileName||''))return '📊';if(/\.(doc|docx)$/i.test(d.fileName||''))return '📝';return d.storagePath?'📎':'📁';};

let docCat='', docQ='';
function renderDocumenti(){
  const q=norm(docQ), t=todayIso();
  /* cartelle = categorie realmente usate (+ "Senza categoria" se serve) */
  const counts={};S.documents.forEach(d=>{const c=(d.category||'').trim()||'—';counts[c]=(counts[c]||0)+1;});
  const cats=Object.keys(counts).sort((a,b)=>a==='—'?1:b==='—'?-1:a.localeCompare(b));
  /* documenti in scadenza (validità entro 30 gg o già passata) — utile, non finanziario */
  const scad=S.documents.filter(d=>d.dueDate&&relDays(d.dueDate)<=30).length;
  const match=d=>{
    if(docCat){const c=(d.category||'').trim()||'—';if(c!==docCat)return false;}
    if(!q)return true;
    return norm(docTitle(d)+' '+(d.category||'')+' '+(d.fornitore||'')+' '+(d.number||'')+' '+(d.clientId?cName(d.clientId):'')).includes(q);
  };
  const list=S.documents.filter(match).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||((a.date||'')<(b.date||'')?1:-1));
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>📁 Documenti</div>
  <div class="subtle" style="margin:-2px 0 10px">Archivio dei documenti dell'azienda. Scrivi nella barra per trovare quello che ti serve.</div>
  <input class="searchbar" id="doc-q" placeholder="🔍 Cerca per titolo, categoria, ente, numero…" value="${esc(docQ)}" oninput="docSearchInput(this.value)">
  <button class="btn pri" style="width:100%;margin:2px 0 10px" onclick="openDocument()">+ Nuovo documento</button>
  <div class="tabs" style="flex-wrap:wrap">
    <div class="tb ${docCat===''?'on':''}" onclick="docCat='';render()">🗂 Tutti (${S.documents.length})</div>
    ${cats.map(c=>`<div class="tb ${docCat===c?'on':''}" onclick="docCat=${JSON.stringify(c).replace(/"/g,'&quot;')};render()">${c==='—'?'📄 Senza categoria':'📁 '+esc(c)} (${counts[c]})</div>`).join('')}
  </div>
  ${scad?`<div class="subtle" style="color:var(--amber);margin:8px 0 2px">⏳ ${scad} document${scad>1?'i':'o'} in scadenza (validità)</div>`:''}
  ${list.length?list.map(docRow).join(''):`<div class="card"><div class="empty"><div class="big">📁</div>${docQ||docCat?'Nessun documento trovato.':'Archivio vuoto.'}<br><span class="subtle">Carica contratti, assicurazioni, certificati, permessi…</span></div></div>`}`;
}
function docSearchInput(v){docQ=v;render();const e=document.getElementById('doc-q');if(e){e.focus();try{e.setSelectionRange(v.length,v.length);}catch(_){}}}
function docRow(d){
  const exp=d.dueDate?relDays(d.dueDate):null;
  const expCol=exp==null?'':exp<0?'var(--coral)':exp<=30?'var(--amber)':'var(--t3)';
  const meta=[d.category?'📁 '+esc(d.category):'',d.fornitore?'🏢 '+esc(d.fornitore):'',d.number?'N. '+esc(d.number):'',d.clientId?'👤 '+esc(cName(d.clientId)):'',d.date?fmtD(d.date):''].filter(Boolean).join(' · ');
  return `<div class="card" style="cursor:pointer;display:flex;align-items:center;gap:11px;padding:11px 12px" onclick="openDocument('${d.id}')">
    <span style="font-size:24px;flex-shrink:0">${docFileIcon(d)}</span>
    <div style="flex:1;min-width:0">
      <div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.pinned?'📌 ':''}${esc(docTitle(d))}</div>
      ${meta?`<div class="subtle" style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${meta}</div>`:''}
    </div>
    <div style="text-align:right;flex-shrink:0">
      ${d.storagePath?'<span style="font-size:13px;color:var(--t3)">📎</span>':''}
      ${d.dueDate?`<div class="badge" style="border-color:${expCol};color:${expCol};font-size:9px;margin-top:3px">${exp<0?'scaduto':'scade'} ${fmtD(d.dueDate)}</div>`:''}
    </div></div>`;
}

/* ---- editor ---- */
let docDraft=null, docUrl=null;
function openDocument(id){
  const src=id?byId(S.documents,id):null;
  docDraft=src?{...src}:{id:uid(),description:'',category:docCat&&docCat!=='—'?docCat:'',fornitore:'',number:'',date:todayIso(),dueDate:'',clientId:null,siteId:null,fileName:'',storagePath:'',mime:'',pinned:false};
  docUrl=null;
  const siteSel=moduleActive('sites')?`<div class="fld"><label>Cantiere collegato (facolt.)</label><select id="doc-site"><option value="">— nessuno —</option>${S.sites.map(s=>`<option value="${s.id}" ${docDraft.siteId===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>`:'';
  openSheet(`<h3>${id?'Documento':'Nuovo documento'} <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="fld"><label>Titolo del documento</label><input id="doc-title" value="${esc(docDraft.description||'')}" placeholder="es. Assicurazione RC azienda 2026" autocomplete="off"></div>
   <div class="fld"><label>Categoria (cartella)</label><input id="doc-cat" list="doc-catlist" value="${esc(docDraft.category||'')}" placeholder="es. Assicurazioni" autocomplete="off"><datalist id="doc-catlist">${[...new Set([...DOC_CATS,...S.documents.map(d=>d.category).filter(Boolean)])].map(c=>`<option value="${esc(c)}"></option>`).join('')}</datalist></div>
   <div class="frow">
     <div class="fld"><label>Da chi / Ente (facolt.)</label><input id="doc-forn" list="doc-fornlist" value="${esc(docDraft.fornitore||'')}" placeholder="es. Vaudoise, Comune, Banca…" autocomplete="off"><datalist id="doc-fornlist">${[...new Set(S.documents.map(d=>d.fornitore).filter(Boolean))].map(f=>`<option value="${esc(f)}"></option>`).join('')}</datalist></div>
     <div class="fld"><label>N. / riferimento (facolt.)</label><input id="doc-num" value="${esc(docDraft.number||'')}"></div>
   </div>
   <div class="frow">
     <div class="fld"><label>Data documento</label><input id="doc-date" type="date" value="${docDraft.date||''}"></div>
     <div class="fld"><label>Scadenza / validità (facolt.)</label><input id="doc-due" type="date" value="${docDraft.dueDate||''}"></div>
   </div>
   <div class="fld"><label>Cliente collegato (facolt.)</label>${cliInput('doc-cl',docDraft.clientId,'doc-clprev')}<div id="doc-clprev"></div></div>
   ${siteSel}
   <label class="set-check" style="margin:2px 0 6px"><input type="checkbox" id="doc-pin" ${docDraft.pinned?'checked':''}> 📌 Tieni in cima</label>
   <div class="fld"><label>📎 File allegato</label>
     <div id="doc-file">${docFileHTML()}</div>
     <input type="file" id="doc-fileinput" accept="image/*,application/pdf,.pdf,.xls,.xlsx,.doc,.docx,.csv" style="display:none" onchange="docAddFile(event)">
     <button class="btn sm ghost" onclick="document.getElementById('doc-fileinput').click()">📎 ${docDraft.storagePath?'Sostituisci file':'Carica file'}</button>
   </div>
   <div class="actions">${id?`<button class="btn danger" onclick="delDocument('${id}')">Elimina</button>`:''}<button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveDocument('${id||''}')">Salva</button></div>`);
  if(docDraft.storagePath)docLoadUrl();
}
function docFileHTML(){
  if(!docDraft||!docDraft.storagePath)return '<div class="subtle" style="margin-bottom:6px">Nessun file. Carica il documento (PDF/foto/Excel/Word).</div>';
  const isImg=(docDraft.mime||'').startsWith('image/');
  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">${isImg&&docUrl?`<img src="${docUrl}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid var(--line)">`:`<span style="font-size:26px">${docFileIcon(docDraft)}</span>`}<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;word-break:break-word">${esc(docDraft.fileName||'file')}</div>${docUrl?`<a href="${docUrl}" target="_blank" style="font-size:12px;color:var(--cy)">Apri / scarica ↗</a>`:'<span class="subtle" style="font-size:11px">carico…</span>'}</div><button class="btn ghost sm" onclick="docDelFile()">✕</button></div>`;
}
function docRefreshFile(){const el=$('#doc-file');if(el)el.innerHTML=docFileHTML();const b=document.querySelector('#doc-file + input + button');if(b)b.innerHTML='📎 '+(docDraft&&docDraft.storagePath?'Sostituisci file':'Carica file');}
async function docLoadUrl(){if(!docDraft||!docDraft.storagePath)return;try{const{data}=await sb.storage.from('allegati').createSignedUrl(docDraft.storagePath,3600);if(data){docUrl=data.signedUrl;docRefreshFile();}}catch(e){}}
async function docAddFile(ev){
  const f=ev.target.files&&ev.target.files[0]; ev.target.value=''; if(!f||!docDraft)return;
  if(f.size>25*1024*1024){toast('⚠ File oltre 25MB');return;}
  toast('📤 Carico il file…');
  try{
    if(docDraft.storagePath)sb.storage.from('allegati').remove([docDraft.storagePath]).catch(()=>{});
    const path=TENANT_ID+'/doc/'+docDraft.id+'/'+uid()+'-'+String(f.name||'file').replace(/[^\w.\-]/g,'_');
    const{error}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'application/octet-stream'});
    if(error)throw error;
    docDraft.storagePath=path; docDraft.fileName=f.name||'file'; docDraft.mime=f.type||''; docUrl=null;
    /* se non c'è ancora un titolo, proponi il nome del file (senza estensione) */
    if(!($('#doc-title')&&$('#doc-title').value.trim())){const base=(f.name||'').replace(/\.[^.]+$/,'');if($('#doc-title'))$('#doc-title').value=base;}
    await docLoadUrl(); docRefreshFile(); toast('✓ File caricato');
  }catch(e){toast('⚠ File: '+(e.message||e));}
}
function docDelFile(){if(!docDraft)return;if(docDraft.storagePath)sb.storage.from('allegati').remove([docDraft.storagePath]).catch(()=>{});docDraft.storagePath='';docDraft.fileName='';docDraft.mime='';docUrl=null;docRefreshFile();}
function saveDocument(id){
  if(!docDraft)return;
  const title=$('#doc-title').value.trim();
  if(!title){toast('Dai un titolo al documento');return;}
  const data={
    description:title,
    category:$('#doc-cat').value.trim(),
    fornitore:$('#doc-forn').value.trim(),
    number:$('#doc-num').value.trim(),
    date:$('#doc-date').value||null,
    dueDate:$('#doc-due').value||null,
    clientId:($('#doc-cl')&&$('#doc-cl').value)||null,
    siteId:($('#doc-site')&&$('#doc-site').value)||null,
    pinned:!!($('#doc-pin')&&$('#doc-pin').checked),
    fileName:docDraft.fileName,storagePath:docDraft.storagePath,mime:docDraft.mime,
    /* campi finanziari non usati in questo modulo: archivio senza importi */
    tipo:'archivio',amount:null,currency:null,payStatus:'na',paidDate:null
  };
  if(id){const d=byId(S.documents,id);if(d)Object.assign(d,data);}
  else S.documents.unshift({id:docDraft.id,created:Date.now(),...data});
  docDraft=null;save();closeSheet();render();toast('✓ Documento salvato');
}
function delDocument(id){if(!confirm('Eliminare il documento?'))return;const d=byId(S.documents,id);if(d&&d.storagePath)sb.storage.from('allegati').remove([d.storagePath]).catch(()=>{});S.documents=S.documents.filter(x=>x.id!==id);docDraft=null;save();closeSheet();render();toast('Documento eliminato');}
