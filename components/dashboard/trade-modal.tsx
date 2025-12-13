"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Hash, Loader2 } from "lucide-react"

interface TradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  symbol: string
  currentPrice: number
  stockName?: string
}

export function TradeModal({
  open,
  onOpenChange,
  symbol,
  currentPrice,
  stockName,
}: TradeModalProps) {
  const [action, setAction] = useState<"buy" | "short">("buy")
  const [orderType, setOrderType] = useState<"shares" | "dollars">("shares")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("")

  // Fetch portfolios data
  useEffect(() => {
    if (open) {
      fetchPortfolios()
    }
  }, [open])

  const fetchPortfolios = async () => {
    try {
      const res = await fetch('/api/portfolios')
      const json = await res.json()
      if (json.portfolios) {
        setPortfolios(json.portfolios)
        // Auto-select active portfolio
        const activePortfolio = json.portfolios.find((p: any) => p.isActive)
        if (activePortfolio) {
          setSelectedPortfolio(activePortfolio.id)
        } else if (json.portfolios.length > 0) {
          setSelectedPortfolio(json.portfolios[0].id)
        }
      }
    } catch (err) {
      console.error('Error fetching portfolios:', err)
    }
  }

  const currentPortfolio = portfolios.find((p) => p.id === selectedPortfolio)

  const calculateShares = () => {
    if (orderType === "shares") {
      return parseFloat(amount) || 0
    } else {
      // Calculate shares from dollar amount
      const dollars = parseFloat(amount) || 0
      return dollars / currentPrice
    }
  }

  const calculateTotal = () => {
    if (orderType === "dollars") {
      return parseFloat(amount) || 0
    } else {
      // Calculate dollars from shares
      const shares = parseFloat(amount) || 0
      return shares * currentPrice
    }
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess(false)

    if (!selectedPortfolio) {
      setError("Please select a portfolio")
      return
    }

    const shares = calculateShares()
    const total = calculateTotal()

    if (shares <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (action === "buy" && currentPortfolio && total > currentPortfolio.cash) {
      setError(`Insufficient funds. Available: $${currentPortfolio.cash.toLocaleString()}`)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/paper-trading/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: selectedPortfolio,
          symbol: symbol.toUpperCase(),
          action: action === "buy" ? "buy" : "sell",
          quantity: shares,
          price: currentPrice,
          type: "market",
        }),
      })

      const json = await res.json()

      if (json.success) {
        setSuccess(true)
        setAmount("")
        // Refresh portfolios
        await fetchPortfolios()
        setTimeout(() => {
          onOpenChange(false)
          setSuccess(false)
        }, 1500)
      } else {
        setError(json.error || "Failed to execute trade")
      }
    } catch (err) {
      console.error('Error executing trade:', err)
      setError("Failed to execute trade")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Trade {symbol}
          </DialogTitle>
          <DialogDescription>
            {stockName && <span className="block mb-2">{stockName}</span>}
            <span className="text-lg font-bold">{formatCurrency(currentPrice)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
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
                    {portfolio.name} - ${portfolio.cash.toLocaleString()} cash
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buy/Short Tabs */}
          <Tabs value={action} onValueChange={(v) => setAction(v as "buy" | "short")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="short" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Short
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4 mt-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Buy shares and profit when the price goes up
                </p>
              </div>
            </TabsContent>

            <TabsContent value="short" className="space-y-4 mt-4">
              <div className="p-3 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Short sell shares and profit when the price goes down
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Order Type Selection */}
          <div className="space-y-3">
            <Label>Order Type</Label>
            <RadioGroup value={orderType} onValueChange={(v) => setOrderType(v as "shares" | "dollars")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shares" id="shares" />
                <Label htmlFor="shares" className="flex items-center gap-2 cursor-pointer">
                  <Hash className="h-4 w-4" />
                  Number of Shares
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dollars" id="dollars" />
                <Label htmlFor="dollars" className="flex items-center gap-2 cursor-pointer">
                  <DollarSign className="h-4 w-4" />
                  Dollar Amount
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {orderType === "shares" ? "Number of Shares" : "Dollar Amount"}
            </Label>
            <Input
              id="amount"
              type="number"
              step={orderType === "shares" ? "0.001" : "0.01"}
              min="0"
              placeholder={orderType === "shares" ? "e.g., 10 or 0.5" : "e.g., 1000"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {orderType === "shares" ? "Fractional shares supported" : "Minimum $1"}
            </p>
          </div>

          {/* Order Summary */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shares:</span>
                <span className="font-medium">
                  {calculateShares().toFixed(6)} {symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per Share:</span>
                <span className="font-medium">{formatCurrency(currentPrice)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          )}

          {/* Portfolio Info */}
          {currentPortfolio && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
              <div className="flex justify-between text-sm">
                <span className="text-blue-800 dark:text-blue-200">Available Cash:</span>
                <span className="font-bold text-blue-800 dark:text-blue-200">
                  {formatCurrency(currentPortfolio.cash)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-blue-800 dark:text-blue-200">Total Equity:</span>
                <span className="font-bold text-blue-800 dark:text-blue-200">
                  {formatCurrency(currentPortfolio.totalEquity)}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                Trade executed successfully!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={loading || !amount || parseFloat(amount) <= 0}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {action === "buy" ? "Buy" : "Short"} {symbol}
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This is paper trading with virtual money
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
