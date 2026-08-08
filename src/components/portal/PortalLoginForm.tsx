'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput } from '@/components/form/inputs'

export function PortalLoginForm({ initialError = null }: { initialError?: string | null }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(initialError)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/portal/instant-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Unable to sign in. Please try again.')
      router.push('/portal')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.')
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
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="flex items-start gap-2 text-xs text-white/40 mt-6">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold/60" />
          You must have completed a client intake for this email to access your portal. (Temporary: email
          verification is disabled for now — this signs you in immediately.)
        </p>
      </div>
    </div>
  )
}
