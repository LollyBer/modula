# MEMORIA — l'Inventore

Quaderno append-only. **Prima** di costruire lo leggo; **dopo** ci lascio la ricetta.

## Coda moduli da costruire (da MANIFEST.inArrivo)
prenota · magazzino · catalogo · fatture · documenti · report · fidelity · turni

## Catalogo settori → moduli su misura (cosa proporre quando Loris chiede "cosa facciamo")
Fonte autorevole: **[../../SETTORI-MODULI.md](../../SETTORI-MODULI.md)** (lista spuntabile, 15 settori).
Quando apro il laboratorio senza un modulo nominato, **propongo prima i 7 moduli ♻️ trasversali**
(`interventi` · `contratti-man` · `scadenziario` · `impianti` · `mezzi` · `preventivi` · `ricorrenze`):
sbloccano ~70% dei settori. I moduli mono-settore (`fgas`, `libretto`, `presidi`, `sal`…) si fanno quando
arriva il cliente reale di quel ramo. Dopo aver portato un modulo a `pronto` → **spunto la casella** nel catalogo.

## Ricetta-base "nuovo modulo" → ora è il CONTRATTO MODULO
La ricetta autorevole vive in **[../../LABORATORIO.md](../../LABORATORIO.md)** (Contratto Modulo, agganci A–F)
+ scheletro copia-incolla **[../../TEMPLATE-modulo.js](../../TEMPLATE-modulo.js)**. Sintesi: ogni modulo nasce
già agganciato a **Hub** (`<id>HubCardHTML()` + guard in hub.js), agli **altri moduli** (`cName/eName/byId/nav`),
e alla **memoria** (`blank()`+`MAPS`+`TBL`+`UP_ORDER/DEL_ORDER`+`loadAll/dbRows`+`save()`+seed in `demoBoot`).
Registrazione id coerente ovunque (VIEWS, dispatcher, MANIFEST.extra, catalogo, `<script>` in app.html).
Trigger di Loris: **"apri laboratorio"** → entro build-ready (leggo questa MEMORIA + `inArrivo`, carico il Contratto).

## Trabocchetti noti
- Gli `id` devono combaciare in catalogo, MANIFEST, VIEWS e dispatcher: un disallineamento = menù rotto.
- Funzioni render globali (niente moduli ES): si caricano via `<script>` in `app.html` dopo il core.

## Ricette dei moduli costruiti (cresce ad ogni modulo)
<!-- formato: ### <modulo> [AAAA-MM-GG] → passi specifici + cosa è andato storto -->
_(ancora vuoto)_
