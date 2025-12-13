# Paper Trading & Time Travel Guide

This guide covers the comprehensive paper trading features including fractional shares, time travel backtesting, and automated trading strategies.

## Features Overview

### 1. Multi-Portfolio Management

Create and manage multiple portfolios with different configurations:

- **Paper Trading Portfolios** - Virtual trading with simulated money
- **Broker-Linked Portfolios** - Connect to Alpaca, Webull, Robinhood, IBKR, or TD Ameritrade
- **Time Travel Portfolios** - Test strategies on historical data
- **Auto-Trading Portfolios** - Deploy automated trading strategies

### 2. Paper Trading with Fractional Shares

Execute trades with fractional share support:

- **Buy/Sell Actions** - Trade stocks with full or fractional shares
- **Market & Limit Orders** - Execute at market price or set limit price
- **Real-time Position Tracking** - Monitor open positions and P&L
- **Trade History** - View all executed trades with timestamps

### 3. Time Travel Backtesting

Travel back in time to test strategies with historical data:

- **Jump to Any Date** - Go back to 2010 or any historical date
- **Reset Portfolio** - Start fresh from a historical date with initial balance
- **Recalculate State** - Calculate portfolio state based on historical trades
- **Simulation Mode** - Execute trades in simulation at historical dates

### 4. Auto-Trading Strategies

Deploy automated trading strategies:

- **Signal-Based Execution** - Auto-execute trades based on signal thresholds
- **LLM Agent Integration** - Use AI agents to generate trading signals
- **Technical Strategy Support** - Deploy 20+ pre-built technical strategies
- **Risk Management** - Set position size, risk limits, and daily trade caps

## API Endpoints

### Portfolio Management

#### GET /api/portfolios
Get all portfolios for the authenticated user.

```json
{
  "portfolios": [
    {
      "id": "portfolio_id",
      "name": "Main Portfolio",
      "type": "paper",
      "totalEquity": 100000,
      "cash": 95000,
      "stocks": 5000,
      "totalPnL": 0,
      "totalPnLPercent": 0,
      "isActive": true
    }
  ]
}
```

#### POST /api/portfolios
Create a new portfolio.

```json
{
  "name": "Growth Portfolio",
  "type": "paper",
  "initialBalance": 100000,
  "startDate": "2020-01-01",
  "timeTravelEnabled": true,
  "simulationDate": "2020-01-01"
}
```

#### PATCH /api/portfolios/[portfolioId]
Update portfolio settings.

```json
{
  "isActive": true,
  "autoTradingEnabled": true,
  "autoTradingRiskLimit": 0.02,
  "autoTradingMaxDaily": 10
}
```

#### DELETE /api/portfolios/[portfolioId]
Delete a portfolio and all associated trades/positions.

### Time Travel

#### POST /api/portfolios/[portfolioId]/time-travel
Time travel to a specific date.

```json
{
  "targetDate": "2020-01-01",
  "reset": true  // Clear trades and reset to initial state
}
```

Response:
```json
{
  "portfolio": { ... },
  "message": "Time traveled to 2020-01-01",
  "holdings": {
    "AAPL": { "shares": 10, "avgPrice": 300 }
  }
}
```

### Paper Trading

#### POST /api/paper-trading/trade
Execute a paper trade with fractional share support.

```json
{
  "portfolioId": "portfolio_id",
  "symbol": "AAPL",
  "action": "buy",  // or "sell"
  "quantity": 0.5,  // Supports fractional shares
  "price": 150.00,  // Optional, fetches current if not provided
  "type": "market",  // or "limit"
  "strategyId": "strategy_id"  // Optional
}
```

Response:
```json
{
  "success": true,
  "message": "Bought 0.5 shares of AAPL at $150.00",
  "trade": {
    "symbol": "AAPL",
    "action": "buy",
    "quantity": 0.5,
    "price": 150.00,
    "totalValue": 75.00,
    "pnl": 0,  // For sell orders
    "pnlPercent": 0
  }
}
```

### Auto-Trading

#### POST /api/auto-trading/execute
Execute auto-trading strategies.

```json
{
  "portfolioId": "portfolio_id",
  "strategyId": "strategy_id",  // Optional, executes all auto-enabled if not provided
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```

