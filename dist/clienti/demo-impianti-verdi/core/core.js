/* ===== CORE: stato, Supabase/auth, helper, render(), router, e helper condivisi ===== */
/* Estratto da ptek. I moduli (base + extra) sono file separati caricati DOPO questo. */

/* ================= STATE + SUPABASE ================= */
/* ─── BACKEND MULTI-TENANT: UN solo progetto Supabase per TUTTA la piattaforma ───
   Le credenziali stanno in core/config.js (window.MODULA_CONFIG), condivise da
   tutte le aziende. L'isolamento dei dati lo fa la RLS lato server (vedi
   supabase/schema.sql): ogni azienda (tenant) vede solo le sue righe. */
const CFG=(window.MODULA_CONFIG||{});
const SB_URL=CFG.SUPABASE_URL||'__SUPABASE_URL__';
const SB_KEY=CFG.SUPABASE_ANON_KEY||'__SUPABASE_ANON_KEY__';
/* VETRINA/DEMO: finché le credenziali sono segnaposto (o assenti) l'app parte in
   modalità demo — dati di esempio, nessun backend — così è subito navigabile.
   Appena si inseriscono URL+chiave reali, riparte normale (login + Supabase). */
/* DEMO anche su richiesta esplicita: app.html?demo=1 → vetrina della STESSA app
   (dati di esempio, nessun backend), usata dal bottone "Demo dal vivo" della landing. */
const DEMO=(/^__/.test(SB_URL))||!SB_URL||/[?&]demo=1\b/.test(location.search);
const sb=DEMO?null:window.supabase.createClient(SB_URL,SB_KEY);

/* ─── BRAND: NON più fisso. Viene caricato dal tenant dell'azienda dopo il login
   (nome, logo, accento). Vuoto finché non si è loggati. ─── */
let BRAND={ name:'', tagline:'', logo:'' };
/* Moduli attivi per l'azienda loggata. null = tutti (demo/retrocompat); altrimenti
   è l'elenco deciso dal super-admin per quel tenant. Filtra cosa si vede in nav. */
let ACTIVE_MODULES=null;
const moduleActive=id=>!ACTIVE_MODULES||id==='hub'||id==='notif'||ACTIVE_MODULES.includes(id);
/* Posti dipendente del piano (titolare incluso). null = illimitato (demo/retrocompat).
   Lo decide il super-admin per ogni azienda; l'app impedisce di superarlo. */
let MAX_EMP=null;
/* id dell'azienda loggata: prefisso delle cartelle Storage (isolamento file per tenant). */
let TENANT_ID=null;
let TENANT_ACTIVE=true;  /* false = azienda sospesa (es. non paga): l'app blocca l'accesso */
const seatCount=()=>S.employees.filter(e=>e.active!==false).length;
const seatFull=()=>MAX_EMP!=null && seatCount()>=MAX_EMP;
/* viste visibili = permesso utente (can) ∩ modulo attivo per il tenant */
function visViews(){return VIEWS.filter(v=>v.id==='hub'||v.id==='notif'||((v.id==='zone'?can('clients'):can(v.id))&&moduleActive(v.id)));}

const APP_VERSION='2026.06.30-113212';

const blank=()=>({clients:[],employees:[],timeEntries:[],notes:[],noteGroups:[],appointments:[],maintenances:[],pellet:[],sites:[],chat:[],lists:[],callLog:[],expenses:[],maintPrices:[],settings:{bagsPerPallet:70,companyName:'',pricePerTon:null,pricePerBag:null},speaker:null,session:null});
let S=blank();
const uid=()=>(crypto.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);}));

/* ---------- mappatura app <-> db ---------- */
const num=v=>(v===''||v==null)?null:+v;
const MAPS={
 clients:{tbl:'clients',
  toDb:c=>({id:c.id,name:c.name,phone:c.phone||'',zone:c.zone||'',group:c.group||'',address:c.address||'',plant:c.plant||'',pellet:c.pellet||'',maintenance:c.maintenance||'',notes:c.notes||'',blocked:!!c.blocked,first_name:c.firstName||'',last_name:c.lastName||'',street:c.street||'',street_no:c.streetNo||'',cap:c.cap||'',town:c.town||'',email:c.email||'',lat:(typeof c.lat==='number'?c.lat:null),lng:(typeof c.lng==='number'?c.lng:null),geo_src:c.geoSrc||null}),
  fromDb:r=>({id:r.id,name:r.name,phone:r.phone||'',zone:r.zone||'',group:r.group||'',address:r.address||'',plant:r.plant||'',pellet:r.pellet||'',maintenance:r.maintenance||'',notes:r.notes||'',blocked:!!r.blocked,firstName:r.first_name||'',lastName:r.last_name||'',street:r.street||'',streetNo:r.street_no||'',cap:r.cap||'',town:r.town||'',email:r.email||'',lat:(typeof r.lat==='number'?r.lat:null),lng:(typeof r.lng==='number'?r.lng:null),geoSrc:r.geo_src||null,created:Date.parse(r.created_at)||Date.now()})},
 employees:{tbl:'employees',
  toDb:e=>({id:e.id,name:e.name,role:e.role||'',phone:e.phone||'',perms:e.perms||[],is_owner:!!e.isOwner,active:e.active!==false,invite_code:e.inviteCode||null,user_id:e.userId||null,day_hours:num(e.dayHours),holiday_days:num(e.holidayDays)}),
  fromDb:r=>({id:r.id,name:r.name,role:r.role||'',phone:r.phone||'',perms:r.perms||[],isOwner:!!r.is_owner,active:r.active!==false,inviteCode:r.invite_code,userId:r.user_id,dayHours:r.day_hours,holidayDays:r.holiday_days})},
 timeEntries:{tbl:'time_entries',
  toDb:t=>({id:t.id,emp_id:t.empId||null,date:t.date||null,type:t.type||'lavoro',hours:num(t.hours),start_t:t.start||null,end_t:t.end||null,break_min:num(t.brk),note:t.note||''}),
  fromDb:r=>({id:r.id,empId:r.emp_id,date:r.date,type:r.type||'lavoro',hours:r.hours,start:r.start_t||'',end:r.end_t||'',brk:r.break_min,note:r.note||'',created:Date.parse(r.created_at)||Date.now()})},
 maintenances:{tbl:'maintenances',
  toDb:m=>({id:m.id,title:m.title,client_id:m.clientId||null,client_raw:m.clientRaw||null,employee_id:(m.employees&&m.employees[0])||m.employeeId||null,employees:m.employees||(m.employeeId?[m.employeeId]:[]),date:m.date||null,time:m.time||null,status:m.status||'da_fare',notes:m.notes||'',recur:m.recur||0,price:num(m.price),type:m.type||null,report:m.report||null,via:m.via||'manuale'}),
  fromDb:r=>({id:r.id,title:r.title,clientId:r.client_id,clientRaw:r.client_raw,employeeId:r.employee_id,employees:(r.employees&&r.employees.length)?r.employees:(r.employee_id?[r.employee_id]:[]),date:r.date,time:r.time,status:r.status,notes:r.notes||'',recur:r.recur||0,price:r.price,type:r.type||'',report:r.report,via:r.via,created:Date.parse(r.created_at)||Date.now()})},
 appointments:{tbl:'appointments',
  toDb:a=>({id:a.id,title:a.title,client_id:a.clientId||null,client_raw:a.clientRaw||null,employee_id:(a.employees&&a.employees[0])||a.employeeId||null,employees:a.employees||(a.employeeId?[a.employeeId]:[]),date:a.date||null,time:a.time||null,done:!!a.done,via:a.via||'manuale'}),
  fromDb:r=>({id:r.id,title:r.title,clientId:r.client_id,clientRaw:r.client_raw,employeeId:r.employee_id,employees:(r.employees&&r.employees.length)?r.employees:(r.employee_id?[r.employee_id]:[]),date:r.date,time:r.time,done:!!r.done,via:r.via,created:Date.parse(r.created_at)||Date.now()})},
 pellet:{tbl:'pellet',
  toDb:p=>({id:p.id,client_id:p.clientId||null,client_raw:p.clientRaw||null,employee_id:(p.employees&&p.employees[0])||p.employeeId||null,employees:p.employees||(p.employeeId?[p.employeeId]:[]),qty:num(p.qty),unit:p.unit||'sacchi',kind:p.kind||'sacchi',date:p.date||null,time:p.time||null,status:p.status||'da_consegnare',price:num(p.price),signature:p.signature||null,signed_name:p.signedName||'',notes:p.notes||'',via:p.via||'manuale'}),
  fromDb:r=>({id:r.id,clientId:r.client_id,clientRaw:r.client_raw,employeeId:r.employee_id,employees:(r.employees&&r.employees.length)?r.employees:(r.employee_id?[r.employee_id]:[]),qty:r.qty,unit:r.unit,kind:r.kind,date:r.date,time:r.time,status:r.status,price:r.price,signature:r.signature,signedName:r.signed_name||'',notes:r.notes||'',via:r.via,created:Date.parse(r.created_at)||Date.now()})},
 sites:{tbl:'sites',
  toDb:s=>({id:s.id,name:s.name,client_id:s.clientId||null,client_raw:s.clientRaw||null,status:s.status||'aperto',employees:s.employees||[],est_hours:num(s.estHours),amount:num(s.amount),start_date:s.startDate||null,due_date:s.dueDate||null,closed_date:s.closedDate||null,notes:s.notes||'',via:s.via||'manuale'}),
  fromDb:r=>({id:r.id,name:r.name,clientId:r.client_id,clientRaw:r.client_raw,status:r.status,employees:r.employees||[],estHours:r.est_hours,amount:r.amount,startDate:r.start_date,dueDate:r.due_date,closedDate:r.closed_date,notes:r.notes||'',via:r.via,log:[],attachments:[],created:Date.parse(r.created_at)||Date.now()})},
 notes:{tbl:'notes',
  toDb:n=>({id:n.id,text:n.text,client_id:n.clientId||null,group_id:n.groupId||null,employees:n.employees||[],date:n.date||null,pinned:!!n.pinned,archived:!!n.archived,via:n.via||'manuale'}),
  fromDb:r=>({id:r.id,text:r.text,clientId:r.client_id,groupId:r.group_id,employees:r.employees||[],date:r.date,pinned:!!r.pinned,archived:!!r.archived,via:r.via,created:Date.parse(r.created_at)||Date.now()})},
 noteGroups:{tbl:'note_groups',
  toDb:g=>({id:g.id,name:g.name,members:g.members||[]}),
  fromDb:r=>({id:r.id,name:r.name,members:r.members||[]})},
 lists:{tbl:'lists',
  toDb:l=>({id:l.id,name:l.name,via:l.via||'manuale'}),
  fromDb:r=>({id:r.id,name:r.name,via:r.via,items:[],created:Date.parse(r.created_at)||Date.now()})},
 callLog:{tbl:'call_log',
  toDb:c=>({id:c.id,client_id:c.clientId,year:c.year,called:!!c.called,outcome:c.outcome||'',note:c.note||'',maint_id:c.maintId||null}),
  fromDb:r=>({id:r.id,clientId:r.client_id,year:r.year,called:!!r.called,outcome:r.outcome||'',note:r.note||'',maintId:r.maint_id})},
 expenses:{tbl:'expenses',
  toDb:e=>({id:e.id,date:e.date||null,category:e.category||'',amount:num(e.amount),note:e.note||'',site_id:e.siteId||null,recur:e.recur||0}),
  fromDb:r=>({id:r.id,date:r.date,category:r.category||'',amount:r.amount,note:r.note||'',siteId:r.site_id,recur:r.recur||0,created:Date.parse(r.created_at)||Date.now()})},
 maintPrices:{tbl:'maint_prices',
  toDb:p=>({id:p.id,kind:p.kind,price:num(p.price)}),
  fromDb:r=>({id:r.id,kind:r.kind,price:r.price})},
};
/* figli annidati */
const logToDb=(s,l)=>({id:l.id,site_id:s.id,date:l.date||null,text:l.text,hours:num(l.hours),emp_id:l.empId||null});
const itemToDb=(l,i,pos)=>({id:i.id,list_id:l.id,text:i.text,done:!!i.done,position:pos});

/* ---------- caricamento completo ---------- */
let snapshot={};
function snapRows(key,rows){const o={};rows.forEach(r=>o[r.id]=JSON.stringify(r));snapshot[key]=o;}
async function loadAll(){
  const q=t=>sb.from(t).select('*');
  const[cl,em,te,ma,ap,pe,si,sl,at,no,ng,li,it,ch,cg,ex,mp,st]=await Promise.all([
    q('clients'),q('employees'),q('time_entries'),q('maintenances'),q('appointments'),q('pellet'),
    q('sites'),q('site_logs').order('created_at'),q('attachments'),
    q('notes'),q('note_groups'),q('lists'),q('list_items').order('position'),
    sb.from('chat').select('*').order('created_at',{ascending:true}).limit(300),
    q('call_log'),q('expenses'),q('maint_prices'),sb.from('settings').select('*').eq('id',1).maybeSingle()
  ]);
  /* te (time_entries) è ESCLUSO dal controllo bloccante: se la tabella non è ancora
     stata creata su Supabase, l'app parte comunque (presenze vuote) invece di crashare. */
  const err=[cl,em,ma,ap,pe,si,sl,at,no,ng,li,it,ch,cg].find(x=>x.error);
  if(err)throw err.error;
  if(te.error)console.warn('time_entries non disponibile (esegui schema.sql):',te.error.message);
  S.clients=(cl.data||[]).map(MAPS.clients.fromDb);
  S.employees=(em.data||[]).map(MAPS.employees.fromDb);
  S.timeEntries=(te.data||[]).map(MAPS.timeEntries.fromDb);
  S.maintenances=(ma.data||[]).map(MAPS.maintenances.fromDb).sort((a,b)=>b.created-a.created);
  S.appointments=(ap.data||[]).map(MAPS.appointments.fromDb).sort((a,b)=>b.created-a.created);
  S.pellet=(pe.data||[]).map(MAPS.pellet.fromDb).sort((a,b)=>b.created-a.created);
  S.sites=(si.data||[]).map(MAPS.sites.fromDb).sort((a,b)=>b.created-a.created);
  (sl.data||[]).forEach(r=>{const s=S.sites.find(x=>x.id===r.site_id);if(s)s.log.push({id:r.id,date:r.date,text:r.text,hours:r.hours,empId:r.emp_id});});
  (at.data||[]).forEach(r=>{const s=S.sites.find(x=>x.id===r.site_id);if(s)s.attachments.push({id:r.id,name:r.name,type:r.type,storagePath:r.storage_path,date:r.date});});
  S.notes=(no.data||[]).map(MAPS.notes.fromDb).sort((a,b)=>b.created-a.created);
  S.noteGroups=(ng.data||[]).map(MAPS.noteGroups.fromDb);
  S.lists=(li.data||[]).map(MAPS.lists.fromDb).sort((a,b)=>b.created-a.created);
  (it.data||[]).forEach(r=>{const l=S.lists.find(x=>x.id===r.list_id);if(l)l.items.push({id:r.id,text:r.text,done:!!r.done});});
  S.chat=(ch.data||[]).map(r=>({id:r.id,who:r.emp_id,text:r.text,sys:!!r.sys,ts:Date.parse(r.created_at)}));
  S.callLog=(cg.data||[]).map(MAPS.callLog.fromDb);
  S.expenses=(ex&&ex.data||[]).map(MAPS.expenses.fromDb).sort((a,b)=>b.created-a.created);
  S.maintPrices=(mp&&mp.data||[]).map(MAPS.maintPrices.fromDb);
  if(st.data)S.settings={bagsPerPallet:st.data.bags_per_pallet||70,companyName:st.data.company_name||'',pricePerTon:st.data.price_per_ton,pricePerBag:st.data.price_per_bag};
  rebuildSnapshot();
}
function dbRows(){
  return{
    employees:S.employees.map(MAPS.employees.toDb),
    timeEntries:S.timeEntries.map(MAPS.timeEntries.toDb),
    clients:S.clients.map(MAPS.clients.toDb),
    noteGroups:S.noteGroups.map(MAPS.noteGroups.toDb),
    lists:S.lists.map(MAPS.lists.toDb),
    maintenances:S.maintenances.map(MAPS.maintenances.toDb),
    appointments:S.appointments.map(MAPS.appointments.toDb),
    pellet:S.pellet.map(MAPS.pellet.toDb),
    sites:S.sites.map(MAPS.sites.toDb),
    notes:S.notes.map(MAPS.notes.toDb),
    listItems:S.lists.flatMap(l=>l.items.map((i,idx)=>itemToDb(l,i,idx))),
    siteLogs:S.sites.flatMap(s=>s.log.map(l=>logToDb(s,l))),
    callLog:S.callLog.map(MAPS.callLog.toDb),
    expenses:S.expenses.map(MAPS.expenses.toDb),
    maintPrices:S.maintPrices.map(MAPS.maintPrices.toDb),
  };
}
const TBL={employees:'employees',timeEntries:'time_entries',clients:'clients',noteGroups:'note_groups',lists:'lists',maintenances:'maintenances',appointments:'appointments',pellet:'pellet',sites:'sites',notes:'notes',listItems:'list_items',siteLogs:'site_logs',callLog:'call_log',expenses:'expenses',maintPrices:'maint_prices'};
const UP_ORDER=['employees','timeEntries','clients','noteGroups','lists','maintenances','appointments','pellet','sites','expenses','notes','listItems','siteLogs','callLog','maintPrices'];
const DEL_ORDER=['maintPrices','callLog','siteLogs','listItems','notes','expenses','sites','pellet','appointments','maintenances','lists','noteGroups','clients','timeEntries','employees'];
function rebuildSnapshot(){const r=dbRows();for(const k of UP_ORDER)snapRows(k,r[k]);snapshot._settings=JSON.stringify(S.settings);}

