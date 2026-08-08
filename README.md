# Soulstys Meridian Wellness

A luxury client-experience website for a TRT (testosterone replacement therapy) and BHRT (bio-identical hormone replacement therapy) concierge business, built with Next.js, React, and Tailwind CSS.

Soulstys Meridian Wellness is a client experience and care-coordination company — it is not a healthcare provider. All clinical evaluation, prescribing, and treatment are delivered by an independent, licensed healthcare partner. This site focuses on client intake, program tracking, and communication.

## Features

- Dual Men's Performance (TRT/Peptides) & Women's Hormones (BHRT/Glow) focus toggle
- Interactive peptide & hormone protocol catalogue with disclaimers
- Multi-step client intake & symptom quiz with a paid intake fee (Stripe Checkout)
- Client platform overview (intake, tracking, communication, partner model)
- Client portal with secure messaging and personal info management (demo auth)
- Consultation booking page

Design tokens: dark velvet background, royal purple / cerulean blue gradients, champagne gold trim.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Payments for the client intake fee are processed with Stripe Checkout. Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
| --- | --- |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (server-side only). Required for the intake checkout API route to work. |
| `NEXT_PUBLIC_INTAKE_FEE_CENTS` | The client intake fee in cents (defaults to `4900` = $49.00). Used both for the displayed price and the actual Stripe charge. |

Without `STRIPE_SECRET_KEY` set, the intake payment step will show a friendly error instead of crashing — the rest of the site works normally.

When deploying on Vercel, add these as Project Environment Variables (Settings → Environment Variables) rather than committing them.

## Build

```bash
npm run build
npm run start
```

## Deployment

This is a standard Next.js (App Router) project — it deploys on Vercel with zero configuration using the default Next.js framework preset. Remember to add the Stripe environment variables in the Vercel dashboard before going live.

## Disclaimer

This site is a design/demo project. Client intake data is not persisted to a backend or database — a production deployment would need a real datastore and CRM/EMR integration on the clinical partner's side. Stripe Checkout is real and will process live charges once `STRIPE_SECRET_KEY` is set to a live key.
