import { NextRequest, NextResponse } from 'next/server'
import { syncCopyTradingLeadersOrders } from '@/lib/leaders/nvsty-leaders'

export async function GET(request: NextRequest) {
  try {
    const result = await syncCopyTradingLeadersOrders()
    return NextResponse.json({
      success: true,
      message: 'NVSTLY leaders and orders synced successfully',
      traderCount: result.traderCount,
      orderCount: result.orderCount
    })
  } catch (error: any) {
    console.error('NVSTLY sync error:', error)
    return NextResponse.json(
      { error: error.message || 'Sync failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