/* ---------- sync: diff e push ---------- */
let syncTimer=null,syncing=false,syncDirty=false;
function save(){if(DEMO)return;syncDirty=true;clearTimeout(syncTimer);syncTimer=setTimeout(syncNow,300);}
async function syncNow(){
  if(!S.session)return;
  if(syncing){syncDirty=true;return;}
  syncing=true;syncDirty=false;
  try{
    const rows=dbRows();
    for(const k of UP_ORDER){
      if(k==='employees'&&!isOwner())continue;
      const prev=snapshot[k]||{};
      const ups=rows[k].filter(r=>prev[r.id]!==JSON.stringify(r));
      if(ups.length){const{error}=await sb.from(TBL[k]).upsert(ups);if(error)throw error;}
    }
    for(const k of DEL_ORDER){
      if(k==='employees'&&!isOwner())continue;
      const prev=snapshot[k]||{};
      const cur=new Set(rows[k].map(r=>r.id));
      const dels=Object.keys(prev).filter(id=>!cur.has(id));
      if(dels.length){const{error}=await sb.from(TBL[k]).delete().in('id',dels);if(error)throw error;}
    }
    if(isOwner()&&snapshot._settings!==JSON.stringify(S.settings)){
      const{error}=await sb.from('settings').update({company_name:S.settings.companyName||'',bags_per_pallet:S.settings.bagsPerPallet||70,price_per_ton:num(S.settings.pricePerTon),price_per_bag:num(S.settings.pricePerBag)}).eq('id',1);
      if(error)throw error;
    }
    rebuildSnapshot();
  }catch(e){console.error(e);toast('⚠ Sincronizzazione: '+(e.message||e));}
  finally{syncing=false;if(syncDirty)save();}
}

/* ---------- realtime ---------- */
let rtTimer=null,rtStarted=false;
function startRealtime(){
  if(rtStarted)return;rtStarted=true;
  sb.channel('caywork').on('postgres_changes',{event:'*',schema:'public'},()=>{
    clearTimeout(rtTimer);
    rtTimer=setTimeout(async()=>{
      if(syncing||syncTimer&&syncDirty)return;
      try{await loadAll();if(S.session)render();}catch(e){}
    },600);
  }).subscribe();
}
/* ---------- notifiche push (Web Push) ---------- */
const VAPID_PUBLIC=CFG.VAPID_PUBLIC||'__VAPID_PUBLIC_KEY__'; /* chiave pubblica push (una per la piattaforma) */
let swReg=null,pushSubbed=false;
const pushSupported=()=>('serviceWorker'in navigator)&&('PushManager'in window)&&('Notification'in window);
async function initPush(){if(!pushSupported())return;try{swReg=await navigator.serviceWorker.register('./sw.js');const s=await swReg.pushManager.getSubscription();pushSubbed=!!s;}catch(e){}}
function pushState(){if(!pushSupported())return'unsupported';if(Notification.permission==='denied')return'blocked';return pushSubbed?'on':'off';}
const urlB64ToU8=s=>{const pad='='.repeat((4-s.length%4)%4);const b=atob((s+pad).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...b].map(c=>c.charCodeAt(0)));};
async function enablePush(){
  if(!pushSupported()){toast('Questo dispositivo non supporta le notifiche');return;}
  if(!swReg)await initPush();
  let perm=Notification.permission;if(perm==='default')perm=await Notification.requestPermission();
  if(perm!=='granted'){toast('Permesso notifiche negato');render();return;}
  try{
    const sub=await swReg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlB64ToU8(VAPID_PUBLIC)});
    const j=sub.toJSON();
    const{error}=await sb.from('push_subs').upsert({endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth,emp_id:S.session.empId,ua:navigator.userAgent.slice(0,140)},{onConflict:'endpoint'});
    if(error)throw error;
    pushSubbed=true;toast('🔔 Notifiche attivate su questo telefono');render();
  }catch(e){toast('⚠ '+(e.message||e));}
}
async function disablePush(){
  try{const s=swReg&&await swReg.pushManager.getSubscription();if(s){await sb.from('push_subs').delete().eq('endpoint',s.endpoint);await s.unsubscribe();}}catch(e){}
  pushSubbed=false;toast('Notifiche disattivate su questo telefono');render();
}
async function pushNotify(empIds,title,body){
  empIds=[...new Set((empIds||[]).filter(Boolean))].filter(id=>!(S.session&&id===S.session.empId));
  if(!empIds.length)return;
  try{await sb.functions.invoke('send-push',{body:{empIds,title,body}});}catch(e){}
}
const ownerIds=()=>S.employees.filter(e=>e.isOwner&&e.active!==false).map(e=>e.id);
async function pushTest(){
  if(!S.session)return;
  try{const{error}=await sb.functions.invoke('send-push',{body:{empIds:[S.session.empId],title:'🔔 Notifica di prova',body:'Funziona! Le notifiche di '+(BRAND.name||'questa app')+' sono attive su questo dispositivo.'}});if(error)throw error;toast('📩 Inviata — dovrebbe arrivarti tra pochi secondi');}catch(e){toast('⚠ '+(e.message||e));}
}
/* ================= UTILS ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MESI=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const GG=['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const todayIso=()=>iso(new Date());
function fmtD(s){if(!s)return'';const[y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d);const t=new Date();t.setHours(0,0,0,0);const diff=Math.round((dt-t)/86400000);
  let base=d+' '+MESI[m-1].slice(0,3)+(y!==t.getFullYear()?' '+y:'');
  if(diff===0)return'Oggi · '+base; if(diff===1)return'Domani · '+base; if(diff===2)return'Dopodomani · '+base;
  if(diff>2&&diff<7)return GG[dt.getDay()]+' · '+base; return base;}
function fmtTime(t){return t||''}
function relDays(s){if(!s)return null;const[y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d);const t=new Date();t.setHours(0,0,0,0);return Math.round((dt-t)/86400000);}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2600);}
const byId=(arr,id)=>arr.find(x=>x.id===id);
function addMonthsIso(s,m){const[y,mo,d]=s.split('-').map(Number);const dt=new Date(y,mo-1+m,1);const last=new Date(dt.getFullYear(),dt.getMonth()+1,0).getDate();dt.setDate(Math.min(d,last));return iso(dt);}
function shiftDate(inputId,days){const el=$('#'+inputId);const base=el.value||todayIso();const[y,m,d]=base.split('-').map(Number);const dt=new Date(y,m-1,d+days);el.value=iso(dt);}
const dateChips=id=>`<div class="seg" style="margin:-4px 0 12px"><div class="sg" onclick="$('#${id}').value=todayIso()">oggi</div><div class="sg" onclick="shiftDate('${id}',1)">+1 giorno</div><div class="sg" onclick="shiftDate('${id}',7)">+1 settimana</div></div>`;
const cName=id=>{const c=byId(S.clients,id);return c?c.name:''};
const eName=id=>{const e=byId(S.employees,id);return e?e.name:''};
/* opzioni cliente per i menù a tendina: nasconde i bloccati, ma mantiene quello già scelto in un record esistente */
const cOpt=sel=>S.clients.filter(c=>!c.blocked||c.id===sel).map(c=>`<option value="${c.id}" ${sel===c.id?'selected':''}>${esc(c.name)}${c.blocked?' 🚫':''}</option>`).join('');
/* indirizzo composto + anteprima dati cliente (nei form: sai già dove andare) */
const cAddr=c=>!c?'':([[c.street,c.streetNo].filter(Boolean).join(' '),[c.cap,c.town||c.zone].filter(Boolean).join(' ')].filter(Boolean).join(', ')||c.address||'');
function clientPreviewHTML(id){
  const c=id?byId(S.clients,id):null;if(!c)return '';
  const addr=cAddr(c);
  const rows=[
    addr?`📍 ${esc(addr)}`:'',
    c.phone?`📞 <a href="tel:${esc(c.phone)}" style="color:var(--cy)" onclick="event.stopPropagation()">${esc(c.phone)}</a>`:'',
    c.email?`✉️ ${esc(c.email)}`:'',
    c.plant?`⚙️ ${esc(c.plant)}`:''
  ].filter(Boolean);
  return rows.length?`<div style="background:var(--bg2);border:1px solid var(--line);border-radius:9px;padding:8px 11px;margin-top:7px;font-size:12.5px;color:var(--t2);line-height:1.7">${rows.join('<br>')}</div>`:'';
}
function updClientPrev(sel,targetId){const t=document.getElementById(targetId);if(t)t.innerHTML=clientPreviewHTML(sel.value);}
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

