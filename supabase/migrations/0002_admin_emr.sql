-- Soulstys Meridian Wellness — admin / EMR-style portal schema
-- Run this in your Supabase project's SQL Editor after 0001_init.sql.
--
-- This adds a real client record, admin accounts (backed by Supabase Auth),
-- and the tables the admin portal (nurses + engineer) uses: notes, secure
-- messaging, assigned protocols, and scheduling.
--
-- Security model:
--   - admin_profiles rows are the allow-list for who may use the admin
--     portal. Creating a Supabase Auth user does NOT by itself grant
--     access — a matching row must also exist in admin_profiles. Insert
--     that row yourself via the SQL Editor (see instructions in README.md)
--     after creating the user in Authentication → Users.
--   - Every admin-facing table below is only readable/writable by an
--     authenticated user who has a row in admin_profiles. The public
--     anon key can do nothing with these tables.
--   - clients/intake_submissions are still also written by the
--     SUPABASE_SERVICE_ROLE_KEY from the intake payment flow, which
--     bypasses RLS entirely — that continues to work unchanged.

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('engineer', 'nurse', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.admin_profiles is
  'Allow-list of Supabase Auth users permitted to use the admin portal. Insert rows manually.';

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  date_of_birth date,
  state_of_residence text,
  status text not null default 'active' check (status in ('active', 'inactive', 'pending'))
);

comment on table public.clients is
  'Client roster. Created automatically when an intake is paid for, or manually by an admin.';

-- Link intake submissions back to the client they belong to.
alter table public.intake_submissions
  add column if not exists client_id uuid references public.clients(id);

create table if not exists public.client_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  author_id uuid references public.admin_profiles(id),
  author_name text not null,
  body text not null
);

comment on table public.client_notes is
  'Internal admin-only notes about a client. Never shown to the client.';

create table if not exists public.client_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  sender text not null check (sender in ('admin', 'client')),
  author_name text not null,
  body text not null,
  read_at timestamptz
);

comment on table public.client_messages is
  'Two-way secure messaging thread between the admin/care team and a client.';

create table if not exists public.client_protocols (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  protocol_id text not null,
  protocol_name text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  notes text,
  assigned_by uuid references public.admin_profiles(id)
);

comment on table public.client_protocols is
  'Peptide/HRT protocols curated and assigned to a specific client by an admin.';

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  admin_id uuid references public.admin_profiles(id),
  start_time timestamptz not null,
  duration_minutes int not null check (duration_minutes between 10 and 45 and duration_minutes % 5 = 0),
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  reason text
);

comment on table public.appointments is
  'Admin-scheduled appointment blocks, 10-45 minutes in 5-minute increments.';

-- Row Level Security -----------------------------------------------------

alter table public.admin_profiles enable row level security;
alter table public.clients enable row level security;
alter table public.client_notes enable row level security;
alter table public.client_messages enable row level security;
alter table public.client_protocols enable row level security;
alter table public.appointments enable row level security;

-- Admins may see their own allow-list row (used to check "am I an admin"
-- from the app). No insert/update/delete policy exists, so only the
-- service role (or you, via the SQL Editor) can grant/revoke admin access.
create policy "Admins can view their own profile" on public.admin_profiles
  for select
  using (auth.uid() = id);

-- Every other admin table: full access, but only for authenticated users
-- who have a row in admin_profiles.
create policy "Admins can manage clients" on public.clients
  for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "Admins can manage client notes" on public.client_notes
  for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "Admins can manage client messages" on public.client_messages
  for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "Admins can manage client protocols" on public.client_protocols
  for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

create policy "Admins can manage appointments" on public.appointments
  for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- Admins also need to read intake_submissions from the portal (previously
-- only reachable by the service role).
create policy "Admins can view intake submissions" on public.intake_submissions
  for select
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));
