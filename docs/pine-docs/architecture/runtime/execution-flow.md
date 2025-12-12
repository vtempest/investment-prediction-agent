---
layout: default
title: Execution Flow
parent: Runtime
nav_order: 3
permalink: /architecture/runtime/execution-flow/
---

# Execution Flow and Pagination

## Complete Execution Cycle

```
1. User calls: pineTS.run(code, periods)
   ↓
2. PineTS.ready() - Ensure market data loaded
   ↓
3. Initialize Context
   ↓
4. Transpile user code
   ↓
5. For each bar (iteration i):
   ┌─────────────────────────────────┐
   │ a. Set context.idx = i          │
   │ b. Push new OHLCV data          │
   │    (data.close.push(value))     │
   │ c. Execute transpiled function  │
   │ d. Collect result               │
   │ e. Grow all user variables      │
   │    ($.let.var.push(current))    │
   └─────────────────────────────────┘
   ↓
6. Return final Context with results
```

**Key Points:**

-   Data arrays grow with `.push()` (forward append)
-   Variables accessed via `$.get(var, index)` use Pine Script semantics
-   Each iteration processes one bar, growing all series by one element

## The Run Loop (`PineTS.class.ts`)

The `run()` method orchestrates the execution.

```typescript
async run(code) {
    // 1. Transpile Code
    const script = this.transpile(code);

    // 2. Loop through data
    for (let i = 0; i < data.length; i++) {
        this.context.idx = i;

        // Update context.data with current bar
        this.pushData(data[i]);

        // Execute script
        script(this.context);

        // Grow user variables (history)
        this.context.growVariables();
    }
}
```

## Data Flow During Iteration

```
Iteration N (Processing Bar N):

┌──────────────────────┐
│  Market Data Arrays  │
│  [0, 1, 2, ..., N]   │  (Forward order)
└─────────┬────────────┘
          │ push(value[N])
          ▼
┌──────────────────────┐
│ Context.data.close   │
│  [0, 1, ..., N]      │  (Forward order)
└─────────┬────────────┘
          │ Access via $.get(close, index)
          ▼
┌──────────────────────┐
│  Transpiled Code     │
│  $.get(close, 0)     │  → close[N] (current)
│  $.get(close, 1)     │  → close[N-1] (previous)
└─────────┬────────────┘
          │ Results written to $.let.var
          ▼
┌──────────────────────┐
│  Variable Updates    │
│  $.set($.let.var, x) │  → var[var.length-1] = x
└─────────┬────────────┘
          │ push(current_value)
          ▼
┌──────────────────────┐
│  Series History      │
│  [0, 1, ..., N]      │  (Forward order)
└──────────────────────┘
```

## Pagination

For large datasets or streaming, PineTS supports pagination.

```javascript
const generator = pineTS.run(code, periods, pageSize);

for await (const pageContext of generator) {
    // pageContext contains only NEW results for this page
    console.log(pageContext.result);
}
```

**Key Features:**

-   Processes data in chunks (pages)
-   Maintains state across pages
-   Supports live data streaming
-   Automatically recalculates last candle on updates (for live data)
-   Each page yields only new results, not cumulative

**Live Streaming Behavior:**

When live streaming is enabled (`eDate` undefined + provider source):

1.  Fetches new candles from provider starting at last candle's openTime
2.  Updates last candle if still open (same openTime)
3.  Recalculates last bar's results to reflect updated data
4.  Appends new complete candles
5.  Yields `null` when no new data is available
