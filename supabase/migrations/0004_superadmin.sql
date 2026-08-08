-- Soulstys Meridian Wellness — superadmin role
-- Run this in your Supabase project's SQL Editor after 0001-0003.
--
-- Adds a 'superadmin' role that can create and revoke other admin
-- portal accounts (engineer/nurse/admin) from within the app itself,
-- instead of every account needing a manual SQL insert.

alter table public.admin_profiles drop constraint if exists admin_profiles_role_check;
alter table public.admin_profiles add constraint admin_profiles_role_check
  check (role in ('engineer', 'nurse', 'admin', 'superadmin'));

-- Denormalized copy of the auth user's email so the Staff page can display
-- it without querying auth.users directly. Populated when an account is
-- created; back-fill existing rows yourself if needed.
alter table public.admin_profiles add column if not exists email text;

-- SECURITY DEFINER so this lookup bypasses RLS on admin_profiles itself —
-- otherwise a policy on admin_profiles that queries admin_profiles would
-- recursively re-apply RLS to its own subquery.
create or replace function public.current_admin_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.admin_profiles where id = auth.uid();
$$;

-- Superadmins can see every admin account (needed to list staff), and can
-- revoke access by deleting a profile row. There is deliberately no
-- superadmin "insert" or "update" policy here — account creation goes
-- through the /api/admin/staff route using the service role key (after
-- verifying the caller is a superadmin), and promoting someone TO
-- superadmin is left as a manual SQL step (see README) so it's never a
-- one-click action from the UI.
create policy "Superadmins can view all admin profiles" on public.admin_profiles
  for select
  using (public.current_admin_role() = 'superadmin');

create policy "Superadmins can remove admin profiles" on public.admin_profiles
  for delete
  using (public.current_admin_role() = 'superadmin');
