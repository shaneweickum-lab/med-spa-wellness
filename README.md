# Soulstys Meridian Wellness

A luxury client-experience website for HRT (hormone replacement therapy) and peptide therapy concierge programs, built with Next.js, React, and Tailwind CSS.

Soulstys Meridian Wellness is a client experience and care-coordination company — it is not a healthcare provider. All clinical evaluation, prescribing, and treatment are delivered by an independent, licensed healthcare partner. This site focuses on client intake, program tracking, and communication.

## Features

- Interactive peptide & hormone protocol catalogue with disclaimers (filterable by Hormone Therapy / Peptide Therapy)
- Multi-step client intake & symptom quiz with a paid intake fee (Stripe Checkout), saved to Supabase after a verified payment
- Client platform overview (intake, tracking, communication, partner model)
- Client portal with secure messaging and personal info management (demo auth)
- Consultation booking page, saved to Supabase
- **Admin portal** (`/admin`) — an EMR-style console for staff: client roster, per-client intake answers, assigned protocols, internal notes, secure messaging, and appointment scheduling

Design tokens: dark velvet background, royal purple / cerulean blue gradients, champagne gold trim.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
| --- | --- |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (server-side only). Required for the intake checkout API route to work. |
| `NEXT_PUBLIC_INTAKE_FEE_CENTS` | The client intake fee in cents (defaults to `4900` = $49.00). Used both for the displayed price and the actual Stripe charge. |
| `SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxx.supabase.co`). |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase **service role** key (server-side only, never expose to the browser). Dashboard → Project Settings → API → Project API keys → `service_role`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Same project URL as above, exposed to the browser. Required for admin portal sign-in. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase **anon/public** key. Safe to expose — Row Level Security restricts what it can actually do. Dashboard → Project Settings → API → Project API keys → `anon` / `public`. |

Without `STRIPE_SECRET_KEY` or the Supabase variables set, the affected features show a friendly inline error instead of crashing — the rest of the site works normally.

When deploying on Vercel, add these as Project Environment Variables (Settings → Environment Variables) rather than committing them.

## Database Setup (Supabase)

Run both migrations, in order, in your Supabase project's **SQL Editor** (or via `supabase db push` if you use the CLI):

1. [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql) — `intake_submissions` and `contact_requests`. RLS enabled, no public policies; only reachable with the service role key from server-side code.
2. [`supabase/migrations/0002_admin_emr.sql`](./supabase/migrations/0002_admin_emr.sql) — the admin portal schema: `admin_profiles`, `clients`, `client_notes`, `client_messages`, `client_protocols`, `appointments`, plus a `client_id` link added to `intake_submissions`. RLS restricts every one of these tables to authenticated users who have a row in `admin_profiles`.
3. [`supabase/migrations/0003_appointments_payments.sql`](./supabase/migrations/0003_appointments_payments.sql) — adds a `type` column to `appointments` (`intake` / `consultation` / `follow_up` / `other`) and a general `payments` table (`method`: `card` / `cash` / `other`) so a client's history and billing can be tracked regardless of how they eventually pay — including a future non-card method — without that method needing to be named in the schema.
4. [`supabase/migrations/0004_superadmin.sql`](./supabase/migrations/0004_superadmin.sql) — adds a `superadmin` role and an `email` column to `admin_profiles`, plus the RLS policies a superadmin needs to list and revoke other admin accounts.

Then copy your project URL and keys into the environment variables above.

### Creating admin (staff) accounts

Creating a Supabase Auth user does **not** by itself grant admin portal access — you must also add a matching row to `admin_profiles`. This two-step process is intentional so a stray sign-up can never grant access on its own.

**Bootstrapping your first superadmin** (do this once, manually — after that, superadmins can create every other account from the Staff tab in the app):

1. In the Supabase dashboard, go to **Authentication → Users → Add user** and create your own account (email + password).
2. Copy that user's UUID from the Users table.
3. In the **SQL Editor**, run:
   ```sql
   insert into public.admin_profiles (id, full_name, email, role)
   values ('paste-the-user-uuid-here', 'Your Name', 'you@example.com', 'superadmin')
   on conflict (id) do update set role = 'superadmin';
   ```
   The `on conflict` makes this safe to re-run, and also works to promote an existing admin/nurse/engineer account to superadmin later.
4. Sign in at `/admin/login` — you'll see a **Staff** tab (superadmin-only) for creating and revoking everyone else's accounts from then on, no more manual SQL needed for regular staff.

Everyone else can be created from that Staff tab, which can grant the `engineer`, `nurse`, or `admin` roles — **not** `superadmin`. Granting superadmin is deliberately left as a manual SQL step (same query as above) so it's never a one-click action from the UI. All non-superadmin roles currently have equal, full access to client/scheduling data; `role` is stored per account so finer-grained permissions (e.g. restricting nurses from certain actions) can be added later without a schema change.

## Admin Portal (`/admin`)

An EMR-style console, separate from the public site (no marketing nav/footer) and gated by real Supabase Auth — distinct from the client portal's demo login.

- **Clients** (`/admin/clients`) — full roster, searchable by name/email/phone. Clients are created automatically the moment someone completes and pays for intake, or can be added manually (`New Client`).
- **Client detail** (`/admin/clients/[id]`) — tabs for Overview, Intake Answers (their submitted questionnaire), Protocols (assign/manage peptide & HRT protocols from the catalogue), Appointments (full history, including the initial intake logged automatically once paid), Payments (running total + manual entry for cash/card/other), Notes (internal, never shown to the client), and Messages (secure two-way thread).
- **Schedule** (`/admin/schedule`) — day view of appointments with a form to block time for a client in 10–45 minute blocks (5-minute increments), with a basic overlap warning.
- **Staff** (`/admin/staff`, **superadmin only**) — create new admin/nurse/engineer accounts (sets a temporary password directly, no email step required) and revoke access for existing ones. Hidden from the nav for non-superadmins, and the route itself redirects them away if visited directly.

The moment a client's paid intake is confirmed, the app automatically logs both a `payments` row (the intake fee) and an `appointments` row (type `intake`, marked completed) — so every client's history starts from that first touchpoint without any manual data entry.

All non-superadmin admins (nurses, engineers, plain "admin") currently have equal, full access to client and scheduling data — the roles don't yet restrict anything among themselves. Superadmin is the one tier that unlocks something extra: managing other accounts.

## Build

```bash
npm run build
npm run start
```

## Deployment

This is a standard Next.js (App Router) project — it deploys on Vercel with zero configuration using the default Next.js framework preset. Remember to add the Stripe and Supabase environment variables in the Vercel dashboard before going live.

## Disclaimer

This site is a design/demo project. The client-facing portal still uses demo (non-persisted) authentication and mock data — only the intake/contact forms and the admin portal write real records to Supabase. Stripe Checkout is real and will process live charges once `STRIPE_SECRET_KEY` is set to a live key.
