// Demo data generators for AI Broker dashboard

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
  likes?: number;
  source?: string;
  author?: string;
  created?: string;
  updated?: string;
  script_type?: string;
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
  // Buy and Hold
  {
    id: 'buy-hold',
    name: 'Buy Hold',
    description: 'Simple buy and hold strategy for long-term investment',
    todayPnL: 1200,
    last7DaysPnL: 8500,
    last30DaysPnL: 32400,
    winRate: 65.0,
    activeMarkets: 10,
    tradesToday: 0,
    status: 'running',
    timeframe: 'Long-term',
    riskLevel: 'low',
    bestConditions: 'Bullish markets, stable growth',
    avoidWhen: 'Bear markets, high volatility',
  },
  // Momentum Strategies
  {
    id: 'awesome-oscillator',
    name: 'Awesome Oscillator',
    description: 'Measures market momentum using 5-34 period simple moving averages',
    todayPnL: 2340,
    last7DaysPnL: 11200,
    last30DaysPnL: 38900,
    winRate: 56.8,
    activeMarkets: 8,
    tradesToday: 6,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Trending markets, clear momentum',
    avoidWhen: 'Choppy markets, low volatility',
  },
  {
    id: 'rsi-2',
    name: 'RSI 2',
    description: 'Short-term mean reversion using 2-period RSI for extreme readings',
    todayPnL: 1890,
    last7DaysPnL: 9400,
    last30DaysPnL: 41200,
    winRate: 62.3,
    activeMarkets: 12,
    tradesToday: 8,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Range-bound markets, mean reversion',
    avoidWhen: 'Strong trending markets',
  },
  {
    id: 'ichimoku-cloud',
    name: 'Ichimoku Cloud',
    description: 'Japanese technical system showing support, resistance, momentum and trend',
    todayPnL: 3120,
    last7DaysPnL: 14500,
    last30DaysPnL: 52300,
    winRate: 58.9,
    activeMarkets: 9,
    tradesToday: 5,
    status: 'running',
    timeframe: 'Daily to Weekly',
    riskLevel: 'medium',
    bestConditions: 'Clear trends, trending markets',
    avoidWhen: 'Choppy, sideways markets',
  },
  {
    id: 'stochastic-oscillator',
    name: 'Stochastic Oscillator',
    description: 'Momentum indicator comparing closing price to price range over time',
    todayPnL: 1560,
    last7DaysPnL: 7800,
    last30DaysPnL: 29400,
    winRate: 54.2,
    activeMarkets: 10,
    tradesToday: 7,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Overbought/oversold conditions',
    avoidWhen: 'Strong trending markets',
  },
  {
    id: 'williams-r',
    name: 'Williams R',
    description: 'Momentum indicator showing overbought/oversold levels',
    todayPnL: 980,
    last7DaysPnL: 5600,
    last30DaysPnL: 22100,
    winRate: 52.8,
    activeMarkets: 7,
    tradesToday: 4,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'low',
    bestConditions: 'Range-bound markets',
    avoidWhen: 'Strong trends',
  },
  // Trend Strategies
  {
    id: 'apo',
    name: 'Absolute Price Oscillator (APO)',
    description: 'Difference between two moving averages expressed as absolute value',
    todayPnL: 2100,
    last7DaysPnL: 10200,
    last30DaysPnL: 38700,
    winRate: 55.4,
    activeMarkets: 11,
    tradesToday: 6,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Trending markets',
    avoidWhen: 'Sideways markets',
  },
  {
    id: 'aroon',
    name: 'Aroon Strategy',
    description: 'Identifies trend changes and strength using Aroon up/down indicators',
    todayPnL: 1740,
    last7DaysPnL: 8900,
    last30DaysPnL: 35600,
    winRate: 57.1,
    activeMarkets: 9,
    tradesToday: 5,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'New trends forming',
    avoidWhen: 'Consolidation periods',
  },
  {
    id: 'bop',
    name: 'Balance of Power (BOM)',
    description: 'Measures buying and selling pressure in the market',
    todayPnL: 1420,
    last7DaysPnL: 6800,
    last30DaysPnL: 28300,
    winRate: 53.6,
    activeMarkets: 8,
    tradesToday: 4,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Strong directional moves',
    avoidWhen: 'Low volume, sideways',
  },
  {
    id: 'cfo',
    name: 'Chande Forecast Oscillator (CFO)',
    description: 'Percentage difference between actual and forecasted price',
    todayPnL: 890,
    last7DaysPnL: 4500,
    last30DaysPnL: 19800,
    winRate: 51.2,
    activeMarkets: 6,
    tradesToday: 3,
    status: 'paper',
    timeframe: 'Daily',
    riskLevel: 'low',
    bestConditions: 'Trend following',
    avoidWhen: 'Erratic price action',
  },
  {
    id: 'kdj',
    name: 'KDJ Strategy',
    description: 'Enhanced stochastic indicator with J line for earlier signals',
    todayPnL: 2680,
    last7DaysPnL: 12100,
    last30DaysPnL: 46200,
    winRate: 59.4,
    activeMarkets: 10,
    tradesToday: 7,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Trending with pullbacks',
    avoidWhen: 'Choppy markets',
  },
  {
    id: 'macd',
    name: 'MACD Strategy',
    description: 'Moving Average Convergence Divergence for trend and momentum',
    todayPnL: 3450,
    last7DaysPnL: 15800,
    last30DaysPnL: 58400,
    winRate: 61.2,
    activeMarkets: 14,
    tradesToday: 9,
    status: 'running',
    timeframe: 'Daily to Weekly',
    riskLevel: 'medium',
    bestConditions: 'Clear trends, momentum shifts',
    avoidWhen: 'Sideways, low volatility',
  },
  {
    id: 'psar',
    name: 'Parabolic SAR',
    description: 'Stop and Reverse system for trailing stops and trend reversals',
    todayPnL: 2230,
    last7DaysPnL: 10800,
    last30DaysPnL: 42500,
    winRate: 56.7,
    activeMarkets: 11,
    tradesToday: 6,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Strong trending markets',
    avoidWhen: 'Choppy, ranging markets',
  },
  {
    id: 'typical-price',
    name: 'Typical Price',
    description: 'Uses average of high, low, and close for trend identification',
    todayPnL: 1150,
    last7DaysPnL: 5900,
    last30DaysPnL: 24700,
    winRate: 52.9,
    activeMarkets: 7,
    tradesToday: 4,
    status: 'paper',
    timeframe: 'Daily',
    riskLevel: 'low',
    bestConditions: 'Stable trends',
    avoidWhen: 'Volatile markets',
  },
  {
    id: 'vortex',
    name: 'Vortex Strategy',
    description: 'Identifies trend starts and direction using positive/negative movement',
    todayPnL: 1890,
    last7DaysPnL: 8700,
    last30DaysPnL: 34200,
    winRate: 55.8,
    activeMarkets: 9,
    tradesToday: 5,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Trend reversals',
    avoidWhen: 'Sideways markets',
  },
  // Volatility Strategies
  {
    id: 'acceleration-bands',
    name: 'Acceleration Bands',
    description: 'Envelope bands based on price movement to identify breakouts',
    todayPnL: 2540,
    last7DaysPnL: 11600,
    last30DaysPnL: 44800,
    winRate: 57.3,
    activeMarkets: 10,
    tradesToday: 6,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'high',
    bestConditions: 'Volatility expansion',
    avoidWhen: 'Low volatility',
  },
  {
    id: 'bollinger-bands',
    name: 'Bollinger Bands',
    description: 'Volatility bands around moving average for overbought/oversold',
    todayPnL: 3780,
    last7DaysPnL: 16200,
    last30DaysPnL: 61500,
    winRate: 62.8,
    activeMarkets: 15,
    tradesToday: 10,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Range-bound with volatility',
    avoidWhen: 'Strong trends',
  },
  {
    id: 'projection-oscillator',
    name: 'Projection Oscillator',
    description: 'Projects price momentum using volatility and trend strength',
    todayPnL: 1670,
    last7DaysPnL: 7900,
    last30DaysPnL: 31200,
    winRate: 54.6,
    activeMarkets: 8,
    tradesToday: 5,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Volatile markets',
    avoidWhen: 'Low volatility',
  },
  // Volume Strategies
  {
    id: 'cmf',
    name: 'Chaikin Money Flow (CMF)',
    description: 'Volume-weighted average of accumulation and distribution',
    todayPnL: 2890,
    last7DaysPnL: 13400,
    last30DaysPnL: 49800,
    winRate: 59.7,
    activeMarkets: 11,
    tradesToday: 7,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'High volume trends',
    avoidWhen: 'Low volume periods',
  },
  {
    id: 'emv',
    name: 'Ease of Movement (EMV)',
    description: 'Relates price change to volume for effortless price movement',
    todayPnL: 1340,
    last7DaysPnL: 6200,
    last30DaysPnL: 26400,
    winRate: 53.2,
    activeMarkets: 7,
    tradesToday: 4,
    status: 'paper',
    timeframe: 'Daily',
    riskLevel: 'low',
    bestConditions: 'Easy price movement',
    avoidWhen: 'Heavy volume churn',
  },
  {
    id: 'force-index',
    name: 'Force Index',
    description: 'Combines price and volume to measure buying/selling pressure',
    todayPnL: 2120,
    last7DaysPnL: 9800,
    last30DaysPnL: 38100,
    winRate: 56.1,
    activeMarkets: 9,
    tradesToday: 6,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Volume confirmation',
    avoidWhen: 'Thin volume',
  },
  {
    id: 'mfi',
    name: 'Money Flow Index',
    description: 'Volume-weighted RSI showing money flowing in/out of security',
    todayPnL: 3120,
    last7DaysPnL: 14200,
    last30DaysPnL: 53700,
    winRate: 60.4,
    activeMarkets: 13,
    tradesToday: 8,
    status: 'running',
    timeframe: 'Daily',
    riskLevel: 'medium',
    bestConditions: 'Volume divergences',
    avoidWhen: 'Low volume',
  },
  {
    id: 'nvi',
    name: 'Negative Volume Index (NVI)',
    description: 'Tracks price changes on days when volume decreases',
    todayPnL: 890,
    last7DaysPnL: 4100,
    last30DaysPnL: 18200,
    winRate: 50.8,
    activeMarkets: 5,
    tradesToday: 3,
    status: 'paper',
    timeframe: 'Daily',
    riskLevel: 'low',
    bestConditions: 'Smart money accumulation',
    avoidWhen: 'High volume days',
  },
  {
    id: 'vwap',
    name: 'Volume Weighted Average Price',
    description: 'Average price weighted by volume, key for institutional trading',
    todayPnL: 4200,
    last7DaysPnL: 18900,
    last30DaysPnL: 68400,
    winRate: 64.5,
    activeMarkets: 16,
    tradesToday: 11,
    status: 'running',
    timeframe: 'Intraday',
    riskLevel: 'medium',
    bestConditions: 'Intraday trading',
    avoidWhen: 'Low liquidity',
  },
];

