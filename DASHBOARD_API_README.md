# Dashboard API Integration Guide

Complete guide for using the Stock Prediction Agent API in the Next.js dashboard.

## Overview

The dashboard now includes a comprehensive **API Data** tab that connects to the unified API gateway and visualizes data from:
- **News Researcher (PrimoAgent)**: Multi-agent workflow for comprehensive stock analysis
- **Debate Analyst (TradingAgents)**: Multi-agent debate system for trading decisions
- **Backtesting Engine**: Historical performance analysis

## Quick Start

### 1. Start the Services

**Terminal 1: News Researcher**
```bash
cd agents/news-researcher
python api_server.py  # Runs on port 8002
```

**Terminal 2: Debate Analyst**
```bash
cd agents/debate-analyst
python api_server.py  # Runs on port 8001
```

**Terminal 3: Unified API Gateway (Recommended)**
```bash
cd agents
python unified_api_server.py  # Runs on port 8000
```

**Terminal 4: Dashboard**
```bash
# In project root
npm run dev  # Runs on port 3000
```

### 2. Configure Environment Variables

Copy and configure `.env.example`:

```bash
cp .env.example .env
```

Edit `.env`:
```bash
# Required for dashboard API features
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# LLM API Keys (choose your preferred provider)
GROQ_API_KEY=gsk_...           # Recommended: Fast & cheap
OPENAI_API_KEY=sk-...          # Alternative
ANTHROPIC_API_KEY=sk-ant-...   # Alternative
```

### 3. Access the Dashboard

1. Open http://localhost:3000
2. Navigate to **API Data** tab
3. Select a stock list (e.g., "Magnificent 7")
4. Choose a stock (e.g., "AAPL")
5. Click "Analyze" to get AI-powered insights

## Features

### 📊 Stock Lists

Pre-configured lists of top stocks:

- **Magnificent 7**: AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA
- **S&P 500 Top 10**: AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA, BRK.B, LLY, V
- **Top Tech**: AAPL, MSFT, NVDA, GOOGL, META, TSLA, ORCL, CRM, ADBE, NFLX
- **FAANG**: META, AAPL, AMZN, NFLX, GOOGL
- **Most Active**: TSLA, NVDA, AAPL, AMD, PLTR, SOFI, F, NIO, LCID, RIVN

### 🤖 Analysis Agents

#### **Debate Analyst** (Recommended)
Multi-agent debate system for trading decisions.

**Features:**
- Bull vs Bear debate arguments
- Risk assessment (aggressive vs conservative)
- Trading decision with confidence score
- Position size recommendation
- Detailed reasoning

**Example Response:**
```typescript
{
  decision: {
    action: "BUY",
    confidence: 0.75,
    position_size: 0.10,
    reasoning: "Strong technical indicators...",
    debate_summary: {
      bull_arguments: ["Growth momentum", "..."],
      bear_arguments: ["Valuation concerns", "..."],
      risk_assessment: "Moderate risk"
    }
  }
}
```

#### **News Researcher** (PrimoAgent)
Comprehensive news-driven stock analysis.

**Features:**
- Market data collection
- Technical analysis with indicators
- News sentiment analysis
- Portfolio management recommendations

**Example Response:**
```typescript
{
  result: {
    portfolio_manager_results: {
      decision: "BUY",
      confidence: 0.85,
      reasoning: "Strong fundamentals and positive sentiment"
    },
    technical_analysis_results: {...},
    news_intelligence_results: {...}
  }
}
```

### 📈 Backtesting

Historical performance analysis comparing:
- **PrimoAgent Strategy**: AI-driven trading
- **Buy & Hold Baseline**: Simple buy-and-hold

**Metrics Displayed:**
- Cumulative Return
- Annual Return
- Sharpe Ratio
- Maximum Drawdown
- Win Rate
- Total Trades
- Volatility

### 📡 Service Health Monitoring

Real-time status of all services:
- API Gateway
- News Researcher
- Debate Analyst

## API Client Usage

### JavaScript/TypeScript

