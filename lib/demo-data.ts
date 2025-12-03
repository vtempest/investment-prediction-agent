// Demo data generators for TimeTravel.investments dashboard

export interface PortfolioSummary {
  totalEquity: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  winRate: number;
  openPositions: number;
  cash: number;
  margin: number;
  stocks: number;
  predictionMarkets: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  todayPnL: number;
  last7DaysPnL: number;
  last30DaysPnL: number;
  winRate: number;
  activeMarkets: number;
  tradesToday: number;
  status: 'running' | 'paused' | 'paper';
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  bestConditions: string;
  avoidWhen: string;
}

export interface Signal {
  id: string;
  asset: string;
  type: 'stock' | 'prediction_market';
  combinedScore: number;
  scoreLabel: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  drivers: {
    fundamentals: number;
    vix: number;
    technical: number;
    sentiment: number;
  };
  timeframe: 'intraday' | 'daily' | 'event';
  strategy: string;
  suggestedAction: string;
  suggestedSize: string;
  peRatio?: number;
  peClassification?: string;
  vixRegime?: string;
  rsi?: number;
  macd?: number;
  sentimentScore?: number;
  agentCommentary?: string[];
}

export interface Agent {
  id: string;
  name: string;
  type: 'analyst' | 'researcher' | 'trader' | 'risk' | 'pm';
  queueLength: number;
  avgLatency: number;
  errorRate: number;
  recentActivity?: string[];
}

export interface PredictionMarket {
  id: string;
  platform: 'Polymarket' | 'Kalshi';
  eventName: string;
  currentOdds: number;
  volume: number;
  liquidity: number;
  expectedEdge: number;
  llmProbability: number;
  category: 'politics' | 'macro' | 'tech' | 'sports';
  timeToResolution: string;
  llmAnalysis: string;
  correlatedTickers?: string[];
}

export interface TopTrader {
  id: string;
  name: string;
  rank: number;
  overallPnL: number;
  winRate: number;
  activePositions: number;
  currentValue: number;
  avgHoldingPeriod: string;
  maxDrawdown: number;
  volatility: number;
  markets: string[];
}

export interface Position {
  id: string;
  asset: string;
  type: 'stock' | 'prediction_market';
  entryPrice: number;
  currentPrice: number;
  size: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  strategy: string;
  openedBy: string;
  openedAt: string;
}

export interface Trade {
  id: string;
  asset: string;
  type: 'stock' | 'prediction_market';
  action: 'buy' | 'sell';
  price: number;
  size: number;
  pnl?: number;
  strategy: string;
  copiedFrom?: string;
  timestamp: string;
}

export const demoPortfolio: PortfolioSummary = {
  totalEquity: 524750,
  dailyPnL: 8420,
  dailyPnLPercent: 1.63,
  winRate: 64.2,
  openPositions: 18,
  cash: 125000,
  margin: 75000,
  stocks: 350000,
  predictionMarkets: 49750,
};

export const demoStrategies: Strategy[] = [
  {
    id: 'momentum',
    name: 'Momentum Trading',
    description: 'Identifies and rides strong trending stocks with technical confirmation',
    todayPnL: 3240,
    last7DaysPnL: 12850,
    last30DaysPnL: 45320,
    winRate: 58.3,
    activeMarkets: 12,
    tradesToday: 8,
    status: 'running',
    timeframe: 'Daily to Weekly',
    riskLevel: 'medium',
    bestConditions: 'Trending markets, moderate volatility',
    avoidWhen: 'Choppy markets, VIX > 30',
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Exploits price deviations from statistical averages',
    todayPnL: -820,
    last7DaysPnL: 4200,
    last30DaysPnL: 18750,
    winRate: 52.1,
    activeMarkets: 8,
    tradesToday: 5,
    status: 'running',
    timeframe: 'Intraday to Daily',
    riskLevel: 'low',
    bestConditions: 'Range-bound markets, low volatility',
    avoidWhen: 'Strong trends, major news events',
  },
  {
    id: 'breakout',
    name: 'Breakout Trading',
    description: 'Captures explosive moves from consolidation patterns',
    todayPnL: 5200,
    last7DaysPnL: 8900,
    last30DaysPnL: 28450,
    winRate: 48.7,
    activeMarkets: 6,
    tradesToday: 3,
    status: 'running',
    timeframe: 'Daily to Weekly',
    riskLevel: 'high',
    bestConditions: 'Consolidation periods, catalysts pending',
    avoidWhen: 'Extended trends, high volatility',
  },
  {
    id: 'day-scalp',
    name: 'Day Trading Scalp',
    description: 'Quick intraday trades on volatility and volume spikes',
    todayPnL: 800,
    last7DaysPnL: 3400,
    last30DaysPnL: 12100,
    winRate: 61.5,
    activeMarkets: 4,
    tradesToday: 14,
    status: 'paper',
    timeframe: 'Intraday (minutes to hours)',
    riskLevel: 'medium',
    bestConditions: 'High volume, intraday volatility',
    avoidWhen: 'Low volume, end of day',
  },
];

