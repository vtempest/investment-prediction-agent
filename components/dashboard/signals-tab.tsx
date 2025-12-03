"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { demoSignals, type Signal } from "@/lib/demo-data"
import {
  Search,
  TrendingUp,
  Activity,
  Brain,
  Newspaper,
  ArrowRight,
  DollarSign,
} from "lucide-react"

export function SignalsTab() {
  const [signals] = useState(demoSignals)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null)

  const filteredSignals = signals.filter(signal => {
    const matchesType = filterType === "all" || signal.type === filterType
    const matchesSearch = signal.asset.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-500"
    if (score >= 0.6) return "text-blue-500"
    if (score >= 0.4) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadge = (label: string) => {
    if (label === 'Strong Buy') return "bg-green-500 text-white"
    if (label === 'Buy') return "bg-blue-500 text-white"
    if (label === 'Hold') return "bg-yellow-500 text-white"
    return "bg-red-500 text-white"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="stock">Stocks Only</SelectItem>
            <SelectItem value="prediction_market">Prediction Markets</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-semibold">Asset</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Score</th>
                <th className="p-4 font-semibold">Signal</th>
                <th className="p-4 font-semibold">Strategy</th>
                <th className="p-4 font-semibold">Timeframe</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((signal) => (
                <tr key={signal.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold">{signal.asset}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={signal.type === 'stock' ? 'default' : 'secondary'}>
                      {signal.type === 'stock' ? 'Stock' : 'PM'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className={`text-lg font-bold ${getScoreColor(signal.combinedScore)}`}>
                      {(signal.combinedScore * 100).toFixed(0)}%
                    </div>
                    <div className="flex gap-1 mt-1">
                      <div className="flex items-center gap-1 text-xs" title="Fundamentals">
                        <Activity className="h-3 w-3" />
                        {(signal.drivers.fundamentals * 100).toFixed(0)}
                      </div>
                      <div className="flex items-center gap-1 text-xs" title="Technical">
                        <TrendingUp className="h-3 w-3" />
                        {(signal.drivers.technical * 100).toFixed(0)}
                      </div>
                      <div className="flex items-center gap-1 text-xs" title="Sentiment">
                        <Brain className="h-3 w-3" />
                        {(signal.drivers.sentiment * 100).toFixed(0)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getScoreBadge(signal.scoreLabel)}>
                      {signal.scoreLabel}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">{signal.strategy}</td>
                  <td className="p-4 text-sm capitalize">{signal.timeframe}</td>
                  <td className="p-4">
                    <div className="text-sm font-medium">{signal.suggestedAction}</div>
                    <div className="text-xs text-muted-foreground">{signal.suggestedSize}</div>
                  </td>
                  <td className="p-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedSignal(signal)}>
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{signal.asset} Signal Analysis</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Overall Score */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-lg">Combined Score</h3>
                              <Badge className={getScoreBadge(signal.scoreLabel)}>
                                {signal.scoreLabel}
                              </Badge>
                            </div>
                            <div className={`text-4xl font-bold ${getScoreColor(signal.combinedScore)} mb-2`}>
                              {(signal.combinedScore * 100).toFixed(0)}%
                            </div>
                            <Progress value={signal.combinedScore * 100} className="h-3" />
                          </div>

                          {/* Score Breakdown */}
                          <div>
                            <h3 className="font-semibold text-lg mb-4">Score Breakdown</h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-medium">Fundamentals (15% weight)</span>
                                  </div>
                                  <span className="font-bold">{(signal.drivers.fundamentals * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={signal.drivers.fundamentals * 100} className="h-2" />
                                {signal.peRatio && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    P/E: {signal.peRatio} - {signal.peClassification}
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    <span className="font-medium">VIX Regime (20% weight)</span>
                                  </div>
                                  <span className="font-bold">{(signal.drivers.vix * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={signal.drivers.vix * 100} className="h-2" />
                                {signal.vixRegime && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {signal.vixRegime}
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="font-medium">Technical (30% weight)</span>
                                  </div>
                                  <span className="font-bold">{(signal.drivers.technical * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={signal.drivers.technical * 100} className="h-2" />
                                {signal.rsi && signal.macd && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    RSI: {signal.rsi} | MACD: {signal.macd.toFixed(2)}
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Brain className="h-4 w-4" />
                                    <span className="font-medium">Sentiment (20% weight)</span>
                                  </div>
                                  <span className="font-bold">{(signal.drivers.sentiment * 100).toFixed(0)}%</span>
                                </div>
                                <Progress value={signal.drivers.sentiment * 100} className="h-2" />
                                {signal.sentimentScore && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Sentiment Score: {(signal.sentimentScore * 100).toFixed(0)}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Agent Commentary */}
                          {signal.agentCommentary && signal.agentCommentary.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-lg mb-3">Agent Commentary</h3>
                              <div className="space-y-2">
                                {signal.agentCommentary.map((comment, i) => (
                                  <div key={i} className="flex gap-2 p-3 bg-muted rounded-lg">
                                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                                    <span className="text-sm">{comment}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Suggested Action */}
                          <div className="border-t pt-4">
                            <h3 className="font-semibold text-lg mb-3">Suggested Action</h3>
                            <div className="p-4 bg-muted rounded-lg">
                              <div className="text-lg font-bold mb-1">{signal.suggestedAction}</div>
                              <div className="text-sm text-muted-foreground mb-4">{signal.suggestedSize}</div>
                              <div className="flex gap-2">
                                <Button className="flex-1">Execute Trade</Button>
                                <Button variant="outline">Add to Watchlist</Button>
                              </div>
                            </div>
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

      {filteredSignals.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No signals found matching your criteria.</p>
        </Card>
      )}
    </div>
  )
}
