-- ============================================================================
-- MODULA · COCKPIT SUPER-ADMIN  (migrazione additiva, idempotente)
-- ----------------------------------------------------------------------------
-- Aggiunge alla console admin/ la gestione clienti: contatti, piano/pagamenti,
-- statistiche d'uso. Da incollare UNA VOLTA in Supabase → SQL Editor → Run.
-- Sicuro da ri-eseguire. Richiede lo schema multi-tenant gia' presente.
-- ============================================================================

-- 1) Tabella PRIVATA di gestione (SOLO super-admin la vede: contatti, note, pagamenti).
--    Separata da `tenants` apposta: il titolare cliente NON deve leggere queste righe.
create table if not exists tenant_admin (
  tenant_id      uuid primary key references tenants(id) on delete cascade,
  contact_person text default '',
  contact_email  text default '',
  contact_phone  text default '',
  notes          text default '',
  plan_price     numeric,                       -- canone CHF/mese concordato
  plan_period    text default 'monthly',        -- monthly | annual
  plan_due       date,                           -- prossima scadenza/rinnovo
  payment_status text default 'in_regola',       -- in_regola | insoluto | sospeso
  updated_at     timestamptz default now()
);

alter table tenant_admin enable row level security;
drop policy if exists tenant_admin_sa on tenant_admin;
create policy tenant_admin_sa on tenant_admin for all
  using (is_super_admin()) with check (is_super_admin());

-- 2) Statistiche d'uso per azienda (solo super-admin). Una sola query per la dashboard.
create or replace function tenant_overview() returns table(
  tenant_id uuid,
  employees_active     int,
  employees_registered int,
  clients_count        int,
  last_activity        timestamptz
) language sql stable security definer set search_path = public as $$
  select t.id,
    (select count(*)::int from employees e where e.tenant_id = t.id and e.active),
    (select count(*)::int from employees e where e.tenant_id = t.id and e.user_id is not null),
    (select count(*)::int from clients c where c.tenant_id = t.id),
    greatest(
      (select max(created_at) from clients      where tenant_id = t.id),
      (select max(created_at) from maintenances where tenant_id = t.id),
      (select max(created_at) from appointments where tenant_id = t.id),
      (select max(created_at) from notes        where tenant_id = t.id)
    )
  from tenants t
  where is_super_admin();   -- se non sei super-admin, non torna nulla
$$;

-- ============================================================================
-- FATTO. Ora la console admin/ mostra contatti, piano/pagamenti e statistiche.
-- ============================================================================
