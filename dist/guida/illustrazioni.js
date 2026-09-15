/* ============================================================
   GUIDA — ILLUSTRAZIONI (disegni SVG parametrici sul colore brand)
   ------------------------------------------------------------
   Ogni voce è una funzione (acc) => stringa SVG, dove `acc` è il
   colore accento del cliente (es. "#FF453A"). Così i disegni si
   brandizzano da soli e NON invecchiano quando cambia la UI vera
   (sono schematici, non screenshot).

   Convenzioni di stile:
   - telefono stilizzato: cornice grigia, schermo bianco
   - barra in alto e accenti = colore brand
   - pallini numerati = "callout" spiegati nella legenda a fianco
   Aggiungere qui una voce e richiamarla dal contenuto con illus:'nome'.
   ============================================================ */

const ILLUS = {

  /* --- cornice telefono riutilizzabile: inner = contenuto schermo (x0..x0+w0) --- */
  _phone(acc, inner, opt = {}) {
    const w = 230, h = 300;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opt.alt || 'schermata'}">
      <rect x="8" y="6" width="${w - 16}" height="${h - 12}" rx="26" fill="#fff" stroke="#d8d2c4" stroke-width="2"/>
      <rect x="8" y="6" width="${w - 16}" height="46" rx="26" fill="${acc}"/>
      <rect x="8" y="30" width="${w - 16}" height="22" fill="${acc}"/>
      <rect x="86" y="15" width="58" height="7" rx="3.5" fill="#fff" opacity=".9"/>
      ${inner}
    </svg>`;
  },

  /* pallino numerato per i callout */
  _dot(x, y, n, acc) {
    return `<circle cx="${x}" cy="${y}" r="12" fill="${acc}" stroke="#fff" stroke-width="2"/>
      <text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="13" font-weight="700" fill="#fff">${n}</text>`;
  },

  /* riga di lista generica */
  _row(y, acc, wide) {
    return `<circle cx="30" cy="${y + 16}" r="12" fill="${acc}" opacity=".18"/>
      <rect x="50" y="${y + 8}" width="${wide || 96}" height="8" rx="4" fill="#c9c3b4"/>
      <rect x="50" y="${y + 22}" width="${(wide || 96) - 30}" height="6" rx="3" fill="#e4dfd2"/>`;
  },

  /* ---------- CLIENTI ---------- */

  // schermata Clienti con callout: 1 cerca, 2 filtri, 3 scheda, 4 pulsante +
  clientiHero(acc) {
    const rows = [66, 108, 150].map(y => ILLUS._row(y, acc)).join('');
    const inner = `
      <rect x="24" y="62" width="182" height="26" rx="8" fill="#f3efe6" stroke="#e4dfd2"/>
      <text x="34" y="79" font-family="Inter,sans-serif" font-size="11" fill="#a49a88">🔍 Cerca…</text>
      <rect x="24" y="96" width="54" height="18" rx="9" fill="#fff" stroke="#e4dfd2"/>
      <rect x="82" y="96" width="54" height="18" rx="9" fill="#fff" stroke="#e4dfd2"/>
      ${['','',''].map((_, i) => ILLUS._row(122 + i * 42, acc)).join('')}
      <circle cx="182" cy="252" r="21" fill="${acc}"/>
      <line x1="182" y1="243" x2="182" y2="261" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <line x1="173" y1="252" x2="191" y2="252" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      ${ILLUS._dot(30, 75, 1, acc)}
      ${ILLUS._dot(30, 105, 2, acc)}
      ${ILLUS._dot(30, 138, 3, acc)}
      ${ILLUS._dot(182, 252, 4, acc)}`;
    return ILLUS._phone(acc, inner, { alt: 'Schermata Clienti' });
  },

  // aggiungere un cliente: scheda con campi
  clientiNuovo(acc) {
    const field = (y, w) => `<rect x="24" y="${y}" width="182" height="24" rx="7" fill="#f3efe6" stroke="#e4dfd2"/><rect x="32" y="${y + 9}" width="${w}" height="6" rx="3" fill="#c9c3b4"/>`;
    const inner = `
      <text x="24" y="76" font-family="Space Grotesk,sans-serif" font-size="13" font-weight="700" fill="#2b2a24">Nuovo cliente</text>
      ${field(88, 70)}${field(120, 100)}${field(152, 60)}${field(184, 120)}
      <rect x="24" y="224" width="182" height="30" rx="9" fill="${acc}"/>
      <text x="115" y="244" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="12" font-weight="700" fill="#fff">Salva</text>`;
    return ILLUS._phone(acc, inner, { alt: 'Scheda nuovo cliente' });
  },

  /* ---------- CALENDARIO ---------- */

  calendarioHero(acc) {
    // mini griglia mese + un giorno con pallino
    let grid = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
      const x = 26 + c * 26, y = 96 + r * 30;
      const active = (r === 1 && c === 3);
      grid += `<rect x="${x}" y="${y}" width="22" height="24" rx="6" fill="${active ? acc : '#f3efe6'}" ${active ? '' : 'stroke="#e9e3d5"'}/>`;
      grid += `<text x="${x + 11}" y="${y + 16}" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="${active ? '#fff' : '#a49a88'}">${r * 7 + c + 1}</text>`;
    }
    const inner = `
      <text x="24" y="76" font-family="Space Grotesk,sans-serif" font-size="13" font-weight="700" fill="#2b2a24">Ottobre</text>
      ${grid}
      <rect x="24" y="228" width="182" height="30" rx="8" fill="#f7f4ec" stroke="#e9e3d5"/>
      <circle cx="38" cy="243" r="5" fill="${acc}"/>
      <rect x="52" y="238" width="90" height="6" rx="3" fill="#c9c3b4"/>
      <rect x="52" y="248" width="60" height="5" rx="2.5" fill="#e4dfd2"/>
      <circle cx="182" cy="252" r="21" fill="${acc}"/>
      <line x1="182" y1="243" x2="182" y2="261" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <line x1="173" y1="252" x2="191" y2="252" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      ${ILLUS._dot(37, 126, 1, acc)}
      ${ILLUS._dot(38, 243, 2, acc)}
      ${ILLUS._dot(182, 252, 3, acc)}`;
    return ILLUS._phone(acc, inner, { alt: 'Schermata Calendario' });
  },

  /* ---------- INTRO ---------- */

  // entrare la prima volta: codice → password
  introAccesso(acc) {
    const inner = `
      <rect x="34" y="80" width="162" height="120" rx="14" fill="#faf8f2" stroke="#e9e3d5"/>
      <text x="115" y="106" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="13" font-weight="700" fill="${acc}">Modula</text>
      <rect x="50" y="120" width="130" height="22" rx="7" fill="#fff" stroke="#e4dfd2"/>
      <text x="58" y="135" font-family="Inter,sans-serif" font-size="10" fill="#a49a88">Codice invito</text>
      <rect x="50" y="150" width="130" height="22" rx="7" fill="#fff" stroke="#e4dfd2"/>
      <text x="58" y="165" font-family="Inter,sans-serif" font-size="10" fill="#a49a88">Nuova password</text>
      <rect x="50" y="180" width="130" height="14" rx="7" fill="${acc}"/>
      ${ILLUS._dot(50, 131, 1, acc)}
      ${ILLUS._dot(50, 161, 2, acc)}`;
    return ILLUS._phone(acc, inner, { alt: 'Primo accesso' });
  },

  // installare sul telefono (aggiungi a home)
  introInstalla(acc) {
    const inner = `
      <text x="115" y="100" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="12" font-weight="700" fill="#2b2a24">Aggiungi a Home</text>
      <rect x="86" y="120" width="58" height="58" rx="14" fill="${acc}"/>
      <text x="115" y="156" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="22" font-weight="700" fill="#fff">M</text>
      <text x="115" y="196" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#6e6557">L'app sulla tua Home</text>
      <path d="M115 226 l0 24 M107 240 l8 10 8 -10" stroke="${acc}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return ILLUS._phone(acc, inner, { alt: 'Installa app' });
  },

  // muoversi: barra dei moduli
  introMenu(acc) {
    const tabs = ['⚡', '📅', '👥', '🔧', '☰'];
    const inner = `
      ${[70, 112, 154].map((y, i) => ILLUS._row(y, acc)).join('')}
      <rect x="8" y="248" width="214" height="46" fill="#faf8f2" stroke="#e9e3d5"/>
      ${tabs.map((t, i) => `<text x="${34 + i * 42}" y="276" text-anchor="middle" font-size="16">${t}</text>`).join('')}
      <rect x="20" y="252" width="28" height="3" rx="1.5" fill="${acc}"/>
      ${ILLUS._dot(34, 270, 1, acc)}
      ${ILLUS._dot(202, 270, 2, acc)}`;
    return ILLUS._phone(acc, inner, { alt: 'Barra dei moduli' });
  },
};

if (typeof module !== 'undefined') module.exports = ILLUS;
