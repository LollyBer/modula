/* ===== MODULO: FATTURE (con QR-fattura svizzera) =====
   Collegamenti: ← Clienti (destinatario) · → CONTI (le fatture PAGATE = entrate).
   Ruoli: solo titolare (come Conti). Dati azienda/IBAN in S.settings.billing.
   PDF: fattura HTML A4 + QR-fattura (libreria swissqrbill, import a richiesta) → Stampa/Salva PDF.
   Dipende dal core (S, uid, save, render, openSheet, closeSheet, esc, toast, isOwner,
   byId, cName, cOpt, fmtD, todayIso, moduleActive, $). */

/* ---- calcoli (arrotondamento svizzero a 5 cent) ---- */
const invSubtotal=f=>(f.lines||[]).reduce((t,l)=>t+((+l.qty||0)*(+l.price||0)),0);
const invVatAmount=f=>invSubtotal(f)*(+f.vatRate||0)/100;
const invTotal=f=>Math.round((invSubtotal(f)+invVatAmount(f))*20)/20;
const chf=n=>'CHF '+(Math.round((+n||0)*100)/100).toLocaleString('de-CH',{minimumFractionDigits:2,maximumFractionDigits:2});
const INV_ST={bozza:['Bozza','#9C9384'],inviata:['Inviata','#C77F12'],pagata:['Pagata','#2E9E5E']};

/* ===== DA FATTURARE — collegamento manutenzioni / cantieri / pellet → fatture =====
   Un elemento "completato" (manutenzione fatta · cantiere da fatturare · consegna consegnata)
   resta "da fatturare" finché non è incluso in una fattura. Il legame è una ref {t,id} sulla
   RIGA di fattura: `lines` è già jsonb → nessuna colonna nuova. Elimini la fattura → riappare. */
const billRefKey=(t,id)=>t+':'+id;
function billedRefSet(){const s=new Set();(S.invoices||[]).forEach(f=>(f.lines||[]).forEach(l=>{if(l&&l.ref&&l.ref.id)s.add(billRefKey(l.ref.t,l.ref.id));}));return s;}
function billableItems(){
  const done=billedRefSet();const out=[];
  const add=o=>{if(!done.has(billRefKey(o.type,o.id)))out.push(o);};
  if(moduleActive('man'))S.maintenances.filter(m=>m.status==='fatta').forEach(m=>add({type:'maintenance',id:m.id,clientId:m.clientId||null,clientRaw:m.clientRaw||null,date:m.date||null,label:m.title||'Manutenzione',amount:((typeof maintIncome==='function'?maintIncome(m):(m.price||0))||null)}));
  if(moduleActive('sites'))S.sites.filter(s=>s.status==='da_fatturare').forEach(s=>add({type:'site',id:s.id,clientId:s.clientId||null,clientRaw:s.clientRaw||null,date:s.closedDate||s.dueDate||null,label:'Lavori — '+s.name,amount:(+s.amount>0?+s.amount:null)}));
  if(moduleActive('pellet'))S.pellet.filter(p=>p.status==='consegnato').forEach(p=>add({type:'pellet',id:p.id,clientId:p.clientId||null,clientRaw:p.clientRaw||null,date:p.date||null,label:(p.kind==='sfuso'?'Pellet sfuso':'Consegna pellet')+(p.qty?' '+fmtQty(p.qty)+' '+(p.unit||''):''),amount:(p.price!=null?p.price:(typeof autoPrice==='function'?autoPrice(p):null))}));
  return out.sort((a,b)=>((a.date||'')<(b.date||'')?1:-1));
}
/* raggruppa per cliente: una fattura per cliente con dentro tutte le sue voci in sospeso */
function billableGroups(){
  const groups=new Map();
  billableItems().forEach(it=>{const key=it.clientId?('c:'+it.clientId):(it.clientRaw?('r:'+norm(it.clientRaw)):'x');
    if(!groups.has(key))groups.set(key,{clientId:it.clientId||null,clientRaw:it.clientRaw||null,name:(it.clientId?cName(it.clientId):it.clientRaw)||'(senza cliente in anagrafica)',items:[],total:0});
    const g=groups.get(key);g.items.push(it);g.total+=(+it.amount||0);});
  return [...groups.values()];
}
/* messaggio "da fatturare" mostrato alla fine di una manutenzione/cantiere/consegna (se Fatture è attivo) */
function billToast(){return moduleActive('fatture')?' · 🧾 da fatturare':'';}
/* crea una BOZZA di fattura con tutte le voci in sospeso di un cliente (righe con ref → escono dalla lista) */
function invoiceFromBillableGroup(i){
  const g=billableGroups()[i];if(!g){toast('Niente da fatturare');return;}
  const b=S.settings.billing||{};
  const lines=g.items.map(it=>({desc:it.label+(it.date?' · '+fmtD(it.date):''),qty:1,price:(it.amount!=null?it.amount:null),ref:{t:it.type,id:it.id}}));
  openInvoice(null,{clientId:g.clientId||'',lines,notes:b.footer||''});
  toast('🧾 Bozza da '+g.items.length+' voce'+(g.items.length>1?'/i':'')+' — controlla e salva');
}

