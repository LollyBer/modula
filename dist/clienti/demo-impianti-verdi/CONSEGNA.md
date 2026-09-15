# Consegna — Demo Impianti Verdi

> App DEMO assemblata dalla Fabbrica Modula. Solo struttura, **zero dati reali**.

## Identità
- **Azienda:** Demo Impianti Verdi
- **Slug:** `demo-impianti-verdi`
- **Settore:** impianti
- **Accento:** `#34D399` (override `--cy` in `app.html`, subito dopo `core.css`)
- **Origine:** configuratore

## Moduli inclusi
**Base (sempre presenti):** Hub · Calendario · Note · Notifiche · Clienti · Personale

**Extra assemblati (pronti):**
- 🔧 **Manut.** (`man`) — `modules-extra/man/man.js`
- 💰 **Conti** (`conti`) — `modules-extra/conti/conti.js`
- 🗺️ **Zone** (`zone`) — `zone.js` + `zone.css` + `zone-data.js` + Leaflet (`vendor/leaflet.*`)
  - ordine script: leaflet → zone-data → zone

Ordine menù (VIEWS) potato: hub · cal · notes · notif · man · clients · zone · conti · emps.
Dispatcher `R` potato in coerenza. Nessun riferimento a moduli rimossi.

## Promessi — da costruire (in arrivo)
- 🧾 **Fatture** (`fatture`) — modulo nel catalogo ma **non ancora disponibile**. NON assemblato.
  Lo costruirà l'Inventore; sarà aggiunto in un secondo rilascio.

## TODO aperti (segnaposto lasciati apposta)
- [ ] **Supabase**: compilare `__SUPABASE_URL__` e `__SUPABASE_ANON_KEY__` in `core/core.js` (progetto Supabase del cliente).
- [ ] **Push (VAPID)**: compilare `__VAPID_PUBLIC_KEY__` in `core/core.js`.
- [ ] **Logo**: inviare `logo.png` → poi impostare `BRAND.logo='./logo.png'` in `core/core.js` (ora vuoto).

Finché i segnaposto restano, l'app non si collega a dati reali (coerente con "solo struttura").

## Note tecniche
- Cartella autosufficiente (percorsi relativi). Funziona sotto GitHub Pages senza modifiche ai path.
- **Limite noto v1:** alcuni glow `rgba()` fissi in `core.css` non seguono `--cy` (restano verdini). L'accento strutturale (puntini, voce attiva, focus, chip) usa `#34D399`.

## Verifica locale
`python3 -m http.server 8000` → apri `/clienti/demo-impianti-verdi/app.html`.
Atteso: menù con i 9 moduli sopra, nessun errore `render… is not a function` in console.
