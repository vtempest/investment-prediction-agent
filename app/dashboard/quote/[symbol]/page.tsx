"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { ReactGrid, Column, Row, Cell } from "@silevis/reactgrid"
import "@silevis/reactgrid/styles.css"

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
  }
  summaryDetail: {
    fiftyTwoWeekHigh: number
    fiftyTwoWeekLow: number
    averageVolume: number
    dividendYield: number
    beta: number
    trailingPE: number
  }
  defaultKeyStatistics: {
    enterpriseValue: number
    profitMargins: number
  }
}

export default function QuotePage() {
  const params = useParams()
  const router = useRouter()
  const symbol = typeof params.symbol === 'string' ? params.symbol : ''
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [chartData, setChartData] = useState<any[]>([])
  const [chartLoading, setChartLoading] = useState(true)

  useEffect(() => {
    if (!symbol) return

    const fetchQuote = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/stocks/quote/${symbol}`)
        const json = await res.json()
        
        if (json.success && json.data) {
          setData(json.data)
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

    const fetchChart = async () => {
      try {
        setChartLoading(true)
        const res = await fetch(`/api/stocks/chart/${symbol}?range=1y&interval=1d`)
        const json = await res.json()
        
        if (json.success && Array.isArray(json.data)) {
          setChartData(json.data.map((item: any) => ({
             ...item,
             // Format date for display
             dateStr: new Date(item.date).toLocaleDateString(),
             // Ensure numbers
             close: Number(item.close),
             volume: Number(item.volume)
          })))
        }
      } catch (err) {
        console.error("Chart fetch error:", err)
      } finally {
        setChartLoading(false)
      }
    }

    fetchQuote()
    fetchChart()
  }, [symbol])

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  // ReactGrid generic columns setup
  const getColumns = (): Column[] => [
    { columnId: "date", width: 120 },
    { columnId: "open", width: 100 },
    { columnId: "high", width: 100 },
    { columnId: "low", width: 100 },
    { columnId: "close", width: 100 },
    { columnId: "volume", width: 120 }
  ];

  const headerRow: Row = {
    rowId: "header",
    cells: [
      { type: "header", text: "Date" },
      { type: "header", text: "Open" },
      { type: "header", text: "High" },
      { type: "header", text: "Low" },
      { type: "header", text: "Close" },
      { type: "header", text: "Volume" }
    ]
  };

  const getRows = (data: any[]): Row[] => {
    return [
      headerRow,
      ...data.slice(0, 50).map<Row>((item, idx) => ({
        rowId: idx,
        cells: [
          { type: "text", text: item.dateStr },
          { type: "number", value: item.open, format: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }) },
          { type: "number", value: item.high, format: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }) },
          { type: "number", value: item.low, format: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }) },
          { type: "number", value: item.close, format: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }) },
          { type: "number", value: item.volume }
        ]
      }))
    ];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col lg:pl-64">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col lg:pl-64">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-6">
                <div className="text-center text-destructive">
                  <h3 className="text-lg font-bold">Error Loading Quote</h3>
                  <p>{error || "Stock data not found"}</p>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const price = data.price || {}
  const summary = data.summaryDetail || {}
  const stats = data.defaultKeyStatistics || {}
  const isPositive = price.regularMarketChange >= 0

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  <h1 className="text-3xl font-bold tracking-tight">{price.symbol || symbol}</h1>
                  <Badge variant="outline" className="text-xs">{price.exchangeName || "US"}</Badge>
                </div>
                <p className="text-muted-foreground ml-11">{price.longName || price.shortName || symbol}</p>
              </div>

              <div className="flex items-end flex-col bg-card p-4 rounded-xl border border-border shadow-sm">
                 <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{formatCurrency(price.regularMarketPrice)}</span>
                 </div>
                 <div className={`flex items-center gap-1 font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{isPositive ? '+' : ''}{formatCurrency(price.regularMarketChange)}</span>
                    <span>({formatPercent(price.regularMarketChangePercent)})</span>
                 </div>
                 <span className="text-xs text-muted-foreground mt-1">
                   {price.marketState} • {new Date().toLocaleTimeString()}
                 </span>
              </div>
            </div>

            {/* Price Chart (Recharts) */}
            <Card>
              <CardHeader>
                 <CardTitle>Historical Price (1 Year)</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                {chartLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="dateStr" 
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        minTickGap={50}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(val: number) => `$${val}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--primary))" }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "Close"]}
                      />
                      <Area type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorClose)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No chart data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Key Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Day Range</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(price.regularMarketDayLow)} - {formatNumber(price.regularMarketDayHigh)}
                  </div>
                  <p className="text-xs text-muted-foreground">Open: {formatCurrency(price.regularMarketOpen)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">52 Week Range</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(summary.fiftyTwoWeekLow)} - {formatNumber(summary.fiftyTwoWeekHigh)}
                  </div>
                  <p className="text-xs text-muted-foreground">Yearly fluctuation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(price.marketCap)}</div>
                  <p className="text-xs text-muted-foreground">Analyst Rating: {data.financialData?.targetMeanPrice ? formatCurrency(data.financialData.targetMeanPrice) : 'N/A'}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Volume</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(price.regularMarketVolume)}</div>
                  <p className="text-xs text-muted-foreground">Avg: {formatNumber(summary.averageVolume)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Details */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
               <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">P/E Ratio</span>
                            <div className="font-medium">{formatNumber(summary.trailingPE )}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Dividend Yield</span>
                            <div className="font-medium">{formatPercent(summary.dividendYield)}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">EPS (Trailing)</span>
                            <div className="font-medium">{formatCurrency(data.defaultKeyStatistics?.trailingEps)}</div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Beta</span>
                            <div className="font-medium">{summary.beta?.toFixed(2) || 'N/A'}</div>
                        </div>
                    </div>
                  </CardContent>
               </Card>

               <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Company Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div>
                        <span className="text-sm text-muted-foreground block">Sector</span>
                        <span className="font-medium">{summary.sector || price.sector || 'N/A'}</span>
                     </div>
                     <div>
                        <span className="text-sm text-muted-foreground block">Industry</span>
                        <span className="font-medium">{summary.industry || price.industry || 'N/A'}</span>
                     </div>
                     <div>
                        <span className="text-sm text-muted-foreground block">Description</span>
                        <p className="text-sm mt-1 line-clamp-3 text-muted-foreground">
                            {summary.longBusinessSummary || "No description available."}
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </div>
            
            {/* Historical Data Grid (ReactGrid) */}
            <Card>
                <CardHeader>
                    <CardTitle>Historical Market Data (ReactGrid)</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-[400px]">
                    {chartLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                    ) : chartData.length > 0 ? (
                        <div className="min-w-[500px]">
                            <ReactGrid columns={getColumns()} rows={getRows(chartData)} />
                        </div>
                    ) : (
                        <div className="text-center p-4 text-muted-foreground">No historical data available</div>
                    )}
                </CardContent>
            </Card>

            {/* SEC Filings Link (Since we implemented the API) */}
             <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Recent Filings</h3>
                <Card>
                    <CardContent className="p-0">
                        <div className="bg-muted/30 p-4 text-center">
                            <p className="text-sm text-muted-foreground mb-2">View official SEC filings for {symbol}</p>
                            <Link href={`/api/stocks/filings/${symbol}`} target="_blank">
                                <Button variant="outline" size="sm">
                                    Browse SEC Filings JSON
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
             </div>

          </div>
        </main>
      </div>
    </div>
  )
}
