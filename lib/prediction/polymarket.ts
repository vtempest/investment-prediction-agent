import { db } from '@/lib/db'
import { polymarketLeaders, polymarketPositions, polymarketCategories } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'

// ============================================================================
// Fetching Functions
// ============================================================================

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
  
  if (!Array.isArray(data)) {
    console.error('Polymarket API returned non-array:', JSON.stringify(data).substring(0, 200))
    return []
  }
  
  return data.slice(0, limit)
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

// ============================================================================
// Query Functions
// ============================================================================

export async function getLeaders() {
  return await db.select()
    .from(polymarketLeaders)
    .orderBy(desc(polymarketLeaders.overallGain))
    .limit(50)
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
