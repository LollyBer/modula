#!/bin/zsh
set -eu

cd -- "${0:A:h}"
readonly TEST_REF="otseutvdqxenekldnwzy"

print "MODULA TEST — configurazione database"
print "Project ref previsto: ${TEST_REF}"
print "Verrà applicata solo la migration 0001 al nuovo progetto TEST."
print "Nessun comando fa riferimento al progetto MODULA di produzione."
print

supabase link --project-ref "${TEST_REF}"
supabase db push --linked --include-all

print
print "Setup database TEST completato."
print "Le notifiche TEST restano volutamente disattivate."
read "?Premi Invio per chiudere."
