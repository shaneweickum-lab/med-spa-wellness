'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Lock, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'
import { Field, TextInput, TextArea, CheckboxRow, ScaleField } from '@/components/form/inputs'
import { INTAKE_FEE_LABEL } from '@/lib/pricing'

interface IntakeData {
  consentAcknowledged: boolean
  contactConsent: boolean
  eSignature: string
  fullName: string
  dob: string
  email: string
  phone: string
  stateOfResidence: string
  conditions: string[]
  medications: string
  allergies: string
  goals: string
  symptoms: Record<string, number>
}

const conditionOptions = [
  'Diabetes',
  'Thyroid disorder',
  'Heart disease or high blood pressure',
  'Blood clotting disorder',
  'History of hormone-sensitive cancer',
  'None of the above',
]

const symptomOptions = [
  'Low energy / fatigue',
  'Low libido',
  'Poor sleep quality',
  'Mood or focus changes',
  'Weight changes',
  'Hot flashes / night sweats',
  'Decreased muscle mass or strength',
  'Slow recovery from exercise',
  'Skin & hair changes',
]

const steps = ['Consent', 'Personal Info', 'Health History', 'Symptom Quiz', 'Review & Pay']

const DRAFT_KEY = 'soulstys-intake-draft'

const initial: IntakeData = {
  consentAcknowledged: false,
  contactConsent: false,
  eSignature: '',
  fullName: '',
  dob: '',
  email: '',
  phone: '',
  stateOfResidence: '',
  conditions: [],
  medications: '',
  allergies: '',
  goals: '',
  symptoms: {},
}

