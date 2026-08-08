'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

interface BaseProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
  className?: string
}

const variants = {
  primary:
    'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold shadow-[0_8px_30px_-8px_rgba(212,175,55,0.6)] hover:brightness-110',
  secondary: 'gold-border text-gold-light bg-white/5 hover:bg-white/10 hover:gold-border-glow',
  ghost: 'text-cerulean-light hover:text-gold-light',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

export function LinkButton({
  href,
  variant = 'primary',
  children,
  className = '',
}: BaseProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
