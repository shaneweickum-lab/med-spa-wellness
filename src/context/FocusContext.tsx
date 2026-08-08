'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Focus = 'men' | 'women'

interface FocusContextValue {
  focus: Focus
  setFocus: (focus: Focus) => void
}

const FocusContext = createContext<FocusContextValue | undefined>(undefined)

const STORAGE_KEY = 'aetheria-focus'

export function FocusProvider({ children }: { children: ReactNode }) {
  const [focus, setFocus] = useState<Focus>('men')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Focus | null
    // One-time sync from localStorage (external system) on mount, not a derived-state loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === 'men' || stored === 'women') setFocus(stored)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, focus)
  }, [focus])

  return <FocusContext.Provider value={{ focus, setFocus }}>{children}</FocusContext.Provider>
}

export function useFocus() {
  const ctx = useContext(FocusContext)
  if (!ctx) throw new Error('useFocus must be used within a FocusProvider')
  return ctx
}
