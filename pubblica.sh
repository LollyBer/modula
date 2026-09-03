#!/usr/bin/env bash
# ============================================================================
# pubblica.sh — MODULA: porta il lavoro corrente ONLINE.
# ----------------------------------------------------------------------------
# Il sito live (landing, configuratore, portale e SOPRATTUTTO l'app-root
# app.html che usano ptek e i clienti come PWA) è servito da GitHub Pages dal
# branch `main`. Si lavora però su `multitenant`: senza questo passaggio le
# modifiche NON vanno mai live. Questo script fa tutto in un colpo:
#   1. verifica che sia tutto committato
#   2. avanza `main` al branch corrente (fast-forward) e lo pusha
#   3. attende che GitHub Pages ribuildi il commit giusto
#   4. conferma l'URL live
#
# Uso:  ./pubblica.sh
# ============================================================================
set -euo pipefail
REPO="LollyBer/modula"
LIVE_BRANCH="main"
cd "$(dirname "$0")"

cur=$(git branch --show-current)
echo "▶ Pubblico il branch «$cur» su «$LIVE_BRANCH» (sito live)"

# 0. cache-busting: aggiorna ?v= sugli asset dell'app in app.html così i browser/PWA
#    scaricano subito il codice nuovo (GitHub Pages serve i file con max-age=600).
if [ -f cache-bust.py ]; then
  python3 cache-bust.py >/dev/null 2>&1 || true
  if [ -n "$(git status --porcelain app.html)" ]; then
    git add app.html && git commit -q -m "chore: cache-bust asset app (pubblica)"
    echo "  ↻ cache-bust applicato ad app.html"
  fi
fi

# 1. niente modifiche in sospeso
if [ -n "$(git status --porcelain)" ]; then
  echo "✋ Ci sono modifiche non committate. Committa prima (o «aggiorna e chiudi»), poi ripubblica:"
  git status --short
  exit 1
fi

# 1b. integra eventuali commit arrivati su origin/LIVE_BRANCH (es. lavoro fatto
#     direttamente sul live da un'altra sessione): evita il rifiuto non-fast-forward.
git fetch -q origin "$LIVE_BRANCH" 2>/dev/null || true
if git rev-parse -q --verify "origin/$LIVE_BRANCH" >/dev/null 2>&1 \
   && ! git merge-base --is-ancestor "origin/$LIVE_BRANCH" HEAD; then
  echo "↩ «origin/$LIVE_BRANCH» ha commit nuovi: li integro nel branch corrente (merge)…"
  if ! git merge --no-edit "origin/$LIVE_BRANCH"; then
    echo "✋ Conflitto nel merge con «origin/$LIVE_BRANCH» — risolvilo a mano, poi ripubblica."
    exit 1
  fi
  [ "$cur" != "$LIVE_BRANCH" ] && git push -q origin "$cur" 2>/dev/null || true
fi

# 2. avanza main al branch corrente e pusha
if [ "$cur" = "$LIVE_BRANCH" ]; then
  git push origin "$LIVE_BRANCH"
elif git merge-base --is-ancestor "$LIVE_BRANCH" "$cur"; then
  git branch -f "$LIVE_BRANCH" "$cur"
  git push origin "$cur:$LIVE_BRANCH"
  echo "✓ «$LIVE_BRANCH» avanzato a $(git rev-parse --short "$cur")"
else
  echo "✋ «$LIVE_BRANCH» è divergente da «$cur» (non è un fast-forward): serve un merge manuale."
  exit 1
fi

head=$(git rev-parse HEAD)
owner=${REPO%%/*}; name=${REPO##*/}
url="https://${owner}.github.io/${name}/"
echo "⏳ Attendo la build di GitHub Pages per $(git rev-parse --short HEAD)…"

# 3. poll finché Pages ha buildato questo commit (best-effort)
for i in $(seq 1 18); do
  line=$(gh api "repos/$REPO/pages/builds/latest" 2>/dev/null \
    | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('status'),d.get('commit'))" 2>/dev/null \
    || echo "unknown none")
  st=${line% *}; commit=${line#* }
  if [ "$st" = "built" ] && [ "$commit" = "$head" ]; then
    echo "✅ PUBBLICATO — live: ${url}"
    echo "   L'app ptek/clienti (PWA su app.html) prende i file nuovi alla prossima apertura o pull-to-refresh."
    echo "   ⚠ Se hai cambiato il MODELLO DATI (nuove tabelle/colonne): Supabase → SQL Editor → esegui supabase/schema.sql."
    exit 0
  fi
  sleep 8
done
# Non un errore: il push è avvenuto. Pages finisce da solo; se il commit cambia solo
# file NON pubblicati (es. pubblica.sh, escluso dal sito) può non registrare un build nuovo.
echo "✓ Push su «$LIVE_BRANCH» fatto — live: ${url}"
echo "  GitHub Pages di solito completa entro 1–2 minuti: il sito si aggiorna da solo."
exit 0
