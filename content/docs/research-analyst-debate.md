---
title: Research Debate Analyst
---

# Groq-Powered Multi-Agent Debate Analysis

This project now includes a powerful stock analysis system using **Groq LLMs** with **LangChain** for multi-agent debates. The system provides fast, cost-effective analysis through intelligent agent debates.

## 🚀 Features

- **Multi-Agent Debate System**: Bull vs Bear researchers debate investment thesis
- **Risk Management Consensus**: 3-way debate between conservative, neutral, and aggressive risk managers
- **Fast Inference**: Uses Groq's Llama 3.1 models (70B for deep thinking, 8B for quick thinking)
- **Memory-Based Learning**: Learns from past trading decisions using ChromaDB
- **Flexible Data Sources**: Integrates with yfinance, Alpha Vantage, and more

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Stock Analysis Request                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               Market & News Analysts                         │
│  (Gather data: technical, fundamental, news, social)        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Investment Debate                            │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │ Bull         │  ←───→  │ Bear         │                 │
│  │ Researcher   │         │ Researcher   │                 │
│  └──────────────┘         └──────────────┘                 │
│         │                        │                          │
│         └────────┬───────────────┘                          │
│                  ▼                                           │
│         ┌────────────────┐                                  │
│         │ Research       │ (Judge: BUY/SELL/HOLD)          │
│         │ Manager        │                                  │
│         └────────┬───────┘                                  │
└──────────────────┼──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Trader Decision                          │
│              (Action: BUY/SELL/HOLD)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Risk Management Debate                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │Conservative│ │ Neutral │  │Aggressive│                 │
│  │  Debator  │ │ Debator │  │ Debator  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│         │            │             │                        │
│         └────────────┼─────────────┘                        │
│                      ▼                                       │
│            ┌──────────────────┐                             │
│            │  Risk Manager    │ (Judge final risk level)   │
│            └──────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

### 1. Install Python Dependencies

```bash
cd agents/debate-analyst

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (includes langchain-groq)
pip install -r requirements.txt
```

### 2. Configure Environment

The environment has been configured to use Groq by default:

**Main Project `.env`** (create this file):
```bash
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_DEBATE_ANALYST_URL=http://localhost:8001
```

**Debate-Analyst `.env`** (create at `agents/debate-analyst/.env`):
```bash
GROQ_API_KEY=your_groq_api_key_here
LLM_PROVIDER=groq
DEEP_THINK_LLM=llama-3.1-70b-versatile
QUICK_THINK_LLM=llama-3.1-8b-instant
MAX_DEBATE_ROUNDS=2
```

**Default Configuration** (`agents/debate-analyst/tradingagents/default_config.py`):
```python
DEFAULT_CONFIG = {
    "llm_provider": "groq",
    "deep_think_llm": "llama-3.1-70b-versatile",
    "quick_think_llm": "llama-3.1-8b-instant",
    "max_debate_rounds": 2,
    # ... other settings
}
```

## 🚦 Running the Service

### Start the Debate-Analyst API Server

```bash
cd agents/debate-analyst
source venv/bin/activate
python api_server.py
```

The server will start on `http://localhost:8001`

### Start the Next.js Application

```bash
# From project root
npm run dev
```

The Next.js app will start on `http://localhost:3000`

## 📡 API Usage

### Using the Next.js API Endpoint

The `/api/groq-debate` endpoint provides a comprehensive multi-agent debate analysis interface.

**Base URL**: `https://autoinvestment.broker/api` or `http://localhost:3000/api`

#### Get System Information

```bash
# Get API information about available agents and models
curl https://autoinvestment.broker/api/groq-debate

# Response:
{
  "system": "Multi-Agent Debate Analysis",
  "version": "2.4",
  "agents": [
    "Market Analyst",
    "News Analyst",
    "Fundamentals Analyst",
    "Bull Researcher",
    "Bear Researcher",
    "Research Manager",
    "Trader",
    "Risk Managers",
    "Portfolio Manager",
    "External Consultant"
  ],
  "supported_providers": ["groq", "openai", "anthropic"]
}
```

#### Example 1: Basic Analysis (Groq Default)

```bash
curl -X POST https://autoinvestment.broker/api/groq-debate \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL"
  }'
```

#### Example 2: Extended Debate Analysis

```bash
curl -X POST https://autoinvestment.broker/api/groq-debate \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "TSLA",
    "date": "2024-12-19",
    "max_debate_rounds": 3,
    "llm_provider": "groq"
  }'
```

#### Example 3: Custom Models with Anthropic

