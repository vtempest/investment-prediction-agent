import { db } from '@/lib/db'
import { polymarketLeaders, polymarketPositions, polymarketCategories, polymarketMarkets } from '@/lib/db/schema'
import { eq, desc, asc, and, inArray } from 'drizzle-orm'

// ============================================================================
// Fetching Functions
// ============================================================================

export async function fetchMarkets(limit = 50, sortBy = 'volume24hr') {
  const BASE = "https://gamma-api.polymarket.com"
  const url = new URL(`${BASE}/markets`)

  url.searchParams.set("closed", "false")
  url.searchParams.set("active", "true")
  url.searchParams.set("limit", String(limit))
  url.searchParams.set("order", sortBy)
  url.searchParams.set("ascending", "false")

  const resp = await fetch(url, {
    headers: { accept: "application/json" },
    cache: 'no-store'
  })

  if (!resp.ok) throw new Error(`markets fetch failed: ${resp.status}`)
  return await resp.json()
}

export async function fetchLeaderboard(options: {
  timePeriod?: 'all' | '1d' | '7d' | '30d'
  orderBy?: 'VOL' | 'PNL'
  limit?: number
  offset?: number
  category?: 'overall' | string
} = {}) {
  const {
    timePeriod = 'all',
    orderBy = 'VOL',
    limit = 20,
    offset = 0,
    category = 'overall'
  } = options

  const url = new URL('https://data-api.polymarket.com/v1/leaderboard')
  url.searchParams.set('timePeriod', timePeriod)
  url.searchParams.set('orderBy', orderBy)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))
  url.searchParams.set('category', category)

  const resp = await fetch(url, {
    headers: { accept: "application/json" },
    cache: 'no-store'
  })

  if (!resp.ok) throw new Error(`leaderboard fetch failed: ${resp.status}`)
  return await resp.json()
}

export async function fetchTopTraders(limit = 50) {
  const resp = await fetch('https://polymarketanalytics.com/api/traders-tag-performance', {
    method: 'POST',
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      tag: 'Overall',
      sortColumn: 'overall_gain',
      sortDirection: 'DESC',
      minPnL: -4534159.552280787,
      maxPnL: 3203232.91229432,
      minActivePositions: 0,
      maxActivePositions: 38642,
      minWinAmount: 0,
      maxWinAmount: 20316723.043360095,
      minLossAmount: -20494980.369057264,
      maxLossAmount: 0,
      minWinRate: 0,
      maxWinRate: 100,
      minCurrentValue: 0,
      maxCurrentValue: 1000000000000,
      minTotalPositions: 1,
      maxTotalPositions: 56928,
    }),
  })
  
  if (!resp.ok) throw new Error(`leaders fetch failed: ${resp.status}`)
  const data = await resp.json()
  
  // Handle both array (direct) and object { data: [...] } formats
  let traders = []
  if (Array.isArray(data)) {
    traders = data
  } else if (data && Array.isArray(data.data)) {
    traders = data.data
  } else {
    console.error('Polymarket API returned non-array:', JSON.stringify(data))
    return []
  }
  
  return traders.slice(0, limit)
}

export async function fetchTraderPositions(traderId: string) {
  const resp = await fetch('https://polymarketanalytics.com/api/traders-positions', {
    method: 'POST',
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ trader_id: traderId }),
  })
  
  if (!resp.ok) throw new Error(`positions fetch failed: ${resp.status}`)
  return await resp.json()
}

// ============================================================================
// Database Operations
// ============================================================================

export async function saveLeaders(leadersData: any[]) {
  const now = Date.now()

  for (const leader of leadersData) {
    await db.insert(polymarketLeaders)
      .values({
        trader: leader.trader,
        overallGain: leader.overall_gain || 0,
        winRate: leader.win_rate || 0,
        activePositions: leader.active_positions || 0,
        totalPositions: leader.total_positions || 0,
        currentValue: leader.current_value || 0,
        winAmount: leader.win_amount || 0,
        lossAmount: leader.loss_amount || 0,
        updatedAt: new Date(now),
      })
      .onConflictDoUpdate({
        target: polymarketLeaders.trader,
        set: {
          overallGain: leader.overall_gain || 0,
          winRate: leader.win_rate || 0,
          activePositions: leader.active_positions || 0,
          totalPositions: leader.total_positions || 0,
          currentValue: leader.current_value || 0,
          winAmount: leader.win_amount || 0,
          lossAmount: leader.loss_amount || 0,
          updatedAt: new Date(now),
        },
      })
  }
}