Response:
```json
{
  "success": true,
  "results": {
    "executed": [
      {
        "symbol": "AAPL",
        "strategy": "Momentum",
        "action": "buy",
        "quantity": 10,
        "price": 150,
        "signal": 0.85
      }
    ],
    "skipped": [...],
    "errors": [...]
  },
  "summary": {
    "executed": 1,
    "skipped": 0,
    "errors": 0
  }
}
```

## UI Components

### TradingPanel
Full-featured trading interface with portfolio selection and fractional shares.

```tsx
import { TradingPanel } from "@/components/dashboard/trading-panel"

<TradingPanel
  symbol="AAPL"
  currentPrice={150}
  portfolioId="optional-portfolio-id"
  onTradeComplete={() => console.log("Trade completed")}
/>
```

### PortfolioManager
Manage multiple portfolios with CRUD operations.

```tsx
import { PortfolioManager } from "@/components/dashboard/portfolio-manager"

<PortfolioManager />
```

### TimeTravelControls
Time travel interface with quick presets and custom dates.

```tsx
import { TimeTravelControls } from "@/components/dashboard/time-travel-controls"

<TimeTravelControls
  portfolioId="optional-portfolio-id"
  onTimeTravelComplete={() => console.log("Time travel complete")}
/>
```

### AutoTradingPanel
Configure and deploy automated trading strategies.

```tsx
import { AutoTradingPanel } from "@/components/dashboard/auto-trading-panel"

<AutoTradingPanel
  portfolioId="optional-portfolio-id"
  strategyId="optional-strategy-id"
  onExecutionComplete={() => console.log("Execution complete")}
/>
```

## Database Schema

### Portfolios Table
```sql
CREATE TABLE portfolios (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT DEFAULT 'Main Portfolio',
  type TEXT DEFAULT 'paper',  -- paper, alpaca, webull, etc.
  is_active INTEGER DEFAULT 1,

  -- Broker Linking
  broker_account_id TEXT,
  linked_broker TEXT,

  -- Time Travel
  time_travel_enabled INTEGER DEFAULT 0,
  simulation_date INTEGER,  -- Current simulation date
  start_date INTEGER NOT NULL,

  -- Auto-Trading
  auto_trading_enabled INTEGER DEFAULT 0,
  auto_trading_strategies TEXT,  -- JSON array
  auto_trading_risk_limit REAL DEFAULT 0.02,
  auto_trading_max_daily INTEGER DEFAULT 10,

  -- State
  initial_balance REAL DEFAULT 100000,
  total_equity REAL DEFAULT 100000,
  cash REAL DEFAULT 100000,
  stocks REAL DEFAULT 0,

  -- Performance
  total_pnl REAL DEFAULT 0,
  total_pnl_percent REAL DEFAULT 0,
  win_rate REAL DEFAULT 0,
  open_positions INTEGER DEFAULT 0
)
```

### Trades Table
```sql
CREATE TABLE trades (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  portfolio_id TEXT,  -- Links to specific portfolio
  asset TEXT NOT NULL,
  type TEXT NOT NULL,  -- stock, prediction_market
  action TEXT NOT NULL,  -- buy, sell
  price REAL NOT NULL,
  size REAL NOT NULL,  -- Supports fractional shares
  total_value REAL,
  pnl REAL,
  strategy TEXT,
  auto_traded INTEGER DEFAULT 0,  -- Whether auto-executed
  timestamp INTEGER NOT NULL,
  created_at INTEGER NOT NULL
)
```

### Positions Table
```sql
CREATE TABLE positions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  portfolio_id TEXT,  -- Links to specific portfolio
  asset TEXT NOT NULL,
  type TEXT NOT NULL,
  entry_price REAL NOT NULL,
  current_price REAL NOT NULL,
  size REAL NOT NULL,  -- Supports fractional shares
  unrealized_pnl REAL DEFAULT 0,
  unrealized_pnl_percent REAL DEFAULT 0,
  strategy TEXT,
  opened_at INTEGER NOT NULL,
  closed_at INTEGER
)
```

## Usage Examples

### Example 1: Create a Time Travel Portfolio

