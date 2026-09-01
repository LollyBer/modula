/* ===== MODULO: DOCUMENTI — archivio documenti dell'azienda (ispirato a DocuWare, SENZA importi) =====
   Gruppi (file cabinet) · vassoio «Da sistemare» (document tray) · aggiunta veloce + multipla ·
   auto-riconoscimento dal nome file e dal CONTENUTO dei PDF · tag · versioni · vista per mese · full-text.
   File nello Storage (bucket allegati, <tenant>/doc/<id>/...). Nessun cambio schema: riuso le colonne di
   `documents` → description=titolo · category=GRUPPO · fornitore=ente · number=n./rif · doc_date=data ·
   due_date=scadenza/validità · client_id/site_id=link · vat_no=TAG · tipo=testo estratto dal PDF (full-text).
   Dipende dal core (S, uid, save, render, openSheet, closeSheet, esc, toast, byId, fmtD, relDays, todayIso,
   moduleActive, can, norm, cName, cliInput, DEMO, TENANT_ID, sb, $). */

const DOC_CATS=['Contratti','Assicurazioni','Fatture fornitori','Ricevute','Certificati','Permessi','Personale','Fisco & IVA','Veicoli','Banca','Sicurezza','Altro'];
const DOC_CAT_IC={'Assicurazioni':'🛡️','Contratti':'📝','Fatture fornitori':'🧾','Ricevute':'🧾','Certificati':'📜','Permessi':'✅','Personale':'👤','Fisco & IVA':'🏛️','Veicoli':'🚐','Banca':'🏦','Sicurezza':'🦺','Altro':'📁'};
const docCatIc=c=>DOC_CAT_IC[c]||'📁';
const docTitle=d=>(d.description||d.fornitore||d.fileName||d.category||'Documento');
const docTags=d=>String(d.vatNo||'').trim();                       /* tag/parole chiave (riusa vat_no) */
const docFullText=d=>{const t=d.tipo||'';return (t==='archivio'||t==='fattura'||t==='ddt'||t==='spesa'||t==='contratto'||t==='preventivo'||t==='altro')?'':t;}; /* testo estratto (riusa tipo) */
const docFileIcon=d=>{const m=d.mime||'';if(m.startsWith('image/'))return '🖼';if(m.includes('pdf')||/\.pdf$/i.test(d.fileName||''))return '📄';if(/\.(xls|xlsx|csv)$/i.test(d.fileName||''))return '📊';if(/\.(doc|docx)$/i.test(d.fileName||''))return '📝';return d.storagePath?'📎':'📁';};
const docGuessMime=n=>{n=(n||'').toLowerCase();if(/\.(png|jpe?g|gif|webp|heic)$/.test(n))return 'image/jpeg';if(/\.pdf$/.test(n))return 'application/pdf';return '';};
const DOC_MON=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const docMonthKey=d=>d.date?String(d.date).slice(0,7):'0000-00';
const docMonthLabel=ym=>{if(ym==='0000-00')return 'Senza data';const[y,m]=ym.split('-');return (DOC_MON[+m-1]||'?')+' '+y;};