export async function saveLeaderboardData(leaderboardData: any[]) {
  const now = Date.now()

  for (const entry of leaderboardData) {
    await db.insert(polymarketLeaders)
      .values({
        trader: entry.proxyWallet,
        rank: parseInt(entry.rank),
        userName: entry.userName || null,
        xUsername: entry.xUsername || null,
        verifiedBadge: entry.verifiedBadge || false,
        profileImage: entry.profileImage || null,
        vol: entry.vol || 0,
        pnl: entry.pnl || 0,
        updatedAt: new Date(now),
      })
      .onConflictDoUpdate({
        target: polymarketLeaders.trader,
        set: {
          rank: parseInt(entry.rank),
          userName: entry.userName || null,
          xUsername: entry.xUsername || null,
          verifiedBadge: entry.verifiedBadge || false,
          profileImage: entry.profileImage || null,
          vol: entry.vol || 0,
          pnl: entry.pnl || 0,
          updatedAt: new Date(now),
        },
      })
  }
}

export async function savePositions(traderId: string, positionsData: any[]) {
  const now = Date.now()
  
  for (const pos of positionsData) {
    const tags = JSON.stringify(pos.tags || pos.market_tags || [])
    const posId = `${traderId}-${pos.market_id || pos.id || Math.random()}`
    
    await db.insert(polymarketPositions)
      .values({
        id: posId,
        traderId: traderId,
        marketId: pos.market_id || pos.id,
        marketTitle: pos.market_title || pos.title || '',
        cashPnl: pos.cashPnl || pos.cash_pnl || 0,
        realizedPnl: pos.realizedPnl || pos.realized_pnl || 0,
        tags: tags,
        createdAt: new Date(now),
      })
      .onConflictDoUpdate({
        target: polymarketPositions.id,
        set: {
          cashPnl: pos.cashPnl || pos.cash_pnl || 0,
          realizedPnl: pos.realizedPnl || pos.realized_pnl || 0,
          tags: tags,
        },
      })
  }
}

export async function saveCategories(categoriesData: any[]) {
  const now = Date.now()

  await db.delete(polymarketCategories)

  for (const cat of categoriesData) {
    await db.insert(polymarketCategories)
      .values({
        tag: cat.tag,
        pnl: cat.pnl,
        updatedAt: new Date(now),
      })
  }
}

export async function saveMarkets(marketsData: any[]) {
  const now = Date.now()

  for (const market of marketsData) {
    await db.insert(polymarketMarkets)
      .values({
        id: market.id,
        question: market.question,
        slug: market.slug,
        description: market.description || null,
        image: market.imageUrl || market.image || null,
        volume24hr: market.volume24hr || 0,
        volumeTotal: market.volumeNum || market.volumeTotal || 0,
        active: market.active ?? true,
        closed: market.closed ?? false,
        outcomes: JSON.stringify(market.outcomes || []),
        outcomePrices: JSON.stringify(market.outcomePrices || []),
        tags: JSON.stringify(market.tags || []),
        endDate: market.endDate || null,
        groupItemTitle: market.groupItemTitle || null,
        enableOrderBook: market.enableOrderBook ?? false,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      })
      .onConflictDoUpdate({
        target: polymarketMarkets.id,
        set: {
          question: market.question,
          description: market.description || null,
          image: market.imageUrl || market.image || null,
          volume24hr: market.volume24hr || 0,
          volumeTotal: market.volumeNum || market.volumeTotal || 0,
          active: market.active ?? true,
          closed: market.closed ?? false,
          outcomes: JSON.stringify(market.outcomes || []),
          outcomePrices: JSON.stringify(market.outcomePrices || []),
          tags: JSON.stringify(market.tags || []),
          endDate: market.endDate || null,
          groupItemTitle: market.groupItemTitle || null,
          enableOrderBook: market.enableOrderBook ?? false,
          updatedAt: new Date(now),
        },
      })
  }
}

// ============================================================================
// Query Functions
// ============================================================================

export async function getLeaders(orderBy: 'vol' | 'pnl' | 'overallGain' = 'vol', limit = 50) {
  const orderByColumn = orderBy === 'vol'
    ? polymarketLeaders.vol
    : orderBy === 'pnl'
    ? polymarketLeaders.pnl
    : polymarketLeaders.overallGain

  return await db.select()
    .from(polymarketLeaders)
    .orderBy(desc(orderByColumn))
    .limit(limit)
}

export async function getTraderPositions(traderId: string) {
  return await db.select()
    .from(polymarketPositions)
    .where(eq(polymarketPositions.traderId, traderId))
}

export async function getCategories() {
  const best = await db.select()
    .from(polymarketCategories)
    .orderBy(desc(polymarketCategories.pnl))
    .limit(20)

  const worst = await db.select()
    .from(polymarketCategories)
    .orderBy(asc(polymarketCategories.pnl))
    .limit(20)

  return { best, worst }
}

