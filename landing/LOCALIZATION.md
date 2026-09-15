# Lingue, colori e recensioni

La landing e il configuratore supportano italiano, inglese, tedesco e francese.
Il selettore salva la scelta in `modula-language` e la propaga nei link fra le
due pagine con `?lang=it|en|de|fr`. L’italiano rimane la lingua predefinita.

## File

- `../i18n.js`: selettore, persistenza e traduzione dei testi/attributi del DOM.
- `translations-static.js`: testi della landing e accessibilità.
- `translations-dynamic.js`: moduli, confronto, prezzi e carosello.
- `experience.js`: recensioni e interazioni leggere.
- `../configuratore/translations.js`: testi e riepiloghi del configuratore.
- `theme.css`: palette antracite/corallo precedente, applicata al nuovo layout.

Le chiavi dei dizionari sono i testi originali italiani, senza spazi iniziali
o finali. Ogni nuova frase deve avere una traduzione EN, DE e FR. In tedesco
si usa il «du» e la grafia svizzera; in francese si usa «vous».

`data-i18n-ignore` protegge contenuti inseriti dall’utente e blocchi di dati.
Gli input non vengono tradotti. Screenshot e iframe mostrano l’app reale in
italiano: il sito lo dichiara, senza simulare una versione diversa dell’app.

## Recensioni

Non sono state inserite testimonianze o valutazioni fittizie. La sezione invita
a inviare un’esperienza tramite il proprio programma di posta. Il form prepara
un `mailto:` e non invia né pubblica autonomamente i dati. Le testimonianze
autentiche andranno aggiunte dopo verifica e approvazione dell’autore.

## Verifiche

- Quattro lingue controllate alle larghezze 320, 768, 1024, 1280 e 1920 px.
- Moduli, prezzi, contatore e descrizioni accessibili tradotti dinamicamente.
- Tetto CHF 129 invariato, anche passando fra lingue diverse.
- Form recensioni: campi obbligatori, consenso e conservazione dei testi utente.
- Didascalie e alternative testuali delle immagini aggiornate al cambio lingua.
- Nessuna email inviata durante i test.

Schermate di controllo in `output/playwright/modula-assets/` nella cartella
principale del progetto. La pubblicazione del sito non è parte di questa modifica.
