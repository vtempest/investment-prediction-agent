import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { nvstlyLeaders, nvstlyOrders } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Fetch all leaders from database, ordered by rank
    const leaders = await db.select()
      .from(nvstlyLeaders)
      .orderBy(nvstlyLeaders.rank)

    // Fetch orders for each leader
    const leadersWithOrders = await Promise.all(
      leaders.map(async (leader) => {
        const orders = await db.select()
          .from(nvstlyOrders)
          .where(eq(nvstlyOrders.traderId, leader.id))
          .orderBy(desc(nvstlyOrders.time))

        return {
          ...leader,
          orders: orders.map(order => ({
            symbol: order.symbol,
            type: order.type,
            price: order.price,
            time: order.time?.toISOString(),
            gain: order.gain,
            previousPrice: order.previousPrice,
          }))
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: leadersWithOrders
    })
  } catch (error: any) {
    console.error('Failed to fetch NVSTLY leaders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaders' },
      { status: 500 }
    )
  }
}
