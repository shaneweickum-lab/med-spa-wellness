# Soulstys Meridian Wellness

A luxury client-experience website for HRT (hormone replacement therapy) and peptide therapy concierge programs, built with Next.js, React, and Tailwind CSS.

Soulstys Meridian Wellness is a client experience and care-coordination company — it is not a healthcare provider. All clinical evaluation, prescribing, and treatment are delivered by an independent, licensed healthcare partner. This site focuses on client intake, program tracking, and communication.

## Features

- Interactive peptide & hormone protocol catalogue with disclaimers (filterable by Hormone Therapy / Peptide Therapy)
- Multi-step client intake & symptom quiz with a paid intake fee (Stripe Checkout), saved to Supabase after a verified payment
- Client platform overview (intake, tracking, communication, partner model)
- **Client portal** (`/portal`) — real Supabase Auth (email + password, chosen at intake), with live Overview, secure two-way Messages, and an editable Personal Info tab, all backed by the client's own account
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
5. [`supabase/migrations/0005_client_portal.sql`](./supabase/migrations/0005_client_portal.sql) — links a client's own Supabase Auth account to their `clients` row (via a `user_id` column and two triggers, so linking works regardless of whether they pay for intake or sign in first), adds `address` / `emergency_contact` / `additional_notes` columns, and adds RLS policies letting a signed-in client read/write only their own `clients` row, read their own `client_protocols` and `appointments`, and read/send their own `client_messages`. Deliberately does **not** expose `client_notes` (admin-only) or `payments` to clients.
6. [`supabase/migrations/0006_realtime.sql`](./supabase/migrations/0006_realtime.sql) — adds every app table to the `supabase_realtime` publication so the live updates described below actually fire (Realtime is off by default per table in Supabase). Safe to re-run.

Then copy your project URL and keys into the environment variables above.

### Real-time everywhere