```bash
curl -X POST https://autoinvestment.broker/api/groq-debate \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "NVDA",
    "llm_provider": "anthropic",
    "deep_think_llm": "claude-3-5-sonnet-20241022",
    "quick_think_llm": "claude-3-5-haiku-20241022",
    "max_debate_rounds": 2
  }'
```

#### Example 4: OpenAI Models

```bash
curl -X POST https://autoinvestment.broker/api/groq-debate \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "MSFT",
    "llm_provider": "openai",
    "deep_think_llm": "gpt-4o",
    "quick_think_llm": "gpt-4o-mini"
  }'
```

### Response Format

```json
{
  "success": true,
  "symbol": "AAPL",
  "date": "2024-12-19",
  "analysis": {
    "bull_arguments": [
      "Strong fundamentals with consistent 15% YoY revenue growth",
      "Leading market position in premium smartphone segment with 50%+ profit share",
      "Services revenue growing 20% annually with high margins"
    ],
    "bear_arguments": [
      "P/E ratio of 28 above historical average of 22",
      "iPhone revenue growth slowing in key markets",
      "Increasing regulatory pressure in EU and China markets"
    ],
    "final_decision": "BUY",
    "confidence_level": "Medium-High",
    "reasoning": "The bull case is stronger based on fundamental analysis and growth trajectory despite valuation concerns",
    "risk_assessment": "Medium risk with controlled position sizing recommended",
    "thesis_compliance": {
      "financial_health": "9/12",
      "growth_score": "4/6",
      "pe_ratio": 28,
      "adr_status": "NYSE: AAPL",
      "analyst_coverage": 45,
      "compliance_percentage": 45
    }
  },
  "debate_history": [
    {
      "agent": "bull_researcher",
      "message": "THESIS COMPLIANCE:\n✓ Financial Health: 9/12\n✓ Growth Score: 4/6\n...",
      "timestamp": "2024-12-19T10:00:00Z"
    },
    {
      "agent": "bear_researcher",
      "message": "BEAR CASE SUMMARY:\nP/E of 28 exceeds historical average...",
      "timestamp": "2024-12-19T10:01:30Z"
    }
  ],
  "metadata": {
    "llm_provider": "groq",
    "deep_think_model": "llama-3.3-70b-versatile",
    "quick_think_model": "llama-3.1-8b-instant",
    "debate_rounds": 2,
    "total_tokens": 15420,
    "execution_time_ms": 8500
  }
}
```

### Using JavaScript/TypeScript

```
interface GroqDebateRequest {
  symbol: string
  date?: string
  max_debate_rounds?: number
}

async function analyzeStock(symbol: string) {
  const response = await fetch('/api/groq-debate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      symbol,
      date: new Date().toISOString().split('T')[0],
      max_debate_rounds: 2
    })
  })

  const result = await response.json()

  if (result.success) {
    console.log('Bull Arguments:', result.analysis.bull_arguments)
    console.log('Bear Arguments:', result.analysis.bear_arguments)
    console.log('Final Decision:', result.analysis.final_decision)
    console.log('Reasoning:', result.analysis.reasoning)
  }

  return result
}

// Usage
analyzeStock('AAPL').then(result => {
  console.log('Analysis complete:', result)
})
```

### Direct API Server Usage

You can also call the debate-analyst service directly:

```bash
# Direct call to debate-analyst
curl -X POST http://localhost:8001/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "date": "2024-12-11"
  }'
```


## 🧠 How It Works

### 1. Data Collection Phase
- **Market Analyst**: Gathers OHLCV data, technical indicators
- **News Analyst**: Collects and analyzes recent news sentiment
- **Social Media Analyst**: Analyzes social sentiment (optional)
- **Fundamentals Analyst**: Reviews financial statements and metrics

### 2. Investment Debate Phase
- **Bull Researcher**: Presents optimistic case based on data
- **Bear Researcher**: Presents pessimistic case and risks
- **Multiple Rounds**: Agents debate back and forth (default: 2 rounds)
- **Research Manager**: Acts as judge, decides BUY/SELL/HOLD

### 3. Trading Decision
- **Trader Agent**: Makes action decision based on research manager's judgment
- Considers risk appetite, market conditions, portfolio context

### 4. Risk Management Debate
- **Conservative Debator**: Argues for minimal risk exposure
- **Neutral Debator**: Balanced risk perspective
- **Aggressive Debator**: Higher risk for higher returns
- **Risk Manager**: Final judgment on position size and risk level

### 5. Memory & Learning
- All decisions are stored in ChromaDB vector database
- Future analyses retrieve similar past situations
- Agents learn from past successes and failures
