'use client'

import { useState } from 'react'
import { Lock, ShieldCheck, AlertTriangle, Mail } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'

export function PortalLoginForm({ initialError = null }: { initialError?: string | null }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(initialError)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/portal/auth/confirm` },
      })
      if (otpError) throw otpError
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send sign-in link. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md w-full">
      <div className="card-panel gold-border-glow rounded-3xl p-8 md:p-10">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-full gold-border flex items-center justify-center bg-white/5">
            <Lock className="text-gold" size={22} />
          </div>
          <h1 className="font-display text-3xl text-gradient-gold">Client Portal</h1>
          <p className="text-white/60 text-sm">Sign in to view messages, your profile, and care plan.</p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <Mail className="text-gold" size={32} />
            <p className="text-white/80 text-sm">
              We&rsquo;ve sent a secure sign-in link to <span className="text-gold-light">{email}</span>.
            </p>
            <p className="text-white/50 text-xs">Check your inbox (and spam folder) and click the link to continue.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Field label="Email Address" required>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </Field>

            {error && (
              <p className="flex items-start gap-2 text-sm text-red-300">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Sending link…' : 'Send Sign-In Link'}
            </Button>
          </form>
        )}

        <p className="flex items-start gap-2 text-xs text-white/40 mt-6">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold/60" />
          No password needed — we&rsquo;ll email you a secure one-time link. You must have completed a
          client intake for this email to access your portal.
        </p>
      </div>
    </div>
  )
}
