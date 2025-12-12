"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, ExternalLink, Loader2, DollarSign, Activity, Clock } from "lucide-react"

interface PolymarketMarket {
  id: string
  question: string
  slug: string
  volume24hr: number
  volumeTotal: number
  active: boolean
  closed: boolean
  outcomes: string[]
  outcomePrices: string[]
  image?: string
  description?: string
  endDate?: string
  tags?: string[]
}

export function PredictionMarketsTab() {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([])
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState(20)
  const [timeWindow, setTimeWindow] = useState('24h')

  useEffect(() => {
    fetchMarkets()
  }, [limit, timeWindow])

  const fetchMarkets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/polymarket/markets?limit=${limit}&window=${timeWindow}`)
      const data = await response.json()
      
      if (data.success) {
        setMarkets(data.markets)
      }
    } catch (error) {
      console.error('Error fetching markets:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatVolume = (volume: number | undefined | null) => {
    if (!volume || isNaN(volume)) return "$0"
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`
    return `$${volume.toFixed(0)}`
  }

  const formatPrice = (price: string) => {
    const num = parseFloat(price)
    return `${(num * 100).toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading prediction markets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Most Traded Prediction Markets</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Live from Polymarket • {markets.length} active markets
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={timeWindow === '24h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeWindow('24h')}
          >
            24h Volume
          </Button>
          <Button
            variant={timeWindow === 'total' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeWindow('total')}
          >
            Total Volume
          </Button>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid gap-4">
        {markets.map((market, index) => (
          <Card key={market.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Market Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  {market.image && (
                    <img
                      src={market.image}
                      alt={market.question}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold leading-tight">{market.question}</h3>
                      <Badge variant="outline" className="flex-shrink-0">
                        #{index + 1}
                      </Badge>
                    </div>
                    
                    {market.tags && market.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-2">
                        {market.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcomes */}
                {market.outcomes && market.outcomePrices && Array.isArray(market.outcomes) && Array.isArray(market.outcomePrices) && market.outcomes.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {market.outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm font-medium">{outcome}</span>
                          <Progress 
                            value={parseFloat(market.outcomePrices[idx]) * 100} 
                            className="flex-1 max-w-xs"
                          />
                        </div>
                        <span className="text-sm font-bold text-primary ml-4">
                          {formatPrice(market.outcomePrices[idx])}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Activity className="h-3 w-3" />
                      24h Volume
                    </div>
                    <div className="text-lg font-bold">{formatVolume(market.volume24hr)}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <DollarSign className="h-3 w-3" />
                      Total Volume
                    </div>
                    <div className="text-lg font-bold">{formatVolume(market.volumeTotal)}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      Status
                    </div>
                    <div className="text-sm font-semibold">
                      <Badge variant={market.active ? 'default' : 'secondary'}>
                        {market.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  {market.endDate && (
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="h-3 w-3" />
                        Ends
                      </div>
                      <div className="text-sm font-semibold">
                        {new Date(market.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:w-48 flex lg:flex-col gap-2">
                <Button 
                  className="flex-1" 
                  asChild
                >
                  <a 
                    href={`https://polymarket.com/event/${market.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Trade
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`https://polymarket.com/event/${market.slug}`, '_blank')}
                >
                  View Market
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {markets.length >= limit && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setLimit(limit + 20)}
          >
            Load More Markets
          </Button>
        </div>
      )}

      {markets.length === 0 && (
        <Card className="p-12 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Markets Found</h3>
          <p className="text-muted-foreground">
            Unable to load prediction markets at this time.
          </p>
          <Button className="mt-4" onClick={fetchMarkets}>
            Retry
          </Button>
        </Card>
      )}
    </div>
  )
}
