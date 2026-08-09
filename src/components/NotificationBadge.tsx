export function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet text-[11px] font-bold leading-none">
      {count > 9 ? '9+' : count}
    </span>
  )
}
