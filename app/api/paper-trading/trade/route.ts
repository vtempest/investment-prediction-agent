import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { portfolios, positions, trades } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { nanoid } from "nanoid"

interface TradeRequest {
  portfolioId: string
  symbol: string
  action: "buy" | "sell"
  quantity: number // Supports fractional shares
  price?: number // Optional, will fetch current price if not provided
  type?: "market" | "limit"
  strategyId?: string
}

// Helper function to fetch current price
async function getCurrentPrice(symbol: string): Promise<number> {
  try {
    // Use Yahoo Finance API via our stocks endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/stocks/quote/${symbol}`
    )
    const data = await response.json()
    return data.price || data.regularMarketPrice || 0
  } catch (error) {
    console.error("Error fetching price:", error)
    throw new Error("Failed to fetch current price")
  }
}

// Helper function to update portfolio balances
async function updatePortfolioBalances(portfolioId: string, userId: string) {
  // Get all open positions for this portfolio
  const openPositions = await db
    .select()
    .from(positions)
    .where(
      and(
        eq(positions.portfolioId, portfolioId),
        eq(positions.userId, userId),
        eq(positions.closedAt, null)
      )
    )

  let stocksValue = 0
  for (const position of openPositions) {
    stocksValue += position.currentPrice * position.size
  }

  const portfolio = await db
    .select()
    .from(portfolios)
    .where(eq(portfolios.id, portfolioId))
    .limit(1)

  if (portfolio.length > 0) {
    const totalEquity = portfolio[0].cash + stocksValue
    const totalPnL = totalEquity - portfolio[0].initialBalance
    const totalPnLPercent = (totalPnL / portfolio[0].initialBalance) * 100

    await db
      .update(portfolios)
      .set({
        stocks: stocksValue,
        totalEquity,
        totalPnL,
        totalPnLPercent,
        openPositions: openPositions.length,
        updatedAt: new Date(),
      })
      .where(eq(portfolios.id, portfolioId))
  }
}

