/* ============================================================
   FABBRICA — SCHELETRO MODULO NUOVO  (reparto Laboratorio)
   Copia in modules-extra/<id>/<id>.js e sostituisci i segnaposto:
     __ID__    id kebab, es. prenota        __NOME__  PascalCase, es. Prenota
     __IC__    emoji menù, es. 🗓️           __LABEL__ etichetta menù, es. Prenotazioni
     __ARR__   nome array in S, es. prenotazioni
   Poi esegui gli "AGGANCI NEL CORE" elencati in fondo. Regole: FABBRICA/LABORATORIO.md
   Niente dati reali — solo struttura + segnaposto. esc() su OGNI testo utente.
   ============================================================ */

/* ===== MODULO EXTRA: __NOME__ ===== */

/* --- B · CARD HUB: il modulo emerge in homepage ---
   La typeof-guard nell'Hub la chiama solo se il modulo è incluso. */
function __ID__HubCardHTML(){
  const items=(S.__ARR__||[]).slice(0,4);
  return `<div class="card"><div class="sh">
    <span class="t">__IC__ __LABEL__</span>
    <span class="a" onclick="nav('__ID__')">Apri →</span></div>
    ${items.length
      ? items.map(x=>`<div class="item" onclick="open__NOME__('${x.id}')"><div class="bd">
          <div class="ti">${esc(x.title||'—')}</div>
          <div class="su">${esc(cName(x.clientId)||x.clientRaw||'—')}${x.date?' · '+fmtD(x.date):''}</div>
        </div></div>`).join('')
      : '<div class="empty">Nessuna voce.</div>'}
  </div>`;
}

/* --- A · RENDER principale: dipinge in #main --- */
function render__NOME__(){
  const list=(S.__ARR__||[]).slice().sort((a,b)=>b.created-a.created);
  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent"></span>__LABEL__</div>
  <div class="card"><div class="sh">
    <span class="t">__IC__ __LABEL__</span>
    <span class="a" onclick="new__NOME__()">+ Nuovo</span></div>
    ${list.length
      ? list.map(x=>`<div class="item" onclick="open__NOME__('${x.id}')"><div class="bd">
          <div class="ti">${esc(x.title||'—')}</div>
          <div class="su">${esc(cName(x.clientId)||x.clientRaw||'—')}${x.date?' · '+fmtD(x.date):''}</div>
        </div></div>`).join('')
      : '<div class="empty"><div class="big">__IC__</div>Ancora niente qui. Tocca «+ Nuovo».</div>'}
  </div>`;
}

/* --- C/D · CRUD: muta S e chiama SEMPRE save() (sync automatico; no-op in demo) --- */
function new__NOME__(){
  openSheet(`<h3>Nuovo · __LABEL__ <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Titolo</label><input id="nx-t" placeholder="es. …"></div>
  <div class="fld"><label>Cliente</label>
    <select id="nx-c"><option value="">— nessuno</option>
      ${S.clients.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}
    </select></div>
  <div class="fld"><label>Data</label><input id="nx-d" type="date"></div>
  <div class="actions">
    <button class="btn ghost" onclick="closeSheet()">Annulla</button>
    <button class="btn pri" onclick="save__NOME__()">Salva</button></div>`);
}
function save__NOME__(){
  const t=$('#nx-t').value.trim(); if(!t){toast('Manca il titolo');return;}
  if(!S.__ARR__)S.__ARR__=[];
  S.__ARR__.unshift({id:uid(),title:t,clientId:$('#nx-c').value||null,clientRaw:null,
    date:$('#nx-d').value||null,status:'aperto',via:'manuale',created:Date.now()});
  save(); closeSheet(); render(); toast('__IC__ Salvato');
}
function open__NOME__(id){
  const x=byId(S.__ARR__||[],id); if(!x)return;
  openSheet(`<h3>${esc(x.title||'—')} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px">${esc(cName(x.clientId)||x.clientRaw||'—')}${x.date?' · '+fmtD(x.date):''}</div>
  <div class="actions">
    <button class="btn danger" onclick="if(confirm('Eliminare?')){S.__ARR__=S.__ARR__.filter(y=>y.id!=='${id}');save();closeSheet();render();toast('Eliminato');}">Elimina</button>
    <button class="btn" onclick="nav('clients')">Vai al cliente →</button>
  </div>`);
}

/* ============================================================
   AGGANCI NEL CORE (da fare a mano — vedi LABORATORIO.md, contratto A·D·F)

   1) core/core.js → blank(): aggiungi  __ARR__:[]
   2) core/core.js → MAPS: blocco con toDb (camel→snake) / fromDb (snake→camel):
        __ARR__:{tbl:'__ARR__',
          toDb:x=>({id:x.id,title:x.title,client_id:x.clientId||null,client_raw:x.clientRaw||null,
                    date:x.date||null,status:x.status||'aperto',via:x.via||'manuale'}),
          fromDb:r=>({id:r.id,title:r.title,clientId:r.client_id,clientRaw:r.client_raw,
                    date:r.date,status:r.status,via:r.via,created:Date.parse(r.created_at)||Date.now()})},
   3) core/core.js → TBL: __ARR__:'__ARR__'  · UP_ORDER e DEL_ORDER: inserisci '__ARR__'
        (UP: dopo clients/employees · DEL: prima di clients/employees — FK-safe)
   4) core/core.js → loadAll(): q('__ARR__') + S.__ARR__=(…).map(MAPS.__ARR__.fromDb)
                      dbRows(): __ARR__:S.__ARR__.map(MAPS.__ARR__.toDb)
   5) core/core.js → VIEWS: {id:'__ID__',ic:'__IC__',label:'__LABEL__'}
                      dispatcher R: __ID__:window.render__NOME__
   6) modules-base/hub/hub.js → renderHub: aggiungi accanto a zone:
        ${typeof __ID__HubCardHTML==='function'?__ID__HubCardHTML():''}
   7) app.html → <script src="modules-extra/__ID__/__ID__.js"></script> (dopo il core)
   8) FABBRICA/MANIFEST.js → sposta __ID__ da inArrivo a extra
   9) configuratore/catalogo.js → stato:'__ID__' a 'pronto'
   10) core/core.js → demoBoot(): 2-3 record finti in S.__ARR__
   11) (Supabase del cliente) → migration SQL tabella __ARR__ + RLS → TODO in CONSEGNA.md
   ============================================================ */
