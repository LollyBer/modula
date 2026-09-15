/* ===== MODULA · CONFIG BACKEND CONDIVISO =====
   UNA sola coppia di credenziali per TUTTA la piattaforma (tutte le aziende).
   La anon key e' pubblica per design (l'isolamento dei dati lo fa la RLS lato server).
   Compilare DOPO aver creato il progetto Supabase ed eseguito supabase/schema.sql.

   Finche' restano i segnaposto __..__ l'app parte in modalita' DEMO (nessun backend). */
window.MODULA_CONFIG = {
  SUPABASE_URL: 'https://yohtthmcjqwlxoihvcrt.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_C4HlueumJxy1BjNc1fJCTQ__WzeWm2s',
  VAPID_PUBLIC: 'BJ3nqbGBg4JV6xwXvKgyOMj9LDG9XvbbE4wm2WoV56do2iWNERvcnZh4kLHLubtH7SUFB5mM2BgY6w0zPb-t61Q',  /* chiave PUBBLICA push (pubblica per design). La privata sta in FABBRICA/automazione/vapid.local.json */
  /* Indirizzo dove arrivano le richieste moduli inviate dai titolari DALL'app.
     Le legge la Fabbrica (vedi FABBRICA/POSTA.md) e instrada attivazioni / moduli su misura. */
  SUPPORT_EMAIL: 'lollyberry00@gmail.com'
};
