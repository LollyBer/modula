/* ============================================================
   SCHERMATE — anteprime dei moduli con DATI FINTI (demo)
   Servono a far vedere "come sarebbe dentro". I dati sono finti
   e condivisi (oggetto DEMO), così le schermate sono coerenti.
   SCHERMATE[id]() -> HTML del contenuto schermata (senza barre).
   ============================================================ */

const DEMO = {
  clienti:[
    {n:'Rossi Costruzioni S.r.l.', z:'Milano',  s:'🟢 attivo',  i:'RC', c:'#5BA02C'},
    {n:'Bar Centrale',             z:'Torino',  s:'🟢 attivo',  i:'BC', c:'#2E9E5E'},
    {n:'Verdi Impianti',           z:'Bologna', s:'🟡 in attesa',i:'VI', c:'#C77F12'},
    {n:'Bianchi Mario',            z:'Roma',    s:'🟢 attivo',  i:'BM', c:'#A9742F'},
    {n:'Studio Ferri',             z:'Firenze', s:'🟢 attivo',  i:'SF', c:'#5BA02C'},
  ],
  team:[
    {n:'Marco B.', r:'Titolare',  i:'M', c:'#5BA02C'},
    {n:'Luca V.',  r:'Tecnico',   i:'L', c:'#2E9E5E'},
    {n:'Sara D.',  r:'Ufficio',   i:'S', c:'#C77F12'},
    {n:'Paolo R.', r:'Operaio',   i:'P', c:'#A9742F'},
  ],
  agenda:[
    {t:'Sopralluogo da Rossi',     h:'09:00', c:'#5BA02C'},
    {t:'Consegna materiale',       h:'11:30', c:'#C77F12'},
    {t:'Riunione team',            h:'14:00', c:'#2E9E5E'},
    {t:'Intervento Bar Centrale',  h:'16:30', c:'#E2722E'},
  ],
};

/* mattoncini riutilizzabili */
const _row = (ic,t,s,right='') => `<div class="ph-card"><span class="ci">${ic}</span><div style="flex:1;min-width:0"><div class="ct">${t}</div>${s?`<div class="cs">${s}</div>`:''}</div>${right?`<div style="font-family:var(--mono);font-size:10px;color:var(--t2)">${right}</div>`:''}</div>`;
const _avatar = (i,c) => `<span class="ci" style="width:30px;height:30px;border-radius:50%;background:${c};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">${i}</span>`;
const _title = t => `<div class="ph-title"><span class="a"></span>${t}</div>`;
const _comingSoon = (ic,nome,desc) => `${_title(nome)}<div style="text-align:center;padding:40px 14px;color:var(--t2)"><div style="font-size:46px;opacity:.5;margin-bottom:12px">${ic}</div><div style="font-family:var(--disp);font-weight:600;font-size:15px;color:var(--t1);margin-bottom:6px">${nome}</div><div style="font-size:12.5px;margin-bottom:14px">${desc}</div><span style="font-family:var(--mono);font-size:10px;letter-spacing:.5px;color:var(--amber);border:1px solid var(--amber);border-radius:99px;padding:4px 11px;background:rgba(199,127,18,.06)">🛠 in arrivo</span></div>`;

