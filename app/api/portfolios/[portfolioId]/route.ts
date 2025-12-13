import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { portfolios, positions, trades } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"

// GET /api/portfolios/[portfolioId] - Get specific portfolio with details
export async function GET(
  req: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolioId = params.portfolioId

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

    // Get positions for this portfolio
    const portfolioPositions = await db
      .select()
      .from(positions)
      .where(
        and(
          eq(positions.portfolioId, portfolioId),
          eq(positions.userId, userId)
        )
      )

    // Get recent trades for this portfolio
    const portfolioTrades = await db
      .select()
      .from(trades)
      .where(
        and(eq(trades.portfolioId, portfolioId), eq(trades.userId, userId))
      )
      .orderBy(sql`${trades.timestamp} DESC`)
      .limit(50)

    return NextResponse.json({
      portfolio: portfolio[0],
      positions: portfolioPositions,
      recentTrades: portfolioTrades,
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    )
  }
}

// PATCH /api/portfolios/[portfolioId] - Update portfolio
export async function PATCH(
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

    // Verify ownership
    const existing = await db
      .select()
      .from(portfolios)
      .where(
        and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId))
      )
      .limit(1)

    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    // Allow updating specific fields
    const allowedFields = [
      "name",
      "type",
      "isActive",
      "timeTravelEnabled",
      "simulationDate",
      "autoTradingEnabled",
      "autoTradingStrategies",
      "autoTradingRiskLimit",
      "autoTradingMaxDaily",
      "linkedBroker",
      "brokerAccountId",
    ]

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })

    // If setting this portfolio as active, deactivate others
    if (body.isActive === true) {
      await db
        .update(portfolios)
        .set({ isActive: false })
        .where(eq(portfolios.userId, userId))
    }

    await db
      .update(portfolios)
      .set(updateData)
      .where(eq(portfolios.id, portfolioId))

    const updated = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, portfolioId))
      .limit(1)

    return NextResponse.json({ portfolio: updated[0] })
  } catch (error) {
    console.error("Error updating portfolio:", error)
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    )
  }
}

// DELETE /api/portfolios/[portfolioId] - Delete portfolio
export async function DELETE(
  req: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const portfolioId = params.portfolioId

    // Verify ownership
    const existing = await db
      .select()
      .from(portfolios)
      .where(
        and(eq(portfolios.id, portfolioId), eq(portfolios.userId, userId))
      )
      .limit(1)

    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Delete associated positions and trades (cascade)
    await db.delete(positions).where(eq(positions.portfolioId, portfolioId))
    await db.delete(trades).where(eq(trades.portfolioId, portfolioId))
    await db.delete(portfolios).where(eq(portfolios.id, portfolioId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting portfolio:", error)
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    )
  }
}