// POST /api/paper-trading/trade - Execute a paper trade
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: TradeRequest = await req.json()
    const {
      portfolioId,
      symbol,
      action,
      quantity,
      price: providedPrice,
      type = "market",
      strategyId,
    } = body

    // Validate inputs
    if (!portfolioId || !symbol || !action || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Missing required fields or invalid quantity" },
        { status: 400 }
      )
    }

    // Verify portfolio ownership
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

    // Get current price if not provided
    let tradePrice = providedPrice
    if (!tradePrice || type === "market") {
      tradePrice = await getCurrentPrice(symbol)
    }

    const totalValue = tradePrice * quantity
    const tradeTimestamp = portfolio[0].timeTravelEnabled && portfolio[0].simulationDate
      ? portfolio[0].simulationDate
      : new Date()

    // Handle BUY action
    if (action === "buy") {
      // Check if user has enough cash
      if (portfolio[0].cash < totalValue) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        )
      }

      // Deduct cash
      const newCash = portfolio[0].cash - totalValue
      await db
        .update(portfolios)
        .set({ cash: newCash, updatedAt: new Date() })
        .where(eq(portfolios.id, portfolioId))

      // Create or update position
      const existingPosition = await db
        .select()
        .from(positions)
        .where(
          and(
            eq(positions.portfolioId, portfolioId),
            eq(positions.userId, userId),
            eq(positions.asset, symbol),
            eq(positions.closedAt, null)
          )
        )
        .limit(1)

      if (existingPosition.length > 0) {
        // Update existing position
        const pos = existingPosition[0]
        const newSize = pos.size + quantity
        const newAvgPrice = (pos.entryPrice * pos.size + totalValue) / newSize

        await db
          .update(positions)
          .set({
            size: newSize,
            entryPrice: newAvgPrice,
            currentPrice: tradePrice,
            updatedAt: new Date(),
          })
          .where(eq(positions.id, pos.id))
      } else {
        // Create new position
        await db.insert(positions).values({
          id: nanoid(),
          userId,
          portfolioId,
          asset: symbol,
          type: "stock",
          entryPrice: tradePrice,
          currentPrice: tradePrice,
          size: quantity,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          strategy: strategyId,
          openedBy: "paper_trade",
          openedAt: tradeTimestamp,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      // Record trade
      await db.insert(trades).values({
        id: nanoid(),
        userId,
        portfolioId,
        asset: symbol,
        type: "stock",
        action: "buy",
        price: tradePrice,
        size: quantity,
        totalValue,
        pnl: null,
        strategy: strategyId,
        autoTraded: false,
        timestamp: tradeTimestamp,
        createdAt: new Date(),
      })

      // Update portfolio totals
      await updatePortfolioBalances(portfolioId, userId)

      return NextResponse.json({
        success: true,
        message: `Bought ${quantity} shares of ${symbol} at $${tradePrice.toFixed(2)}`,
        trade: {
          symbol,
          action,
          quantity,
          price: tradePrice,
          totalValue,
        },
      })
    }

    // Handle SELL action
    if (action === "sell") {
      // Check if user has position
      const existingPosition = await db
        .select()
        .from(positions)
        .where(
          and(
            eq(positions.portfolioId, portfolioId),
            eq(positions.userId, userId),
            eq(positions.asset, symbol),
            eq(positions.closedAt, null)
          )
        )
        .limit(1)

      if (!existingPosition || existingPosition.length === 0) {
        return NextResponse.json(
          { error: "No position found for this asset" },
          { status: 400 }
        )
      }

      const position = existingPosition[0]

      if (position.size < quantity) {
        return NextResponse.json(
          { error: `Insufficient shares. You have ${position.size} shares` },
          { status: 400 }
        )
      }

      // Calculate PnL
      const proceeds = totalValue
      const costBasis = position.entryPrice * quantity
      const pnl = proceeds - costBasis
      const pnlPercent = (pnl / costBasis) * 100

      // Add cash
      const newCash = portfolio[0].cash + proceeds
      await db
        .update(portfolios)
        .set({ cash: newCash, updatedAt: new Date() })
        .where(eq(portfolios.id, portfolioId))

      // Update or close position
      const newSize = position.size - quantity

      if (newSize <= 0.0001) {
        // Close position
        await db
          .update(positions)
          .set({
            size: 0,
            currentPrice: tradePrice,
            unrealizedPnL: 0,
            unrealizedPnLPercent: 0,
            closedAt: tradeTimestamp,
            updatedAt: new Date(),
          })
          .where(eq(positions.id, position.id))
      } else {
        // Reduce position size
        await db
          .update(positions)
          .set({
            size: newSize,
            currentPrice: tradePrice,
            unrealizedPnL: (tradePrice - position.entryPrice) * newSize,
            unrealizedPnLPercent:
              ((tradePrice - position.entryPrice) / position.entryPrice) * 100,
            updatedAt: new Date(),
          })
          .where(eq(positions.id, position.id))
      }

      // Record trade
      await db.insert(trades).values({
        id: nanoid(),
        userId,
        portfolioId,
        asset: symbol,
        type: "stock",
        action: "sell",
        price: tradePrice,
        size: quantity,
        totalValue,
        pnl,
        strategy: strategyId,
        autoTraded: false,
        timestamp: tradeTimestamp,
        createdAt: new Date(),
      })

      // Update portfolio totals
      await updatePortfolioBalances(portfolioId, userId)

      return NextResponse.json({
        success: true,
        message: `Sold ${quantity} shares of ${symbol} at $${tradePrice.toFixed(2)}`,
        trade: {
          symbol,
          action,
          quantity,
          price: tradePrice,
          totalValue,
          pnl,
          pnlPercent,
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error executing trade:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute trade" },
      { status: 500 }
    )
  }
}
