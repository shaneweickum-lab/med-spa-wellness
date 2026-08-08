'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { AdminProfile } from '@/types/admin'

const roleStyle: Record<AdminProfile['role'], string> = {
  superadmin: 'text-gold-light border-gold/40 bg-gold/10',
  admin: 'text-cerulean-light border-cerulean/40 bg-cerulean/10',
  engineer: 'text-cerulean-light border-cerulean/40 bg-cerulean/10',
  nurse: 'text-blush border-blush/40 bg-blush/10',
}

export function StaffTable({ staff, currentUserId }: { staff: AdminProfile[]; currentUserId: string }) {
  const [items, setItems] = useState(staff)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function revoke(id: string) {
    setError(null)
    setRemovingId(id)
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Unable to revoke access.')
      setItems((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to revoke access.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div>
      {error && (
        <p className="flex items-start gap-2 text-sm text-red-300 mb-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="card-panel gold-border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 uppercase text-xs tracking-wide border-b border-gold/20">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Added</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 text-white/85">{s.full_name}</td>
                <td className="px-5 py-3 text-white/70">{s.email ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${roleStyle[s.role]}`}>
                    {s.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-white/50">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  {s.id !== currentUserId && s.role !== 'superadmin' && (
                    <button
                      type="button"
                      onClick={() => revoke(s.id)}
                      disabled={removingId === s.id}
                      className="text-xs text-white/40 hover:text-red-300 transition-colors"
                    >
                      {removingId === s.id ? 'Revoking…' : 'Revoke Access'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
