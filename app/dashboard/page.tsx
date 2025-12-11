"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/dashboard/overview-tab"
import { SignalsTab } from "@/components/dashboard/signals-tab"
import { AgentsTab } from "@/components/dashboard/agents-tab"
import { StrategiesTab } from "@/components/dashboard/strategies-tab"
import { PredictionMarketsTab } from "@/components/dashboard/prediction-markets-tab"
import { CopyTradingTab } from "@/components/dashboard/copy-trading-tab"
import { RiskPortfolioTab } from "@/components/dashboard/risk-portfolio-tab"
import { ApiDataTab } from "@/components/dashboard/api-data-tab"
import { AlpacaTradingTab } from "@/components/dashboard/alpaca-trading-tab"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn } from "lucide-react"

function DashboardContent() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "overview")
  const [isInitializing, setIsInitializing] = useState(false)

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    router.push(`/dashboard?tab=${newTab}`, { scroll: false })
  }

  // Initialize portfolio on first login
  useEffect(() => {
    if (session?.user && !isPending) {
      initializePortfolio()
    }
  }, [session, isPending])

  const initializePortfolio = async () => {
    try {
      setIsInitializing(true)
      const response = await fetch('/api/user/portfolio/initialize', {
        method: 'POST',
      })

      if (!response.ok) {
        console.error('Failed to initialize portfolio')
      }
    } catch (error) {
      console.error('Error initializing portfolio:', error)
    } finally {
      setIsInitializing(false)
    }
  }

  // Show loading state
  if (isPending || isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {isInitializing ? 'Setting up your portfolio...' : 'Loading...'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isInitializing ? 'Initializing your $100,000 play money account' : 'Please wait'}
          </p>
        </Card>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <div className="mb-6">
            <LogIn className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
            <p className="text-muted-foreground">
              Sign in to access your trading dashboard with $100,000 in play money
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push('/login')}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In to Continue
            </Button>

            <p className="text-xs text-muted-foreground">
              New users automatically receive $100,000 in virtual trading capital
            </p>
          </div>
        </Card>
      </div>
    )
  }

  // Show dashboard for authenticated users
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 pt-20 lg:pt-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 gap-1 lg:grid-cols-9 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="api-data">API Data</TabsTrigger>
                <TabsTrigger value="alpaca">Alpaca Trading</TabsTrigger>
                <TabsTrigger value="signals">Signals</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="strategies">Strategies</TabsTrigger>
                <TabsTrigger value="prediction-markets">Markets</TabsTrigger>
                <TabsTrigger value="copy-trading">Copy Trading</TabsTrigger>
                <TabsTrigger value="risk">Risk & Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <OverviewTab />
              </TabsContent>

              <TabsContent value="api-data" className="space-y-6 mt-6">
                <ApiDataTab />
              </TabsContent>

              <TabsContent value="alpaca" className="space-y-6 mt-6">
                <AlpacaTradingTab />
              </TabsContent>

              <TabsContent value="signals" className="space-y-6 mt-6">
                <SignalsTab />
              </TabsContent>

              <TabsContent value="agents" className="space-y-6 mt-6">
                <AgentsTab />
              </TabsContent>

              <TabsContent value="strategies" className="space-y-6 mt-6">
                <StrategiesTab />
              </TabsContent>

              <TabsContent value="prediction-markets" className="space-y-6 mt-6">
                <PredictionMarketsTab />
              </TabsContent>

              <TabsContent value="copy-trading" className="space-y-6 mt-6">
                <CopyTradingTab />
              </TabsContent>

              <TabsContent value="risk" className="space-y-6 mt-6">
                <RiskPortfolioTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </Card>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
