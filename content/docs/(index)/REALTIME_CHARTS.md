---
title: Real-Time Forex Charts 
---

Professional real-time forex charting powered by Dukascopy's free tick data API and Lightweight Charts.

## Features

✅ **Real-Time Updates** - Live candle updates every 1-5 seconds
✅ **No API Key Required** - Completely free forever
✅ **15+ Instruments** - Forex, crypto, and commodities
✅ **Multiple Timeframes** - 1m, 5m, 15m, 1h, 4h, daily
✅ **Interactive Tooltip** - Hover to see OHLC data
✅ **Auto-Scroll** - "Go to Realtime" button for latest data
✅ **Pause/Resume** - Control live updates
✅ **TypeScript** - Full type safety

## Component Usage

### Basic Usage

```tsx
import { RealtimeForexChart } from '@/components/dashboard/realtime-forex-chart';

export default function TradingPage() {
  return (
    <RealtimeForexChart
      instrument="eurusd"
      timeframe="m1"
      height={600}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `instrument` | string | `"eurusd"` | Forex pair to display |
| `timeframe` | string | `"m1"` | Candle timeframe |
| `height` | number | `500` | Chart height in pixels |

### Supported Instruments

```typescript
// Major Forex Pairs
"eurusd" | "gbpusd" | "usdjpy" | "audusd" | "usdcad" | "usdchf" | "nzdusd"

// Cross Pairs
"eurgbp" | "eurjpy" | "gbpjpy"

// Crypto
"btcusd" | "ethusd"

// Commodities
"xauusd" | "xagusd" | "wtiusd"
```

### Supported Timeframes

```typescript
"m1"   // 1 minute
"m5"   // 5 minutes
"m15"  // 15 minutes
"h1"   // 1 hour
```

## How It Works

### 1. Initial Data Load

When the component mounts, it fetches the last 500 candles:

```typescript
const url = `/api/forex/realtime/${instrument}?timeframe=${timeframe}&last=500`
const response = await fetch(url)
```

This provides historical context for the chart.

### 2. Real-Time Updates

The component polls for updates every 1-5 seconds (depending on timeframe):

```typescript
const updateInterval = timeframe === 'm1' ? 1000 : 5000
setInterval(fetchRealtimeUpdate, updateInterval)
```

Each update:
1. Fetches the latest candle
2. Compares timestamp with last candle
3. Either **updates** existing candle or **appends** new candle

### 3. Candle Update Logic

```typescript
if (newCandle.time === lastCandle.time) {
  // Same time = update existing candle (price changed)
  series.update(newCandle)
} else if (newCandle.time > lastCandle.time) {
  // New time = append new candle (new period started)
  series.update(newCandle)
  lastCandle = newCandle
}
```

This follows the Lightweight Charts real-time update pattern.

## API Routes

### Real-Time Endpoint

```
GET /api/forex/realtime/[instrument]
```

**Query Parameters:**
- `timeframe` - Candle period (m1, m5, m15, h1)
- `last` - Number of candles to fetch (default: 10)
- `format` - Data format (json, array, csv)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": 1704067200000,
      "open": 1.0945,
      "high": 1.0950,
      "low": 1.0940,
      "close": 1.0948,
      "volume": 123.45
    }
  ]
}
```

## Features Breakdown

### 1. Live Badge

Shows animated "LIVE" badge when updates are active:

```tsx
{isLive && (
  <Badge variant="default" className="animate-pulse">
    <Activity className="w-3 h-3 mr-1" />
    LIVE
  </Badge>
)}
```

### 2. Current Price Display

Shows real-time price updates:

```tsx
{currentPrice !== null && (
  <div className="text-2xl font-mono">
    ${currentPrice.toFixed(5)}
  </div>
)}
```

### 3. Go to Realtime Button

Scrolls chart to show latest data:

```tsx
<Button onClick={() => chart.timeScale().scrollToRealTime()}>
  Go to Realtime
</Button>
```

### 4. Pause/Resume Controls

Toggle live updates:

```tsx
const toggleLive = () => {
  setIsLive(!isLive)
  // Interval automatically starts/stops via useEffect
}
```

### 5. Interactive Tooltip

Shows OHLC data on hover using our custom tooltip plugin:

```typescript
const tooltipPrimitive = new TooltipPrimitive({
  tooltip: {
    title: instrument.toUpperCase(),
    followMode: 'tracking',
  },
  priceExtractor: (data) => `$${data.close.toFixed(5)}`,
})
candlestickSeries.attachPrimitive(tooltipPrimitive)
```

## Advanced Usage

### Custom Update Interval

```tsx
const [updateInterval, setUpdateInterval] = useState(5000)

useEffect(() => {
  if (isLive) {
    const interval = setInterval(fetchUpdate, updateInterval)
    return () => clearInterval(interval)
  }
}, [isLive, updateInterval])
```

### Multiple Charts

Display multiple instruments side-by-side:

```tsx
<div className="grid grid-cols-2 gap-4">
  <RealtimeForexChart instrument="eurusd" />
  <RealtimeForexChart instrument="gbpusd" />
  <RealtimeForexChart instrument="usdjpy" />
  <RealtimeForexChart instrument="btcusd" />
</div>
```

### With Tabs

Switch between instruments:

```tsx
<Tabs defaultValue="eurusd">
  <TabsList>
    <TabsTrigger value="eurusd">EUR/USD</TabsTrigger>
    <TabsTrigger value="btcusd">BTC/USD</TabsTrigger>
  </TabsList>
  <TabsContent value="eurusd">
    <RealtimeForexChart instrument="eurusd" />
  </TabsContent>
  <TabsContent value="btcusd">
    <RealtimeForexChart instrument="btcusd" />
  </TabsContent>
</Tabs>
```

## Performance Considerations

### 1. Update Frequency

Lower timeframes update more frequently:
- `m1` - Every 1 second
- `m5`, `m15`, `h1` - Every 5 seconds

Adjust based on your needs:

```typescript
const updateInterval = timeframe === 'm1' ? 1000 :
                       timeframe === 'm5' ? 5000 :
                       10000 // h1, h4
```

### 2. Data Volume

Initial load fetches 500 candles. Adjust for performance:

```typescript
// Lighter load
const url = `...&last=100` // Only 100 candles

// Heavier load for more context
const url = `...&last=1000` // 1000 candles
```

### 3. Memory Management

Cleanup on unmount:

```typescript
useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (chartRef.current) {
      chartRef.current.remove()
    }
  }
}, [])
```

## Troubleshooting

### Chart not updating

1. Check browser console for API errors
2. Verify `isLive` state is `true`
3. Check network tab for failed requests
4. Ensure Dukascopy servers are accessible

### Candles appearing disconnected

This means there's a gap in data (market closed, weekend, etc.). This is normal for forex markets.

### High CPU usage

1. Reduce update frequency
2. Decrease number of initial candles
3. Pause updates when chart is not visible

## Related Files

- [lib/forex/dukascopy-client.ts](../../lib/forex/dukascopy-client.ts) - Dukascopy API client
- [lib/lightweight-charts/plugins/tooltip](../../lib/lightweight-charts/plugins/tooltip) - Tooltip plugin
- [app/api/forex/realtime/[instrument]/route.ts](../../app/api/forex/realtime/[instrument]/route.ts) - API route
- [app/forex/page.tsx](../../app/forex/page.tsx) - Example page

## Credits

Built with:
- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) by TradingView
- [Dukascopy Node](https://www.npmjs.com/package/dukascopy-node) for free forex data
- [shadcn/ui](https://ui.shadcn.com/) for UI components
