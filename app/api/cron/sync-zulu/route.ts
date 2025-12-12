import { NextRequest, NextResponse } from 'next/server'
import { syncZuluTraders, syncZuluTraderDetails, getZuluTopByRank } from '@/lib/prediction/zulu'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const listResult = await syncZuluTraders()
    
    const topTraders = await getZuluTopByRank(20)
    const topIds = topTraders.map(t => t.providerId)
    
    const detailsResult = await syncZuluTraderDetails(topIds)
    
    return NextResponse.json({
      success: true,
      traders: listResult.traders,
      details: detailsResult.details,
    })
  } catch (error: any) {
    console.error('Zulu sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    )
  }
}
