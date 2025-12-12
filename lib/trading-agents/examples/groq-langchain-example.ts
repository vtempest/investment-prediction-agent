/**
 * Example: Using Groq with LangChain-style Tools for Stock Analysis
 *
 * This example demonstrates how to use the Groq API with LangChain-compatible
 * tools for stock analysis with the trading agents.
 */

import { createLLM } from '../utils/llm-client'
import { TradingConfig } from '../types'
import {
  AgentExecutor,
  tradingTools,
  groqDebateTool,
  getStockDataTool,
  getTechnicalIndicatorsTool,
  getFundamentalsTool
} from '../tools/langchain-tools'

/**
 * Example 1: Simple Groq Chat
 */
async function simpleGroqChat() {
  console.log('=== Example 1: Simple Groq Chat ===\n')

  const config: TradingConfig = {
    llmProvider: 'groq',
    deepThinkLLM: 'llama-3.3-70b-versatile',
    quickThinkLLM: 'llama-3.1-8b-instant',
    temperature: 0.3,
    apiKeys: {
      groq: process.env.GROQ_API_KEY || ''
    }
  }

  const llm = createLLM(config, config.quickThinkLLM)

  const response = await llm.invoke([
    { role: 'user', content: 'Explain what technical analysis is in stock trading in 2 sentences.' }
  ])

  console.log('Response:', response.content)
  console.log()
}

/**
 * Example 2: Using Tools with Groq
 */
async function groqWithTools() {
  console.log('=== Example 2: Groq with Stock Data Tools ===\n')

  const config: TradingConfig = {
    llmProvider: 'groq',
    deepThinkLLM: 'llama-3.3-70b-versatile',
    quickThinkLLM: 'llama-3.1-8b-instant',
    temperature: 0.3,
    apiKeys: {
      groq: process.env.GROQ_API_KEY || ''
    }
  }

  const llm = createLLM(config, config.deepThinkLLM)

  // Create agent executor with tools
  const agent = new AgentExecutor(llm, [
    getStockDataTool,
    getTechnicalIndicatorsTool,
    getFundamentalsTool
  ])

  const result = await agent.run(
    'Analyze Apple (AAPL) stock. Get the stock data for the last 30 days, calculate RSI and MACD indicators, and provide a brief analysis.'
  )

  console.log('Agent Analysis:', result)
  console.log()
}

/**
 * Example 3: Multi-Agent Debate Analysis
 */
async function groqDebateAnalysis() {
  console.log('=== Example 3: Groq Multi-Agent Debate Analysis ===\n')

  const config: TradingConfig = {
    llmProvider: 'groq',
    deepThinkLLM: 'llama-3.3-70b-versatile',
    quickThinkLLM: 'llama-3.1-8b-instant',
    temperature: 0.3,
    apiKeys: {
      groq: process.env.GROQ_API_KEY || ''
    }
  }

  const llm = createLLM(config, config.quickThinkLLM)

  // Create agent executor with debate tool
  const agent = new AgentExecutor(llm, [groqDebateTool])

  const result = await agent.run(
    'Run a comprehensive debate analysis on Tesla (TSLA) stock using the Groq multi-agent system. I want to know if I should buy, sell, or hold.'
  )

  console.log('Debate Analysis Result:', result)
  console.log()
}

/**
 * Example 4: Comprehensive Stock Analysis with All Tools
 */
async function comprehensiveAnalysis() {
  console.log('=== Example 4: Comprehensive Analysis with All Tools ===\n')

  const config: TradingConfig = {
    llmProvider: 'groq',
    deepThinkLLM: 'llama-3.3-70b-versatile',
    quickThinkLLM: 'llama-3.1-8b-instant',
    temperature: 0.3,
    apiKeys: {
      groq: process.env.GROQ_API_KEY || ''
    }
  }

  const llm = createLLM(config, config.deepThinkLLM)

  // Create agent executor with all available tools
  const agent = new AgentExecutor(llm, tradingTools, 10)

  const result = await agent.run(
    `Perform a comprehensive analysis of Microsoft (MSFT):
    1. Get stock data for the last 90 days
    2. Calculate key technical indicators (RSI, MACD, SMA50, SMA200)
    3. Get fundamental data
    4. Run a Groq multi-agent debate analysis
    5. Provide a final recommendation with confidence level`
  )

  console.log('Comprehensive Analysis:', result)
  console.log()
}

/**
 * Example 5: Direct Tool Usage (without agent executor)
 */
async function directToolUsage() {
  console.log('=== Example 5: Direct Tool Usage ===\n')

  // Get stock data
  const stockDataResult = await getStockDataTool.func({
    symbol: 'NVDA',
    startDate: '2024-11-01',
    endDate: '2024-12-11'
  })

  console.log('Stock Data for NVDA:')
  console.log(stockDataResult)
  console.log()

  // Get fundamentals
  const fundamentalsResult = await getFundamentalsTool.func({
    symbol: 'NVDA'
  })

  console.log('Fundamentals for NVDA:')
  console.log(fundamentalsResult)
  console.log()
}

/**
 * Example 6: Comparing Multiple Stocks
 */
async function compareStocks() {
  console.log('=== Example 6: Comparing Multiple Stocks ===\n')

  const config: TradingConfig = {
    llmProvider: 'groq',
    deepThinkLLM: 'llama-3.3-70b-versatile',
    quickThinkLLM: 'llama-3.1-8b-instant',
    temperature: 0.3,
    apiKeys: {
      groq: process.env.GROQ_API_KEY || ''
    }
  }

  const llm = createLLM(config, config.deepThinkLLM)
  const agent = new AgentExecutor(llm, tradingTools, 15)

  const result = await agent.run(
    `Compare these tech stocks: AAPL, MSFT, GOOGL, NVDA
    For each:
    1. Get fundamental data
    2. Calculate RSI for the last 30 days
    3. Run a quick debate analysis

    Then rank them from best to worst investment opportunity.`
  )

  console.log('Stock Comparison:', result)
  console.log()
}

/**
 * Main function to run examples
 */
async function main() {
  // Check if GROQ_API_KEY is set
  if (!process.env.GROQ_API_KEY) {
    console.error('Error: GROQ_API_KEY environment variable is not set')
    console.log('Please set it in your .env file or export it:')
    console.log('  export GROQ_API_KEY=your_api_key_here')
    return
  }

  console.log('🚀 Groq + LangChain Tools Examples\n')
  console.log('='+ '='.repeat(50) + '\n')

  try {
    // Run examples
    // Uncomment the examples you want to run:

    await simpleGroqChat()

    // await groqWithTools()

    // await groqDebateAnalysis()

    // await comprehensiveAnalysis()

    // await directToolUsage()

    // await compareStocks()

  } catch (error: any) {
    console.error('Error running examples:', error.message)
    console.error(error)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export {
  simpleGroqChat,
  groqWithTools,
  groqDebateAnalysis,
  comprehensiveAnalysis,
  directToolUsage,
  compareStocks
}
