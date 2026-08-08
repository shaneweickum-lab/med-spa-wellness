'use client'

import { useState } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput } from '@/components/form/inputs'

export function PortalLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            onLogin()
          }}
        >
          <Field label="Email Address" required>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field label="Password" required>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>
          <Button type="submit" variant="primary" className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <p className="flex items-start gap-2 text-xs text-white/40 mt-6">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold/60" />
          Demo mode: any email &amp; password will sign you in. No real credentials or health data are
          transmitted.
        </p>
      </div>
    </div>
  )
}