export const demoSignals: Signal[] = [
  {
    id: 'sig1',
    asset: 'NVDA',
    type: 'stock',
    combinedScore: 0.87,
    scoreLabel: 'Strong Buy',
    drivers: {
      fundamentals: 0.82,
      vix: 0.85,
      technical: 0.92,
      sentiment: 0.88,
    },
    timeframe: 'daily',
    strategy: 'Momentum',
    suggestedAction: 'Buy',
    suggestedSize: '3.5% of portfolio',
    peRatio: 42.5,
    peClassification: 'Growth',
    vixRegime: 'Low Volatility (VIX: 14.2)',
    rsi: 58,
    macd: 0.85,
    sentimentScore: 0.88,
    agentCommentary: [
      'Strong earnings beat with revenue guidance raised',
      'Technical breakout above $850 resistance',
      'Institutional buying increasing, sentiment very bullish',
    ],
  },
  {
    id: 'sig2',
    asset: 'AAPL',
    type: 'stock',
    combinedScore: 0.72,
    scoreLabel: 'Buy',
    drivers: {
      fundamentals: 0.78,
      vix: 0.85,
      technical: 0.68,
      sentiment: 0.62,
    },
    timeframe: 'daily',
    strategy: 'Momentum',
    suggestedAction: 'Buy',
    suggestedSize: '2.5% of portfolio',
    peRatio: 28.3,
    peClassification: 'Fair Value',
    vixRegime: 'Low Volatility (VIX: 14.2)',
    rsi: 62,
    macd: 0.42,
    sentimentScore: 0.62,
    agentCommentary: [
      'Solid fundamentals, trading near fair value',
      'Breaking above 50-day MA with volume',
      'Mixed sentiment but improving on product cycle',
    ],
  },
  {
    id: 'sig3',
    asset: 'Trump wins 2028',
    type: 'prediction_market',
    combinedScore: 0.68,
    scoreLabel: 'Buy',
    drivers: {
      fundamentals: 0.0,
      vix: 0.5,
      technical: 0.0,
      sentiment: 0.75,
    },
    timeframe: 'event',
    strategy: 'PM-Edge',
    suggestedAction: 'Buy',
    suggestedSize: '1.5% of portfolio',
    sentimentScore: 0.75,
    agentCommentary: [
      'Current market odds: 42%, LLM probability: 48%',
      'Edge of +6% identified based on sentiment analysis',
      'Correlated with energy sector stocks',
    ],
  },
  {
    id: 'sig4',
    asset: 'TSLA',
    type: 'stock',
    combinedScore: 0.35,
    scoreLabel: 'Sell',
    drivers: {
      fundamentals: 0.42,
      vix: 0.85,
      technical: 0.28,
      sentiment: 0.15,
    },
    timeframe: 'daily',
    strategy: 'Mean Reversion',
    suggestedAction: 'Reduce 50% of position',
    suggestedSize: '-2.0% of portfolio',
    peRatio: 68.5,
    peClassification: 'Overvalued',
    vixRegime: 'Low Volatility (VIX: 14.2)',
    rsi: 72,
    macd: -0.15,
    sentimentScore: 0.15,
    agentCommentary: [
      'Valuation extended, P/E at 68 vs sector avg 22',
      'RSI showing overbought, MACD bearish crossover',
      'Sentiment deteriorating on delivery concerns',
    ],
  },
  {
    id: 'sig5',
    asset: 'META',
    type: 'stock',
    combinedScore: 0.78,
    scoreLabel: 'Buy',
    drivers: {
      fundamentals: 0.85,
      vix: 0.85,
      technical: 0.75,
      sentiment: 0.68,
    },
    timeframe: 'daily',
    strategy: 'Breakout',
    suggestedAction: 'Buy',
    suggestedSize: '3.0% of portfolio',
    peRatio: 24.8,
    peClassification: 'Fair Value',
    vixRegime: 'Low Volatility (VIX: 14.2)',
    rsi: 55,
    macd: 0.68,
    sentimentScore: 0.68,
    agentCommentary: [
      'Breaking out of 6-month consolidation pattern',
      'Strong fundamentals with improving margins',
      'AI monetization driving positive sentiment shift',
    ],
  },
  {
    id: 'sig6',
    asset: 'MSFT',
    type: 'stock',
    combinedScore: 0.65,
    scoreLabel: 'Hold',
    drivers: {
      fundamentals: 0.72,
      vix: 0.85,
      technical: 0.58,
      sentiment: 0.55,
    },
    timeframe: 'daily',
    strategy: 'Momentum',
    suggestedAction: 'Hold',
    suggestedSize: '0% (maintain current)',
    peRatio: 32.1,
    peClassification: 'Fair Value',
    vixRegime: 'Low Volatility (VIX: 14.2)',
    rsi: 50,
    macd: 0.05,
    sentimentScore: 0.55,
    agentCommentary: [
      'Solid fundamentals but lacking momentum',
      'Neutral technical setup, wait for confirmation',
      'Sentiment neutral, no clear catalyst',
    ],
  },
];