/* ---- elenco ---- */
let invTab='tutte';
function renderFatture(){
  if(!can('fatture')){view='hub';renderHub();return;}
  const b=S.settings.billing||{};
  const list=[...S.invoices].sort((a,b)=>(a.date<b.date?1:a.date>b.date?-1:(b.created||0)-(a.created||0)));
  const shown=invTab==='tutte'?list:list.filter(f=>f.status===invTab);
  const nonPag=list.filter(f=>f.status!=='pagata'&&f.status!=='bozza');
  const daIncassare=nonPag.reduce((t,f)=>t+invTotal(f),0);
  const bGroups=billableGroups();const bCount=bGroups.reduce((n,g)=>n+g.items.length,0);const bTot=bGroups.reduce((t,g)=>t+g.total,0);
  const IC={maintenance:'🔧',site:'🏗',pellet:'🪵'};
  const billCard=bCount?`<div class="card" style="border-color:rgba(199,127,18,.45);margin-bottom:10px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <div style="font-weight:700">🧾 Da fatturare <span class="badge" style="border-color:var(--amber);color:var(--amber)">${bCount}</span></div>
      <div style="font-family:var(--mono);color:var(--amber);font-weight:700">${chf(bTot)}</div></div>
    <div class="subtle" style="font-size:11px;margin-bottom:8px">Manutenzioni fatte, cantieri da fatturare e consegne — raccolti qui finché non li metti in fattura.</div>
    ${bGroups.map((g,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--line)">
      <div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(g.name)}</div>
      <div class="subtle" style="font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${g.items.map(it=>(IC[it.type]||'•')+' '+esc(it.label)).join(' · ')}</div></div>
      <div style="text-align:right;flex-shrink:0"><div style="font-family:var(--mono);font-size:12px">${chf(g.total)}</div>
      <button class="btn sm pri" style="margin-top:3px" onclick="invoiceFromBillableGroup(${i})">Crea fattura</button></div>
    </div>`).join('')}
  </div>`:'';
  const tabs=[['tutte','Tutte'],['bozza','Bozze'],['inviata','Da incassare'],['pagata','Pagate']];
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>🧾 Fatture</div>
  ${(!b.iban||!b.name)?`<div class="card" style="border-color:rgba(199,127,18,.4)"><div style="font-size:13px">⚙️ Prima di emettere fatture, imposta <b>ragione sociale</b> e <b>IBAN</b> per la QR-fattura.</div><button class="btn sm pri" style="margin-top:8px" onclick="openBilling()">Imposta dati fatturazione</button></div>`:''}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:4px 0 12px">
    <div class="stat"><div class="subtle" style="font-size:11px">Da incassare</div><div style="font-size:18px;font-weight:700;color:var(--amber)">${chf(daIncassare)}</div></div>
    <div class="stat"><div class="subtle" style="font-size:11px">Fatture</div><div style="font-size:18px;font-weight:700">${list.length}</div></div>
  </div>
  ${billCard}
  <div style="display:flex;gap:7px;margin-bottom:10px">
    <button class="btn pri" style="flex:1" onclick="openInvoice()">+ Nuova fattura</button>
    <button class="btn ghost sm" onclick="openBilling()">⚙️</button>
  </div>
  <div class="tabs">${tabs.map(([id,l])=>`<div class="tb ${invTab===id?'on':''}" onclick="invTab='${id}';render()">${l}</div>`).join('')}</div>
  ${shown.length?shown.map(invRow).join(''):'<div class="card"><div class="empty"><div class="big">🧾</div>Nessuna fattura.</div></div>'}`;
}
function invRow(f){
  const st=INV_ST[f.status]||INV_ST.bozza;
  return `<div class="card" style="cursor:pointer" onclick="openInvoice('${f.id}')">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
      <div style="flex:1;min-width:0"><div style="font-weight:600">${esc(f.clientName||cName(f.clientId)||'—')}</div>
      <div class="subtle" style="font-size:11px">N. ${esc(f.number||'—')}${f.date?' · '+fmtD(f.date):''}</div></div>
      <div style="text-align:right"><div style="font-family:var(--mono);font-weight:700">${chf(invTotal(f))}</div>
      <span class="badge" style="border-color:${st[1]};color:${st[1]};font-size:9px">${st[0]}</span></div>
    </div></div>`;
}

