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
        For educational purposes only. Not medical advice. Individual results vary; all therapies require clinical evaluation.
      </p>
    )
  }
  return (
    <div className={`gold-border rounded-2xl bg-royal/20 p-5 flex gap-4 items-start ${className}`}>
      <ShieldAlert className="text-gold shrink-0 mt-1" size={22} />
      <div className="text-sm text-white/70 leading-relaxed">
        <p className="text-gold-light font-semibold mb-1">Medical Disclaimer</p>
        <p>
          Information presented here is for educational purposes only and does not constitute medical advice,
          diagnosis, or treatment. Testosterone, bio-identical hormones, and peptide therapies are prescription
          treatments available only after a comprehensive clinical evaluation, laboratory testing, and physician
          approval. Individual results vary. AETHERIA Medical Aesthetics &amp; Wellness operates under the
          supervision of licensed medical providers in accordance with applicable state and federal regulations.
        </p>
      </div>
    </div>
  )
}
