'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'

export function NewClientForm() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', dob: '', state: '' })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('clients')
        .insert({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          date_of_birth: form.dob || null,
          state_of_residence: form.state || null,
        })
        .select('id')
        .single()

      if (insertError) throw insertError
      router.push(`/admin/clients/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create client.')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel gold-border rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-6 max-w-2xl">
      <Field label="Full Name" required>
        <TextInput required value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
      </Field>
      <Field label="Email Address" required>
        <TextInput
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </Field>
      <Field label="Phone Number" required>
        <TextInput
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </Field>
      <Field label="Date of Birth">
        <TextInput type="date" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} />
      </Field>
      <Field label="State of Residence">
        <TextInput value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
      </Field>

      {error && (
        <p className="md:col-span-2 flex items-start gap-2 text-sm text-red-300">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="md:col-span-2">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create Client'}
        </Button>
      </div>
    </form>
  )
}