/* ---- auto-riconoscimento: nome file + (per i PDF) contenuto ---- */
const DOC_KW=[
 ['Assicurazioni',['assicuraz','polizza','poliz','responsabilit',' rc ','vaudoise','axa','allianz','helvetia','zurich','mobiliare','generali','baloise']],
 ['Contratti',['contratto','contract','accordo','convenzione','locazione','affitto','leasing']],
 ['Fatture fornitori',['fattura','fattur','rechnung','facture','invoice']],
 ['Ricevute',['ricevuta','ricevut','scontrino','quittung','quietanza']],
 ['Certificati',['certificat','attestat','diploma','zertifikat']],
 ['Permessi',['permesso','autorizzaz','licenza','concessione','notifica costr']],
 ['Personale',['busta paga','bustapaga','salario','stipendio','conteggio salari','payroll','avs','lpp','dipendente','contratto lavoro']],
 ['Fisco & IVA',['iva','imposta','tass','fiscal','dichiaraz','mwst','tva']],
 ['Veicoli',['libretto','veicolo','targa','furgone','camion','patente','circolazione','carta grigia']],
 ['Banca',['banca','estratto conto','bonifico','conto corrente','iban ','bank']],
 ['Sicurezza',['sicurezza','suva','antinfortun','dpi ']],
];
function docAutoDetect(name,text){
  const base=String(name||'').replace(/\.[^.]+$/,'');
  const clean=base.replace(/[_\-]+/g,' ').replace(/\s{2,}/g,' ').trim();
  const hay=norm(' '+clean+' '+String(text||'').slice(0,4000)+' ');
  const out={title:clean};
  for(const [cat,kws] of DOC_KW){ if(kws.some(k=>hay.includes(norm(k)))){out.category=cat;break;} }
  const enti=[...new Set(S.documents.map(d=>d.fornitore).filter(Boolean))];
  const found=enti.find(e=>e.length>2&&hay.includes(norm(e)));
  if(found){out.fornitore=found;
    if(!out.category){const cc={};S.documents.filter(d=>norm(d.fornitore||'')===norm(found)&&d.category).forEach(d=>cc[d.category]=(cc[d.category]||0)+1);const best=Object.keys(cc).sort((a,b)=>cc[b]-cc[a])[0];if(best)out.category=best;}}
  const src=base+' '+String(text||'').slice(0,2000);let m;
  if((m=src.match(/(20\d{2})[.\-\/ ](0[1-9]|1[0-2])(?:[.\-\/ ](0[1-9]|[12]\d|3[01]))?/)))out.date=m[1]+'-'+m[2]+'-'+(m[3]||'01');
  else if((m=src.match(/(0[1-9]|[12]\d|3[01])[.\-\/](0[1-9]|1[0-2])[.\-\/](20\d{2})/)))out.date=m[3]+'-'+m[2]+'-'+m[1];
  else{const mi=DOC_MON.findIndex(mm=>hay.includes(' '+mm+' '));const ym=src.match(/20\d{2}/);if(mi>=0&&ym)out.date=ym[0]+'-'+String(mi+1).padStart(2,'0')+'-01';}
  return out;
}
/* estrazione testo dai PDF (pdf.js caricato a richiesta; best-effort, non blocca mai) */
let _pdfjsP=null;
function docPdfjs(){if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);if(_pdfjsP)return _pdfjsP;
  _pdfjsP=import('https://esm.sh/pdfjs-dist@4.7.76/build/pdf.min.mjs').then(m=>{try{m.GlobalWorkerOptions.workerSrc='https://esm.sh/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';}catch(_){}window.pdfjsLib=m;return m;}).catch(e=>{_pdfjsP=null;throw e;});
  return _pdfjsP;}
async function docExtractPdfText(file){
  try{
    const pdfjs=await docPdfjs();
    const pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;
    let text='';
    for(let i=1;i<=Math.min(pdf.numPages,4);i++){const p=await pdf.getPage(i);const c=await p.getTextContent();text+=c.items.map(it=>it.str).join(' ')+' ';if(text.length>8000)break;}
    return text.replace(/\s+/g,' ').trim().slice(0,8000);
  }catch(e){return '';}
}

let docView='', docQ='';   /* '' home · '__all__' tutti · '__inbox__' da sistemare · <gruppo> */
function docGroupsList(){
  const g={};
  S.documents.forEach(d=>{const c=(d.category||'').trim();if(!c)return;if(!g[c])g[c]={name:c,n:0,last:''};g[c].n++;if((d.date||'')>g[c].last)g[c].last=d.date||'';});
  return Object.values(g).sort((a,b)=>(b.last||'').localeCompare(a.last||'')||a.name.localeCompare(b.name));
}
const docInboxN=()=>S.documents.filter(d=>!(d.category||'').trim()).length;
function docMatch(d,q){return norm(docTitle(d)+' '+(d.category||'')+' '+(d.fornitore||'')+' '+(d.number||'')+' '+docTags(d)+' '+(d.clientId?cName(d.clientId):'')+' '+docFullText(d)).includes(q);}

