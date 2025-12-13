import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { portfolios, positions, trades } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { nanoid } from "nanoid"

// GET /api/portfolios - Get all portfolios for user
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userPortfolios = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .orderBy(desc(portfolios.isActive), desc(portfolios.createdAt))

    return NextResponse.json({ portfolios: userPortfolios })
  } catch (error) {
    console.error("Error fetching portfolios:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    )
  }
}

// POST /api/portfolios - Create new portfolio
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name = "New Portfolio",
      type = "paper",
      initialBalance = 100000,
      startDate,
      linkedBroker,
      brokerAccountId,
      timeTravelEnabled = false,
      simulationDate,
    } = body

    const portfolioId = nanoid()
    const now = new Date()
    const portfolioStartDate = startDate ? new Date(startDate) : now

    const newPortfolio = await db.insert(portfolios).values({
      id: portfolioId,
      userId,
      name,
      type,
      isActive: false, // Don't auto-activate
      linkedBroker,
      brokerAccountId,
      timeTravelEnabled,
      simulationDate: simulationDate ? new Date(simulationDate) : null,
      startDate: portfolioStartDate,
      initialBalance,
      totalEquity: initialBalance,
      cash: initialBalance,
      stocks: 0,
      predictionMarkets: 0,
      margin: 0,
      dailyPnL: 0,
      dailyPnLPercent: 0,
      totalPnL: 0,
      totalPnLPercent: 0,
      winRate: 0,
      openPositions: 0,
      totalTrades: 0,
      createdAt: now,
      updatedAt: now,
    })

    const created = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, portfolioId))
      .limit(1)

    return NextResponse.json({ portfolio: created[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating portfolio:", error)
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    )
  }
}
