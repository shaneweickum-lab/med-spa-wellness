'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/Button'
import { Field, TextInput, TextArea, SelectInput } from '@/components/form/inputs'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', program: 'Hormone Therapy (HRT)', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Unable to submit your request. Please try again.')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Get Started"
        title="Book a Consultation"
        subtitle="Tell us a little about your goals and a member of our care team will reach out to schedule your consultation."
      />

      <div className="mt-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
        <div className="card-panel gold-border rounded-3xl p-6 md:p-10">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-10">
              <CheckCircle2 className="text-gold" size={48} />
              <h2 className="font-display text-3xl text-gradient-gold">Request Received</h2>
              <p className="text-white/70 max-w-md">
                Thank you, {form.name.split(' ')[0] || 'friend'}. Our concierge team will contact you within
                one business day to schedule your consultation.
              </p>
            </div>
          ) : (
            <form className="grid sm:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <Field label="Full Name" required>
                <TextInput
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
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
              <Field label="Program of Interest">
                <SelectInput
                  value={form.program}
                  onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
                >
                  <option>Hormone Therapy (HRT)</option>
                  <option>Peptide Therapy</option>
                  <option>Not Sure Yet</option>
                </SelectInput>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Tell us about your goals" hint="Optional">
                  <TextArea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  />
                </Field>
              </div>
              {error && (
                <p className="sm:col-span-2 flex items-start gap-2 text-sm text-red-300">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </p>
              )}
              <div className="sm:col-span-2">
                <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Request Consultation'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="card-panel gold-border rounded-2xl p-6">
            <h3 className="font-display text-xl text-gold-light mb-4">Visit Us</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
                123 Wellness Boulevard, Suite 400, Coral Bay, FL
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                (555) 018-2024
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                concierge@soulstysmeridian.com
              </li>
            </ul>
          </div>
          <div className="card-panel gold-border rounded-2xl p-6">
            <h3 className="font-display text-xl text-gold-light mb-2">Prefer Telehealth?</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Most consultations and follow-ups can be conducted virtually through our clinical partner.
              Learn more on our{' '}
              <Link href="/platform" className="text-gold-light underline underline-offset-2">
                Client Platform
              </Link>{' '}
              page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