export const demoAgents: Agent[] = [
  {
    id: 'fund-analyst',
    name: 'Fundamentals Analyst',
    type: 'analyst',
    queueLength: 3,
    avgLatency: 145,
    errorRate: 0.2,
    recentActivity: [
      'Analyzed NVDA Q4 earnings: Beat expectations, raised guidance',
      'Updated AAPL fair value to $185 based on new product cycle',
      'Flagged TSLA valuation concerns: P/E 68 vs sector avg 22',
      'Reviewed META margin expansion: AI investment paying off',
      'Completed sector rotation analysis: Tech to Energy',
    ],
  },
  {
    id: 'sentiment-analyst',
    name: 'Sentiment Analyst',
    type: 'analyst',
    queueLength: 5,
    avgLatency: 89,
    errorRate: 0.5,
    recentActivity: [
      'Social sentiment spike detected: NVDA +42% positive mentions',
      'Reddit WallStreetBets tracking: High interest in AI sector',
      'Twitter sentiment shift: TSLA negativity increasing',
      'Options flow analysis: Heavy call buying in META',
      'Insider sentiment: Tech sector executives buying',
    ],
  },
  {
    id: 'news-analyst',
    name: 'News Analyst',
    type: 'analyst',
    queueLength: 2,
    avgLatency: 112,
    errorRate: 0.1,
    recentActivity: [
      'Fed minutes released: Dovish tone, rate cut signals',
      'Chip sector news: Government subsidies announced',
      'Energy sector update: Oil prices rising on supply concerns',
      'Macro event: CPI data in-line, inflation cooling',
      'Geopolitical: Trade tensions easing, positive for tech',
    ],
  },
  {
    id: 'tech-analyst',
    name: 'Technical Analyst',
    type: 'analyst',
    queueLength: 4,
    avgLatency: 67,
    errorRate: 0.3,
    recentActivity: [
      'NVDA breakout confirmed: Volume 2x average on move above $850',
      'S&P 500 golden cross: 50-day MA crossed above 200-day MA',
      'META consolidation breakout: 6-month base cleared',
      'TSLA bearish divergence: Price up but RSI declining',
      'Market breadth improving: 85% stocks above 50-day MA',
    ],
  },
  {
    id: 'bull-researcher',
    name: 'Bull Researcher',
    type: 'researcher',
    queueLength: 2,
    avgLatency: 234,
    errorRate: 0.0,
    recentActivity: [
      'NVDA Bull Case: AI revolution just beginning, 3-5 year growth runway',
      'Market Bull Case: Rate cuts incoming, liquidity improving',
      'META Bull Case: AI monetization early stages, reels competition winning',
    ],
  },
  {
    id: 'bear-researcher',
    name: 'Bear Researcher',
    type: 'researcher',
    queueLength: 2,
    avgLatency: 241,
    errorRate: 0.0,
    recentActivity: [
      'TSLA Bear Case: Valuation unsustainable, competition intensifying',
      'Market Bear Case: Valuations extended, recession risk not priced in',
      'Tech Bear Case: AI bubble forming, profit realization unclear',
    ],
  },
  {
    id: 'trader',
    name: 'Trader Agent',
    type: 'trader',
    queueLength: 6,
    avgLatency: 45,
    errorRate: 0.8,
    recentActivity: [
      'Proposed: Buy NVDA 100 shares @ $852, Edge: 12%, Rationale: Breakout + Fundamentals',
      'Proposed: Add META 75 shares @ $485, Edge: 8%, Rationale: Consolidation breakout',
      'Proposed: Reduce TSLA 50% position, Edge: 6%, Rationale: Valuation risk',
      'Proposed: Buy "Trump 2028" market @ 42%, Edge: 6%, Rationale: Sentiment analysis',
    ],
  },
  {
    id: 'risk-mgmt',
    name: 'Risk Management',
    type: 'risk',
    queueLength: 1,
    avgLatency: 78,
    errorRate: 0.1,
    recentActivity: [
      'Current VIX: 14.2 (Low volatility regime)',
      'Portfolio heat: 72% of max exposure',
      'Sector concentration check: Tech 42% (within limits)',
      'Approved NVDA position: Size validated against volatility',
      'Flagged correlation risk: 68% positions in tech sector',
    ],
  },
  {
    id: 'portfolio-mgr',
    name: 'Portfolio Manager',
    type: 'pm',
    queueLength: 3,
    avgLatency: 156,
    errorRate: 0.0,
    recentActivity: [
      'Approved: NVDA buy (risk-adjusted, edge validated)',
      'Approved: META add (improves risk/reward profile)',
      'Rejected: Oversized TSLA short (correlation risk with existing shorts)',
      'Approved: Prediction market position (small size, uncorrelated)',
      'Rebalancing: Reduced tech exposure from 48% to 42%',
    ],
  },
];