/* ---- editor ---- */
let invDraft=null;
function nextInvNumber(){const b=S.settings.billing||{};const n=(+b.nextNumber||1);return (b.prefix||'')+String(n).padStart(4,'0');}
function openInvoice(id,preset){
  const b=S.settings.billing||{};
  const src=id?byId(S.invoices,id):null;
  invDraft=src?{...src,lines:(src.lines||[]).map(l=>({...l}))}:{id:uid(),number:nextInvNumber(),date:todayIso(),dueDate:addDaysIso(todayIso(),30),clientId:'',clientName:'',clientAddr:'',lines:[{desc:'',qty:1,price:null}],vatRate:(b.defaultVat!=null?b.defaultVat:8.1),notes:b.footer||'',status:'bozza',_new:true};
  if(!id&&preset){
    if(preset.clientId){invDraft.clientId=preset.clientId;invPickClient(preset.clientId);}
    if(preset.lines&&preset.lines.length)invDraft.lines=preset.lines.map(l=>({...l}));
    if(preset.notes!=null)invDraft.notes=preset.notes;
  }
  const st=invDraft.status;
  openSheet(`<h3>${id?'Fattura N. '+esc(invDraft.number):'Nuova fattura'} <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="frow">
     <div class="fld"><label>Cliente</label>${cliInput('iv-cl',invDraft.clientId)}</div>
     <div class="fld"><label>Data</label><input id="iv-date" type="date" value="${invDraft.date||todayIso()}"></div>
   </div>
   <div class="frow">
     <div class="fld"><label>Scadenza</label><input id="iv-due" type="date" value="${invDraft.dueDate||''}"></div>
     <div class="fld"><label>N. fattura</label><input id="iv-num" value="${esc(invDraft.number||'')}"></div>
   </div>
   <div class="fld"><label>Righe</label><div id="iv-lines">${invDraft.lines.map(invLineRow).join('')}</div>
     <button class="btn sm ghost" style="margin-top:6px" onclick="invAddLine()">+ Aggiungi riga</button></div>
   <div class="frow">
     <div class="fld"><label>IVA %</label><input id="iv-vat" type="number" inputmode="decimal" step="any" value="${invDraft.vatRate!=null?invDraft.vatRate:''}" oninput="invRefreshTot()"></div>
     <div class="fld"><label>Stato</label><select id="iv-status">${Object.keys(INV_ST).map(k=>`<option value="${k}" ${st===k?'selected':''}>${INV_ST[k][0]}</option>`).join('')}</select></div>
   </div>
   <div id="iv-tot" style="text-align:right;font-size:13px;margin:4px 0 8px">${invTotHTML()}</div>
   <div class="fld"><label>Note / piè di pagina</label><textarea id="iv-notes" rows="2" placeholder="Grazie · condizioni di pagamento…">${esc(invDraft.notes||'')}</textarea></div>
   <div class="actions">
     ${id?`<button class="btn danger" onclick="delInvoice('${id}')">Elimina</button>`:''}
     <button class="btn ghost" onclick="closeSheet()">Annulla</button>
     ${id?`<button class="btn" onclick="printInvoice('${id}')">🖨 Stampa / PDF</button>`:''}
     <button class="btn pri" onclick="saveInvoice('${id||''}')">Salva</button>
   </div>`);
}
function invLineRow(l,i){
  const idx=i!=null?i:0;
  return `<div class="frow" data-i="${idx}" style="gap:6px;margin-bottom:5px">
    <input style="flex:2" placeholder="Descrizione" value="${esc(l.desc||'')}" oninput="invLine(${idx},'desc',this.value)">
    <input style="flex:.6" type="number" inputmode="decimal" step="any" placeholder="q.tà" value="${l.qty!=null?l.qty:''}" oninput="invLine(${idx},'qty',this.value)">
    <input style="flex:.9" type="number" inputmode="decimal" step="any" placeholder="prezzo" value="${l.price!=null?l.price:''}" oninput="invLine(${idx},'price',this.value)">
    <button class="btn ghost sm" onclick="invDelLine(${idx})" style="flex:0 0 auto">✕</button></div>`;
}
function invLine(i,field,val){if(!invDraft||!invDraft.lines[i])return;invDraft.lines[i][field]=(field==='desc')?val:(parseFloat(val)||0);invRefreshTot();}
function invAddLine(){if(!invDraft)return;invDraft.lines.push({desc:'',qty:1,price:null});const el=$('#iv-lines');if(el)el.innerHTML=invDraft.lines.map(invLineRow).join('');invRefreshTot();}
function invDelLine(i){if(!invDraft)return;invDraft.lines.splice(i,1);if(!invDraft.lines.length)invDraft.lines.push({desc:'',qty:1,price:null});const el=$('#iv-lines');if(el)el.innerHTML=invDraft.lines.map(invLineRow).join('');invRefreshTot();}
function invTotHTML(){const f=invDraft||{lines:[]};f.vatRate=$('#iv-vat')?(parseFloat($('#iv-vat').value)||0):f.vatRate;return `Imponibile <b>${chf(invSubtotal(f))}</b> · IVA <b>${chf(invVatAmount(f))}</b> · <span style="font-size:15px">Totale <b style="color:var(--cy)">${chf(invTotal(f))}</b></span>`;}
function invRefreshTot(){const el=$('#iv-tot');if(el)el.innerHTML=invTotHTML();}
function invPickClient(cid){if(!invDraft)return;invDraft.clientId=cid;const c=byId(S.clients,cid);if(c){invDraft.clientName=c.name||((c.firstName||'')+' '+(c.lastName||'')).trim();invDraft.clientAddr=[[c.street||c.address||'',c.streetNo||''].filter(Boolean).join(' '),[c.cap||'',c.town||''].filter(Boolean).join(' ')].filter(Boolean).join(', ');}}
function saveInvoice(id){
  if(!invDraft)return;
  invDraft.clientId=$('#iv-cl')?$('#iv-cl').value:invDraft.clientId;
  if(!invDraft.clientId){toast('Scegli il cliente');return;}
  invPickClient(invDraft.clientId);
  invDraft.date=$('#iv-date').value||todayIso();
  invDraft.dueDate=$('#iv-due').value||null;
  invDraft.number=$('#iv-num').value.trim()||invDraft.number;
  invDraft.vatRate=parseFloat($('#iv-vat').value)||0;
  invDraft.notes=$('#iv-notes').value.trim();
  const newStatus=$('#iv-status').value;
  if(newStatus==='pagata'&&invDraft.status!=='pagata'&&!invDraft.paidDate)invDraft.paidDate=todayIso();
  if(newStatus!=='pagata')invDraft.paidDate=null;
  invDraft.status=newStatus;
  const isNew=!id;
  if(id){const f=byId(S.invoices,id);if(f)Object.assign(f,invDraft);}
  else S.invoices.unshift({...invDraft,created:Date.now()});
  if(isNew){const b=S.settings.billing||{};b.nextNumber=(+b.nextNumber||1)+1;S.settings.billing=b;}
  invDraft=null;save();closeSheet();render();toast('✓ Fattura salvata');
}
function delInvoice(id){if(!confirm('Eliminare la fattura?'))return;S.invoices=S.invoices.filter(x=>x.id!==id);invDraft=null;save();closeSheet();render();toast('Fattura eliminata');}