export function IntakeForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<IntakeData>(initial)
  const [submitted, setSubmitted] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  useEffect(() => {
    const payment = searchParams.get('payment')
    if (!payment) return

    // One-time sync from external systems (the redirect URL & sessionStorage) after returning
    // from Stripe Checkout — not a derived-state loop.
    /* eslint-disable react-hooks/set-state-in-effect */
    const draft = window.sessionStorage.getItem(DRAFT_KEY)
    let restored: IntakeData | null = null
    if (draft) {
      try {
        restored = JSON.parse(draft)
        setData(restored as IntakeData)
      } catch {
        // ignore malformed draft
      }
    }

    if (payment === 'success') {
      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        setConfirmError('Missing payment confirmation details. Please contact us if you were charged.')
        return
      }
      setIsConfirming(true)
      fetch('/api/intake/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, intake: restored ?? data }),
      })
        .then(async (res) => {
          const payload = await res.json()
          if (!res.ok) throw new Error(payload.error || 'Unable to confirm your intake.')
          window.sessionStorage.removeItem(DRAFT_KEY)
          setSubmitted(true)
        })
        .catch((err) => {
          setConfirmError(
            `${err instanceof Error ? err.message : 'Unable to confirm your intake.'} (Reference: ${sessionId})`,
          )
        })
        .finally(() => setIsConfirming(false))
    } else if (payment === 'cancelled') {
      setStep(steps.length - 1)
      setPaymentError('Payment was cancelled — your responses were kept. You can try again when ready.')
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function update<K extends keyof IntakeData>(key: K, value: IntakeData[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  function toggleCondition(condition: string) {
    setData((d) => ({
      ...d,
      conditions: d.conditions.includes(condition)
        ? d.conditions.filter((c) => c !== condition)
        : [...d.conditions, condition],
    }))
  }

  const canProceed = (() => {
    if (step === 0) return data.consentAcknowledged && data.contactConsent && data.eSignature.trim().length > 1
    if (step === 1) return data.fullName && data.dob && data.email && data.phone
    return true
  })()

  // TEMPORARY: bypasses Stripe Checkout for testing — submits the intake directly to
  // /api/intake/test-submit instead of redirecting to Stripe. The real handler
  // (POST /api/checkout/intake -> Stripe -> /api/intake/confirm) is untouched and
  // still live; to restore it, swap this call back to a fetch('/api/checkout/intake')
  // that redirects to payload.url, as it was before this bypass.
  async function handlePayment() {
    setPaymentError(null)
    setIsPaying(true)
    try {
      const res = await fetch('/api/intake/test-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake: data }),
      })
      const payload = await res.json()

      if (!res.ok) {
        throw new Error(payload.error || 'Unable to submit your intake. Please try again.')
      }

      setSubmitted(true)
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsPaying(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="card-panel gold-border-glow rounded-3xl p-10 text-center flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
        <h2 className="font-display text-2xl text-gradient-gold">Confirming your payment…</h2>
        <p className="text-white/60 text-sm max-w-md">Please don&rsquo;t close this page.</p>
      </div>
    )
  }

  if (confirmError) {
    return (
      <div className="card-panel gold-border rounded-3xl p-10 text-center flex flex-col items-center gap-4">
        <AlertTriangle className="text-red-300" size={40} />
        <h2 className="font-display text-2xl text-gold-light">We couldn&rsquo;t confirm your intake</h2>
        <p className="text-white/70 max-w-lg text-sm">{confirmError}</p>
        <p className="text-white/50 max-w-lg text-xs">
          If you were charged, please contact us at concierge@soulstysmeridian.com and include the
          reference above — your payment is safe and our team can complete your intake manually.
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="card-panel gold-border-glow rounded-3xl p-10 text-center flex flex-col items-center gap-4">
        <CheckCircle2 className="text-gold" size={48} />
        <h2 className="font-display text-3xl text-gradient-gold">Intake Received</h2>
        <p className="text-white/70 max-w-lg">
          Thank you, {data.fullName.split(' ')[0] || 'friend'}. Your intake has been received. A member of
          our care team will reach out within 1 business day to schedule your evaluation with our clinical
          partner.
        </p>
        <p className="text-xs text-white/40 max-w-lg">
          Test mode: no {INTAKE_FEE_LABEL} intake fee was actually charged.
        </p>
      </div>
    )
  }

  return (
    <div className="card-panel gold-border rounded-3xl p-6 md:p-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 shrink-0">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border ${
                i < step
                  ? 'bg-gold text-velvet border-gold'
                  : i === step
                    ? 'border-gold text-gold-light'
                    : 'border-white/20 text-white/30'
              }`}
            >
              {i < step ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`text-xs whitespace-nowrap ${i === step ? 'text-gold-light' : 'text-white/40'}`}>
              {label}
            </span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-white/15" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-6">
          <DisclaimerBanner />
          <div className="gold-border rounded-2xl bg-white/5 p-5 flex gap-3 items-start">
            <Lock className="text-gold shrink-0 mt-1" size={20} />
            <p className="text-sm text-white/70 leading-relaxed">
              We collect this information to match you with the right program. It is shared only with our
              independent, licensed healthcare partner for clinical evaluation — never sold or used for
              marketing.
            </p>
          </div>
          <CheckboxRow checked={data.consentAcknowledged} onChange={(v) => update('consentAcknowledged', v)}>
            I consent to Soulstys Meridian Wellness collecting this information and sharing it with our
            independent, licensed healthcare partner for clinical evaluation.
          </CheckboxRow>
          <CheckboxRow checked={data.contactConsent} onChange={(v) => update('contactConsent', v)}>
            I consent to being contacted by phone, email, or text regarding scheduling and care
            coordination.
          </CheckboxRow>
          <Field label="Type your full name as your electronic signature" required>
            <TextInput
              value={data.eSignature}
              onChange={(e) => update('eSignature', e.target.value)}
              placeholder="Jordan A. Doe"
            />
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Full Legal Name" required>
            <TextInput value={data.fullName} onChange={(e) => update('fullName', e.target.value)} />
          </Field>
          <Field label="Date of Birth" required>
            <TextInput type="date" value={data.dob} onChange={(e) => update('dob', e.target.value)} />
          </Field>
          <Field label="Email Address" required>
            <TextInput type="email" value={data.email} onChange={(e) => update('email', e.target.value)} />
          </Field>
          <Field label="Phone Number" required>
            <TextInput type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} />
          </Field>
          <Field label="State of Residence" hint="Helps us match you with the right care options.">
            <TextInput value={data.stateOfResidence} onChange={(e) => update('stateOfResidence', e.target.value)} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <Field label="Do any of the following apply to you? Select all that apply.">
            <div className="grid sm:grid-cols-2 gap-3">
              {conditionOptions.map((c) => (
                <CheckboxRow key={c} checked={data.conditions.includes(c)} onChange={() => toggleCondition(c)}>
                  {c}
                </CheckboxRow>
              ))}
            </div>
          </Field>
          <Field label="Current medications & supplements" hint="Include dosages if known.">
            <TextArea value={data.medications} onChange={(e) => update('medications', e.target.value)} />
          </Field>
          <Field label="Known allergies">
            <TextArea value={data.allergies} onChange={(e) => update('allergies', e.target.value)} />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <p className="text-white/60 text-sm">
            Rate how much each symptom currently affects your quality of life. This helps our clinical
            partner prioritize your protocol.
          </p>
          {symptomOptions.map((s) => (
            <ScaleField
              key={s}
              label={s}
              value={data.symptoms[s] ?? 0}
              onChange={(v) => update('symptoms', { ...data.symptoms, [s]: v })}
            />
          ))}
          <Field label="What outcome matters most to you from this program?">
            <TextArea value={data.goals} onChange={(e) => update('goals', e.target.value)} />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-gold-light">
            <ShieldCheck size={20} />
            <p className="text-sm">Please review your responses before continuing to payment.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-white/70">
            <p><span className="text-gold-light">Name: </span>{data.fullName || '—'}</p>
            <p><span className="text-gold-light">DOB: </span>{data.dob || '—'}</p>
            <p><span className="text-gold-light">Email: </span>{data.email || '—'}</p>
            <p><span className="text-gold-light">Phone: </span>{data.phone || '—'}</p>
            <p className="sm:col-span-2"><span className="text-gold-light">Conditions: </span>{data.conditions.join(', ') || 'None reported'}</p>
          </div>

          <div className="gold-border rounded-2xl bg-white/5 p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-gold-light font-medium">Client Intake &amp; Consultation Fee</p>
              <p className="text-xs text-white/50 mt-1">
                A one-time fee to process your intake and schedule your evaluation with our clinical
                partner.
              </p>
            </div>
            <p className="font-display text-3xl text-gradient-gold shrink-0">{INTAKE_FEE_LABEL}</p>
          </div>

          <p className="text-xs text-white/40 -mt-2">
            Test mode: submitting below will not charge a card or open Stripe.
          </p>

          {paymentError && (
            <p className="flex items-start gap-2 text-sm text-red-300">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {paymentError}
            </p>
          )}

          <DisclaimerBanner variant="compact" />
        </div>
      )}

      <div className="flex justify-between mt-10">
        <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || isPaying}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button variant="primary" onClick={() => setStep((s) => s + 1)} disabled={!canProceed}>
            Continue
          </Button>
        ) : (
          <Button variant="primary" onClick={handlePayment} disabled={isPaying}>
            {isPaying ? 'Submitting…' : 'Submit Intake (test mode — no charge)'}
          </Button>
        )}
      </div>
    </div>
  )
}