export const demoPredictionMarkets: PredictionMarket[] = [
  {
    id: 'pm1',
    platform: 'Polymarket',
    eventName: 'Trump wins 2028 Presidential Election',
    currentOdds: 0.42,
    volume: 2450000,
    liquidity: 850000,
    expectedEdge: 6.0,
    llmProbability: 0.48,
    category: 'politics',
    timeToResolution: '1420 days',
    llmAnalysis: 'Based on historical patterns, current sentiment analysis, and economic indicators, the LLM assigns a 48% probability vs market implied 42%. The model considers polling trends, economic forecasts, and historical re-election patterns. This represents a positive edge of +6%.',
    correlatedTickers: ['XLE', 'XOP', 'DIA'],
  },
  {
    id: 'pm2',
    platform: 'Kalshi',
    eventName: 'Fed cuts rates by 50bp in March',
    currentOdds: 0.28,
    volume: 1850000,
    liquidity: 650000,
    expectedEdge: 8.5,
    llmProbability: 0.365,
    category: 'macro',
    timeToResolution: '89 days',
    llmAnalysis: 'Recent Fed minutes and economic data suggest higher probability of aggressive rate cut than market pricing. CPI trending down, employment softening, and dovish Fed commentary all point to increased likelihood. Model probability 36.5% vs market 28%, edge of +8.5%.',
    correlatedTickers: ['TLT', 'GLD', 'XLF'],
  },
  {
    id: 'pm3',
    platform: 'Polymarket',
    eventName: 'Bitcoin above $100k by EOY',
    currentOdds: 0.62,
    volume: 3200000,
    liquidity: 1200000,
    expectedEdge: 4.2,
    llmProbability: 0.58,
    category: 'tech',
    timeToResolution: '28 days',
    llmAnalysis: 'Market appears slightly overpriced. While institutional adoption continues and ETF flows are strong, technical resistance at $95k and historical year-end profit-taking suggest lower probability. Model shows 58% vs market 62%, negative edge of -4%, suggesting fade opportunity.',
    correlatedTickers: ['MSTR', 'COIN', 'SQ'],
  },
  {
    id: 'pm4',
    platform: 'Kalshi',
    eventName: 'S&P 500 above 5000 by March',
    currentOdds: 0.72,
    volume: 1650000,
    liquidity: 580000,
    expectedEdge: 5.8,
    llmProbability: 0.778,
    category: 'macro',
    timeToResolution: '89 days',
    llmAnalysis: 'Strong seasonal patterns, improving breadth, and rate cut expectations support higher probability. Current level 4850, only 3% gain needed. Historical Q1 returns and current momentum suggest 77.8% probability vs market 72%. Positive edge of +5.8%.',
    correlatedTickers: ['SPY', 'QQQ', 'IWM'],
  },
  {
    id: 'pm5',
    platform: 'Polymarket',
    eventName: 'NVIDIA market cap exceeds Apple by June',
    currentOdds: 0.38,
    volume: 980000,
    liquidity: 340000,
    expectedEdge: 12.5,
    llmProbability: 0.505,
    category: 'tech',
    timeToResolution: '180 days',
    llmAnalysis: 'Market significantly underpricing this event. NVIDIA growth trajectory in AI, strong earnings momentum, and current gap of only $400B makes this very achievable. Historical precedent of rapid cap changes in tech. Model: 50.5% vs market 38%, exceptional edge of +12.5%.',
    correlatedTickers: ['NVDA', 'AAPL', 'SMH'],
  },
];

