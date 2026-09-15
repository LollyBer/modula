# 📨 POSTA — dalla mail del cliente all'azienda attiva

> Il flusso ufficiale della Fabbrica nel modello **una sola app multi-tenant**.
> Non si assembla più una cartella per cliente: si **attivano i moduli su un tenant**.

## Da dove arrivano le mail

Due sorgenti, stesso indirizzo (`lollyberry00@gmail.com`):

1. **Configuratore** (vetrina pubblica, pre-vendita) — un nuovo cliente compone la sua
   app e clicca *Invia via Email*. La mail contiene: azienda, settore, colore, moduli
   base, **moduli extra scelti**, ed eventuale **modulo su misura**. In fondo una riga
   `--- config ---` con un JSON.
2. **Dentro l'app** (cliente già attivo) — il titolare apre *🧩 Moduli & richieste* e
   invia. La mail ha oggetto `Richiesta moduli — <azienda>` e contiene: chi scrive,
   *Attivi ora*, *Da ATTIVARE (già pronti)*, *Su misura / in arrivo richiesti*,
   ed eventuale *MODULO SU MISURA*.

## Come si usa (Loris) — automatico

Incolla il **testo della mail** nella Fabbrica e di' *«è arrivata una mail»*. Il Direttore
la **legge da solo**, **esegue** `FABBRICA/automazione/attiva.mjs` (crea l'azienda + accende
i moduli pronti + ti restituisce il **codice invito**) e instrada eventuali moduli su misura
all'Inventore. Nessun clic manuale in `admin/`: lo script lo fa al posto tuo.

## La catena dei 3 agenti

```
        ┌─────────────┐   moduli PRONTI da attivare   ┌──────────────────┐
 mail → │ 1. Direttore │ ────────────────────────────▶ │ 2. Assemblatore  │ → azione admin
        │   (legge,    │                                │ (attiva sul      │   (crea azienda /
        │   smista)    │   moduli SU MISURA / in arrivo │  tenant)         │    accende moduli)
        └─────────────┘ ─────────────────────────┐    └──────────────────┘
                                                  ▼
                                         ┌──────────────────┐
                                         │ 3. Inventore     │ → costruisce il modulo
                                         │ (laboratorio)    │   (poi Loris lo attiva)
                                         └──────────────────┘
```

### 1 · Direttore — legge ed ESEGUE (automatico)
- Estrae dalla mail: **azienda**, **titolare**, se **nuova/esistente**, **moduli richiesti**,
  **posti** e l'eventuale **descrizione su misura**.
- Classifica con `FABBRICA/MANIFEST.js`: **pronto** (in `extra`/`base`) → si attiva subito ·
  **da creare** (in `inArrivo` o su misura) → all'Inventore.
- **Lancia lui stesso** `attiva.mjs` coi moduli pronti (crea l'azienda nuova o aggiorna i moduli
  di quella esistente) e riporta a Loris il **codice invito**. Niente passaggio manuale in admin.

### 2 · Assemblatore — attiva sul tenant (NON crea cartelle)
Nel multi-tenant "consegnare" = una riga nel DB. Produce l'**azione super-admin** pronta:
- **Nuova azienda** → istruzioni per la console `admin/`:
  *Nuova azienda → Nome, Slug, Titolare, spunta i moduli pronti → Crea → copia il
  codice invito da dare al cliente.*
  In alternativa l'SQL equivalente: `select create_tenant('<Nome>','<slug>',
  '["hub","cal","notes","notif",<...pronti>]'::jsonb,'<Titolare>');`
- **Cliente esistente** → *console `admin/` → azienda X → accendi i moduli richiesti →
  Salva moduli.* Oppure: `update tenants set modules = '[...]'::jsonb where slug='<slug>';`
- Ricorda sempre i moduli **già attivi** (non spegnerli) e l'ordine canonico
  (`MANIFEST.viewOrder`). I moduli su misura **non** vanno accesi finché non esistono.

### 3 · Inventore — costruisce il su misura
- Riceve la **descrizione** del modulo su misura (o un id `inArrivo`).
- Lo costruisce e lo promuove a `pronto` (vedi il suo protocollo). Finito, avvisa il
  Direttore: il modulo è pronto → l'Assemblatore può accenderlo sul tenant del cliente.

## Regole
- Nessun dato reale del cliente entra nel repo: qui si gestiscono **attivazioni**, non dati.
- Il super-admin (Loris) resta l'unico che **attiva** davvero: gli agenti preparano
  l'azione, l'ultimo clic in `admin/` lo fa Loris.
