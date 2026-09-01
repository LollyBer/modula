-- ============================================================================
-- MODULA · SCHEMA MULTI-TENANT (canonico)
-- ----------------------------------------------------------------------------
-- UNA sola app, UN solo database Supabase, TANTE aziende (tenant).
--   · ogni azienda = una riga in `tenants` (nome, logo, accento, moduli attivi)
--   · ogni riga dati ha `tenant_id`, stampato in automatico da un trigger
--   · RLS: ogni azienda vede solo i SUOI dati; il super-admin (tu) vede tutto
--   · gli account si creano col sistema di inviti gia' esistente nell'app
--
-- COME USARLO:
--   1. Crea UN progetto Supabase (uno solo, per sempre).
--   2. SQL Editor → incolla TUTTO questo file → Run.
--   3. Copia Project URL + anon key in core/config.js.
--   4. Registrati nell'app, poi esegui  select bootstrap_super_admin();  (vedi in fondo)
--      → diventi il super-admin. Da li' crei le aziende.
--
-- Idempotente: si puo' ri-eseguire senza rompere nulla.
-- ============================================================================

-- ───────────────────────── 1. TENANT (le aziende) ─────────────────────────
create table if not exists tenants (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  tagline     text default '',
  logo        text default '',
  accent      text default '#34D399',
  modules     jsonb not null default '["hub","cal","notes","notif"]'::jsonb,  -- moduli attivi per questa azienda
  max_employees int not null default 4,  -- posti dipendente del piano (titolare incluso); il super-admin lo alza quando il cliente paga per piu' utenti
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
-- per i database gia' creati prima di questa colonna (idempotente):
alter table tenants add column if not exists max_employees int not null default 4;

-- ───────────────────── 2. SUPER-ADMIN (tu, il creatore) ────────────────────
create table if not exists super_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ─────────────────── 3. TABELLE DATI (tutte con tenant_id) ──────────────────
-- (Le funzioni chiave vengono DOPO le tabelle: una funzione SQL viene validata
--  subito, quindi deve trovare le tabelle che usa già create.)
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  role text default '',
  phone text default '',
  perms jsonb default '[]'::jsonb,
  is_owner boolean default false,
  active boolean default true,
  invite_code text,
  user_id uuid references auth.users(id) on delete set null,
  day_hours numeric,       -- ore previste per giornata (per il calcolo degli straordinari)
  holiday_days numeric,    -- giorni di ferie spettanti all'anno (per il saldo residuo)
  created_at timestamptz not null default now()
);
create unique index if not exists employees_invite_code_key on employees(invite_code) where invite_code is not null;
create unique index if not exists employees_user_tenant_key on employees(user_id) where user_id is not null;
-- per i database creati prima di queste colonne (idempotente):
alter table employees add column if not exists day_hours numeric;
alter table employees add column if not exists holiday_days numeric;

-- presenze/orari: una riga = un giorno registrato per un dipendente.
-- type: lavoro | ferie | malattia | permesso | assenza | festivo
-- hours = ore lavorate (calcolate da start_t/end_t se presenti, altrimenti inserite a mano).
-- emp_id in cascade: cancellando un dipendente spariscono i suoi cartellini.
create table if not exists time_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  emp_id uuid references employees(id) on delete cascade,
  date date, type text default 'lavoro', hours numeric,
  start_t text, end_t text, break_min numeric, note text default '',
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text, phone text default '', zone text default '', "group" text default '',
  address text default '', plant text default '', pellet text default '', maintenance text default '',
  notes text default '', blocked boolean default false,
  first_name text default '', last_name text default '', street text default '', street_no text default '',
  cap text default '', town text default '', email text default '',
  lat double precision, lng double precision, geo_src text,
  created_at timestamptz not null default now()
);

create table if not exists maintenances (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text, client_id uuid, client_raw text, employee_id uuid, employees jsonb default '[]'::jsonb,
  date date, time text, status text default 'da_fare', notes text default '',
  recur int default 0, price numeric, type text, report jsonb, via text default 'manuale',
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text, client_id uuid, client_raw text, employee_id uuid, employees jsonb default '[]'::jsonb,
  date date, time text, done boolean default false, via text default 'manuale',
  created_at timestamptz not null default now()
);