function renderDocumenti(){
  const q=norm(docQ);
  if(q)return docRenderSearch(q);
  if(docView)return docRenderGroup(docView);
  const groups=docGroupsList();
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>📁 Documenti</div>
  <div class="subtle" style="margin:-2px 0 10px">L'archivio dell'azienda, diviso in gruppi. Scrivi nella barra per trovare al volo un documento (anche nel testo dei PDF).</div>
  <input class="searchbar" id="doc-q" placeholder="🔍 Cerca in tutti i documenti…" value="${esc(docQ)}" oninput="docSearchInput(this.value)">
  <div style="display:flex;gap:8px;margin:2px 0 8px">
    <button class="btn pri" style="flex:1" onclick="docQuickAdd()">➕ Aggiungi documento</button>
    <button class="btn ghost" onclick="docNewGroup()">📂 Nuovo gruppo</button>
  </div>
  <button class="btn ghost sm" style="width:100%;margin-bottom:12px" onclick="document.getElementById('doc-batch').click()">📎 Carica più file insieme</button>
  <input type="file" id="doc-batch" multiple accept="image/*,application/pdf,.pdf,.xls,.xlsx,.doc,.docx,.csv" style="display:none" onchange="docBatchAdd(event)">
  ${docInboxN()?`<div class="card" style="cursor:pointer;display:flex;align-items:center;gap:11px;padding:12px;margin-bottom:8px;border-color:rgba(199,127,18,.5)" onclick="docView='__inbox__';render()">
    <span style="font-size:22px">📥</span><div style="flex:1"><div style="font-weight:700">Da sistemare <span class="badge" style="border-color:var(--amber);color:var(--amber)">${docInboxN()}</span></div><div class="subtle" style="font-size:11px">Documenti caricati senza gruppo — assegnane uno per archiviarli</div></div><span style="color:var(--t3)">›</span></div>`:''}
  <div class="card" style="cursor:pointer;display:flex;align-items:center;gap:11px;padding:12px;margin-bottom:10px" onclick="docView='__all__';render()">
    <span style="font-size:22px">🗂</span><div style="flex:1"><div style="font-weight:700">Tutti i documenti</div><div class="subtle" style="font-size:11px">${S.documents.length} in archivio · divisi per mese</div></div><span style="color:var(--t3)">›</span></div>
  <div class="set-h" style="margin:4px 0 6px">📂 Gruppi</div>
  ${groups.length?groups.map(g=>`<div class="card" style="cursor:pointer;display:flex;align-items:center;gap:11px;padding:11px 12px" onclick="docView=${JSON.stringify(g.name).replace(/"/g,'&quot;')};render()">
      <span style="font-size:22px;flex-shrink:0">${docCatIc(g.name)}</span>
      <div style="flex:1;min-width:0"><div style="font-weight:600">${esc(g.name)}</div><div class="subtle" style="font-size:11px">${g.n} document${g.n>1?'i':'o'}${g.last?' · ultimo '+fmtD(g.last):''}</div></div>
      <span style="color:var(--t3)">›</span></div>`).join('')
    :'<div class="card"><div class="empty"><div class="big">📂</div>Ancora nessun gruppo.<br><span class="subtle">Tocca «Aggiungi documento» o «Nuovo gruppo».</span></div></div>'}`;
}
function docRenderGroup(view){
  const all=view==='__all__', inbox=view==='__inbox__';
  const title=all?'Tutti i documenti':inbox?'Da sistemare':view;
  const list=(all?S.documents:inbox?S.documents.filter(d=>!(d.category||'').trim()):S.documents.filter(d=>(d.category||'').trim()===view))
    .slice().sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||((a.date||'')<(b.date||'')?1:-1));
  const byM={};list.forEach(d=>{const k=docMonthKey(d);(byM[k]=byM[k]||[]).push(d);});
  const months=Object.keys(byM).sort((a,b)=>b.localeCompare(a));
  const scad=list.filter(d=>d.dueDate&&relDays(d.dueDate)<=30).length;
  const gj=JSON.stringify(view).replace(/"/g,'&quot;');
  const addArg=(all||inbox)?'':gj;
  $('#main').innerHTML=`
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
    <button class="btn ghost sm" onclick="docView='';render()">‹ Gruppi</button>
    <div class="pagetitle" style="margin:0"><span class="accent" style="background:var(--cy)"></span>${all?'🗂':inbox?'📥':docCatIc(view)} ${esc(title)} <span class="subtle">(${list.length})</span></div>
  </div>
  <input class="searchbar" id="doc-q" placeholder="🔍 Cerca in tutti i documenti…" value="" oninput="docSearchInput(this.value)">
  <div style="display:flex;gap:8px;margin:2px 0 8px">
    <button class="btn pri" style="flex:1" onclick="docQuickAdd(${addArg})">➕ Aggiungi ${(all||inbox)?'documento':'in «'+esc(view)+'»'}</button>
    <button class="btn ghost" onclick="document.getElementById('doc-batch').click()">📎 Più file</button>
  </div>
  <input type="file" id="doc-batch" multiple accept="image/*,application/pdf,.pdf,.xls,.xlsx,.doc,.docx,.csv" style="display:none" onchange="docBatchAdd(event,${all||inbox?'':gj})">
  ${inbox?`<div class="subtle" style="margin:2px 0 6px">Apri ogni documento e assegnagli un gruppo per archiviarlo.</div>`:''}
  ${scad?`<div class="subtle" style="color:var(--amber);margin:2px 0 6px">⏳ ${scad} in scadenza (validità)</div>`:''}
  ${list.length?months.map(k=>`<div class="set-h" style="margin:12px 0 6px;font-size:12px">${docMonthLabel(k)} <span class="subtle" style="font-weight:400">· ${byM[k].length}</span></div>${byM[k].map(docRow).join('')}`).join('')
    :`<div class="card"><div class="empty"><div class="big">📂</div>Gruppo vuoto.<br><span class="subtle">Aggiungi il primo documento.</span></div></div>`}`;
}
function docRenderSearch(q){
  const list=S.documents.filter(d=>docMatch(d,q)).sort((a,b)=>((a.date||'')<(b.date||'')?1:-1));
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>📁 Documenti</div>
  <input class="searchbar" id="doc-q" placeholder="🔍 Cerca in tutti i documenti…" value="${esc(docQ)}" oninput="docSearchInput(this.value)">
  <div class="subtle" style="margin:4px 0 8px">${list.length} risultat${list.length===1?'o':'i'} per «${esc(docQ)}»</div>
  ${list.length?list.map(docRow).join(''):'<div class="card"><div class="empty"><div class="big">🔍</div>Nessun documento trovato.</div></div>'}`;
}
function docSearchInput(v){docQ=v;render();const e=document.getElementById('doc-q');if(e){e.focus();try{e.setSelectionRange(v.length,v.length);}catch(_){}}}
function docRow(d){
  const exp=d.dueDate?relDays(d.dueDate):null;
  const expCol=exp==null?'':exp<0?'var(--coral)':exp<=30?'var(--amber)':'var(--t3)';
  const tags=docTags(d)?docTags(d).split(',').map(x=>x.trim()).filter(Boolean).slice(0,3):[];
  const meta=[d.category?docCatIc(d.category)+' '+esc(d.category):'',d.fornitore?'🏢 '+esc(d.fornitore):'',d.number?'N. '+esc(d.number):'',d.clientId?'👤 '+esc(cName(d.clientId)):'',d.date?fmtD(d.date):''].filter(Boolean).join(' · ');
  return `<div class="card" style="cursor:pointer;display:flex;align-items:center;gap:11px;padding:11px 12px" onclick="openDocument('${d.id}')">
    <span style="font-size:24px;flex-shrink:0">${docFileIcon(d)}</span>
    <div style="flex:1;min-width:0">
      <div style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.pinned?'📌 ':''}${esc(docTitle(d))}</div>
      ${meta?`<div class="subtle" style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${meta}</div>`:''}
      ${tags.length?`<div style="margin-top:3px">${tags.map(t=>`<span class="badge" style="border-color:var(--line2);color:var(--t2);font-size:9px;margin-right:4px">${esc(t)}</span>`).join('')}</div>`:''}
    </div>
    <div style="text-align:right;flex-shrink:0">
      ${d.storagePath?'<span style="font-size:13px;color:var(--t3)">📎</span>':''}
      ${d.dueDate?`<div class="badge" style="border-color:${expCol};color:${expCol};font-size:9px;margin-top:3px">${exp<0?'scaduto':'scade'} ${fmtD(d.dueDate)}</div>`:''}
    </div></div>`;
}
function docNewGroup(){
  const used=new Set(S.documents.map(d=>(d.category||'').trim()).filter(Boolean));
  const sugg=DOC_CATS.filter(c=>!used.has(c));
  openSheet(`<h3>📂 Nuovo gruppo <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="subtle" style="margin-bottom:8px">Dai un nome al gruppo (una cartella dell'archivio). Poi aggiungi il primo documento.</div>
   <div class="fld"><input id="ng-name" placeholder="es. Assicurazioni" autocomplete="off"></div>
   ${sugg.length?`<div class="seg" style="flex-wrap:wrap;gap:7px;margin-bottom:6px">${sugg.map(c=>`<div class="sg" onclick="document.getElementById('ng-name').value='${esc(c)}'">${docCatIc(c)} ${esc(c)}</div>`).join('')}</div>`:''}
   <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="docCreateGroup()">Crea e aggiungi documento</button></div>`);
  setTimeout(()=>{const f=document.getElementById('ng-name');if(f)f.focus();},60);
}
function docCreateGroup(){const n=(document.getElementById('ng-name').value||'').trim();if(!n){toast('Scrivi il nome del gruppo');return;}closeSheet();docQuickAdd(n);}
function docQuickAdd(group){openDocument(null,group);setTimeout(()=>{const i=document.getElementById('doc-fileinput');if(i)i.click();},60);}
function docAddForClient(clientId){openDocument(null,{clientId});setTimeout(()=>{const i=document.getElementById('doc-fileinput');if(i)i.click();},60);}
function docAddForSite(siteId){openDocument(null,{siteId});setTimeout(()=>{const i=document.getElementById('doc-fileinput');if(i)i.click();},60);}
/* CARICAMENTO MULTIPLO: N file → N documenti, auto-classificati; gli incerti finiscono in «Da sistemare» */
async function docBatchAdd(ev,group){
  const files=[...(ev.target.files||[])]; ev.target.value=''; if(!files.length)return;
  if(DEMO){toast('Demo: qui caricheresti i file');return;}
  const grp=(group&&group!=='__all__'&&group!=='__inbox__')?group:'';
  let ok=0,inbox=0;
  toast('📤 Carico '+files.length+' file…');
  for(const f of files){
    if(f.size>25*1024*1024)continue;
    try{
      let txt=''; if(/\.pdf$/i.test(f.name)||(f.type||'').includes('pdf'))txt=await docExtractPdfText(f);
      const g=docAutoDetect(f.name,txt);
      const id=uid();
      const path=TENANT_ID+'/doc/'+id+'/'+uid()+'-'+String(f.name||'file').replace(/[^\w.\-]/g,'_');
      const{error}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'application/octet-stream'});
      if(error)throw error;
      const cat=grp||g.category||'';
      S.documents.unshift({id,created:Date.now(),description:g.title||f.name,category:cat,fornitore:g.fornitore||'',number:'',date:g.date||todayIso(),dueDate:null,clientId:null,siteId:null,pinned:false,fileName:f.name,storagePath:path,mime:f.type||'',vatNo:'',tipo:txt||'archivio',amount:null,currency:null,payStatus:'na',paidDate:null});
      ok++; if(!cat)inbox++;
    }catch(e){/* salta il file problematico */}
  }
  save();if(grp)docView=grp;render();
  toast('✓ '+ok+' documento'+(ok===1?'':'i')+' aggiunt'+(ok===1?'o':'i')+(inbox?(' · '+inbox+' da sistemare'):''));
}

