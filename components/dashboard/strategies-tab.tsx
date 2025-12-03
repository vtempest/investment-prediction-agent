"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { demoStrategies } from "@/lib/demo-data"
import { Play, Pause, Settings, TrendingUp, Activity } from "lucide-react"

export function StrategiesTab() {
  const [strategies, setStrategies] = useState(demoStrategies)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{strategy.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
              </div>
              <Badge
                variant={
                  strategy.status === 'running' ? 'default' :
                  strategy.status === 'paused' ? 'secondary' : 'outline'
                }
                className="ml-2"
              >
                {strategy.status === 'running' ? <Play className="h-3 w-3 mr-1" /> :
                 strategy.status === 'paused' ? <Pause className="h-3 w-3 mr-1" /> : null}
                {strategy.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Today</div>
                <div className={`text-lg font-bold ${strategy.todayPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {strategy.todayPnL >= 0 ? '+' : ''}${Math.abs(strategy.todayPnL).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">7 Days</div>
                <div className={`text-lg font-bold ${strategy.last7DaysPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {strategy.last7DaysPnL >= 0 ? '+' : ''}${Math.abs(strategy.last7DaysPnL).toLocaleString()}
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">30 Days</div>
                <div className={`text-lg font-bold ${strategy.last30DaysPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {strategy.last30DaysPnL >= 0 ? '+' : ''}${Math.abs(strategy.last30DaysPnL).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-semibold">{strategy.winRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Markets</span>
                <span className="font-semibold">{strategy.activeMarkets}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trades Today</span>
                <span className="font-semibold">{strategy.tradesToday}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Timeframe</span>
                <span className="font-semibold">{strategy.timeframe}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Level</span>
                <Badge variant={strategy.riskLevel === 'high' ? 'destructive' : strategy.riskLevel === 'medium' ? 'default' : 'secondary'}>
                  {strategy.riskLevel}
                </Badge>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="text-xs">
                <span className="font-semibold text-green-600">Best Conditions: </span>
                <span className="text-muted-foreground">{strategy.bestConditions}</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-red-600">Avoid When: </span>
                <span className="text-muted-foreground">{strategy.avoidWhen}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button className="flex-1" variant={strategy.status === 'running' ? 'secondary' : 'default'}>
                {strategy.status === 'running' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {strategy.status === 'running' ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Backtesting Workspace</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Run Historical Backtest</h3>
                <p className="text-sm text-muted-foreground">Test strategy performance on historical data</p>
              </div>
              <Button>
                <Activity className="h-4 w-4 mr-2" />
                Start Backtest
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Strategy</div>
                <div className="font-semibold">Select...</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Time Period</div>
                <div className="font-semibold">Last 2 years</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Capital</div>
                <div className="font-semibold">$100,000</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Slippage</div>
                <div className="font-semibold">0.1%</div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-4">Recent Backtest Results</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <div className="font-medium">Momentum - 2022-2024</div>
                  <div className="text-xs text-muted-foreground">Run on Dec 1, 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-green-500 font-bold">+42.3%</div>
                  <div className="text-xs text-muted-foreground">Sharpe: 1.85</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <div className="font-medium">Mean Reversion - 2022-2024</div>
                  <div className="text-xs text-muted-foreground">Run on Nov 28, 2024</div>
                </div>
                <div className="text-right">
                  <div className="text-green-500 font-bold">+28.7%</div>
                  <div className="text-xs text-muted-foreground">Sharpe: 1.42</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
