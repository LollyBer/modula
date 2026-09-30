create table if not exists public.configurator_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'nuova' check (status in ('nuova','in_valutazione','archiviata')),
  company_name text not null,
  contact_name text default '', contact_email text default '', contact_phone text default '',
  configuration jsonb not null default '{}'::jsonb
);
alter table public.configurator_requests enable row level security;
create policy "public can create configurator requests" on public.configurator_requests for insert with check (true);
create policy "super admins manage configurator requests" on public.configurator_requests for all using (is_super_admin()) with check (is_super_admin());
