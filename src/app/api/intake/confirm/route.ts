import { NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { INTAKE_FEE_CENTS } from '@/lib/pricing'

interface IntakePayload {
  fullName?: string
  dob?: string
  email?: string
  phone?: string
  stateOfResidence?: string
  conditions?: string[]
  medications?: string
  allergies?: string
  goals?: string
  symptoms?: Record<string, number>
  consentAcknowledged?: boolean
  contactConsent?: boolean
  eSignature?: string
}

export async function POST(req: Request) {
  let body: { sessionId?: string; intake?: IntakePayload } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { sessionId, intake } = body
  if (!sessionId || !intake) {
    return NextResponse.json({ error: 'Missing session or intake data.' }, { status: 400 })
  }

  try {
    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment has not been completed for this session.' }, { status: 402 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('intake_submissions').upsert(
      {
        full_name: intake.fullName ?? '',
        date_of_birth: intake.dob || null,
        email: intake.email ?? '',
        phone: intake.phone ?? '',
        state_of_residence: intake.stateOfResidence || null,
        conditions: intake.conditions ?? [],
        medications: intake.medications || null,
        allergies: intake.allergies || null,
        goals: intake.goals || null,
        symptoms: intake.symptoms ?? {},
        consent_acknowledged: !!intake.consentAcknowledged,
        contact_consent: !!intake.contactConsent,
        e_signature: intake.eSignature || null,
        stripe_session_id: session.id,
        stripe_payment_status: session.payment_status,
        intake_fee_cents: INTAKE_FEE_CENTS,
      },
      { onConflict: 'stripe_session_id', ignoreDuplicates: true },
    )

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to confirm intake submission.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
