#!/bin/zsh
set -eu

cd -- "${0:A:h}"
readonly PORT=4174

print "Avvio MODULA TEST su http://127.0.0.1:${PORT}/"
print "Regia: http://127.0.0.1:${PORT}/admin/"
print "App:   http://127.0.0.1:${PORT}/app.html"
print "Lascia aperta questa finestra mentre usi MODULA TEST."
print "Premi Control-C qui per spegnere il server locale."

python3 -m http.server "${PORT}" --bind 127.0.0.1 &
SERVER_PID=$!
sleep 1
open "http://127.0.0.1:${PORT}/admin/"
wait "${SERVER_PID}"
