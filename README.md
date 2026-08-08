# Soulstys Meridian Wellness

A luxury client-experience website for HRT (hormone replacement therapy) and peptide therapy concierge programs, built with Next.js, React, and Tailwind CSS.

Soulstys Meridian Wellness is a client experience and care-coordination company — it is not a healthcare provider. All clinical evaluation, prescribing, and treatment are delivered by an independent, licensed healthcare partner. This site focuses on client intake, program tracking, and communication.

## Features

- Interactive peptide & hormone protocol catalogue with disclaimers (filterable by Hormone Therapy / Peptide Therapy)
- Multi-step client intake & symptom quiz with a paid intake fee (Stripe Checkout), saved to Supabase after a verified payment
- Client platform overview (intake, tracking, communication, partner model)
- Client portal with secure messaging and personal info management (demo auth)
- Consultation booking page, saved to Supabase

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

Without `STRIPE_SECRET_KEY` or the Supabase variables set, the affected features show a friendly inline error instead of crashing — the rest of the site works normally.

When deploying on Vercel, add these as Project Environment Variables (Settings → Environment Variables) rather than committing them.

## Database Setup (Supabase)

This project stores two things in Supabase, written server-side only:

- **`contact_requests`** — consultation booking form submissions
- **`intake_submissions`** — client intake form responses, saved only after the Stripe Checkout payment for that session is verified as paid

To set up a fresh Supabase project:

1. Open your project's **SQL Editor** in the Supabase dashboard.
2. Paste and run the contents of [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql). This creates both tables with Row Level Security enabled and no public policies — the tables are only reachable using the service role key from server-side code, never from the browser.
3. Copy your project URL and service role key into `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (see above).

If you use the Supabase CLI instead, `supabase db push` will apply the same migration file from the `supabase/migrations` directory.

## Build

```bash
npm run build
npm run start
```

## Deployment

This is a standard Next.js (App Router) project — it deploys on Vercel with zero configuration using the default Next.js framework preset. Remember to add the Stripe and Supabase environment variables in the Vercel dashboard before going live.

## Disclaimer

This site is a design/demo project. The client portal still uses demo (non-persisted) authentication and mock data — only the intake and contact forms write real records to Supabase. Stripe Checkout is real and will process live charges once `STRIPE_SECRET_KEY` is set to a live key.