Every table backing the admin and client portals — clients, intake submissions, notes, protocols, appointments, payments, messages, and staff accounts — pushes live updates to every open browser tab via [Supabase Realtime](https://supabase.com/docs/guides/realtime), not just messages. Add a client, log a payment, cancel an appointment, or send a message in one tab and it appears in any other open tab (admin or client portal, subject to the same RLS rules that already govern who can see what) without a page reload. This is implemented with a small shared hook, `src/lib/hooks/useRealtimeChannel.ts`, that every relevant tab/table component calls alongside its normal Supabase queries — it requires migration `0006_realtime.sql` to be applied, since Supabase tables aren't broadcast over Realtime by default.

### Client sign-in: email + password

Clients choose a portal password (min. 8 characters) as part of intake (`src/components/intake/IntakeForm.tsx`, Personal Info step). Whichever route finalizes their intake — the real Stripe-verified `POST /api/intake/confirm` or the current testing bypass `POST /api/intake/test-submit` — calls `setClientPassword()` (`src/lib/portal/setClientPassword.ts`), which creates their Supabase Auth account with that password (`email_confirm: true`, no separate "confirm your email" link — intake itself is the verification step) or, if they already have an account (e.g. re-submitting intake), updates its password instead.

`/portal/login` (`src/components/portal/PortalLoginForm.tsx`) collects email + password and signs in directly via `supabase.auth.signInWithPassword()` — no magic link, no email round-trip. This replaced an earlier temporary email-only sign-in used while the portal was still being set up; that bypass and the magic-link routes it depended on have been removed.

One transition note: a client whose account predates this change (created before intake collected a password) has no password set and can't sign in until an admin resets one for them via the Supabase dashboard (**Authentication → Users → (their account) → Reset password**) or they re-submit intake.

### ⚠️ Client intake currently bypasses Stripe (temporary, for testing)

The intake form's final step (`src/components/intake/IntakeForm.tsx`) now submits directly to `POST /api/intake/test-submit`, which writes the same `clients` / `intake_submissions` / `payments` / `appointments` records the real flow would — using a synthetic `test_<uuid>` session id and a `payments.status` of `paid` with method `other`, clearly labeled "test bypass — no real charge" in the description — **without ever calling Stripe or charging a card**.

The real Stripe flow (`POST /api/checkout/intake` → Stripe Checkout → `POST /api/intake/confirm`) is untouched and still fully functional; it's just no longer wired up to the form. This was disabled on request to make testing the intake flow faster while Stripe isn't configured/ready.

**Before accepting real clients, restore the real charge:**

1. In `src/components/intake/IntakeForm.tsx`, change `handlePayment()` back to `fetch('/api/checkout/intake', ...)` and redirect via `window.location.href = payload.url` (the previous implementation, still in git history) instead of calling `/api/intake/test-submit`.
2. Restore the original button label/copy referencing the real intake fee and Stripe (also in git history).
3. Delete `src/app/api/intake/test-submit/route.ts`.
4. Make sure `STRIPE_SECRET_KEY` is set to a live key in your production environment variables.

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

## Client Portal (`/portal`)

Real Supabase Auth, separate identity space from the admin portal — clients and admins both sign in with email + password, but as two entirely separate account systems (a client's login never grants admin access, and vice versa). See "Client sign-in: email + password" above for how the password gets set.

- **Sign in** (`/portal/login`) — email + password, the password chosen during intake.
- **No client record found**: if someone signs in with an email that never completed intake, they see a message pointing them to `/intake` instead of an empty/broken dashboard.
- **Overview** — their active protocol(s), next scheduled appointment, and completed-visit count, all pulled live (no hardcoded data). Shows a "Book an Appointment" shortcut when nothing is scheduled yet.
- **Book Appointment** — pick any open 30-minute slot, **9:00 AM–5:00 PM Eastern**, on any date. Slots already taken by any client are greyed out, so two clients can't be double-booked into the same time. A client's very first booking is automatically logged as their `intake` appointment; every one after that is a `consultation`. Backed by `GET`/`POST /api/portal/appointments`, which resolves the client from their own session server-side (never from anything the client sends) and re-checks business hours and overlap before writing.
- **Messages** — the same `client_messages` thread the admin portal's Messages tab writes to, so messages sent by either side show up for both, in real time on next load.
- **Personal Info** — edit name, DOB, phone, mailing address, emergency contact, and notes for the care team. Email is read-only here (changing it would break the account-to-client link, so it's a "contact us" change instead).

Right after intake, the client is automatically signed in with the password they just chose and dropped into `/portal?welcome=1`, which opens straight to **Book Appointment** so they can pick their own first appointment time — the app no longer auto-logs a placeholder "completed" appointment at the moment of intake.

## Admin Portal (`/admin`)

An EMR-style console, separate from the public site (no marketing nav/footer) and gated by real Supabase Auth — a completely separate account system from the client portal above.

- **Clients** (`/admin/clients`) — full roster, searchable by name/email/phone. Clients are created automatically the moment someone completes and pays for intake, or can be added manually (`New Client`).
- **Client detail** (`/admin/clients/[id]`) — tabs for Overview, Intake Answers (their submitted questionnaire), Protocols (assign/manage peptide & HRT protocols from the catalogue), Appointments (full history, including whatever the client books themselves from the portal), Payments (running total + manual entry for cash/card/other), Notes (internal, never shown to the client), and Messages (secure two-way thread).
- **Schedule** (`/admin/schedule`) — full Month / Week / Day calendar. Day and Week show a 12:00 AM–11:59 PM time grid with a shaded business-hours band; click an open slot in that band (or the "New Appointment" button) to book. New appointments are restricted to **9:00 AM–5:00 PM Eastern** (`America/New_York`, so it's correct across the EST/EDT switch) — enforced in the form regardless of how it was opened, not just visually. Clicking a day in Month view drills into Day view for that date. Includes the same overlap warning as before.
- **Staff** (`/admin/staff`, **superadmin only**) — create new admin/nurse/engineer accounts (sets a temporary password directly, no email step required) and revoke access for existing ones. Hidden from the nav for non-superadmins, and the route itself redirects them away if visited directly.

The moment a client's paid intake is confirmed, the app automatically logs a `payments` row (the intake fee). The client then books their own first appointment from the portal (see "Book Appointment" above), which is what actually creates their first `appointments` row.

All non-superadmin admins (nurses, engineers, plain "admin") currently have equal, full access to client and scheduling data — the roles don't yet restrict anything among themselves. Superadmin is the one tier that unlocks something extra: managing other accounts.

## Build

```bash
npm run build
npm run start
```

## Deployment

This is a standard Next.js (App Router) project — it deploys on Vercel with zero configuration using the default Next.js framework preset. Remember to add the Stripe and Supabase environment variables in the Vercel dashboard before going live.

## Disclaimer

This site is a design/demo project for a fictional business, but the client portal, admin portal, intake/contact forms, and Stripe Checkout are all real and will write live data / process live charges once the corresponding environment variables are set to production values.