/* pre-compila una BOZZA di fattura da un cantiere: cliente + importo concordato,
   o ore totali dai rapportini, + materiali usati in nota. Poi il titolare rivede e salva. */
function invoiceFromSite(siteId){
  const s=byId(S.sites,siteId); if(!s){toast('Cantiere non trovato');return;}
  const reps=(typeof repForSite==='function')?repForSite(siteId):[];
  const hours=reps.reduce((t,r)=>t+(+r.hours||0),0);
  const b=S.settings.billing||{};
  const lines=[];
  if(+s.amount>0) lines.push({desc:'Lavori — '+s.name, qty:1, price:+s.amount});
  else if(hours>0) lines.push({desc:'Manodopera — '+s.name+' ('+fmtQty(hours)+' h)', qty:hours, price:(b.hourlyRate!=null?b.hourlyRate:null)});
  else lines.push({desc:'Lavori — '+s.name, qty:1, price:null});
  lines.forEach(l=>l.ref={t:'site',id:s.id}); /* collega la riga al cantiere → esce da "Da fatturare" */
  const mats=reps.map(r=>r.materials).filter(Boolean);
  const notes=(mats.length?('Materiali: '+mats.join('; ')+'\n'):'')+(b.footer||'');
  openInvoice(null,{clientId:s.clientId||'', lines, notes});
  toast('🧾 Bozza precompilata dal cantiere — controlla e salva');
}

