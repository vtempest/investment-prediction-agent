import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, TrendingUp, Activity, Clock, AlertTriangle, Copy, RefreshCw, Loader2 } from "lucide-react"

export function CopyTradingTab() {
  const [traders, setTraders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [source, setSource] = useState("zulu")

  const fetchData = async (currentSource: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?source=${currentSource}`)
      const data = await res.json()
      if (data.success) {
        setTraders(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await fetch('/api/leaderboard/sync', { method: 'POST' })
      await fetchData(source)
    } catch (error) {
      console.error("Failed to sync:", error)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchData(source)
  }, [source])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top Traders Leaderboard</h2>
        <div className="flex items-center gap-4">
          <Tabs value={source} onValueChange={setSource}>
            <TabsList>
              <TabsTrigger value="zulu">ZuluTrade</TabsTrigger>
              <TabsTrigger value="polymarket">Polymarket</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Data
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-semibold">Rank</th>
                <th className="p-4 font-semibold">Trader</th>
                <th className="p-4 font-semibold">Overall P&L</th>
                <th className="p-4 font-semibold">Win Rate</th>
                <th className="p-4 font-semibold">Active Positions</th>
                <th className="p-4 font-semibold">Portfolio Value</th>
                <th className="p-4 font-semibold">Avg Hold</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : traders.map((trader) => (
                <tr key={trader.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {trader.rank <= 3 && <Trophy className={`h-5 w-5 ${trader.rank === 1 ? 'text-yellow-500' : trader.rank === 2 ? 'text-gray-400' : 'text-orange-600'}`} />}
                      <span className="font-bold text-lg">{trader.rank}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{trader.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-green-500 font-bold">
                      {source === 'zulu' ? `$${trader.overallPnL.toLocaleString()}` : `${trader.overallPnL.toFixed(2)}%`}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{trader.winRate}%</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{trader.activePositions}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">
                      ${trader.currentValue.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{trader.avgHoldingPeriod}</div>
                  </td>
                  <td className="p-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Copy Trade: {trader.name}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Overall P&L</div>
                              <div className="text-lg font-bold text-green-500">
                                {source === 'zulu' ? `$${trader.overallPnL.toLocaleString()}` : `${trader.overallPnL.toFixed(2)}%`}
                              </div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Win Rate</div>
                              <div className="text-lg font-bold">{trader.winRate}%</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Max Drawdown</div>
                              <div className="text-lg font-bold text-red-500">{trader.maxDrawdown}%</div>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Volatility</div>
                              <div className="text-lg font-bold">{trader.volatility}%</div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Trading Markets</h3>
                            <div className="flex gap-2 flex-wrap">
                              {trader.markets?.map((market: any, i: number) => (
                                <Badge key={i} variant="secondary">{market}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3">Copy Configuration</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Allocation Amount
                                </label>
                                <Input type="number" placeholder="10000" defaultValue="10000" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Capital to allocate for copying this trader
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium mb-2 block">
                                  Max Position Size (% of allocation)
                                </label>
                                <Input type="number" placeholder="20" defaultValue="20" />
                              </div>

                              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                  <div className="font-medium">Copy All Markets</div>
                                  <div className="text-xs text-muted-foreground">
                                    Follow trades across all market categories
                                  </div>
                                </div>
                                <Switch defaultChecked />
                              </div>

                              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                  <div className="font-medium">Auto-Rebalance</div>
                                  <div className="text-xs text-muted-foreground">
                                    Automatically match trader's position sizing
                                  </div>
                                </div>
                                <Switch />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1">
                              Start Copying
                            </Button>
                            <Button variant="outline">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Active Copy Trading</h3>
        <div className="space-y-3"></div>
      </Card>
    </div>
  )
}
