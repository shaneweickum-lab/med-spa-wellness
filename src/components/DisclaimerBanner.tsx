import { ShieldAlert } from 'lucide-react'

interface DisclaimerBannerProps {
  variant?: 'full' | 'compact'
  className?: string
}

export function DisclaimerBanner({ variant = 'full', className = '' }: DisclaimerBannerProps) {
  if (variant === 'compact') {
    return (
      <p className={`flex items-start gap-2 text-xs text-white/50 ${className}`}>
        <ShieldAlert size={14} className="mt-0.5 shrink-0 text-gold/70" />
        For educational purposes only, not medical advice. Soulstys Meridian Wellness does not practice
        medicine; all clinical evaluation and treatment are provided by an independent licensed healthcare
        partner.
      </p>
    )
  }
  return (
    <div className={`gold-border rounded-2xl bg-royal/20 p-5 flex gap-4 items-start ${className}`}>
      <ShieldAlert className="text-gold shrink-0 mt-1" size={22} />
      <div className="text-sm text-white/70 leading-relaxed">
        <p className="text-gold-light font-semibold mb-1">Important Notice</p>
        <p>
          Information presented here is for educational purposes only and does not constitute medical
          advice, diagnosis, or treatment. Soulstys Meridian Wellness is a client experience and care
          coordination platform — we are not a healthcare provider and do not diagnose, prescribe, or
          practice medicine. Testosterone, bio-identical hormones, and peptide therapies are prescription
          treatments made available only after clinical evaluation and approval by our independent,
          licensed healthcare partner. Individual results vary.
        </p>
      </div>
    </div>
  )
}
