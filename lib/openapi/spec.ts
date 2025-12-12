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
      url: "https://timetravel.investments/api",
      description: "Production server"
    },
    {
      url: "http://localhost:3000/api",
      description: "Development server"
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
    },
    {
      name: "Statistics",
      description: "Statistical analysis and predictive modeling"
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
    "/stocks/delisted": {
      get: {
        tags: ["Stocks"],
        summary: "Get delisted stocks",
        description: "Retrieve list of delisted stocks or check if a specific symbol is delisted",
        parameters: [
          {
            name: "symbol",
            in: "query",
            description: "Optional: Check if specific symbol is delisted",
            schema: { type: "string" }
          },
          {
            name: "exchange",
            in: "query",
            description: "Exchange code (default: US). Examples: US, LSE, TO",
            schema: { type: "string", default: "US" }
          },
          {
            name: "limit",
            in: "query",
            description: "Number of results to return (default: 50)",
            schema: { type: "integer", default: 50 }
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
                    delisted: { type: "boolean" },
                    count: { type: "integer" },
                    total: { type: "integer" },
                    data: {
                      oneOf: [
                        {
                          type: "object",
                          properties: {
                            symbol: { type: "string" },
                            name: { type: "string" },
                            delistedDate: { type: "string" },
                            reason: { type: "string" }
                          }
                        },
                        {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              symbol: { type: "string" },
                              name: { type: "string" },
                              delistedDate: { type: "string" },
                              reason: { type: "string" }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/user/settings": {
      get: {
        tags: ["User"],
        summary: "Get user settings",
        description: "Retrieve user settings and API keys (masked)",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Settings" }
              }
            }
          },
          "401": {
            description: "Unauthorized"
          }
        }
      },
      post: {
        tags: ["User"],
        summary: "Save user settings",
        description: "Save or update user settings and API keys",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Settings" }
            }
          }
        },
        responses: {
          "200": {
            description: "Settings saved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" }
                  }
                }
              }
            }
          },
          "401": {
            description: "Unauthorized"
          }
        }
      }
    },
    "/zulu/sync": {
      post: {
        tags: ["Zulu Social Trading"],
        summary: "Sync Zulu Traders",
        description: "Manually trigger a sync of top traders from ZuluTrade",
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
                      type: "object",
                      properties: {
                        traders: { type: "integer" }
                      }
                    },
                    message: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/zulu/search": {
      get: {
        tags: ["Zulu"],
        summary: "Search Zulu traders",
        description: "Search for Zulu traders with performance filters",
        parameters: [
          {
            name: "minRoi",
            in: "query",
            description: "Minimum ROI percentage",
            schema: { type: "number" }
          },
          {
            name: "minWinRate",
            in: "query",
            description: "Minimum Win Rate percentage",
            schema: { type: "number" }
          },
          {
            name: "maxDrawdown",
            in: "query",
            description: "Maximum Drawdown percentage",
            schema: { type: "number" }
          },
          {
            name: "isEa",
            in: "query",
            description: "Filter by EA (Expert Advisor) usage",
            schema: { type: "boolean" }
          },
          {
            name: "limit",
            in: "query",
            description: "Max results (default: 50)",
            schema: { type: "integer", default: 50 }
          }
        ],
        responses: {
          "200": {
            description: "Successful response"
          }
        }
      }
    },
    "/zulu/top-rank": {
      get: {
        tags: ["Zulu"],
        summary: "Get top ranked traders",
        description: "Get list of top ranked Zulu traders",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Max results (default: 50)",
            schema: { type: "integer", default: 50 }
          }
        ],
        responses: {
          "200": {
            description: "Successful response"
          }
        }
      }
    },
    "/polymarket/markets": {
      get: {
        tags: ["Polymarket"],
        summary: "Get prediction markets",
        description: "Get active Polymarket prediction markets",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Max results (default: 20)",
            schema: { type: "integer", default: 20 }
          },
          {
            name: "window",
            in: "query",
            description: "Time window for sorting (24h, total)",
            schema: { type: "string", default: "24h" }
          }
        ],
        responses: {
          "200": {
            description: "Successful response"
          }
        }
      }
    },
    "/polymarket/positions": {
      post: {
        tags: ["Polymarket"],
        summary: "Get trader positions",
        description: "Get positions for a specific Polymarket trader",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  trader_id: { type: "string" }
                },
                required: ["trader_id"]
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
    "/stocks/autocomplete": {
      get: {
        tags: ["Stocks"],
        summary: "Autocomplete stock search",
        description: "Search for stocks by symbol or name prefix",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Search query string",
            schema: { type: "string" }
          },
          {
            name: "limit",
            in: "query",
            description: "Max results (default: 10)",
            schema: { type: "integer", default: 10 }
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
                    count: { type: "integer" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          symbol: { type: "string" },
                          name: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/stocks/sectors": {
      get: {
        tags: ["Stocks"],
        summary: "Get sector information",
        description: "Retrieve aggregated sector data, including total companies, market cap, and top companies. Can filter by specific sector.",
        parameters: [
          {
            name: "sector",
            in: "query",
            description: "Optional: Filter by specific sector name (e.g., 'Technology')",
            schema: { type: "string" }
          },
          {
            name: "includeCompanies",
            in: "query",
            description: "Include top 10 companies for each sector (default: false)",
            schema: { type: "boolean" }
          },
          {
            name: "includeIndustries",
            in: "query",
            description: "Include industry breakdown for each sector (default: false)",
            schema: { type: "boolean" }
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
                    count: { type: "integer" },
                    data: {
                      oneOf: [
                        {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              sector: { type: "string" },
                              totalCompanies: { type: "integer" },
                              totalMarketCap: { type: "number" },
                              top10Companies: { 
                                type: "array",
                                items: { $ref: "#/components/schemas/Stock" }
                              },
                              industries: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    name: { type: "string" },
                                    totalCompanies: { type: "integer" },
                                    totalMarketCap: { type: "number" }
                                  }
                                }
                              }
                            }
                          }
                        },
                        {
                          type: "object",
                          properties: {
                            sector: { type: "string" },
                            totalCompanies: { type: "integer" },
                            totalMarketCap: { type: "number" },
                            top10Companies: { 
                              type: "array",
                              items: { $ref: "#/components/schemas/Stock" }
                            },
                             industries: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    name: { type: "string" },
                                    totalCompanies: { type: "integer" },
                                    totalMarketCap: { type: "number" }
                                  }
                                }
                              }
                          }
                        }
                      ]
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
    "/stocks/predict/statistics": {
      post: {
        tags: ["Statistics"],
        summary: "Calculate stock statistics",
        description: "Perform advanced statistical analysis including rolling statistics and timeseries correlation (e.g., price vs volume, cross-asset correlation).",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StatisticsRequest" },
              examples: {
                "rolling_stats": {
                  summary: "Calculate Rolling Stats",
                  value: {
                    symbol: "AAPL",
                    period: "1y",
                    metrics: ["rolling_mean", "rolling_std"],
                    window: 20
                  }
                },
                "correlation": {
                  summary: "Timeseries Correlation",
                  value: {
                    symbol: "TSLA",
                    correlation: {
                      target: "price",
                      features: ["volume", "rsi", "macd"],
                      window: 50
                    }
                  }
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
                schema: { $ref: "#/components/schemas/StatisticsResponse" }
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
          deep_think_llm: { type: "string", example: "llama-3.3-70b-versatile" },
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
      },
      StatisticsRequest: {
        type: "object",
        properties: {
          symbol: { type: "string", example: "AAPL" },
          period: { type: "string", default: "1y" },
          metrics: { 
            type: "array", 
            items: { type: "string", enum: ["rolling_mean", "rolling_std", "bollinger_bands"] }
          },
          window: { type: "integer", default: 14 },
          correlation: {
            type: "object",
            description: "Configuration for correlating different timeseries data",
            properties: {
              target: { type: "string", example: "price", description: "Primary series to correlate against" },
              features: { 
                type: "array", 
                items: { type: "string" },
                example: ["volume", "sector_etf_price", "market_index_price"],
                description: "List of other timeseries to test for correlation" 
              },
              method: { type: "string", enum: ["pearson", "spearman"], default: "pearson" }
            }
          }
        }
      },
      StatisticsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          symbol: { type: "string" },
          data: {
            type: "object",
            properties: {
              timestamps: { type: "array", items: { type: "string" } },
              values: { type: "object", additionalProperties: { type: "array", items: { type: "number" } } },
              correlations: {
                type: "object",
                description: "Correlation coefficients between target and features",
                additionalProperties: { type: "number" },
                example: {
                  "volume": 0.45,
                  "sector_etf_price": 0.89,
                  "market_index_price": 0.92
                }
              }
            }
          }
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
