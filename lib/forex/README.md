# Forex Live Tick Data with Dukascopy

This module provides real-time and historical forex data using the Dukascopy Node.js library.

## Features

- ✅ Real-time tick data for forex pairs
- ✅ Historical OHLC data
- ✅ Support for 15+ forex instruments (EUR/USD, BTC/USD, Gold, etc.)
- ✅ Multiple timeframes (tick, 1s, 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1mo)
- ✅ Live chart component with auto-refresh
- ✅ TypeScript support with full type safety

## API Routes

### Get Real-Time Data

\`\`\`
GET /api/forex/realtime/[instrument]
\`\`\`

**Parameters:**
- `instrument` - Forex pair (e.g., `eurusd`, `btcusd`, `xauusd`)
- `timeframe` - Optional: `tick`, `s1`, `m1`, `m5`, `m15`, `m30`, `h1`, `h4`, `d1` (default: `tick`)
- `format` - Optional: `json`, `array`, `csv` (default: `json`)
- `priceType` - Optional: `bid`, `ask` (default: `bid`)
- `last` - Optional: Number of latest items to fetch (default: `10`)
- `volumes` - Optional: Include volume data (default: `true`)

**Example:**
\`\`\`bash
# Get last 100 tick prices for EUR/USD
curl http://localhost:3000/api/forex/realtime/eurusd?last=100&timeframe=tick

# Get last 50 1-minute candles for BTC/USD
curl http://localhost:3000/api/forex/realtime/btcusd?last=50&timeframe=m1
\`\`\`

### Get Historical Data

\`\`\`
GET /api/forex/historical/[instrument]
\`\`\`

**Parameters:**
- `instrument` - Forex pair
- `from` - Start date (ISO string or timestamp)
- `to` - Optional: End date (default: now)
- `range` - Optional: Shorthand for date range (`1d`, `7d`, `1mo`, etc.)
- `timeframe` - Optional: Same as real-time (default: `d1`)
- `format` - Optional: `json`, `array`, `csv` (default: `json`)
- `priceType` - Optional: `bid`, `ask` (default: `bid`)

**Example:**
\`\`\`bash
# Get 1 month of daily data for EUR/USD
curl "http://localhost:3000/api/forex/historical/eurusd?range=1mo"

# Get specific date range
curl "http://localhost:3000/api/forex/historical/eurusd?from=2024-01-01&to=2024-01-31&timeframe=h1"
\`\`\`

### Get Supported Instruments

\`\`\`
GET /api/forex/instruments
\`\`\`

Returns list of all supported forex pairs and commodities.

## React Component Usage

### Basic Usage

\`\`\`tsx
import { ForexLiveChart } from '@/components/dashboard/forex-live-chart';

export default function ForexPage() {
  return (
    <div>
      <ForexLiveChart
        instrument="eurusd"
        autoRefresh={true}
        refreshInterval={5000}
      />
    </div>
  );
}
\`\`\`

### Props

- `instrument` - Default forex pair to display (default: `"eurusd"`)
- `autoRefresh` - Enable auto-refresh (default: `true`)
- `refreshInterval` - Refresh interval in milliseconds (default: `5000`)

## Direct Library Usage

### Get Real-Time Tick Data

\`\`\`typescript
import { getForexRealTimeData } from '@/lib/forex/dukascopy-client';

const result = await getForexRealTimeData({
  instrument: 'eurusd',
  timeframe: 'tick',
  format: 'json',
  last: 100,
});

console.log(result.data);
\`\`\`

### Get Historical Data

\`\`\`typescript
import { getForexHistoricalData } from '@/lib/forex/dukascopy-client';

const result = await getForexHistoricalData({
  instrument: 'btcusd',
  dates: {
    from: new Date('2024-01-01'),
    to: new Date('2024-01-31'),
  },
  timeframe: 'h1',
  format: 'json',
});

console.log(result.data);
\`\`\`

## Supported Instruments

### Major Forex Pairs
- EUR/USD (`eurusd`)
- GBP/USD (`gbpusd`)
- USD/JPY (`usdjpy`)
- AUD/USD (`audusd`)
- USD/CAD (`usdcad`)
- USD/CHF (`usdchf`)
- NZD/USD (`nzdusd`)

### Cross Pairs
- EUR/GBP (`eurgbp`)
- EUR/JPY (`eurjpy`)
- GBP/JPY (`gbpjpy`)

### Crypto
- BTC/USD (`btcusd`)
- ETH/USD (`ethusd`)

### Commodities
- Gold (`xauusd`)
- Silver (`xagusd`)
- Crude Oil (`wtiusd`)

## Data Formats

### Tick Data (JSON)

\`\`\`typescript
{
  timestamp: 1704067200000,
  askPrice: 1.0945,
  bidPrice: 1.0943,
  askVolume: 10.5,
  bidVolume: 12.3
}
\`\`\`

### OHLC Data (JSON)

\`\`\`typescript
{
  timestamp: 1704067200000,
  open: 1.0945,
  high: 1.0950,
  low: 1.0940,
  close: 1.0948,
  volume: 123.45
}
\`\`\`

## Integration with Lightweight Charts

The data is automatically converted to the format expected by Lightweight Charts:

\`\`\`typescript
import { convertToChartData } from '@/lib/forex/dukascopy-client';

const chartData = convertToChartData(result.data);
// Ready to use with TechnicalChart component
\`\`\`

## Notes

- Dukascopy provides free forex data with no API key required
- Real-time data has a small delay (usually a few seconds)
- Historical data is available from 2003 onwards
- Tick data provides the highest granularity
- Use appropriate timeframes for different chart durations
