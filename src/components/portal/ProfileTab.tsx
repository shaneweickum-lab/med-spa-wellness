'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, TextArea } from '@/components/form/inputs'

export function ProfileTab() {
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({
    fullName: 'Jordan Ellis',
    dob: '1985-04-12',
    email: 'jordan.ellis@example.com',
    phone: '(555) 019-3345',
    address: '482 Harborview Lane, Suite 2, Coral Bay, FL',
    insuranceProvider: 'N/A — Self-Pay Concierge Membership',
    emergencyContact: 'Sam Ellis · (555) 019-9981',
    notes: '',
  })

  function update<K extends keyof typeof profile>(key: K, value: string) {
    setProfile((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  return (
    <div className="card-panel gold-border rounded-2xl p-6 md:p-8">
      <h2 className="font-display text-2xl text-gold-light mb-1">Personal Information</h2>
      <p className="text-xs text-white/40 mb-8">Keep your profile current so your care team can reach you.</p>

      <form
        className="grid md:grid-cols-2 gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          setSaved(true)
        }}
      >
        <Field label="Full Name">
          <TextInput value={profile.fullName} onChange={(e) => update('fullName', e.target.value)} />
        </Field>
        <Field label="Date of Birth">
          <TextInput type="date" value={profile.dob} onChange={(e) => update('dob', e.target.value)} />
        </Field>
        <Field label="Email Address">
          <TextInput type="email" value={profile.email} onChange={(e) => update('email', e.target.value)} />
        </Field>
        <Field label="Phone Number">
          <TextInput type="tel" value={profile.phone} onChange={(e) => update('phone', e.target.value)} />
        </Field>
        <Field label="Mailing Address" hint="Used for at-home lab kits & pharmacy shipments.">
          <TextInput value={profile.address} onChange={(e) => update('address', e.target.value)} />
        </Field>
        <Field label="Insurance / Membership">
          <TextInput
            value={profile.insuranceProvider}
            onChange={(e) => update('insuranceProvider', e.target.value)}
          />
        </Field>
        <Field label="Emergency Contact">
          <TextInput
            value={profile.emergencyContact}
            onChange={(e) => update('emergencyContact', e.target.value)}
          />
        </Field>
        <div />
        <div className="md:col-span-2">
          <Field label="Notes for your care team" hint="Optional">
            <TextArea value={profile.notes} onChange={(e) => update('notes', e.target.value)} />
          </Field>
        </div>

        <div className="md:col-span-2 flex items-center gap-4">
          <Button type="submit" variant="primary">
            Save Changes
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
