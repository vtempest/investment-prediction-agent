import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { portfolios, strategies, signals, trades } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { nanoid } from "nanoid"

// Helper function to execute a trade via paper trading API
async function executeTrade(
  userId: string,
  portfolioId: string,
  symbol: string,
  action: "buy" | "sell",
  quantity: number,
  strategyId: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/paper-trading/trade`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({
        portfolioId,
        symbol,
        action,
        quantity,
        strategyId,
      }),
    }
  )

  return response.json()
}

// Helper to get trading signal from LLM agent
async function getAgentSignal(symbol: string, userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trading-agents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ symbol }),
      }
    )
    return response.json()
  } catch (error) {
    console.error("Error getting agent signal:", error)
    return null
  }
}

// POST /api/auto-trading/execute - Execute auto-trading strategies
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { portfolioId, strategyId, symbols = [] } = body

    if (!portfolioId) {
      return NextResponse.json(
        { error: "portfolioId is required" },
        { status: 400 }
      )
    }

    // Verify portfolio ownership and auto-trading enabled
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

    if (!portfolio[0].autoTradingEnabled) {
      return NextResponse.json(
        { error: "Auto-trading is not enabled for this portfolio" },
        { status: 400 }
      )
    }

    // Get strategies to execute
    let strategiesToExecute

    if (strategyId) {
      // Execute specific strategy
      strategiesToExecute = await db
        .select()
        .from(strategies)
        .where(
          and(
            eq(strategies.id, strategyId),
            eq(strategies.userId, userId),
            eq(strategies.portfolioId, portfolioId)
          )
        )
    } else {
      // Execute all auto-enabled strategies for this portfolio
      strategiesToExecute = await db
        .select()
        .from(strategies)
        .where(
          and(
            eq(strategies.userId, userId),
            eq(strategies.portfolioId, portfolioId),
            eq(strategies.autoExecute, true)
          )
        )
    }

    if (!strategiesToExecute || strategiesToExecute.length === 0) {
      return NextResponse.json(
        { error: "No strategies found for auto-execution" },
        { status: 404 }
      )
    }

    const results = {
      executed: [] as any[],
      skipped: [] as any[],
      errors: [] as any[],
    }

    // Get today's trade count to enforce daily limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTrades = await db
      .select()
      .from(trades)
      .where(
        and(
          eq(trades.portfolioId, portfolioId),
          eq(trades.autoTraded, true)
        )
      )

    if (todayTrades.length >= portfolio[0].autoTradingMaxDaily) {
      return NextResponse.json(
        {
          error: `Daily auto-trading limit reached (${portfolio[0].autoTradingMaxDaily} trades)`,
        },
        { status: 400 }
      )
    }

    // Process each strategy
    for (const strategy of strategiesToExecute) {
      try {
        const config = strategy.config ? JSON.parse(strategy.config) : {}
        const symbolsToTrade =
          symbols.length > 0 ? symbols : config.symbols || []

        for (const symbol of symbolsToTrade) {
          try {
            // Check if we've hit daily limit
            if (results.executed.length >= portfolio[0].autoTradingMaxDaily) {
              results.skipped.push({
                symbol,
                strategy: strategy.name,
                reason: "Daily limit reached",
              })
              continue
            }

            let signal = null

            // Get signal based on strategy type
            if (strategy.type === "llm-agent") {
              // Use LLM agent for signal
              const agentResult = await getAgentSignal(symbol, userId)
              if (agentResult && agentResult.signal) {
                signal = agentResult.signal
              }
            } else {
              // Check existing signals table
              const existingSignals = await db
                .select()
                .from(signals)
                .where(
                  and(eq(signals.userId, userId), eq(signals.asset, symbol))
                )
                .limit(1)

              if (existingSignals.length > 0) {
                signal = existingSignals[0]
              }
            }

            // Evaluate signal against threshold
            if (!signal) {
              results.skipped.push({
                symbol,
                strategy: strategy.name,
                reason: "No signal available",
              })
              continue
            }

            const signalScore = signal.combinedScore || 0
            const threshold = strategy.autoExecuteSignalThreshold || 0.7

            // Determine action
            let action: "buy" | "sell" | null = null
            if (signalScore >= threshold) {
              action = "buy"
            } else if (signalScore <= -threshold) {
              action = "sell"
            }

            if (!action) {
              results.skipped.push({
                symbol,
                strategy: strategy.name,
                reason: `Signal score ${signalScore} below threshold ${threshold}`,
              })
              continue
            }

            // Calculate position size
            const positionSize = strategy.autoExecutePositionSize || 0.1
            const maxTradeValue =
              portfolio[0].totalEquity *
              Math.min(positionSize, portfolio[0].autoTradingRiskLimit)

            // Get current price to calculate shares
            const priceResponse = await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/stocks/quote/${symbol}`
            )
            const priceData = await priceResponse.json()
            const currentPrice = priceData.price || priceData.regularMarketPrice

            if (!currentPrice) {
              results.errors.push({
                symbol,
                strategy: strategy.name,
                error: "Could not fetch current price",
              })
              continue
            }

            const quantity = maxTradeValue / currentPrice

            // Execute trade
            const tradeResult = await executeTrade(
              userId,
              portfolioId,
              symbol,
              action,
              quantity,
              strategy.id
            )

            if (tradeResult.success) {
              results.executed.push({
                symbol,
                strategy: strategy.name,
                action,
                quantity,
                price: currentPrice,
                signal: signalScore,
              })

              // Mark trade as auto-executed
              await db
                .update(trades)
                .set({ autoTraded: true })
                .where(
                  and(
                    eq(trades.portfolioId, portfolioId),
                    eq(trades.asset, symbol),
                    eq(trades.strategy, strategy.id)
                  )
                )
            } else {
              results.errors.push({
                symbol,
                strategy: strategy.name,
                error: tradeResult.error,
              })
            }
          } catch (error) {
            results.errors.push({
              symbol,
              strategy: strategy.name,
              error: error instanceof Error ? error.message : "Unknown error",
            })
          }
        }
      } catch (error) {
        results.errors.push({
          strategy: strategy.name,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        executed: results.executed.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
    })
  } catch (error) {
    console.error("Error executing auto-trading:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to execute auto-trading",
      },
      { status: 500 }
    )
  }
}
