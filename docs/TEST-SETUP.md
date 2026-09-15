# MODULA TEST

- Progetto Supabase TEST: `otseutvdqxenekldnwzy`.
- Produzione: `yohtthmcjqwlxoihvcrt`.
- Il codice seleziona PROD esclusivamente sul dominio `lollyber.github.io/modula/`; ogni altro host seleziona TEST e mostra un banner.
- Baseline prevista: `supabase/migrations/0001_baseline_schema.sql`.
- Le notifiche TEST sono disattivate finché non sono create chiavi VAPID e funzioni TEST separate.

## Flusso completo TEST

1. Aprire `admin/` come **Regia TEST**.
2. Creare un account super-admin TEST con un indirizzo usato solo per prove.
3. Usare **Prendi il controllo** per inizializzare il primo super-admin del database TEST.
4. Creare l'azienda `Azienda Demo SA` e il relativo codice invito.
5. Aprire `app.html`, registrare un titolare demo e usare il codice invito.
6. Creare dipendenti, clienti, appuntamenti e documenti tutti inventati.

Non usare email, nomi, indirizzi, file o dati delle aziende reali.

Prima di avviare l'app, applicare la baseline al progetto TEST e verificare che non esistano collegamenti a PROD.