```typescript
import { stockAgentsAPI, TOP_STOCKS } from '@/lib/api/stock-agents-api'

// Analyze a single stock with Debate Analyst
const result = await stockAgentsAPI.analyzeWithDebateAnalyst({
  symbol: 'AAPL',
  deep_think_llm: 'llama-3.1-70b-versatile',  // Groq model
  quick_think_llm: 'llama-3.1-8b-instant',     // Fast Groq model
  max_debate_rounds: 1
})

console.log(result.decision.action)  // BUY, SELL, or HOLD
console.log(result.decision.confidence)  // 0.0 - 1.0

// Analyze with News Researcher
const newsResult = await stockAgentsAPI.analyzeWithNewsResearcher({
  symbols: ['AAPL', 'GOOGL', 'MSFT']
})

// Run backtest
const backtest = await stockAgentsAPI.runBacktest({
  symbol: 'AAPL'
})

console.log(backtest.primo_results['Cumulative Return [%]'])
console.log(backtest.comparison.outperformed)  // true/false

// Batch analyze top stocks
const results = await stockAgentsAPI.analyzeTopStocks('mag7', 'debate-analyst')
```

### React Component Example

```tsx
'use client'

import { useState } from 'react'
import { stockAgentsAPI, DebateAnalystAnalysisResponse } from '@/lib/api/stock-agents-api'

export function StockAnalyzer() {
  const [data, setData] = useState<DebateAnalystAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async (symbol: string) => {
    setLoading(true)
    try {
      const result = await stockAgentsAPI.analyzeWithDebateAnalyst({ symbol })
      setData(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={() => analyze('AAPL')} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze AAPL'}
      </button>

      {data && (
        <div>
          <h3>Decision: {data.decision.action}</h3>
          <p>Confidence: {(data.decision.confidence * 100).toFixed(1)}%</p>
          <p>{data.decision.reasoning}</p>
        </div>
      )}
    </div>
  )
}
```

### React Query Integration

```tsx
import { useQuery } from '@tanstack/react-query'
import { stockAgentsAPI, queryKeys } from '@/lib/api/stock-agents-api'

export function useStockAnalysis(symbol: string) {
  return useQuery({
    queryKey: queryKeys.debateAnalyst(symbol),
    queryFn: () => stockAgentsAPI.analyzeWithDebateAnalyst({ symbol }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!symbol
  })
}

// Usage
function StockCard({ symbol }: { symbol: string }) {
  const { data, isLoading, error } = useStockAnalysis(symbol)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h3>{symbol}: {data?.decision.action}</h3>
      <p>Confidence: {(data?.decision.confidence ?? 0) * 100}%</p>
    </div>
  )
}
```

## API Endpoints

### Unified Gateway (Port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/news-researcher/analyze` | POST | Analyze stocks with News Researcher |
| `/news-researcher/analyze/batch` | POST | Batch analyze multiple dates |
| `/debate-analyst/analyze` | POST | Analyze with Debate Analyst |
| `/debate-analyst/reflect` | POST | Update agent memory |
| `/debate-analyst/config` | GET | Get configuration |
| `/backtest` | POST | Run historical backtest |
| `/backtest/available-stocks` | GET | List available stocks |

### Example curl Requests

**Analyze with Debate Analyst:**
```bash
curl -X POST http://localhost:8000/debate-analyst/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "deep_think_llm": "llama-3.1-70b-versatile",
    "quick_think_llm": "llama-3.1-8b-instant"
  }'
```

**Analyze with News Researcher:**
```bash
curl -X POST http://localhost:8000/news-researcher/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL", "GOOGL"],
    "date": "2024-01-15"
  }'
```

**Run Backtest:**
```bash
curl -X POST http://localhost:8000/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "printlog": false
  }'
```

## Dashboard Components

### ApiDataTab

Main component for API data visualization.

**Location:** `components/dashboard/api-data-tab.tsx`

**Features:**
- Stock list selector (Mag 7, FAANG, etc.)
- Individual stock picker
- Agent switcher (News Researcher vs Debate Analyst)
- Real-time analysis execution
- Backtesting runner
- Service health status

**Props:** None (self-contained)

### API Service Layer

**Location:** `lib/api/stock-agents-api.ts`

**Classes:**
- `StockAgentsAPI`: Main API client class
- `LLMConfig`: Configuration types
- Response type definitions

**Constants:**
- `TOP_STOCKS`: Pre-defined stock lists
- `queryKeys`: React Query key factory

## Configuration

### LLM Providers

You can switch between providers by setting environment variables:

**Groq (Recommended - Fast & Cheap):**
```bash
GROQ_API_KEY=gsk_...
```

**OpenAI:**
```bash
OPENAI_API_KEY=sk-...
```

**Anthropic:**
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### Agent Configuration

Configure agent behavior in the respective config files:

**News Researcher:** `agents/news-researcher/src/config/config.json`
```json
{
  "models": {
    "portfolio_manager": {
      "provider": "groq",
      "model": "llama-3.1-70b-versatile",
      "temperature": 0.3
    }
  }
}
```

