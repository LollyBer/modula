#!/usr/bin/env python3
# Aggiunge/aggiorna ?v=<versione> sugli asset DELL'APP in app.html (core, moduli,
# macchine, zone) — NON sui vendor. Serve a far scaricare subito il codice nuovo
# invece della copia in cache (GitHub Pages serve max-age=600).
# Uso:  python3 cache-bust.py [versione]   (default: timestamp)
import re, sys, time, os
HERE = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(HERE, 'app.html')
ver = sys.argv[1] if len(sys.argv) > 1 else time.strftime('%Y%m%d%H%M%S')
s = open(F, encoding='utf-8').read()
# solo path locali dell'app: ./core ./modules-base ./modules-extra ./macchine* ./zone*
pat = re.compile(r'(src|href)="(\./(?:core|modules-base|modules-extra|macchine|zone)[^"?]*\.(?:js|css))(?:\?v=[^"]*)?"')
n = [0]
def repl(m):
    n[0] += 1
    return f'{m.group(1)}="{m.group(2)}?v={ver}"'
s2 = pat.sub(repl, s)
open(F, 'w', encoding='utf-8').write(s2)
print(f'cache-bust v{ver} su {n[0]} asset di app.html')