export async function getMarkets(options: {
  limit?: number
  sortBy?: 'volume24hr' | 'volumeTotal' | 'createdAt'
  category?: string
  activeOnly?: boolean
} = {}) {
  const {
    limit = 50,
    sortBy = 'volume24hr',
    category,
    activeOnly = true
  } = options

  let query = db.select().from(polymarketMarkets)

  // Filter by active status
  if (activeOnly) {
    query = query.where(eq(polymarketMarkets.active, true)) as any
  }

  // Sort
  const orderByColumn = sortBy === 'volume24hr'
    ? polymarketMarkets.volume24hr
    : sortBy === 'volumeTotal'
    ? polymarketMarkets.volumeTotal
    : polymarketMarkets.createdAt

  query = query.orderBy(desc(orderByColumn)) as any

  // Apply limit
  query = query.limit(limit) as any

  const results = await query

  // Filter by category if specified
  if (category) {
    return results.filter((market: any) => {
      try {
        const tags = JSON.parse(market.tags || '[]')
        return tags.includes(category)
      } catch {
        return false
      }
    })
  }

  return results
}

export async function getMarketsByCategory() {
  const markets = await db.select()
    .from(polymarketMarkets)
    .where(eq(polymarketMarkets.active, true))
    .orderBy(desc(polymarketMarkets.volume24hr))
    .limit(100)

  const categorized: Record<string, any[]> = {}

  for (const market of markets) {
    try {
      const tags = JSON.parse(market.tags || '[]')
      for (const tag of tags) {
        if (!categorized[tag]) {
          categorized[tag] = []
        }
        categorized[tag].push(market)
      }
    } catch {
      // Skip markets with invalid tags
    }
  }

  return categorized
}

// ============================================================================
// Analysis Functions
// ============================================================================

export function analyzeCategories(allPositions: any[]) {
  const tagPnl = new Map()
  
  for (const pos of allPositions) {
    const pnl = Number(pos.cash_pnl || pos.cashPnl || pos.realized_pnl || pos.realizedPnl || 0)
    if (!pnl) continue
    
    let tags = pos.tags || pos.market_tags || []
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags)
      } catch {
        tags = []
      }
    }
    
    for (const tag of tags) {
      const prev = tagPnl.get(tag) || 0
      tagPnl.set(tag, prev + pnl)
    }
  }
  
  const arr = Array.from(tagPnl.entries()).map(([tag, pnl]) => ({ tag, pnl }))
  arr.sort((a, b) => b.pnl - a.pnl)
  
  const best = arr.slice(0, 20)
  const worst = [...arr].sort((a, b) => a.pnl - b.pnl).slice(0, 20)
  
  return { best, worst }
}

// ============================================================================
// Main Sync Function
// ============================================================================

export async function syncMarkets(limit = 100) {
  console.log('Starting Polymarket markets sync...')

  const markets = await fetchMarkets(limit, 'volume24hr')
  await saveMarkets(markets)
  console.log(`Saved ${markets.length} markets`)

  return { markets: markets.length }
}

export async function syncLeaderboard(options: {
  timePeriod?: 'all' | '1d' | '7d' | '30d'
  orderBy?: 'VOL' | 'PNL'
  limit?: number
} = {}) {
  console.log('Starting Polymarket leaderboard sync...')

  const leaderboard = await fetchLeaderboard(options)
  await saveLeaderboardData(leaderboard)
  console.log(`Saved ${leaderboard.length} leaderboard entries`)

  return { leaders: leaderboard.length }
}

export async function syncLeadersAndCategories() {
  console.log('Starting Polymarket sync...')

  const leaders = await fetchTopTraders(50)
  await saveLeaders(leaders)
  console.log(`Saved ${leaders.length} leaders`)

  const allPositions = []
  for (const trader of leaders) {
    const traderId = trader.trader
    const positions = await fetchTraderPositions(traderId)
    await savePositions(traderId, positions)
    allPositions.push(...positions)
    console.log(`Saved positions for trader ${traderId}`)
  }

  const categories = analyzeCategories(allPositions)
  await saveCategories([...categories.best, ...categories.worst])
  console.log(`Saved ${categories.best.length + categories.worst.length} categories`)

  return { leaders: leaders.length, positions: allPositions.length }
}

export async function syncAll() {
  console.log('Starting full Polymarket sync...')

  const marketsResult = await syncMarkets()
  const leaderboardResult = await syncLeaderboard({ limit: 100, orderBy: 'VOL' })
  const leadersResult = await syncLeadersAndCategories()

  return {
    markets: marketsResult.markets,
    leaderboard: leaderboardResult.leaders,
    leaders: leadersResult.leaders,
    positions: leadersResult.positions
  }
}
