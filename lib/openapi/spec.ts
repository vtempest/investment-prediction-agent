export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Stock Prediction Agent API",
    version: "1.0.0",
    description: "AI-powered multi-agent trading system API for comprehensive stock market analysis and automated trading decisions",
    contact: {
      name: "API Support",
      url: "https://github.com/vtempest/investment-prediction-agent"
    }
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server"
    },
    {
      url: "https://your-domain.com/api",
      description: "Production server"
    }
  ],
  tags: [
    {
      name: "Stocks",
      description: "Stock market data and analysis endpoints"
    },
    {
      name: "Trading Agents",
      description: "AI-powered trading analysis and decision making"
    },
    {
      name: "Backtesting",
      description: "Historical strategy performance testing"
    },
    {
      name: "SEC Filings",
      description: "SEC company filings and documents"
    },
    {
      name: "User Portfolio",
      description: "User portfolio management and tracking"
    },
    {
      name: "User Strategies",
      description: "User trading strategy configuration"
    },
    {
      name: "User Signals",
      description: "User watchlist and trading signals"
    }
  ],
  paths: {
    "/stocks/trending": {
      get: {
        tags: ["Stocks"],
        summary: "Get trending stocks",
        description: "Retrieve currently trending stocks in the market",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Stock" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/stocks/gainers": {
      get: {
        tags: ["Stocks"],
        summary: "Get top gainers",
        description: "Retrieve stocks with the highest gains",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Stock" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/stocks/search": {
      get: {
        tags: ["Stocks"],
        summary: "Search stocks",
        description: "Search for stocks by symbol or company name",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Search query",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/StockSearchResult" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/stocks/quote/{symbol}": {
      get: {
        tags: ["Stocks"],
        summary: "Get stock quote",
        description: "Get current price and details for a stock symbol",
        parameters: [
          {
            name: "symbol",
            in: "path",
            required: true,
            description: "Stock symbol (e.g., AAPL)",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StockQuote" }
              }
            }
          }
        }
      }
    },
    "/stocks/historical/{symbol}": {
      get: {
        tags: ["Stocks"],
        summary: "Get historical data",
        description: "Get historical price data for a stock",
        parameters: [
          {
            name: "symbol",
            in: "path",
            required: true,
            description: "Stock symbol",
            schema: { type: "string" }
          },
          {
            name: "period",
            in: "query",
            description: "Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max)",
            schema: { type: "string", default: "1mo" }
          },
          {
            name: "interval",
            in: "query",
            description: "Data interval (1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)",
            schema: { type: "string", default: "1d" }
          }
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HistoricalData" }
              }
            }
          }
        }
      }
    },
    "/stocks/screener": {
      post: {
        tags: ["Stocks"],
        summary: "Screen stocks",
        description: "Screen stocks based on criteria",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ScreenerRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Stock" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/trading-agents": {
      post: {
        tags: ["Trading Agents"],
        summary: "Analyze stock with AI agents",
        description: "Analyze a stock using multi-agent AI system (Debate Analyst or News Researcher)",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TradingAgentRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TradingAgentResponse" }
              }
            }
          }
        }
      }
    },
    "/groq-debate": {
      post: {
        tags: ["Trading Agents"],
        summary: "Groq AI debate analysis",
        description: "Fast AI-powered stock analysis using Groq",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  symbol: { type: "string", example: "AAPL" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DebateAnalysisResponse" }
              }
            }
          }
        }
      }
    },
    "/backtest": {
      post: {
        tags: ["Backtesting"],
        summary: "Run strategy backtest",
        description: "Run historical backtest for a trading strategy",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BacktestRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BacktestResponse" }
              }
            }
          }
        }
      }
    },
    "/backtest-technical": {
      post: {
        tags: ["Backtesting"],
        summary: "Run technical strategy backtest",
        description: "Backtest technical analysis strategies",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  strategy: { type: "string", enum: ["momentum", "mean-reversion", "breakout", "day-scalp"] },
                  startDate: { type: "string", format: "date" },
                  endDate: { type: "string", format: "date" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Successful response"
          }
        }
      }
    },
    "/sec/companies/{tickerOrCik}/filings": {
      get: {
        tags: ["SEC Filings"],
        summary: "Get company SEC filings",
        description: "Retrieve SEC filings for a company",
        parameters: [
          {
            name: "tickerOrCik",
            in: "path",
            required: true,
            description: "Stock ticker or CIK number",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Successful response"
          }
        }
      }
    },
    "/user/portfolio": {
      get: {
        tags: ["User Portfolio"],
        summary: "Get user portfolio",
        description: "Get current portfolio summary",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Portfolio" }
              }
            }
          }
        }
      }
    },
    "/user/portfolio/initialize": {
      post: {
        tags: ["User Portfolio"],
        summary: "Initialize portfolio",
        description: "Initialize user portfolio with starting balance",
        responses: {
          "200": {
            description: "Portfolio initialized successfully"
          }
        }
      }
    },
    "/user/strategies": {
      get: {
        tags: ["User Strategies"],
        summary: "Get user strategies",
        description: "List all user trading strategies",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Strategy" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["User Strategies"],
        summary: "Create strategy",
        description: "Create a new trading strategy",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateStrategyRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Strategy created successfully"
          }
        }
      }
    },
    "/user/strategies/{id}": {
      put: {
        tags: ["User Strategies"],
        summary: "Update strategy",
        description: "Update an existing strategy",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateStrategyRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Strategy updated successfully"
          }
        }
      },
      delete: {
        tags: ["User Strategies"],
        summary: "Delete strategy",
        description: "Delete a strategy",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Strategy deleted successfully"
          }
        }
      }
    },
    "/user/signals": {
      get: {
        tags: ["User Signals"],
        summary: "Get user signals",
        description: "Get user watchlist and trading signals",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Signal" }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Stock: {
        type: "object",
        properties: {
          symbol: { type: "string", example: "AAPL" },
          name: { type: "string", example: "Apple Inc." },
          price: { type: "number", example: 175.43 },
          change: { type: "number", example: 2.15 },
          changePercent: { type: "number", example: 1.24 }
        }
      },
      StockSearchResult: {
        type: "object",
        properties: {
          symbol: { type: "string" },
          name: { type: "string" },
          exchange: { type: "string" },
          type: { type: "string" }
        }
      },
      StockQuote: {
        type: "object",
        properties: {
          symbol: { type: "string" },
          price: { type: "number" },
          open: { type: "number" },
          high: { type: "number" },
          low: { type: "number" },
          volume: { type: "number" },
          marketCap: { type: "number" },
          pe: { type: "number" }
        }
      },
      HistoricalData: {
        type: "object",
        properties: {
          symbol: { type: "string" },
          timestamps: { type: "array", items: { type: "number" } },
          prices: { type: "array", items: { type: "number" } }
        }
      },
      ScreenerRequest: {
        type: "object",
        properties: {
          minMarketCap: { type: "number" },
          maxMarketCap: { type: "number" },
          minPE: { type: "number" },
          maxPE: { type: "number" },
          sector: { type: "string" }
        }
      },
      TradingAgentRequest: {
        type: "object",
        required: ["symbol", "agent"],
        properties: {
          symbol: { type: "string", example: "AAPL" },
          agent: { type: "string", enum: ["debate-analyst", "news-researcher"], example: "debate-analyst" },
          deep_think_llm: { type: "string", example: "llama-3.1-70b-versatile" },
          quick_think_llm: { type: "string", example: "llama-3.1-8b-instant" },
          max_debate_rounds: { type: "integer", example: 1 }
        }
      },
      TradingAgentResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          symbol: { type: "string" },
          decision: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["BUY", "SELL", "HOLD"] },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              reasoning: { type: "string" },
              risk_assessment: { type: "string" }
            }
          },
          analysis: {
            type: "object",
            properties: {
              bull_arguments: { type: "array", items: { type: "string" } },
              bear_arguments: { type: "array", items: { type: "string" } },
              technical_indicators: { type: "object" },
              sentiment_score: { type: "number" }
            }
          }
        }
      },
      DebateAnalysisResponse: {
        type: "object",
        properties: {
          decision: { type: "string" },
          confidence: { type: "number" },
          analysis: { type: "string" }
        }
      },
      BacktestRequest: {
        type: "object",
        required: ["symbol"],
        properties: {
          symbol: { type: "string", example: "AAPL" },
          printlog: { type: "boolean", default: false }
        }
      },
      BacktestResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          symbol: { type: "string" },
          primo_results: {
            type: "object",
            properties: {
              total_return: { type: "number" },
              sharpe_ratio: { type: "number" },
              max_drawdown: { type: "number" },
              win_rate: { type: "number" }
            }
          },
          buyhold_results: { type: "object" },
          comparison: { type: "object" }
        }
      },
      Portfolio: {
        type: "object",
        properties: {
          totalEquity: { type: "number" },
          cash: { type: "number" },
          stocks: { type: "number" },
          dailyPnL: { type: "number" },
          dailyPnLPercent: { type: "number" },
          winRate: { type: "number" },
          openPositions: { type: "integer" }
        }
      },
      Strategy: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          type: { type: "string", enum: ["momentum", "mean-reversion", "breakout", "day-scalp"] },
          status: { type: "string", enum: ["running", "paused", "paper"] },
          riskLevel: { type: "string", enum: ["low", "medium", "high"] },
          todayPnL: { type: "number" },
          winRate: { type: "number" }
        }
      },
      CreateStrategyRequest: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["momentum", "mean-reversion", "breakout", "day-scalp"] },
          riskLevel: { type: "string", enum: ["low", "medium", "high"] }
        }
      },
      UpdateStrategyRequest: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["running", "paused", "paper"] },
          config: { type: "object" }
        }
      },
      Signal: {
        type: "object",
        properties: {
          id: { type: "string" },
          asset: { type: "string" },
          type: { type: "string" },
          combinedScore: { type: "number" },
          scoreLabel: { type: "string" },
          fundamentalsScore: { type: "number" },
          technicalScore: { type: "number" },
          sentimentScore: { type: "number" },
          suggestedAction: { type: "string" }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    }
  }
}
