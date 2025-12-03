"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { demoPortfolio, demoStrategies, demoSignals, demoAgents } from "@/lib/demo-data"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Activity,
  Play,
  Pause,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  Clock,
  AlertCircle
} from "lucide-react"

export function OverviewTab() {
  const portfolio = demoPortfolio
  const strategies = demoStrategies
  const signals = demoSignals
  const agents = demoAgents

  const signalCounts = {
    strongBuy: signals.filter(s => s.scoreLabel === 'Strong Buy').length,
    buy: signals.filter(s => s.scoreLabel === 'Buy').length,
    hold: signals.filter(s => s.scoreLabel === 'Hold').length,
    sell: signals.filter(s => s.scoreLabel === 'Sell').length,
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Portfolio Summary</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Equity</span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">${portfolio.totalEquity.toLocaleString()}</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Daily P&L</span>
              {portfolio.dailyPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className={`text-3xl font-bold ${portfolio.dailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.dailyPnL >= 0 ? '+' : ''}${portfolio.dailyPnL.toLocaleString()}
            </div>
            <div className={`text-sm ${portfolio.dailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.dailyPnLPercent >= 0 ? '+' : ''}{portfolio.dailyPnLPercent}%
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{portfolio.winRate}%</div>
            <Progress value={portfolio.winRate} className="h-2 mt-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Open Positions</span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{portfolio.openPositions}</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-6 pt-6 border-t">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Stocks</div>
            <div className="text-xl font-bold">${portfolio.stocks.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{((portfolio.stocks / portfolio.totalEquity) * 100).toFixed(1)}% of portfolio</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Prediction Markets</div>
            <div className="text-xl font-bold">${portfolio.predictionMarkets.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{((portfolio.predictionMarkets / portfolio.totalEquity) * 100).toFixed(1)}% of portfolio</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Cash</div>
            <div className="text-xl font-bold">${portfolio.cash.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{((portfolio.cash / portfolio.totalEquity) * 100).toFixed(1)}% of portfolio</div>
          </div>
        </div>
      </Card>

      {/* Strategy Performance Panel */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Strategy Performance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="p-4 border-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{strategy.name}</h3>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
                <Badge variant={strategy.status === 'running' ? 'default' : strategy.status === 'paused' ? 'secondary' : 'outline'}>
                  {strategy.status === 'running' && <Play className="h-3 w-3 mr-1" />}
                  {strategy.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
                  {strategy.status === 'paper' && <FileText className="h-3 w-3 mr-1" />}
                  {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Today P&L</div>
                  <div className={`text-lg font-bold ${strategy.todayPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {strategy.todayPnL >= 0 ? '+' : ''}${strategy.todayPnL.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">7D P&L</div>
                  <div className={`text-lg font-bold ${strategy.last7DaysPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {strategy.last7DaysPnL >= 0 ? '+' : ''}${strategy.last7DaysPnL.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">30D P&L</div>
                  <div className={`text-lg font-bold ${strategy.last30DaysPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {strategy.last30DaysPnL >= 0 ? '+' : ''}${strategy.last30DaysPnL.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                  <div className="font-semibold">{strategy.winRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Active</div>
                  <div className="font-semibold">{strategy.activeMarkets}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Trades Today</div>
                  <div className="font-semibold">{strategy.tradesToday}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Signals Snapshot */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Signals Snapshot</h2>
          <Badge variant="outline">{signals.length} Total Signals</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="p-4 border-2 border-green-500/20 bg-green-500/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Strong Buy</span>
              <ArrowUpCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-500">{signalCounts.strongBuy}</div>
          </Card>

          <Card className="p-4 border-2 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Buy</span>
              <ArrowUpCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-500">{signalCounts.buy}</div>
          </Card>

          <Card className="p-4 border-2 border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Hold</span>
              <MinusCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-500">{signalCounts.hold}</div>
          </Card>

          <Card className="p-4 border-2 border-red-500/20 bg-red-500/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sell</span>
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-500">{signalCounts.sell}</div>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold mb-3">Top Signals</h3>
          {signals.slice(0, 3).map((signal) => (
            <div key={signal.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant={signal.type === 'stock' ? 'default' : 'secondary'}>
                  {signal.type === 'stock' ? 'Stock' : 'PM'}
                </Badge>
                <div>
                  <div className="font-semibold">{signal.asset}</div>
                  <div className="text-sm text-muted-foreground">{signal.strategy}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    signal.scoreLabel === 'Strong Buy' ? 'default' :
                    signal.scoreLabel === 'Buy' ? 'default' :
                    signal.scoreLabel === 'Sell' ? 'destructive' : 'outline'
                  }
                  className={
                    signal.scoreLabel === 'Strong Buy' ? 'bg-green-500' :
                    signal.scoreLabel === 'Buy' ? 'bg-blue-500' : ''
                  }
                >
                  {signal.scoreLabel}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">{(signal.combinedScore * 100).toFixed(0)}%</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Agent Workflow Status */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Agent Workflow Status</h2>

        <div className="relative">
          {/* Pipeline visualization */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                {agents.filter(a => a.type === 'analyst').reduce((sum, a) => sum + a.queueLength, 0)}
              </div>
              <div className="text-sm font-semibold">Analyst Team</div>
              <div className="text-xs text-muted-foreground">{agents.filter(a => a.type === 'analyst').length} agents</div>
            </div>

            <div className="flex-shrink-0 px-4">
              <div className="w-8 h-0.5 bg-border"></div>
            </div>

            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                {agents.filter(a => a.type === 'researcher').reduce((sum, a) => sum + a.queueLength, 0)}
              </div>
              <div className="text-sm font-semibold">Researcher Team</div>
              <div className="text-xs text-muted-foreground">{agents.filter(a => a.type === 'researcher').length} agents</div>
            </div>

            <div className="flex-shrink-0 px-4">
              <div className="w-8 h-0.5 bg-border"></div>
            </div>

            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                {agents.filter(a => a.type === 'trader').reduce((sum, a) => sum + a.queueLength, 0)}
              </div>
              <div className="text-sm font-semibold">Trader Agent</div>
              <div className="text-xs text-muted-foreground">{agents.filter(a => a.type === 'trader')[0]?.avgLatency}ms avg</div>
            </div>

            <div className="flex-shrink-0 px-4">
              <div className="w-8 h-0.5 bg-border"></div>
            </div>

            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                {agents.filter(a => a.type === 'risk').reduce((sum, a) => sum + a.queueLength, 0)}
              </div>
              <div className="text-sm font-semibold">Risk Mgmt</div>
              <div className="text-xs text-muted-foreground">{agents.filter(a => a.type === 'risk')[0]?.avgLatency}ms avg</div>
            </div>

            <div className="flex-shrink-0 px-4">
              <div className="w-8 h-0.5 bg-border"></div>
            </div>

            <div className="text-center flex-1">
              <div className="w-16 h-16 mx-auto bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                {agents.filter(a => a.type === 'pm').reduce((sum, a) => sum + a.queueLength, 0)}
              </div>
              <div className="text-sm font-semibold">Portfolio Mgr</div>
              <div className="text-xs text-muted-foreground">{agents.filter(a => a.type === 'pm')[0]?.avgLatency}ms avg</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Avg Decision Latency</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(agents.reduce((sum, a) => sum + a.avgLatency, 0) / agents.length)}ms
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Queue Length</span>
              </div>
              <div className="text-2xl font-bold">
                {agents.reduce((sum, a) => sum + a.queueLength, 0)} items
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Avg Error Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {(agents.reduce((sum, a) => sum + a.errorRate, 0) / agents.length).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
