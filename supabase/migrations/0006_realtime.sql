-- Soulstys Meridian Wellness — enable Realtime
-- Run this in your Supabase project's SQL Editor after 0001-0005.
--
-- Adds every table the app reads to the `supabase_realtime` publication so
-- INSERT/UPDATE/DELETE changes are pushed live to subscribed clients (both
-- the admin portal and the client portal use `.on('postgres_changes', ...)`
-- subscriptions gated by the same RLS policies as a normal select).
--
-- Wrapped in DO blocks so this is safe to re-run — `alter publication ...
-- add table` errors if the table is already a member.

do $$
begin
  execute 'alter publication supabase_realtime add table public.clients';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.intake_submissions';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.contact_requests';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.client_notes';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.client_messages';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.client_protocols';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.appointments';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.payments';
exception when duplicate_object then null;
end $$;

do $$
begin
  execute 'alter publication supabase_realtime add table public.admin_profiles';
exception when duplicate_object then null;
end $$;
