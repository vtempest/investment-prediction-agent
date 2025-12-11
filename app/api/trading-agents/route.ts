import { NextRequest, NextResponse } from 'next/server'
import { TradingAgentsGraph } from '@/lib/trading-agents'

interface TradingAgentsRequest {
  symbol: string
  date?: string
  analysts?: Array<'market' | 'social' | 'news' | 'fundamentals'>
  config?: {
    llmProvider?: string
    deepThinkLLM?: string
    quickThinkLLM?: string
    temperature?: number
  }
}

interface TradingAgentsResponse {
  success: boolean
  symbol: string
  date: string
  signal: {
    action: 'BUY' | 'SELL' | 'HOLD'
    confidence: number
    reasoning: string
    timestamp: string
  }
  analysis: {
    marketReport: string
    sentimentReport: string
    newsReport: string
    fundamentalsReport: string
    investmentDebate: {
      bullArguments: string
      bearArguments: string
      judgeDecision: string
    }
    traderDecision: string
  }
  error?: string
}

/**
 * POST /api/trading-agents
 * Run the multi-agent trading system to get a trading signal
 */
export async function POST(request: NextRequest) {
  try {
    const body: TradingAgentsRequest = await request.json()
    const { symbol, date, analysts, config } = body

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol is required' },
        { status: 400 }
      )
    }

    // Use current date if not provided
    const tradeDate = date || new Date().toISOString().split('T')[0]

    // Initialize TradingAgentsGraph
    const selectedAnalysts = analysts || ['market', 'social', 'news', 'fundamentals']
    const tradingConfig = {
      llmProvider: config?.llmProvider || 'openai',
      deepThinkLLM: config?.deepThinkLLM || 'gpt-4o',
      quickThinkLLM: config?.quickThinkLLM || 'gpt-4o-mini',
      temperature: config?.temperature || 0.3,
      apiKeys: {
        openai: process.env.OPENAI_API_KEY || ''
      }
    }

    const graph = new TradingAgentsGraph(selectedAnalysts, false, tradingConfig)

    // Run the analysis
    const { state, signal } = await graph.propagate(symbol, tradeDate)

    // Format response
    const response: TradingAgentsResponse = {
      success: true,
      symbol,
      date: tradeDate,
      signal: {
        action: signal.action,
        confidence: signal.confidence,
        reasoning: signal.reasoning,
        timestamp: signal.timestamp.toISOString()
      },
      analysis: {
        marketReport: state.marketReport,
        sentimentReport: state.sentimentReport,
        newsReport: state.newsReport,
        fundamentalsReport: state.fundamentalsReport,
        investmentDebate: {
          bullArguments: state.investmentDebateState.bullHistory,
          bearArguments: state.investmentDebateState.bearHistory,
          judgeDecision: state.investmentDebateState.judgeDecision
        },
        traderDecision: state.traderInvestmentPlan
      }
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('TradingAgents error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to run trading agents analysis'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/trading-agents
 * Get information about the trading agents system
 */
export async function GET() {
  return NextResponse.json({
    name: 'TradingAgents Multi-Agent System',
    description: 'A multi-agent trading system that uses debate and consensus to generate trading signals',
    version: '1.0.0',
    analysts: ['market', 'social', 'news', 'fundamentals'],
    features: [
      'Technical market analysis with indicators',
      'Bull vs Bear debate for investment decisions',
      'Risk management consensus',
      'Memory-based learning from past decisions',
      'Multiple LLM provider support'
    ],
    usage: {
      endpoint: 'POST /api/trading-agents',
      parameters: {
        symbol: 'Stock symbol (required)',
        date: 'Trade date in YYYY-MM-DD format (optional, defaults to today)',
        analysts: 'Array of analyst types to use (optional)',
        config: 'LLM configuration (optional)'
      }
    }
  })
}
