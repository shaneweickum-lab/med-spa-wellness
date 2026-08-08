-- Soulstys Meridian Wellness — appointment history & payment tracking
-- Run this in your Supabase project's SQL Editor after 0001_init.sql and
-- 0002_admin_emr.sql.
--
-- Adds a `type` to appointments so the client's initial intake shows up in
-- their appointment history alongside scheduled visits, plus a general
-- `payments` table for tracking how a client has paid — cash, card, or a
-- generic "other" bucket that can later cover a different payer/billing
-- method (e.g. insurance) without needing a schema change or that word
-- appearing anywhere in the app.

alter table public.appointments
  add column if not exists type text not null default 'follow_up'
    check (type in ('intake', 'consultation', 'follow_up', 'other'));

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid not null references public.clients(id) on delete cascade,
  amount_cents integer not null,
  currency text not null default 'usd',
  method text not null default 'card' check (method in ('card', 'cash', 'other')),
  status text not null default 'paid' check (status in ('paid', 'pending', 'refunded', 'failed')),
  description text,
  stripe_session_id text unique,
  recorded_by uuid references public.admin_profiles(id)
);

comment on table public.payments is
  'General payment history per client. "other" is a deliberately generic bucket for any future payment/billing method.';

alter table public.payments enable row level security;

create policy "Admins can manage payments" on public.payments
  for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));
