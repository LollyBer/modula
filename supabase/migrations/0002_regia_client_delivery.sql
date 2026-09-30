-- Informazioni operative della Regia TEST; visibili solo al super-admin.
alter table public.tenant_admin
  add column if not exists purchase_mode text not null default 'subscription'
    check (purchase_mode in ('subscription','license_self','license_turnkey')),
  add column if not exists app_version text not null default 'TEST 1.0.0',
  add column if not exists onboarding_status text not null default 'da_avviare'
    check (onboarding_status in ('da_avviare','in_configurazione','consegnata','attiva'));
