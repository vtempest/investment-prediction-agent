import { ArrowRight, ArrowDown } from "lucide-react"
import Image from "next/image"

const workflow = [
  { name: "Analyst Team", desc: "4 specialized analysts gather data", color: "text-chart-1", border: "border-chart-1" },
  { name: "Researcher Team", desc: "Bull vs Bear structured debates", color: "text-chart-2", border: "border-chart-2" },
  { name: "Trader Agent", desc: "Synthesizes insights for decisions", color: "text-chart-3", border: "border-chart-3" },
  {
    name: "Risk Management",
    desc: "Evaluates and adjusts strategies",
    color: "text-chart-4",
    border: "border-chart-4",
  },
  { name: "Portfolio Manager", desc: "Final approval & execution", color: "text-chart-5", border: "border-chart-5" },
]

export function ArchitectureSection() {
  return (
    <section id="workflow" className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl ">
            <Image
              src="/images/banner-trading-floor.jpeg"
              alt="AI Trading Floor with Multiple Agents"
              width={400}
              height={400}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-foreground">Intelligent Analysis</h3>
            <p className="mt-4 text-muted-foreground">
              Our AI agents analyze candlestick patterns, moving averages, and technical indicators in real-time,
              providing institutional-grade market insights.
            </p>
            <ul className="mt-6 space-y-3">
              {["Pattern Recognition", "Technical Indicators", "Sentiment Analysis", "Risk Assessment"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          {/* Desktop Flow */}
          <div className="hidden items-center justify-center gap-2 lg:flex">
            {workflow.map((step, index) => (
              <div key={step.name} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${step.border} bg-card font-mono text-lg font-bold ${step.color}`}
                  >
                    {index + 1}
                  </div>
                  <div className="mt-4 w-36 text-center">
                    <div className="font-semibold text-foreground">{step.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{step.desc}</div>
                  </div>
                </div>
                {index < workflow.length - 1 && <ArrowRight className="mx-3 h-5 w-5 text-primary" />}
              </div>
            ))}
          </div>

          {/* Mobile Flow */}
          <div className="flex flex-col gap-3 lg:hidden">
            {workflow.map((step, index) => (
              <div key={step.name}>
                <div className={`flex items-center gap-4 rounded-lg border ${step.border} bg-card p-4`}>
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${step.border} font-mono font-bold ${step.color}`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{step.name}</div>
                    <div className="text-sm text-muted-foreground">{step.desc}</div>
                  </div>
                </div>
                {index < workflow.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </section>
  )
}