/* ---- editor ---- */
let docDraft=null, docUrl=null, docVersions=[];
function openDocument(id,preset){
  const src=id?byId(S.documents,id):null;
  let pg='',pcid=null,psid=null;
  if(preset&&typeof preset==='object'){pg=preset.group||'';pcid=preset.clientId||null;psid=preset.siteId||null;}
  else if(typeof preset==='string')pg=preset;
  const g=(pg&&pg!=='__all__'&&pg!=='__inbox__')?pg:'';
  docDraft=src?{...src}:{id:uid(),description:'',category:g,fornitore:'',number:'',date:todayIso(),dueDate:'',clientId:pcid,siteId:psid,fileName:'',storagePath:'',mime:'',pinned:false,vatNo:'',tipo:'archivio'};
  docUrl=null;docVersions=[];
  const siteSel=moduleActive('sites')?`<div class="fld"><label>Cantiere collegato (facolt.)</label><select id="doc-site"><option value="">— nessuno —</option>${S.sites.map(s=>`<option value="${s.id}" ${docDraft.siteId===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>`:'';
  openSheet(`<h3>${id?'Documento':'Nuovo documento'} <span class="x" onclick="closeSheet()">✕</span></h3>
   ${id?'':'<div class="subtle" style="margin-bottom:8px">Carica il file: provo a capire da solo gruppo, ente e data (dal nome e, per i PDF, dal contenuto). Controlla e salva.</div>'}
   <div class="fld"><label>📎 File</label>
     <div id="doc-file">${docFileHTML()}</div>
     <input type="file" id="doc-fileinput" accept="image/*,application/pdf,.pdf,.xls,.xlsx,.doc,.docx,.csv" style="display:none" onchange="docAddFile(event)">
     <button class="btn sm ghost" onclick="document.getElementById('doc-fileinput').click()">📎 ${docDraft.storagePath?'Sostituisci file':'Carica file'}</button>
     <div id="doc-versions" class="fld" style="margin-top:8px"></div>
   </div>
   <div class="fld"><label>Titolo del documento</label><input id="doc-title" value="${esc(docDraft.description||'')}" placeholder="es. Assicurazione RC 2026" autocomplete="off"></div>
   <div class="fld"><label>Gruppo (cartella)</label><input id="doc-cat" list="doc-catlist" value="${esc(docDraft.category||'')}" placeholder="es. Assicurazioni" autocomplete="off"><datalist id="doc-catlist">${[...new Set([...DOC_CATS,...S.documents.map(d=>d.category).filter(Boolean)])].map(c=>`<option value="${esc(c)}"></option>`).join('')}</datalist></div>
   <div class="frow">
     <div class="fld"><label>Da chi / Ente (facolt.)</label><input id="doc-forn" list="doc-fornlist" value="${esc(docDraft.fornitore||'')}" placeholder="es. Vaudoise, Comune…" autocomplete="off"><datalist id="doc-fornlist">${[...new Set(S.documents.map(d=>d.fornitore).filter(Boolean))].map(f=>`<option value="${esc(f)}"></option>`).join('')}</datalist></div>
     <div class="fld"><label>N. / riferimento (facolt.)</label><input id="doc-num" value="${esc(docDraft.number||'')}"></div>
   </div>
   <div class="frow">
     <div class="fld"><label>Data documento</label><input id="doc-date" type="date" value="${docDraft.date||''}"></div>
     <div class="fld"><label>Scadenza / validità (facolt.)</label><input id="doc-due" type="date" value="${docDraft.dueDate||''}"></div>
   </div>
   <div class="fld"><label>Tag / parole chiave (facolt.)</label><input id="doc-tags" value="${esc(docDraft.vatNo||'')}" placeholder="es. urgente, 2026, furgone — separati da virgola"></div>
   <div class="fld"><label>Cliente collegato (facolt.)</label>${cliInput('doc-cl',docDraft.clientId,'doc-clprev')}<div id="doc-clprev"></div></div>
   ${siteSel}
   <label class="set-check" style="margin:2px 0 6px"><input type="checkbox" id="doc-pin" ${docDraft.pinned?'checked':''}> 📌 Tieni in cima</label>
   <div class="actions">${id?`<button class="btn danger" onclick="delDocument('${id}')">Elimina</button>`:''}<button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveDocument('${id||''}')">Salva</button></div>`);
  if(docDraft.storagePath)docLoadUrl();
  if(id)docLoadVersions();
}
function docFileHTML(){
  if(!docDraft||!docDraft.storagePath)return '<div class="subtle" style="margin-bottom:6px">Nessun file. Carica il documento (PDF/foto/Excel/Word).</div>';
  const isImg=(docDraft.mime||'').startsWith('image/');
  return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">${isImg&&docUrl?`<img src="${docUrl}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;border:1px solid var(--line)">`:`<span style="font-size:26px">${docFileIcon(docDraft)}</span>`}<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;word-break:break-word">${esc(docDraft.fileName||'file')}</div>${docUrl?`<a href="${docUrl}" target="_blank" style="font-size:12px;color:var(--cy)">Apri / scarica ↗</a>`:'<span class="subtle" style="font-size:11px">carico…</span>'}</div><button class="btn ghost sm" onclick="docDelFile()">✕</button></div>`;
}
function docRefreshFile(){const el=$('#doc-file');if(el)el.innerHTML=docFileHTML();const b=el&&el.parentNode.querySelector('button.btn.sm.ghost');if(b)b.innerHTML='📎 '+(docDraft&&docDraft.storagePath?'Sostituisci file':'Carica file');}
async function docLoadUrl(){if(!docDraft||!docDraft.storagePath||DEMO)return;try{const{data}=await sb.storage.from('allegati').createSignedUrl(docDraft.storagePath,3600);if(data){docUrl=data.signedUrl;docRefreshFile();}}catch(e){}}
/* VERSIONI: i vecchi file NON si cancellano quando sostituisci → restano come versioni precedenti */
async function docLoadVersions(){
  docVersions=[];
  if(!DEMO&&docDraft&&docDraft.id){try{
    const{data}=await sb.storage.from('allegati').list(TENANT_ID+'/doc/'+docDraft.id,{limit:100});
    const cur=(docDraft.storagePath||'').split('/').pop();
    docVersions=(data||[]).filter(o=>o.name&&o.name!==cur&&o.name!=='.emptyFolderPlaceholder').map(o=>({name:o.name,path:TENANT_ID+'/doc/'+docDraft.id+'/'+o.name}));
  }catch(e){}}
  docRenderVersions();
}
function docRenderVersions(){
  const el=$('#doc-versions');if(!el)return;
  if(!docVersions.length){el.innerHTML='';return;}
  el.innerHTML=`<label>🕘 Versioni precedenti (${docVersions.length})</label>`+docVersions.map((v,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-top:1px solid var(--line)"><span style="font-size:15px">📄</span><div style="flex:1;min-width:0;font-size:12px;color:var(--t2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(v.name.replace(/^[0-9a-f\-]{36}-/,''))}</div><button class="btn ghost sm" onclick="docRestoreVersion(${i})">Rendi corrente</button></div>`).join('');
}
async function docRestoreVersion(i){
  const v=docVersions[i];if(!v||!docDraft)return;
  docDraft.storagePath=v.path;docDraft.fileName=v.name.replace(/^[0-9a-f\-]{36}-/,'');docDraft.mime=docGuessMime(v.name);docUrl=null;
  await docLoadUrl();docRefreshFile();docLoadVersions();toast('↩ Versione resa corrente — salva per confermare');
}
async function docAddFile(ev){
  const f=ev.target.files&&ev.target.files[0]; ev.target.value=''; if(!f||!docDraft)return;
  if(f.size>25*1024*1024){toast('⚠ File oltre 25MB');return;}
  toast('📤 Carico il file…');
  /* leggo il contenuto (PDF) per capire meglio, poi auto-compilo i campi vuoti */
  let txt=''; if(/\.pdf$/i.test(f.name)||(f.type||'').includes('pdf'))txt=await docExtractPdfText(f);
  const g=docAutoDetect(f.name,txt);
  const setIfEmpty=(id,val)=>{const el=document.getElementById(id);if(el&&!el.value&&val)el.value=val;};
  setIfEmpty('doc-title',g.title);setIfEmpty('doc-cat',g.category);setIfEmpty('doc-forn',g.fornitore);setIfEmpty('doc-date',g.date);
  try{
    const path=TENANT_ID+'/doc/'+docDraft.id+'/'+uid()+'-'+String(f.name||'file').replace(/[^\w.\-]/g,'_');
    const{error}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'application/octet-stream'});
    if(error)throw error;
    docDraft.storagePath=path; docDraft.fileName=f.name||'file'; docDraft.mime=f.type||''; if(txt)docDraft.tipo=txt; docUrl=null;
    await docLoadUrl(); docRefreshFile(); docLoadVersions();
    toast(g.category?('✓ Caricato → «'+g.category+'»'):'✓ File caricato');
  }catch(e){toast('⚠ File: '+(e.message||e));}
}
function docDelFile(){if(!docDraft)return;docDraft.storagePath='';docDraft.fileName='';docDraft.mime='';docUrl=null;docRefreshFile();docLoadVersions();}
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
    vatNo:$('#doc-tags').value.trim(),               /* tag/parole chiave */
    clientId:($('#doc-cl')&&$('#doc-cl').value)||null,
    siteId:($('#doc-site')&&$('#doc-site').value)||null,
    pinned:!!($('#doc-pin')&&$('#doc-pin').checked),
    fileName:docDraft.fileName,storagePath:docDraft.storagePath,mime:docDraft.mime,
    tipo:docDraft.tipo||'archivio',               /* full-text estratto (riusa tipo) */
    amount:null,currency:null,payStatus:'na',paidDate:null
  };
  if(id){const d=byId(S.documents,id);if(d)Object.assign(d,data);}
  else{S.documents.unshift({id:docDraft.id,created:Date.now(),...data});if(data.category)docView=data.category;}
  docDraft=null;save();closeSheet();render();toast('✓ Documento salvato');
}
async function delDocument(id){
  if(!confirm('Eliminare il documento e tutte le sue versioni?'))return;
  try{if(!DEMO){const{data}=await sb.storage.from('allegati').list(TENANT_ID+'/doc/'+id,{limit:100});const paths=(data||[]).filter(o=>o.name).map(o=>TENANT_ID+'/doc/'+id+'/'+o.name);if(paths.length)await sb.storage.from('allegati').remove(paths);}}catch(e){}
  S.documents=S.documents.filter(x=>x.id!==id);docDraft=null;save();closeSheet();render();toast('Documento eliminato');
}
