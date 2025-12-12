# Groq + LangChain Integration for TypeScript Trading Agents

This guide explains how to use Groq API with LangChain-style tools in the TypeScript trading agents system.

## 🎯 Overview

The integration provides:

- **Groq LLM Support**: Fast inference with Llama 3.1 models (70B and 8B)
- **LangChain-style Tools**: Standardized tool interface compatible with function calling
- **Agent Executor**: Orchestrates LLM + tools for complex workflows
- **Stock Analysis Tools**: Pre-built tools for market data, indicators, fundamentals, and multi-agent debates

## 🚀 Quick Start

### 1. Set Up Environment

Add to your `.env` file:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com)

### 2. Basic Usage

```typescript
import { createLLM } from '@/lib/trading-agents/utils/llm-client'
import { TradingConfig } from '@/lib/trading-agents/types'

const config: TradingConfig = {
  llmProvider: 'groq',
  deepThinkLLM: 'llama-3.3-70b-versatile',
  quickThinkLLM: 'llama-3.1-8b-instant',
  temperature: 0.3,
  apiKeys: {
    groq: process.env.GROQ_API_KEY
  }
}

const llm = createLLM(config, config.quickThinkLLM)

const response = await llm.invoke('What is technical analysis?')
console.log(response.content)
```

### 3. Using Tools

```typescript
import { AgentExecutor, tradingTools } from '@/lib/trading-agents/tools/langchain-tools'

const llm = createLLM(config, config.deepThinkLLM)
const agent = new AgentExecutor(llm, tradingTools)

const result = await agent.run(
  'Analyze Apple stock and provide a recommendation'
)
```

## 🛠️ Available Tools

### 1. `get_stock_data`
Fetch historical OHLCV data.

```typescript
{
  symbol: 'AAPL',
  startDate: '2024-11-01',
  endDate: '2024-12-11'
}
```

### 2. `get_technical_indicators`
Calculate indicators (SMA, EMA, RSI, MACD, Bollinger, ATR, VWMA).

```typescript
{
  symbol: 'AAPL',
  startDate: '2024-10-01',
  endDate: '2024-12-11',
  indicators: ['rsi', 'macd', 'sma50', 'sma200']
}
```

### 3. `get_fundamentals`
Get fundamental metrics (P/E, market cap, revenue, etc.).

```typescript
{
  symbol: 'AAPL'
}
```

### 4. `get_news`
Fetch recent news articles.

```typescript
{
  symbol: 'AAPL',
  limit: 10
}
```

### 5. `groq_debate_analysis`
Run multi-agent debate (Bull vs Bear, Risk consensus).

```typescript
{
  symbol: 'AAPL',
  date: '2024-12-11',
  maxDebateRounds: 2
}
```

## 📖 Usage Examples

### Example 1: Simple Chat

```typescript
import { createLLM } from '@/lib/trading-agents/utils/llm-client'

const config = {
  llmProvider: 'groq',
  quickThinkLLM: 'llama-3.1-8b-instant',
  apiKeys: { groq: process.env.GROQ_API_KEY }
}

const llm = createLLM(config, config.quickThinkLLM)
const response = await llm.invoke('Explain RSI indicator')

console.log(response.content)
```

### Example 2: Stock Analysis with Tools

```typescript
import { AgentExecutor, tradingTools } from '@/lib/trading-agents/tools/langchain-tools'

const agent = new AgentExecutor(llm, tradingTools)

const analysis = await agent.run(`
  Analyze Tesla (TSLA):
  1. Get last 30 days of price data
  2. Calculate RSI and MACD
  3. Get fundamental metrics
  4. Provide buy/sell/hold recommendation
`)

console.log(analysis)
```

### Example 3: Multi-Agent Debate

```typescript
import { groqDebateTool } from '@/lib/trading-agents/tools/langchain-tools'

const result = await groqDebateTool.func({
  symbol: 'NVDA',
  date: '2024-12-11',
  maxDebateRounds: 2
})

console.log(JSON.parse(result))
// Output includes:
// - bull_arguments
// - bear_arguments
// - final_decision
// - risk_assessment
// - confidence
// - reasoning
```

### Example 4: Direct Tool Usage

```typescript
import { getStockDataTool, getFundamentalsTool } from '@/lib/trading-agents/tools/langchain-tools'

// Get stock data
const stockData = await getStockDataTool.func({
  symbol: 'MSFT',
  startDate: '2024-11-01',
  endDate: '2024-12-11'
})

// Get fundamentals
const fundamentals = await getFundamentalsTool.func({
  symbol: 'MSFT'
})

console.log(stockData)
console.log(fundamentals)
```

### Example 5: Comparing Multiple Stocks

```typescript
const agent = new AgentExecutor(llm, tradingTools, 15)

const comparison = await agent.run(`
  Compare these stocks: AAPL, MSFT, GOOGL, NVDA

  For each stock:
  1. Get fundamentals
  2. Calculate RSI for last 30 days
  3. Run debate analysis

  Rank them from best to worst investment.
`)

console.log(comparison)
```

## 🏗️ Architecture

### Tool Interface

Every tool implements this interface:

```typescript
interface Tool {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, any>
    required: string[]
  }
  func: (input: any) => Promise<string>
}
```

### Agent Executor Flow

```
User Prompt
    ↓
  LLM (with tools)
    ↓
Tool Calls? ──No──→ Return Response
    ↓ Yes
Execute Tools
    ↓
Add Results to Context
    ↓
Back to LLM
    ↓
Repeat (max iterations)
```

## 🔧 Configuration

### LLM Providers

