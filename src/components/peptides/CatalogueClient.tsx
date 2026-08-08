'use client'

import { useMemo, useState } from 'react'
import { ProtocolCard } from '@/components/ProtocolCard'
import { protocols, type ProtocolModality } from '@/data/protocols'

type Filter = 'all' | ProtocolModality

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Protocols' },
  { id: 'hormone', label: 'Hormone Therapy' },
  { id: 'peptide', label: 'Peptide Therapy' },
]

export function CatalogueClient({ initialType }: { initialType: Filter }) {
  const [active, setActive] = useState<Filter>(initialType)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return protocols.filter((p) => {
      const matchesType = active === 'all' || p.modality === active
      const matchesQuery =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.group.toLowerCase().includes(query.toLowerCase())
      return matchesType && matchesQuery
    })
  }, [active, query])

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors gold-border ${
                active === f.id
                  ? 'bg-gradient-to-r from-royal to-cerulean text-white'
                  : 'bg-white/5 text-white/60 hover:text-gold-light'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search protocols..."
          className="w-full md:w-64 rounded-full gold-border bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:gold-border-glow"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/50 text-center py-20">No protocols match your search.</p>
      ) : (
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProtocolCard key={p.id} protocol={p} />
          ))}
        </div>
      )}
    </div>
  )
}
