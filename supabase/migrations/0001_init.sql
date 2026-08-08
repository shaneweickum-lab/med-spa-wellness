-- Soulstys Meridian Wellness — initial schema
-- Run this in your Supabase project's SQL Editor (or via the Supabase CLI:
-- `supabase db push`) for the project at https://kpjimvatrekrryqsbuby.supabase.co
--
-- Both tables are written to exclusively by the Next.js server using the
-- SUPABASE_SERVICE_ROLE_KEY (which bypasses Row Level Security). RLS is
-- enabled with no policies, so the anon/public API key cannot read, insert,
-- update, or delete any rows — the tables are only reachable from trusted
-- server code.

create table if not exists public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  date_of_birth date,
  email text not null,
  phone text not null,
  state_of_residence text,
  conditions text[] not null default '{}',
  medications text,
  allergies text,
  goals text,
  symptoms jsonb not null default '{}'::jsonb,
  consent_acknowledged boolean not null default false,
  contact_consent boolean not null default false,
  e_signature text,
  stripe_session_id text unique not null,
  stripe_payment_status text not null,
  intake_fee_cents integer not null
);

comment on table public.intake_submissions is
  'Client intake form responses, saved only after a verified Stripe Checkout payment.';

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  program_of_interest text,
  message text
);

comment on table public.contact_requests is
  'Consultation booking / contact form submissions.';

alter table public.intake_submissions enable row level security;
alter table public.contact_requests enable row level security;

-- No policies are defined, so RLS denies all access to the anon and
-- authenticated roles by default. Only the service role (used server-side)
-- can read or write these tables.
