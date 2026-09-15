-- ============================================================================
-- MODULA · HARDENING RLS (security review 2026-06-30)  — idempotente
-- ----------------------------------------------------------------------------
-- FIX: la tabella `tenants` aveva un'unica policy "for all" la cui clausola
-- USING (id = current_tenant()) lasciava che un QUALSIASI membro di un'azienda
-- (anche un dipendente) potesse ELIMINARE via API la riga della propria azienda,
-- cancellando in cascata tutti i suoi dati. Cross-tenant restava isolato, ma era
-- perdita dati / autodistruzione possibile dal client.
--
-- SOLUZIONE: due policy separate — LETTURA per il proprio tenant, mentre
-- CREA/MODIFICA/ELIMINA restano solo al super-admin.
--
-- Da incollare UNA VOLTA in Supabase → SQL Editor → Run. Sicuro da ri-eseguire.
-- ============================================================================

drop policy if exists tenant_isolation on tenants;
drop policy if exists tenants_read on tenants;
drop policy if exists tenants_admin on tenants;

create policy tenants_read on tenants for select
  using (id = current_tenant() or is_super_admin());

create policy tenants_admin on tenants for all
  using (is_super_admin()) with check (is_super_admin());

-- Verifica (facoltativa): per la tabella tenants devono comparire SOLO
-- tenants_read (select) e tenants_admin (all). Esegui e controlla:
--   select policyname, cmd, qual from pg_policies
--   where schemaname='public' and tablename='tenants';
