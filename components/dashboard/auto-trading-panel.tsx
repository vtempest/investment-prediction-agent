"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Play, Square, Settings2, TrendingUp, AlertTriangle } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface AutoTradingPanelProps {
  portfolioId?: string
  strategyId?: string
  onExecutionComplete?: () => void
}

export function AutoTradingPanel({
  portfolioId: initialPortfolioId,
  strategyId: initialStrategyId,
  onExecutionComplete,
}: AutoTradingPanelProps) {
  const { toast } = useToast()
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [strategies, setStrategies] = useState<any[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>(
    initialPortfolioId || ""
  )
  const [selectedStrategy, setSelectedStrategy] = useState<string>(
    initialStrategyId || ""
  )
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [symbols, setSymbols] = useState<string>("AAPL,GOOGL,MSFT,TSLA")

  // Auto-trading settings
  const [autoEnabled, setAutoEnabled] = useState(false)
  const [signalThreshold, setSignalThreshold] = useState(0.7)
  const [positionSize, setPositionSize] = useState(0.1)
  const [riskLimit, setRiskLimit] = useState(0.02)
  const [maxDailyTrades, setMaxDailyTrades] = useState(10)

  useEffect(() => {
    fetchPortfolios()
    fetchStrategies()
  }, [])

  useEffect(() => {
    if (selectedPortfolio) {
      fetchPortfolioSettings()
    }
  }, [selectedPortfolio])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      setPortfolios(data.portfolios || [])

      // Auto-select active portfolio
      const activePortfolio = data.portfolios?.find((p: any) => p.isActive)
      if (activePortfolio && !initialPortfolioId) {
        setSelectedPortfolio(activePortfolio.id)
      } else if (data.portfolios?.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(data.portfolios[0].id)
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error)
    }
  }

  const fetchStrategies = async () => {
    try {
      const response = await fetch("/api/user/strategies")
      const data = await response.json()
      setStrategies(data.strategies || [])

      if (data.strategies?.length > 0 && !selectedStrategy) {
        setSelectedStrategy(data.strategies[0].id)
      }
    } catch (error) {
      console.error("Error fetching strategies:", error)
    }
  }

  const fetchPortfolioSettings = async () => {
    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio}`)
      const data = await response.json()

      if (data.portfolio) {
        setAutoEnabled(data.portfolio.autoTradingEnabled || false)
        setRiskLimit(data.portfolio.autoTradingRiskLimit || 0.02)
        setMaxDailyTrades(data.portfolio.autoTradingMaxDaily || 10)
      }
    } catch (error) {
      console.error("Error fetching portfolio settings:", error)
    }
  }

  const updateAutoTradingSettings = async () => {
    if (!selectedPortfolio) return

    setLoading(true)
    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          autoTradingEnabled: autoEnabled,
          autoTradingRiskLimit: riskLimit,
          autoTradingMaxDaily: maxDailyTrades,
        }),
      })

      const data = await response.json()

      if (data.portfolio) {
        toast({
          title: "Settings Updated",
          description: "Auto-trading settings have been saved",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStrategySettings = async () => {
    if (!selectedStrategy) return

    setLoading(true)
    try {
      // Update strategy with auto-execute settings
      const response = await fetch(`/api/user/strategies`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedStrategy,
          autoExecute: autoEnabled,
          autoExecuteSignalThreshold: signalThreshold,
          autoExecutePositionSize: positionSize,
        }),
      })

      const data = await response.json()

      if (data.strategy) {
        toast({
          title: "Strategy Updated",
          description: "Auto-execution settings have been saved",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update strategy",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const executeAutoTrading = async () => {
    if (!selectedPortfolio) {
      toast({
        title: "No Portfolio Selected",
        description: "Please select a portfolio first",
        variant: "destructive",
      })
      return
    }

    setExecuting(true)

    try {
      const symbolsArray = symbols.split(",").map((s) => s.trim())

      const response = await fetch("/api/auto-trading/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolio,
          strategyId: selectedStrategy || undefined,
          symbols: symbolsArray,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Auto-Trading Executed",
          description: `${data.summary.executed} trades executed, ${data.summary.skipped} skipped, ${data.summary.errors} errors`,
        })
        onExecutionComplete?.()
      } else {
        toast({
          title: "Execution Failed",
          description: data.error || "Failed to execute auto-trading",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute auto-trading",
        variant: "destructive",
      })
    } finally {
      setExecuting(false)
    }
  }

  const currentPortfolio = portfolios.find((p) => p.id === selectedPortfolio)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Auto-Trading & Strategy Deployment
        </CardTitle>
        <CardDescription>
          Configure and deploy automated trading strategies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Selection */}
        <div className="space-y-2">
          <Label>Portfolio</Label>
          <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
            <SelectTrigger>
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name} - ${portfolio.totalEquity.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Strategy Selection */}
        <div className="space-y-2">
          <Label>Strategy (Optional - leave blank for all auto-enabled)</Label>
          <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
            <SelectTrigger>
              <SelectValue placeholder="All auto-enabled strategies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All auto-enabled strategies</SelectItem>
              {strategies.map((strategy) => (
                <SelectItem key={strategy.id} value={strategy.id}>
                  {strategy.name} - {strategy.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Symbols */}
        <div className="space-y-2">
          <Label>Symbols (comma-separated)</Label>
          <Input
            placeholder="AAPL,GOOGL,MSFT,TSLA"
            value={symbols}
            onChange={(e) => setSymbols(e.target.value)}
          />
        </div>

        {/* Auto-Trading Settings */}
        <div className="p-4 bg-muted rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-enabled" className="text-base font-semibold">
              Auto-Trading Enabled
            </Label>
            <Switch
              id="auto-enabled"
              checked={autoEnabled}
              onCheckedChange={setAutoEnabled}
            />
          </div>

          {autoEnabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Signal Threshold</Label>
                  <span className="text-sm text-muted-foreground">
                    {signalThreshold.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[signalThreshold]}
                  onValueChange={([v]) => setSignalThreshold(v)}
                  min={0}
                  max={1}
                  step={0.05}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum signal score required to execute trade
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Position Size</Label>
                  <span className="text-sm text-muted-foreground">
                    {(positionSize * 100).toFixed(1)}%
                  </span>
                </div>
                <Slider
                  value={[positionSize]}
                  onValueChange={([v]) => setPositionSize(v)}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of portfolio per trade
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Risk Limit per Trade</Label>
                  <span className="text-sm text-muted-foreground">
                    {(riskLimit * 100).toFixed(1)}%
                  </span>
                </div>
                <Slider
                  value={[riskLimit]}
                  onValueChange={([v]) => setRiskLimit(v)}
                  min={0.01}
                  max={0.1}
                  step={0.005}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum portfolio percentage at risk per trade
                </p>
              </div>

              <div className="space-y-2">
                <Label>Max Daily Trades</Label>
                <Input
                  type="number"
                  value={maxDailyTrades}
                  onChange={(e) => setMaxDailyTrades(parseInt(e.target.value))}
                  min={1}
                  max={100}
                />
              </div>
            </>
          )}
        </div>

        {/* Warning */}
        {autoEnabled && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-600 dark:text-yellow-500">
              <strong>Warning:</strong> Auto-trading will execute real trades in your portfolio. Test thoroughly with paper trading first.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={async () => {
              await updateAutoTradingSettings()
              if (selectedStrategy) {
                await updateStrategySettings()
              }
            }}
            disabled={loading}
            variant="outline"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
          <Button
            onClick={executeAutoTrading}
            disabled={executing || !selectedPortfolio}
            className="bg-green-600 hover:bg-green-700"
          >
            {executing ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute Now
              </>
            )}
          </Button>
        </div>

        {/* Portfolio Stats */}
        {currentPortfolio && (
          <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Equity:</span>
              <span className="font-medium">
                ${currentPortfolio.totalEquity.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Cash:</span>
              <span className="font-medium">
                ${currentPortfolio.cash.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open Positions:</span>
              <span className="font-medium">{currentPortfolio.openPositions}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
