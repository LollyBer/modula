/* ===== MODULO BASE: CLIENTI ===== */
/* Estratto da ptek. Dipende dal core (S, esc, nav, save, openSheet, fmtQty, segPick...). */

/* ================= CLIENTI ================= */
let cliQ='';let cliGroup='all';let cliTown='all';let cliMaint='all';
const clientGroups=()=>[...new Set(S.clients.map(c=>c.group).filter(Boolean))].sort();
const clientZones=()=>[...new Set(S.clients.map(c=>c.zone).filter(Boolean))].sort();
const cTown=c=>c.town||c.zone||'';
const clientTowns=()=>[...new Set(S.clients.map(cTown).filter(Boolean))].sort();
const cInitials=n=>{const p=String(n||'').trim().split(/\s+/);return((((p[0]||'')[0]||'')+((p[1]||'')[0]||'')).toUpperCase())||'?';};
const AV_COLORS=['#5BA02C','#2E9E5E','#C77F12','#E2722E','#A9742F','#D64528'];
const avColor=n=>AV_COLORS[Math.abs([...String(n||'')].reduce((h,c)=>(h*31+c.charCodeAt(0))|0,0))%AV_COLORS.length];
function renderClients(){
  const q=norm(cliQ);
  let list=S.clients.filter(c=>!q||norm(c.name+' '+cTown(c)+' '+(c.group||'')+' '+(c.phone||'')+' '+(c.street||'')).includes(q));
  if(cliGroup!=='all')list=list.filter(c=>c.group===cliGroup);
  if(cliTown!=='all')list=list.filter(c=>cTown(c)===cliTown);
  if(cliMaint==='si')list=list.filter(c=>c.maintenance==='si');
  else if(cliMaint==='no')list=list.filter(c=>c.maintenance!=='si');
  const groups=clientGroups();const towns=clientTowns();
  const PL={'Stufa':'🔥','Caldaia':'♨️','Camino':'🪵'};
  const fld=inner=>`<div class="fld" style="margin-bottom:0;flex:1;min-width:130px">${inner}</div>`;
  const filterBar=`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">
    ${towns.length?fld(`<select onchange="cliTown=this.value;render()"><option value="all"${cliTown==='all'?' selected':''}>📍 Tutti i paesi</option>${towns.map(t=>`<option value="${esc(t)}"${cliTown===t?' selected':''}>${esc(t)}</option>`).join('')}</select>`):''}
    ${groups.length?fld(`<select onchange="cliGroup=this.value;render()"><option value="all"${cliGroup==='all'?' selected':''}>🗂 Tutti i gruppi</option>${groups.map(g=>`<option value="${esc(g)}"${cliGroup===g?' selected':''}>${esc(g)}</option>`).join('')}</select>`):''}
    ${fld(`<select onchange="cliMaint=this.value;render()"><option value="all"${cliMaint==='all'?' selected':''}>🔧 Manut.: tutti</option><option value="si"${cliMaint==='si'?' selected':''}>🔧 Fa manutenzione</option><option value="no"${cliMaint==='no'?' selected':''}>✗ No manutenzione</option></select>`)}
  </div>`;
  const shown=(cliGroup!=='all'||cliTown!=='all'||cliMaint!=='all'||q)?` <span class="subtle">· ${list.length} filtrati</span>`:'';
  const itemHTML=c=>{
    const nm=S.maintenances.filter(m=>m.clientId===c.id).length;
    const np=S.pellet.filter(p=>p.clientId===c.id).length;
    const col=c.blocked?'#D64528':avColor(c.name);
    const tags=[
      c.plant?c.plant.split(', ').map(x=>(PL[x]||'⚙️')+' '+x).join(' '):'',
      c.pellet==='sfuso'?'🪵 sfuso':c.pellet==='sacchi'?'📦 sacchi':'',
      c.maintenance==='si'?'🔧 manut.':c.maintenance==='no'?'✗ no manut.':''
    ].filter(Boolean);
    return`<div class="item" onclick="openClient('${c.id}')">
    <div style="width:38px;height:38px;border-radius:50%;background:${col}22;color:${col};border:1px solid ${col}55;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">${esc(cInitials(c.name))}</div>
    <div class="bd"><div class="ti"${c.blocked?' style="color:var(--coral)"':''}>${esc(c.name)}${c.blocked?' <span class="badge" style="border-color:var(--coral);color:var(--coral)">🚫 BLOCCATO</span>':''}</div>
    <div class="su">${esc([c.group,c.phone].filter(Boolean).join(' · '))||'—'}</div>
    <div class="mt">${tags.map(t=>`<span class="badge" style="border-color:var(--line2);color:var(--t2);margin-right:5px">${esc(t)}</span>`).join('')}${nm?' 🔧'+nm:''}${np?' 🪵'+np:''}</div></div>${c.phone?`<a href="tel:${esc(c.phone)}" onclick="event.stopPropagation()" class="avat" style="width:34px;height:34px;border:1px solid rgba(46,158,94,.35);color:var(--teal);text-decoration:none;font-size:14px;margin-top:2px">📞</a>`:''}</div>`;
  };
  // raggruppa per Paese (tutto già diviso)
  const byTown={};list.forEach(c=>{const k=cTown(c)||'— senza paese —';(byTown[k]=byTown[k]||[]).push(c);});
  const townKeys=Object.keys(byTown).sort((a,b)=>a.localeCompare(b));
  const body=list.length?townKeys.map(tk=>{
    const cls=byTown[tk].sort((a,b)=>a.name.localeCompare(b.name));
    return `<div style="display:flex;align-items:center;gap:8px;margin:14px 2px 7px;font-family:var(--disp);font-weight:700;font-size:13px;color:var(--t2)"><span style="color:var(--teal)">📍 ${esc(tk)}</span><span class="badge" style="border-color:var(--line2);color:var(--t3)">${cls.length}</span></div>
      <div class="card clients-grid">${cls.map(itemHTML).join('')}</div>`;
  }).join(''):'<div class="card"><div class="empty"><div class="big">👥</div>Nessun cliente con questi filtri.</div></div>';
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--teal)"></span>Clienti <span class="subtle">(${S.clients.length})</span>${shown}</div>
  <input class="searchbar" placeholder="🔍 Cerca nome, paese, gruppo, telefono, via…" value="${esc(cliQ)}" oninput="cliQ=this.value;render();this.focus();this.setSelectionRange(this.value.length,this.value.length)">
  ${filterBar}
  ${body}
  <button class="fab" onclick="editClient(null)">+</button>`;
}
function openClient(id){
  const c=byId(S.clients,id);if(!c)return;
  const man=S.maintenances.filter(m=>m.clientId===id).sort((a,b)=>((a.date||'')>(b.date||'')?-1:1));
  const pel=S.pellet.filter(p=>p.clientId===id).sort((a,b)=>((a.date||'')>(b.date||'')?-1:1));
  const sit=S.sites.filter(s=>s.clientId===id);
  const app=S.appointments.filter(a=>a.clientId===id);
  const not=S.notes.filter(n=>n.clientId===id&&!n.archived);
  const mini=(arr,fmt,n=6)=>arr.slice(0,n).map(fmt).join('');
  const info=[
    c.plant?['Impianto',c.plant]:null,
    c.pellet?['Pellet',c.pellet==='no'?'non lo prende':c.pellet]:null,
    c.maintenance?['Manutenzione',c.maintenance==='si'?'sì, la fa':'no']:null,
    c.group?['Gruppo',c.group]:null,
    cTown(c)?['Paese',cTown(c)]:null,
  ].filter(Boolean);
  openSheet(`<h3>${c.blocked?'🚫 ':''}${esc(c.name)} <span class="x" onclick="closeSheet()">✕</span></h3>
  ${c.blocked?`<div class="card" style="border-color:var(--coral);background:rgba(214,69,40,.08);padding:10px 12px;margin-bottom:10px;color:var(--coral)">🚫 <b>Cliente bloccato.</b> Non puoi assegnargli nuovi lavori finché non lo sblocchi.</div>`:''}
  <div class="subtle" style="margin-bottom:10px">
    ${c.phone?`📞 <a href="tel:${esc(c.phone)}" style="color:var(--cy)">${esc(c.phone)}</a><br>`:''}
    ${c.email?'✉️ '+esc(c.email)+'<br>':''}
    ${cAddr(c)?'📍 '+esc(cAddr(c))+'<br>':''}
    ${c.notes?'✎ '+esc(c.notes):''}
  </div>
  ${info.length?`<div class="fld"><label>Profilo</label><div style="display:flex;flex-wrap:wrap;gap:6px">${info.map(([k,v])=>`<span class="badge" style="border-color:var(--line2);color:var(--t1);padding:5px 10px;font-size:11px">${k}: <b>${esc(v)}</b></span>`).join('')}</div></div>`:''}
  <div class="fld"><label>📜 Storico</label>
  ${man.length?`<div class="subtle" style="margin:4px 0 2px;color:var(--amber)">🔧 Manutenzioni (${man.length})</div>${mini(man,m=>`<div class="subtle" style="padding:2px 0 2px 8px">• ${m.date?fmtD(m.date):m.status} — ${esc(m.title)}${m.report?' 📄':''}</div>`)}`:''}
  ${pel.length?`<div class="subtle" style="margin:8px 0 2px;color:var(--fire)">🪵 Pellet (${pel.length})</div>${mini(pel,p=>`<div class="subtle" style="padding:2px 0 2px 8px">• ${p.date?fmtD(p.date):p.status} — ${fmtQty(p.qty||0)} ${esc(p.unit||'sacchi')} ${p.kind==='sfuso'?'🪵':'📦'}</div>`)}`:''}
  ${sit.length?`<div class="subtle" style="margin:8px 0 2px;color:var(--blue)">🏗 Cantieri (${sit.length})</div>${mini(sit,s=>`<div class="subtle" style="padding:2px 0 2px 8px">• ${esc(s.name)} (${s.status})</div>`)}`:''}
  ${app.length?`<div class="subtle" style="margin:8px 0 2px;color:var(--cy)">📅 Appuntamenti (${app.length})</div>${mini(app,a=>`<div class="subtle" style="padding:2px 0 2px 8px">• ${fmtD(a.date)} — ${esc(a.title)}</div>`)}`:''}
  ${not.length?`<div class="subtle" style="margin:8px 0 2px;color:var(--teal)">📝 Note (${not.length})</div>${mini(not,n=>`<div class="subtle" style="padding:2px 0 2px 8px">• ${esc(n.text)}</div>`)}`:''}
  ${!man.length&&!pel.length&&!sit.length&&!app.length&&!not.length?'<div class="subtle">Ancora vuoto — si riempirà da solo man mano che registri.</div>':''}
  </div>
  <div class="fld"><label>⚙️ Macchine installate</label><div id="cli-machines"><div class="subtle">…</div></div></div>
  <div class="fld"><label>📷 Foto e file del cliente</label><div id="cli-att"><div class="subtle">…</div></div></div>
  <div class="actions" style="flex-wrap:wrap">
    <button class="btn danger" onclick="delClient('${id}')">Elimina</button>
    <button class="btn" style="border-color:var(--blue);color:var(--blue)" onclick="zoneFocusClient('${id}')">📍 Mappa</button>
    <button class="btn" style="border-color:var(--teal);color:var(--teal)" onclick="openClientGeo('${id}')">🎯 Posizione${(c.lat!=null&&c.lng!=null)?' ✓':''}</button>
    <button class="btn" style="border-color:var(--coral);color:var(--coral)" onclick="toggleBlock('${id}')">${c.blocked?'🔓 Sblocca':'🚫 Blocca'}</button>
    <button class="btn pri" onclick="editClient('${id}')">Modifica</button></div>`);
  if(typeof macRenderClientMachines==='function') macRenderClientMachines(id,'cli-machines');
  loadClientAtt(id);
}
function toggleBlock(id){const c=byId(S.clients,id);if(!c)return;c.blocked=!c.blocked;save();closeSheet();render();toast(c.blocked?'🚫 Cliente bloccato':'🔓 Cliente sbloccato');}
function editClient(id){
  const c=id?byId(S.clients,id):{name:'',phone:'',address:'',zone:'',group:'',plant:'',pellet:'',maintenance:'',notes:''};
  const groups=clientGroups();
  const seg=(idd,opts,cur)=>`<div class="seg" id="${idd}">${opts.map(([v,l])=>`<div class="sg ${cur===v?'on':''}" data-v="${v}" onclick="segPick(this)">${l}</div>`).join('')}</div>`;
  openSheet(`<h3>${id?'Modifica cliente':'Nuovo cliente'} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="frow"><div class="fld"><label>Nome</label><input id="cl-fn" value="${esc(c.firstName||c.name||'')}"></div>
  <div class="fld"><label>Cognome</label><input id="cl-ln" value="${esc(c.lastName||'')}"></div></div>
  <div class="frow"><div class="fld"><label>Telefono</label><input id="cl-p" inputmode="tel" value="${esc(c.phone||'')}"></div>
  <div class="fld"><label>Email</label><input id="cl-em" inputmode="email" value="${esc(c.email||'')}"></div></div>
  <div class="frow"><div class="fld" style="flex:3"><label>Via</label><input id="cl-st" value="${esc(c.street||c.address||'')}"></div>
  <div class="fld" style="flex:1"><label>N°</label><input id="cl-snr" value="${esc(c.streetNo||'')}"></div></div>
  <div class="frow"><div class="fld" style="flex:1"><label>CAP</label><input id="cl-cap" inputmode="numeric" value="${esc(c.cap||'')}"></div>
  <div class="fld" style="flex:2"><label>Paese</label><input id="cl-tw" list="cl-twlist" value="${esc(c.town||c.zone||'')}" placeholder="es. Grono, Roveredo"><datalist id="cl-twlist">${clientTowns().map(t=>`<option value="${esc(t)}">`).join('')}</datalist></div></div>
  <div class="fld"><label>Gruppo (scrivi o scegli)</label><input id="cl-g" list="cl-glist" value="${esc(c.group||'')}" placeholder="es. Grono e dintorni, Gruppo A"><datalist id="cl-glist">${groups.map(g=>`<option value="${esc(g)}">`).join('')}</datalist></div>
  <div class="fld"><label>Tipo impianto (anche più di uno)</label><div class="seg" id="cl-pl">${[['Stufa','🔥 Stufa'],['Caldaia','♨️ Caldaia'],['Camino','🪵 Camino']].map(([v,l])=>`<div class="sg ${(c.plant||'').includes(v)?'on':''}" data-v="${v}" onclick="this.classList.toggle('on')">${l}</div>`).join('')}</div></div>
  ${typeof MACHINES!=='undefined'?`<div class="fld"><label>⚙️ Macchina dal catalogo (collega al cliente; gestione completa nella scheda)</label><div class="seg" id="cl-mac" style="flex-wrap:wrap;gap:7px">${MACHINES.map(m=>`<div class="sg" data-v="${esc(m.id)}" onclick="this.classList.toggle('on')">${esc(m.marca+' '+m.nome)}</div>`).join('')}</div></div>`:''}
  <div class="fld"><label>Prende pellet?</label>${seg('cl-pe',[['sfuso','🪵 Sfuso'],['sacchi','📦 Sacchi'],['no','No'],['','—']],c.pellet||'')}</div>
  <div class="fld"><label>Fa la manutenzione?</label>${seg('cl-ma',[['si','✓ Sì'],['no','✗ No'],['','—']],c.maintenance||'')}</div>
  <div class="fld"><label>Note</label><textarea id="cl-no">${esc(c.notes||'')}</textarea></div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveClient('${id||''}')">Salva</button></div>`);
}
function saveClient(id){
  const fn=$('#cl-fn').value.trim(),ln=$('#cl-ln').value.trim();
  const name=(fn+' '+ln).trim();if(!name){toast('Manca il nome');return;}
  const sv=idd=>$('#'+idd+' .sg.on')?.dataset.v||'';
  const plant=[...document.querySelectorAll('#cl-pl .sg.on')].map(x=>x.dataset.v).join(', ');
  const st=$('#cl-st').value.trim(),snr=$('#cl-snr').value.trim(),cap=$('#cl-cap').value.trim(),tw=$('#cl-tw').value.trim();
  const address=[[st,snr].filter(Boolean).join(' '),[cap,tw].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  const data={name,firstName:fn,lastName:ln,phone:$('#cl-p').value.trim(),email:$('#cl-em').value.trim(),street:st,streetNo:snr,cap:cap,town:tw,address,group:$('#cl-g').value.trim(),plant,pellet:sv('cl-pe'),maintenance:sv('cl-ma'),notes:$('#cl-no').value.trim()};
  if(!data.group&&typeof zoneOfClient==='function'){const _z=zoneOfClient(data);if(_z)data.group=ZONE_LABEL(_z);} // gruppo = zona dal paese
  let cid=id;
  if(id){Object.assign(byId(S.clients,id),data);}else{cid=uid();S.clients.unshift({id:cid,created:Date.now(),...data});}
  const macSel=[...document.querySelectorAll('#cl-mac .sg.on')].map(x=>x.dataset.v);
  save();closeSheet();render();toast('👥 Salvato');
  if(macSel.length&&typeof macLinkClientMachines==='function')macLinkClientMachines(cid,macSel);
}
/* cancellazione cliente a cascata (GDPR art.17): rimuove anche figli + foto/file nello Storage */
async function delClient(id){
  const c=byId(S.clients,id);if(!c)return;
  const man=S.maintenances.filter(m=>m.clientId===id);
  const app=S.appointments.filter(a=>a.clientId===id);
  const pel=S.pellet.filter(p=>p.clientId===id);
  const sit=S.sites.filter(s=>s.clientId===id);
  const not=S.notes.filter(n=>n.clientId===id);
  const cal=S.callLog.filter(x=>x.clientId===id);
  const atts=sit.flatMap(s=>s.attachments||[]);
  const parts=[];
  if(man.length)parts.push(man.length+' manutenzioni');
  if(app.length)parts.push(app.length+' appuntamenti');
  if(pel.length)parts.push(pel.length+' consegne pellet');
  if(sit.length)parts.push(sit.length+' cantieri');
  if(not.length)parts.push(not.length+' note');
  if(atts.length)parts.push(atts.length+' foto/file');
  if(!confirm(`Eliminare DEFINITIVAMENTE il cliente "${c.name}"?`+(parts.length?'\n\nVerranno cancellati anche:\n• '+parts.join('\n• '):'')+'\n\nNon si può annullare. (In alternativa puoi BLOCCARE il cliente.)'))return;
  try{
    const paths=atts.map(a=>a.storagePath).filter(Boolean);
    if(paths.length)await sb.storage.from('allegati').remove(paths);
    const aids=atts.map(a=>a.id);
    if(aids.length)await sb.from('attachments').delete().in('id',aids);
    // foto/file collegati direttamente al cliente: rimuovi i file dallo Storage (le righe spariscono via cascade FK)
    const{data:cAtt}=await sb.from('client_attachments').select('storage_path').eq('client_id',id);
    const cPaths=(cAtt||[]).map(r=>r.storage_path).filter(Boolean);
    if(cPaths.length)await sb.storage.from('allegati').remove(cPaths);
  }catch(e){toast('⚠ Pulizia allegati: '+(e.message||e));}
  S.maintenances=S.maintenances.filter(m=>m.clientId!==id);
  S.appointments=S.appointments.filter(a=>a.clientId!==id);
  S.pellet=S.pellet.filter(p=>p.clientId!==id);
  S.sites=S.sites.filter(s=>s.clientId!==id);
  S.notes=S.notes.filter(n=>n.clientId!==id);
  S.callLog=S.callLog.filter(x=>x.clientId!==id);
  S.clients=S.clients.filter(x=>x.id!==id);
  save();closeSheet();render();toast('🗑 Cliente e dati collegati eliminati');
}


