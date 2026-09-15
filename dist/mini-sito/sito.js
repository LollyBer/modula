/* ===== MINI SITO AZIENDA — SCHELETRO =====
   Riempie le sezioni dinamiche (nome, servizi, orari, contatti) da CONFIG.
   Le sezioni con foto/copy restano placeholder (.ph-img / .ph-copy): da completare.
   CONFIG = unica fonte dati per azienda — in futuro condivisa col portale. */

const CONFIG = {
  azienda: 'Bellezza Studio',
  categoria: 'Parrucchiere & Estetica',
  accento: '#A78BFA',
  logo: '💇',
  claim: 'Il tuo stile, curato nei dettagli.',
  // TODO copy reale:
  chiSiamo: 'Da oltre dieci anni ci prendiamo cura della tua bellezza con passione e prodotti di qualità. [Testo da personalizzare.]',
  telefono: '+39 351 000 0000',
  whatsapp: '393510000000',
  email: 'ciao@bellezzastudio.it',
  indirizzo: 'Via Roma 24, Milano',
  social: [
    { ic:'📷', nome:'Instagram', url:'#' },
    { ic:'👍', nome:'Facebook',  url:'#' }
  ],
  portaleUrl: '../portale/',   // CTA "Prenota" → portale clienti
  servizi: [
    { id:'taglio', nome:'Taglio & Piega',     ic:'✂️', durata:45, prezzo:'35€' },
    { id:'colore', nome:'Colore',             ic:'🎨', durata:90, prezzo:'60€' },
    { id:'piega',  nome:'Piega',              ic:'💨', durata:30, prezzo:'20€' },
    { id:'barba',  nome:'Barba & Rifinitura', ic:'🧔', durata:25, prezzo:'15€' },
    { id:'mani',   nome:'Manicure',           ic:'💅', durata:40, prezzo:'25€' },
    { id:'viso',   nome:'Trattamento viso',   ic:'🧖', durata:60, prezzo:'45€' }
  ],
  orari: [
    { g:'Lunedì',    t:'Chiuso', closed:true },
    { g:'Martedì',   t:'09:00 – 19:00' },
    { g:'Mercoledì', t:'09:00 – 19:00' },
    { g:'Giovedì',   t:'09:00 – 19:00' },
    { g:'Venerdì',   t:'09:00 – 20:00' },
    { g:'Sabato',    t:'09:00 – 18:00' },
    { g:'Domenica',  t:'Chiuso', closed:true }
  ]
};

const esc = s => String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const set = (id,html)=>{ const el=document.getElementById(id); if(el) el.innerHTML=html; };

function boot(){
  document.documentElement.style.setProperty('--cy', CONFIG.accento);
  document.documentElement.style.setProperty('--ink', '#071018');
  document.title = `${CONFIG.azienda} — ${CONFIG.categoria}`;

  // nav + hero testi
  set('brandName', `<span class="lg">${CONFIG.logo}</span>${esc(CONFIG.azienda)}`);
  set('heroCat', esc(CONFIG.categoria));
  set('heroTitle', esc(CONFIG.azienda));
  set('heroClaim', esc(CONFIG.claim));

  // servizi (sezione pronta da CONFIG)
  set('servGrid', CONFIG.servizi.map(s=>`
    <div class="serv-card">
      <span class="si">${s.ic}</span>
      <div class="sn">${esc(s.nome)}</div>
      <div class="sd">Durata ~${s.durata} min</div>
      <div class="sp">${esc(s.prezzo)}</div>
    </div>`).join(''));

  // chi siamo (copy placeholder)
  set('aboutCopy', `<p class="ph-copy">${esc(CONFIG.chiSiamo)}</p>`);

  // orari (pronti da CONFIG)
  set('hoursList', CONFIG.orari.map(o=>`
    <div class="hr ${o.closed?'closed':''}"><span class="d">${esc(o.g)}</span><span class="t">${esc(o.t)}</span></div>`).join(''));

  // contatti (pronti da CONFIG)
  const c=[];
  c.push(contact('📞', CONFIG.telefono, 'Chiama', 'tel:'+CONFIG.telefono.replace(/\s/g,'')));
  if(CONFIG.whatsapp) c.push(contact('💬', 'WhatsApp', 'Scrivici', 'https://wa.me/'+CONFIG.whatsapp));
  c.push(contact('📍', CONFIG.indirizzo, 'Vieni a trovarci', '#'));
  if(CONFIG.email) c.push(contact('✉️', CONFIG.email, 'Email', 'mailto:'+CONFIG.email));
  CONFIG.social.forEach(s=>c.push(contact(s.ic, s.nome, 'Seguici', s.url)));
  set('contactGrid', c.join(''));

  // CTA prenota → portale
  document.querySelectorAll('[data-prenota]').forEach(a=>a.setAttribute('href', CONFIG.portaleUrl));

  // footer
  set('footerTxt', `© ${esc(CONFIG.azienda)} · Powered by <b>Modula</b>`);
}
function contact(ic,t,s,href){
  return `<a class="contact" href="${esc(href)}"><span class="ci">${ic}</span><div><div class="ct">${esc(t)}</div><div class="cs">${esc(s)}</div></div></a>`;
}
boot();
