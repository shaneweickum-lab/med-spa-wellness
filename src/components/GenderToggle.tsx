'use client'

import { useFocus } from '@/context/FocusContext'

export function GenderToggle({ className = '' }: { className?: string }) {
  const { focus, setFocus } = useFocus()

  return (
    <div
      className={`relative inline-flex items-center gold-border rounded-full bg-white/5 p-1 text-sm ${className}`}
      role="group"
      aria-label="Choose your protocol focus"
    >
      <span
        className="absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-royal to-cerulean transition-transform duration-300 ease-out"
        style={{ transform: focus === 'men' ? 'translateX(0%)' : 'translateX(100%)' }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => setFocus('men')}
        className={`relative z-10 px-5 py-2 rounded-full font-medium tracking-wide transition-colors w-1/2 ${
          focus === 'men' ? 'text-white' : 'text-white/50 hover:text-white/80'
        }`}
        aria-pressed={focus === 'men'}
      >
        Men&rsquo;s Performance
      </button>
      <button
        type="button"
        onClick={() => setFocus('women')}
        className={`relative z-10 px-5 py-2 rounded-full font-medium tracking-wide transition-colors w-1/2 ${
          focus === 'women' ? 'text-white' : 'text-white/50 hover:text-white/80'
        }`}
        aria-pressed={focus === 'women'}
      >
        Women&rsquo;s Hormones
      </button>
    </div>
  )
}
