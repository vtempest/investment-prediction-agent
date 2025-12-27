// TypeScript type definitions for stocks API

// ==========================================
// Yahoo Finance Types
// ==========================================

export interface QuoteResponse {
  success: boolean;
  symbol: string;
  data: any;
  timestamp: string;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface HistoricalResponse {
  success: boolean;
  symbol: string;
  period: {
    start: string;
    end: string;
  };
  interval: string;
  dataPoints: number;
  data: HistoricalDataPoint[];
  timestamp: string;
}

export interface PERatioDataPoint {
  date: string;
  price: number;
  ttmEPS: number;
  peRatio: number | null;
}

export interface PEStatistics {
  count: number;
  current: number | null;
  average: number;
  median: number;
  min: number;
  max: number;
}

export interface PERatioResponse {
  success: boolean;
  symbol: string;
  period: {
    start: string;
    end: string;
  };
  interval: string;
  statistics: PEStatistics;
  dataPoints: number;
  data: PERatioDataPoint[];
  timestamp: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exch: string;
  type: string;
  exchDisp: string;
  typeDisp: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  count: number;
  data: SearchResult[];
  timestamp: string;
}

// ==========================================
// SEC Filing Types
// ==========================================

export interface Ticker {
  symbol: string;
  exchange: string;
}

export interface FilingMetadata {
  primaryDocUrl: string;
  accessionNumber: string;
  tickers: Ticker[];
  companyName: string;
  filingDate: string;
  reportDate: string;
  primaryDocDescription: string;
  items: string;
  formType: string;
  cik: string;
}

export interface RequestedFilings {
  tickerOrCik: string;
  formType: string;
  limit: number | null;
}

export interface CompanyAndAccessionNumber {
  tickerOrCik: string;
  accessionNumber: string;
}

export interface FileContent {
  path: string;
  content: string;
}

export interface TickerToCikMapping {
  [ticker: string]: string;
}

// ==========================================
// P/E Calculator Types
// ==========================================

export interface EarningsDataPoint {
  date: Date;
  eps: number;
  period: string;
}

export interface PriceDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface CalculatedPERatio {
  date: Date;
  price: number;
  ttmEPS: number | null;
  peRatio: number | null;
}

export interface PECalculationResult {
  priceData: PriceDataPoint[];
  earningsData: EarningsDataPoint[];
  peRatios: CalculatedPERatio[];
  statistics: PEStatistics | null;
}



// ==========================================
// Statistical Prediction Types
// ==========================================

export interface XGBoostParams {
  verbosity?: number;
  max_depth?: number;
  eta?: number;
  objective?: string;
  nthread?: number;
  subsample?: number;
  colsample_bytree?: number;
  colsample_bylevel?: number;
  min_child_weight?: number;
  gamma?: number;
  alpha?: number;
  lambda?: number;
  early_stopping_rounds?: number;
  seed?: number;
  nrounds?: number;
  tree_method?: string;
  grow_policy?: string;
}

export interface TrainModelsOptions {
  xgbParams?: XGBoostParams;
  testSize?: number;
  featuresToUse?: string[];
}

export interface PredictOptions {
  featuresToUse?: string[];
}

export interface TrainTestSplit {
  trainFeatures: any[][];
  testFeatures: any[][];
  trainTarget: number[];
  testTarget: number[];
}



export interface ContractData {
  contractSymbol?: string;
  strike?: number;
  currency?: string;
  lastPrice?: number;
  change?: number;
  percentChange?: number;
  volume?: number;
  openInterest?: number;
  bid?: number;
  ask?: number;
  contractSize?: string;
  expiration?: number;
  lastTradeDate?: number;
  impliedVolatility?: number;
  inTheMoney?: boolean;
  delta?: number;
  theta?: number;
  vega?: number;
  gamma?: number;
  rho?: number;
  leverage?: number;
}

export interface ContractDataByStrike {
  [strike: number]: ContractData | undefined;
}

export interface OptionChain {
  call: ContractDataByStrike;
  put: ContractDataByStrike;
}

export interface Expiration {
  expirationString: string;
  expirationTimestamp: number;
}

export interface OptionMeta {
  strikes: number[];
  expirations: Expiration[];
}

export interface Quote {
  language?: string;
  region?: string;
  quoteType?: string;
  triggerable?: number;
  quoteSourceName?: string;
  currency?: string;
  regularMarketPreviousClose?: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  fullExchangeName?: string;
  financialCurrency?: string;
  regularMarketOpen?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  fiftyTwoWeekLowChange?: number;
  fiftyTwoWeekLowChangePercent?: number;
  fiftyTwoWeekRange?: string;
  fiftyTwoWeekHighChange?: number;
  fiftyTwoWeekHighChangePercent?: number;
  exchange?: string;
  shortName?: string;
  longName?: string;
  messageBoardId?: string;
  exchangeTimezoneName?: string;
  exchangeTimezoneShortName?: string;
  gmtOffSetMilliseconds?: number;
  market?: string;
  esgPopulated?: number;
  sharesOutstanding?: number;
  fiftyDayAverage?: number;
  fiftyDayAverageChange?: number;
  fiftyDayAverageChangePercent?: number;
  twoHundredDayAverage?: number;
  twoHundredDayAverageChange?: number;
  twoHundredDayAverageChangePercent?: number;
  marketCap?: number;
  sourceInterval?: number;
  exchangeDataDelayedBy?: number;
  tradeable?: number;
  firstTradeDateMilliseconds?: number;
  priceHint?: number;
  postMarketChangePercent?: number;
  postMarketTime?: number;
  postMarketPrice?: number;
  postMarketChange?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
  regularMarketPrice?: number;
  regularMarketDayHigh?: number;
  regularMarketDayRange?: string;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  ytdReturn?: number;
  trailingThreeMonthReturns?: number;
  trailingThreeMonthNavReturns?: number;
  marketState?: string;
  symbol?: string;
}
