import { NextRequest, NextResponse } from 'next/server'
import { getLeaders } from '@/lib/prediction/polymarket'

export async function GET(request: NextRequest) {
  try {
    const leaders = await getLeaders()
    return NextResponse.json(leaders)
  } catch (error: any) {
    console.error('Error fetching Polymarket traders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch traders' },
      { status: 500 }
    )
  }
}
