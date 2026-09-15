#!/bin/zsh
set -eu
cd -- "${0:A:h}"
readonly PORT=4175
python3 -m http.server "${PORT}" --bind 127.0.0.1 &
SERVER_PID=$!
sleep 1
open "http://127.0.0.1:${PORT}/configuratore/"
wait "${SERVER_PID}"
