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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"

interface TradingPanelProps {
  symbol: string
  currentPrice: number
  portfolioId?: string
  onTradeComplete?: () => void
}

export function TradingPanel({
  symbol,
  currentPrice,
  portfolioId: initialPortfolioId,
  onTradeComplete,
}: TradingPanelProps) {
  const { toast } = useToast()
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>(
    initialPortfolioId || ""
  )
  const [quantity, setQuantity] = useState("")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState<any>(null)

  useEffect(() => {
    fetchPortfolios()
  }, [])

  useEffect(() => {
    if (selectedPortfolio && symbol) {
      fetchPosition()
    }
  }, [selectedPortfolio, symbol])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      setPortfolios(data.portfolios || [])

      // Auto-select active portfolio or first one
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

  const fetchPosition = async () => {
    if (!selectedPortfolio || !symbol) return

    try {
      const response = await fetch(`/api/portfolios/${selectedPortfolio}`)
      const data = await response.json()
      const existingPosition = data.positions?.find(
        (p: any) => p.asset === symbol && !p.closedAt
      )
      setPosition(existingPosition || null)
    } catch (error) {
      console.error("Error fetching position:", error)
    }
  }

  const executeTrade = async (action: "buy" | "sell") => {
    if (!selectedPortfolio) {
      toast({
        title: "No Portfolio Selected",
        description: "Please select a portfolio first",
        variant: "destructive",
      })
      return
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Limit Price",
        description: "Please enter a valid limit price",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/paper-trading/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolio,
          symbol,
          action,
          quantity: parseFloat(quantity),
          price: orderType === "limit" ? parseFloat(limitPrice) : undefined,
          type: orderType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Trade Executed",
          description: data.message,
        })
        setQuantity("")
        setLimitPrice("")
        fetchPosition()
        onTradeComplete?.()
      } else {
        toast({
          title: "Trade Failed",
          description: data.error || "Failed to execute trade",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute trade",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const currentPortfolio = portfolios.find((p) => p.id === selectedPortfolio)
  const totalValue = quantity ? parseFloat(quantity) * currentPrice : 0
  const hasSufficientFunds = currentPortfolio
    ? currentPortfolio.cash >= totalValue
    : false

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trade {symbol}</CardTitle>
        <CardDescription>
          Execute paper trades with fractional shares
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Selector */}
        <div className="space-y-2">
          <Label>Portfolio</Label>
          <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
            <SelectTrigger>
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name} - ${portfolio.cash.toLocaleString()} cash
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Position */}
        {position && (
          <div className="p-3 bg-muted rounded-lg space-y-1">
            <div className="text-sm font-medium">Current Position</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shares:</span>
              <span>{position.size.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avg Price:</span>
              <span>${position.entryPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">P&L:</span>
              <span
                className={
                  position.unrealizedPnL >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ${position.unrealizedPnL.toFixed(2)} (
                {position.unrealizedPnLPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        )}

        {/* Order Type */}
        <div className="space-y-2">
          <Label>Order Type</Label>
          <Select value={orderType} onValueChange={(v: any) => setOrderType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market Order</SelectItem>
              <SelectItem value="limit">Limit Order</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label>Quantity (supports fractional)</Label>
          <Input
            type="number"
            step="0.0001"
            placeholder="0.0000"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Limit Price (if limit order) */}
        {orderType === "limit" && (
          <div className="space-y-2">
            <Label>Limit Price</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          </div>
        )}

        {/* Trade Summary */}
        {quantity && parseFloat(quantity) > 0 && (
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Current Price:
              </span>
              <span className="font-medium">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Value:</span>
              <span className="font-medium">${totalValue.toFixed(2)}</span>
            </div>
            {currentPortfolio && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Available Cash:</span>
                <span
                  className={
                    hasSufficientFunds ? "text-green-600" : "text-red-600"
                  }
                >
                  ${currentPortfolio.cash.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => executeTrade("buy")}
            disabled={loading || !hasSufficientFunds || !quantity}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Buy
          </Button>
          <Button
            onClick={() => executeTrade("sell")}
            disabled={loading || !position || !quantity}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <TrendingDown className="mr-2 h-4 w-4" />
            Sell
          </Button>
        </div>

        {!hasSufficientFunds && quantity && parseFloat(quantity) > 0 && (
          <p className="text-sm text-red-600 text-center">
            Insufficient funds for this trade
          </p>
        )}
      </CardContent>
    </Card>
  )
}
