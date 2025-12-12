import {
  BarChart3,
  MessageSquare,
  Newspaper,
  TrendingUp,
  Users,
  Scale,
  Briefcase,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const analystTeam = [
  {
    icon: BarChart3,
    name: "Fundamentals Analyst",
    description:
      "Evaluates company financials and performance metrics, identifying intrinsic values and potential red flags.",
    features: ["Financial statements", "Performance metrics", "Intrinsic values", "Red flag detection"],
  },
  {
    icon: MessageSquare,
    name: "Sentiment Analyst",
    description: "Analyzes social media and public sentiment using sentiment scoring algorithms.",
    features: ["Social media analysis", "Sentiment scoring", "Public mood gauging", "Short-term signals"],
  },
  {
    icon: Newspaper,
    name: "News Analyst",
    description: "Monitors global news and macroeconomic indicators, interpreting market event impacts.",
    features: ["Global news monitoring", "Macro indicators", "Event interpretation", "Market conditions"],
  },
  {
    icon: TrendingUp,
    name: "Technical Analyst",
    description: "Utilizes technical indicators like MACD and RSI to detect patterns and forecast movements.",
    features: ["MACD & RSI", "Pattern detection", "Price forecasting", "Trend analysis"],
  },
]

const otherTeams = [
  {
    icon: Users,
    name: "Researcher Team",
    description: "Bullish and bearish researchers critically assess analyst insights through structured debates.",
    features: ["Bull vs Bear debates", "Risk vs reward balance", "Critical assessment", "Structured analysis"],
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: Scale,
    name: "Trader Agent",
    description: "Composes reports from analysts and researchers to make informed trading decisions.",
    features: ["Report synthesis", "Trade timing", "Position sizing", "Market execution"],
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    icon: ShieldCheck,
    name: "Risk Management",
    description: "Continuously evaluates portfolio risk by assessing market volatility and liquidity.",
    features: ["Volatility assessment", "Liquidity analysis", "Strategy adjustment", "Risk evaluation"],
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  {
    icon: Briefcase,
    name: "Portfolio Manager",
    description: "Final decision authority that approves or rejects transaction proposals before execution.",
    features: ["Final approval", "Transaction review", "Order execution", "Portfolio oversight"],
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
]

export function AgentsSection() {
  return (
    <section id="agents" className="border-t border-border bg-secondary/30 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Analyst Team */}
        <div className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analystTeam.map((analyst) => (
              <Card key={analyst.name} className="border-border bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                      <analyst.icon className="h-5 w-5 text-chart-1" />
                    </div>
                    <CardTitle className="text-sm text-foreground">{analyst.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3 text-xs text-muted-foreground">
                    {analyst.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1">
                    {analyst.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Flow Arrow */}
        <div className="my-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <span className="text-sm text-muted-foreground">Insights flow to</span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Other Teams */}
        <div className="grid gap-6 lg:grid-cols-2">
          {otherTeams.map((team) => (
            <Card key={team.name} className="relative overflow-hidden border-border bg-card">
              <div className={`absolute right-0 top-0 h-32 w-32 ${team.bg} blur-3xl`} />
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${team.bg}`}>
                    <team.icon className={`h-6 w-6 ${team.color}`} />
                  </div>
                  <CardTitle className="text-foreground">{team.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-muted-foreground">{team.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {team.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
