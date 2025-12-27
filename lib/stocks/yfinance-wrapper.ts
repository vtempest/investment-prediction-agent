// Yahoo Finance Wrapper for TypeScript
// Uses yahoo-finance2 package
// Yahoo Finance API wrapper with error handling
import YahooFinance from 'yahoo-finance2'

const yahooFinance = new YahooFinance({ suppressNotices: ['ripHistorical'] })

export interface HistoricalDataOptions {
  symbol: string
  period1: string | Date
  period2: string | Date
  interval?: '1d' | '1wk' | '1mo' | '5m' | '15m' | '30m' | '1h'
}

export interface QuoteOptions {
  symbol: string
  modules?: string[]
}

export class YFinanceWrapper {
  /**
   * Get historical price data for a symbol
   */
  async getHistoricalData(options: HistoricalDataOptions) {
    const { symbol, period1, period2, interval = '1d' } = options
    
    try {
      const result = await yahooFinance.chart(symbol, {
        period1,
        period2,
        interval
      })
      
      return {
        success: true,
        symbol,
        data: result.quotes,
        meta: result.meta
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch historical data'
      }
    }
  }

  /**
   * Get quote summary for a symbol
   */
  async getQuote(options: QuoteOptions) {
    const { symbol, modules = ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData'] } = options
    
    try {
      const data = await yahooFinance.quoteSummary(symbol, { 
        modules: modules as any 
      })
      
      return {
        success: true,
        symbol,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch quote'
      }
    }
  }

  /**
   * Search for stocks by query
   */
  async search(query: string) {
    try {
      const result = await yahooFinance.search(query)
      
      return {
        success: true,
        query,
        results: result.quotes
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to search'
      }
    }
  }

  /**
   * Get options data for a symbol
   */
  async getOptions(symbol: string, date?: Date) {
    try {
      const result = await yahooFinance.options(symbol, date ? { date } : {})
      
      return {
        success: true,
        symbol,
        data: result
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch options'
      }
    }
  }

  /**
   * Get trending stocks
   */
  async getTrending(region: string = 'US') {
    try {
      const result = await yahooFinance.trendingSymbols(region)
      
      return {
        success: true,
        region,
        data: result
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch trending'
      }
    }
  }

  /**
   * Get recommendations for a symbol
   */
  async getRecommendations(symbol: string) {
    try {
      const data = await yahooFinance.quoteSummary(symbol, { 
        modules: ['recommendationTrend', 'upgradeDowngradeHistory'] 
      })
      
      return {
        success: true,
        symbol,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch recommendations'
      }
    }
  }

  /**
   * Get financial statements for a symbol
   */
  async getFinancials(symbol: string) {
    try {
      const data = await yahooFinance.quoteSummary(symbol, { 
        modules: ['incomeStatementHistory', 'balanceSheetHistory', 'cashflowStatementHistory', 'earnings'] 
      })
      
      return {
        success: true,
        symbol,
        data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch financials'
      }
    }
  }
}

// Export singleton instance
export const yfinance = new YFinanceWrapper()
