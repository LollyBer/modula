/* Copy for the configurator studio layout; merged with the existing dictionaries. */
(() => {
  const entries = [
    ['La tua Modula,', 'Your Modula,', 'Deine Modula,', 'Votre Modula,'],
    ['passo dopo passo.', 'step by step.', 'Schritt für Schritt.', 'pas à pas.'],
    ['Nome, contatti e stile', 'Name, contacts and style', 'Name, Kontakte und Stil', 'Nom, coordonnées et style'],
    ['Il tuo settore di attività', 'Your industry', 'Deine Branche', 'Votre secteur d’activité'],
    ['La base e le funzioni extra', 'The core and extra features', 'Die Basis und Zusatzfunktionen', 'La base et les fonctions supplémentaires'],
    ['Formula e richiesta finale', 'Plan and final request', 'Modell und abschliessende Anfrage', 'Formule et demande finale'],
    ['Passaggio {{current}} di 4', 'Step {{current}} of 4', 'Schritt {{current}} von 4', 'Étape {{current}} sur 4'],
    ['La tua attività', 'Your business', 'Dein Unternehmen', 'Votre activité'],
    ['Come possiamo ricontattarti?', 'How can we get back to you?', 'Wie können wir dich erreichen?', 'Comment pouvons-nous vous recontacter ?'],
    ['La configurazione prende forma', 'Your configuration takes shape', 'Deine Konfiguration nimmt Form an', 'Votre configuration prend forme'],
    ['5 moduli base inclusi', '5 core modules included', '5 Basismodule enthalten', '5 modules de base inclus'],
    ['5 moduli base + {{count}} extra', '5 core modules + {{count}} extras', '5 Basismodule + {{count}} Zusatzmodule', '5 modules de base + {{count}} supplémentaires'],
    ['Tutti i moduli inclusi', 'All modules included', 'Alle Module enthalten', 'Tous les modules inclus'],
    ['Su misura: da valutare', 'Custom: to be assessed', 'Individuell: nach Prüfung', 'Sur mesure : à étudier'],
    ['Nessun pagamento in questa fase.', 'No payment at this stage.', 'In diesem Schritt ist keine Zahlung erforderlich.', 'Aucun paiement à cette étape.'],
    ['Abbonamento indicativo', 'Estimated subscription', 'Unverbindlicher Abonnementpreis', 'Abonnement indicatif'],
    ['Dettagli della richiesta', 'Request details', 'Details der Anfrage', 'Détails de la demande'],
    ['Ingrandisci la demo', 'Expand the demo', 'Demo vergrössern', 'Agrandir la démo'],
    ['Chiudi demo', 'Close demo', 'Demo schliessen', 'Fermer la démo'],
    ['Modula · demo base con dati di esempio', 'Modula · core demo with sample data', 'Modula · Basis-Demo mit Beispieldaten', 'Modula · démo de base avec données d’exemple'],
    ['Navigazione dei passaggi', 'Step navigation', 'Schrittnavigation', 'Navigation entre les étapes'],
    ['Torna al sito', 'Back to website', 'Zur Website', 'Retour au site'],
    ['Vai al contenuto', 'Skip to content', 'Zum Inhalt', 'Aller au contenu'],
    ['La demo mantiene i colori e i dati dell’app reale.', 'The demo keeps the real app’s colours and data.', 'Die Demo behält die Farben und Daten der echten App.', 'La démo conserve les couleurs et les données de l’app réelle.'],
  ];

  window.MODULA_TRANSLATIONS = window.MODULA_TRANSLATIONS || {};
  ['en', 'de', 'fr'].forEach((language, column) => {
    const dictionary = Object.fromEntries(entries.map(([source, ...translations]) => [source, translations[column]]));
    window.MODULA_TRANSLATIONS[language] = Object.assign(window.MODULA_TRANSLATIONS[language] || {}, dictionary);
  });
})();
