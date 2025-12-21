"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// @ts-ignore
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Star } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { DynamicStockChart } from "@/components/dashboard/dynamic-stock-chart"
import { TradeModal } from "@/components/dashboard/trade-modal"
import * as Broker from '@/lib/api-client';

Broker.postBacktestTechnical({
  body: {
    symbol: "AAPL",
    interval: "1d",
  }
})

Broker.getUserPortfolio()

interface QuoteData {
  symbol: string
  price: {
    regularMarketPrice: number
    regularMarketChange: number
    regularMarketChangePercent: number
    regularMarketOpen: number
    regularMarketDayHigh: number
    regularMarketDayLow: number
    regularMarketVolume: number
    marketCap: number
    exchangeName?: string
    longName?: string
    shortName?: string
    marketState?: string
    sector?: string
    industry?: string
  }
  summaryDetail: {
    fiftyTwoWeekHigh: number
    fiftyTwoWeekLow: number
    averageVolume: number
    dividendYield: number
    beta: number
    trailingPE: number
    sector?: string
    industry?: string
    longBusinessSummary?: string
  }
  defaultKeyStatistics: {
    enterpriseValue: number
    profitMargins: number
    trailingEps?: number
  }
  financialData?: {
    targetMeanPrice?: number
  }
  summaryProfile?: {
    sector?: string
    industry?: string
    longBusinessSummary?: string
  }
  peers?: string[]
}

interface TradeSignal {
  date: string
  time: number
  action: 'BUY' | 'SELL'
  price: number
}

interface QuoteViewProps {
  symbol: string
  showBackButton?: boolean
  tradeSignals?: TradeSignal[]
}

