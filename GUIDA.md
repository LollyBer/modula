# 📖 Guida facile di Modula — "cosa clicco per…"

> Scritta semplice, per te. Niente gergo. Quando non ricordi come si fa una cosa, apri questo foglio.

## I 4 pezzi (in una riga ciascuno)

- **🌐 Landing** = la vetrina online. Il cliente scopre Modula. *(non la tocchi mai durante il lavoro)*
- **🧩 Configuratore** = dove il cliente sceglie i suoi moduli e ti manda la richiesta.
- **👑 Regia (`admin/`)** = il TUO pannello. Qui crei i clienti e gestisci tutto. **È il tuo posto di lavoro.**
- **📱 App (`app.html`)** = il gestionale vero che usano il cliente e i suoi dipendenti.

E sotto a tutto c'è il **🗄️ Database (Supabase)**: il magazzino dove vivono account e dati. La Regia ci scrive, l'App ci legge. Non lo tocchi quasi mai (solo quando aggiungo io una funzione e ti do uno "SQL da incollare").

---

## 🔑 Le ricette (cosa clicco per…)

### …creare un nuovo cliente
1. Apri la **Regia** (`…/admin/`).
2. Apri la tendina **"+ Nuova azienda"**.
3. Incolla la **richiesta del cliente** nel box "📥 Incolla configurazione" → **"Compila il form"**.
4. Controlla nome, colore, moduli → **"Crea azienda + genera codice"**.
5. Copia il **"messaggio d'invito pronto"** e mandalo al cliente. ✅ Fatto.

### …accendere o spegnere un modulo a un cliente
1. Regia → trova l'azienda (usa la **ricerca** in alto).
2. Aprila → **"🧩 Moduli — modifica"**.
3. Clicca i moduli in **"Da attivare"** (si accendono) o in **"Attivi"** (si spengono).
4. **"Salva moduli"**. *(zero programmazione: è solo un interruttore)*

### …rivedere il codice invito di un cliente
- Regia → apri l'azienda → sezione **"Codici invito da usare"**. C'è il codice + bottone **copia**.
  *(sparisce da solo quando il cliente lo usa)*

### …segnare un pagamento / gestire il canone
- Regia → apri l'azienda → box **"Gestione cliente"** → metti canone, scadenza, **stato pagamento** → **"Salva gestione"**.
- Se un cliente non paga: **"Sospendi"** (l'app smette di funzionare, i dati restano).

### …mettere in pausa o cancellare un'azienda
- **Sospendi/Riattiva** = stoppa o riaccende l'app del cliente (reversibile).
- **Elimina** = cancella azienda + tutti i suoi dati. **Definitivo.** Chiede conferma.

### …pubblicare online le modifiche al sito/app
- Le modifiche al **codice** che faccio io vanno "pubblicate" per andare online (comando `git push`).
- Tu non devi fare niente di tecnico: mi dici **"pubblica"** (o *"AGGIORNA E CHIUDI"*) e ci penso io, security review inclusa.

---

## 🆕 Aggiungere un modulo: due cose diverse (non confonderle!)

| Cosa | Dove | Programmare? |
|---|---|---|
| **Accendere** un modulo che già esiste | Regia, un clic | ❌ No |
| **Creare** un modulo nuovo che non esiste ancora | Laboratorio/Fabbrica (sviluppo) | ✅ Sì, lo faccio io |

Il 95% del tuo lavoro è il primo (clic in Regia).

---

## 🗣️ Glossario lampo (le parole strane)

- **Tenant / azienda** = un cliente nel sistema (es. ptek). Una riga nel database.
- **Modulo** = una funzione dell'app (Clienti, Calendario, Cantieri…).
- **Slug** = il nome corto senza spazi di un'azienda (es. `ptek`). Serve al sistema.
- **Super-admin** = tu. L'unico che vede tutto e crea le aziende.
- **Codice invito** = la "chiave" che dai al cliente per entrare la prima volta.
- **Regia** = la console `admin/`, il tuo pannello di controllo.
- **RLS** = la regola del database che tiene ogni azienda separata dalle altre (nessuno vede i dati di un altro).
- **Supabase** = il servizio dove sta il database online.
- **Deploy / pubblicare** = mandare online le modifiche al codice.

---

🔗 Vedi anche: il sito live è **https://lollyber.github.io/modula/** · la Regia è `…/admin/` · l'app è `…/app.html`.
