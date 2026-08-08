'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, SelectInput } from '@/components/form/inputs'

export function NewStaffForm() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'nurse' })
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Unable to create staff account.')
      setShowForm(false)
      setForm({ fullName: '', email: '', password: '', role: 'nurse' })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create staff account.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold hover:brightness-110 transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Staff Account'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-panel gold-border rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
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
          <Field label="Temporary Password" required hint="At least 8 characters. Share with them securely.">
            <TextInput
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </Field>
          <Field label="Role" required>
            <SelectInput value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="nurse">Nurse</option>
              <option value="engineer">Engineer</option>
              <option value="admin">Admin</option>
            </SelectInput>
          </Field>

          {error && (
            <p className="sm:col-span-2 flex items-start gap-2 text-sm text-red-300">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Creating…' : 'Create Account'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
