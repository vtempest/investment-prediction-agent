"use client"

import { useState } from "react"
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
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
