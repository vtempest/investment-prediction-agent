import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

// User table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  image: text("image"),
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
