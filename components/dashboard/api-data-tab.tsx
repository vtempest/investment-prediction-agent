"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Brain,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react"
import {
  stockAgentsAPI,
  TOP_STOCKS,
  NewsResearcherAnalysisResponse,
  DebateAnalystAnalysisResponse,
  BacktestResponse
} from "@/lib/api/stock-agents-api"

export function ApiDataTab() {
  const [selectedStockList, setSelectedStockList] = useState<keyof typeof TOP_STOCKS>('mag7')
  const [selectedStock, setSelectedStock] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [activeAgent, setActiveAgent] = useState<'news-researcher' | 'debate-analyst'>('debate-analyst')

  // Analysis data
  const [newsResearcherData, setNewsResearcherData] = useState<NewsResearcherAnalysisResponse | null>(null)
  const [debateAnalystData, setDebateAnalystData] = useState<DebateAnalystAnalysisResponse | null>(null)
  const [backtestData, setBacktestData] = useState<BacktestResponse | null>(null)
  const [healthData, setHealthData] = useState<any>(null)

  // Get stocks for selected list
  const stocks = TOP_STOCKS[selectedStockList]

  // Set initial stock when list changes
  useEffect(() => {
    if (stocks.length > 0 && !selectedStock) {
      setSelectedStock(stocks[0])
    }
  }, [selectedStockList, stocks, selectedStock])

  // Load health status on mount
  useEffect(() => {
    loadHealthStatus()
  }, [])

  const loadHealthStatus = async () => {
    try {
      const health = await stockAgentsAPI.getHealth()
      setHealthData(health)
    } catch (error) {
      console.error('Failed to load health status:', error)
    }
  }

  const analyzeWithNewsResearcher = async () => {
    if (!selectedStock) return

    setLoading(true)
    try {
      const result = await stockAgentsAPI.analyzeWithNewsResearcher({
        symbols: [selectedStock]
      })
      setNewsResearcherData(result)
    } catch (error) {
      console.error('News Researcher analysis failed:', error)
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const analyzeWithDebateAnalyst = async () => {
    if (!selectedStock) return

    setLoading(true)
    try {
      const result = await stockAgentsAPI.analyzeWithDebateAnalyst({
        symbol: selectedStock
      })
      setDebateAnalystData(result)
    } catch (error) {
      console.error('Debate Analyst analysis failed:', error)
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const runBacktest = async () => {
    if (!selectedStock) return

    setLoading(true)
    try {
      const result = await stockAgentsAPI.runBacktest({
        symbol: selectedStock
      })
      setBacktestData(result)
    } catch (error) {
      console.error('Backtest failed:', error)
      alert(`Backtest failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const getDecisionBadge = (decision: string) => {
    const colors = {
      BUY: 'bg-green-500 hover:bg-green-600',
      SELL: 'bg-red-500 hover:bg-red-600',
      HOLD: 'bg-yellow-500 hover:bg-yellow-600'
    }
    return (
      <Badge className={`${colors[decision as keyof typeof colors]} text-white`}>
        {decision}
      </Badge>
    )
  }

  const getServiceStatusBadge = (status: string) => {
    if (status === 'online') {
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Online</Badge>
    } else if (status === 'offline') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Offline</Badge>
    } else {
      return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Agent API Data & Analysis</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Get real-time analysis and backtesting data from AI agents
            </p>
          </div>
          <Button onClick={loadHealthStatus} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>

        {/* Service Health Status */}
        {healthData && (
          <div className="grid gap-4 md:grid-cols-3 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Gateway</span>
              <Badge className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {healthData.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">News Researcher</span>
              {getServiceStatusBadge(healthData.services?.news_researcher || 'unknown')}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Debate Analyst</span>
              {getServiceStatusBadge(healthData.services?.debate_analyst || 'unknown')}
            </div>
          </div>
        )}

        {/* Stock Selection */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Stock List</label>
            <Select value={selectedStockList} onValueChange={(value) => setSelectedStockList(value as keyof typeof TOP_STOCKS)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mag7">Magnificent 7</SelectItem>
                <SelectItem value="sp500Top">S&P 500 Top 10</SelectItem>
                <SelectItem value="tech">Top Tech Stocks</SelectItem>
                <SelectItem value="faang">FAANG</SelectItem>
                <SelectItem value="mostActive">Most Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Stock</label>
            <Select value={selectedStock} onValueChange={setSelectedStock}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a stock" />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock} value={stock}>
                    {stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Agent</label>
            <Select value={activeAgent} onValueChange={(value) => setActiveAgent(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debate-analyst">Debate Analyst</SelectItem>
                <SelectItem value="news-researcher">News Researcher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={activeAgent === 'news-researcher' ? analyzeWithNewsResearcher : analyzeWithDebateAnalyst}
            disabled={!selectedStock || loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze with {activeAgent === 'news-researcher' ? 'News Researcher' : 'Debate Analyst'}
              </>
            )}
          </Button>
          <Button
            onClick={runBacktest}
            disabled={!selectedStock || loading}
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Run Backtest
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="debate-analyst" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="debate-analyst">Debate Analyst</TabsTrigger>
          <TabsTrigger value="news-researcher">News Researcher</TabsTrigger>
          <TabsTrigger value="backtest">Backtest</TabsTrigger>
        </TabsList>

        {/* Debate Analyst Results */}
        <TabsContent value="debate-analyst" className="space-y-4 mt-4">
          {debateAnalystData ? (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Trading Decision</h3>
                  {getDecisionBadge(debateAnalystData.decision.action)}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                    <div className="text-2xl font-bold">
                      {(debateAnalystData.decision.confidence * 100).toFixed(1)}%
                    </div>
                    <Progress value={debateAnalystData.decision.confidence * 100} className="mt-2" />
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Position Size</div>
                    <div className="text-2xl font-bold">
                      {(debateAnalystData.decision.position_size * 100).toFixed(1)}%
                    </div>
                    <Progress value={debateAnalystData.decision.position_size * 100} className="mt-2" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium mb-2">Reasoning</div>
                  <p className="text-sm text-muted-foreground">
                    {debateAnalystData.decision.reasoning}
                  </p>
                </div>
              </Card>

              {debateAnalystData.decision.debate_summary && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Debate Summary</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Bull Arguments
                      </h4>
                      <ul className="space-y-2">
                        {debateAnalystData.decision.debate_summary.bull_arguments.map((arg, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start">
                            <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                            {arg}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-3 flex items-center">
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Bear Arguments
                      </h4>
                      <ul className="space-y-2">
                        {debateAnalystData.decision.debate_summary.bear_arguments.map((arg, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start">
                            <XCircle className="h-4 w-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                            {arg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Risk Assessment</h4>
                    <p className="text-sm text-muted-foreground">
                      {debateAnalystData.decision.debate_summary.risk_assessment}
                    </p>
                  </div>
                </Card>
              )}

              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Analysis Date: {debateAnalystData.date}</span>
                  <span>Timestamp: {new Date(debateAnalystData.timestamp).toLocaleString()}</span>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No Debate Analyst data. Click "Analyze" to get started.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* News Researcher Results */}
        <TabsContent value="news-researcher" className="space-y-4 mt-4">
          {newsResearcherData ? (
            <>
              {newsResearcherData.result.portfolio_manager_results && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Portfolio Manager Decision</h3>
                    {getDecisionBadge(newsResearcherData.result.portfolio_manager_results.decision)}
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                    <div className="text-2xl font-bold">
                      {(newsResearcherData.result.portfolio_manager_results.confidence * 100).toFixed(1)}%
                    </div>
                    <Progress value={newsResearcherData.result.portfolio_manager_results.confidence * 100} className="mt-2" />
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Reasoning</div>
                    <p className="text-sm text-muted-foreground">
                      {newsResearcherData.result.portfolio_manager_results.reasoning}
                    </p>
                  </div>
                </Card>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                {newsResearcherData.result.technical_analysis_results && (
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Technical Analysis
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Data collected and analyzed
                    </p>
                  </Card>
                )}

                {newsResearcherData.result.news_intelligence_results && (
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      News Intelligence
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Sentiment analysis complete
                    </p>
                  </Card>
                )}

                {newsResearcherData.result.data_collection_results && (
                  <Card className="p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Data Collection
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Market data retrieved
                    </p>
                  </Card>
                )}
              </div>

              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Symbols: {newsResearcherData.symbols.join(', ')}</span>
                  <span>Date: {newsResearcherData.date}</span>
                  <span>Timestamp: {new Date(newsResearcherData.timestamp).toLocaleString()}</span>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No News Researcher data. Click "Analyze" to get started.
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Backtest Results */}
        <TabsContent value="backtest" className="space-y-4 mt-4">
          {backtestData ? (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Backtest Results</h3>
                  <Badge className={backtestData.comparison.outperformed ? 'bg-green-500' : 'bg-red-500'}>
                    {backtestData.comparison.outperformed ? 'Outperformed' : 'Underperformed'} Buy & Hold
                  </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* PrimoAgent Results */}
                  <div>
                    <h4 className="text-sm font-medium mb-4 text-blue-600">PrimoAgent Strategy</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cumulative Return</span>
                        <span className="text-sm font-bold text-green-600">
                          +{backtestData.primo_results['Cumulative Return [%]'].toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Annual Return</span>
                        <span className="text-sm font-medium">
                          {backtestData.primo_results['Annual Return [%]'].toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                        <span className="text-sm font-medium">
                          {backtestData.primo_results['Sharpe Ratio'].toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Drawdown</span>
                        <span className="text-sm font-medium text-red-600">
                          {backtestData.primo_results['Max Drawdown [%]'].toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Win Rate</span>
                        <span className="text-sm font-medium">
                          {backtestData.primo_results['Win Rate [%]'].toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Trades</span>
                        <span className="text-sm font-medium">
                          {backtestData.primo_results['Total Trades']}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buy & Hold Results */}
                  <div>
                    <h4 className="text-sm font-medium mb-4 text-gray-600">Buy & Hold Baseline</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cumulative Return</span>
                        <span className="text-sm font-bold text-green-600">
                          +{backtestData.buyhold_results['Cumulative Return [%]'].toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Annual Return</span>
                        <span className="text-sm font-medium">
                          {backtestData.buyhold_results['Annual Return [%]'].toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                        <span className="text-sm font-medium">
                          {backtestData.buyhold_results['Sharpe Ratio'].toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Drawdown</span>
                        <span className="text-sm font-medium text-red-600">
                          {backtestData.buyhold_results['Max Drawdown [%]'].toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Metrics */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-3">Performance Comparison</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Return Difference</span>
                      <span className={`text-sm font-bold ${backtestData.comparison.metrics.cumulative_return_diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {backtestData.comparison.metrics.cumulative_return_diff > 0 ? '+' : ''}
                        {backtestData.comparison.metrics.cumulative_return_diff.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sharpe Difference</span>
                      <span className={`text-sm font-medium ${backtestData.comparison.metrics.sharpe_diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {backtestData.comparison.metrics.sharpe_diff > 0 ? '+' : ''}
                        {backtestData.comparison.metrics.sharpe_diff.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Portfolio Values */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Final Portfolio Value</div>
                    <div className="text-2xl font-bold">
                      ${backtestData.primo_results['Final Portfolio Value [$]'].toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      From ${backtestData.primo_results['Starting Portfolio Value [$]'].toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Volatility</div>
                    <div className="text-2xl font-bold">
                      {backtestData.primo_results['Annual Volatility [%]'].toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Annual volatility
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Symbol: {backtestData.symbol}</span>
                  <span>Timestamp: {new Date(backtestData.timestamp).toLocaleString()}</span>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No backtest data. Click "Run Backtest" to get started.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
