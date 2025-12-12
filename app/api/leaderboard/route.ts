import { NextRequest, NextResponse } from 'next/server'
import { getZuluTraders } from '@/lib/prediction/zulu'
import { getLeaders } from '@/lib/prediction/polymarket'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const source = searchParams.get('source') || 'zulu'
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    let data: any[] = []

    if (source === 'zulu') {
      const zuluTraders = await getZuluTraders(limit)
      data = zuluTraders.map((t, index) => ({
        id: t.providerId.toString(),
        rank: index + 1,
        name: t.name,
        overallPnL: t.roiProfit || 0,
        winRate: typeof t.winRate === 'number' ? t.winRate : parseFloat(t.winRate || '0'),
        activePositions: 0, // Not directly available in summary
        currentValue: t.balance || 0,
        avgHoldingPeriod: t.avgTradeSeconds ? `${Math.round(t.avgTradeSeconds / 3600)}h` : 'N/A',
        markets: ['Forex', 'Indices'], // Placeholder/Generic
        maxDrawdown: `${t.maxDrawdownPercent}%`,
        volatility: 'Medium', // Placeholder
        type: t.isEa ? 'bot' : 'expert'
      }))
    } else if (source === 'polymarket') {
      const polyLeaders = await getLeaders()
      data = polyLeaders.slice(0, limit).map((t, index) => ({
        id: t.trader,
        rank: index + 1,
        name: t.trader.substring(0, 8) + '...', // Shorten address
        overallPnL: t.overallGain || 0,
        winRate: (t.winRate || 0) * 100,
        activePositions: t.activePositions || 0,
        currentValue: t.currentValue || 0,
        avgHoldingPeriod: 'N/A',
        markets: ['Prediction'],
        maxDrawdown: 'N/A',
        volatility: 'High',
        type: 'whale'
      }))
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Leaderboard fetch failed:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
