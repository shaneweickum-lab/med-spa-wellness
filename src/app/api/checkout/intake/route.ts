import { NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import { INTAKE_FEE_CENTS } from '@/lib/pricing'

export async function POST(req: Request) {
  let body: { name?: string; email?: string; phone?: string; focus?: string } = {}
  try {
    body = await req.json()
  } catch {
    // no body provided — proceed with empty metadata
  }

  const origin = req.headers.get('origin') ?? new URL(req.url).origin

  try {
    const stripe = getStripeClient()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: INTAKE_FEE_CENTS,
            product_data: {
              name: 'Soulstys Meridian Wellness — Client Intake & Consultation Fee',
              description:
                'One-time fee to process your client intake and schedule your consultation with our clinical partner.',
            },
          },
        },
      ],
      customer_email: body.email || undefined,
      metadata: {
        name: body.name ?? '',
        phone: body.phone ?? '',
        program: body.focus ?? '',
      },
      success_url: `${origin}/intake?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/intake?payment=cancelled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to start checkout.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
