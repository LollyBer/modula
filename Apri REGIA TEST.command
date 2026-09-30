#!/bin/zsh
set -eu

cd -- "${0:A:h}"
readonly PORT=4174

print "Avvio REGIA TEST su http://127.0.0.1:${PORT}/admin/"
print "Questo è soltanto MODULA TEST: usa dati inventati."
print "Lascia aperta questa finestra mentre lavori."
python3 -m http.server "${PORT}" --bind 127.0.0.1 &
SERVER_PID=$!
sleep 1
open "http://127.0.0.1:${PORT}/admin/"
wait "${SERVER_PID}"