create table if not exists pellet (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  client_id uuid, client_raw text, employee_id uuid, employees jsonb default '[]'::jsonb,
  qty numeric, unit text, kind text, date date, time text, status text default 'da_consegnare',
  price numeric, signature text, signed_name text default '', notes text default '', via text default 'manuale',
  created_at timestamptz not null default now()
);

create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text, client_id uuid, client_raw text, status text default 'aperto', employees jsonb default '[]'::jsonb,
  est_hours numeric, amount numeric, start_date date, due_date date, closed_date date,
  notes text default '', via text default 'manuale',
  created_at timestamptz not null default now()
);

create table if not exists site_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  site_id uuid references sites(id) on delete cascade,
  date date, text text, hours numeric, emp_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  site_id uuid references sites(id) on delete cascade,
  name text, type text, storage_path text, date date,
  created_at timestamptz not null default now()
);

-- allegati collegati direttamente a un CLIENTE (foto, file). client_id in cascade:
-- cancellando un cliente spariscono anche i suoi allegati (diritto all'oblio GDPR).
create table if not exists client_attachments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  name text, type text, storage_path text, date date,
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  text text, client_id uuid, group_id uuid, employees jsonb default '[]'::jsonb,
  date date, pinned boolean default false, archived boolean default false, via text default 'manuale',
  created_at timestamptz not null default now()
);

create table if not exists note_groups (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text, members jsonb default '[]'::jsonb
);

create table if not exists lists (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text, via text default 'manuale',
  created_at timestamptz not null default now()
);

create table if not exists list_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  list_id uuid references lists(id) on delete cascade,
  text text, done boolean default false, position int default 0
);

create table if not exists chat (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  emp_id uuid, text text, sys boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists call_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  client_id uuid, year int, called boolean default false, outcome text default '', note text default '', maint_id uuid
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  date date, category text default '', amount numeric, note text default '', site_id uuid, recur int default 0,
  created_at timestamptz not null default now()
);

create table if not exists maint_prices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  kind text, price numeric
);

-- rapportini di cantiere: un giorno · un cantiere · un operaio (ore, lavoro, materiali, foto)
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  site_id uuid references sites(id) on delete set null,
  emp_id uuid references employees(id) on delete set null,
  date date, hours numeric, start_t text, end_t text,
  work text default '', materials text default '',
  photos jsonb not null default '[]'::jsonb,
  status text default 'inviato',
  created_at timestamptz not null default now()
);

-- fatture (collegate a Conti: le pagate = entrate). QR-fattura svizzera generata lato app.
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  number text default '', date date, due_date date,
  client_id uuid references clients(id) on delete set null,
  client_name text default '', client_addr text default '',
  lines jsonb not null default '[]'::jsonb,
  vat_rate numeric default 0, notes text default '',
  status text default 'bozza', paid_date date,
  created_at timestamptz not null default now()
);

-- archivio documenti (fatture fornitori, DDT, contratti, spese...) — modulo Documenti
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  tipo text default 'fattura', fornitore text default '', vat_no text default '',
  number text default '', doc_date date, due_date date,
  amount numeric, currency text default 'CHF', category text default '',
  description text default '', pay_status text default 'da_pagare', paid_date date,
  pinned boolean default false,
  client_id uuid references clients(id) on delete set null,
  site_id uuid references sites(id) on delete set null,
  file_name text default '', storage_path text default '', mime text default '',
  created_at timestamptz not null default now()
);

create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  text text default '', done boolean default false,
  due date, time text, priority int default 0,
  client_id uuid references clients(id) on delete set null,
  employees jsonb default '[]'::jsonb,
  list_name text default '', via text default 'manuale',
  created_at timestamptz not null default now()
);

