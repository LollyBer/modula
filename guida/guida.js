/* ============================================================
   GUIDA — renderer: monta il manuale brandizzato del cliente.
   ------------------------------------------------------------
   Legge i parametri dall'URL e mostra SOLO i moduli del cliente:
     ?nome=Ptek Impianti      nome azienda (copertina)
     &col=%23FF453A           colore accento (default rosso Modula)
     &m=hub,cal,clients,man   moduli attivi (in qualunque ordine)
     &logo=<url>              (facoltativo) logo per la copertina
   Nessun dato del cliente viaggia qui: solo brand + elenco moduli.
   Ordine dei capitoli = ordine canonico dell'app (VIEW_ORDER).
   ============================================================ */

/* ordine canonico delle voci (allineato a FABBRICA/MANIFEST viewOrder) */
const VIEW_ORDER = ['hub','cal','notes','notif','man','pellet','sites','macchine','clients','zone','conti','emps'];

const q = new URLSearchParams(location.search);
const NOME = (q.get('nome') || 'La tua azienda').trim();
const ACC  = sanitizeColor(q.get('col')) || '#FF453A';
const LOGO = q.get('logo') || '';
let MODS = (q.get('m') || 'hub,cal,clients')
  .split(',').map(s => s.trim().toLowerCase())
  .filter(s => /^[a-z0-9_-]+$/.test(s)); // solo id validi: no injection via URL (l'id finisce in id="m-…"/href)

/* non mostriamo notif/hub come "capitolo" se non hanno guida propria:
   li teniamo solo se esiste un capitolo in GUIDE (evita capitoli vuoti
   per moduli senza contenuto ancora scritto). Restano nell'indice come
   "in arrivo" se attivi ma senza guida. */
const ordered = VIEW_ORDER.filter(id => MODS.includes(id))
  .concat(MODS.filter(id => !VIEW_ORDER.includes(id))); // eventuali extra sconosciuti in coda

function sanitizeColor(c){
  if(!c) return '';
  c = c.trim();
  return /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : '';
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }

/* una figura con legenda numerata (parti della schermata) */
function figrow(illusName, schermata){
  const svg = (ILLUS[illusName] ? ILLUS[illusName](ACC) : '');
  if(!svg && !(schermata && schermata.length)) return '';
  const legend = (schermata||[]).map(s =>
    `<li><span class="n">${s.n}</span><span><span class="lb">${esc(s.label)}</span><br><span class="ds">${esc(s.desc)}</span></span></li>`
  ).join('');
  return `<div class="figrow">
    <div class="fig">${svg||''}</div>
    ${legend?`<ul class="legend">${legend}</ul>`:'<div></div>'}
  </div>`;
}

/* blocco "come si fa" (passi numerati) */
function stepsBlock(passi){
  if(!passi || !passi.length) return '';
  const items = passi.map((p,i)=>`
    <div class="step">
      <div class="sn">${i+1}</div>
      <div><div class="st">${p.t}</div><div class="sd">${p.d}</div>
        ${p.illus && ILLUS[p.illus] ? `<div class="mini">${ILLUS[p.illus](ACC)}</div>`:''}
      </div>
    </div>`).join('');
  return `<div class="steps"><h3>Come si fa</h3>${items}</div>`;
}

function trucchiBlock(trucchi){
  if(!trucchi || !trucchi.length) return '';
  return `<div class="trucchi"><h3>Trucchi</h3><ul>${trucchi.map(t=>`<li>${t}</li>`).join('')}</ul></div>`;
}

/* un capitolo modulo */
function chapterModule(id){
  const meta = MODMETA[id] || { ic:'🧩', nome:id };
  const g = GUIDE[id];
  const head = `<div class="ch-head"><span class="em">${meta.ic}</span><h2>${esc(meta.nome)}</h2></div>`;
  if(!g){ // attivo ma capitolo non ancora scritto
    return `<section class="chapter" id="m-${id}">${head}
      <div class="tbd">Il capitolo di questo modulo è in preparazione.</div></section>`;
  }
  return `<section class="chapter" id="m-${id}">
    ${head}
    ${g.occhiello?`<div class="occhiello">${esc(g.occhiello)}</div>`:''}
    ${g.aCosaServe?`<div class="acserve">${g.aCosaServe}</div>`:''}
    ${figrow(g.illus, g.schermata)}
    ${stepsBlock(g.passi)}
    ${trucchiBlock(g.trucchi)}
  </section>`;
}

/* la parte INTRO (universale) */
function introSection(){
  const secs = GUIDE_INTRO.sezioni.map(s=>`
    <section class="chapter">
      <div class="ch-head"><h2>${esc(s.h)}</h2></div>
      ${s.testo?`<p>${s.testo}</p>`:''}
      ${figrow(s.illus, s.schermata)}
      ${stepsBlock(s.passi)}
    </section>`).join('');
  return secs;
}

/* indice a lato */
function tocHTML(){
  const links = [`<a href="#intro"><span class="ic">👋</span>Per iniziare</a>`]
    .concat(ordered.map(id=>{
      const m = MODMETA[id]||{ic:'🧩',nome:id};
      return `<a href="#m-${id}"><span class="ic">${m.ic}</span>${esc(m.nome)}</a>`;
    })).join('');
  return `<nav class="toc">
    <div class="brandmini">${esc(NOME)}</div>
    <button class="stampa" onclick="window.print()">🖨️ Salva in PDF</button>
    ${links}
  </nav>`;
}

/* copertina */
function coverHTML(){
  const logo = LOGO ? `<img src="${esc(LOGO)}" alt="logo">` : (esc(NOME.trim()[0]||'M').toUpperCase());
  return `<div class="cover">
    <div class="logo">${logo}</div>
    <div class="kick">Guida operativa</div>
    <h1>${esc(NOME)}</h1>
    <div class="sub">Come usare la tua app, sezione per sezione. Tienila a portata di mano: quando non ricordi come si fa una cosa, la trovi qui.</div>
    <div class="foot">Powered by Modula</div>
  </div>`;
}

function render(){
  document.documentElement.style.setProperty('--acc', ACC);
  document.title = `Guida — ${NOME}`;
  const html = `
    ${tocHTML()}
    <main class="sheet">
      ${coverHTML()}
      <div id="intro"></div>
      ${introSection()}
      ${ordered.map(chapterModule).join('')}
      <div class="pagefoot">Guida generata da Modula · ${esc(NOME)}</div>
    </main>`;
  document.getElementById('app').innerHTML = html;
}
render();
