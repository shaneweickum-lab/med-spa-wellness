interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'
  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span className="uppercase text-xs tracking-[0.3em] text-cerulean-light font-medium">{eyebrow}</span>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-gradient-gold leading-tight">{title}</h2>
      <div className="divider-gold w-20" />
      {subtitle && <p className="text-white/70 leading-relaxed">{subtitle}</p>}
    </div>
  )
}
