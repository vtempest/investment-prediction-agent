# Stocks API Documentation

## Overview

The stocks API provides comprehensive access to financial data through two main sources:
1. **Yahoo Finance API** - Real-time stock quotes, historical data, P/E ratios, search, trending stocks, and more
2. **SEC EDGAR API** - SEC filing downloads, metadata, and company filings

All endpoints are integrated as Next.js API routes and accessible via HTTP requests.

## Base URL

```
http://localhost:3000/api
```

## Yahoo Finance Endpoints

### Get Stock Quote

**Endpoint:** `GET /stocks/quote/{symbol}`

**Example:**
```bash
curl "http://localhost:3000/api/stocks/quote/AAPL?modules=price,summaryDetail"
```

### Get Historical Price Data

**Endpoint:** `GET /stocks/historical/{symbol}`

**Parameters:**
- `period1` (required) - Start date (YYYY-MM-DD)
- `period2` (required) - End date (YYYY-MM-DD)
- `interval` (optional) - `1d`, `1wk`, `1mo`

**Example:**
```bash
curl "http://localhost:3000/api/stocks/historical/MSFT?period1=2024-01-01&period2=2024-12-31&interval=1mo"
```

### Calculate P/E Ratios

**Endpoint:** `GET /stocks/pe-ratio/{symbol}`

**Parameters:**
- `startDate` (required) - Start date (YYYY-MM-DD)
- `endDate` (required) - End date (YYYY-MM-DD)
- `interval` (optional) - `1d`, `1wk`, `1mo`

**Example:**
```bash
curl "http://localhost:3000/api/stocks/pe-ratio/GOOGL?startDate=2023-01-01&endDate=2024-12-31&interval=1mo"
```

### Search, Trending, Gainers, Screener

- `GET /stocks/search?q=apple`
- `GET /stocks/trending?region=US`
- `GET /stocks/gainers?region=US`
- `GET /stocks/screener?scrIds=day_gainers`

## SEC Filing Endpoints

### Get Filing Metadata

**Endpoint:** `GET /sec/filings/metadata`

**Example:**
```bash
curl "http://localhost:3000/api/sec/filings/metadata?query=AAPL/10-Q/3"
```

### Download Filing, Get HTML, Company Filings

- `GET /sec/filings/download?url=https://...`
- `GET /sec/filings/html?ticker=AAPL&form=10-Q`
- `GET /sec/companies/{tickerOrCik}/filings?formType=10-K&limit=5`

## Frontend Integration

```typescript
// Fetch stock quote
const response = await fetch(`/api/stocks/quote/AAPL`);
const data = await response.json();

// Calculate P/E ratios
const params = new URLSearchParams({
  startDate: '2023-01-01',
  endDate: '2024-12-31',
  interval: '1mo'
});
const response = await fetch(`/api/stocks/pe-ratio/AAPL?${params}`);
```

## Library Usage

```typescript
import { HistoricalPECalculator } from '@/lib/stocks/pe-calculator';
import { Downloader } from '@/lib/stocks/sec-downloader';

const calculator = new HistoricalPECalculator();
const result = await calculator.calculateHistoricalPEForStock('AAPL', '2023-01-01', '2024-12-31', '1mo');

const downloader = new Downloader('My App', 'email@example.com');
const metadatas = await downloader.getFilingMetadatas('AAPL/10-Q/3');
```

See the main README for more details.