/* ---- impostazioni fatturazione (azienda + IBAN) ---- */
function openBilling(){
  const b=S.settings.billing||{};
  openSheet(`<h3>⚙️ Dati fatturazione <span class="x" onclick="closeSheet()">✕</span></h3>
   <div class="fld"><label>Ragione sociale</label><input id="b-name" value="${esc(b.name||S.settings.companyName||'')}" placeholder="Impresa Edile Rossi Sagl"></div>
   <div class="frow">
     <div class="fld" style="flex:2"><label>Indirizzo (via e n.)</label><input id="b-addr" value="${esc(b.address||'')}" placeholder="Via Lugano 12"></div>
   </div>
   <div class="frow">
     <div class="fld"><label>CAP</label><input id="b-zip" value="${esc(b.zip||'')}" placeholder="6900"></div>
     <div class="fld" style="flex:2"><label>Località</label><input id="b-city" value="${esc(b.city||'')}" placeholder="Lugano"></div>
   </div>
   <div class="fld"><label>IBAN / QR-IBAN</label><input id="b-iban" class="mono" value="${esc(b.iban||'')}" placeholder="CH.. .... .... .... .... ."></div>
   <div class="frow">
     <div class="fld"><label>P. IVA (facolt.)</label><input id="b-vatno" value="${esc(b.vatNo||'')}" placeholder="CHE-123.456.789 IVA"></div>
     <div class="fld"><label>IVA % default</label><input id="b-dvat" type="number" inputmode="decimal" step="any" value="${b.defaultVat!=null?b.defaultVat:8.1}"></div>
   </div>
   <div class="fld"><label>Tariffa oraria CHF <span class="subtle">(per fatturare i cantieri a ore)</span></label><input id="b-hourly" type="number" inputmode="decimal" step="any" value="${b.hourlyRate!=null?b.hourlyRate:''}" placeholder="es. 75"></div>
   <div class="frow">
     <div class="fld"><label>Prefisso numero</label><input id="b-prefix" value="${esc(b.prefix||'')}" placeholder="2026-"></div>
     <div class="fld"><label>Prossimo numero</label><input id="b-next" type="number" value="${b.nextNumber!=null?b.nextNumber:1}"></div>
   </div>
   <div class="fld"><label>Piè di pagina default</label><textarea id="b-footer" rows="2" placeholder="Pagamento a 30 giorni. Grazie.">${esc(b.footer||'')}</textarea></div>
   <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveBilling()">Salva</button></div>`);
}
function saveBilling(){
  const b=Object.assign({},S.settings.billing||{});
  b.name=$('#b-name').value.trim();b.address=$('#b-addr').value.trim();b.zip=$('#b-zip').value.trim();b.city=$('#b-city').value.trim();
  b.iban=$('#b-iban').value.replace(/\s/g,'').trim();b.vatNo=$('#b-vatno').value.trim();
  b.defaultVat=parseFloat($('#b-dvat').value);if(isNaN(b.defaultVat))b.defaultVat=8.1;
  b.hourlyRate=parseFloat($('#b-hourly').value);if(isNaN(b.hourlyRate))b.hourlyRate=null;
  b.prefix=$('#b-prefix').value;b.nextNumber=parseInt($('#b-next').value)||1;b.footer=$('#b-footer').value.trim();
  S.settings.billing=b;save();closeSheet();render();toast('✓ Dati fatturazione salvati');
}

