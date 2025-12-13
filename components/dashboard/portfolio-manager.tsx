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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function PortfolioManager() {
  const { toast } = useToast()
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // New portfolio form
  const [newPortfolio, setNewPortfolio] = useState({
    name: "",
    type: "paper",
    initialBalance: "100000",
    startDate: new Date().toISOString().split("T")[0],
    linkedBroker: "",
    brokerAccountId: "",
  })

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("/api/portfolios")
      const data = await response.json()
      setPortfolios(data.portfolios || [])
    } catch (error) {
      console.error("Error fetching portfolios:", error)
      toast({
        title: "Error",
        description: "Failed to fetch portfolios",
        variant: "destructive",
      })
    }
  }

  const createPortfolio = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPortfolio,
          initialBalance: parseFloat(newPortfolio.initialBalance),
        }),
      })

      const data = await response.json()

      if (data.portfolio) {
        toast({
          title: "Portfolio Created",
          description: `${newPortfolio.name} has been created`,
        })
        setCreateDialogOpen(false)
        setNewPortfolio({
          name: "",
          type: "paper",
          initialBalance: "100000",
          startDate: new Date().toISOString().split("T")[0],
          linkedBroker: "",
          brokerAccountId: "",
        })
        fetchPortfolios()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create portfolio",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const setActivePortfolio = async (portfolioId: string) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: true }),
      })

      const data = await response.json()

      if (data.portfolio) {
        toast({
          title: "Active Portfolio Updated",
          description: `${data.portfolio.name} is now active`,
        })
        fetchPortfolios()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update active portfolio",
        variant: "destructive",
      })
    }
  }

  const deletePortfolio = async (portfolioId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Portfolio Deleted",
          description: `${name} has been deleted`,
        })
        fetchPortfolios()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive",
      })
    }
  }

  const toggleAutoTrading = async (portfolioId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ autoTradingEnabled: enabled }),
      })

      const data = await response.json()

      if (data.portfolio) {
        toast({
          title: "Auto-Trading Updated",
          description: `Auto-trading ${enabled ? "enabled" : "disabled"}`,
        })
        fetchPortfolios()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update auto-trading",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage multiple portfolios with different strategies and brokers
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Set up a new portfolio for paper trading or link to a broker
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Portfolio Name</Label>
                <Input
                  placeholder="e.g., Growth Portfolio"
                  value={newPortfolio.name}
                  onChange={(e) =>
                    setNewPortfolio({ ...newPortfolio, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newPortfolio.type}
                  onValueChange={(v) =>
                    setNewPortfolio({ ...newPortfolio, type: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paper">Paper Trading</SelectItem>
                    <SelectItem value="alpaca">Alpaca</SelectItem>
                    <SelectItem value="webull">Webull</SelectItem>
                    <SelectItem value="robinhood">Robinhood</SelectItem>
                    <SelectItem value="ibkr">Interactive Brokers</SelectItem>
                    <SelectItem value="tda">TD Ameritrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Initial Balance</Label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={newPortfolio.initialBalance}
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      initialBalance: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newPortfolio.startDate}
                  onChange={(e) =>
                    setNewPortfolio({
                      ...newPortfolio,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              {newPortfolio.type !== "paper" && (
                <>
                  <div className="space-y-2">
                    <Label>Broker Account ID</Label>
                    <Input
                      placeholder="Enter your broker account ID"
                      value={newPortfolio.brokerAccountId}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          brokerAccountId: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={createPortfolio} disabled={loading}>
                Create Portfolio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {portfolio.name}
                    {portfolio.isActive && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    {portfolio.type === "paper" ? "Paper Trading" : portfolio.linkedBroker}
                    {portfolio.timeTravelEnabled && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        Time Travel
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActivePortfolio(portfolio.id)}
                    disabled={portfolio.isActive}
                  >
                    {portfolio.isActive ? "Active" : "Set Active"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePortfolio(portfolio.id, portfolio.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Equity</div>
                  <div className="text-lg font-semibold">
                    ${portfolio.totalEquity.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Cash</div>
                  <div className="text-lg font-semibold">
                    ${portfolio.cash.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total P&L</div>
                  <div
                    className={`text-lg font-semibold ${
                      portfolio.totalPnL >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${portfolio.totalPnL.toLocaleString()} (
                    {portfolio.totalPnLPercent.toFixed(2)}%)
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Positions</div>
                  <div className="text-lg font-semibold">
                    {portfolio.openPositions}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`auto-${portfolio.id}`}>Auto-Trading</Label>
                  <Switch
                    id={`auto-${portfolio.id}`}
                    checked={portfolio.autoTradingEnabled}
                    onCheckedChange={(checked) =>
                      toggleAutoTrading(portfolio.id, checked)
                    }
                  />
                </div>
                {portfolio.autoTradingEnabled && (
                  <div className="text-sm text-muted-foreground">
                    Max {portfolio.autoTradingMaxDaily} trades/day, {(portfolio.autoTradingRiskLimit * 100).toFixed(1)}% risk limit
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolios.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No portfolios yet. Create one to get started!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