-- settings: UNA riga per azienda (non piu' id=1 globale)
create table if not exists settings (
  tenant_id uuid primary key references tenants(id) on delete cascade,
  company_name text default '', bags_per_pallet int default 70, price_per_ton numeric, price_per_bag numeric
);
-- voci del calendario configurabili per azienda (idempotente per DB gia' creati):
alter table settings add column if not exists event_types jsonb not null default '[]'::jsonb;
-- lavagna componibile (post-it + widget su tela libera) per azienda (LEGACY condivisa, mantenuta per migrazione):
alter table settings add column if not exists board jsonb not null default '[]'::jsonb;
-- lavagne PER-UTENTE: oggetto { "<emp_id>": [ ...tessere ] } → ogni amministratore ha la sua:
alter table settings add column if not exists boards jsonb not null default '{}'::jsonb;
-- punti salvati sulla mappa (magazzino, ufficio, deposito…): [{id,name,icon,lat,lng}]:
alter table settings add column if not exists places jsonb not null default '[]'::jsonb;
-- dati fatturazione azienda (ragione sociale, indirizzo, IBAN, IVA default, progressivo):
alter table settings add column if not exists billing jsonb not null default '{}'::jsonb;
-- promemoria appuntamenti: {enabled, minutesBefore, allDayTime}. Letto dalla Edge Function "reminders".
alter table settings add column if not exists reminders jsonb not null default '{}'::jsonb;

create table if not exists push_subs (
  endpoint text primary key,
  tenant_id uuid not null references tenants(id) on delete cascade,
  p256dh text, auth text, emp_id uuid, ua text,
  created_at timestamptz not null default now()
);

-- promemoria GIA' inviati (dedup): una riga per (tipo, evento). Riempita dalla Edge Function
-- "reminders" con la service_role; nessuna policy pubblica (non serve al client).
create table if not exists reminders_sent (
  kind text not null,               -- 'appointment' | 'maintenance'
  event_id uuid not null,
  tenant_id uuid references tenants(id) on delete cascade,
  sent_at timestamptz not null default now(),
  primary key (kind, event_id)
);
alter table reminders_sent enable row level security;  -- nessuna policy = accesso solo service_role

-- orario + luogo (facoltativi) per i promemoria (note) usati come eventi di calendario;
-- luogo anche su appuntamenti e manutenzioni:
alter table notes        add column if not exists time text;
alter table appointments add column if not exists place text;
alter table maintenances add column if not exists place text;
alter table notes        add column if not exists place text;
-- orario/giorno di FINE (facoltativi): lavoro con inizio e fine, anche su più giorni:
alter table appointments add column if not exists end_time text;
alter table appointments add column if not exists end_date date;
alter table maintenances add column if not exists end_time text;
alter table maintenances add column if not exists end_date date;
alter table notes        add column if not exists end_time text;
alter table notes        add column if not exists end_date date;
-- rapportino svolto da PIÙ operai (in due sullo stesso cantiere): lista emp_id oltre all'autore:
alter table reports      add column if not exists employees jsonb not null default '[]'::jsonb;

-- REGISTRO "da fatturare": ogni lavoro (manutenzione/cantiere/consegna) può essere segnato fatturato
-- (anche quando la fattura la fai fuori, es. Profix). Flag per-record, indipendente dallo stato.
alter table maintenances add column if not exists invoiced boolean not null default false;
alter table sites        add column if not exists invoiced boolean not null default false;
alter table pellet       add column if not exists invoiced boolean not null default false;
-- fatture create in-app: si possono archiviare (tolte dalla lista attiva, restano nell'Archivio)
alter table invoices     add column if not exists archived boolean not null default false;

-- ─────────────────────────── 4. FUNZIONI CHIAVE ───────────────────────────
-- tenant dell'utente loggato (letto dal suo record in employees). SECURITY DEFINER
-- per poter leggere employees ignorando la RLS (evita ricorsione infinita).
create or replace function current_tenant() returns uuid
  language sql stable security definer set search_path = public as $$
  select tenant_id from employees where user_id = auth.uid() limit 1;
$$;

create or replace function is_super_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists(select 1 from super_admins where user_id = auth.uid());
$$;

-- trigger: stampa tenant_id automaticamente su ogni insert (l'app non lo invia)
create or replace function set_tenant_id() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  if new.tenant_id is null then
    new.tenant_id := current_tenant();
  end if;
  return new;
end;
$$;

-- ──────────────── 5. TRIGGER tenant_id + INDICI su tenant_id ────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'employees','time_entries','clients','maintenances','appointments','pellet','sites','site_logs','reports','invoices','documents',
    'attachments','client_attachments','notes','note_groups','lists','list_items','chat','call_log',
    'expenses','maint_prices','push_subs','todos'
  ] loop
    execute format('drop trigger if exists trg_tenant on %I', t);
    execute format('create trigger trg_tenant before insert on %I for each row execute function set_tenant_id()', t);
    execute format('create index if not exists %I on %I(tenant_id)', t||'_tenant_idx', t);
  end loop;
end $$;

-- ─────────────────────────────── 6. RLS ───────────────────────────────────
-- Una policy "for all": ogni azienda vede/scrive solo le SUE righe; il super-admin tutto.
do $$
declare t text;
begin
  foreach t in array array[
    'tenants','employees','time_entries','clients','maintenances','appointments','pellet','sites','site_logs','reports','invoices','documents',
    'attachments','client_attachments','notes','note_groups','lists','list_items','chat','call_log',
    'expenses','maint_prices','settings','push_subs','todos'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists tenant_isolation on %I', t);
  end loop;
end $$;

-- tenants: LETTURA dal proprio tenant; CREA/MODIFICA/ELIMINA solo il super-admin.
-- Due policy separate apposta: con un'unica "for all" il DELETE valuta solo USING,
-- e un qualunque membro del tenant (anche un dipendente) potrebbe cancellare la
-- riga della propria azienda via API → perdita dati. Qui il delete resta super-admin.
drop policy if exists tenant_isolation on tenants;
drop policy if exists tenants_read on tenants;
drop policy if exists tenants_admin on tenants;
create policy tenants_read on tenants for select
  using (id = current_tenant() or is_super_admin());
create policy tenants_admin on tenants for all
  using (is_super_admin()) with check (is_super_admin());

-- tabelle dati: isolamento per tenant_id (+ super-admin)
do $$
declare t text;
begin
  foreach t in array array[
    'employees','time_entries','clients','maintenances','appointments','pellet','sites','site_logs','reports','invoices','documents',
    'attachments','client_attachments','notes','note_groups','lists','list_items','chat','call_log',
    'expenses','maint_prices','settings','push_subs','todos'
  ] loop
    execute format($p$create policy tenant_isolation on %I for all
      using (tenant_id = current_tenant() or is_super_admin())
      with check (tenant_id = current_tenant() or is_super_admin())$p$, t);
  end loop;
end $$;

-- super_admins: ognuno vede solo se' stesso (e i super-admin tra loro)
alter table super_admins enable row level security;
drop policy if exists sa_self on super_admins;
create policy sa_self on super_admins for select using (user_id = auth.uid() or is_super_admin());

-- ──────────────── 7. ONBOARDING: creare aziende e account ──────────────────
-- Il super-admin crea l'azienda + il record "titolare" e ottiene un CODICE INVITO.
-- Il titolare si registra nell'app (email+password) e inserisce il codice → e' dentro.
create or replace function create_tenant(
  p_name text, p_slug text, p_modules jsonb, p_owner_name text
) returns jsonb
  language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_code text;
begin
  if not is_super_admin() then raise exception 'Solo il super-admin puo creare aziende'; end if;
  insert into tenants(slug,name,modules) values (p_slug, p_name, coalesce(p_modules,'["hub","cal","notes","notif"]'::jsonb))
    returning id into v_tenant;
  v_code := upper(regexp_replace(p_owner_name,'[^a-zA-Z]','','g'));
  v_code := left(coalesce(nullif(v_code,''),'OWNER'),5) || '-' || upper(substr(md5(gen_random_uuid()::text),1,5));
  insert into employees(tenant_id,name,is_owner,active,invite_code)
    values (v_tenant, p_owner_name, true, true, v_code);
  insert into settings(tenant_id,company_name) values (v_tenant, p_name);
  return jsonb_build_object('tenant_id', v_tenant, 'invite_code', v_code);
end;
$$;

-- Un utente collega il proprio login a un record employee tramite il codice invito.
create or replace function claim_invite(code text) returns boolean
  language plpgsql security definer set search_path = public as $$
declare v_emp employees%rowtype;
begin
  select * into v_emp from employees where invite_code = upper(code) and user_id is null limit 1;
  if not found then return false; end if;
  update employees set user_id = auth.uid(), invite_code = null where id = v_emp.id;
  return true;
end;
$$;

-- Il titolare genera inviti per i propri dipendenti (resta dentro al suo tenant via RLS).
create or replace function create_invite(p_name text, p_perms jsonb) returns text
  language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_code text;
begin
  select tenant_id into v_tenant from employees where user_id = auth.uid() and is_owner = true limit 1;
  if v_tenant is null then raise exception 'Solo il titolare puo invitare dipendenti'; end if;
  v_code := upper(regexp_replace(p_name,'[^a-zA-Z]','','g'));
  v_code := left(coalesce(nullif(v_code,''),'USER'),5) || '-' || upper(substr(md5(gen_random_uuid()::text),1,5));
  insert into employees(tenant_id,name,active,invite_code,perms)
    values (v_tenant, p_name, true, v_code, coalesce(p_perms,'[]'::jsonb));
  return v_code;
end;
$$;

-- Il PRIMO che lo chiama (se la tabella e' vuota) diventa super-admin. Esegui una volta DOPO esserti registrato.
create or replace function bootstrap_super_admin() returns boolean
  language plpgsql security definer set search_path = public as $$
begin
  if exists(select 1 from super_admins) then return false; end if;
  insert into super_admins(user_id) values (auth.uid());
  return true;
end;
$$;

-- ─────────────────────────── 8. REALTIME ─────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'clients','maintenances','appointments','pellet','sites','site_logs','reports','invoices','documents','attachments','client_attachments',
    'notes','note_groups','lists','list_items','chat','call_log','expenses','maint_prices',
    'employees','time_entries','settings','todos'
  ] loop
    begin execute format('alter publication supabase_realtime add table %I', t);
    exception when duplicate_object then null; end;
  end loop;
end $$;

-- ──────────────────── 9. STORAGE (file: foto, allegati) ────────────────────
-- I file (foto cliente/cantiere, documenti) stanno nel bucket PRIVATO 'allegati'.
-- Isolamento per azienda: il path inizia con la cartella <tenant_id>/...
--   es.  <tenant_id>/client/<clientId>/<file>   ·   <tenant_id>/site/<siteId>/<file>
-- La policy consente a ogni azienda solo i file sotto la SUA cartella (o il super-admin).
insert into storage.buckets (id, name, public)
  values ('allegati','allegati', false)
  on conflict (id) do nothing;

drop policy if exists allegati_tenant on storage.objects;
create policy allegati_tenant on storage.objects for all to authenticated
  using ( bucket_id = 'allegati'
          and ( (storage.foldername(name))[1] = current_tenant()::text or is_super_admin() ) )
  with check ( bucket_id = 'allegati'
          and ( (storage.foldername(name))[1] = current_tenant()::text or is_super_admin() ) );

-- ─────────────── 10. COCKPIT SUPER-ADMIN (gestione clienti) ────────────────
-- Tabella PRIVATA (solo super-admin): contatti, note, piano/pagamenti del cliente.
-- Separata da `tenants` perche' il titolare cliente legge la SUA riga tenant: qui no.
create table if not exists tenant_admin (
  tenant_id      uuid primary key references tenants(id) on delete cascade,
  contact_person text default '',
  contact_email  text default '',
  contact_phone  text default '',
  notes          text default '',
  plan_price     numeric,
  plan_period    text default 'monthly',
  plan_due       date,
  payment_status text default 'in_regola',
  updated_at     timestamptz default now()
);
alter table tenant_admin enable row level security;
drop policy if exists tenant_admin_sa on tenant_admin;
create policy tenant_admin_sa on tenant_admin for all
  using (is_super_admin()) with check (is_super_admin());

-- Statistiche d'uso per azienda (solo super-admin): una query per la dashboard.
create or replace function tenant_overview() returns table(
  tenant_id uuid, employees_active int, employees_registered int,
  clients_count int, last_activity timestamptz
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
  from tenants t where is_super_admin();
$$;

-- ============================================================================
-- FATTO. Prossimo passo lato app: core/config.js con URL + anon key.
-- Per diventare super-admin: registrarsi e poi chiamare bootstrap_super_admin()
-- DALL'APP da loggati (la console super-admin lo fa con sb.rpc), NON dal SQL
-- Editor: qui auth.uid() e' vuoto. In alternativa, una volta noto l'id utente:
--     insert into super_admins(user_id) select id from auth.users where email='tua@email';
-- ============================================================================
