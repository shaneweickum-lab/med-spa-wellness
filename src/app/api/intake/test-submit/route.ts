import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { INTAKE_FEE_CENTS } from '@/lib/pricing'

// TEMPORARY: bypasses Stripe entirely so intake can be tested without a real
// charge. Writes the exact same clients / intake_submissions / payments /
// appointments records that the real flow (checkout/intake -> intake/confirm)
// would, just with a synthetic session id and a "bypassed" payment status
// instead of a verified Stripe session. To restore real payment, point
// IntakeForm's final step back at handlePayment() (still in place, unused)
// and this route can be deleted.
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
  let body: { intake?: IntakePayload } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { intake } = body
  if (!intake) {
    return NextResponse.json({ error: 'Missing intake data.' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .upsert(
        {
          full_name: intake.fullName ?? '',
          email: intake.email ?? '',
          phone: intake.phone ?? '',
          date_of_birth: intake.dob || null,
          state_of_residence: intake.stateOfResidence || null,
        },
        { onConflict: 'email' },
      )
      .select('id')
      .single()

    if (clientError) throw clientError

    const testSessionId = `test_${crypto.randomUUID()}`

    const { data: insertedSubmissions, error } = await supabase
      .from('intake_submissions')
      .insert({
        client_id: client.id,
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
        stripe_session_id: testSessionId,
        stripe_payment_status: 'bypassed_test',
        intake_fee_cents: INTAKE_FEE_CENTS,
      })
      .select('id')

    if (error) throw error

    const isNewSubmission = (insertedSubmissions?.length ?? 0) > 0
    if (isNewSubmission) {
      try {
        await supabase.from('payments').insert({
          client_id: client.id,
          amount_cents: INTAKE_FEE_CENTS,
          method: 'other',
          status: 'paid',
          description: 'Client Intake Fee (test bypass — no real charge)',
          stripe_session_id: null,
        })

        await supabase.from('appointments').insert({
          client_id: client.id,
          start_time: new Date().toISOString(),
          duration_minutes: 30,
          status: 'completed',
          type: 'intake',
          reason: 'Initial Intake',
        })
      } catch (bookkeepingError) {
        console.error('Failed to record test intake payment/appointment history:', bookkeepingError)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to submit intake.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
