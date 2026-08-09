'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'

export function PortalLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw new Error('Incorrect email or password.')
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
          <Image
            src="/images/logo-mark.png"
            alt="Soulstys Meridian Wellness"
            width={913}
            height={1037}
            className="h-16 w-auto mb-1"
            priority
          />
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

          <Field label="Password" required>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
          You must have completed a client intake to have a portal password. If you&rsquo;ve forgotten
          yours, contact us at concierge@soulstysmeridian.com.
        </p>
      </div>
    </div>
  )
}
