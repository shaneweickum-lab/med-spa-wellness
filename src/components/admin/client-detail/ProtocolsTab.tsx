'use client'

import { useState } from 'react'
import { Trash2, Plus, AlertTriangle } from 'lucide-react'
import { protocols as catalogue } from '@/data/protocols'
import type { ClientProtocol } from '@/types/admin'
import { Button } from '@/components/Button'
import { SelectInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'

const statusStyle: Record<ClientProtocol['status'], string> = {
  active: 'text-cerulean-light border-cerulean/40 bg-cerulean/10',
  paused: 'text-gold-light border-gold/40 bg-gold/10',
  completed: 'text-white/50 border-white/20 bg-white/5',
}

export function ProtocolsTab({
  clientId,
  protocols,
  adminId,
}: {
  clientId: string
  protocols: ClientProtocol[]
  adminId: string
}) {
  const [items, setItems] = useState(protocols)
  const [selectedProtocolId, setSelectedProtocolId] = useState(catalogue[0]?.id ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleAssign() {
    const chosen = catalogue.find((p) => p.id === selectedProtocolId)
    if (!chosen) return
    setError(null)
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('client_protocols')
        .insert({
          client_id: clientId,
          protocol_id: chosen.id,
          protocol_name: chosen.name,
          assigned_by: adminId,
        })
        .select('*')
        .single()

      if (insertError) throw insertError
      setItems((prev) => [data as ClientProtocol, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to assign protocol.')
    } finally {
      setIsSaving(false)
    }
  }

  async function updateStatus(id: string, status: ClientProtocol['status']) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    const supabase = createClient()
    await supabase.from('client_protocols').update({ status }).eq('id', id)
  }

  async function removeProtocol(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id))
    const supabase = createClient()
    await supabase.from('client_protocols').delete().eq('id', id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card-panel gold-border rounded-2xl p-6 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <label className="text-sm text-gold-light font-medium block mb-2">Assign a protocol</label>
          <SelectInput value={selectedProtocolId} onChange={(e) => setSelectedProtocolId(e.target.value)}>
            {catalogue.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.group}
              </option>
            ))}
          </SelectInput>
        </div>
        <Button variant="primary" onClick={handleAssign} disabled={isSaving}>
          <Plus size={16} /> Assign
        </Button>
      </div>

      {error && (
        <p className="flex items-start gap-2 text-sm text-red-300">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-white/50 py-10 text-center">No protocols assigned yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((p) => (
            <div key={p.id} className="card-panel gold-border rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-gold-light font-medium">{p.protocol_name}</p>
                <p className="text-xs text-white/40 mt-1">
                  Assigned {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={p.status}
                  onChange={(e) => updateStatus(p.id, e.target.value as ClientProtocol['status'])}
                  className={`rounded-full border px-3 py-1.5 text-xs capitalize bg-transparent focus:outline-none ${statusStyle[p.status]}`}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeProtocol(p.id)}
                  aria-label="Remove protocol"
                  className="text-white/40 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
