#!/usr/bin/env tsx
/**
 * Test script for Groq Agent API Integration
 *
 * This script tests the /api/trading-agents endpoint with Groq configuration.
 * Run with: npx tsx examples/test-groq-agent-api.ts
 */

interface TradingAgentResponse {
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

async function testGroqAgentAPI() {
  console.log('🧪 Testing Groq Agent API Integration\n')
  console.log('=' + '='.repeat(60) + '\n')

  // Get API URL from environment or use default
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const endpoint = `${apiUrl}/api/trading-agents`

  // Test 1: Check API info
  console.log('Test 1: Getting API Information...')
  try {
    const infoResponse = await fetch(endpoint)
    const info = await infoResponse.json()

    console.log('✅ API Info Retrieved')
    console.log(`   Current Provider: ${info.currentProvider}`)
    console.log(`   Supported Providers: ${info.supportedProviders.join(', ')}`)
    console.log(`   Version: ${info.version}`)
    console.log()
  } catch (error: any) {
    console.error('❌ Failed to get API info:', error.message)
    console.log('   Make sure the Next.js server is running: npm run dev')
    return
  }

  // Test 2: Simple analysis with default config
  console.log('Test 2: Running Stock Analysis with Default Config...')
  console.log('   Symbol: AAPL')
  const startTime = Date.now()

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: 'AAPL',
      }),
    })

    const result: TradingAgentResponse = await response.json()
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    if (result.success) {
      console.log(`✅ Analysis Complete (${duration}s)`)
      console.log(`   Symbol: ${result.symbol}`)
      console.log(`   Date: ${result.date}`)
      console.log(`   Action: ${result.signal.action}`)
      console.log(`   Confidence: ${(result.signal.confidence * 100).toFixed(1)}%`)
      console.log(`   Reasoning: ${result.signal.reasoning}`)
      console.log()
    } else {
      console.error('❌ Analysis Failed:', result.error)
      return
    }
  } catch (error: any) {
    console.error('❌ Request failed:', error.message)
    return
  }

  // Test 3: Explicit Groq configuration
  console.log('Test 3: Running Analysis with Explicit Groq Config...')
  console.log('   Symbol: TSLA')
  console.log('   Provider: groq')
  console.log('   Deep Think: llama-3.3-70b-versatile')
  console.log('   Quick Think: llama-3.1-8b-instant')

  const groqStartTime = Date.now()

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: 'TSLA',
        config: {
          llmProvider: 'groq',
          deepThinkLLM: 'llama-3.3-70b-versatile',
          quickThinkLLM: 'llama-3.1-8b-instant',
          temperature: 0.3,
        },
      }),
    })

    const result: TradingAgentResponse = await response.json()
    const duration = ((Date.now() - groqStartTime) / 1000).toFixed(2)

    if (result.success) {
      console.log(`✅ Groq Analysis Complete (${duration}s)`)
      console.log(`   Symbol: ${result.symbol}`)
      console.log(`   Action: ${result.signal.action}`)
      console.log(`   Confidence: ${(result.signal.confidence * 100).toFixed(1)}%`)
      console.log()
      console.log('   Investment Debate Summary:')
      console.log(`   Bull Arguments: ${result.analysis.investmentDebate.bullArguments.substring(0, 100)}...`)
      console.log(`   Bear Arguments: ${result.analysis.investmentDebate.bearArguments.substring(0, 100)}...`)
      console.log()
    } else {
      console.error('❌ Groq Analysis Failed:', result.error)
      if (result.error?.includes('API key')) {
        console.log('   💡 Tip: Make sure GROQ_API_KEY is set in your .env file')
      }
      return
    }
  } catch (error: any) {
    console.error('❌ Groq request failed:', error.message)
    return
  }

  // Test 4: Custom analysts
  console.log('Test 4: Running Analysis with Custom Analysts...')
  console.log('   Symbol: NVDA')
  console.log('   Analysts: market, news only')

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol: 'NVDA',
        analysts: ['market', 'news'],
        config: {
          llmProvider: 'groq',
        },
      }),
    })

    const result: TradingAgentResponse = await response.json()

    if (result.success) {
      console.log(`✅ Custom Analyst Analysis Complete`)
      console.log(`   Action: ${result.signal.action}`)
      console.log(`   Market Report: ${result.analysis.marketReport ? '✓' : '✗'}`)
      console.log(`   News Report: ${result.analysis.newsReport ? '✓' : '✗'}`)
      console.log()
    } else {
      console.error('❌ Custom analyst analysis failed:', result.error)
      return
    }
  } catch (error: any) {
    console.error('❌ Custom analyst request failed:', error.message)
    return
  }

  // Summary
  console.log('=' + '='.repeat(60))
  console.log('🎉 All Tests Passed!')
  console.log()
  console.log('The Groq Agent API integration is working correctly.')
  console.log('You can now use it in your application for real-time stock analysis.')
  console.log()
  console.log('Next steps:')
  console.log('  1. Review the API documentation: GROQ_AGENT_API_GUIDE.md')
  console.log('  2. Integrate into your frontend')
  console.log('  3. Try different stocks and configurations')
  console.log()
}

// Run the tests
if (require.main === module) {
  testGroqAgentAPI().catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
}

export { testGroqAgentAPI }
