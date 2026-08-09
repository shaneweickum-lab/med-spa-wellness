import { NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { INTAKE_FEE_CENTS } from '@/lib/pricing'
import { setClientPassword } from '@/lib/portal/setClientPassword'

interface IntakePayload {
  fullName?: string
  dob?: string
  email?: string
  phone?: string
  password?: string
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
    const email = (intake.email ?? '').trim().toLowerCase()

    // Create the client record (or refresh it) the moment an intake is paid for,
    // so the admin portal's client roster stays in sync automatically.
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .upsert(
        {
          full_name: intake.fullName ?? '',
          email,
          phone: intake.phone ?? '',
          date_of_birth: intake.dob || null,
          state_of_residence: intake.stateOfResidence || null,
        },
        { onConflict: 'email' },
      )
      .select('id')
      .single()

    if (clientError) throw clientError

    if (intake.password && intake.password.length >= 8) {
      try {
        await setClientPassword(supabase, email, intake.password)
      } catch (passwordError) {
        // The payment already succeeded — don't fail the confirmation over the
        // client's portal login. They can still be granted access manually.
        console.error('Failed to set client portal password:', passwordError)
      }
    }

    const { data: insertedSubmissions, error } = await supabase
      .from('intake_submissions')
      .upsert(
        {
          client_id: client.id,
          full_name: intake.fullName ?? '',
          date_of_birth: intake.dob || null,
          email,
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
      .select('id')

    if (error) throw error

    // ignoreDuplicates means a re-confirmed session (e.g. a page refresh) returns
    // no row here — only log the payment & initial appointment once, the first time.
    const isNewSubmission = (insertedSubmissions?.length ?? 0) > 0
    if (isNewSubmission) {
      try {
        await supabase.from('payments').upsert(
          {
            client_id: client.id,
            amount_cents: INTAKE_FEE_CENTS,
            method: 'card',
            status: 'paid',
            description: 'Client Intake Fee',
            stripe_session_id: session.id,
          },
          { onConflict: 'stripe_session_id', ignoreDuplicates: true },
        )

        await supabase.from('appointments').insert({
          client_id: client.id,
          start_time: new Date().toISOString(),
          duration_minutes: 30,
          status: 'completed',
          type: 'intake',
          reason: 'Initial Intake',
        })
      } catch (bookkeepingError) {
        // The client's intake and payment already succeeded — don't fail the
        // request over these secondary admin-history records.
        console.error('Failed to record intake payment/appointment history:', bookkeepingError)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to confirm intake submission.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