/* ================= PARSER (no AI — pattern matching IT) ================= */
function parseDateIT(text){
  const t=norm(text);const now=new Date();now.setHours(0,0,0,0);
  let date=null,matched='';
  let m;
  if((m=t.match(/\bdopodomani\b/))){const d=new Date(now);d.setDate(d.getDate()+2);date=iso(d);matched=m[0];}
  else if((m=t.match(/\bdomani\b/))){const d=new Date(now);d.setDate(d.getDate()+1);date=iso(d);matched=m[0];}
  else if((m=t.match(/\boggi\b/))){date=iso(now);matched=m[0];}
  else if((m=t.match(/\b(lunedi|martedi|mercoledi|giovedi|venerdi|sabato|domenica)\b/))){
    const names=['domenica','lunedi','martedi','mercoledi','giovedi','venerdi','sabato'];
    const target=names.indexOf(m[1]);const d=new Date(now);let add=(target-d.getDay()+7)%7;if(add===0)add=7;d.setDate(d.getDate()+add);date=iso(d);matched=m[1];}
  else if((m=t.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/))){
    let[,d1,m1,y1]=m;let y=y1?(+y1<100?2000+(+y1):+y1):now.getFullYear();
    const cand=new Date(y,+m1-1,+d1);if(!y1&&cand<now)cand.setFullYear(y+1);
    if(cand.getDate()==+d1)date=iso(cand);matched=m[0];}
  else if((m=t.match(/\b(?:il\s+)?(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\b/))){
    const mi=MESI.indexOf(m[2]);const cand=new Date(now.getFullYear(),mi,+m[1]);if(cand<now)cand.setFullYear(now.getFullYear()+1);date=iso(cand);matched=m[0];}
  else if((m=t.match(/\btra\s+(\d{1,2})\s+giorni\b/))){const d=new Date(now);d.setDate(d.getDate()+ +m[1]);date=iso(d);matched=m[0];}
  // time
  let time=null,tm;
  if((tm=t.match(/\balle?\s+(\d{1,2})(?:[:\.](\d{2}))?\b/))||(tm=t.match(/\bore\s+(\d{1,2})(?:[:\.](\d{2}))?\b/))){
    let h=+tm[1],mi=tm[2]?+tm[2]:0;
    const isMorning=/\b(mattina|mattino|stamattina|am)\b/.test(t);
    if(!isMorning&&h>=1&&h<=5)h+=12; // "alle 4" → 16:00, ma le 6/7 restano del mattino
    if(h<=23)time=pad(h)+':'+pad(mi);
  }
  return{date,time,matched};
}
const escReg=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const reWord=n=>new RegExp('\\b'+escReg(n)+'\\b');
function findEmployee(text){
  const t=norm(text);let best=null;
  for(const e of S.employees){const n=norm(e.name);if(n&&reWord(n).test(t)&&(!best||n.length>best.len))best={kind:'employee',id:e.id,name:e.name,len:n.length};}
  return best;
}
function findClient(text,employee){
  // togli prima la frase del dipendente (es. "fatta da Loris") per non confonderla col cliente
  let tx=text;
  tx=tx.replace(/\b(fatt[ao]|svolt[ao]|esegui\w+|gestit[ao]|segui\w+)\s+da\b/gi,' ')
       .replace(/\b(la\s+fa|a\s+cura\s+di|assegnat[ao]\s+a|tecnico)\b/gi,' ');
  if(employee)tx=tx.replace(new RegExp('\\b'+escReg(employee.name)+'\\b','gi'),' ');
  const t=norm(tx);
  // cliente già in anagrafica: match più lungo
  let best=null;
  for(const c of S.clients){if(c.blocked)continue;const n=norm(c.name);if(n&&reWord(n).test(t)&&(!best||n.length>best.len))best={kind:'client',id:c.id,name:c.name,len:n.length};}
  if(best)return best;
  // cliente nuovo: prima i marcatori forti "per/cliente/sig", poi il debole "a/da"; salta parole comuni e parole-tipo
  const STOP=/^(oggi|domani|dopodomani|ieri|mattina|sera|pomeriggio|notte|stamattina|stasera|lunedi|martedi|mercoledi|giovedi|venerdi|sabato|domenica|gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre|alle|ore|fra|tra|casa|lui|lei|me|noi|loro|tutti|fare|farla|farlo|pellet|gas|gasolio|metano|legna|cippato|caldaia|caldaie|stufa|stufe|camino|sacchi|sacco|sfuso|bancale|bancali|kg|tonnellate|tonnellata|ton|quintali|e|il|la|lo|le|i|gli|un|una|uno|del|della|dei)$/i;
  const m=tx.match(/\b(?:per|cliente|signor[ae]?|sig\.?)\s+([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)/i)
        || tx.match(/\b(?:al?|dal?)\s+([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)/i);
  if(m){const words=m[1].trim().split(/\s+/).filter(w=>!STOP.test(norm(w)));if(words.length){const nm=words.slice(0,2).join(' ');if(!employee||norm(nm)!==norm(employee.name))return{kind:'raw',id:null,name:nm.charAt(0).toUpperCase()+nm.slice(1),len:nm.length};}}
  return null;
}
function parseInput(text){
  const t=norm(text);
  const r={type:null,title:text.trim(),date:null,time:null,person:null,employee:null,qty:null,unit:null,raw:text.trim()};
  // type detection
  if(/\blista\b/.test(t))r.type='list';
  else if(/^\s*(ricordami|ricorda|nota|promemoria)\b/.test(t)&&!/\b(manutenzion\w*|pellet|appuntament\w*|cantier\w*)\b/.test(t))r.type='note';
  else if(/\bmanutenzion|pulizia\s+(caldaia|stufa)|revisione|tagliando|filtri\b/.test(t))r.type='maintenance';
  else if(/\bpellet|sacch|bancal|consegna|sfuso\b/.test(t))r.type='pellet';
  else if(/\bcantiere|installazione|montaggio|posa\b/.test(t))r.type='site';
  else if(/\bappuntamento|sopralluogo|incontro|riunione|chiamare|telefonare|richiamare|preventivo\b/.test(t))r.type='appointment';
  else if(/\bnota|ricorda(?:re|mi)?|promemoria|segna(?:re)?\b/.test(t))r.type='note';
  const dd=parseDateIT(text);r.date=dd.date;r.time=dd.time;
  if(!r.type&&r.date)r.type='appointment';
  if(!r.type)r.type='note';
  r.employee=findEmployee(text);
  r.person=findClient(text,r.employee);
  // aggiornamento cantiere esistente: "aggiungi 4 ore al cantiere Via Roma" / "cantiere Via Roma: posato basamento"
  if(/\bcantier\w*\b/.test(t)){
    let best=null;
    for(const s of S.sites){const n=norm(s.name);if(n&&reWord(n).test(t)&&(!best||n.length>best.len))best={id:s.id,name:s.name,len:n.length};}
    if(best){
      r.type='site';r.siteId=best.id;r.siteName=best.name;
      const hm=t.match(/(\d+(?:[\.,]\d+)?)\s*or[ae]\b/);
      if(hm)r.hours=parseFloat(hm[1].replace(',','.'));
      let st=text.replace(/^\s*(aggiungi|segna|metti|registra)\s+/i,'').replace(/(\d+(?:[\.,]\d+)?)\s*or[ae]\b/i,'').replace(/\b(al|nel|sul)?\s*cantiere\s+/i,'');
      const escRe=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      st=st.replace(new RegExp(escRe(best.name),'i'),'').replace(new RegExp(escRe(best.name.replace(/^cantiere\s+/i,'')),'i'),'');
      st=st.replace(/^[\s:\-–,]+|[\s:\-–,]+$/g,'').trim();
      r.siteText=st||null;
    }
  }
  // quantities
  let q;
  if((q=t.match(/(\d+(?:[\.,]\d+)?)\s*(sacch\w*|bancal\w*|tonnellat\w*|ton\b|t\b|kg\b|quintal\w*)/))){
    r.qty=parseFloat(q[1].replace(',','.'));
    const u=q[2];
    if(u.startsWith('bancal')){r.qty=r.qty*(S.settings.bagsPerPallet||70);r.unit='sacchi';}
    else if(u.startsWith('sacch'))r.unit='sacchi';
    else if(u.startsWith('ton')||u==='t')r.unit='t';
    else if(u==='kg'){if(/\bsfuso\b/.test(t)){r.qty=r.qty/1000;r.unit='t';}else r.unit='kg';}
    else if(u.startsWith('quintal')){r.qty=r.qty/10;r.unit='t';}
  }
  if(/\bsfuso\b/.test(t)&&r.unit==null&&r.type==='pellet')r.unit='t';
  // liste: "lista ferramenta: viti, tasselli" / "aggiungi guanti alla lista ferramenta"
  if(r.type==='list'){
    const splitItems=s=>s.split(/\s*,\s*|\s+e\s+/i).map(x=>x.trim()).filter(Boolean);
    let lm;
    if((lm=text.match(/aggiungi\s+(.+?)\s+(?:alla|nella|in)\s+lista\s+([\wÀ-ÿ' ]+)/i))){
      r.listName=lm[2].trim();r.listItems=splitItems(lm[1]);r.listAppend=true;
    }else if((lm=text.match(/lista\s+([^:\-]+?)\s*[:\-]\s*(.+)/i))){
      r.listName=lm[1].trim();r.listItems=splitItems(lm[2]);
    }else if((lm=text.match(/lista\s+(?:per\s+|di\s+|della\s+)?([\wÀ-ÿ' ]+)/i))){
      r.listName=lm[1].trim();r.listItems=[];
    }else{r.listName='Nuova lista';r.listItems=[];}
  }
  // clean title: comandi, frase dipendente + nome, frase cliente, data/ora, articolo iniziale
  let title=text.trim()
    .replace(/^\s*(aggiungi|segna|metti|crea|ricordami|ricorda|nota|inserisci|programma)\s+/i,'');
  title=title
    .replace(/\b(fatt[ao]|svolt[ao]|esegui\w+|gestit[ao]|segui\w+)\s+da\b/gi,' ')
    .replace(/\b(la\s+fa|a\s+cura\s+di|assegnat[ao]\s+a|tecnico)\b/gi,' ')
    .replace(/\b(deve|devi|dovrebbe)\s+(fare|svolgere|occuparsi)(\s+di)?\b/gi,' ')
    .replace(/\bfai\s+fare\s+a\b/gi,' ')
    .replace(/\bsi\s+occupa\s+di\b/gi,' ')
    .replace(/\b(deve|devi|dovrebbe)\b/gi,' ');
  if(r.employee)title=title.replace(new RegExp('\\b'+escReg(r.employee.name)+'\\b','gi'),' ');
  if(r.person){const cn=escReg(r.person.name);title=title.replace(new RegExp('\\b(?:a|al|per|dal?|cliente|sig\\.?|signor[ae]?)\\s+'+cn+'\\b','gi'),' ').replace(new RegExp('\\b'+cn+'\\b','gi'),' ');}
  title=title
    .replace(/\b(per\s+)?(oggi|domani|dopodomani|stamattina|stasera)\b/gi,'')
    .replace(/\b(?:il\s+)?(luned[iì]|marted[iì]|mercoled[iì]|gioved[iì]|venerd[iì]|sabato|domenica)\b/gi,'')
    .replace(/\b(?:il\s+)?\d{1,2}\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\b/gi,'')
    .replace(/\btra\s+\d{1,2}\s+giorni\b/gi,'')
    .replace(/\b\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?\b/g,'')
    .replace(/\balle?\s+\d{1,2}([:\.]\d{2})?\b/gi,'')
    .replace(/\bore\s+\d{1,2}([:\.]\d{2})?\b/gi,'')
    .replace(/\s{2,}/g,' ').trim()
    .replace(/^(la|il|lo|le|i|gli|una|un|uno|l['’])\s+/i,'')
    .replace(/[\s,]+$/,'').trim();
  const TDEF={maintenance:'Manutenzione',pellet:'Consegna pellet',appointment:'Appuntamento',site:'Cantiere',list:'Lista',note:'Promemoria'};
  r.title=title?title.charAt(0).toUpperCase()+title.slice(1):(TDEF[r.type]||'Promemoria');
  return r;
}
const TYPE_META={
  maintenance:{label:'Manutenzione',color:'var(--amber)',hex:'#C77F12',ic:'🔧',view:'man'},
  pellet:{label:'Pellet',color:'var(--fire)',hex:'#5E9E2E',ic:'🪵',view:'pellet'},
  appointment:{label:'Appuntamento',color:'var(--cy)',hex:'#5BA02C',ic:'📅',view:'notes'},
  note:{label:'Nota',color:'var(--teal)',hex:'#2E9E5E',ic:'📝',view:'notes'},
  site:{label:'Cantiere',color:'var(--blue)',hex:'#A9742F',ic:'🏗',view:'sites'},
  list:{label:'Lista',color:'#2E9E5E',hex:'#2E9E5E',ic:'☑️',view:'hub'},
};
/* commit parsed object into state */
function commitParsed(p,via){
  const clientId=p.person&&p.person.kind==='client'?p.person.id:null;
  const employeeId=p.employee?p.employee.id:null;
  const personRaw=p.person&&p.person.kind==='raw'?p.person.name:null;
  let msg='';
  if(p.type==='maintenance'){
    S.maintenances.unshift({id:uid(),title:p.title,clientId,clientRaw:personRaw,employeeId,date:p.date,time:p.time,status:p.date?'programmata':'da_fare',notes:'',via,created:Date.now()});
    msg='🔧 Manutenzione registrata'+(p.person?' — '+p.person.name:'')+(p.employee?' · 👷 '+p.employee.name:'')+(p.date?' · '+fmtD(p.date):'')+(p.time?' '+p.time:'');
  }else if(p.type==='pellet'){
    const kind=(p.unit==='t'||/\bsfuso\b/i.test(p.raw||''))?'sfuso':'sacchi';
    S.pellet.unshift({id:uid(),clientId,clientRaw:personRaw,employeeId,qty:p.qty,unit:kind==='sfuso'?'t':(p.unit||'sacchi'),kind,date:p.date,time:p.time,status:'da_consegnare',notes:p.title,via,created:Date.now()});
    msg='🪵 Consegna '+(kind==='sfuso'?'sfuso':'sacchi')+' registrata'+(p.qty?' — '+p.qty+' '+(kind==='sfuso'?'t':p.unit||'sacchi'):'')+(p.person?' · '+p.person.name:'')+(p.employee?' · 👷 '+p.employee.name:'')+(p.date?' · '+fmtD(p.date):'');
  }else if(p.type==='appointment'){
    S.appointments.unshift({id:uid(),title:p.title,clientId,clientRaw:personRaw,employeeId,date:p.date||todayIso(),time:p.time,done:false,via,created:Date.now()});
    msg='📅 Appuntamento segnato — '+fmtD(p.date||todayIso())+(p.time?' '+p.time:'');
  }else if(p.type==='list'){
    const nm=norm(p.listName||'');
    let L=S.lists.find(l=>norm(l.name)===nm||norm(l.name).includes(nm)||nm.includes(norm(l.name)));
    if(L&&(p.listAppend||p.listItems.length)){
      p.listItems.forEach(t=>L.items.push({id:uid(),text:t,done:false}));
      msg='☑️ '+p.listItems.length+' voci aggiunte a «'+L.name+'»';
    }else{
      S.lists.unshift({id:uid(),name:p.listName||'Nuova lista',items:(p.listItems||[]).map(t=>({id:uid(),text:t,done:false})),via,created:Date.now()});
      msg='☑️ Lista «'+(p.listName||'Nuova lista')+'» creata'+(p.listItems.length?' con '+p.listItems.length+' voci':'');
    }
  }else if(p.type==='site'){
    if(p.siteId){
      const s=byId(S.sites,p.siteId);
      s.log.push({id:uid(),date:p.date||todayIso(),text:p.siteText||'Aggiornamento',hours:p.hours||null});
      msg='🏗 «'+s.name+'» aggiornato'+(p.hours?' — +'+p.hours+'h':'')+(p.siteText?' · '+p.siteText:'');
    }else{
      S.sites.unshift({id:uid(),name:p.title,clientId,clientRaw:personRaw,status:'aperto',employees:[],log:[],attachments:[],estHours:null,startDate:p.date||todayIso(),dueDate:null,notes:'',via,created:Date.now()});
      msg='🏗 Cantiere creato — '+p.title;
    }
  }else{
    S.notes.unshift({id:uid(),text:p.title,clientId,date:p.date,pinned:false,via,created:Date.now()});
    msg='📝 Nota salvata';
  }
  save();return msg;
}
/* ================= NAV / RENDER ROUTER ================= */
const VIEWS=[
  {id:'hub',ic:'⚡',label:'Hub'},
  {id:'cal',ic:'📅',label:'Calendario'},
  {id:'notes',ic:'📝',label:'Note'},
  {id:'notif',ic:'🔔',label:'Notifiche'},
  {id:'man',ic:'🔧',label:'Manut.'},
  {id:'pellet',ic:'🪵',label:'Pellet'},
  {id:'sites',ic:'🏗',label:'Cantieri'},
  {id:'macchine',ic:'⚙️',label:'Macchine'},
  {id:'clients',ic:'👥',label:'Clienti'},
  {id:'zone',ic:'🗺️',label:'Zone'},
  {id:'conti',ic:'💰',label:'Conti'},
  {id:'emps',ic:'👷',label:'Personale'},
];
let view='hub';
/* ---- CATALOGO PIATTAFORMA: tutti i moduli Modula (per la schermata "Moduli & richieste") ----
   base = sempre presenti · pronti = attivabili subito dal super-admin · arrivo = su misura/da costruire.
   Tenere allineato con configuratore/catalogo.js e admin/index.html. */
const MODULE_CATALOG={
  base:[
    {id:'hub',ic:'⚡',nome:'Hub',desc:'La schermata iniziale.'},
    {id:'cal',ic:'📅',nome:'Calendario',desc:'Appuntamenti e scadenze.'},
    {id:'notes',ic:'📝',nome:'Note',desc:'Appunti e liste condivise.'},
    {id:'clients',ic:'👥',nome:'Clienti',desc:'Anagrafica clienti.'},
    {id:'emps',ic:'👷',nome:'Personale',desc:'Il tuo team e i permessi.'},
  ],
  pronti:[
    {id:'conti',ic:'💰',nome:'Conti',desc:'Entrate, spese e utile.'},
    {id:'man',ic:'🔧',nome:'Manutenzioni',desc:'Interventi e storico.'},
    {id:'sites',ic:'🏗',nome:'Cantieri',desc:'Lavori in corso e ore.'},
    {id:'macchine',ic:'⚙️',nome:'Macchine',desc:'Parco macchine e schede.'},
    {id:'pellet',ic:'🪵',nome:'Consegne',desc:'Consegne, bolle e scorte.'},
    {id:'zone',ic:'🗺️',nome:'Zone & Mappa',desc:'Zone e clienti sulla mappa.'},
  ],
  arrivo:[
    {id:'prenota',ic:'🗓️',nome:'Prenotazioni',desc:'Appuntamenti online.'},
    {id:'magazzino',ic:'📦',nome:'Magazzino',desc:'Scorte e soglie.'},
    {id:'catalogo',ic:'🏷️',nome:'Catalogo/Listino',desc:'Prodotti e prezzi.'},
    {id:'fatture',ic:'🧾',nome:'Fatture',desc:'Preventivi e fatture.'},
    {id:'documenti',ic:'📁',nome:'Documenti',desc:'Archivio file e contratti.'},
    {id:'report',ic:'📊',nome:'Report',desc:'Statistiche e grafici.'},
    {id:'fidelity',ic:'🎁',nome:'Fidelity',desc:'Punti e promozioni.'},
    {id:'turni',ic:'⏱️',nome:'Turni & Presenze',desc:'Turni e timbrature.'},
  ],
};
const catName=id=>{for(const k of['base','pronti','arrivo']){const m=MODULE_CATALOG[k].find(x=>x.id===id);if(m)return m.nome;}return id;};
/* moduli attivi oggi sul tenant (base sempre + extra accesi dal super-admin) */
const activeModuleIds=()=>{const base=MODULE_CATALOG.base.map(m=>m.id);const extra=(ACTIVE_MODULES||[]).filter(id=>!base.includes(id)&&id!=='notif');return[...base,...extra];};
/* ---- accesso (Supabase Auth) ---- */
const me=()=>S.session?byId(S.employees,S.session.empId):null;
const isOwner=()=>{const m=me();return !!(m&&m.isOwner);};
const can=p=>isOwner()||(me()&&me().perms&&me().perms.includes(p));
const randCode=(len=5)=>{const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789';const a=new Uint8Array(len);crypto.getRandomValues(a);return Array.from(a,x=>A[x%A.length]).join('');};
const genInvite=n=>(norm(n).replace(/[^a-z]/g,'').slice(0,5).toUpperCase()||'USER')+'-'+randCode(5);
async function logout(){if(DEMO){toast('Demo: in un\'app reale qui esci dall\'account');return;}try{await sb.auth.signOut();}catch(e){}S=blank();authMode='login';closeSheet();renderLock();}
function nav(v){view=v;render();window.scrollTo(0,0);}
/* barra in basso (mobile) personalizzabile — salvata sul dispositivo, una per utente */
const NAV_DEFAULT=['hub','cal','man','pellet','sites'];
let bottomNavMem={};
function getTheme(){try{return localStorage.getItem('caywork_theme')==='dark'?'dark':'light';}catch(e){return 'light';}}
function applyTheme(t){const dark=t==='dark';if(dark)document.documentElement.dataset.theme='dark';else document.documentElement.removeAttribute('data-theme');const m=document.querySelector('meta[name=theme-color]');if(m)m.content=dark?'#14160F':'#F5F2EA';}
function setTheme(t){try{localStorage.setItem('caywork_theme',t);}catch(e){}applyTheme(t);if(typeof renderNav==='function')renderNav();}
function toggleTheme(){setTheme(getTheme()==='dark'?'light':'dark');}
function navKey(){return 'caywork_nav_'+(S.session?S.session.empId:'x');}
function getBottomNav(){const k=navKey();if(bottomNavMem[k])return bottomNavMem[k];try{const v=JSON.parse(localStorage.getItem(k)||'null');if(Array.isArray(v)&&v.length){bottomNavMem[k]=v;return v;}}catch(e){}return NAV_DEFAULT;}
function setBottomNav(ids){const k=navKey();bottomNavMem[k]=ids.slice();try{localStorage.setItem(k,JSON.stringify(ids));}catch(e){}}
function renderNav(){
  {const bt=$('#brandtop');if(bt)bt.textContent=BRAND.name||'Modula';}
  const vis=visViews();
  const ps=pushState();const sep='margin-top:10px;border-top:1px solid var(--line);border-radius:0;padding-top:14px';
  const pushNav=ps==='unsupported'?''
    :ps==='on'?`<div class="ni" style="${sep};color:var(--cy)" onclick="pushTest()"><span class="ic">📩</span>Notifica di prova</div><div class="ni" style="color:var(--teal)" onclick="disablePush()"><span class="ic">🔔</span>Notifiche attive — disattiva</div>`
    :ps==='blocked'?`<div class="ni" style="${sep};color:var(--t3)"><span class="ic">🔕</span>Notifiche bloccate dal dispositivo</div>`
    :`<div class="ni" style="${sep};color:var(--amber)" onclick="enablePush()"><span class="ic">🔔</span>Attiva notifiche</div>`;
  $('#navside').innerHTML=vis.map(v=>{const c=v.id==='notif'?notifCount():0;return`<div class="ni ${view===v.id?'act':''}" onclick="nav('${v.id}')"><span class="ic">${v.ic}</span>${v.label}${c?` <span class="badge" style="margin-left:auto;border-color:var(--cy);color:var(--cy)">${c}</span>`:''}</div>`;}).join('')
    +pushNav
    +(isOwner()?`<div class="ni" style="${ps==='unsupported'?sep:''}" onclick="openModuleStore()"><span class="ic">🧩</span>Moduli & richieste</div>`:'')
    +(isOwner()?`<div class="ni" onclick="openBackup()"><span class="ic">💾</span>Backup dati</div>`:'')
    +(isOwner()?`<div class="ni" onclick="openImport()"><span class="ic">📥</span>Importa dati</div>`:'')
    +`<div class="ni" onclick="toggleTheme()"><span class="ic">${getTheme()==='dark'?'☀️':'🌙'}</span>${getTheme()==='dark'?'Tema chiaro':'Tema scuro'}</div>`
    +`<div class="ni" onclick="openChangePassword()"><span class="ic">🔑</span>Cambia password</div>`
    +`<div class="ni" onclick="logout()"><span class="ic">🚪</span>Esci (${esc(me().name)})</div>`;
  const allowed=new Set(vis.map(v=>v.id));
  let chosen=getBottomNav().filter(id=>allowed.has(id)).slice(0,5);
  if(!chosen.length)chosen=vis.filter(v=>v.id!=='notif').slice(0,5).map(v=>v.id);
  const mobAll=chosen.map(id=>VIEWS.find(v=>v.id===id)).filter(Boolean);
  const mob=[...mobAll,{id:'menu',ic:'☰',label:'Altro'}];
  const nc=notifCount();const inBar=new Set(mobAll.map(v=>v.id));
  $('#navbottom').innerHTML=mob.map(v=>{
    const dot=((v.id==='notif')||(v.id==='menu'&&!inBar.has('notif')))&&nc?`<span class="nbdot">${nc>9?'9+':nc}</span>`:'';
    const act=view===v.id||(v.id==='menu'&&!inBar.has(view));
    return`<div class="nb ${act?'act':''}" onclick="${v.id==='menu'?'openMenu()':`nav('${v.id}')`}"><span class="ic">${v.ic}${dot}</span>${v.label}</div>`;
  }).join('');
}
function openMenu(){
  const vis=visViews();
  const inBar=new Set(getBottomNav().filter(id=>vis.some(v=>v.id===id)).slice(0,5));
  const overflow=vis.filter(v=>!inBar.has(v.id));
  const ps=pushState();
  const pushRow=ps==='unsupported'?''
    :ps==='blocked'?`<div class="sg" style="padding:13px;border-color:var(--line2);color:var(--t3)">🔕 Notifiche bloccate dal telefono — abilitale nelle impostazioni del dispositivo</div>`
    :ps==='on'?`<div class="sg" style="padding:13px;border-color:var(--cy);color:var(--cy)" onclick="closeSheet();pushTest()">📩 Invia notifica di prova</div><div class="sg" style="padding:13px;border-color:var(--teal);color:var(--teal)" onclick="closeSheet();disablePush()">🔔 Notifiche attive — tocca per disattivare</div>`
    :`<div class="sg" style="padding:13px;border-color:var(--amber);color:var(--amber)" onclick="closeSheet();enablePush()">🔔 Attiva notifiche su questo telefono</div>`;
  openSheet(`<h3>Sezioni <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="seg" style="flex-direction:column;gap:8px">
    ${overflow.map(v=>`<div class="sg" style="padding:13px" onclick="closeSheet();nav('${v.id}')">${v.ic} ${v.label}${v.id==='notif'&&notifCount()?' ('+notifCount()+')':''}</div>`).join('')||'<div class="subtle" style="padding:4px 2px">Tutte le sezioni sono già nella barra in basso.</div>'}
    <div class="sg" style="padding:13px;border-color:var(--cy);color:var(--cy)" onclick="closeSheet();editBottomNav()">⚙️ Personalizza la barra in basso</div>
    ${pushRow}
    ${isOwner()?`<div class="sg" style="padding:13px;border-color:var(--cy);color:var(--cy)" onclick="closeSheet();openModuleStore()">🧩 Moduli & richieste</div>`:''}
    ${isOwner()?`<div class="sg" style="padding:13px;border-color:var(--line2)" onclick="closeSheet();openBackup()">💾 Backup dati</div>`:''}
    ${isOwner()?`<div class="sg" style="padding:13px;border-color:var(--line2)" onclick="closeSheet();openImport()">📥 Importa dati</div>`:''}
    <div class="sg" style="padding:13px" onclick="closeSheet();toggleTheme()">${getTheme()==='dark'?'☀️ Tema chiaro':'🌙 Tema scuro'}</div>
    <div class="sg" style="padding:13px" onclick="closeSheet();openChangePassword()">🔑 Cambia password</div>
    <div class="sg" style="padding:13px;border-color:rgba(214,69,40,.35);color:var(--coral)" onclick="logout()">🚪 Esci (${esc(me().name)})</div>
  </div>`);
}
function openChangePassword(){
  if(DEMO){toast('Demo: in un\'app reale qui cambi la password');return;}
  openSheet(`<h3>Cambia password <span class="x" onclick="closeSheet()">✕</span></h3>
    <div class="subtle" style="margin-bottom:10px">Imposta una nuova password per il tuo accesso (almeno 6 caratteri).</div>
    <input id="cp-pw" class="txt" type="password" placeholder="Nuova password" autocomplete="new-password">
    <div style="height:8px"></div>
    <input id="cp-pw2" class="txt" type="password" placeholder="Ripeti la password" autocomplete="new-password" onkeydown="if(event.key==='Enter')doChangePassword()">
    <div id="cp-err" style="color:var(--coral);font-size:13px;min-height:18px;margin:6px 0"></div>
    <button class="btn pri" style="width:100%" onclick="doChangePassword()">Salva nuova password</button>`);
  setTimeout(()=>{const f=document.getElementById('cp-pw');if(f)f.focus();},60);
}
async function doChangePassword(){
  const pw=document.getElementById('cp-pw').value, pw2=document.getElementById('cp-pw2').value;
  const er=document.getElementById('cp-err'); er.textContent='';
  if(pw.length<6){er.textContent='Almeno 6 caratteri';return;}
  if(pw!==pw2){er.textContent='Le due password non coincidono';return;}
  const{error}=await sb.auth.updateUser({password:pw});
  if(error){er.textContent=error.message;return;}
  closeSheet();toast('✓ Password aggiornata');
}
/* personalizzazione barra in basso */
function editBottomNav(){
  const vis=visViews();
  const cur=getBottomNav().filter(id=>vis.some(v=>v.id===id));
  openSheet(`<h3>⚙️ Barra in basso <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:10px">Tocca le sezioni che vuoi nella barra in basso (massimo 5). Le altre restano dentro «☰ Altro».</div>
  <div class="seg" id="nav-pick" style="flex-direction:column;gap:8px">
    ${vis.map(v=>`<div class="sg ${cur.includes(v.id)?'on':''}" data-v="${v.id}" style="padding:13px;justify-content:flex-start" onclick="toggleNavPick(this)">${v.ic} ${v.label}</div>`).join('')}
  </div>
  <div class="subtle" id="nav-count" style="margin-top:8px"></div>
  <div class="actions"><button class="btn ghost" onclick="resetBottomNav()">↩ Ripristina</button><button class="btn pri" onclick="saveBottomNav()">Salva</button></div>`);
  updateNavCount();
}
function toggleNavPick(el){
  if(!el.classList.contains('on')&&document.querySelectorAll('#nav-pick .sg.on').length>=5){toast('Massimo 5 nella barra');return;}
  el.classList.toggle('on');updateNavCount();
}
function updateNavCount(){const el=$('#nav-count');if(el)el.textContent=document.querySelectorAll('#nav-pick .sg.on').length+' / 5 selezionate';}
function saveBottomNav(){
  const ids=[...document.querySelectorAll('#nav-pick .sg.on')].map(x=>x.dataset.v);
  if(!ids.length){toast('Scegli almeno 1 sezione');return;}
  setBottomNav(ids);closeSheet();renderNav();toast('✓ Barra aggiornata');
}
function resetBottomNav(){setBottomNav(NAV_DEFAULT);closeSheet();renderNav();toast('↩ Barra ripristinata');}
/* ====== MODULI & RICHIESTE (solo titolare) ======
   Il titolare vede i moduli attivi, può spuntare quelli che vorrebbe in più o
   descrivere un modulo su misura, e inviare la richiesta via email a Modula.
   NON attiva nulla: l'attivazione la decide il super-admin dalla console admin. */
function openModuleStore(){
  const active=new Set(activeModuleIds());
  const card=(m,state)=>{
    // state: 'on' = già attivo · 'add' = richiedibile (pronto) · 'soon' = su misura/in arrivo
    const on=state==='on';
    const tag=on?'<span class="badge" style="border-color:var(--teal);color:var(--teal)">attivo</span>'
      :state==='soon'?'<span class="badge" style="border-color:var(--amber);color:var(--amber)">su misura</span>':'';
    const click=on?'':`onclick="this.classList.toggle('on')"`;
    return `<div class="sg modpick ${on?'lock':''}" data-id="${m.id}" data-state="${state}" ${click}
      style="padding:12px;justify-content:flex-start;align-items:flex-start;gap:10px;${on?'opacity:.7;cursor:default':''}">
      <span style="font-size:20px">${m.ic}</span>
      <div style="text-align:left;flex:1"><div style="font-weight:600">${esc(m.nome)} ${tag}</div>
      <div class="subtle" style="font-size:11.5px;margin-top:2px">${esc(m.desc)}</div></div>
    </div>`;
  };
  const baseCards=MODULE_CATALOG.base.map(m=>card(m,'on')).join('');
  const prontiAttivi=MODULE_CATALOG.pronti.filter(m=>active.has(m.id)).map(m=>card(m,'on')).join('');
  const prontiAdd=MODULE_CATALOG.pronti.filter(m=>!active.has(m.id)).map(m=>card(m,'add')).join('');
  const arrivo=MODULE_CATALOG.arrivo.map(m=>card(m,'soon')).join('');
  openSheet(`<h3>🧩 Moduli & richieste <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px">Questi sono i moduli della tua app. Spunta quelli che vorresti <b>aggiungere</b> o descrivi un <b>modulo su misura</b>: la richiesta arriva a Modula, che lo attiva o lo costruisce per te.</div>

  <div class="modstore-sec">✓ Attivi nella tua app</div>
  <div class="seg" style="flex-direction:column;gap:8px">${baseCards}${prontiAttivi}</div>

  ${prontiAdd?`<div class="modstore-sec">➕ Puoi aggiungerli subito</div>
  <div class="seg" style="flex-direction:column;gap:8px">${prontiAdd}</div>`:''}

  <div class="modstore-sec">✨ Su misura / in arrivo</div>
  <div class="seg" style="flex-direction:column;gap:8px">${arrivo}</div>

  <div class="fld" style="margin-top:14px"><label>Modulo su misura — descrivi cosa ti serve</label>
    <textarea id="mod-rich" rows="3" placeholder="es. «Un modulo per i controlli F-Gas: per ogni apparecchio data del controllo, kg di gas e avviso quando scade.»" style="width:100%;background:var(--bg2);border:1px solid var(--line);border-radius:9px;color:var(--t1);font:inherit;padding:10px;resize:vertical"></textarea></div>

  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="sendModuleRequest()">✉️ Invia richiesta</button></div>`);
}
function sendModuleRequest(){
  const picks=[...document.querySelectorAll('.modpick.on')].map(el=>({id:el.dataset.id,state:el.dataset.state}));
  const add=picks.filter(p=>p.state==='add').map(p=>catName(p.id));
  const soon=picks.filter(p=>p.state==='soon').map(p=>catName(p.id));
  const rich=(document.getElementById('mod-rich')?.value||'').trim();
  if(!add.length&&!soon.length&&!rich){toast('Spunta un modulo o descrivi cosa ti serve');return;}
  const support=CFG.SUPPORT_EMAIL||'lollyberry00@gmail.com';
  const who=me();
  const lines=[
    `RICHIESTA MODULI — ${BRAND.name||'(azienda)'}`,
    `Da: ${who?who.name:''}`,
    `Attivi ora: ${activeModuleIds().map(catName).join(', ')}`,
    ``,
    add.length?`Da ATTIVARE (già pronti): ${add.join(', ')}`:'',
    soon.length?`Su misura / in arrivo richiesti: ${soon.join(', ')}`:'',
    rich?`\nMODULO SU MISURA (descrizione):\n${rich}`:'',
  ].filter(Boolean);
  const sub=`Richiesta moduli — ${BRAND.name||'azienda'}`;
  window.location.href=`mailto:${support}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(lines.join('\n'))}`;
  closeSheet();toast('📨 Apro l\'email con la tua richiesta');
}
/* il titolare ha finito i posti del piano → chiede a Modula di aumentarli (via email) */
function requestMoreSeats(){
  const support=CFG.SUPPORT_EMAIL||'lollyberry00@gmail.com';
  const who=me();
  const body=[
    `PIÙ POSTI DIPENDENTE — ${BRAND.name||'(azienda)'}`,
    `Da: ${who?who.name:''}`,
    `Posti del piano: ${MAX_EMP!=null?MAX_EMP:'illimitati'} · già usati: ${seatCount()}`,
    ``,
    `Vorrei aumentare i posti dipendente. Nuovo numero desiderato: ______`
  ].join('\n');
  window.location.href=`mailto:${support}?subject=${encodeURIComponent('Più posti — '+(BRAND.name||'azienda'))}&body=${encodeURIComponent(body)}`;
  closeSheet();toast('📨 Apro l\'email per la richiesta');
}
function openBackup(){
  const counts=`${S.clients.length} clienti · ${S.maintenances.length} manutenzioni · ${S.pellet.length} consegne · ${S.sites.length} cantieri · ${S.appointments.length} appuntamenti · ${S.notes.length} note · ${S.lists.length} liste`;
  openSheet(`<h3>💾 Backup & impostazioni <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Intestazione azienda (per i bollettini stampati)</label><input id="set-co" value="${esc(S.settings.companyName||'')}" placeholder="es. Rossi Riscaldamenti Sagl — Via X, Lugano" onchange="S.settings.companyName=this.value.trim();save();toast('Intestazione salvata')"></div>
  <div class="fld"><label>📍 Base / officina (paese di partenza per i giri di consegna · salvata su questo dispositivo)</label><input id="set-base" list="set-baselist" value="${esc(typeof zoneBaseTown==='function'?zoneBaseTown():'')}" placeholder="es. San Vittore, Roveredo" onchange="zoneSetBase(this.value)"><datalist id="set-baselist">${typeof ZONE_PAESI!=='undefined'?[...new Set(ZONE_PAESI.map(t=>t.p))].sort().map(p=>`<option value="${esc(p)}">`).join(''):''}</datalist></div>
  <div class="frow">
    <div class="fld"><label>Prezzo sfuso CHF/t</label><input type="number" inputmode="decimal" value="${S.settings.pricePerTon||''}" onchange="S.settings.pricePerTon=parseFloat(this.value)||null;save();toast('Prezzo salvato')"></div>
    <div class="fld"><label>Prezzo CHF/sacco</label><input type="number" inputmode="decimal" step="any" value="${S.settings.pricePerBag||''}" onchange="S.settings.pricePerBag=parseFloat(this.value)||null;save();toast('Prezzo salvato')"></div>
  </div>
  <div class="fld"><label>Export CSV (per Excel / commercialista)</label>
    <div class="seg">
      <div class="sg" onclick="csvPellet()">🪵 Pellet</div>
      <div class="sg" onclick="csvMan()">🔧 Manutenzioni</div>
      <div class="sg" onclick="csvOre()">⏱ Ore dipendenti</div>
      <div class="sg" onclick="csvSites()">🏗 Cantieri</div>
    </div>
  </div>
  <div class="subtle" style="margin-bottom:14px">I dati vivono nel cloud (Supabase), sincronizzati fra tutti i dispositivi. L'export crea comunque una copia locale di sicurezza; l'import aggiunge al cloud i dati di un backup della vecchia app locale.<br><br><b style="color:var(--t2)">Ora in archivio:</b> ${counts}</div>
  <div class="actions" style="flex-direction:column">
    <button class="btn pri" onclick="exportBackup()">⬇ Esporta backup (.json)</button>
    <button class="btn" onclick="$('#imp-file').click()">⬆ Importa backup</button>
    <input type="file" id="imp-file" accept=".json,application/json" style="display:none" onchange="importBackup(event)">
  </div>`);
}
function exportBackup(){
  const data=JSON.stringify(S,null,2);
  const blob=new Blob([data],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='ptek-backup-'+todayIso()+'.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  toast('⬇ Backup esportato');
}
function importBackup(ev){
  const f=ev.target.files[0];if(!f)return;
  if(!isOwner()){toast('Solo il titolare può importare');return;}
  const r=new FileReader();
  r.onload=async()=>{
    try{
      const d=JSON.parse(r.result);
      if(!d||!Array.isArray(d.clients))throw new Error('struttura');
      if(!confirm('Importare il backup nel cloud? I dati verranno AGGIUNTI a quelli attuali.'))return;
      toast('⏳ Importo…');
      const map={};const mid=o=>{if(!o)return null;if(o==='me')return S.session.empId;if(!map[o])map[o]=uid();return map[o];};
      (d.employees||[]).forEach(e=>{if(e.id==='me')return;S.employees.push({id:mid(e.id),name:e.name,role:e.role||'',phone:e.phone||'',perms:e.perms||['cal','man','chat'],isOwner:false,active:e.active!==false,inviteCode:genInvite(e.name),userId:null});});
      (d.clients||[]).forEach(c=>S.clients.push({id:mid(c.id),name:c.name,phone:c.phone||'',zone:c.zone||'',group:c.group||'',address:c.address||'',plant:c.plant||'',pellet:c.pellet||'',maintenance:c.maintenance||'',notes:c.notes||'',created:c.created||Date.now()}));
      (d.noteGroups||[]).forEach(g=>S.noteGroups.push({id:mid(g.id),name:g.name,members:(g.members||[]).map(mid)}));
      (d.maintenances||[]).forEach(m=>S.maintenances.push({id:mid(m.id),title:m.title,clientId:mid(m.clientId),clientRaw:m.clientRaw||null,employeeId:mid(m.employeeId),date:m.date||null,time:m.time||null,status:m.status||'da_fare',notes:m.notes||'',recur:m.recur||0,price:m.price||null,report:m.report||null,via:m.via||'import',created:m.created||Date.now()}));
      (d.appointments||[]).forEach(a=>S.appointments.push({id:mid(a.id),title:a.title,clientId:mid(a.clientId),clientRaw:a.clientRaw||null,employeeId:mid(a.employeeId),date:a.date||null,time:a.time||null,done:!!a.done,via:a.via||'import',created:a.created||Date.now()}));
      (d.pellet||[]).forEach(p=>{const kind=(p.kind==='sfuso'||p.unit==='t')?'sfuso':'sacchi';const unit=kind==='sfuso'?'t':(['sacchi','kg'].includes(p.unit)?p.unit:'sacchi');S.pellet.push({id:mid(p.id),clientId:mid(p.clientId),clientRaw:p.clientRaw||null,qty:p.qty||null,unit,kind,date:p.date||null,time:p.time||null,status:p.status||'da_consegnare',price:p.price||null,signature:p.signature||null,signedName:p.signedName||'',notes:p.notes||'',via:p.via||'import',created:p.created||Date.now()});});
      const pendingAtt=[];
      (d.sites||[]).forEach(s=>{
        const ns={id:mid(s.id),name:s.name,clientId:mid(s.clientId),clientRaw:s.clientRaw||null,status:['aperto','da_fatturare','chiuso'].includes(s.status)?s.status:'aperto',employees:(s.employees||[]).map(mid).filter(Boolean),estHours:s.estHours||null,amount:s.amount||null,startDate:s.startDate||null,dueDate:s.dueDate||null,notes:s.notes||'',via:s.via||'import',created:s.created||Date.now(),
          log:(s.log||[]).map(l=>({id:uid(),date:l.date||null,text:l.text,hours:l.hours||null,empId:mid(l.empId)})),attachments:[]};
        (s.attachments||[]).forEach(a=>{if(a.dataUrl)pendingAtt.push({siteId:ns.id,a});});
        S.sites.push(ns);
      });
      (d.notes||[]).forEach(n=>S.notes.push({id:mid(n.id),text:n.text,clientId:mid(n.clientId),groupId:mid(n.groupId),date:n.date||null,pinned:!!n.pinned,archived:!!n.archived,via:n.via||'import',created:n.created||Date.now()}));
      (d.lists||[]).forEach(l=>S.lists.push({id:mid(l.id),name:l.name,via:l.via||'import',created:l.created||Date.now(),items:(l.items||[]).map(i=>({id:uid(),text:i.text,done:!!i.done}))}));
      (d.callLog||[]).forEach(c=>S.callLog.push({id:uid(),clientId:mid(c.clientId),year:c.year,called:!!c.called,outcome:c.outcome||'',note:c.note||'',maintId:mid(c.maintId)}));
      if(d.settings){Object.assign(S.settings,{bagsPerPallet:d.settings.bagsPerPallet||S.settings.bagsPerPallet,companyName:d.settings.companyName||S.settings.companyName,pricePerTon:d.settings.pricePerTon||S.settings.pricePerTon,pricePerBag:d.settings.pricePerBag||S.settings.pricePerBag});}
      await syncNow();
      for(const{siteId,a}of pendingAtt){
        try{
          const blob=await(await fetch(a.dataUrl)).blob();
          const path=TENANT_ID+'/site/'+siteId+'/'+uid()+'-'+a.name;
          await sb.storage.from('allegati').upload(path,blob,{contentType:blob.type||'application/octet-stream'});
          const row={id:uid(),site_id:siteId,name:a.name,type:a.type||'file',storage_path:path,date:a.date||todayIso()};
          await sb.from('attachments').insert(row);
          const s=byId(S.sites,siteId);s.attachments.push({id:row.id,name:a.name,type:row.type,storagePath:path,date:row.date});
        }catch(e){console.error('allegato',e);}
      }
      closeSheet();render();toast('✓ Backup importato nel cloud'+(pendingAtt.length?' con '+pendingAtt.length+' allegati':''));
    }catch(e){console.error(e);toast('⚠️ Import: '+(e.message||'file non valido'));}
  };
  r.readAsText(f);
}

/* ===== Import dati da file "modula-import" (prodotto dalla skill importa-dati). Accetta anche il vecchio "ptek-import". ===== */
let importDraft=null,lastImportBatch=null;
const impKey=s=>norm(s).replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean).sort().join(' ');
function openImport(){
  if(!isOwner()){toast('Solo il titolare può importare');return;}
  const undo=lastImportBatch?`<div class="actions" style="flex-direction:column"><button class="btn" style="border-color:var(--amber);color:var(--amber)" onclick="undoImport()">↩ Annulla ultimo import (${lastImportBatch.count} record)</button></div>`:'';
  openSheet(`<h3>📥 Importa dati <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:12px">Aggiungi in blocco clienti, consegne pellet, manutenzioni o appuntamenti da un file. Vedrai sempre un'<b>anteprima</b> prima di scrivere; i dati restano su questo dispositivo finché non confermi.</div>
  <div style="border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:10px">
    <div style="font-weight:600;margin-bottom:3px">📊 Da Excel o CSV</div>
    <div class="subtle" style="margin-bottom:8px">.xlsx, .xls, .csv — la lista esportata dal tuo gestionale o da Excel. Colleghi tu le colonne ai campi dell'app (provo a indovinare). Non serve Claude.</div>
    <button class="btn pri" style="width:100%" onclick="$('#imp-sheet-file').click()">Scegli Excel / CSV</button>
    <input type="file" id="imp-sheet-file" accept=".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style="display:none" onchange="loadSheetFile(event)">
  </div>
  <div style="border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:10px">
    <div style="font-weight:600;margin-bottom:3px">🤖 Da file preparato con Claude</div>
    <div class="subtle" style="margin-bottom:8px">Un <b>modula-import.json</b> creato con la skill «importa-dati» — per PDF, scansioni o file complicati.</div>
    <button class="btn" style="width:100%" onclick="$('#imp-data-file').click()">Scegli modula-import.json</button>
    <input type="file" id="imp-data-file" accept=".json,application/json" style="display:none" onchange="loadImportFile(event)">
  </div>
  ${undo}`);
}
/* lettura diretta Excel/CSV in-app (SheetJS caricato on-demand) */
let _xlsxP=null;
function ensureXLSX(){
  if(window.XLSX)return Promise.resolve();
  if(_xlsxP)return _xlsxP;
  _xlsxP=new Promise((res,rej)=>{const s=document.createElement('script');s.src='./vendor/xlsx.full.min.js';s.onload=()=>res();s.onerror=()=>{_xlsxP=null;rej();};document.head.appendChild(s);});
  return _xlsxP;
}
let importRows=[],importHeaders=[],importEntity='clients',importUnit='sacchi';
const IMP_ENT_LABEL={clients:'👥 Clienti',pellet:'🪵 Pellet',maintenances:'🔧 Manut.',appointments:'📅 Appunt.'};
const IMP_FIELDS={
  clients:[
    {k:'lastName',label:'Cognome / Ditta',hints:['cognome','ditta','surname','azienda','ragione']},
    {k:'firstName',label:'Nome',hints:['nome','first','vorname','prenom']},
    {k:'name',label:'Nome completo (se non separato)',hints:['nominativo','denominazione','intestatario','cliente','contatto']},
    {k:'street',label:'Via',hints:['via','indirizzo','street','strasse','adresse','rue']},
    {k:'streetNo',label:'Civico',hints:['civico','nr','numero','hausnummer']},
    {k:'cap',label:'CAP',hints:['cap','plz','postal']},
    {k:'town',label:'Paese / Luogo',hints:['luogo','paese','citta','comune','town','city','ort','localita']},
    {k:'phone',label:'Telefono',hints:['tel','cell','phone','telefono','natel','mobil']},
    {k:'email',label:'Email',hints:['email','mail','posta']},
    {k:'group',label:'Gruppo / Zona',hints:['gruppo','zona','group','categoria']},
    {k:'notes',label:'Note',hints:['note','nota','osserv','bemerk']},
  ],
  pellet:[
    {k:'clientName',label:'Cliente',hints:['cliente','client','cognome','ditta','nominativo']},
    {k:'qty',label:'Quantità',hints:['quant','qta','sacchi','peso','kg']},
    {k:'date',label:'Data',hints:['data','date','giorno','consegna']},
    {k:'price',label:'Prezzo',hints:['prezzo','importo','price','chf','costo']},
    {k:'notes',label:'Note',hints:['note','nota']},
  ],
  maintenances:[
    {k:'clientName',label:'Cliente',hints:['cliente','client','cognome','ditta','nominativo']},
    {k:'title',label:'Titolo / Descrizione',hints:['titolo','descr','lavoro','interv','oggetto','title']},
    {k:'date',label:'Data',hints:['data','date','giorno','scadenza']},
    {k:'type',label:'Tipo',hints:['tipo','type','impianto','macchina']},
    {k:'price',label:'Prezzo',hints:['prezzo','importo','price','chf','costo']},
    {k:'notes',label:'Note',hints:['note','nota']},
  ],
  appointments:[
    {k:'clientName',label:'Cliente',hints:['cliente','client','cognome','ditta','nominativo']},
    {k:'title',label:'Titolo',hints:['titolo','oggetto','descr','title','motivo']},
    {k:'date',label:'Data',hints:['data','date','giorno']},
    {k:'time',label:'Ora',hints:['ora','orario','time']},
  ],
};
const cleanCell=v=>{
  if(v==null)return'';
  if(v instanceof Date){const z=n=>String(n).padStart(2,'0');return v.getFullYear()+'-'+z(v.getMonth()+1)+'-'+z(v.getDate());}
  const s=String(v).trim();return(s===','||s==='-')?'':s;
};
function rowsFromWorkbook(wb){
  const ws=wb.Sheets[wb.SheetNames[0]];if(!ws)return{headers:[],rows:[]};
  const aoa=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,cellDates:true,defval:''});
  const hi=aoa.findIndex(r=>r&&r.some(c=>String(c==null?'':c).trim()));
  if(hi<0)return{headers:[],rows:[]};
  const BAD=new Set(['__proto__','constructor','prototype']);
  const headers=aoa[hi].map((h,i)=>{const c=cleanCell(h)||('Colonna '+(i+1));return BAD.has(c)?('Colonna '+(i+1)):c;});
  const rows=aoa.slice(hi+1).filter(r=>r&&r.some(c=>String(c==null?'':c).trim())).map(r=>{const o=Object.create(null);headers.forEach((h,i)=>{o[h]=cleanCell(r[i]);});return o;});
  return{headers,rows};
}
function loadSheetFile(ev){
  const f=ev.target.files[0];if(!f)return;ev.target.value='';
  toast('⏳ Leggo il file…');
  ensureXLSX().then(()=>{
    const r=new FileReader();
    r.onload=()=>{
      try{
        const wb=XLSX.read(new Uint8Array(r.result),{type:'array',cellDates:true});
        const o=rowsFromWorkbook(wb);
        if(!o.rows.length){toast('Il file sembra vuoto o senza righe');return;}
        importHeaders=o.headers;importRows=o.rows;importEntity='clients';importUnit='sacchi';
        openColumnMap();
      }catch(e){console.error(e);toast('⚠️ Non riesco a leggere questo file');}
    };
    r.readAsArrayBuffer(f);
  }).catch(()=>toast('⚠️ Libreria Excel non disponibile (serve connessione la prima volta)'));
}
function autoMap(ent){
  const used=new Set(),m={};
  IMP_FIELDS[ent].forEach(f=>{const h=importHeaders.find(h=>!used.has(h)&&f.hints.some(t=>norm(h).includes(t)));if(h){m[f.k]=h;used.add(h);}});
  return m;
}
function openColumnMap(){
  const ent=importEntity,auto=autoMap(ent);
  const colOpts=sel=>`<option value="">— nessuna —</option>`+importHeaders.map(h=>`<option value="${esc(h)}" ${sel===h?'selected':''}>${esc(h)}</option>`).join('');
  const entSeg=Object.keys(IMP_ENT_LABEL).map(k=>`<div class="sg ${ent===k?'on':''}" onclick="importEntity='${k}';openColumnMap()">${IMP_ENT_LABEL[k]}</div>`).join('');
  const unitRow=ent==='pellet'?`<div class="fld"><label>Unità delle quantità</label><select onchange="importUnit=this.value">${[['sacchi','📦 Sacchi'],['t','🪵 Sfuso (ton)']].map(([v,l])=>`<option value="${v}" ${importUnit===v?'selected':''}>${l}</option>`).join('')}</select></div>`:'';
  const fields=IMP_FIELDS[ent].map(f=>`<div class="frow" style="align-items:center;gap:8px"><div style="flex:1;font-size:13px;color:var(--t2)">${f.label}</div><div class="fld" style="flex:1;margin:0"><select id="map-${f.k}">${colOpts(auto[f.k])}</select></div></div>`).join('');
  openSheet(`<h3>📊 Collega le colonne <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="subtle" style="margin-bottom:8px">Trovate <b>${importRows.length}</b> righe. Scegli che dati sono e collega ogni colonna del file al campo giusto (ho già provato a indovinare).</div>
  <div class="fld"><label>Che dati sono?</label><div class="seg">${entSeg}</div></div>
  ${unitRow}
  <div style="border-top:1px solid var(--line);margin:8px 0 10px"></div>
  ${fields}
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="importMapPreview()">Anteprima →</button></div>`);
}
function importMapPreview(){
  const ent=importEntity,map={};
  IMP_FIELDS[ent].forEach(f=>{const v=$('#map-'+f.k)?.value;if(v)map[f.k]=v;});
  const need=ent==='clients'?(map.lastName||map.firstName||map.name):map.clientName;
  if(!need){toast('Collega almeno '+(ent==='clients'?'Cognome, Nome o Nome completo':'la colonna Cliente'));return;}
  const arr=importRows.map(r=>{const o={};IMP_FIELDS[ent].forEach(f=>{if(map[f.k])o[f.k]=r[map[f.k]]||'';});if(ent==='pellet')o.unit=importUnit;return o;});
  importDraft=buildImportDraft({format:'ptek-import',version:1,entities:{[ent]:arr}});
  if(!importDraft.total){toast('Nessuna riga valida con questa mappatura');return;}
  showImportPreview();
}
function loadImportFile(ev){
  const f=ev.target.files[0];if(!f)return;ev.target.value='';
  const r=new FileReader();
  r.onload=()=>{
    let d;try{d=JSON.parse(r.result);}catch(e){toast('⚠️ File non valido (JSON)');return;}
    if(!d||(d.format!=='modula-import'&&d.format!=='ptek-import')){toast('⚠️ Non è un file di import valido');return;}
    try{importDraft=buildImportDraft(d);}catch(e){console.error(e);toast('⚠️ '+(e.message||'file non valido'));return;}
    if(!importDraft.total){toast('Nessun dato da importare nel file');return;}
    showImportPreview();
  };
  r.readAsText(f);
}
function buildImportDraft(raw){
  const ent=raw.entities||{};const CAP=5000;
  const isoOk=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''))?String(s):null;
  const timeOk=s=>{s=String(s||'').trim();return /^\d{1,2}:\d{2}$/.test(s)?s:null;};
  const numOr=v=>(v===''||v==null||isNaN(+v))?null:+v;
  const d={warnings:[]};
  // indice clienti esistenti (per nome, ordine parole indifferente)
  const idx=new Map();
  S.clients.forEach(c=>{const k=impKey(c.name||((c.firstName||'')+' '+(c.lastName||'')));if(k&&!idx.has(k))idx.set(k,c.id);});
  // ----- clienti -----
  const rawC=(ent.clients||[]).slice(0,CAP);
  const clients=rawC.map(c=>{
    const fn=String(c.firstName||'').trim(),ln=String(c.lastName||'').trim();
    const name=((fn+' '+ln).trim())||String(c.name||'').trim();
    const st=String(c.street||'').trim(),snr=String(c.streetNo||'').trim(),cap=String(c.cap||'').trim(),tw=String(c.town||'').trim();
    const address=[[st,snr].filter(Boolean).join(' '),[cap,tw].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    return{name,firstName:fn,lastName:ln,phone:String(c.phone||'').trim(),email:String(c.email||'').trim(),street:st,streetNo:snr,cap,town:tw,address,group:String(c.group||'').trim(),plant:'',pellet:'',maintenance:'',notes:String(c.notes||'').trim()};
  }).filter(c=>c.name);
  clients.forEach(c=>{c._key=impKey(c.name);c._dup=idx.has(c._key);});
  d.clients=clients;
  // insieme nomi "collegabili" = clienti già esistenti + clienti in questo file
  const linkable=new Set(idx.keys());clients.forEach(c=>{if(c._key)linkable.add(c._key);});
  const child=(arr,map)=>(arr||[]).slice(0,CAP).map(map).filter(Boolean);
  const tagLink=x=>{x._linked=!!(x._clientName&&linkable.has(impKey(x._clientName)));return x;};
  // ----- pellet -----
  d.pellet=child(ent.pellet,p=>{
    const cn=String(p.clientName||'').trim();if(!cn)return null;
    const ton=(p.unit==='ton'||p.unit==='t');const qty=numOr(p.qty);
    const o={qty,unit:ton?'t':'sacchi',kind:ton?'sfuso':'sacchi',date:isoOk(p.date),time:timeOk(p.time),status:(p.status==='consegnato'?'consegnato':'da_consegnare'),price:numOr(p.price),notes:String(p.notes||'').trim()};
    o._clientName=cn;o._desc=((qty!=null?qty+(ton?' t':' sacchi'):'')+(o.date?' · '+o.date:'')).trim();return tagLink(o);
  });
  // ----- manutenzioni -----
  d.maintenances=child(ent.maintenances,m=>{
    const cn=String(m.clientName||'').trim();const title=String(m.title||'').trim();if(!cn&&!title)return null;
    const o={title:title||'Manutenzione',date:isoOk(m.date),time:timeOk(m.time),type:String(m.type||'').trim()||null,status:['da_fare','programmata','fatta'].includes(m.status)?m.status:'da_fare',price:numOr(m.price),notes:String(m.notes||'').trim()};
    o._clientName=cn;o._desc=(o.title+(o.date?' · '+o.date:'')).trim();return tagLink(o);
  });
  // ----- appuntamenti -----
  d.appointments=child(ent.appointments,a=>{
    const cn=String(a.clientName||'').trim();const title=String(a.title||'').trim();if(!cn&&!title)return null;
    const o={title:title||'Appuntamento',date:isoOk(a.date),time:timeOk(a.time),done:!!a.done};
    o._clientName=cn;o._desc=(o.title+(o.date?' · '+o.date:'')).trim();return tagLink(o);
  });
  // ----- avvisi -----
  if(rawC.length-clients.length>0)d.warnings.push(`${rawC.length-clients.length} clienti senza nome saltati`);
  const unl=['pellet','maintenances','appointments'].reduce((n,k)=>n+d[k].filter(x=>!x._linked).length,0);
  if(unl)d.warnings.push(`${unl} record senza cliente corrispondente: verranno aggiunti come "non collegati" (il nome resta come testo)`);
  d.total=clients.length+d.pellet.length+d.maintenances.length+d.appointments.length;
  return d;
}
function showImportPreview(){
  const d=importDraft;if(!d)return;
  const box=(key,title,ic)=>{
    const a=d[key];if(!a||!a.length)return'';
    let meta='',extra='';
    if(key==='clients'){
      const nuovi=a.filter(x=>!x._dup).length,dup=a.length-nuovi;
      meta=`${nuovi} nuovi${dup?` · <span style="color:var(--amber)">${dup} già presenti</span>`:''}`;
      if(dup)extra=` <label style="margin-left:6px"><input type="checkbox" id="imp-dup"> importa anche i già presenti</label>`;
    }else{
      const lk=a.filter(x=>x._linked).length,un=a.length-lk;
      meta=`${lk} collegati${un?` · <span style="color:var(--amber)">${un} non collegati</span>`:''}`;
    }
    const rows=a.slice(0,5).map(x=>{
      const txt=key==='clients'?`${x._dup?'⚠️ ':'• '}${esc(x.name)}${x.town?' — '+esc(x.town):''}${x.phone?' · '+esc(x.phone):''}`
        :`• ${esc(x._clientName||'—')}${x._linked?'':' <span style="color:var(--amber)">(non collegato)</span>'}${x._desc?' — '+esc(x._desc):''}`;
      return`<div class="subtle" style="padding:1px 0">${txt}</div>`;
    }).join('');
    return`<div style="border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-bottom:10px">
      <label style="display:flex;align-items:center;gap:8px;font-weight:600"><input type="checkbox" id="imp-inc-${key}" checked> ${ic} ${title}<span style="margin-left:auto;font-weight:400;font-size:12px;color:var(--t2)">${a.length}</span></label>
      <div style="font-size:12px;color:var(--t2);margin:4px 0 6px">${meta}${extra}</div>
      ${rows}${a.length>5?`<div class="subtle">…e altri ${a.length-5}</div>`:''}
    </div>`;
  };
  const warn=d.warnings.length?`<div class="subtle" style="color:var(--amber);margin-bottom:10px">⚠️ ${d.warnings.map(esc).join('<br>⚠️ ')}</div>`:'';
  openSheet(`<h3>📥 Anteprima import <span class="x" onclick="closeSheet()">✕</span></h3>
  ${warn}
  ${box('clients','Clienti','👥')}
  ${box('pellet','Consegne pellet','🪵')}
  ${box('maintenances','Manutenzioni','🔧')}
  ${box('appointments','Appuntamenti','📅')}
  <div class="subtle" style="margin-bottom:12px">I clienti con lo stesso nome di uno già in archivio sono saltati di default. Niente viene scritto finché non premi Conferma.</div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="confirmImport()">✓ Conferma e importa</button></div>`);
}
function confirmImport(){
  if(!isOwner()){toast('Solo il titolare può importare');return;}
  const d=importDraft;if(!d)return;
  const inc=k=>{const el=$('#imp-inc-'+k);return!el||el.checked;};
  const inclDup=!!$('#imp-dup')?.checked;
  const batch={clients:[],pellet:[],maintenances:[],appointments:[],count:0};
  const idx=new Map();
  S.clients.forEach(c=>{const k=impKey(c.name||((c.firstName||'')+' '+(c.lastName||'')));if(k&&!idx.has(k))idx.set(k,c.id);});
  if(inc('clients')&&d.clients){
    d.clients.forEach(c=>{
      if(c._dup&&!inclDup)return;
      const id=uid();const{_dup,_key,...data}=c;
      if(!data.group&&typeof zoneOfClient==='function'){const z=zoneOfClient(data);if(z&&typeof ZONE_LABEL==='function')data.group=ZONE_LABEL(z);}
      S.clients.unshift({id,created:Date.now(),...data});batch.clients.push(id);
      if(c._key&&!idx.has(c._key))idx.set(c._key,id);
    });
  }
  const resolve=name=>{const k=impKey(name);return k&&idx.has(k)?idx.get(k):null;};
  if(inc('pellet'))d.pellet.forEach(p=>{const id=uid(),cid=resolve(p._clientName);const{_clientName,_linked,_desc,...r}=p;S.pellet.unshift({id,clientId:cid,clientRaw:cid?null:(p._clientName||null),employeeId:null,employees:[],signature:null,signedName:'',...r,via:'import',created:Date.now()});batch.pellet.push(id);});
  if(inc('maintenances'))d.maintenances.forEach(m=>{const id=uid(),cid=resolve(m._clientName);const{_clientName,_linked,_desc,...r}=m;S.maintenances.unshift({id,clientId:cid,clientRaw:cid?null:(m._clientName||null),employeeId:null,employees:[],recur:0,report:null,...r,via:'import',created:Date.now()});batch.maintenances.push(id);});
  if(inc('appointments'))d.appointments.forEach(a=>{const id=uid(),cid=resolve(a._clientName);const{_clientName,_linked,_desc,...r}=a;S.appointments.unshift({id,clientId:cid,clientRaw:cid?null:(a._clientName||null),employeeId:null,employees:[],...r,via:'import',created:Date.now()});batch.appointments.push(id);});
  batch.count=batch.clients.length+batch.pellet.length+batch.maintenances.length+batch.appointments.length;
  if(!batch.count){toast('Niente da importare (tutto deselezionato o saltato)');return;}
  lastImportBatch=batch;importDraft=null;
  save();closeSheet();render();
  const parts=[];if(batch.clients.length)parts.push(batch.clients.length+' clienti');if(batch.pellet.length)parts.push(batch.pellet.length+' pellet');if(batch.maintenances.length)parts.push(batch.maintenances.length+' manut.');if(batch.appointments.length)parts.push(batch.appointments.length+' appunt.');
  toast('✓ Importati: '+parts.join(' · '));
}
function undoImport(){
  const b=lastImportBatch;if(!b)return;
  if(!confirm(`Annullare l'ultimo import? Verranno rimossi ${b.count} record dal cloud.`))return;
  const rm=(arr,ids)=>{const set=new Set(ids);return arr.filter(x=>!set.has(x.id));};
  S.clients=rm(S.clients,b.clients);S.pellet=rm(S.pellet,b.pellet);
  S.maintenances=rm(S.maintenances,b.maintenances);S.appointments=rm(S.appointments,b.appointments);
  lastImportBatch=null;save();closeSheet();render();toast('↩ Import annullato');
}

function render(){
  if(!S.session||!me()){renderLock();return;}
  const lk=document.querySelector('.lock');if(lk)lk.remove();
  if((!can(view)||!moduleActive(view))&&view!=='hub'&&view!=='notif')view='hub';
  S.speaker=S.session.empId;
  renderNav();
  $('#todaypill').textContent=GG[new Date().getDay()].slice(0,3)+' '+new Date().getDate()+' '+MESI[new Date().getMonth()].slice(0,3);
  const R={hub:window.renderHub,cal:window.renderCal,notes:window.renderNotes,notif:window.renderNotif,man:window.renderMan,pellet:window.renderPellet,sites:window.renderSites,macchine:window.renderMacchine,clients:window.renderClients,zone:window.renderZone,conti:window.renderConti,emps:window.renderEmps};
  $('#main').innerHTML='';(R[view]||window.renderHub)();
  if(view==='notif'&&notifTab==='chat'){const sc=$('#chatscroll');if(sc)sc.scrollTop=sc.scrollHeight;}
}


/* ================= ACCESSO (cloud) ================= */
let authMode='login';let authBusy=false;
function lockShell(inner,sub){
  $('#main').innerHTML='';$('#navside').innerHTML='';$('#navbottom').innerHTML='';
  let old=document.querySelector('.lock');if(old)old.remove();
  const box=document.createElement('div');box.className='lock';
  const subLine=sub==='REGISTRAZIONE'?'Crea il tuo accesso':sub==='COLLEGA ACCOUNT'?'Collega il tuo account':sub==='SINCRONIZZAZIONE'?'Un attimo, preparo i tuoi dati…':'Bentornato 👋 — accedi al gestionale';
  box.innerHTML=`${BRAND.logo?`<img src="${BRAND.logo}" alt="${esc(BRAND.name||'')}" style="width:200px;max-width:70%;margin-bottom:6px" onerror="this.style.display='none';var f=document.getElementById('logofb');if(f)f.style.display='flex'">`:''}
  <div id="logofb" class="llogo" style="${BRAND.logo?'display:none;':'display:flex;'}margin-bottom:6px"><span class="dot"></span>${esc(BRAND.name||'Modula')}</div>
  ${BRAND.tagline?`<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="height:1px;width:26px;background:linear-gradient(90deg,transparent,#5E9E2E)"></span><span style="font-family:var(--mono);font-size:10px;letter-spacing:3px;color:var(--teal)">${esc(BRAND.tagline)}</span><span style="height:1px;width:26px;background:linear-gradient(90deg,#5BA02C,transparent)"></span></div>`:''}
  <div style="font-size:13px;color:var(--t2);margin-bottom:26px">${subLine}</div>
  <div class="lbox">${inner}</div>
  <div style="margin-top:18px;font-size:10px;color:var(--t3);text-align:center;line-height:1.7;max-width:330px">🔒 I tuoi dati al sicuro · server in UE${BRAND.name?`<br><span style="color:var(--t2)">${esc(BRAND.name)}</span> · gestionale dell'attività`:''}</div>`;
  document.body.appendChild(box);
}
function renderLock(){
  if(authMode==='loading'){lockShell('<div style="text-align:center;color:var(--t2);font-size:14px;padding:18px 0">🌊 Carico i dati…</div>','SINCRONIZZAZIONE');return;}
  if(authMode==='link'){
    lockShell(`
      <div style="font-size:13.5px;color:var(--t2);margin-bottom:14px;text-align:center">Account creato! Inserisci il codice che hai ricevuto:</div>
      <input id="lk-code" class="txt" placeholder="Codice di invito (es. MARCO-7K2F)" style="text-transform:uppercase;font-family:var(--mono);letter-spacing:1px;text-align:center">
      <div class="lerr" id="lk-err"></div>
      <button class="btn pri" style="width:100%" onclick="doClaimInvite()">Entra con il codice</button>
      <div style="font-size:11.5px;color:var(--t3);margin:14px 0 4px;text-align:center;line-height:1.6">Il codice te lo dà chi gestisce la tua azienda<br>(o Modula, se sei il titolare).</div>
      <div class="llink" onclick="logout()">← Esci</div>`,'COLLEGA ACCOUNT');
    return;
  }
  if(authMode==='reset'){
    lockShell(`
      <div style="font-size:13.5px;color:var(--t2);margin-bottom:14px;text-align:center">Imposta la tua nuova password</div>
      <input id="lk-pass" class="txt" type="password" placeholder="Nuova password (min 6)" autocomplete="new-password" onkeydown="if(event.key==='Enter')doSetNewPassword()">
      <div class="lerr" id="lk-err"></div>
      <button class="btn pri" style="width:100%" onclick="doSetNewPassword()">Salva password</button>`,'GESTIONALE');
    setTimeout(()=>{const f=$('#lk-pass');if(f)f.focus();},80);
    return;
  }
  const reg=authMode==='signup';
  lockShell(`
    <input id="lk-email" class="txt" type="email" placeholder="Email" autocomplete="email">
    <input id="lk-pass" class="txt" type="password" placeholder="Password (min 6)" autocomplete="${reg?'new-password':'current-password'}" onkeydown="if(event.key==='Enter')${reg?'doSignup()':'doLogin()'}">
    <div class="lerr" id="lk-err"></div>
    <button class="btn pri" style="width:100%" onclick="${reg?'doSignup()':'doLogin()'}">${reg?'Crea account':'Entra'}</button>
    <div class="llink" onclick="authMode='${reg?'login':'signup'}';renderLock()">${reg?'← Ho già un account':'Prima volta? Registrati →'}</div>
    ${reg?'':`<div class="llink" onclick="doForgot()" style="margin-top:6px;opacity:.85">Password dimenticata?</div>`}`,
    reg?'REGISTRAZIONE':'GESTIONALE');
  setTimeout(()=>{const f=$('#lk-email');if(f)f.focus();},80);
}
function lockErr(m){const e=$('#lk-err');if(e)e.textContent=m;authBusy=false;}
async function doForgot(){
  const email=($('#lk-email')?$('#lk-email').value.trim():'');
  if(!email)return lockErr('Scrivi prima la tua email, poi tocca «Password dimenticata»');
  const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
  if(error)return lockErr(error.message);
  lockShell(`<div style="text-align:center;color:var(--t2);font-size:14px;line-height:1.6;padding:8px 0">📧 Email inviata a<br><b style="color:var(--t1)">${esc(email)}</b><br>Apri il link nell'email e potrai impostare una nuova password.</div><div class="llink" onclick="authMode='login';renderLock()" style="margin-top:14px">← Torna al login</div>`,'GESTIONALE');
}
async function doSetNewPassword(){
  if(authBusy)return;authBusy=true;
  const pw=$('#lk-pass')?$('#lk-pass').value:'';
  if(pw.length<6)return lockErr('Almeno 6 caratteri');
  const{error}=await sb.auth.updateUser({password:pw});
  if(error)return lockErr(error.message);
  authBusy=false;try{toast('✓ Password aggiornata');}catch(e){}
  authMode='loading';renderLock();await postAuth();
}
async function doLogin(){
  if(authBusy)return;authBusy=true;
  const email=$('#lk-email').value.trim(),pass=$('#lk-pass').value;
  if(!email||!pass)return lockErr('Email e password');
  const{error}=await sb.auth.signInWithPassword({email,password:pass});
  if(error)return lockErr(error.message.includes('Invalid')?'Email o password sbagliate':error.message);
  authBusy=false;postAuth();
}
async function doSignup(){
  if(authBusy)return;authBusy=true;
  const email=$('#lk-email').value.trim(),pass=$('#lk-pass').value;
  if(!email||pass.length<6)return lockErr('Email valida e password di almeno 6 caratteri');
  const{error}=await sb.auth.signUp({email,password:pass});
  if(error)return lockErr(error.message.includes('already')?'Email già registrata — torna al login':error.message);
  authBusy=false;postAuth();
}
async function doClaimInvite(){
  if(authBusy)return;authBusy=true;
  const code=$('#lk-code').value.trim();
  if(!code)return lockErr('Inserisci il codice');
  const{data,error}=await sb.rpc('claim_invite',{code});
  if(error)return lockErr(error.message);
  if(!data)return lockErr('Codice non valido o già usato');
  authBusy=false;postAuth();
}
/* carica l'azienda (tenant) dell'utente: nome, logo, accento e MODULI ATTIVI */
async function loadTenant(tenantId){
  ACTIVE_MODULES=null;
  if(!tenantId)return;
  try{
    const{data:t}=await sb.from('tenants').select('*').eq('id',tenantId).maybeSingle();
    if(!t)return;
    TENANT_ACTIVE=t.active!==false;
    BRAND={name:t.name||'',tagline:t.tagline||'',logo:t.logo||''};
    ACTIVE_MODULES=Array.isArray(t.modules)?t.modules:(t.modules?JSON.parse(t.modules):[]);
    MAX_EMP=(typeof t.max_employees==='number'&&t.max_employees>0)?t.max_employees:null; /* 0 o assente = illimitato (es. piano Tutto compreso) */
    if(t.accent){document.documentElement.style.setProperty('--cy',t.accent);document.documentElement.style.setProperty('--accent',t.accent);}
    if(BRAND.name)document.title=BRAND.name;
    applyBrandIcon(BRAND.logo);
  }catch(e){console.error('loadTenant',e);}
}
/* Usa il logo del cliente come icona dell'app sulla home (PWA): apple-touch-icon per iOS,
   manifest dinamico per Android/Chrome. Gli installati esistenti aggiornano l'icona solo reinstallando. */
function applyBrandIcon(logo){
  if(!logo)return;
  try{
    let at=document.querySelector('link[rel="apple-touch-icon"]');
    if(!at){at=document.createElement('link');at.rel='apple-touch-icon';document.head.appendChild(at);}
    at.href=logo;
    const nm=BRAND.name||'Modula';
    const man={name:nm,short_name:nm.slice(0,18),start_url:'./app.html',scope:'./',display:'standalone',orientation:'portrait',background_color:'#F5F2EA',theme_color:BRAND.accent||'#F5F2EA',
      icons:[{src:logo,sizes:'192x192',type:'image/png',purpose:'any maskable'}]};
    const url=URL.createObjectURL(new Blob([JSON.stringify(man)],{type:'application/manifest+json'}));
    let link=document.querySelector('link[rel="manifest"]');
    if(!link){link=document.createElement('link');link.rel='manifest';document.head.appendChild(link);}
    link.href=url;
  }catch(e){/* ignora */}
}
async function postAuth(){
  try{
    const{data:{user}}=await sb.auth.getUser();
    if(!user){authMode='login';renderLock();return;}
    authMode='loading';renderLock();
    const{data:emp,error}=await sb.from('employees').select('*').eq('user_id',user.id).maybeSingle();
    if(error)throw error;
    if(!emp){authMode='link';renderLock();return;}
    if(!emp.active){await sb.auth.signOut();authMode='login';renderLock();setTimeout(()=>lockErr('Accesso disattivato dal titolare'),100);return;}
    TENANT_ID=emp.tenant_id;
    await loadTenant(emp.tenant_id);
    if(!TENANT_ACTIVE){await sb.auth.signOut();authMode='login';renderLock();setTimeout(()=>lockErr('Account sospeso — contatta Modula per riattivarlo'),100);return;}
    await loadAll();
    const my=byId(S.employees,emp.id)||MAPS.employees.fromDb(emp);
    if(!byId(S.employees,emp.id))S.employees.push(my);
    S.session={empId:emp.id};S.speaker=emp.id;
    startRealtime();initPush();
    view='hub';render();toast('Ciao '+my.name+' 👋');
  }catch(e){console.error(e);authMode='login';renderLock();setTimeout(()=>lockErr('Errore: '+(e.message||e)),100);}
}
/* ================= MODAL ================= */
function openSheet(html){
  closeSheet();
  const o=document.createElement('div');o.className='overlay';o.id='overlay';
  o.innerHTML=`<div class="sheet" onclick="event.stopPropagation()">${html}</div>`;
  o.onclick=closeSheet;document.body.appendChild(o);
}
function closeSheet(){const o=$('#overlay');if(o)o.remove();}

/* ================= AGGREGATED EVENTS (per calendario/agenda) ================= */
/* visibilità per ruolo: il titolare vede tutto, gli altri solo ciò che è loro */
/* assegnatari: gestisce sia il nuovo array "employees" sia il vecchio singolo "employeeId" */
const empIdsOf=x=>(x&&x.employees&&x.employees.length)?x.employees:((x&&x.employeeId)?[x.employeeId]:[]);
const empNames=x=>empIdsOf(x).map(eName).filter(Boolean).join(', ');
const assignedToMe=x=>!!(S.session&&empIdsOf(x).includes(S.session.empId));
/* selettore multiplo dipendenti (riuso in manut/pellet/appuntamenti/note) */
const empSeg=(idd,sel)=>`<div class="seg" id="${idd}" style="flex-wrap:wrap;gap:7px">${S.employees.filter(e=>e.active!==false).map(e=>`<div class="sg ${(sel||[]).includes(e.id)?'on':''}" data-id="${e.id}" onclick="this.classList.toggle('on')">${esc(e.name)}${e.isOwner?' 👑':''}</div>`).join('')||'<span class="subtle">Nessun dipendente ancora — aggiungili in Personale</span>'}</div>`;
const empSegRead=idd=>[...document.querySelectorAll('#'+idd+' .sg.on')].map(x=>x.dataset.id);
const visMan=()=>isOwner()?S.maintenances:S.maintenances.filter(assignedToMe);
const visApp=()=>isOwner()?S.appointments:S.appointments.filter(a=>assignedToMe(a)||!empIdsOf(a).length);
const visSites=()=>isOwner()?S.sites:S.sites.filter(s=>s.employees.includes(S.session.empId));
const visPellet=()=>isOwner()?S.pellet:S.pellet.filter(assignedToMe);
function allEvents(){
  const ev=[];
  visApp().forEach(a=>{if(a.date)ev.push({type:'appointment',date:a.date,time:a.time,title:a.title,sub:cName(a.clientId)||a.clientRaw||'',done:a.done,id:a.id});});
  visMan().forEach(m=>{if(m.date)ev.push({type:'maintenance',date:m.date,time:m.time,title:m.title,sub:cName(m.clientId)||m.clientRaw||'',done:m.status==='fatta',id:m.id});});
  (can('pellet')?S.pellet:[]).forEach(p=>{if(p.date)ev.push({type:'pellet',date:p.date,time:p.time,title:(p.qty?p.qty+' '+p.unit:'Consegna pellet'),sub:cName(p.clientId)||p.clientRaw||'',done:p.status==='consegnato',id:p.id});});
  S.notes.forEach(n=>{if(n.date&&!n.archived)ev.push({type:'note',date:n.date,time:null,title:n.text,sub:'',done:false,id:n.id});});
  visSites().forEach(s=>{if(s.dueDate&&s.status==='aperto')ev.push({type:'site',date:s.dueDate,time:null,title:'🏁 Fine prevista: '+s.name,sub:cName(s.clientId)||s.clientRaw||'',done:false,id:s.id});});
  return ev.sort((a,b)=>(a.date+(a.time||'99'))<(b.date+(b.time||'99'))?-1:1);
}


/* --- helper condivisi spostati qui dai moduli extra (servono alla base) --- */
function segPick(el){el.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));el.classList.add('on');}
const fmtQty=n=>{const v=Math.round((n||0)*100)/100;return String(v).replace('.',',');};

function openEv(type,id){
  if(type==='appointment')openApp(id);
  else if(type==='maintenance'){if(typeof openMan==='function')openMan(id);}
  else if(type==='pellet'){if(typeof openPel==='function')openPel(id);}
  else if(type==='note')openNote(id);
  else if(type==='site'){if(typeof openSite==='function')openSite(id);}
  else nav(TYPE_META[type].view);
}
function evRow(e){
  const M=TYPE_META[e.type];
  return`<div onclick="openEv('${e.type}','${e.id}')" style="display:flex;align-items:center;gap:10px;background:var(--bg2);border-left:3px solid ${M.hex};border-radius:0 9px 9px 0;padding:9px 10px;margin-bottom:6px;cursor:pointer">
    <div class="avat" style="width:30px;height:30px;background:${M.hex}22;font-size:14px;font-weight:400">${M.ic}</div>
    <div style="flex:1;min-width:0"><div style="font-size:13px;line-height:1.3;${e.done?'text-decoration:line-through;color:var(--t3)':'color:var(--t1)'}">${esc(e.title)}</div>${e.sub?`<div style="font-size:10.5px;color:var(--t2);margin-top:1px">${esc(e.sub)}</div>`:''}</div>
    <div style="text-align:right;flex-shrink:0;font-family:var(--mono)"><div style="font-size:11px;color:var(--t2)">${e.time||''}</div><div style="font-size:10px;color:var(--t3)">${fmtD(e.date)}</div></div>
  </div>`;
}


/* ===== Allegati CLIENTE (foto/file collegati al cliente) — tabella client_attachments, bucket 'allegati' ===== */
const clientAtt={};const clientAttUrl={};let clientAttFetching={};
async function loadClientAtt(clientId){
  if(typeof sb==='undefined')return;
  try{const{data,error}=await sb.from('client_attachments').select('*').eq('client_id',clientId).order('date',{ascending:false});
    if(!error)clientAtt[clientId]=(data||[]).map(r=>({id:r.id,name:r.name,type:r.type,storagePath:r.storage_path,date:r.date}));}catch(e){}
  renderClientAtt(clientId);
}
function ensureClientAttUrls(clientId){
  const arr=clientAtt[clientId]||[];const miss=arr.filter(a=>!clientAttUrl[a.id]&&!clientAttFetching[a.id]&&a.storagePath);
  if(!miss.length)return;miss.forEach(a=>clientAttFetching[a.id]=true);
  Promise.all(miss.map(a=>sb.storage.from('allegati').createSignedUrl(a.storagePath,3600).then(({data})=>{if(data)clientAttUrl[a.id]=data.signedUrl;}))).then(()=>renderClientAtt(clientId)).catch(()=>{});
}
function renderClientAtt(clientId){
  const host=$('#cli-att');if(!host)return;const arr=clientAtt[clientId]||[];ensureClientAttUrls(clientId);
  const grid=arr.length?`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:8px;margin-bottom:8px">${arr.map(a=>a.type==='img'
    ?`<div>${clientAttUrl[a.id]?`<img src="${clientAttUrl[a.id]}" onclick="viewClientAtt('${clientId}','${a.id}')" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:9px;border:1px solid var(--line);cursor:pointer">`:`<div onclick="viewClientAtt('${clientId}','${a.id}')" style="width:100%;aspect-ratio:1;border-radius:9px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:11px;cursor:pointer">…</div>`}</div>`
    :`<div onclick="viewClientAtt('${clientId}','${a.id}')" style="aspect-ratio:1;border:1px solid var(--line);border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;background:var(--bg2)"><span style="font-size:20px">${(a.name||'').match(/\.pdf$/i)?'📄':'📊'}</span><span style="font-size:8px;color:var(--t3);padding:0 4px;text-align:center;overflow:hidden;max-height:22px">${esc((a.name||'').slice(0,18))}</span></div>`).join('')}</div>`:'';
  host.innerHTML=grid+`<div style="display:flex;gap:8px">
    <button class="btn sm" onclick="$('#cli-att-photo').click()">📷 Foto</button>
    <button class="btn sm" onclick="$('#cli-att-file').click()">📎 PDF / Excel</button>
    <input type="file" id="cli-att-photo" accept="image/*" style="display:none" onchange="addClientPhoto('${clientId}',event)">
    <input type="file" id="cli-att-file" accept=".pdf,.xls,.xlsx,.csv,.doc,.docx" style="display:none" onchange="addClientFile('${clientId}',event)">
  </div>`;
}
async function addClientPhoto(clientId,ev){
  const f=ev.target.files[0];if(!f)return;
  const img=new Image();const r=new FileReader();
  r.onload=()=>{img.onload=()=>{
    const max=1280;let w=img.width,h=img.height;
    if(w>max||h>max){const k=max/Math.max(w,h);w=Math.round(w*k);h=Math.round(h*k);}
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);
    cv.toBlob(async blob=>{try{
      const name='foto-'+todayIso()+'.jpg';const path=TENANT_ID+'/client/'+clientId+'/'+uid()+'-'+name;
      const{error:e1}=await sb.storage.from('allegati').upload(path,blob,{contentType:'image/jpeg'});if(e1)throw e1;
      const row={id:uid(),client_id:clientId,name,type:'img',storage_path:path,date:todayIso()};
      const{error:e2}=await sb.from('client_attachments').insert(row);if(e2)throw e2;
      (clientAtt[clientId]=clientAtt[clientId]||[]).unshift({id:row.id,name,type:'img',storagePath:path,date:row.date});
      renderClientAtt(clientId);toast('📷 Foto caricata ('+Math.round(blob.size/1024)+'KB)');
    }catch(err){toast('⚠ Upload: '+(err.message||err));}},'image/jpeg',.72);
  };img.src=r.result;};r.readAsDataURL(f);
}
async function addClientFile(clientId,ev){
  const f=ev.target.files[0];if(!f)return;if(f.size>25*1024*1024){toast('⚠ File oltre 25MB');return;}
  try{
    const path=TENANT_ID+'/client/'+clientId+'/'+uid()+'-'+f.name;
    const{error:e1}=await sb.storage.from('allegati').upload(path,f,{contentType:f.type||'application/octet-stream'});if(e1)throw e1;
    const row={id:uid(),client_id:clientId,name:f.name,type:'file',storage_path:path,date:todayIso()};
    const{error:e2}=await sb.from('client_attachments').insert(row);if(e2)throw e2;
    (clientAtt[clientId]=clientAtt[clientId]||[]).unshift({id:row.id,name:f.name,type:'file',storagePath:path,date:row.date});
    renderClientAtt(clientId);toast('📎 '+f.name+' caricato');
  }catch(err){toast('⚠ Upload: '+(err.message||err));}
}
function viewClientAtt(clientId,aid){
  const a=byId(clientAtt[clientId]||[],aid);if(!a)return;const url=clientAttUrl[a.id]||'';
  openSheet(`<h3>${a.type==='img'?'📷':'📎'} ${esc(a.name)} <span class="x" onclick="openClient('${clientId}')">✕</span></h3>
  ${a.type==='img'?(url?`<img src="${url}" style="width:100%;border-radius:12px">`:'<div class="empty">Carico…</div>'):`<div class="empty"><div class="big">${(a.name||'').match(/\.pdf$/i)?'📄':'📊'}</div>${esc(a.name)}<br>aggiunto ${fmtD(a.date)}</div>`}
  <div class="actions">
    <button class="btn danger" onclick="delClientAtt('${clientId}','${aid}')">Elimina</button>
    ${url?`<a class="btn pri" style="text-align:center;text-decoration:none" href="${url}" target="_blank" download="${esc(a.name)}">⬇ Apri / Scarica</a>`:''}
  </div>`);
}
async function delClientAtt(clientId,aid){
  if(!confirm("Eliminare l'allegato?"))return;
  const a=byId(clientAtt[clientId]||[],aid);
  try{
    if(a&&a.storagePath)await sb.storage.from('allegati').remove([a.storagePath]);
    await sb.from('client_attachments').delete().eq('id',aid);
    clientAtt[clientId]=(clientAtt[clientId]||[]).filter(x=>x.id!==aid);
    openClient(clientId);toast('Eliminato');
  }catch(e){toast('⚠ '+(e.message||e));}
}
/* cancellazione cantiere: rimuove anche foto/file dallo Storage (i log spariscono via sync) */
async function delSite(id){
  const s=byId(S.sites,id);if(!s)return;
  const n=(s.attachments||[]).length;
  if(!confirm(`Eliminare il cantiere "${s.name}"?`+(n?`\nVerranno cancellate anche ${n} foto/file.`:'')+'\nNon si può annullare.'))return;
  try{
    const paths=(s.attachments||[]).map(a=>a.storagePath).filter(Boolean);
    if(paths.length)await sb.storage.from('allegati').remove(paths);
    const aids=(s.attachments||[]).map(a=>a.id);
    if(aids.length)await sb.from('attachments').delete().in('id',aids);
  }catch(e){toast('⚠ Pulizia allegati: '+(e.message||e));}
  S.sites=S.sites.filter(x=>x.id!==id);
  save();closeSheet();render();toast('🗑 Cantiere eliminato');
}
function editSite(id,preset){
  const s=id?byId(S.sites,id):{name:'',clientId:null,employees:[],notes:'',status:preset||'aperto',estHours:null,startDate:todayIso(),dueDate:null};
  const SST=[['previsto','Previsto'],['aperto','In corso'],['da_fatturare','Da fatturare'],['chiuso','Archivio']];
  openSheet(`<h3>${id?'Modifica cantiere':(preset==='previsto'?'Nuovo lavoro futuro':'Nuovo cantiere')} <span class="x" onclick="closeSheet()">✕</span></h3>
  <div class="fld"><label>Nome</label><input id="st-n" value="${esc(s.name)}" placeholder="es. Installazione caldaia Via Roma"></div>
  <div class="fld"><label>Cliente</label><select id="st-c"><option value="">—</option>${cOpt(s.clientId)}</select></div>
  <div class="frow">
    <div class="fld"><label>Stima ore lavoro</label><input id="st-h" type="number" inputmode="decimal" value="${s.estHours||''}" placeholder="es. 40"></div>
    ${isOwner()?`<div class="fld"><label>Importo CHF</label><input id="st-am" type="number" inputmode="decimal" step="any" value="${s.amount||''}" placeholder="da fatturare"></div>`:''}
  </div>
  <div class="frow">
    <div class="fld"><label>Inizio</label><input id="st-sd" type="date" value="${s.startDate||''}"></div>
    <div class="fld"><label>Fine prevista</label><input id="st-dd" type="date" value="${s.dueDate||''}"></div>
  </div>
  ${isOwner()?`<div class="fld"><label>Stato</label><div class="seg" id="st-st">${SST.map(([v,l])=>`<div class="sg ${(s.status||'aperto')===v?'on':''}" data-s="${v}" onclick="this.parentNode.querySelectorAll('.sg').forEach(x=>x.classList.remove('on'));this.classList.add('on')">${l}</div>`).join('')}</div></div>`:''}
  <div class="fld"><label>Squadra</label><div class="seg" id="st-e">${S.employees.map(e=>`<div class="sg ${s.employees.includes(e.id)?'on':''}" data-id="${e.id}" onclick="this.classList.toggle('on')">${esc(e.name)}</div>`).join('')}</div></div>
  <div class="fld"><label>Note</label><textarea id="st-no">${esc(s.notes||'')}</textarea></div>
  <div class="actions"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn pri" onclick="saveSite('${id||''}')">Salva</button></div>`);
}
function saveSite(id){
  const name=$('#st-n').value.trim();if(!name){toast('Manca il nome');return;}
  const employees=[...document.querySelectorAll('#st-e .sg.on')].map(x=>x.dataset.id);
  const data={name,clientId:$('#st-c').value||null,employees,estHours:parseFloat($('#st-h').value)||null,startDate:$('#st-sd').value||null,dueDate:$('#st-dd').value||null,notes:$('#st-no').value.trim()};
  const amEl=$('#st-am');if(amEl)data.amount=parseFloat(amEl.value)||null;
  const stEl=document.querySelector('#st-st .sg.on');if(stEl)data.status=stEl.dataset.s;
  const oldS=id?byId(S.sites,id):null;const prevEmps=oldS?(oldS.employees||[]):[];
  if(id){const old=oldS;const wasClosed=old.status==='chiuso';Object.assign(old,data);if(old.status==='chiuso'&&!wasClosed&&!old.closedDate)old.closedDate=todayIso();}
  else{const st=data.status||'aperto';const ns={id:uid(),status:st,log:[],attachments:[],clientRaw:null,via:'manuale',created:Date.now(),...data};if(st==='chiuso'&&!ns.closedDate)ns.closedDate=todayIso();S.sites.unshift(ns);}
  const added=employees.filter(e=>!prevEmps.includes(e));
  if(added.length&&(data.status||'aperto')!=='chiuso'&&(data.status||'aperto')!=='previsto')pushNotify(added,'🏗 Cantiere assegnato',`${name}${data.clientId?' · '+(cName(data.clientId)||''):''}`);
  save();closeSheet();render();toast('🏗 Salvato');
}


/* ================= RICERCA GLOBALE ================= */
function openSearch(){
  openSheet(`<h3>🔍 Cerca ovunque <span class="x" onclick="closeSheet()">✕</span></h3>
  <input class="searchbar" id="gs-q" placeholder="Nome, cantiere, nota, consegna…" oninput="gsRun()" autofocus>
  <div id="gs-res"><div class="subtle">Cerca un cliente e trovi tutto quello che lo riguarda.</div></div>`);
  setTimeout(()=>$('#gs-q')&&$('#gs-q').focus(),100);
}
function gsRun(){
  const q=norm($('#gs-q').value.trim());
  const box=$('#gs-res');
  if(q.length<2){box.innerHTML='<div class="subtle">Scrivi almeno 2 lettere…</div>';return;}
  const hit=s=>norm(s||'').includes(q);
  const sec=(title,rows)=>rows.length?`<div class="fld"><label>${title} (${rows.length})</label>${rows.slice(0,5).join('')}</div>`:'';
  const r1=S.clients.filter(c=>hit(c.name)||hit(c.zone)||hit(c.group)||hit(c.phone)).map(c=>`<div class="subtle" style="padding:5px 0;cursor:pointer;color:var(--t1)" onclick="closeSheet();openClient('${c.id}')">👥 ${esc(c.name)} <span style="color:var(--t3)">${esc(c.group||c.zone||'')}</span></div>`);
  const r2=S.maintenances.filter(m=>hit(m.title)||hit(cName(m.clientId))||hit(m.clientRaw)).map(m=>`<div class="subtle" style="padding:5px 0;cursor:pointer;color:var(--t1)" onclick="closeSheet();openMan('${m.id}')">🔧 ${esc(cName(m.clientId)||m.clientRaw||'')} — ${esc(m.title)} <span style="color:var(--t3)">${m.date?fmtD(m.date):m.status}</span></div>`);
  const r3=S.pellet.filter(p=>hit(cName(p.clientId))||hit(p.clientRaw)||hit(p.notes)).map(p=>`<div class="subtle" style="padding:5px 0;cursor:pointer;color:var(--t1)" onclick="closeSheet();openPel('${p.id}')">${p.kind==='sfuso'?'🪵':'📦'} ${esc(cName(p.clientId)||p.clientRaw||'')} — ${fmtQty(p.qty||0)} ${esc(p.unit||'')} <span style="color:var(--t3)">${p.date?fmtD(p.date):p.status}</span></div>`);
  const r4=S.sites.filter(s=>(isOwner()||s.status!=='previsto')&&(hit(s.name)||hit(cName(s.clientId)))).map(s=>`<div class="subtle" style="padding:5px 0;cursor:pointer;color:var(--t1)" onclick="closeSheet();openSite('${s.id}')">🏗 ${esc(s.name)} <span style="color:var(--t3)">${(s.status||'').replace('_',' ')}</span></div>`);
  const r5=S.notes.filter(n=>hit(n.text)).map(n=>`<div class="subtle" style="padding:5px 0;cursor:pointer;color:var(--t1)" onclick="closeSheet();openNote('${n.id}')">📝 ${esc(n.text.slice(0,60))}</div>`);
  const r6=S.appointments.filter(a=>hit(a.title)||hit(cName(a.clientId))).map(a=>`<div class="subtle" style="padding:5px 0;cursor:pointer;color:var(--t1)" onclick="closeSheet();openApp('${a.id}')">📅 ${esc(a.title)} <span style="color:var(--t3)">${fmtD(a.date)}</span></div>`);
  const html=sec('Clienti',r1)+sec('Manutenzioni',r2)+sec('Pellet',r3)+sec('Cantieri',r4)+sec('Note',r5)+sec('Appuntamenti',r6);
  box.innerHTML=html||'<div class="empty">Nessun risultato per «'+esc($('#gs-q').value)+'»</div>';
}

/* ================= EXPORT CSV ================= */
function csvDownload(name,header,rows){
  const escC=v=>{v=String(v==null?'':v);return /[";\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
  const csv='\ufeff'+[header,...rows].map(r=>r.map(escC).join(';')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=name+'-'+todayIso()+'.csv';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  toast('⬇ '+name+'.csv esportato');
}
function csvPellet(){
  csvDownload('pellet',['Data','Cliente','Tipo','Quantità','Unità','Importo CHF','Stato','Firmata','Note'],
    S.pellet.map(p=>[p.date||'',cName(p.clientId)||p.clientRaw||'',p.kind||'',p.qty||'',p.unit||'',p.price||'',p.status,p.signature?'sì':'',p.notes||'']));
}
function csvMan(){
  csvDownload('manutenzioni',['Data','Cliente','Descrizione','Tecnico','Stato','Tariffa CHF','Bollettino','Esito'],
    S.maintenances.map(m=>[m.date||'',cName(m.clientId)||m.clientRaw||'',m.title,empNames(m)||'',m.status,m.price||'',m.report?'sì':'',m.report?m.report.outcome:'']));
}
function csvOre(){
  const rows=[];
  S.sites.forEach(s=>s.log.forEach(l=>{if(l.hours)rows.push([l.date||'',eName(l.empId)||'—',s.name,l.text,l.hours]);}));
  rows.sort((a,b)=>a[0]<b[0]?-1:1);
  csvDownload('ore-dipendenti',['Data','Dipendente','Cantiere','Lavoro','Ore'],rows);
}
function csvSites(){
  csvDownload('cantieri',['Nome','Cliente','Stato','Ore registrate','Ore stimate','Importo CHF','Inizio','Fine prevista'],
    S.sites.map(s=>[s.name,cName(s.clientId)||s.clientRaw||'',s.status,siteHours(s),s.estHours||'',s.amount||'',s.startDate||'',s.dueDate||'']));
}

/* ================= AUTO-AGGIORNAMENTO ================= */
let _updChk=0;
async function checkUpdate(){
  const now=Date.now();
  if(now-_updChk<30000)return; _updChk=now;
  try{
    const r=await fetch('./version.json?t='+now,{cache:'no-store'});
    if(!r.ok)return;
    const j=await r.json();
    if(j&&j.version&&j.version!==APP_VERSION){
      if(sessionStorage.getItem('cw_upd')===j.version)return; /* gia' tentato: evita loop */
      sessionStorage.setItem('cw_upd',j.version);
      try{toast('Aggiornamento in corso…');}catch(e){}
      setTimeout(()=>location.reload(),1300);
    }
  }catch(e){/* offline o errore: ignora, l'app continua a funzionare */}
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkUpdate();});

/* ================= DEMO / VETRINA ================= */
function demoBoot(){
  const oid=uid(),e2=uid(),c1=uid(),c2=uid(),c3=uid();const t=todayIso();const now=Date.now();
  S=blank();
  BRAND={name:'Demo Impianti Verdi',tagline:'gestionale dimostrativo',logo:''};
  ACTIVE_MODULES=['cal','notes','clients','emps','man','pellet','sites','zone','conti']; /* demo: moduli mostrati (Macchine escluso, e' su misura di ptek) */
  {const bt=document.getElementById('brandtop');if(bt)bt.textContent=BRAND.name;}document.title=BRAND.name;
  S.employees=[
    {id:oid,name:'Tu (demo)',role:'Titolare',phone:'',perms:[],isOwner:true,active:true},
    {id:e2,name:'Luca Bianchi',role:'Tecnico',phone:'333 0102030',perms:['man','clients','cal','conti'],isOwner:false,active:true}
  ];
  S.session={empId:oid};
  S.clients=[
    {id:c1,name:'Mario Rossi',firstName:'Mario',lastName:'Rossi',phone:'333 1234567',street:'Via Roma',streetNo:'3',cap:'12010',town:'Demonte',email:'',group:'A',plant:'Caldaia a pellet',notes:'Cliente storico',blocked:false,created:now},
    {id:c2,name:'Bar Centrale',firstName:'',lastName:'Bar Centrale',phone:'0171 900111',street:'Piazza Garibaldi',streetNo:'7',cap:'12011',town:'Borgo',email:'info@barcentrale.demo',group:'B',plant:'Stufa a pellet',notes:'',blocked:false,created:now},
    {id:c3,name:'Verdi Impianti snc',firstName:'',lastName:'Verdi Impianti snc',phone:'0171 552200',street:'Via Industria',streetNo:'22',cap:'12012',town:'Boves',email:'',group:'A',plant:'',notes:'Preventivo in corso',blocked:false,created:now}
  ];
  S.appointments=[
    {id:uid(),title:'Sopralluogo nuovo impianto',clientId:c1,employeeId:e2,employees:[e2],date:t,time:'09:30',done:false,via:'demo',created:now},
    {id:uid(),title:'Preventivo caldaia',clientId:c3,employeeId:oid,employees:[oid],date:t,time:'15:00',done:false,via:'demo',created:now}
  ];
  S.maintenances=[
    {id:uid(),title:'Manutenzione caldaia annuale',clientId:c1,employeeId:e2,employees:[e2],date:t,time:'',status:'programmata',type:'caldaia',price:120,notes:'',via:'demo',created:now},
    {id:uid(),title:'Controllo stufa a pellet',clientId:c2,employeeId:null,employees:[],date:'',status:'da_fare',type:'stufa',price:null,notes:'',via:'demo',created:now}
  ];
  S.notes=[{id:uid(),text:'Ordinare ricambi caldaia per Rossi',clientId:c1,date:t,pinned:true,via:'demo',created:now}];
  S.expenses=[
    {id:uid(),date:t,category:'Carburante',amount:85,note:'Furgone',siteId:null,recur:0,created:now},
    {id:uid(),date:t,category:'Ricambi',amount:240,note:'Caldaie',siteId:null,recur:0,created:now}
  ];
  rebuildSnapshot();
  view='hub';render();
  setTimeout(()=>{try{toast('🎬 Modalità demo — dati di esempio. Prova a cliccare tutto.');}catch(e){}},700);
}

/* ================= BOOT ================= */
(async()=>{
  if(DEMO){ if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',demoBoot);else demoBoot(); return; }
  let recovering=false;
  sb.auth.onAuthStateChange((event)=>{ if(event==='PASSWORD_RECOVERY'){ recovering=true; authMode='reset'; renderLock(); } });
  try{
    // se si arriva da un link di recupero password, l'hash contiene type=recovery
    if(/type=recovery/.test(location.hash)){ authMode='reset'; renderLock(); }
    const{data:{session}}=await sb.auth.getSession();
    if(recovering||/type=recovery/.test(location.hash)){ /* aspetta che l'utente imposti la nuova password */ }
    else if(session){postAuth();}else{renderLock();}
  }catch(e){renderLock();}
  setTimeout(checkUpdate,4000);
})();
