---
title: Api Data Summary
---

# API Data & Endpoints Summary

This document provides a summary of the key data structures and endpoints available in the Stock P/E Calculator API, mapping them to the underlying Yahoo Finance data modules.


Bonds 📊
Crypto assets ₿
Agriculture ☕
Energy ⚡
Metals ⚙️
Forex currencies 💱


## 🔗 Core Endpoints

| Endpoint | Method | Description | Key Data Returned |
|----------|--------|-------------|-------------------|
| `/api/quote/:symbol` | GET | Current stock quote & metrics | Price, Market Cap, TTM P/E, EPS |
| `/api/historical/:symbol` | GET | Historical price data | OHLCV (Open, High, Low, Close, Volume) |
| `/api/pe-ratio/:symbol` | GET | Historical P/E ratios | Date, Price, TTM EPS, P/E Ratio |

## 📊 Data Structures

### 1. Quote Data (`/api/quote/:symbol`)

This endpoint aggregates data from multiple Yahoo Finance modules to provide a comprehensive snapshot.

**Key Fields:**
- **Price**: Current trading price, currency
- **Summary Detail**: Market cap, trailing P/E, volume
- **Key Statistics**: Trailing EPS, forward P/E, shares outstanding
- **Financial Data**: Target price, recommendation key

**Underlying Modules:**
- `price`
- `summaryDetail`
- `defaultKeyStatistics`
- `financialData`

> 📚 **Reference:** See [finance-docs/quoteSummary.md](../finance-docs/quoteSummary.md) for full module details.

### 2. Historical Price Data (`/api/historical/:symbol`)

Provides time-series price data for charting and analysis.

**Data Points:**
- `date`: Trading date
- `open`: Opening price
- `high`: Highest price of the interval
- `low`: Lowest price of the interval
- `close`: Closing price
- `volume`: Number of shares traded
- `adjClose`: Adjusted closing price (accounts for splits/dividends)

**Intervals Supported:**
- `1d` (Daily)
- `1wk` (Weekly)
- `1mo` (Monthly)

> 📚 **Reference:** See [finance-docs/historical.md](../finance-docs/historical.md) for historical data details.

### 3. P/E Ratio Calculation Data (`/api/pe-ratio/:symbol`)

This is a computed dataset derived from combining historical prices with earnings data.

**Calculation Logic:**
1. Fetch historical prices (monthly/weekly/daily)
2. Fetch quarterly earnings history (`incomeStatementHistoryQuarterly`)
3. Calculate TTM EPS (Trailing Twelve Month Earnings Per Share) for each price point
   - Sum of the last 4 quarters of EPS
4. Compute P/E Ratio: `Price / TTM EPS`

**Data Points:**
- `date`: Calculation date
- `price`: Stock price on that date
- `ttmEPS`: Calculated trailing 12-month EPS
- `peRatio`: The resulting Price-to-Earnings ratio

**Underlying Modules:**
- `incomeStatementHistoryQuarterly` (for earnings)
- `chart` (for prices)

> 📚 **Reference:** See [finance-docs/fundamentalsTimeSeries.md](../finance-docs/fundamentalsTimeSeries.md) for more on fundamental data.

### 4. Market Discovery Data

Endpoints for discovering new stocks.

**Endpoints:**
- `/api/search`: Returns quotes and news articles matching a query
- `/api/trending`: Returns trending symbols for a specific region
- `/api/gainers`: Returns top gaining stocks for the day
- `/api/screener`: Returns stocks matching specific criteria (e.g., `day_gainers`, `most_actives`)

**Key Data:**
- Symbol, Short Name, Quote Type
- Market Change, Percent Change
- Market Cap, Volume

### 5. Advanced Analysis Data

Detailed data for deep-dive analysis.

**Endpoints:**
- `/api/recommendations/:symbol`: Analyst buy/sell/hold trends
- `/api/insights/:symbol`: Technical and fundamental insights
- `/api/options/:symbol`: Options chain (calls/puts, strikes, expiration)
- `/api/chart/:symbol`: Granular price data with metadata
- `/api/fundamentals/:symbol`: Historical balance sheet, cash flow, and income statements

> 📚 **Reference:** See `finance-docs/` for detailed schema of each module.

## 🛠️ Yahoo Finance Modules Used

The API heavily relies on the `quoteSummary` service from Yahoo Finance. Here are the specific modules we utilize:

| Module Name | Purpose | Key Fields Used |
|-------------|---------|-----------------|
| `price` | Real-time price info | `regularMarketPrice`, `currency` |
| `summaryDetail` | Market summary | `marketCap`, `trailingPE`, `volume` |
| `defaultKeyStatistics` | Valuation metrics | `trailingEps`, `forwardPE`, `sharesOutstanding` |
| `financialData` | Analyst targets | `targetMeanPrice`, `recommendationKey` |
| `incomeStatementHistoryQuarterly` | Historical earnings | `netIncome`, `basicEPS`, `endDate` |

## 📝 Example Response Structures

### Quote Response
```json
{
  "symbol": "AAPL",
  "data": {
    "price": { "regularMarketPrice": 150.25 },
    "summaryDetail": { "trailingPE": 28.5, "marketCap": 2450000000000 },
    "defaultKeyStatistics": { "trailingEps": 5.27 }
  }
}
```

### Historical Response
```json
{
  "symbol": "MSFT",
  "data": [
    {
      "date": "2024-01-01T00:00:00.000Z",
      "close": 350.50,
      "volume": 25000000
    }
  ]
}
```

### P/E Ratio Response
```json
{
  "symbol": "GOOGL",
  "statistics": {
    "average": 25.4,
    "min": 20.1,
    "max": 30.5
  },
  "data": [
    {
      "date": "2024-01-01",
      "peRatio": 24.5,
      "ttmEPS": 5.80
    }
  ]
}
```
