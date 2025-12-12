import { NextRequest, NextResponse } from 'next/server'

const BASE = "https://gamma-api.polymarket.com"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const window = searchParams.get('window') || '24h'

    // Pick which field to sort on:
    // - volume24hr: last 24 hours volume
    // - volumeNum: total volume (indexed)
    const sortBy = window === "total" ? "volumeNum" : "volume24hr"

    const url = new URL(`${BASE}/markets`)
    url.searchParams.set("closed", "false")     // active markets only
    url.searchParams.set("active", "true")      // active markets only
    url.searchParams.set("limit", String(limit))
    url.searchParams.set("order", sortBy)
    url.searchParams.set("ascending", "false")

    const res = await fetch(url, { 
      headers: { accept: "application/json" },
      cache: 'no-store' // Fresh data each time
    })
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`)
    }

    const markets = await res.json()

    // Transform data for frontend
    const formattedMarkets = markets.map((m: any) => ({
      id: m.id,
      question: m.question,
      slug: m.slug,
      volume24hr: m.volume24hr,
      volumeTotal: m.volumeNum,
      active: m.active,
      closed: m.closed,
      outcomes: Array.isArray(m.outcomes) ? m.outcomes : [],
      outcomePrices: Array.isArray(m.outcomePrices) ? m.outcomePrices : [],
      image: m.imageUrl || m.image,
      description: m.description,
      endDate: m.endDate,
      groupItemTitle: m.groupItemTitle,
      enableOrderBook: m.enableOrderBook,
      tags: Array.isArray(m.tags) ? m.tags : [],
    }))

    return NextResponse.json({
      success: true,
      markets: formattedMarkets,
      count: formattedMarkets.length,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Polymarket API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch markets',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
