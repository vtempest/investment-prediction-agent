"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { demoTopTraders, type TopTrader } from "@/lib/demo-data"
import { Trophy, TrendingUp, Activity, Clock, AlertTriangle, Copy } from "lucide-react"

export function CopyTradingTab() {
  const [traders] = useState(demoTopTraders)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Top Traders Leaderboard</h2>
        <Badge variant="outline">Updated 5 min ago</Badge>
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
              {traders.map((trader) => (
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
                      +${(trader.overallPnL / 1000000).toFixed(2)}M
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
                      ${(trader.currentValue / 1000000).toFixed(1)}M
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
                                +${(trader.overallPnL / 1000000).toFixed(2)}M
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
                              {trader.markets.map((market, i) => (
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
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-semibold">Nancy Pelosi</div>
              <div className="text-sm text-muted-foreground">Copying since Nov 15, 2024</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-500">+$4,280</div>
              <div className="text-xs text-muted-foreground">+12.8% return</div>
            </div>
            <Button variant="destructive" size="sm">Stop Copying</Button>
          </div>

          <div className="p-8 text-center text-muted-foreground">
            <p>Configure and start copying more traders above</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
