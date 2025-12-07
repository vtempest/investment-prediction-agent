/**
 * Stock Prediction Agents API Client
 * Connects to unified API gateway and individual agent services
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const NEWS_RESEARCHER_URL = process.env.NEXT_PUBLIC_NEWS_RESEARCHER_URL || 'http://localhost:8002'
const DEBATE_ANALYST_URL = process.env.NEXT_PUBLIC_DEBATE_ANALYST_URL || 'http://localhost:8001'

// Top stocks lists
export const TOP_STOCKS = {
  sp500Top: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'BRK.B', 'LLY', 'V'],
  tech: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META', 'TSLA', 'ORCL', 'CRM', 'ADBE', 'NFLX'],
  faang: ['META', 'AAPL', 'AMZN', 'NFLX', 'GOOGL'],
  mag7: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA'],
  mostActive: ['TSLA', 'NVDA', 'AAPL', 'AMD', 'PLTR', 'SOFI', 'F', 'NIO', 'LCID', 'RIVN']
}

// Types
export interface NewsResearcherAnalysisRequest {
  symbols: string[]
  date?: string
}

export interface NewsResearcherAnalysisResponse {
  success: boolean
  symbols: string[]
  date: string
  result: {
    data_collection_results?: any
    technical_analysis_results?: any
    news_intelligence_results?: any
    portfolio_manager_results?: {
      decision: 'BUY' | 'SELL' | 'HOLD'
      confidence: number
      reasoning: string
    }
  }
  timestamp: string
}

export interface DebateAnalystAnalysisRequest {
  symbol: string
  date?: string
  deep_think_llm?: string
  quick_think_llm?: string
  max_debate_rounds?: number
}

export interface DebateAnalystAnalysisResponse {
  success: boolean
  symbol: string
  date: string
  decision: {
    action: 'BUY' | 'SELL' | 'HOLD'
    confidence: number
    position_size: number
    reasoning: string
    debate_summary?: {
      bull_arguments: string[]
      bear_arguments: string[]
      risk_assessment: string
    }
  }
  timestamp: string
}

export interface BacktestRequest {
  symbol: string
  data_dir?: string
  printlog?: boolean
}

export interface BacktestResponse {
  success: boolean
  symbol: string
  primo_results: {
    'Starting Portfolio Value [$]': number
    'Final Portfolio Value [$]': number
    'Cumulative Return [%]': number
    'Annual Return [%]': number
    'Annual Volatility [%]': number
    'Sharpe Ratio': number
    'Max Drawdown [%]': number
    'Total Trades': number
    'Win Rate [%]': number
  }
  buyhold_results: any
  comparison: {
    relative_return: number
    outperformed: boolean
    metrics: {
      cumulative_return_diff: number
      volatility_diff: number
      max_drawdown_diff: number
      sharpe_diff: number
    }
  }
  timestamp: string
}

export interface BatchAnalysisRequest {
  symbols: string[]
  start_date: string
  end_date: string
}

// API Client Class
export class StockAgentsAPI {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  // Helper method for API calls
  private async fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(error.detail || `API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Health Check
  async getHealth() {
    return this.fetchAPI<{
      status: string
      timestamp: string
      services: {
        news_researcher: string
        debate_analyst: string
      }
    }>('/health')
  }

  // News Researcher (PrimoAgent) Methods
  async analyzeWithNewsResearcher(
    request: NewsResearcherAnalysisRequest
  ): Promise<NewsResearcherAnalysisResponse> {
    return this.fetchAPI('/news-researcher/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async batchAnalyzeWithNewsResearcher(request: BatchAnalysisRequest) {
    return this.fetchAPI('/news-researcher/analyze/batch', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Debate Analyst (TradingAgents) Methods
  async analyzeWithDebateAnalyst(
    request: DebateAnalystAnalysisRequest
  ): Promise<DebateAnalystAnalysisResponse> {
    return this.fetchAPI('/debate-analyst/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async reflectOnTrade(positionReturns: number) {
    return this.fetchAPI('/debate-analyst/reflect', {
      method: 'POST',
      body: JSON.stringify({ position_returns: positionReturns }),
    })
  }

  async getDebateAnalystConfig() {
    return this.fetchAPI('/debate-analyst/config')
  }

  // Backtesting Methods
  async runBacktest(request: BacktestRequest): Promise<BacktestResponse> {
    return this.fetchAPI('/backtest', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getAvailableStocks(dataDir: string = './output/csv') {
    return this.fetchAPI(`/backtest/available-stocks?data_dir=${encodeURIComponent(dataDir)}`)
  }

  // Batch Methods for Multiple Stocks
  async analyzeTopStocks(
    stockList: keyof typeof TOP_STOCKS = 'mag7',
    agent: 'news-researcher' | 'debate-analyst' = 'news-researcher'
  ) {
    const symbols = TOP_STOCKS[stockList]

    if (agent === 'news-researcher') {
      return this.analyzeWithNewsResearcher({ symbols })
    } else {
      // For debate analyst, analyze each stock individually
      const results = await Promise.allSettled(
        symbols.map(symbol =>
          this.analyzeWithDebateAnalyst({ symbol })
        )
      )
      return results
    }
  }

  async batchBacktest(symbols: string[]) {
    const results = await Promise.allSettled(
      symbols.map(symbol => this.runBacktest({ symbol }))
    )
    return results
  }
}

// Singleton instance
export const stockAgentsAPI = new StockAgentsAPI()

// Convenience functions
export async function analyzeStock(
  symbol: string,
  agent: 'news-researcher' | 'debate-analyst' = 'debate-analyst'
) {
  if (agent === 'news-researcher') {
    return stockAgentsAPI.analyzeWithNewsResearcher({ symbols: [symbol] })
  } else {
    return stockAgentsAPI.analyzeWithDebateAnalyst({ symbol })
  }
}

export async function analyzeTopStocks(
  list: keyof typeof TOP_STOCKS = 'mag7',
  agent: 'news-researcher' | 'debate-analyst' = 'news-researcher'
) {
  return stockAgentsAPI.analyzeTopStocks(list, agent)
}

export async function backtestStock(symbol: string) {
  return stockAgentsAPI.runBacktest({ symbol })
}

export async function getServiceHealth() {
  return stockAgentsAPI.getHealth()
}

// React Query hooks helpers (for use with @tanstack/react-query)
export const queryKeys = {
  health: ['health'] as const,
  newsResearcher: (symbols: string[]) => ['news-researcher', ...symbols] as const,
  debateAnalyst: (symbol: string) => ['debate-analyst', symbol] as const,
  backtest: (symbol: string) => ['backtest', symbol] as const,
  availableStocks: ['available-stocks'] as const,
  topStocks: (list: string, agent: string) => ['top-stocks', list, agent] as const,
}