/* ---- stampa / PDF con QR-fattura ---- (addDaysIso è globale, definito in pellet.js) */
async function invGenQR(f,b){
  const [svg,utils]=await Promise.all([import('https://esm.sh/swissqrbill@4/svg'),import('https://esm.sh/swissqrbill@4/utils')]);
  const acc=(b.iban||'').replace(/\s/g,'');
  const base={currency:'CHF',amount:invTotal(f),creditor:{account:acc,name:b.name,address:b.address||'',zip:b.zip||'',city:b.city||'',country:'CH'}};
  if(utils.isQRIBAN(acc)){const digits=(f.number||'').replace(/\D/g,'')||'1';const ref=digits.padStart(26,'0').slice(-26);base.reference=ref+utils.calculateQRReferenceChecksum(ref);}
  const cl=byId(S.clients,f.clientId);
  const withDeb=Object.assign({},base);
  if(cl&&cl.cap&&cl.town)withDeb.debtor={name:f.clientName||cl.name,address:[cl.street||cl.address||'',cl.streetNo||''].filter(Boolean).join(' ')||cl.town,zip:cl.cap,city:cl.town,country:'CH'};
  try{return new svg.SwissQRBill(withDeb).toString();}catch(e){try{return new svg.SwissQRBill(base).toString();}catch(e2){return '';}}
}
async function printInvoice(id){
  const f=byId(S.invoices,id);if(!f)return;
  const b=S.settings.billing||{};
  if(!b.iban||!b.name){toast('Prima imposta ragione sociale e IBAN');return openBilling();}
  toast('🧾 Preparo la fattura…');
  let qr='';try{qr=await invGenQR(f,b);}catch(e){toast('⚠ QR non generato (fattura stampata senza QR)');}
  const w=window.open('','_blank');
  if(!w){toast('Consenti i popup per stampare/salvare il PDF');return;}
  w.document.write(invoiceHTML(f,b,qr));w.document.close();
  setTimeout(()=>{try{w.focus();w.print();}catch(e){}},600);
}
function invoiceHTML(f,b,qrSvg){
  const rows=(f.lines||[]).filter(l=>l.desc||l.price).map(l=>`<tr><td>${esc(l.desc||'')}</td><td class="r">${(+l.qty||0)}</td><td class="r">${chf(l.price)}</td><td class="r">${chf((+l.qty||0)*(+l.price||0))}</td></tr>`).join('');
  const st=INV_ST[f.status]||INV_ST.bozza;
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Fattura ${esc(f.number||'')}</title>
  <style>
   *{box-sizing:border-box}body{font-family:-apple-system,Arial,sans-serif;color:#1a1a1a;margin:0;padding:22mm 18mm}
   .top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:26px}
   .co{font-size:15px;font-weight:700}.co small{display:block;font-weight:400;font-size:12px;color:#555;margin-top:3px;line-height:1.5}
   h1{font-size:22px;margin:0}.meta{font-size:12px;color:#555;text-align:right;line-height:1.6}
   .to{margin:18px 0 8px}.to .lab{font-size:10px;letter-spacing:1px;color:#888;text-transform:uppercase}.to b{font-size:14px}
   table{width:100%;border-collapse:collapse;margin-top:14px;font-size:13px}
   th{text-align:left;border-bottom:2px solid #333;padding:7px 6px;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
   td{padding:7px 6px;border-bottom:1px solid #e5e5e5}.r{text-align:right}
   .tot{margin-top:12px;margin-left:auto;width:52%;font-size:13px}
   .tot .rowt{display:flex;justify-content:space-between;padding:5px 6px}.tot .big{border-top:2px solid #333;font-size:16px;font-weight:700;margin-top:3px}
   .notes{margin-top:22px;font-size:12px;color:#555;white-space:pre-wrap;border-top:1px solid #e5e5e5;padding-top:10px}
   .qrwrap{margin-top:26px}.qrwrap svg{width:100%;height:auto;display:block}
   @media print{body{padding:14mm 14mm}.qrwrap{page-break-inside:avoid}}
  </style></head><body>
   <div class="top">
     <div class="co">${esc(b.name||'')}<small>${esc(b.address||'')}${b.zip||b.city?'<br>'+esc((b.zip||'')+' '+(b.city||'')):''}${b.vatNo?'<br>'+esc(b.vatNo):''}</small></div>
     <div><h1>Fattura</h1><div class="meta">N. ${esc(f.number||'')}<br>Data: ${f.date?fmtD(f.date):''}${f.dueDate?'<br>Scadenza: '+fmtD(f.dueDate):''}<br>Stato: ${st[0]}</div></div>
   </div>
   <div class="to"><div class="lab">Fattura a</div><b>${esc(f.clientName||'')}</b><br><span style="color:#555">${esc(f.clientAddr||'')}</span></div>
   <table><thead><tr><th>Descrizione</th><th class="r">Q.tà</th><th class="r">Prezzo</th><th class="r">Totale</th></tr></thead><tbody>${rows||'<tr><td colspan="4" style="color:#999">Nessuna riga</td></tr>'}</tbody></table>
   <div class="tot">
     <div class="rowt"><span>Imponibile</span><b>${chf(invSubtotal(f))}</b></div>
     <div class="rowt"><span>IVA ${(+f.vatRate||0)}%</span><b>${chf(invVatAmount(f))}</b></div>
     <div class="rowt big"><span>Totale</span><b>${chf(invTotal(f))}</b></div>
   </div>
   ${f.notes?`<div class="notes">${esc(f.notes)}</div>`:''}
   ${qrSvg?`<div class="qrwrap">${qrSvg}</div>`:''}
  </body></html>`;
}