const SCHERMATE = {
  hub: ()=>`${_title('Hub')}
    <div class="ph-hub"><div class="ph-hub-h">Scrivi e l'app smista da sola…</div><div class="ph-hub-in">es. «appuntamento da Rossi domani alle 16»</div></div>
    <div class="ph-stats">
      <div class="ph-stat"><div class="n">4</div><div class="l">Oggi</div></div>
      <div class="ph-stat"><div class="n">12</div><div class="l">Settimana</div></div>
      <div class="ph-stat"><div class="n">3</div><div class="l">Da fare</div></div>
    </div>
    ${_row('📅','Sopralluogo da Rossi','Oggi · 09:00','')}
    ${_row('🔧','Intervento Bar Centrale','Oggi · 16:30','')}
    ${_row('💰','Incasso settimana','+ 4.250 €','')}`,

  cal: ()=>{
    let cells='';
    for(let d=1;d<=30;d++){ const today=d===14; const dot=[3,8,14,14,21,27].includes(d);
      cells+=`<div style="aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;${today?'background:var(--cy);color:#fff;font-weight:700':'background:var(--bg1);border:1px solid var(--line);color:var(--t2)'}">${d}${dot&&!today?'<span style="width:4px;height:4px;border-radius:50%;background:var(--cy);margin-top:2px"></span>':''}</div>`; }
    return `${_title('Calendario')}
    <div style="font-family:var(--disp);font-weight:600;font-size:13px;margin-bottom:8px;text-transform:capitalize">Giugno 2026</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:12px">${cells}</div>
    ${DEMO.agenda.map(e=>_row('•',e.t,'',e.h).replace('class="ci"',`class="ci" style="color:${e.c}"`)).join('')}`;
  },

  notes: ()=>`${_title('Note')}
    <div class="ph-hub"><div class="ct" style="margin-bottom:6px">📌 Da ordinare</div>
      <div class="cs">☑️ Viti 6x40 · ☑️ Silicone · ⬜ Tasselli</div></div>
    ${_row('🗒️','Idea promo estate','Aggiornata ieri','')}
    ${_row('🗒️','Contatti fornitori','3 voci','')}
    ${_row('☑️','Lista furgone','2/5 fatte','')}`,

  clients: ()=>`${_title('Clienti')}
    <div style="font-family:var(--mono);font-size:10px;color:var(--t3);margin-bottom:8px">${DEMO.clienti.length} clienti</div>
    ${DEMO.clienti.map(c=>`<div class="ph-card">${_avatar(c.i,c.c)}<div style="flex:1;min-width:0"><div class="ct">${c.n}</div><div class="cs">📍 ${c.z} · ${c.s}</div></div></div>`).join('')}`,

  emps: ()=>`${_title('Dipendenti')}
    ${DEMO.team.map(e=>`<div class="ph-card">${_avatar(e.i,e.c)}<div style="flex:1"><div class="ct">${e.n}</div><div class="cs">${e.r}</div></div></div>`).join('')}`,

  conti: ()=>`${_title('Conti')}
    <div class="ph-stats">
      <div class="ph-stat"><div class="n" style="color:var(--teal)">12.4k</div><div class="l">Entrate</div></div>
      <div class="ph-stat"><div class="n" style="color:var(--coral)">8.1k</div><div class="l">Spese</div></div>
      <div class="ph-stat"><div class="n">+4.3k</div><div class="l">Utile</div></div>
    </div>
    ${_row('🟢','Fattura Rossi Costruzioni','12 giu','+ 2.800 €')}
    ${_row('🟢','Incasso Bar Centrale','10 giu','+ 640 €')}
    ${_row('🔴','Fornitore materiale','08 giu','− 1.150 €')}`,

  man: ()=>`${_title('Manutenzioni')}
    ${_row('🔧','Caldaia — Verdi Impianti','⏳ aperta · domani','')}
    ${_row('🔧','Tagliando — Bianchi Mario','✅ fatta · 10 giu','')}
    ${_row('🔧','Assistenza — Studio Ferri','⏳ aperta · 18 giu','')}
    ${_row('📞','Da richiamare: Bar Centrale','','')}`,

  sites: ()=>`${_title('Cantieri')}
    ${['Ristrutturazione Rossi|68%|var(--cy)','Impianto Studio Ferri|35%|var(--amber)','Nuovo punto Bar Centrale|90%|var(--teal)'].map(s=>{const[n,p,c]=s.split('|');return `<div class="ph-card" style="display:block"><div class="ct" style="margin-bottom:6px">🏗 ${n}</div><div style="height:5px;border-radius:3px;background:var(--bg0)"><div style="width:${p};height:100%;border-radius:3px;background:${c}"></div></div><div class="cs" style="margin-top:4px">${p} completato</div></div>`;}).join('')}`,

  macchine: ()=>`${_title('Macchine / Impianti')}
    ${_row('⚙️','Caldaia BioTek 24 · Rossi','Ultimo controllo: 02/06','OK')}
    ${_row('⚙️','Pompa di calore · Studio Ferri','Prossimo: 20/06','')}
    ${_row('⚙️','Stufa a pellet · Bianchi','⚠ allarme E4','!')}`,

  pellet: ()=>`${_title('Consegne prodotto')}
    ${_row('🪵','Sfuso 30 q.li · Rossi','📍 Milano','oggi')}
    ${_row('📦','Sacchi 50 · Bar Centrale','📍 Torino','dom')}
    ${_row('🪵','Sfuso 15 q.li · Bianchi','✅ consegnato','')}`,

  zone: ()=>`${_title('Zone & Mappa')}
    <div style="height:120px;border-radius:12px;border:1px solid var(--line);background:linear-gradient(135deg,rgba(111,178,58,.12),rgba(46,158,94,.06));display:flex;align-items:center;justify-content:center;color:var(--t3);font-size:12px;margin-bottom:10px">🗺️ Mappa clienti & zone</div>
    ${_row('🟢','Zona A — Milano centro','24 clienti','')}
    ${_row('🟡','Zona B — Hinterland','11 clienti','')}`,

  catalogo: ()=>`${_title('Catalogo / Listino')}
    ${[['Caffè espresso','1,20 €'],['Cornetto','1,50 €'],['Pranzo del giorno','12,00 €'],['Bottiglia vino','18,00 €']].map(p=>_row('🏷️',p[0],'disponibile',p[1])).join('')}`,

  magazzino: ()=>`${_title('Magazzino')}
    ${_row('📦','Farina 00','scorta ok','40 kg')}
    ${_row('📦','Caffè in grani','⚠ sotto soglia','3 kg')}
    ${_row('📦','Bicchieri','scorta ok','520 pz')}`,

  prenota: ()=>`${_title('Prenotazioni')}
    <div style="font-family:var(--disp);font-weight:600;font-size:13px;margin-bottom:8px">Oggi — 4 prenotazioni</div>
    ${_row('🟢','Tavolo 4 pers. · Bianchi','confermato','20:00')}
    ${_row('🟢','Taglio + piega · Sara','confermato','15:30')}
    ${_row('🟡','Tavolo 2 pers. · Ferri','in attesa','21:00')}`,

  fidelity: ()=>`${_title('Fidelity & Promo')}
    ${_row('🎁','Promo estate −20%','attiva fino 31/08','')}
    ${_row('⭐','Mario Bianchi','tessera oro','340 pt')}
    ${_row('⭐','Studio Ferri','tessera argento','120 pt')}`,
};

/* schermata di un modulo (con fallback "in arrivo" per quelli non pronti) */
function schermataDi(id){
  if(SCHERMATE[id]) return SCHERMATE[id]();
  const m = (typeof modById==='function') ? modById(id) : null;
  return _comingSoon(m?m.ic:'🧩', m?m.nome:'Modulo', m?m.desc:'Anteprima in preparazione.');
}
