# MEMORIA — il Direttore

Quaderno append-only. **Prima** di supervisionare lo leggo; **dopo** aggiorno la checklist.

## Checklist QA di partenza (prima di pubblicare un cliente)
- [ ] `app.html` carica SOLO gli script/css dei moduli inclusi (niente 404).
- [ ] `VIEWS` e dispatcher `R` non citano `render*` di moduli rimossi.
- [ ] BRAND.name compilato; accento `--cy` iniettato in `app.html`.
- [ ] Segnaposto `__SUPABASE_URL__` / `__SUPABASE_ANON_KEY__` / `__VAPID_PUBLIC_KEY__`: o compilati o esplicitamente "da fare" in CONSEGNA.md (l'app NON deve fingere dati reali).
- [ ] Nessun dato reale nel template/repo pubblico (regola Modula).
- [ ] `CONSEGNA.md` presente con i TODO; voce aggiunta a `registro.json`.
- [ ] Console locale senza errori; menù mostra solo i moduli giusti.
- [ ] **Moduli "promessi/non assemblati"**: ogni modulo dichiarato in CONSEGNA come "in arrivo" (es. `fatture`) NON deve avere `<script>` in `app.html`, voce in `VIEWS`, né chiave nel dispatcher `R` (grep dello slug del modulo = nessun hit operativo). Evita un menù con voce morta o un `render… is not a function`.

## Priorità (regola di partenza)
Sblocca per primo ciò che rende l'app **usabile dal cliente**: 1) Supabase, 2) logo, 3) moduli promessi.

## Apprendimenti (cresce ad ogni revisione)
<!-- formato: - [AAAA-MM-GG · cliente <slug>] controllo/pattern nuovo -->
- [2026-06-22 · demo-impianti-verdi] Aggiunto controllo "moduli promessi/non assemblati": un modulo in catalogo ma non costruito (qui `fatture`) deve restare fuori da app.html/VIEWS/dispatcher, altrimenti voce di menù morta o `render is not a function`. Verificato con grep dello slug: 0 hit operativi = ok.