export function QuoteView({ symbol, showBackButton = true, tradeSignals = [] }: QuoteViewProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [data, setData] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)
  const [tradeModalOpen, setTradeModalOpen] = useState(false)

  // Check if symbol is in watchlist
  useEffect(() => {
    if (!symbol || !session?.user) return

    const checkWatchlist = async () => {
      try {

        const res = await fetch('/api/user/watchlist')
        const json = await res.json()
        if (json.success && json.data) {
          const inWatchlist = json.data.some((item: any) => item.symbol === symbol.toUpperCase())
          setIsInWatchlist(inWatchlist)
        }
      } catch (err) {
        console.error('Error checking watchlist:', err)
      }
    }

    checkWatchlist()
  }, [symbol, session])

  useEffect(() => {
    if (!symbol) return

    const fetchQuote = async () => {
      try {
        setLoading(true)
        setError("") // Clear any previous errors

        // const res = await fetch(`/api/stocks/quote/${symbol}`)
        const json = await Broker.getStocksQuoteBySymbol({
          path: {
            symbol
          }
        })


        //await res.json()

        if (json.success && json.data) {
          setData(json.data)
          setError("") // Clear error on success
        } else {
          setError(json.error || "Failed to fetch quote data")
        }
      } catch (err) {
        console.error(err)
        setError("An error occurred while fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [symbol])


  // New state for performance metrics
  const [performance, setPerformance] = useState<{
    week: number | null,
    month: number | null,
    month3: number | null,
    month6: number | null,
    year: number | null,
    year5: number | null,
    ytd: number | null
  }>({
    week: null,
    month: null,
    month3: null,
    month6: null,
    year: null,
    year5: null,
    ytd: null
  })

  // Fetch 5y data for calculating performance metrics
  useEffect(() => {
    if (!symbol) return

    const fetchPerformanceData = async () => {
      try {
        // Fetch 5 years of daily data
        const res = await fetch(`/api/stocks/historical/${symbol}?range=5y&interval=1d`)
        const json = await res.json()

        if (json.success && json.data && Array.isArray(json.data)) {
          const history = json.data
          if (history.length === 0) return

          const currentPrice = history[history.length - 1].close
          const now = new Date()

          const findPriceAtDate = (targetDate: Date) => {
            // Find closest date in history (going backwards)
            const targetTime = targetDate.getTime()
            // Sort by difference
            const closest = history.reduce((prev: any, curr: any) => {
              return (Math.abs(new Date(curr.date).getTime() - targetTime) < Math.abs(new Date(prev.date).getTime() - targetTime) ? curr : prev);
            });
            return closest.close;
          }

          const getChange = (daysAgo: number) => {
            const targetDate = new Date()
            targetDate.setDate(now.getDate() - daysAgo)
            const startPrice = findPriceAtDate(targetDate)
            return startPrice ? ((currentPrice - startPrice) / startPrice) : null
          }

          const getDateChange = (targetDate: Date) => {
            const startPrice = findPriceAtDate(targetDate)
            return startPrice ? ((currentPrice - startPrice) / startPrice) : null
          }

          setPerformance({
            week: getChange(7),
            month: getChange(30),
            month3: getChange(90),
            month6: getChange(180),
            year: getChange(365),
            year5: getChange(365 * 5),
            ytd: getDateChange(new Date(new Date().getFullYear(), 0, 1))
          })
        }
      } catch (err) {
        console.error("Performance data fetch error:", err)
      }
    }

    fetchPerformanceData()
  }, [symbol])

  const toggleWatchlist = async () => {
    if (!session?.user) {
      alert('Please sign in to add to watchlist')
      return
    }

    setWatchlistLoading(true)
    try {
      if (isInWatchlist) {
        // Remove from watchlist
        const res = await fetch(`/api/user/watchlist?symbol=${symbol}`, {
          method: 'DELETE',
        })
        const json = await res.json()
        if (json.success) {
          setIsInWatchlist(false)
        }
      } else {
        // Add to watchlist
        const res = await fetch('/api/user/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol: symbol.toUpperCase(),
            name: data?.price?.longName || data?.price?.shortName || symbol,
          }),
        })
        const json = await res.json()
        if (json.success) {
          setIsInWatchlist(true)
        }
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error)
    } finally {
      setWatchlistLoading(false)
    }
  }

  // Helper to format large numbers
  const formatNumber = (num: number) => {
    if (!num) return "N/A"
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 2
    }).format(num)
  }

  // Helper to format currency
  const formatCurrency = (num: number) => {
    if (num === undefined || num === null) return "N/A"
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }

  // Helper to format percent
  const formatPercent = (num: number) => {
    if (num === undefined || num === null) return "N/A"
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 p-6 flex-col">
        {showBackButton && (
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        )}
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <h3 className="text-lg font-bold">Error Loading Quote</h3>
              <p>{error || "Stock data not found"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const price = data.price || {}
  const summary = data.summaryDetail || {}

  const isPositive = price.regularMarketChange >= 0

  return (
    <div className="flex flex-1 flex-col p-4 lg:p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {session?.user && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleWatchlist}
                    disabled={watchlistLoading}
                    className="h-8 w-8"
                    title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    <Star
                      className={`h-5 w-5 ${isInWatchlist
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                        }`}
                    />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setTradeModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Buy / Short
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {price.longName || price.shortName || symbol}

                </CardTitle>
              </CardHeader>
              <CardContent>


                <div className="flex items-center gap-2">
                  <span className="text-md font-bold">{formatCurrency(price.regularMarketPrice)}</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{symbol}</h1>
              </CardContent>
            </Card>


            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">Performance</CardTitle>
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">D</div>
                    <div className={`font-bold ${price.regularMarketChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercent(price.regularMarketChangePercent)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">W</div>
                    <div className={`font-bold ${performance.week && performance.week >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performance.week ? formatPercent(performance.week) : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">M</div>
                    <div className={`font-bold ${performance.month && performance.month >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performance.month ? formatPercent(performance.month) : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">6M</div>
                    <div className={`font-bold ${performance.month6 && performance.month6 >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performance.month6 ? formatPercent(performance.month6) : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Y</div>
                    <div className={`font-bold ${performance.year && performance.year >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performance.year ? formatPercent(performance.year) : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">5Y</div>
                    <div className={`font-bold ${performance.year5 && performance.year5 >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performance.year5 ? formatPercent(performance.year5) : '-'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-medium text-muted-foreground">Market Cap & Volume</CardTitle>
                <Activity className="h-3 w-3 text-muted-foreground" />
              </CardHeader>
              <CardContent>

                <div className="text-lg font-bold">{formatNumber(price.marketCap)}</div>

                <div className="text-lg font-bold">{formatNumber(price.regularMarketVolume)}</div>
                <div className="text-xs text-muted-foreground">Avg: {formatNumber(summary.averageVolume)}</div>
              </CardContent>
            </Card>


          </div>

        </div>

        {/* Price Chart with Lazy Loading */}
        <DynamicStockChart
          symbol={symbol}
          initialRange="1y"
          interval="1d"
        />

        {/* Key Stats Grid */}


        {/* SEC Filings Link */}
        {/* <Card>
            <CardHeader>
                <CardTitle>SEC Filings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        View official SEC filings for {symbol} including 10-K, 10-Q, 8-K reports and ownership forms.
                    </p>
                    <div className="flex gap-2">
                        <Link href={`/api/stocks/filings/${symbol}`} target="_blank">
                            <Button variant="outline" size="sm">
                                View JSON Data
                            </Button>
                        </Link>
                        <Link href={`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&ticker=${symbol}&type=&dateb=&owner=exclude&count=40`} target="_blank">
                            <Button variant="outline" size="sm">
                                View on SEC.gov
                            </Button>
                        </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Note: Some companies may not have SEC filings or use different ticker symbols for SEC reporting.
                    </p>
                </div>
            </CardContent>
         </Card> */}



        {/* Industry & Peers */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Industry & Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Sector</div>
                  <div className="text-lg font-bold">{data.summaryProfile?.sector || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Industry</div>
                  <div className="text-lg font-bold">{data.summaryProfile?.industry || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Description</div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {data.summaryProfile?.longBusinessSummary || "No description available."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              {data.peers && data.peers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.peers.slice(0, 10).map((peerSymbol: string) => (
                    <Link key={peerSymbol} href={`/dashboard/quote?symbol=${peerSymbol}`}>
                      <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                        {peerSymbol}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No related stocks found.</div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Trade Modal */}
      <TradeModal
        open={tradeModalOpen}
        onOpenChange={setTradeModalOpen}
        symbol={symbol}
        currentPrice={price.regularMarketPrice}
        stockName={price.longName || price.shortName || symbol}
      />
    </div>
  )
}