```typescript
// Groq (fast, cheap)
llmProvider: 'groq'
deepThinkLLM: 'llama-3.3-70b-versatile'
quickThinkLLM: 'llama-3.1-8b-instant'

// OpenAI (powerful)
llmProvider: 'openai'
deepThinkLLM: 'gpt-4-turbo'
quickThinkLLM: 'gpt-3.5-turbo'

// Anthropic (Claude)
llmProvider: 'anthropic'
deepThinkLLM: 'claude-3-opus-20240229'
quickThinkLLM: 'claude-3-haiku-20240307'
```

### Available Groq Models

```typescript
// Fast and cheap
'llama-3.1-8b-instant'      // 8B params, ~500-1000 tok/s
'llama-3.2-1b-preview'      // 1B params, ultra-fast
'llama-3.2-3b-preview'      // 3B params

// More capable
'llama-3.1-70b-versatile'   // 70B params, ~200-400 tok/s (Legacy)
'llama-3.3-70b-versatile'   // 70B params, latest

// Alternative models
'mixtral-8x7b-32768'        // Mixtral MoE
'gemma2-9b-it'              // Google Gemma
```

## 📊 Performance

### Speed Comparison

| Model | Tokens/Second | Use Case |
|-------|--------------|----------|
| llama-3.1-8b-instant | 500-1000 | Quick queries, simple analysis |
| llama-3.3-70b-versatile | 200-400 | Complex reasoning, debates |
| llama-3.3-70b-versatile | 200-400 | Latest model, improved quality |

### Cost

Groq offers very competitive pricing with generous free tier:
- **Free tier**: 14,400 requests/day
- **Much cheaper than GPT-4** while maintaining good quality
- **70B model**: Excellent reasoning at fraction of GPT-4 cost

## 🔌 API Integration

### Using in Next.js API Routes

```typescript
// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createLLM } from '@/lib/trading-agents/utils/llm-client'
import { AgentExecutor, tradingTools } from '@/lib/trading-agents/tools/langchain-tools'

export async function POST(request: NextRequest) {
  const { symbol, query } = await request.json()

  const config = {
    llmProvider: 'groq',
    deepThinkLLM: 'llama-3.3-70b-versatile',
    apiKeys: { groq: process.env.GROQ_API_KEY }
  }

  const llm = createLLM(config, config.deepThinkLLM)
  const agent = new AgentExecutor(llm, tradingTools)

  const result = await agent.run(query || `Analyze ${symbol}`)

  return NextResponse.json({ result })
}
```

### Using in React Components

```typescript
'use client'

import { useState } from 'react'

export function StockAnalyzer() {
  const [analysis, setAnalysis] = useState('')

  const analyze = async (symbol: string) => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol,
        query: `Analyze ${symbol} using all available tools and provide a recommendation`
      })
    })

    const data = await response.json()
    setAnalysis(data.result)
  }

  return (
    <div>
      <button onClick={() => analyze('AAPL')}>
        Analyze Apple
      </button>
      <pre>{analysis}</pre>
    </div>
  )
}
```

## 🧪 Testing

Run the examples:

```bash
# Set environment variable
export GROQ_API_KEY=your_key_here

# Run examples (if using ts-node)
npx ts-node lib/trading-agents/examples/groq-langchain-example.ts
```

## 🐛 Troubleshooting

### API Key Issues

```bash
# Check if key is set
echo $GROQ_API_KEY

# Test connection
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

### Rate Limits

Groq free tier limits:
- 14,400 requests/day
- 30 requests/minute

If you hit limits:
1. Add retry logic with exponential backoff
2. Use caching for repeated queries
3. Upgrade to paid plan

### Tool Execution Errors

```typescript
try {
  const result = await agent.run(query)
  console.log(result)
} catch (error) {
  console.error('Agent error:', error)
  // Check:
  // 1. API key is valid
  // 2. Tool inputs are correct format
  // 3. Network connectivity
}
```

## 📚 Advanced Usage

### Custom Tools

Create your own tools:

```typescript
import { Tool } from '@/lib/trading-agents/tools/langchain-tools'

const customTool: Tool = {
  name: 'my_custom_tool',
  description: 'Does something amazing',
  inputSchema: {
    type: 'object',
    properties: {
      input: { type: 'string', description: 'Input parameter' }
    },
    required: ['input']
  },
  func: async (input: { input: string }) => {
    // Your custom logic here
    return JSON.stringify({ result: 'Success' })
  }
}

// Use with agent
const agent = new AgentExecutor(llm, [customTool, ...tradingTools])
```

### Chaining Agents

```typescript
// First agent for research
const researchAgent = new AgentExecutor(llm, [
  getStockDataTool,
  getTechnicalIndicatorsTool,
  getFundamentalsTool
])

const research = await researchAgent.run('Research AAPL')

// Second agent for decision
const decisionAgent = new AgentExecutor(llm, [groqDebateTool])

const decision = await decisionAgent.run(`
  Based on this research: ${research}

  Run a debate analysis and make a final recommendation.
`)
```

## 🤝 Contributing

To add new tools:

1. Define the tool in `lib/trading-agents/tools/langchain-tools.ts`
2. Add to `tradingTools` array
3. Update documentation
4. Test with agent executor

## 📖 Related Documentation

- [GROQ_DEBATE_SETUP.md](./GROQ_DEBATE_SETUP.md) - Python multi-agent debate system
- [Groq Documentation](https://console.groq.com/docs)
- [LangChain Tool Calling](https://python.langchain.com/docs/modules/agents/tools/)

## 📝 License

MIT License - See main project license