**Debate Analyst:** `agents/debate-analyst/tradingagents/default_config.py`
```python
DEFAULT_CONFIG = {
    "llm_provider": "groq",
    "deep_think_llm": "llama-3.1-70b-versatile",
    "quick_think_llm": "llama-3.1-8b-instant"
}
```

## Performance Tips

### 1. Use Groq for Fast Inference

Groq provides up to 500 tokens/sec, making analysis much faster:

```typescript
await stockAgentsAPI.analyzeWithDebateAnalyst({
  symbol: 'AAPL',
  deep_think_llm: 'llama-3.1-70b-versatile',  // Groq
  quick_think_llm: 'llama-3.1-8b-instant'     // Groq
})
```

### 2. Implement Caching

Use React Query to cache results:

```typescript
const { data } = useQuery({
  queryKey: ['analysis', symbol],
  queryFn: () => stockAgentsAPI.analyzeWithDebateAnalyst({ symbol }),
  staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
  cacheTime: 10 * 60 * 1000  // Keep in cache for 10 minutes
})
```

### 3. Batch Requests

Analyze multiple stocks efficiently:

```typescript
const results = await stockAgentsAPI.analyzeTopStocks('mag7', 'news-researcher')
// Analyzes all 7 stocks in one request
```

### 4. Use Service Worker for Background Updates

```typescript
// Check health status periodically
setInterval(async () => {
  const health = await stockAgentsAPI.getHealth()
  console.log('Services status:', health.services)
}, 30000)  // Every 30 seconds
```

## Troubleshooting

### Issue: "Failed to fetch"

**Cause:** Services not running or wrong URLs

**Solution:**
```bash
# Check services are running
curl http://localhost:8000/health

# Verify environment variables
echo $NEXT_PUBLIC_API_BASE_URL

# Start missing services
cd agents && python unified_api_server.py
cd agents/news-researcher && python api_server.py
cd agents/debate-analyst && python api_server.py
```

### Issue: "API key not found"

**Cause:** Missing LLM API keys

**Solution:**
```bash
# Set API keys in .env
echo "GROQ_API_KEY=gsk_..." >> .env

# Or export directly
export GROQ_API_KEY="gsk_..."
```

### Issue: Analysis takes too long

**Solution:**
1. Switch to Groq for faster inference
2. Reduce `max_debate_rounds` to 1
3. Use `llama-3.1-8b-instant` for quick analysis

### Issue: CORS errors

**Solution:**
```bash
# Ensure CORS is enabled in API servers (already configured)
# Check browser console for specific error
# Verify API URLs don't have trailing slashes
```

## Examples

### Full Analysis Workflow

```typescript
import { stockAgentsAPI } from '@/lib/api/stock-agents-api'

async function analyzeAndBacktest(symbol: string) {
  // 1. Check service health
  const health = await stockAgentsAPI.getHealth()
  console.log('Services online:', health.services)

  // 2. Run debate analysis
  const debate = await stockAgentsAPI.analyzeWithDebateAnalyst({
    symbol,
    deep_think_llm: 'llama-3.1-70b-versatile',
    max_debate_rounds: 1
  })

  console.log('Decision:', debate.decision.action)
  console.log('Confidence:', debate.decision.confidence)
  console.log('Bull arguments:', debate.decision.debate_summary?.bull_arguments)
  console.log('Bear arguments:', debate.decision.debate_summary?.bear_arguments)

  // 3. Run news analysis
  const news = await stockAgentsAPI.analyzeWithNewsResearcher({
    symbols: [symbol]
  })

  console.log('News decision:', news.result.portfolio_manager_results?.decision)

  // 4. Run backtest
  const backtest = await stockAgentsAPI.runBacktest({ symbol })

  console.log('Cumulative return:', backtest.primo_results['Cumulative Return [%]'])
  console.log('Outperformed:', backtest.comparison.outperformed)

  return { debate, news, backtest }
}

// Usage
analyzeAndBacktest('AAPL').then(results => {
  console.log('Analysis complete:', results)
})
```

## API Reference

See `lib/api/stock-agents-api.ts` for complete type definitions and all available methods.

## Related Documentation

- [Unified API README](/agents/UNIFIED_API_README.md) - LLM client documentation
- [OpenAPI Specification](/agents/openapi.yaml) - Complete API spec
- [Test Suite](/agents/tests/README.md) - API testing guide

## Support

For issues or questions:
- Check service logs in each agent directory
- Review OpenAPI docs at http://localhost:8000/docs
- See troubleshooting section above
- Check GitHub issues: https://github.com/vtempest/stock-prediction-agent/issues
