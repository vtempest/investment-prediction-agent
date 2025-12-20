import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { BrokerPlatformsSection } from "@/components/landing/broker-platforms-section"
import { AgentsSection } from "@/components/landing/agents-section"
import { ArchitectureSection } from "@/components/landing/architecture-section"
import { StrategiesSection } from "@/components/landing/strategies-section"
import { SignalIndicators } from "@/components/landing/signal-indicators"
import { PredictionMarketsSection } from "@/components/landing/prediction-markets-section"
import { CTASection } from "@/components/landing/cta-section"
import GlobeDemo from "@/components/globe-demo"

import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ArchitectureSection />
        <AgentsSection />
        <SignalIndicators />
        <section className="py-12 flex justify-center">
          <img
            src="https://i.imgur.com/7vXtqZ9.png"
            alt="Platform Screenshot"
            width={500}
            className="rounded-lg shadow-lg"
          />
        </section>
        <BrokerPlatformsSection />
        <PredictionMarketsSection />
        <StrategiesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
