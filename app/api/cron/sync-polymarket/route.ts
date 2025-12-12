import { NextRequest, NextResponse } from 'next/server'
import { syncLeadersAndCategories } from '@/lib/prediction/polymarket'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const result = await syncLeadersAndCategories()
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error('Polymarket sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    )
  }
}
