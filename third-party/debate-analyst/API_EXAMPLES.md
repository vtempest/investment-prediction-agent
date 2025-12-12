# TradingAgents API Examples

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Examples](#examples)
- [Response Formats](#response-formats)

## Authentication

Currently, no authentication is required. For production, consider adding API key authentication.

## Endpoints

### Health Check
**GET** `/health`

Check if the API is running.

```bash
curl http://localhost:8001/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-05-10T10:30:00"
}
```

### Get Configuration
**GET** `/config`

Get current trading graph configuration.

```bash
curl http://localhost:8001/config
```

### Analyze Stock
**POST** `/analyze`

Analyze a stock and get trading decision.

#### Request Body
```json
{
  "symbol": "AAPL",
  "date": "2024-05-10",
  "deep_think_llm": "gpt-4o-mini",
  "quick_think_llm": "gpt-4o-mini",
  "max_debate_rounds": 1
}
```

#### Parameters
- `symbol` (required): Stock ticker symbol
- `date` (optional): Analysis date in YYYY-MM-DD format (defaults to today)
- `deep_think_llm` (optional): LLM model for deep analysis
- `quick_think_llm` (optional): LLM model for quick analysis
- `max_debate_rounds` (optional): Number of debate rounds between agents

### Reflect on Trade
**POST** `/reflect`

Update agent memory based on trade results.

#### Request Body
```json
{
  "position_returns": 1000.50
}
```

## Examples

### Example 1: Basic Stock Analysis

```bash
curl -X POST http://localhost:8001/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "date": "2024-05-10"
  }'
```

Response:
```json
{
  "success": true,
  "symbol": "AAPL",
  "date": "2024-05-10",
  "decision": {
    "action": "BUY",
    "confidence": 0.78,
    "analysis": {
      "technical": {
        "trend": "bullish",
        "indicators": {
          "rsi": 65,
          "macd": "positive",
          "moving_averages": "golden_cross"
        }
      },
      "fundamental": {
        "pe_ratio": 28.5,
        "revenue_growth": 0.12,
        "earnings_trend": "positive"
      },
      "sentiment": {
        "news": 0.65,
        "social_media": 0.72
      }
    },
    "risk_assessment": {
      "level": "moderate",
      "factors": ["volatility", "market_conditions"]
    },
    "recommendation": {
      "position_size": 0.15,
      "stop_loss": 145.50,
      "take_profit": 165.00
    }
  },
  "timestamp": "2024-05-10T15:30:45"
}
```

### Example 2: Custom LLM Configuration

```bash
curl -X POST http://localhost:8001/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "NVDA",
    "date": "2024-05-10",
    "deep_think_llm": "gpt-4",
    "max_debate_rounds": 3
  }'
```

### Example 3: Reflection After Trade

```bash
# After closing a position with $1,500 profit
curl -X POST http://localhost:8001/reflect \
  -H "Content-Type: application/json" \
  -d '{
    "position_returns": 1500.00
  }'
```

Response:
```json
{
  "success": true,
  "message": "Reflection completed and memory updated",
  "position_returns": 1500.00,
  "timestamp": "2024-05-10T16:00:00"
}
```

### Example 4: Python Client

```python
import requests

# Initialize client
BASE_URL = "http://localhost:8001"

def analyze_stock(symbol, date=None):
    """Analyze a stock symbol"""
    url = f"{BASE_URL}/analyze"
    payload = {
        "symbol": symbol,
        "date": date
    }
    
    response = requests.post(url, json=payload)
    return response.json()

# Analyze AAPL
result = analyze_stock("AAPL", "2024-05-10")
print(f"Action: {result['decision']['action']}")
print(f"Confidence: {result['decision']['confidence']}")

# Reflect on trade outcome
def reflect_trade(returns):
    """Update memory based on trade results"""
    url = f"{BASE_URL}/reflect"
    payload = {"position_returns": returns}
    
    response = requests.post(url, json=payload)
    return response.json()

# After trade completes
reflect_result = reflect_trade(1500.00)
print(reflect_result['message'])
```

### Example 5: JavaScript/TypeScript Client

```typescript
// TradingAgents API Client
const BASE_URL = 'http://localhost:8001'

interface AnalysisRequest {
  symbol: string
  date?: string
  deep_think_llm?: string
  quick_think_llm?: string
  max_debate_rounds?: number
}

async function analyzeStock(request: AnalysisRequest) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  
  return await response.json()
}

// Usage
const result = await analyzeStock({
  symbol: 'AAPL',
  date: '2024-05-10'
})

console.log('Action:', result.decision.action)
console.log('Confidence:', result.decision.confidence)

// Reflect on trade
async function reflectOnTrade(returns: number) {
  const response = await fetch(`${BASE_URL}/reflect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ position_returns: returns }),
  })
  
  return await response.json()
}

await reflectOnTrade(1500.00)
```

### Example 6: Batch Analysis

```python
import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8001"

# Analyze multiple stocks
symbols = ["AAPL", "GOOGL", "MSFT", "NVDA"]
results = []

for symbol in symbols:
    result = requests.post(
        f"{BASE_URL}/analyze",
        json={"symbol": symbol}
    ).json()
    
    results.append({
        "symbol": symbol,
        "action": result['decision']['action'],
        "confidence": result['decision']['confidence']
    })

# Print summary
for r in results:
    print(f"{r['symbol']}: {r['action']} (confidence: {r['confidence']:.2f})")
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "symbol": "AAPL",
  "date": "2024-05-10",
  "decision": { /* decision object */ },
  "timestamp": "2024-05-10T15:30:45"
}
```

### Error Response
```json
{
  "detail": "Analysis failed: Invalid symbol"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. For production:
- Consider adding rate limiting middleware
- Implement API key authentication
- Monitor usage and costs

## Best Practices

1. **Date Format**: Always use YYYY-MM-DD format for dates
2. **Symbol Format**: Use uppercase ticker symbols (e.g., 'AAPL', not 'aapl')
3. **Error Handling**: Always check the `success` field in responses
4. **Reflection**: Call `/reflect` endpoint after closing positions to improve agent learning
5. **Caching**: Consider caching analysis results for the same symbol/date combination

## Troubleshooting

### Common Errors

1. **"Trading graph not initialized"**
   - Wait a few seconds after starting the server
   - Check server logs for initialization errors

2. **"Failed to fetch data"**
   - Verify API keys are set in `.env`
   - Check internet connection
   - Verify the stock symbol is valid

3. **"Analysis failed"**
   - Check if the date is a trading day (not weekend/holiday)
   - Verify LLM model names are correct
   - Check API key quotas

## Support

For more information:
- Check the main README.md
- Review the FastAPI docs at http://localhost:8001/docs
- Check service logs for detailed error messages
