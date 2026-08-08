import { CalendarClock, FlaskConical, Syringe } from 'lucide-react'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'

export function OverviewTab({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card-panel gold-border rounded-2xl p-6 md:p-8">
        <p className="text-white/60 text-sm">Welcome back,</p>
        <h2 className="font-display text-3xl text-gradient-gold">{name}</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-panel gold-border rounded-2xl p-6">
          <Syringe className="text-gold" size={24} />
          <h3 className="font-display text-lg text-gold-light mt-3">Active Protocol</h3>
          <p className="text-white/60 text-sm mt-1">CJC-1295 / Ipamorelin + TRT Maintenance</p>
          <p className="text-xs text-white/40 mt-2">Week 6 of 12</p>
        </div>
        <div className="card-panel gold-border rounded-2xl p-6">
          <CalendarClock className="text-gold" size={24} />
          <h3 className="font-display text-lg text-gold-light mt-3">Next Appointment</h3>
          <p className="text-white/60 text-sm mt-1">Telehealth Follow-up</p>
          <p className="text-xs text-white/40 mt-2">Thursday, 2:00 PM</p>
        </div>
        <div className="card-panel gold-border rounded-2xl p-6">
          <FlaskConical className="text-gold" size={24} />
          <h3 className="font-display text-lg text-gold-light mt-3">Latest Labs</h3>
          <p className="text-white/60 text-sm mt-1">Comprehensive Hormone Panel</p>
          <p className="text-xs text-white/40 mt-2">Reviewed 4 days ago</p>
        </div>
      </div>

      <DisclaimerBanner variant="compact" />
    </div>
  )
}
