/* ===== MODULA · configurazione degli ambienti =====
   PROD è selezionato solo dal sito ufficiale GitHub Pages.
   Ogni altro host usa MODULA-TEST. Nessuna chiave segreta è presente qui. */
(function () {
  const officialProduction = location.hostname === 'lollyber.github.io' &&
    (location.pathname === '/modula' || location.pathname.startsWith('/modula/'))
  const prod = {
    SUPABASE_URL: 'https://yohtthmcjqwlxoihvcrt.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_C4HlueumJxy1BjNc1fJCTQ__WzeWm2s',
    VAPID_PUBLIC: 'BJ3nqbGBg4JV6xwXvKgyOMj9LDG9XvbbE4wm2WoV56do2iWNERvcnZh4kLHLubtH7SUFB5mM2BgY6w0zPb-t61Q',
    SUPPORT_EMAIL: 'lollyberry00@gmail.com',
  }
  const test = {
    SUPABASE_URL: 'https://otseutvdqxenekldnwzy.supabase.co',
    SUPABASE_ANON_KEY: 'sb_publishable_ibfUKC08jO0HaAnqWttg1w_iic-ENCS',
    VAPID_PUBLIC: '',
    SUPPORT_EMAIL: 'lollyberry00@gmail.com',
  }
  window.MODULA_CONFIG = { ...(officialProduction ? prod : test), ENVIRONMENT: officialProduction ? 'PROD' : 'TEST' }
  document.documentElement.dataset.modulaEnvironment = window.MODULA_CONFIG.ENVIRONMENT
})()
