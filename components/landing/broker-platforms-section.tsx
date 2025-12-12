import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Globe,
  TrendingUp,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Lock,
  Smartphone,
  BarChart3,
  Wallet
} from "lucide-react"
import Link from "next/link"

export function BrokerPlatformsSection() {
  const brokers = [
    {
      name: "Alpaca",
      logo: "https://raw.githubusercontent.com/alpacahq/alpaca-mcp-server/main/assets/01-primary-alpaca-logo.png",
      description: "Commission-free API-first trading for stocks, ETFs, and crypto",
      features: [
        "Developer-friendly REST & WebSocket API",
        "Paper trading for testing",
        "Real-time market data",
        "Fractional shares support"
      ],
      assets: ["US Stocks", "ETFs", "Crypto"],
      color: "from-yellow-500 to-orange-500",
      icon: Zap,
      status: "Active",
      docs: "https://alpaca.markets"
    },
    {
      name: "Interactive Brokers",
      logo: "https://www.interactivebrokers.com/images/common/logos/ibkr/ibkr.svg",
      description: "Global institutional-grade trading with comprehensive API access",
      features: [
        "135+ markets worldwide",
        "Stocks, options, futures, FX, bonds",
        "TWS API & FIX protocol",
        "Low margin rates"
      ],
      assets: ["Global Stocks", "Options", "Futures", "FX"],
      color: "from-blue-500 to-indigo-600",
      icon: Globe,
      status: "Active",
      docs: "https://www.interactivebrokers.com/en/trading/ib-api.php"
    },
    {
      name: "Webull",
      logo: "https://wp.logos-download.com/wp-content/uploads/2022/11/Webull_Logo-700x122.png",
      description: "Modern mobile-first platform with advanced charting and API",
      features: [
        "Commission-free trading",
        "Level 2 market data",
        "Extended hours trading",
        "Social trading features"
      ],
      assets: ["US Stocks", "ETFs", "Options", "Crypto"],
      color: "from-green-500 to-emerald-600",
      icon: Smartphone,
      status: "Coming Soon",
      docs: "https://www.webull.com"
    },
    {
      name: "Robinhood",
      logo: "https://images.seeklogo.com/logo-png/41/3/robinhood-wordmark-logo-png_seeklogo-410600.png",
      description: "Popular retail platform with simple API and zero commissions",
      features: [
        "Zero-commission trades",
        "Easy-to-use interface",
        "Crypto trading included",
        "Cash management features"
      ],
      assets: ["US Stocks", "ETFs", "Options", "Crypto"],
      color: "from-pink-500 to-rose-600",
      icon: TrendingUp,
      status: "Coming Soon",
      docs: "https://robinhood.com"
    }
  ]

  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-sm">
            <Wallet className="h-3 w-3 mr-2" />
            Broker Integrations
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Connect Your Favorite
            <span className="block text-primary mt-2">Trading Platform</span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Seamlessly integrate with leading brokers for automated trading. Execute strategies
            across multiple platforms with institutional-grade APIs.
          </p>
        </div>

        {/* Broker Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-12">
          {brokers.map((broker) => (
            <Card
              key={broker.name}
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${broker.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              <div className="p-6 relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {broker.logo.startsWith('http') ? (
                        <img 
                          src={broker.logo} 
                          alt={`${broker.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-4xl">{broker.logo}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{broker.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={broker.status === "Active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {broker.status === "Active" ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                          ) : (
                            <>🚀 {broker.status}</>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <broker.icon className={`h-8 w-8 text-primary opacity-50`} />
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {broker.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {broker.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Assets */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {broker.assets.map((asset) => (
                    <Badge key={asset} variant="outline" className="text-xs">
                      {asset}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  variant={broker.status === "Active" ? "default" : "outline"}
                  className="w-full group-hover:shadow-md transition-all"
                  asChild={broker.status === "Active"}
                  disabled={broker.status !== "Active"}
                >
                  {broker.status === "Active" ? (
                    <Link href="/dashboard">
                      Connect {broker.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  ) : (
                    <>Coming Soon</>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 md:grid-cols-4 mt-12">
          {[
            {
              icon: Lock,
              title: "Secure Connections",
              desc: "Bank-level encryption for all API communications"
            },
            {
              icon: BarChart3,
              title: "Real-time Data",
              desc: "Live market data and instant order execution"
            },
            {
              icon: Zap,
              title: "Fast Execution",
              desc: "Millisecond latency for time-sensitive trades"
            },
            {
              icon: DollarSign,
              title: "Cost Effective",
              desc: "Commission-free trading on most platforms"
            }
          ].map((item) => (
            <Card key={item.title} className="p-4 text-center hover:shadow-md transition-shadow">
              <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need support for another broker?{" "}
            <Link href="mailto:support@example.com" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
