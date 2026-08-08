import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error(
      'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables to enable payments.',
    )
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey)
  }
  return stripeClient
}
