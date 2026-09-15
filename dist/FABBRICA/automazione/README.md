# ⚙️ Automazione Fabbrica — attivazione aziende

Script che crea un'azienda e/o accende i suoi moduli **in automatico**, senza clic in `admin/`.
Usa la **service-role key** di Supabase (salta la RLS), tenuta SOLO in `secrets.local.json`
(ignorato da git — **mai** nel repo).

## Setup (una volta)
Apri `secrets.local.json` e incolla la chiave segreta al posto di `INCOLLA_QUI_LA_SECRET_KEY`:
```json
{ "SUPABASE_URL": "https://hdhaptzsgkpdhuelwede.supabase.co", "SERVICE_ROLE_KEY": "sb_secret_…" }
```

## Uso
Dalla cartella `FABBRICA/automazione/`:

```bash
# azienda nuova (stampa il CODICE INVITO)
echo '{"azienda":"Prova SRL","titolare":"Mario Rossi","moduli":["cal","notes","clients","man","conti"]}' | node attiva.mjs

# oppure JSON come argomento
node attiva.mjs '{"azienda":"Prova SRL","titolare":"Mario Rossi","moduli":["man","conti"]}'

# oppure a flag
node attiva.mjs --azienda "Prova SRL" --titolare "Mario Rossi" --moduli "man,conti"
```

Accetta anche il JSON `--- config ---` del **configuratore** (campi `moduli_base`/`moduli_extra`/`modulo_su_misura`).

## Comportamento
- **Azienda nuova** → crea tenant + titolare + settings → stampa il **codice invito** da dare al cliente.
- **Azienda esistente** (stesso slug) → **unisce** i moduli richiesti a quelli già attivi (non spegne nulla).
- I moduli che **non esistono ancora** (su misura / in arrivo) non vengono accesi: li elenca come
  "da costruire" → vanno passati al Laboratorio (vedi `../INTEGRAZIONE.md`).

## Come la usa la Fabbrica
Il **Direttore** legge la mail, estrae i dati, e lancia questo script con il JSON dei moduli
**pronti** → azienda attiva + codice. I moduli su misura li manda prima al **Laboratorio**
(che li integra), poi rilancia lo script per accenderli. Vedi `../POSTA.md`.
