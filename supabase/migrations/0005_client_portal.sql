-- Soulstys Meridian Wellness — live client portal
-- Run this in your Supabase project's SQL Editor after 0001-0004.
--
-- Links a client's own Supabase Auth account (magic-link sign-in) to their
-- `clients` row, and adds RLS policies so a signed-in client can read/write
-- only their own data — never another client's, and never the admin-only
-- client_notes table.

alter table public.clients add column if not exists user_id uuid unique references auth.users(id);
alter table public.clients add column if not exists address text;
alter table public.clients add column if not exists emergency_contact text;
alter table public.clients add column if not exists additional_notes text;

-- Link a client record to its auth account the moment either side appears,
-- regardless of which happens first (paying for intake vs. first sign-in).

create or replace function public.link_new_auth_user_to_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.clients
  set user_id = new.id
  where email = new.email and user_id is null;
  return new;
end;
$$;

drop trigger if exists auth_users_link_client on auth.users;
create trigger auth_users_link_client
  after insert on auth.users
  for each row execute function public.link_new_auth_user_to_client();

create or replace function public.link_client_to_existing_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if new.user_id is null then
    update public.clients
    set user_id = (select id from auth.users where email = new.email limit 1)
    where id = new.id and user_id is null;
  end if;
  return new;
end;
$$;

drop trigger if exists clients_link_auth_user on public.clients;
create trigger clients_link_auth_user
  after insert or update of email on public.clients
  for each row execute function public.link_client_to_existing_auth_user();

-- Row Level Security for clients accessing their own data ------------------

create policy "Clients can view their own record" on public.clients
  for select
  using (user_id = auth.uid());

create policy "Clients can update their own record" on public.clients
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Clients can view their own protocols" on public.client_protocols
  for select
  using (client_id in (select id from public.clients where user_id = auth.uid()));

create policy "Clients can view their own appointments" on public.appointments
  for select
  using (client_id in (select id from public.clients where user_id = auth.uid()));

create policy "Clients can view their own messages" on public.client_messages
  for select
  using (client_id in (select id from public.clients where user_id = auth.uid()));

create policy "Clients can send their own messages" on public.client_messages
  for insert
  with check (
    sender = 'client'
    and client_id in (select id from public.clients where user_id = auth.uid())
  );

-- Deliberately no client-facing policy on client_notes (admin-only,
-- never shown to the client) or on payments (not surfaced in the portal).
