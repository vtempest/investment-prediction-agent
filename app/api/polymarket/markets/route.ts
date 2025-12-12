import { NextRequest, NextResponse } from 'next/server'
import { getMarkets, syncMarkets } from '@/lib/prediction/polymarket'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const window = searchParams.get('window') || '24h'
    const category = searchParams.get('category') || undefined
    const sync = searchParams.get('sync') === 'true'

    // If sync requested, fetch fresh data from API
    if (sync) {
      await syncMarkets(limit)
    }

    // Pick which field to sort on
    const sortBy = window === "total" ? "volumeTotal" : "volume24hr"

    // Get markets from database
    const markets = await getMarkets({
      limit,
      sortBy: sortBy as any,
      category,
      activeOnly: true
    })

    // Transform data for frontend
    const formattedMarkets = markets.map((m: any) => ({
      id: m.id,
      question: m.question,
      slug: m.slug,
      volume24hr: m.volume24hr,
      volumeTotal: m.volumeTotal,
      active: m.active,
      closed: m.closed,
      outcomes: JSON.parse(m.outcomes || '[]'),
      outcomePrices: JSON.parse(m.outcomePrices || '[]'),
      image: m.image,
      description: m.description,
      endDate: m.endDate,
      groupItemTitle: m.groupItemTitle,
      enableOrderBook: m.enableOrderBook,
      tags: JSON.parse(m.tags || '[]'),
    }))

    return NextResponse.json({
      success: true,
      markets: formattedMarkets,
      count: formattedMarkets.length,
      source: sync ? 'api-sync' : 'database',
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

// POST endpoint for manual sync
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const limit = body.limit || 100

    const result = await syncMarkets(limit)

    return NextResponse.json({
      success: true,
      synced: result.markets,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Polymarket sync error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync markets',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
