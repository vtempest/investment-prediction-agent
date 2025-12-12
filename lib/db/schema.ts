import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

// User table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
  apiKey: text("api_key").unique(),
  usageCount: integer("usage_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// Session table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// Account table (for OAuth)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// Verification table
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
})

// User Settings (API Keys & Broker Credentials)
export const userSettings = sqliteTable("user_settings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),

  // LLM Provider API Keys
  groqApiKey: text("groq_api_key"),
  openaiApiKey: text("openai_api_key"),
  anthropicApiKey: text("anthropic_api_key"),
  xaiApiKey: text("xai_api_key"),
  googleApiKey: text("google_api_key"),
  togetheraiApiKey: text("togetherai_api_key"),
  perplexityApiKey: text("perplexity_api_key"),
  cloudflareApiKey: text("cloudflare_api_key"),

  // Broker API Keys
  alpacaApiKey: text("alpaca_api_key"),
  alpacaApiSecret: text("alpaca_api_secret"),
  alpacaBaseUrl: text("alpaca_base_url"),

  // Broker Credentials
  webullUsername: text("webull_username"),
  webullPassword: text("webull_password"),
  robinhoodUsername: text("robinhood_username"),
  robinhoodPassword: text("robinhood_password"),
  ibkrUsername: text("ibkr_username"),
  ibkrPassword: text("ibkr_password"),

  // Data Provider API Keys
  alphaVantageApiKey: text("alpha_vantage_api_key"),
  finnhubApiKey: text("finnhub_api_key"),
  polygonApiKey: text("polygon_api_key"),

  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})


