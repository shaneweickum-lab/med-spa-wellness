'use client'

import { useState } from 'react'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, SelectInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'
import type { Payment } from '@/types/admin'

const methodLabel: Record<Payment['method'], string> = {
  card: 'Card',
  cash: 'Cash',
  other: 'Other',
}

const statusStyle: Record<Payment['status'], string> = {
  paid: 'text-cerulean-light border-cerulean/40 bg-cerulean/10',
  pending: 'text-gold-light border-gold/40 bg-gold/10',
  refunded: 'text-white/50 border-white/20 bg-white/5',
  failed: 'text-red-300 border-red-400/30 bg-red-500/10',
}

export function PaymentsTab({ clientId, payments, adminId }: { clientId: string; payments: Payment[]; adminId: string }) {
  const [items, setItems] = useState(
    [...payments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    method: 'cash' as Payment['method'],
    status: 'paid' as Payment['status'],
    description: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const total = items.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount_cents, 0)

  async function handleSubmit() {
    setError(null)
    const amountCents = Math.round(Number(form.amount) * 100)
    if (!amountCents || amountCents <= 0) {
      setError('Enter a valid amount.')
      return
    }
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('payments')
        .insert({
          client_id: clientId,
          amount_cents: amountCents,
          method: form.method,
          status: form.status,
          description: form.description || null,
          recorded_by: adminId || null,
        })
        .select('*')
        .single()

      if (insertError) throw insertError
      setItems((prev) =>
        [data as Payment, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      )
      setShowForm(false)
      setForm({ amount: '', method: 'cash', status: 'paid', description: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to record payment.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">
          Total paid: <span className="text-gold-light font-medium">${(total / 100).toFixed(2)}</span>
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold hover:brightness-110 transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Record Payment'}
        </button>
      </div>

      {showForm && (
        <div className="card-panel gold-border rounded-2xl p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Amount (USD)" required>
              <TextInput
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
              />
            </Field>
            <Field label="Method">
              <SelectInput value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as Payment['method'] }))}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="other">Other</option>
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Payment['status'] }))}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </SelectInput>
            </Field>
            <Field label="Description" hint="Optional">
              <TextInput
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="e.g. Protocol refill"
              />
            </Field>
          </div>

          {error && (
            <p className="flex items-start gap-2 text-sm text-red-300 mt-4">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          <Button variant="primary" className="mt-5" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Payment'}
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-white/50 py-10 text-center">No payments recorded yet.</p>
      ) : (
        <div className="card-panel gold-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 uppercase text-xs tracking-wide border-b border-gold/20">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Method</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 text-white/70">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-white/70">{p.description || '—'}</td>
                  <td className="px-5 py-3 text-white/70">{methodLabel[p.method]}</td>
                  <td className="px-5 py-3 text-gold-light">${(p.amount_cents / 100).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyle[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
