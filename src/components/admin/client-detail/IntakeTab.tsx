'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useRealtimeChannel } from '@/lib/hooks/useRealtimeChannel'
import type { IntakeSubmission } from '@/types/admin'

export function IntakeTab({ clientId, submissions }: { clientId: string; submissions: IntakeSubmission[] }) {
  const [items, setItems] = useState(submissions)

  useRealtimeChannel('intake_submissions', `client_id=eq.${clientId}`, (payload) => {
    if (payload.eventType === 'DELETE') {
      const oldId = (payload.old as { id?: string }).id
      setItems((prev) => prev.filter((s) => s.id !== oldId))
      return
    }
    const row = payload.new as IntakeSubmission
    setItems((prev) => {
      if (payload.eventType === 'UPDATE') return prev.map((s) => (s.id === row.id ? row : s))
      return prev.some((s) => s.id === row.id) ? prev : [row, ...prev]
    })
  })

  if (items.length === 0) {
    return <p className="text-white/50 py-10 text-center">No intake submission on file yet.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((s) => (
        <div key={s.id} className="card-panel gold-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 text-gold-light mb-6">
            <ShieldCheck size={18} />
            <p className="text-sm">Submitted {new Date(s.created_at).toLocaleString()}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-white/70 mb-6">
            <p><span className="text-gold-light">State: </span>{s.state_of_residence || 'Not provided'}</p>
            <p><span className="text-gold-light">Payment: </span>{s.stripe_payment_status} (${(s.intake_fee_cents / 100).toFixed(2)})</p>
            <p className="sm:col-span-2">
              <span className="text-gold-light">Conditions: </span>
              {s.conditions.length > 0 ? s.conditions.join(', ') : 'None reported'}
            </p>
            <p><span className="text-gold-light">Medications: </span>{s.medications || 'None reported'}</p>
            <p><span className="text-gold-light">Allergies: </span>{s.allergies || 'None reported'}</p>
            <p className="sm:col-span-2"><span className="text-gold-light">Goals: </span>{s.goals || 'Not specified'}</p>
          </div>

          {Object.keys(s.symptoms).length > 0 && (
            <div>
              <p className="text-gold-light text-sm font-medium mb-3">Symptom Quiz</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(s.symptoms).map(([symptom, score]) => (
                  <div key={symptom} className="flex justify-between text-sm text-white/70 gold-border rounded-lg px-3 py-2">
                    <span>{symptom}</span>
                    <span className="text-gold-light font-medium">{score}/10</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
