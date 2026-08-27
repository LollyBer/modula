/* ===== MODULO BASE FISSO: IMPOSTAZIONI =====
   Sempre presente, ultimo nella barra (pinnato in fondo). Da qui il cliente
   organizza da solo: ordine dei moduli (per-utente/dispositivo), il proprio
   account, preferenze, e — se titolare — dati fatturazione, voci calendario e
   strumenti. NON tocca le cose che decide la Regia (nome azienda, logo, colore,
   moduli attivi, canone). Dipende dal core (S, me, isOwner, esc, render...). */

/* ---- ORDINE MODULI per-utente (salvato sul dispositivo, come la barra mobile) ---- */
function modOrderKey(){return 'modula_modorder_'+(S.session?S.session.empId:'x');}
function getModOrder(){try{const v=JSON.parse(localStorage.getItem(modOrderKey())||'null');return Array.isArray(v)&&v.length?v:null;}catch(e){return null;}}
function setModOrder(ids){try{if(ids&&ids.length)localStorage.setItem(modOrderKey(),JSON.stringify(ids));else localStorage.removeItem(modOrderKey());}catch(e){}}
/* Applica l'ordine salvato a una lista di VIEWS, tenendo SEMPRE «settings» in fondo. */
function applyModOrder(list){
  const ord=getModOrder();
  const pinLast=l=>{const s=l.filter(v=>v.id==='settings');const rest=l.filter(v=>v.id!=='settings');return[...rest,...s];};
  if(!ord)return pinLast(list);
  const pos=id=>{const i=ord.indexOf(id);return i<0?1000+VIEWS.findIndex(v=>v.id===id):i;};
  return pinLast(list.slice().sort((a,b)=>pos(a.id)-pos(b.id)));
}
/* id dei moduli riordinabili attualmente visibili (esclude «settings», pinnato) */
function orderableModIds(){return visViews().filter(v=>v.id!=='settings').map(v=>v.id);}
function moveModule(id,dir){
  const ids=orderableModIds();const i=ids.indexOf(id);if(i<0)return;
  const j=i+dir;if(j<0||j>=ids.length)return;
  const t=ids[i];ids[i]=ids[j];ids[j]=t;
  setModOrder(ids);renderNav();renderSettings();
}
function resetModOrder(){setModOrder(null);renderNav();renderSettings();toast('↩ Ordine ripristinato');}

