'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
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
      if (signInError) throw signInError
      router.push('/admin')
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
          <h1 className="font-display text-3xl text-gradient-gold">Admin Portal</h1>
          <p className="text-white/60 text-sm">Staff sign-in for the Soulstys Meridian admin console.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Field label="Email Address" required>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@soulstysmeridian.com"
              required
              autoComplete="username"
            />
          </Field>
          <Field label="Password" required>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

        <p className="text-xs text-white/40 mt-6">
          Accounts are created by an administrator. Contact the engineering team if you need access.
        </p>
      </div>
    </div>
  )
}
