'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { TextArea } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'
import type { ClientNote } from '@/types/admin'

export function NotesTab({
  clientId,
  notes,
  adminId,
  adminName,
}: {
  clientId: string
  notes: ClientNote[]
  adminId: string
  adminName: string
}) {
  const [items, setItems] = useState(notes)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleAddNote() {
    if (!draft.trim()) return
    setError(null)
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('client_notes')
        .insert({ client_id: clientId, author_id: adminId, author_name: adminName, body: draft.trim() })
        .select('*')
        .single()

      if (insertError) throw insertError
      setItems((prev) => [data as ClientNote, ...prev])
      setDraft('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save note.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card-panel gold-border rounded-2xl p-6">
        <label className="text-sm text-gold-light font-medium block mb-2">Add an internal note</label>
        <TextArea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Not visible to the client…" />
        {error && (
          <p className="flex items-start gap-2 text-sm text-red-300 mt-3">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}
        <Button variant="primary" className="mt-4" onClick={handleAddNote} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Add Note'}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-white/50 py-10 text-center">No notes yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((n) => (
            <div key={n.id} className="card-panel gold-border rounded-2xl p-5">
              <p className="text-xs text-gold-light font-medium mb-2">
                {n.author_name} &middot; {new Date(n.created_at).toLocaleString()}
              </p>
              <p className="text-white/80 text-sm whitespace-pre-wrap">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