export const demoTopTraders: TopTrader[] = [
  {
    id: 'trader1',
    name: 'Nancy Pelosi',
    rank: 1,
    overallPnL: 2450000,
    winRate: 72.3,
    activePositions: 8,
    currentValue: 15200000,
    avgHoldingPeriod: '45 days',
    maxDrawdown: -8.5,
    volatility: 12.3,
    markets: ['Tech stocks', 'Healthcare', 'Financial'],
  },
  {
    id: 'trader2',
    name: 'Warren Buffett (Berkshire)',
    rank: 2,
    overallPnL: 8900000,
    winRate: 68.7,
    activePositions: 42,
    currentValue: 128500000,
    avgHoldingPeriod: '1850 days',
    maxDrawdown: -15.2,
    volatility: 8.9,
    markets: ['Value stocks', 'Financial', 'Consumer'],
  },
  {
    id: 'trader3',
    name: '@CryptoWhale247',
    rank: 3,
    overallPnL: 1850000,
    winRate: 58.2,
    activePositions: 24,
    currentValue: 4200000,
    avgHoldingPeriod: '8 days',
    maxDrawdown: -28.5,
    volatility: 42.6,
    markets: ['Crypto prediction markets', 'Tech stocks'],
  },
  {
    id: 'trader4',
    name: 'Dan Loeb (Third Point)',
    rank: 4,
    overallPnL: 3200000,
    winRate: 65.8,
    activePositions: 18,
    currentValue: 28500000,
    avgHoldingPeriod: '120 days',
    maxDrawdown: -12.8,
    volatility: 15.4,
    markets: ['Activist positions', 'Event-driven', 'Tech'],
  },
  {
    id: 'trader5',
    name: '@PolymarketPro',
    rank: 5,
    overallPnL: 680000,
    winRate: 61.5,
    activePositions: 35,
    currentValue: 1850000,
    avgHoldingPeriod: '12 days',
    maxDrawdown: -18.5,
    volatility: 28.5,
    markets: ['Political markets', 'Macro events', 'Sports'],
  },
];

