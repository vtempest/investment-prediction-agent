"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { demoPredictionMarkets, type PredictionMarket } from "@/lib/demo-data"
import { TrendingUp, Brain, Activity, Calendar, DollarSign } from "lucide-react"

export function PredictionMarketsTab() {
  const [markets] = useState(demoPredictionMarkets)
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredMarkets = markets.filter(m =>
    filterCategory === "all" || m.category === filterCategory
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Prediction Markets Intelligence</h2>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="politics">Politics</SelectItem>
            <SelectItem value="macro">Macro</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredMarkets.map((market) => (
          <Card key={market.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{market.eventName}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{market.platform}</Badge>
                      <Badge variant="secondary" className="capitalize">{market.category}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Market Odds</div>
                    <div className="text-2xl font-bold">{(market.currentOdds * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">LLM Probability</div>
                    <div className="text-2xl font-bold text-primary">{(market.llmProbability * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Expected Edge</div>
                    <div className={`text-2xl font-bold ${market.expectedEdge >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {market.expectedEdge >= 0 ? '+' : ''}{market.expectedEdge.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Time to Resolution</div>
                    <div className="text-lg font-semibold">{market.timeToResolution}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">LLM Analysis</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{market.llmAnalysis}</p>
                </div>

                {market.correlatedTickers && market.correlatedTickers.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Correlated Assets</div>
                    <div className="flex gap-2 flex-wrap">
                      {market.correlatedTickers.map(ticker => (
                        <Badge key={ticker} variant="secondary">{ticker}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:w-64 space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Volume</div>
                  <div className="text-lg font-bold">${(market.volume / 1000000).toFixed(2)}M</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Liquidity</div>
                  <div className="text-lg font-bold">${(market.liquidity / 1000000).toFixed(2)}M</div>
                </div>
                <Button className="w-full" variant={market.expectedEdge >= 4 ? "default" : "outline"}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Trade Market
                </Button>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
