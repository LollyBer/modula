# Sicurezza — Modula

## Segnalare una vulnerabilità
Scrivi a **lollyberry00@gmail.com** con oggetto `SECURITY`. Rispondiamo entro pochi giorni.
Per favore **non aprire una issue pubblica** per problemi di sicurezza: segnala in privato.

## Modello di sicurezza
Modula è una web-app statica (GitHub Pages) su backend **Supabase**.

- **Repo pubblico = solo struttura.** Nessun segreto e nessun dato reale nel repository. In `core/config.js` stanno solo chiavi **pubbliche per design**: la anon/publishable key di Supabase e la chiave VAPID pubblica delle notifiche.
- **La barriera ai dati è la RLS** (Row Level Security) lato Supabase: ogni azienda (tenant) vede solo le proprie righe. La chiave pubblica nel client non dà accesso ai dati senza le policy.
- **Segreti veri** (service_role, chiave VAPID privata) stanno **solo** in file locali gitignorati (`*.local.json`, `.env`) e nei *Secrets* di Supabase — **mai** nel repo.
- **XSS:** ogni stringa inserita dall'utente passa da `esc()` prima di finire in `innerHTML`.

## Protezioni attive
- GitHub **Secret scanning** + **Push protection** (blocca l'invio accidentale di segreti).
- GitHub **Dependabot** (alert vulnerabilità + fix automatici sulle dipendenze).
- `.gitignore` esclude `secrets.local.json`, `*.local.json`, `.env*`.

## Dipendenze esterne caricate a runtime (pinnate)
`@supabase/supabase-js@2`, `swissqrbill@4` e `pdfjs-dist@4.7.76` (import on-demand da CDN), più le librerie in `vendor/` (Leaflet, SheetJS). Le versioni sono fissate.