/* ---- PAGINA IMPOSTAZIONI ---- */
function renderSettings(){
  const owner=isOwner();const m=me();
  const mods=orderableModIds().map(id=>VIEWS.find(v=>v.id===id)).filter(Boolean);
  const nMods=mods.length;
  const reorder=mods.map((v,i)=>`<div class="set-modrow">
    <span class="ic">${v.ic}</span><span class="nm">${esc(v.label)}</span>
    <span class="set-arrows">
      <button class="btn sm ghost" ${i===0?'disabled':''} onclick="moveModule('${v.id}',-1)" aria-label="Su">▲</button>
      <button class="btn sm ghost" ${i===nMods-1?'disabled':''} onclick="moveModule('${v.id}',1)" aria-label="Giù">▼</button>
    </span></div>`).join('');

  const ps=(typeof pushState==='function')?pushState():'unsupported';
  const pushRow=ps==='unsupported'?`<div class="subtle">Le notifiche non sono disponibili su questo dispositivo/browser.</div>`
    :ps==='on'?`<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm ghost" onclick="pushTest()">📩 Invia prova</button><button class="btn sm" style="border-color:var(--teal);color:var(--teal)" onclick="disablePush();setTimeout(renderSettings,300)">🔔 Attive — disattiva</button></div>`
    :ps==='blocked'?`<div class="subtle">🔕 Notifiche bloccate dal dispositivo — abilitale nelle impostazioni del telefono.</div>`
    :`<button class="btn sm" style="border-color:var(--amber);color:var(--amber)" onclick="enablePush();setTimeout(renderSettings,600)">🔔 Attiva notifiche su questo dispositivo</button>`;

  const homeRow=moduleActive('lavagna')?`<div class="fld"><label>Schermata iniziale (questo dispositivo)</label>
    <div class="tabs" style="margin:0">
      <div class="tb ${homeMode()==='classic'?'on':''}" onclick="setHomeMode('classic');renderSettings()">⚡ Hub</div>
      <div class="tb ${homeMode()==='lavagna'?'on':''}" onclick="setHomeMode('lavagna');renderSettings()">📋 Lavagna</div>
    </div></div>`:'';

  const ownerTools=owner?`
    <div class="card">
      <div class="set-h">🛠️ Strumenti titolare</div>
      <div class="row" style="gap:8px;flex-wrap:wrap">
        <button class="btn sm ghost" onclick="openModuleStore()">🧩 Moduli & richieste</button>
        <button class="btn sm ghost" onclick="openBackup()">💾 Backup dati</button>
        <button class="btn sm ghost" onclick="openImport()">📥 Importa dati</button>
      </div>
    </div>`:'';

  const billingCard=(owner&&moduleActive('fatture')&&typeof openBilling==='function')?`
    <div class="card">
      <div class="set-h">🧾 Dati fatturazione</div>
      <div class="subtle" style="margin-bottom:10px">Intestazione, IBAN, IVA e numerazione usati nelle fatture e nella QR-fattura.</div>
      <button class="btn sm ghost" onclick="openBilling()">Apri dati fatturazione</button>
    </div>`:'';

  const rm=(S.settings&&S.settings.reminders)||{};
  const rmOn=rm.enabled!==false; // default acceso
  const rmMin=rm.minutesBefore!=null?rm.minutesBefore:30;
  const rmTime=rm.allDayTime||'08:00';
  const minOpt=(v,l)=>`<option value="${v}" ${rmMin===v?'selected':''}>${l}</option>`;
  const remindersCard=owner?`
    <div class="card">
      <div class="set-h">🔔 Promemoria appuntamenti</div>
      <div class="subtle" style="margin-bottom:12px">Ti avvisa prima di ogni appuntamento/manutenzione segnati. Al titolare arrivano quelli di tutta l'azienda; a ogni dipendente solo i propri.<br><b>Ad app aperta</b> funziona già (avviso + notifica se attive). Per riceverlo <b>anche ad app chiusa</b> serve attivare le notifiche push (vedi guida di deploy).</div>
      <label class="set-check"><input type="checkbox" id="rm-on" ${rmOn?'checked':''} onchange="saveReminders()"> Promemoria attivi</label>
      <div class="fld" style="margin-top:12px"><label>Quanto prima avvisare</label>
        <select id="rm-min" onchange="saveReminders()">${minOpt(15,'15 minuti prima')}${minOpt(30,'30 minuti prima')}${minOpt(60,'1 ora prima')}${minOpt(120,'2 ore prima')}${minOpt(180,'3 ore prima')}${minOpt(1440,'1 giorno prima')}</select></div>
      <div class="fld" style="margin-bottom:0"><label>Per gli eventi senza orario, avvisa alle</label>
        <input type="time" id="rm-time" value="${esc(rmTime)}" onchange="saveReminders()"></div>
    </div>`:'';

  const calCard=(owner&&moduleActive('cal')&&typeof openCalTypes==='function')?`
    <div class="card">
      <div class="set-h">📅 Voci del calendario</div>
      <div class="subtle" style="margin-bottom:10px">Le voci che usi negli eventi e il modulo a cui ognuna è collegata.</div>
      <button class="btn sm ghost" onclick="openCalTypes()">Gestisci voci calendario</button>
    </div>`:'';

  $('#main').innerHTML=`
  <div class="pagetitle"><span class="accent" style="background:var(--cy)"></span>Impostazioni</div>

  <div class="card">
    <div class="set-h">↕️ Ordine dei moduli</div>
    <div class="subtle" style="margin-bottom:12px">L'ordine in cui vedi i moduli nel menù. Vale solo per te, su questo dispositivo.</div>
    <div class="set-modlist">${reorder||'<div class="subtle">Nessun modulo.</div>'}</div>
    <div style="margin-top:12px"><button class="btn sm ghost" onclick="resetModOrder()">↩ Ripristina ordine predefinito</button></div>
  </div>

  <div class="card">
    <div class="set-h">👤 Il mio account</div>
    <div class="fld"><label>Il mio nome</label><div style="font-size:14px;padding:5px 0;font-weight:600">${esc(m?m.name:'—')}</div><div class="subtle">Il nome lo gestisce il titolare in «Personale».</div></div>
    <div class="row" style="gap:8px;flex-wrap:wrap;margin-top:12px">
      <button class="btn sm ghost" onclick="openChangePassword()">🔑 Cambia password</button>
      <button class="btn sm" style="border-color:rgba(214,69,40,.4);color:var(--coral)" onclick="logout()">🚪 Esci${m?' ('+esc(m.name)+')':''}</button>
    </div>
  </div>

  <div class="card">
    <div class="set-h">🎛️ Preferenze</div>
    <div class="fld"><label>Tema (questo dispositivo)</label>
      <div class="tabs" style="margin:0">
        <div class="tb ${getTheme()!=='dark'?'on':''}" onclick="setTheme('light');renderSettings()">🌙 Chiaro</div>
        <div class="tb ${getTheme()==='dark'?'on':''}" onclick="setTheme('dark');renderSettings()">🌚 Scuro</div>
      </div></div>
    ${homeRow}
    <div class="fld" style="margin-bottom:0"><label>Notifiche</label>${pushRow}</div>
  </div>

  ${remindersCard}
  ${billingCard}
  ${calCard}
  ${ownerTools}

  <div class="subtle" style="text-align:center;margin:6px 0 2px">Nome azienda, logo, colore e moduli attivi si gestiscono con Modula.</div>`;
}
function saveReminders(){
  if(!isOwner())return;
  const on=$('#rm-on')?$('#rm-on').checked:true;
  const min=$('#rm-min')?parseInt($('#rm-min').value)||30:30;
  const time=$('#rm-time')?($('#rm-time').value||'08:00'):'08:00';
  S.settings.reminders=Object.assign({},S.settings.reminders,{enabled:on,minutesBefore:min,allDayTime:time});
  save();toast('✓ Promemoria salvati');
}
window.renderSettings=renderSettings;