export const demoSignals: Signal[] = [];

export const demoAgents: Agent[] = [
  {
    id: 'fund-analyst',
    name: 'Fundamentals Analyst',
    type: 'analyst',
    queueLength: 3,
    avgLatency: 145,
    errorRate: 0.2,
    recentActivity: [],
  },
  {
    id: 'sentiment-analyst',
    name: 'Sentiment Analyst',
    type: 'analyst',
    queueLength: 5,
    avgLatency: 89,
    errorRate: 0.5,
    recentActivity: [],
  },
  {
    id: 'news-analyst',
    name: 'News Analyst',
    type: 'analyst',
    queueLength: 2,
    avgLatency: 112,
    errorRate: 0.1,
    recentActivity: [],
  },
  {
    id: 'tech-analyst',
    name: 'Technical Analyst',
    type: 'analyst',
    queueLength: 4,
    avgLatency: 67,
    errorRate: 0.3,
    recentActivity: [],
  },
  {
    id: 'bull-researcher',
    name: 'Bull Researcher',
    type: 'researcher',
    queueLength: 2,
    avgLatency: 234,
    errorRate: 0.0,
    recentActivity: [],
  },
  {
    id: 'bear-researcher',
    name: 'Bear Researcher',
    type: 'researcher',
    queueLength: 2,
    avgLatency: 241,
    errorRate: 0.0,
    recentActivity: [],
  },
  {
    id: 'trader',
    name: 'Trader Agent',
    type: 'trader',
    queueLength: 6,
    avgLatency: 45,
    errorRate: 0.8,
    recentActivity: [],
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
