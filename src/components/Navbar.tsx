'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LinkButton } from './Button'

const links = [
  { href: '/', label: 'Home' },
  { href: '/peptides', label: 'Protocols' },
  { href: '/intake', label: 'Client Intake' },
  { href: '/platform', label: 'Client Platform' },
  { href: '/portal', label: 'Client Portal' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-velvet/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <Image src="/images/logo-mark.png" alt="" width={913} height={1037} className="h-9 w-auto" priority />
          <span className="font-display text-xl md:text-2xl tracking-[0.1em] md:tracking-[0.12em] text-gradient-gold whitespace-nowrap">
            SOULSTYS <span className="hidden sm:inline">MERIDIAN</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  active ? 'text-gold-light' : 'text-white/70 hover:text-gold-light'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="/contact" variant="primary" className="text-xs">
            Book Consultation
          </LinkButton>
        </div>

        <button
          type="button"
          className="lg:hidden text-gold-light"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-gold/20 bg-velvet px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm tracking-wide ${
                pathname === link.href ? 'text-gold-light' : 'text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LinkButton href="/contact" variant="primary" className="text-xs mt-2 w-fit">
            Book Consultation
          </LinkButton>
        </nav>
      )}
    </header>
  )
}
