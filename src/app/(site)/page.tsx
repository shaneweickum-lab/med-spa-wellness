import { Hero } from '@/components/home/Hero'
import { TrustBar } from '@/components/home/TrustBar'
import { ProgramsSplit } from '@/components/home/ProgramsSplit'
import { ProcessSteps } from '@/components/home/ProcessSteps'
import { FeaturedProtocols } from '@/components/home/FeaturedProtocols'
import { PortalTeaser } from '@/components/home/PortalTeaser'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProgramsSplit />
      <ProcessSteps />
      <FeaturedProtocols />
      <PortalTeaser />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <DisclaimerBanner />
      </div>
    </>
  )
}
