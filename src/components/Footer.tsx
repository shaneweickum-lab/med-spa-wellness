import Image from 'next/image'
import Link from 'next/link'
import { Camera, Globe, Phone, MapPin, Mail } from 'lucide-react'
import { DisclaimerBanner } from './DisclaimerBanner'

const columns = [
  {
    title: 'Programs',
    links: [
      { href: '/peptides?type=hormone', label: 'Hormone Therapy (HRT)' },
      { href: '/peptides?type=peptide', label: 'Peptide Therapy' },
      { href: '/peptides', label: 'Peptide Protocol Catalogue' },
    ],
  },
  {
    title: 'Care',
    links: [
      { href: '/intake', label: 'Client Intake & Quiz' },
      { href: '/platform', label: 'Client Platform' },
      { href: '/portal', label: 'Client Portal' },
    ],
  },
  {
    title: 'Practice',
    links: [
      { href: '/contact', label: 'Book a Consultation' },
      { href: '/contact', label: 'Contact Us' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-velvet">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/logo-mark.png" alt="" width={913} height={1037} className="h-10 w-auto" />
              <span className="font-display text-2xl tracking-[0.12em] text-gradient-gold">
                SOULSTYS MERIDIAN
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-sm">
              Soulstys Meridian Wellness is a concierge client experience for HRT and peptide therapy
              programs — intake, tracking, and communication, connecting you with an independent licensed
              healthcare partner for every clinical service.
            </p>
            <div className="mt-5 flex gap-4 text-white/50">
              <a href="#" aria-label="Instagram" className="hover:text-gold-light transition-colors">
                <Camera size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-gold-light transition-colors">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-gold-light text-sm font-semibold tracking-wide mb-4">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-white/60 hover:text-gold-light transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-gold-light text-sm font-semibold tracking-wide mb-4">Visit</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-gold/70 shrink-0" />
                123 Wellness Boulevard, Suite 400
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold/70 shrink-0" />
                (555) 018-2024
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold/70 shrink-0" />
                concierge@soulstysmeridian.com
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold my-10" />

        <DisclaimerBanner variant="compact" className="mb-6" />

        <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Soulstys Meridian Wellness. All rights reserved.</p>
          <p>Clinical services are provided by an independent, licensed healthcare partner.</p>
        </div>
      </div>
    </footer>
  )
}
