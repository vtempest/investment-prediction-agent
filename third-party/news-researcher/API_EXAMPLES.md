# PrimoAgent API Examples

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
curl http://localhost:8002/health
```

### Analyze Stocks
**POST** `/analyze`

Analyze stocks for a specific date.

#### Request Body
```json
{
  "symbols": ["AAPL", "GOOGL"],
  "date": "2024-05-10"
}
```

### Batch Analysis
**POST** `/analyze/batch`

Analyze stocks across multiple dates.

#### Request Body
```json
{
  "symbols": ["AAPL"],
  "start_date": "2024-05-01",
  "end_date": "2024-05-10"
}
```

### Run Backtest
**POST** `/backtest`

Run backtest for a stock symbol.

#### Request Body
```json
{
  "symbol": "AAPL",
  "data_dir": "./output/csv",
  "printlog": false
}
```

### Get Available Stocks
**GET** `/backtest/available-stocks`

Get list of available stocks for backtesting.

```bash
curl "http://localhost:8002/backtest/available-stocks?data_dir=./output/csv"
```

## Examples

### Example 1: Single Stock Analysis

```bash
curl -X POST http://localhost:8002/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL"],
    "date": "2024-05-10"
  }'
```

Response:
```json
{
  "success": true,
  "symbols": ["AAPL"],
  "date": "2024-05-10",
  "result": {
    "success": true,
    "analyses": {
      "AAPL": {
        "recommendation": "BUY",
        "confidence": 0.85,
        "price_target": 175.00,
        "technical_analysis": {
          "trend": "bullish",
          "support": 160.00,
          "resistance": 180.00
        },
        "fundamental_analysis": {
          "valuation": "fair",
          "growth_potential": "high"
        },
        "risk_factors": [
          "market_volatility",
          "sector_rotation"
        ]
      }
    }
  },
  "timestamp": "2024-05-10T15:30:45"
}
```

### Example 2: Multiple Stocks Analysis

```bash
curl -X POST http://localhost:8002/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL", "GOOGL", "MSFT"],
    "date": "2024-05-10"
  }'
```

### Example 3: Batch Analysis Across Dates

```bash
curl -X POST http://localhost:8002/analyze/batch \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL"],
    "start_date": "2024-05-01",
    "end_date": "2024-05-10"
  }'
```

Response:
```json
{
  "success": true,
  "symbols": ["AAPL"],
  "date_range": {
    "start": "2024-05-01",
    "end": "2024-05-10"
  },
  "trading_days": 8,
  "successful_runs": 8,
  "failed_runs": 0,
  "results": [
    {
      "date": "2024-05-01",
      "success": true,
      "result": { /* analysis data */ }
    },
    // ... more results
  ],
  "timestamp": "2024-05-10T16:00:00"
}
```

### Example 4: Run Backtest

```bash
curl -X POST http://localhost:8002/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "data_dir": "./output/csv",
    "printlog": false
  }'
```

Response:
```json
{
  "success": true,
  "symbol": "AAPL",
  "primo_results": {
    "Cumulative Return [%]": 45.2,
    "Annual Volatility [%]": 22.5,
    "Max Drawdown [%]": -12.3,
    "Sharpe Ratio": 1.85,
    "Total Trades": 24
  },
  "buyhold_results": {
    "Cumulative Return [%]": 38.7,
    "Annual Volatility [%]": 25.1,
    "Max Drawdown [%]": -15.8,
    "Sharpe Ratio": 1.42,
    "Total Trades": 2
  },
  "comparison": {
    "relative_return": 6.5,
    "outperformed": true,
    "metrics": {
      "cumulative_return_diff": 6.5,
      "volatility_diff": -2.6,
      "max_drawdown_diff": 3.5,
      "sharpe_diff": 0.43
    }
  },
  "timestamp": "2024-05-10T16:30:00"
}
```

### Example 5: Python Client

```python
import requests
from datetime import datetime

BASE_URL = "http://localhost:8002"

class PrimoAgentClient:
    def __init__(self, base_url=BASE_URL):
        self.base_url = base_url
    
    def analyze(self, symbols, date=None):
        """Analyze stocks for a specific date"""
        url = f"{self.base_url}/analyze"
        payload = {
            "symbols": symbols,
            "date": date or datetime.now().strftime("%Y-%m-%d")
        }
        
        response = requests.post(url, json=payload)
        return response.json()
    
    def batch_analyze(self, symbols, start_date, end_date):
        """Analyze stocks across multiple dates"""
        url = f"{self.base_url}/analyze/batch"
        payload = {
            "symbols": symbols,
            "start_date": start_date,
            "end_date": end_date
        }
        
        response = requests.post(url, json=payload)
        return response.json()
    
    def backtest(self, symbol, data_dir="./output/csv", printlog=False):
        """Run backtest for a symbol"""
        url = f"{self.base_url}/backtest"
        payload = {
            "symbol": symbol,
            "data_dir": data_dir,
            "printlog": printlog
        }
        
        response = requests.post(url, json=payload)
        return response.json()
    
    def get_available_stocks(self, data_dir="./output/csv"):
        """Get available stocks for backtesting"""
        url = f"{self.base_url}/backtest/available-stocks"
        params = {"data_dir": data_dir}
        
        response = requests.get(url, params=params)
        return response.json()

# Usage
client = PrimoAgentClient()

# Analyze a stock
result = client.analyze(["AAPL"], "2024-05-10")
print(f"Analysis: {result}")

