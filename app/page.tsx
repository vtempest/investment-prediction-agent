import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { BrokerPlatformsSection } from "@/components/landing/broker-platforms-section"
import { AgentsSection } from "@/components/landing/agents-section"
import { ArchitectureSection } from "@/components/landing/architecture-section"
import { StrategiesSection } from "@/components/landing/strategies-section"
import { SignalIndicators } from "@/components/landing/signal-indicators"
import { PredictionMarketsSection } from "@/components/landing/prediction-markets-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CTASection } from "@/components/landing/cta-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ArchitectureSection />
        <AgentsSection />
        <BrokerPlatformsSection />
        <StrategiesSection />
        <PredictionMarketsSection />
        {/* <FeaturesSection /> */}
        {/* <SignalIndicators /> */}
        <CTASection />
      </main>
    </div>
  )
}