```typescript
// 1. Create portfolio starting at 2010
const response = await fetch('/api/portfolios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '2010 Bull Run',
    type: 'paper',
    initialBalance: 10000,
    startDate: '2010-01-01',
    timeTravelEnabled: true,
    simulationDate: '2010-01-01'
  })
})

const { portfolio } = await response.json()

// 2. Execute trades in 2010
await fetch('/api/paper-trading/trade', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    portfolioId: portfolio.id,
    symbol: 'AAPL',
    action: 'buy',
    quantity: 100,
    type: 'market'
  })
})

// 3. Jump to 2024 to see results
await fetch(`/api/portfolios/${portfolio.id}/time-travel`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    targetDate: '2024-01-01',
    reset: false
  })
})
```

### Example 2: Set Up Auto-Trading

```typescript
// 1. Create strategy with auto-execution
const strategy = await fetch('/api/user/strategies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'AI Momentum',
    type: 'llm-agent',
    autoExecute: true,
    autoExecuteSignalThreshold: 0.8,
    autoExecutePositionSize: 0.05
  })
})

// 2. Enable auto-trading on portfolio
await fetch(`/api/portfolios/${portfolioId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    autoTradingEnabled: true,
    autoTradingRiskLimit: 0.02,
    autoTradingMaxDaily: 20
  })
})

// 3. Execute auto-trading
await fetch('/api/auto-trading/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    portfolioId,
    symbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA']
  })
})
```

### Example 3: Buy Fractional Shares

```typescript
// Buy 0.5 shares of AAPL
const response = await fetch('/api/paper-trading/trade', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    portfolioId: 'my-portfolio-id',
    symbol: 'AAPL',
    action: 'buy',
    quantity: 0.5,  // Fractional share
    type: 'market'
  })
})

const result = await response.json()
console.log(result.message)
// "Bought 0.5 shares of AAPL at $150.00"
```

## Best Practices

### 1. Time Travel Testing
- Always test strategies on historical data before deploying live
- Use the "Reset & Jump" option to start fresh from a historical date
- Compare multiple strategies across the same time period

### 2. Auto-Trading Safety
- Start with low position sizes (1-5% of portfolio)
- Set strict risk limits (1-2% max risk per trade)
- Monitor daily trade limits to prevent overtrading
- Test with paper trading first before linking real brokers

### 3. Portfolio Management
- Keep one portfolio as your main active portfolio
- Create separate portfolios for different strategies
- Use descriptive names (e.g., "Growth 2024", "Value Investing")
- Regularly review and close unused portfolios

### 4. Fractional Shares
- Useful for high-priced stocks (e.g., GOOGL, BRK.A)
- Allows dollar-cost averaging with exact amounts
- Great for diversification with smaller portfolios
- No fees for fractional shares in paper trading

## Troubleshooting

### Common Issues

**Portfolio not found**
- Ensure you're using the correct portfolioId
- Check that the portfolio belongs to your user account

**Insufficient funds**
- Verify portfolio cash balance
- Check if pending orders are tying up cash
- Consider using smaller position sizes

**Time travel date out of range**
- Ensure date is not in the future
- Historical data may not be available before 2000
- Some symbols may have limited history

**Auto-trading not executing**
- Verify autoTradingEnabled is true on portfolio
- Check that strategies have autoExecute enabled
- Ensure signal threshold is appropriate
- Verify you haven't hit daily trade limit

## Security Considerations

### API Keys
All broker API keys are encrypted at rest in the database.

### Paper Trading
Paper trading uses virtual money and does not execute real trades.

### Broker Integration
When linking real brokers:
- Use read-only API keys when possible
- Never share your API keys
- Regularly rotate API keys
- Monitor account activity

## Migration Guide

To migrate from the old single-portfolio system:

```sql
-- Run the migration
source migrations/0005_paper_trading_time_travel.sql

-- Your existing portfolio will be preserved
-- All trades will be linked to your main portfolio
```

## Contributing

When adding new features:
1. Update the database schema in `lib/db/schema.ts`
2. Create/update API endpoints in `app/api/`
3. Build UI components in `components/dashboard/`
4. Update this documentation
5. Add tests for new functionality

## Support

For issues or questions:
- GitHub Issues: [stock-prediction-agent/issues](https://github.com/vtempest/stock-prediction-agent/issues)
- Documentation: Check `/docs` folder
- API Reference: Visit `/api/docs` when running locally