export const demoPositions: Position[] = [
  {
    id: 'pos1',
    asset: 'NVDA',
    type: 'stock',
    entryPrice: 782.50,
    currentPrice: 852.30,
    size: 200,
    unrealizedPnL: 13960,
    unrealizedPnLPercent: 8.92,
    strategy: 'Momentum',
    openedBy: 'Trader Agent',
    openedAt: '2024-11-15T10:30:00Z',
  },
  {
    id: 'pos2',
    asset: 'AAPL',
    type: 'stock',
    entryPrice: 178.20,
    currentPrice: 182.45,
    size: 300,
    unrealizedPnL: 1275,
    unrealizedPnLPercent: 2.38,
    strategy: 'Momentum',
    openedBy: 'Trader Agent',
    openedAt: '2024-11-20T14:15:00Z',
  },
  {
    id: 'pos3',
    asset: 'META',
    type: 'stock',
    entryPrice: 468.90,
    currentPrice: 485.20,
    size: 150,
    unrealizedPnL: 2445,
    unrealizedPnLPercent: 3.48,
    strategy: 'Breakout',
    openedBy: 'Trader Agent',
    openedAt: '2024-11-22T11:00:00Z',
  },
  {
    id: 'pos4',
    asset: 'TSLA',
    type: 'stock',
    entryPrice: 245.80,
    currentPrice: 238.20,
    size: 100,
    unrealizedPnL: -760,
    unrealizedPnLPercent: -3.09,
    strategy: 'Mean Reversion',
    openedBy: 'Trader Agent',
    openedAt: '2024-11-18T09:45:00Z',
  },
  {
    id: 'pos5',
    asset: 'Trump wins 2028',
    type: 'prediction_market',
    entryPrice: 0.40,
    currentPrice: 0.42,
    size: 15000,
    unrealizedPnL: 300,
    unrealizedPnLPercent: 5.0,
    strategy: 'PM-Edge',
    openedBy: 'Trader Agent',
    openedAt: '2024-11-01T16:20:00Z',
  },
];

export const demoTrades: Trade[] = [
  {
    id: 'trade1',
    asset: 'NVDA',
    type: 'stock',
    action: 'buy',
    price: 852.30,
    size: 100,
    strategy: 'Momentum',
    timestamp: '2024-12-03T09:35:00Z',
  },
  {
    id: 'trade2',
    asset: 'META',
    type: 'stock',
    action: 'buy',
    price: 485.20,
    size: 75,
    strategy: 'Breakout',
    timestamp: '2024-12-03T10:15:00Z',
  },
  {
    id: 'trade3',
    asset: 'GOOGL',
    type: 'stock',
    action: 'sell',
    price: 142.80,
    size: 150,
    pnl: 2850,
    strategy: 'Momentum',
    timestamp: '2024-12-02T15:45:00Z',
  },
  {
    id: 'trade4',
    asset: 'S&P 500 > 5000',
    type: 'prediction_market',
    action: 'buy',
    price: 0.72,
    size: 10000,
    strategy: 'PM-Edge',
    timestamp: '2024-12-02T11:20:00Z',
  },
  {
    id: 'trade5',
    asset: 'MSFT',
    type: 'stock',
    action: 'sell',
    price: 378.50,
    size: 120,
    pnl: -580,
    strategy: 'Mean Reversion',
    timestamp: '2024-12-01T14:30:00Z',
  },
];

export interface RiskMetrics {
  vix: number;
  vixRegime: 'Low' | 'Moderate' | 'High' | 'Extreme';
  portfolioVolatility: number;
  maxSingleAsset: number;
  maxSector: number;
  currentLeverage: number;
  maxLeverage: number;
  varDaily: number;
  topConcentrations: { name: string; exposure: number }[];
}

export const demoRiskMetrics: RiskMetrics = {
  vix: 14.2,
  vixRegime: 'Low',
  portfolioVolatility: 18.5,
  maxSingleAsset: 6.5,
  maxSector: 42.0,
  currentLeverage: 1.35,
  maxLeverage: 2.0,
  varDaily: -12500,
  topConcentrations: [
    { name: 'Technology', exposure: 42.0 },
    { name: 'NVDA', exposure: 6.5 },
    { name: 'Prediction Markets', exposure: 9.5 },
    { name: 'META', exposure: 5.2 },
    { name: 'AAPL', exposure: 4.8 },
  ],
};