// User Strategies
export const strategies = sqliteTable("strategies", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // momentum, mean-reversion, breakout, day-scalp
  status: text("status").notNull().default("paused"), // running, paused, paper
  riskLevel: text("risk_level").notNull().default("medium"),

  // Performance metrics
  todayPnL: real("today_pnl").default(0),
  last7DaysPnL: real("last_7days_pnl").default(0),
  last30DaysPnL: real("last_30days_pnl").default(0),
  winRate: real("win_rate").default(0),
  activeMarkets: integer("active_markets").default(0),
  tradesToday: integer("trades_today").default(0),

  // Configuration
  config: text("config"), // JSON string of strategy parameters

  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// User Watchlist/Signals
export const signals = sqliteTable("signals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  asset: text("asset").notNull(),
  type: text("type").notNull(), // stock, prediction_market

  // Scores
  combinedScore: real("combined_score").notNull(),
  scoreLabel: text("score_label").notNull(), // Strong Buy, Buy, Hold, Sell, Strong Sell

  // Driver scores
  fundamentalsScore: real("fundamentals_score"),
  vixScore: real("vix_score"),
  technicalScore: real("technical_score"),
  sentimentScore: real("sentiment_score"),

  // Metadata
  strategy: text("strategy"),
  timeframe: text("timeframe"),
  suggestedAction: text("suggested_action"),
  suggestedSize: text("suggested_size"),

  // Additional data
  metadata: text("metadata"), // JSON string with extra data

  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// User Positions
export const positions = sqliteTable("positions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  asset: text("asset").notNull(),
  type: text("type").notNull(), // stock, prediction_market

  entryPrice: real("entry_price").notNull(),
  currentPrice: real("current_price").notNull(),
  size: real("size").notNull(),

  unrealizedPnL: real("unrealized_pnl").default(0),
  unrealizedPnLPercent: real("unrealized_pnl_percent").default(0),

  strategy: text("strategy"),
  openedBy: text("opened_by"),
  openedAt: integer("opened_at", { mode: "timestamp" }).notNull(),
  closedAt: integer("closed_at", { mode: "timestamp" }),

  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// User Trades
export const trades = sqliteTable("trades", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  asset: text("asset").notNull(),
  type: text("type").notNull(), // stock, prediction_market
  action: text("action").notNull(), // buy, sell

  price: real("price").notNull(),
  size: real("size").notNull(),
  pnl: real("pnl"),

  strategy: text("strategy"),
  copiedFrom: text("copied_from"),

  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
})

// Portfolio Summary
export const portfolios = sqliteTable("portfolios", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),

  totalEquity: real("total_equity").default(100000),
  cash: real("cash").default(100000),
  stocks: real("stocks").default(0),
  predictionMarkets: real("prediction_markets").default(0),
  margin: real("margin").default(0),

  dailyPnL: real("daily_pnl").default(0),
  dailyPnLPercent: real("daily_pnl_percent").default(0),
  winRate: real("win_rate").default(0),
  openPositions: integer("open_positions").default(0),

  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// ============================================================================
// Polymarket Trader Tracking
// ============================================================================

// Polymarket Leaders/Traders
export const polymarketLeaders = sqliteTable("polymarket_leaders", {
  trader: text("trader").primaryKey(),
  rank: integer("rank"),
  userName: text("user_name"),
  xUsername: text("x_username"),
  verifiedBadge: integer("verified_badge", { mode: "boolean" }),
  profileImage: text("profile_image"),

  // Volume and PnL from new leaderboard API
  vol: real("vol"),
  pnl: real("pnl"),

  // Legacy fields from old API (keep for backward compatibility)
  overallGain: real("overall_gain"),
  winRate: real("win_rate"),
  activePositions: integer("active_positions"),
  totalPositions: integer("total_positions"),
  currentValue: real("current_value"),
  winAmount: real("win_amount"),
  lossAmount: real("loss_amount"),

  updatedAt: integer("updated_at", { mode: "timestamp" }),
})

// Polymarket Positions
export const polymarketPositions = sqliteTable("polymarket_positions", {
  id: text("id").primaryKey(),
  traderId: text("trader_id").notNull(),
  marketId: text("market_id"),
  marketTitle: text("market_title"),
  cashPnl: real("cash_pnl"),
  realizedPnl: real("realized_pnl"),
  tags: text("tags"), // JSON array
  createdAt: integer("created_at", { mode: "timestamp" }),
})

// Polymarket Categories
export const polymarketCategories = sqliteTable("polymarket_categories", {
  tag: text("tag").primaryKey(),
  pnl: real("pnl"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
})

// Polymarket Markets - Store prediction markets data
export const polymarketMarkets = sqliteTable("polymarket_markets", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  image: text("image"),

  // Volume metrics
  volume24hr: real("volume_24hr"),
  volumeTotal: real("volume_total"),

  // Market status
  active: integer("active", { mode: "boolean" }).default(true),
  closed: integer("closed", { mode: "boolean" }).default(false),

  // Outcomes and prices (stored as JSON strings)
  outcomes: text("outcomes").notNull(), // JSON array: ["Yes", "No"]
  outcomePrices: text("outcome_prices").notNull(), // JSON array: ["0.65", "0.35"]

  // Additional metadata
  tags: text("tags"), // JSON array
  endDate: text("end_date"),
  groupItemTitle: text("group_item_title"),
  enableOrderBook: integer("enable_order_book", { mode: "boolean" }),

  // Tracking
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
})

// ============================================================================
// Zulu Traders Tracking
// ============================================================================

// Zulu Traders
export const zuluTraders = sqliteTable("zulu_traders", {
  providerId: integer("provider_id").primaryKey(),
  name: text("name"),
  strategyDesc: text("strategy_desc"),
  countryCode: text("country_code"),
  countryName: text("country_name"),
  brokerName: text("broker_name"),
  balance: real("balance"),
  equity: real("equity"),
  followers: integer("followers"),
  liveFollowers: integer("live_followers"),
  roiAnnualized: real("roi_annualized"),
  roiProfit: real("roi_profit"),
  zuluRank: integer("zulu_rank"),
  bestTrade: real("best_trade"),
  worstTrade: real("worst_trade"),
  profitableTrades: integer("profitable_trades"),
  losingTrades: integer("losing_trades"),
  avgDrawdown: real("avg_drawdown"),
  maxDrawdown: real("max_drawdown"),
  maxDrawdownPercent: real("max_drawdown_percent"),
  leverage: real("leverage"),
  isEa: integer("is_ea"), // 1 for EA (Expert Advisor), 0 for manual
  currencies: text("currencies"),
  weeks: integer("weeks"),
  demo: integer("demo"), // 1 for demo, 0 for live
  avgTradeSeconds: integer("avg_trade_seconds"),
  avgPnlPerTrade: real("avg_pnl_per_trade"),
  winRate: real("win_rate"),
  totalTrades: integer("total_trades"),
  pageVisits: integer("page_visits"),
  includedInWatchlist: integer("included_in_watchlist"),
  registrationDate: integer("registration_date", { mode: "timestamp" }),
  lastOpenTradeDate: integer("last_open_trade_date", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
})

// Zulu Currency Stats
export const zuluCurrencyStats = sqliteTable("zulu_currency_stats", {
  id: text("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  currencyName: text("currency_name"),
  totalCount: integer("total_count"),
  winCount: integer("win_count"),
  winPercent: real("win_percent"),
  totalBuyCount: integer("total_buy_count"),
  totalSellCount: integer("total_sell_count"),
  pips: real("pips"),
  createdAt: integer("created_at", { mode: "timestamp" }),
})

// ============================================================================
// Agent API Logs
// ============================================================================

export const agentApiLogs = sqliteTable("agent_api_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }), // Optional, linking to user if authenticated
  symbol: text("symbol").notNull(),
  requestPayload: text("request_payload"), // JSON string
  responseSignal: text("response_signal"), // JSON string
  responseAnalysis: text("response_analysis"), // JSON string
  llmProvider: text("llm_provider"),
  model: text("model_used"),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
})
