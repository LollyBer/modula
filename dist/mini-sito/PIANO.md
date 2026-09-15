# Mini sito web per azienda — PIANO

Sito vetrina **pubblico**, one-page, per ogni azienda cliente di Modula. È la sua presenza web (quello che un potenziale cliente trova su Google/Instagram). Chiude il funnel:

```
Mini sito (vetrina pubblica) → CTA "Prenota" → /portale/ (portale clienti) → prenotazione
```

- **Stile:** dark premium, coordinato con landing/portale/configuratore. Accento per-azienda.
- **Stack:** HTML/CSS/JS puro. Dati per-azienda in `CONFIG` (in cima a `sito.js`), come nel portale → si edita per ogni cliente.
- **Mobile-first**, ma a piena larghezza su desktop (a differenza del portale che è una colonna stretta).

## File
- `index.html` — scheletro sezioni con `id` e contenitori da riempire
- `sito.css` — design system dark premium (token condivisi) + layout sezioni
- `sito.js` — `CONFIG` azienda + render che inietta testi/servizi/orari nello scheletro
- `PIANO.md` — questo documento

## Sezioni (one-page) — stato scheletro

| # | Sezione | Contenuto previsto | Stato scheletro |
|---|---------|--------------------|-----------------|
| 1 | **Nav** sticky | logo/nome azienda + ancore (Servizi, Chi siamo, Contatti) + CTA "Prenota" | ✅ struttura + nome da CONFIG |
| 2 | **Hero** | categoria, nome azienda, claim, 2 CTA (Prenota / Chiama), immagine sfondo | ✅ testi da CONFIG · ⛔ foto = placeholder |
| 3 | **Servizi** | griglia servizi con prezzo (gli stessi del portale) | ✅ render da CONFIG.servizi |
| 4 | **Chi siamo** | breve storia + foto del locale/team | ⛔ copy + foto = placeholder |
| 5 | **Galleria** | 4–6 foto (lavori/ambiente) | ⛔ placeholder immagini |
| 6 | **Orari + Mappa** | tabella orari settimanali + mappa/indirizzo | ✅ orari da CONFIG · ⛔ mappa = placeholder |
| 7 | **Contatti + CTA finale** | telefono, WhatsApp, social, indirizzo + grande "Prenota ora" | ✅ da CONFIG |
| 8 | **Footer** | "Powered by Modula" + link | ✅ |

## Cosa serve per completarlo (da fornire/decidere per cliente reale)
- **Foto** reali (hero, chi siamo, galleria) — ora ci sono placeholder
- **Copy "Chi siamo"** — testo reale
- **Orari** reali, **social**, eventuale **mappa** (embed o link)
- Decidere se il menu/servizi del sito = quelli del portale (consigliato: stessa fonte CONFIG)

## Integrazione funnel
- CTA "Prenota" puntano a `../portale/` (stesso `CONFIG.accento` per continuità visiva).
- In futuro: un unico `CONFIG` condiviso tra mini-sito e portale per azienda (oggi duplicato, da unificare).

## Da fare quando si costruisce sul serio
- Riempire le sezioni ⛔ (foto + copy)
- SEO base: `<title>`, meta description, Open Graph, dati struttura `LocalBusiness`
- `?v=` cache-busting sugli asset (come configuratore)
- Eventuale dominio/sottodominio per cliente
