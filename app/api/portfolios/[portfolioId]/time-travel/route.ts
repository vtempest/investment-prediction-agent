import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { portfolios, positions, trades } from "@/lib/db/schema"
import { eq, and, lte } from "drizzle-orm"

// POST /api/portfolios/[portfolioId]/time-travel - Set portfolio to a specific date
export async function POST(
  req: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolioId = params.portfolioId
    const body = await req.json()
    const { targetDate, reset = false } = body

    if (!targetDate) {
      return NextResponse.json(
        { error: "targetDate is required" },
        { status: 400 }
      )
    }

    // Verify ownership
    const portfolio = await db
      .select()
      .from(portfolios)
      .where(
        and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId))
      )
      .limit(1)

    if (!portfolio || portfolio.length === 0) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    const targetDateTime = new Date(targetDate)
    const now = new Date()

    // If reset, clear all positions and trades and reset to initial state
    if (reset) {
      await db.delete(positions).where(eq(positions.portfolioId, portfolioId))
      await db.delete(trades).where(eq(trades.portfolioId, portfolioId))

      await db
        .update(portfolios)
        .set({
          timeTravelEnabled: true,
          simulationDate: targetDateTime,
          startDate: targetDateTime,
          totalEquity: portfolio[0].initialBalance,
          cash: portfolio[0].initialBalance,
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
          updatedAt: now,
        })
        .where(eq(portfolios.id, portfolioId))

      const updated = await db
        .select()
        .from(portfolios)
        .where(eq(portfolios.id, portfolioId))
        .limit(1)

      return NextResponse.json({
        portfolio: updated[0],
        message: `Portfolio reset to ${targetDate}`,
      })
    }

    // Otherwise, just update the simulation date
    await db
      .update(portfolios)
      .set({
        timeTravelEnabled: true,
        simulationDate: targetDateTime,
        updatedAt: now,
      })
      .where(eq(portfolios.id, portfolioId))

    // Recalculate portfolio state based on trades up to target date
    const tradesUpToDate = await db
      .select()
      .from(trades)
      .where(
        and(
          eq(trades.portfolioId, portfolioId),
          lte(trades.timestamp, targetDateTime)
        )
      )

    // Calculate current state from trades
    let cash = portfolio[0].initialBalance
    let stocksValue = 0
    const holdings: Record<string, { shares: number; avgPrice: number }> = {}

    for (const trade of tradesUpToDate) {
      const totalCost = trade.price * trade.size

      if (trade.action === "buy") {
        cash -= totalCost
        if (!holdings[trade.asset]) {
          holdings[trade.asset] = { shares: 0, avgPrice: 0 }
        }
        const prevShares = holdings[trade.asset].shares
        const prevAvg = holdings[trade.asset].avgPrice
        holdings[trade.asset].shares += trade.size
        holdings[trade.asset].avgPrice =
          (prevShares * prevAvg + totalCost) / holdings[trade.asset].shares
      } else if (trade.action === "sell") {
        cash += totalCost
        if (holdings[trade.asset]) {
          holdings[trade.asset].shares -= trade.size
          if (holdings[trade.asset].shares <= 0) {
            delete holdings[trade.asset]
          }
        }
      }
    }

    // For now, we'll use the last known prices from trades
    // In a real implementation, you'd fetch historical prices
    for (const [asset, holding] of Object.entries(holdings)) {
      stocksValue += holding.shares * holding.avgPrice
    }

    const totalEquity = cash + stocksValue
    const totalPnL = totalEquity - portfolio[0].initialBalance
    const totalPnLPercent =
      (totalPnL / portfolio[0].initialBalance) * 100

    await db
      .update(portfolios)
      .set({
        cash,
        stocks: stocksValue,
        totalEquity,
        totalPnL,
        totalPnLPercent,
        updatedAt: now,
      })
      .where(eq(portfolios.id, portfolioId))

    const updated = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, portfolioId))
      .limit(1)

    return NextResponse.json({
      portfolio: updated[0],
      message: `Time traveled to ${targetDate}`,
      holdings,
    })
  } catch (error) {
    console.error("Error time traveling portfolio:", error)
    return NextResponse.json(
      { error: "Failed to time travel portfolio" },
      { status: 500 }
    )
  }
}
