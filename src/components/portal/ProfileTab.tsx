'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldAlert,
  StickyNote,
  UserRound,
  X,
} from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, TextArea } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/types/admin'

interface ProfileFields {
  fullName: string
  dob: string
  phone: string
  address: string
  emergencyContact: string
  notes: string
}

function toFields(client: Client): ProfileFields {
  return {
    fullName: client.full_name,
    dob: client.date_of_birth ?? '',
    phone: client.phone,
    address: client.address ?? '',
    emergencyContact: client.emergency_contact ?? '',
    notes: client.additional_notes ?? '',
  }
}

export function ProfileTab({ client }: { client: Client }) {
  const [saved, setSaved] = useState(toFields(client))
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(saved)
  const [justSaved, setJustSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function update<K extends keyof ProfileFields>(key: K, value: string) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function startEditing() {
    setDraft(saved)
    setError(null)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setError(null)
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
          full_name: draft.fullName,
          date_of_birth: draft.dob || null,
          phone: draft.phone,
          address: draft.address || null,
          emergency_contact: draft.emergencyContact || null,
          additional_notes: draft.notes || null,
        })
        .eq('id', client.id)

      if (updateError) throw updateError
      setSaved(draft)
      setIsEditing(false)
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isEditing) {
    const rows = [
      { icon: UserRound, label: 'Full Name', value: saved.fullName || 'Not provided' },
      { icon: Calendar, label: 'Date of Birth', value: saved.dob || 'Not provided' },
      { icon: Mail, label: 'Email', value: client.email },
      { icon: Phone, label: 'Phone', value: saved.phone || 'Not provided' },
      { icon: MapPin, label: 'Mailing Address', value: saved.address || 'Not provided' },
      { icon: ShieldAlert, label: 'Emergency Contact', value: saved.emergencyContact || 'Not provided' },
      { icon: StickyNote, label: 'Notes for your care team', value: saved.notes || 'Not provided' },
    ]

    return (
      <div className="card-panel gold-border rounded-2xl p-6 md:p-8">
        <div className="flex items-start justify-between mb-1">
          <h2 className="font-display text-2xl text-gold-light">Personal Information</h2>
          <button
            type="button"
            onClick={startEditing}
            aria-label="Edit personal information"
            className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full gold-border text-white/60 hover:text-gold-light hover:gold-border-glow transition-colors"
          >
            <Pencil size={15} />
          </button>
        </div>
        <p className="text-xs text-white/40 mb-8">Keep your profile current so your care team can reach you.</p>

        {justSaved && (
          <p className="flex items-center gap-1.5 text-sm text-gold-light mb-6">
            <CheckCircle2 size={16} /> Saved
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="text-gold mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
                <p className="text-white/85 whitespace-pre-wrap">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card-panel gold-border rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-display text-2xl text-gold-light">Personal Information</h2>
        <button
          type="button"
          onClick={cancelEditing}
          aria-label="Cancel editing"
          className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full gold-border text-white/60 hover:text-gold-light transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <p className="text-xs text-white/40 mb-8">Keep your profile current so your care team can reach you.</p>

      <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <Field label="Full Name">
          <TextInput value={draft.fullName} onChange={(e) => update('fullName', e.target.value)} />
        </Field>
        <Field label="Date of Birth">
          <TextInput type="date" value={draft.dob} onChange={(e) => update('dob', e.target.value)} />
        </Field>
        <Field label="Email Address" hint="Contact us to change the email on file.">
          <TextInput type="email" value={client.email} disabled />
        </Field>
        <Field label="Phone Number">
          <TextInput type="tel" value={draft.phone} onChange={(e) => update('phone', e.target.value)} />
        </Field>
        <Field label="Mailing Address" hint="Used for at-home lab kits & pharmacy shipments.">
          <TextInput value={draft.address} onChange={(e) => update('address', e.target.value)} />
        </Field>
        <Field label="Emergency Contact">
          <TextInput value={draft.emergencyContact} onChange={(e) => update('emergencyContact', e.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Notes for your care team" hint="Optional">
            <TextArea value={draft.notes} onChange={(e) => update('notes', e.target.value)} />
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
          <Button type="button" variant="secondary" onClick={cancelEditing} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
