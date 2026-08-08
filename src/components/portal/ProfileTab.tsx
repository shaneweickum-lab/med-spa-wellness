'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, TextArea } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/types/admin'

export function ProfileTab({ client }: { client: Client }) {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    fullName: client.full_name,
    dob: client.date_of_birth ?? '',
    phone: client.phone,
    address: client.address ?? '',
    emergencyContact: client.emergency_contact ?? '',
    notes: client.additional_notes ?? '',
  })

  function update<K extends keyof typeof profile>(key: K, value: string) {
    setProfile((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          full_name: profile.fullName,
          date_of_birth: profile.dob || null,
          phone: profile.phone,
          address: profile.address || null,
          emergency_contact: profile.emergencyContact || null,
          additional_notes: profile.notes || null,
        })
        .eq('id', client.id)

      if (updateError) throw updateError
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card-panel gold-border rounded-2xl p-6 md:p-8">
      <h2 className="font-display text-2xl text-gold-light mb-1">Personal Information</h2>
      <p className="text-xs text-white/40 mb-8">Keep your profile current so your care team can reach you.</p>

      <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <Field label="Full Name">
          <TextInput value={profile.fullName} onChange={(e) => update('fullName', e.target.value)} />
        </Field>
        <Field label="Date of Birth">
          <TextInput type="date" value={profile.dob} onChange={(e) => update('dob', e.target.value)} />
        </Field>
        <Field label="Email Address" hint="Contact us to change the email on file.">
          <TextInput type="email" value={client.email} disabled />
        </Field>
        <Field label="Phone Number">
          <TextInput type="tel" value={profile.phone} onChange={(e) => update('phone', e.target.value)} />
        </Field>
        <Field label="Mailing Address" hint="Used for at-home lab kits & pharmacy shipments.">
          <TextInput value={profile.address} onChange={(e) => update('address', e.target.value)} />
        </Field>
        <Field label="Emergency Contact">
          <TextInput
            value={profile.emergencyContact}
            onChange={(e) => update('emergencyContact', e.target.value)}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Notes for your care team" hint="Optional">
            <TextArea value={profile.notes} onChange={(e) => update('notes', e.target.value)} />
          </Field>
        </div>

        {error && (
          <p className="md:col-span-2 flex items-start gap-2 text-sm text-red-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <div className="md:col-span-2 flex items-center gap-4">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-gold-light">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
