/* Small, responsive interactions and a genuine-review request, never fake testimonials. */
(() => {
  'use strict';
  const rows = [
    ['La demo e le schermate mostrano l’app reale, attualmente in italiano.','The demo and screenshots show the real app, currently in Italian.','Die Demo und die Screenshots zeigen die echte App, derzeit auf Italienisch.','La démo et les captures montrent la véritable application, actuellement en italien.'],
    ['Recensioni','Reviews','Erfahrungen','Avis'],
    ['Modula, vista','Modula, through','Modula, aus Sicht','Modula, vue'],
    ['da chi la usa.','the eyes of its users.','der Nutzer.','par ses utilisateurs.'],
    ['Le esperienze contano quando raccontano un lavoro vero: cosa è diventato più semplice, quali moduli fanno la differenza e cosa si può migliorare.','Useful feedback comes from real work: what became easier, which modules make a difference, and what could be improved.','Wertvolle Erfahrungen entstehen im Arbeitsalltag: Was ist einfacher geworden? Welche Module helfen besonders? Was lässt sich verbessern?','Les retours utiles viennent du travail réel : ce qui est devenu plus simple, les modules qui font la différence et ce qui peut être amélioré.'],
    ['Stiamo raccogliendo le prime testimonianze da pubblicare in questa sezione.','We are collecting the first user stories to publish here.','Wir sammeln die ersten Erfahrungsberichte für diesen Bereich.','Nous recueillons les premiers témoignages à publier dans cette section.'],
    ['Ogni testimonianza verrà verificata e pubblicata solo con l’approvazione di chi la racconta.','Every review will be checked and published only with its author’s approval.','Jeder Erfahrungsbericht wird geprüft und nur mit Zustimmung der Verfasser veröffentlicht.','Chaque témoignage sera vérifié et publié uniquement avec l’accord de son auteur.'],
    ['Usi già Modula?','Already using Modula?','Nutzt du Modula bereits?','Vous utilisez déjà Modula ?'],
    ['La tua esperienza conta.','Your experience matters.','Deine Erfahrung zählt.','Votre expérience compte.'],
    ['Raccontaci come la usi nella tua attività. Puoi condividere ciò che funziona e ciò che vorresti migliorare.','Tell us how you use it in your business. Share what works and what you would like to improve.','Erzähle uns, wie du Modula in deinem Betrieb nutzt. Was funktioniert gut und was würdest du verbessern?','Racontez-nous comment vous l’utilisez dans votre activité, ce qui fonctionne et ce que vous aimeriez améliorer.'],
    ['Scrivi la tua recensione','Write your review','Erfahrung teilen','Écrire un avis'],
    ['Il tuo nome','Your name','Dein Name','Votre nom'],
    ['Nome e cognome','Full name','Vor- und Nachname','Prénom et nom'],
    ['Attività (facoltativa)','Business (optional)','Betrieb (optional)','Entreprise (facultatif)'],
    ['La tua attività','Your business','Dein Betrieb','Votre entreprise'],
    ['La tua esperienza','Your experience','Deine Erfahrung','Votre expérience'],
    ['Come usi Modula? Quali moduli ti aiutano nel lavoro?','How do you use Modula? Which modules help you at work?','Wie nutzt du Modula? Welche Module helfen dir bei der Arbeit?','Comment utilisez-vous Modula ? Quels modules vous aident dans votre travail ?'],
    ['Accetto di essere ricontattato per verificare il testo prima di un’eventuale pubblicazione.','I agree to be contacted to check the text before any publication.','Ich bin damit einverstanden, zur Prüfung des Textes vor einer möglichen Veröffentlichung kontaktiert zu werden.','J’accepte d’être recontacté pour vérifier le texte avant une éventuelle publication.'],
    ['Prepara l’email della recensione','Prepare review email','E-Mail mit Erfahrungsbericht vorbereiten','Préparer l’e-mail de l’avis'],
    ['Si apre il tuo programma di posta. Nessuna pubblicazione automatica. Puoi anche scrivere a','Your email app will open. Nothing is published automatically. You can also write to','Dein E-Mail-Programm wird geöffnet. Es wird nichts automatisch veröffentlicht. Du kannst auch schreiben an','Votre application de messagerie s’ouvre. Rien n’est publié automatiquement. Vous pouvez aussi écrire à'],
    ['Recensione Modula','Modula review','Erfahrungsbericht zu Modula','Avis sur Modula'],
    ['Nome','Name','Name','Nom'],['Attività','Business','Betrieb','Entreprise'],
    ['Ho preparato l’email. Controlla il tuo programma di posta e inviala quando vuoi. La recensione non è ancora stata inviata né pubblicata.','The email is prepared. Check your email app and send it when you are ready. The review has not been sent or published yet.','Die E-Mail ist vorbereitet. Prüfe sie in deinem E-Mail-Programm und sende sie, wenn du bereit bist. Der Erfahrungsbericht wurde noch nicht gesendet oder veröffentlicht.','L’e-mail est préparé. Vérifiez-le dans votre messagerie et envoyez-le quand vous le souhaitez. L’avis n’a pas encore été envoyé ni publié.']
  ];
  window.MODULA_TRANSLATIONS ||= {};
  ['en','de','fr'].forEach((lang,index) => {
    window.MODULA_TRANSLATIONS[lang] ||= {};
    rows.forEach(row => {window.MODULA_TRANSLATIONS[lang][row[0]] = row[index+1];});
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)'), finePointer = matchMedia('(pointer: fine)');
  const hero = document.querySelector('.hero'), glow = document.querySelector('.hero-light');
  let pointerFrame = 0;
  hero.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || pointerFrame) return;
    const box = hero.getBoundingClientRect(), x = (event.clientX-box.left)/box.width*100, y = (event.clientY-box.top)/box.height*100;
    pointerFrame = requestAnimationFrame(() => {
      glow.style.setProperty('--light-x',x+'%');glow.style.setProperty('--light-y',y+'%');pointerFrame=0;
    });
  },{passive:true});
  hero.addEventListener('pointerleave', () => {glow.style.removeProperty('--light-x');glow.style.removeProperty('--light-y');});
  let progressFrame = 0;
  function progress() {
    if(progressFrame)return;
    progressFrame=requestAnimationFrame(() => {
      const total=document.documentElement.scrollHeight-innerHeight;
      document.documentElement.style.setProperty('--reading-progress',String(total>0?Math.min(1,Math.max(0,scrollY/total)):0));
      progressFrame=0;
    });
  }
  addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress,{passive:true});
  document.addEventListener('modula:languagechange',progress);progress();

  const form=document.querySelector('#review-form');
  form.addEventListener('submit',event => {
    event.preventDefault();
    if(!form.reportValidity())return;
    const tr=source=>window.ModulaI18n?.t(source)??source;
    const data=new FormData(form);
    const body=[tr('Nome')+': '+data.get('reviewer'),tr('Attività')+': '+(data.get('business')||'—'),' ',tr('La tua esperienza')+':',data.get('experience'),' ',tr('Accetto di essere ricontattato per verificare il testo prima di un’eventuale pubblicazione.')].join('\n');
    window.location.href='mailto:lollyberry00@gmail.com?subject='+encodeURIComponent(tr('Recensione Modula'))+'&body='+encodeURIComponent(body);
    document.querySelector('#review-status').textContent='Ho preparato l’email. Controlla il tuo programma di posta e inviala quando vuoi. La recensione non è ancora stata inviata né pubblicata.';
  });
})();