# Run batch analysis
batch_result = client.batch_analyze(
    ["AAPL", "GOOGL"],
    "2024-05-01",
    "2024-05-10"
)
print(f"Batch Analysis - Success Rate: {batch_result['successful_runs']}/{batch_result['trading_days']}")

# Run backtest
backtest_result = client.backtest("AAPL")
if backtest_result['success']:
    print(f"PrimoAgent Return: {backtest_result['primo_results']['Cumulative Return [%]']:.2f}%")
    print(f"Buy & Hold Return: {backtest_result['buyhold_results']['Cumulative Return [%]']:.2f}%")
    print(f"Outperformed: {backtest_result['comparison']['outperformed']}")

# Get available stocks
stocks = client.get_available_stocks()
print(f"Available stocks: {stocks['stocks']}")
```

### Example 6: JavaScript/TypeScript Client

```typescript
// PrimoAgent API Client
const BASE_URL = 'http://localhost:8002'

class PrimoAgentClient {
  constructor(private baseUrl: string = BASE_URL) {}

  async analyze(symbols: string[], date?: string) {
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbols,
        date: date || new Date().toISOString().split('T')[0]
      }),
    })
    return await response.json()
  }

  async batchAnalyze(symbols: string[], startDate: string, endDate: string) {
    const response = await fetch(`${this.baseUrl}/analyze/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbols,
        start_date: startDate,
        end_date: endDate
      }),
    })
    return await response.json()
  }

  async backtest(symbol: string, dataDir = './output/csv', printlog = false) {
    const response = await fetch(`${this.baseUrl}/backtest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, data_dir: dataDir, printlog }),
    })
    return await response.json()
  }

  async getAvailableStocks(dataDir = './output/csv') {
    const response = await fetch(
      `${this.baseUrl}/backtest/available-stocks?data_dir=${dataDir}`
    )
    return await response.json()
  }
}

// Usage
const client = new PrimoAgentClient()

// Analyze stocks
const result = await client.analyze(['AAPL', 'GOOGL'], '2024-05-10')
console.log('Analysis:', result)

// Batch analysis
const batchResult = await client.batchAnalyze(
  ['AAPL'],
  '2024-05-01',
  '2024-05-10'
)
console.log(`Success rate: ${batchResult.successful_runs}/${batchResult.trading_days}`)

// Backtest
const backtestResult = await client.backtest('AAPL')
if (backtestResult.success) {
  console.log(`PrimoAgent: ${backtestResult.primo_results['Cumulative Return [%]']}%`)
  console.log(`Buy & Hold: ${backtestResult.buyhold_results['Cumulative Return [%]']}%`)
}
```

### Example 7: Automated Trading Pipeline

```python
import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8002"

def trading_pipeline(symbols, lookback_days=30):
    """Complete trading analysis pipeline"""
    
    # 1. Get historical analysis
    end_date = datetime.now()
    start_date = end_date - timedelta(days=lookback_days)
    
    print(f"Running batch analysis from {start_date.date()} to {end_date.date()}")
    
    batch_result = requests.post(
        f"{BASE_URL}/analyze/batch",
        json={
            "symbols": symbols,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d")
        }
    ).json()
    
    print(f"Completed {batch_result['successful_runs']}/{batch_result['trading_days']} days")
    
    # 2. Run backtests for each symbol
    backtest_results = {}
    
    for symbol in symbols:
        print(f"\nRunning backtest for {symbol}...")
        
        result = requests.post(
            f"{BASE_URL}/backtest",
            json={"symbol": symbol}
        ).json()
        
        if result['success']:
            backtest_results[symbol] = {
                "return": result['primo_results']['Cumulative Return [%]'],
                "sharpe": result['primo_results']['Sharpe Ratio'],
                "outperformed": result['comparison']['outperformed']
            }
            
            print(f"  Return: {backtest_results[symbol]['return']:.2f}%")
            print(f"  Sharpe: {backtest_results[symbol]['sharpe']:.2f}")
            print(f"  Outperformed: {backtest_results[symbol]['outperformed']}")
    
    # 3. Rank by performance
    ranked = sorted(
        backtest_results.items(),
        key=lambda x: x[1]['sharpe'],
        reverse=True
    )
    
    print("\n=== Top Performers ===")
    for symbol, metrics in ranked[:3]:
        print(f"{symbol}: {metrics['return']:.2f}% (Sharpe: {metrics['sharpe']:.2f})")
    
    return batch_result, backtest_results

# Run pipeline
symbols = ["AAPL", "GOOGL", "MSFT", "NVDA"]
batch, backtests = trading_pipeline(symbols, lookback_days=90)
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "symbols": ["AAPL"],
  "date": "2024-05-10",
  "result": { /* analysis data */ },
  "timestamp": "2024-05-10T15:30:45"
}
```

### Error Response
```json
{
  "detail": "Analysis failed: reason"
}
```

## Best Practices

1. **Data Preparation**: Run analysis to generate CSV data before backtesting
2. **Date Ranges**: Use reasonable date ranges to avoid timeouts
3. **Symbol Validation**: Verify symbols exist before analysis
4. **Error Handling**: Always check `success` field
5. **Rate Limiting**: Implement delays for batch operations

## Troubleshooting

### Common Errors

1. **"No data found for symbol"**
   - Run `/analyze` first to generate CSV data
   - Check if data_dir path is correct

2. **"No trading days in range"**
   - Check date format (YYYY-MM-DD)
   - Ensure range includes weekdays

3. **"Analysis failed"**
   - Check API keys in `.env`
   - Verify symbol is valid
   - Check internet connection

## Support

For more information:
- Check the main README.md
- Review FastAPI docs at http://localhost:8002/docs
- Check service logs for errors
