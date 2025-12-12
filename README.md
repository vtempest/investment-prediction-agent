# Investment Prediction Agent

> AI-powered multi-agent trading system for comprehensive stock market analysis and automated trading decisions

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🚀 Overview

Investment Prediction Agent is a sophisticated AI-powered trading platform that leverages multiple specialized AI agents to analyze market data, debate investment strategies, and execute informed trading decisions. Built with Next.js for the frontend and Python-based AI agents for backend analysis, the platform provides institutional-grade market insights with next-day price predictions.

### Key Capabilities

- **Multi-Agent Analysis System**: 8 specialized AI agents working collaboratively
- **Real-time Market Analysis**: Process market data instantly with optimized pipelines
- **Algorithmic Trading Strategies**: 4 distinct strategies for different market conditions
- **Next-Day Price Predictions**: ML-powered forecasting with comprehensive analysis
- **Risk Management**: Deep analysis to identify potential losses before they happen
- **Backtesting Engine**: Historical performance analysis and strategy validation

---

## 🤖 Specialized Agent Teams

The platform uses a sophisticated multi-agent architecture where specialized AI agents collaborate to analyze markets and make trading decisions.

### Analyst Team (4 Agents)

**1. Fundamentals Analyst** 📊
- Evaluates company financials and performance metrics
- Identifies intrinsic values and potential red flags
- Analyzes financial statements and earnings reports

**2. Sentiment Analyst** 💬
- Analyzes social media and public sentiment
- Uses sentiment scoring algorithms
- Provides short-term trading signals based on market mood

**3. News Analyst** 📰
- Monitors global news and macroeconomic indicators
- Interprets market event impacts
- Tracks geopolitical and economic developments

**4. Technical Analyst** 📈
- Utilizes technical indicators (MACD, RSI, Bollinger Bands)
- Detects chart patterns and trends
- Forecasts price movements based on historical data

### Decision-Making Team (4 Agents)

**5. Researcher Team** 🔬
- Conducts structured bull vs bear debates
- Critically assesses analyst insights
- Balances risk vs reward for each opportunity

**6. Trader Agent** 💼
- Synthesizes reports from analysts and researchers
- Determines optimal trade timing and position sizing
- Executes market orders based on strategy

**7. Risk Management** 🛡️
- Continuously evaluates portfolio risk
- Assesses market volatility and liquidity
- Adjusts strategies based on market conditions

**8. Portfolio Manager** 👔
- Final decision authority for all trades
- Approves or rejects transaction proposals
- Maintains portfolio oversight and execution

---

## 📊 Algorithmic Trading Strategies

The platform includes 4 distinct AI-powered trading strategies designed for different market conditions:

### 1. Momentum Trading (Trend Following)
- **Best For**: Strong trending markets, sector strength
- **Timeframe**: Daily
- **Win Rate**: 50-60%
- **Risk**: Moderate
- **Entry Signals**: RSI recovery, MACD crossover, volume surge, strong trend (ADX > 25)
- **Exit Signals**: Overbought conditions, MACD reversal, stop-loss/take-profit triggers

### 2. Mean Reversion (Statistical)
- **Best For**: Range-bound markets, high volatility
- **Timeframe**: Daily
- **Win Rate**: 55-65%
- **Risk**: Moderate
- **Entry Signals**: Lower Bollinger Band touch, severe oversold (RSI < 25), Z-score deviation
- **Exit Signals**: Middle Bollinger Band cross, RSI normalization, profit targets

### 3. Breakout Trading (Volatility)
- **Best For**: Consolidation periods, catalysts, earnings
- **Timeframe**: Daily
- **Win Rate**: 45-55%
- **Risk**: Higher
- **Entry Signals**: 20-day high breakout, volume surge (2x average), ATR expansion
- **Exit Signals**: ATR trailing stop, support break, profit/loss targets

### 4. Day Trading Scalp (High Frequency)
- **Best For**: High liquidity stocks, tight spreads, active hours
- **Timeframe**: 1-5 minutes
- **Win Rate**: 50-55%
- **Risk**: Lower
- **Entry Signals**: EMA crossover, price > VWAP, tight spreads, momentum surge
- **Exit Signals**: Quick profit targets (+0.5%), tight stops (-0.3%), time limits

---

## 🏗️ Architecture

### Agent Workflow Pipeline

```
┌─────────────────┐
│  Analyst Team   │ → 4 specialized analysts gather multi-source data
└────────┬────────┘
         ↓ Insights and market analysis
┌─────────────────┐
│ Researcher Team │ → Bull vs Bear structured debates
└────────┬────────┘
         ↓ Risk/reward assessment
┌─────────────────┐
│  Trader Agent   │ → Synthesizes insights, determines timing & magnitude
└────────┬────────┘
         ↓ Trading proposal
┌─────────────────┐
│ Risk Management │ → Evaluates volatility, liquidity, adjusts strategy
└────────┬────────┘
         ↓ Risk-adjusted proposal
┌─────────────────┐
│Portfolio Manager│ → Final approval/rejection → Exchange Execution
└─────────────────┘
```

### Technology Stack

**Frontend**
- **Framework**: Next.js 16.0 with React 19
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Hook Form
- **Data Visualization**: Recharts
- **Authentication**: Better Auth with Drizzle ORM

**Backend & AI Agents**
- **Languages**: Python 3.9+ 
- **AI Framework**: LangChain, LangGraph
- **LLM Providers**: OpenAI, Anthropic, Groq, Google Gemini
- **Data Sources**: Yahoo Finance, Alpha Vantage, Reddit API

**Database**
- **ORM**: Drizzle ORM
- **Database**: Turso (LibSQL) - Edge-ready SQLite database
- **API Documentation**: Scalar - Interactive OpenAPI documentation

---

## 🌟 Features

### Core Features
- ⚡ **Real-time Analysis** - Process market data instantly with optimized multi-agent pipeline
- 🛡️ **Risk Minimization** - Deep analysis to identify potential losses before they happen  
- 📈 **Price Predictions** - Next-day price predictions powered by comprehensive market analysis
- 🕒 **Daily Insights** - Fresh trading insights generated every market day
- 🌐 **Multi-source Data** - Aggregate data from news, social media, and financial reports
- 🔒 **Secure Processing** - Encrypted analysis data, never shared

### Advanced Capabilities
- **Pattern Recognition** - AI-powered candlestick and chart pattern detection
- **Technical Indicators** - 20+ technical indicators including MACD, RSI, Bollinger Bands
- **Sentiment Analysis** - Social media and news sentiment scoring
- **Backtesting Engine** - Historical performance validation
- **API Gateway** - Unified REST API with OpenAPI specification
- **Interactive Dashboard** - Real-time visualization and analysis
- **Groq + LangChain Integration** - Fast inference with LangChain-style tools for TypeScript agents ([Learn More](./GROQ_LANGCHAIN_INTEGRATION.md))

---

## 📦 Installation

### Prerequisites
- **Node.js** 18+ (for dashboard)
- **Python** 3.9+ (for AI agents)
- **API Keys** (see Environment Variables section)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/vtempest/investment-prediction-agent.git
cd investment-prediction-agent
```

2. **Install frontend dependencies**
```bash
npm install
# or
pnpm install
```

3. **Install Python agent dependencies**
```bash
# For News Researcher Agent
cd agents/news-researcher
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-api.txt

# For Debate Analyst Agent
cd ../debate-analyst
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-api.txt
```

4. **Configure environment variables**
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your API keys
nano .env
```

5. **Initialize the database**
```bash
# For local development (uses local SQLite file)
npm run db:push

# For production with Turso
# See docs/TURSO_SETUP.md for detailed instructions
turso db create stock-prediction-db
turso db tokens create stock-prediction-db
# Update .env with Turso URL and token
npm run db:push
```

### Environment Variables

Create a `.env` file in the project root:

```bash
# Dashboard API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# LLM Provider API Keys (choose one or more)
GROQ_API_KEY=gsk_...              # Recommended: Fast & cheap
OPENAI_API_KEY=sk-...             # Alternative
ANTHROPIC_API_KEY=sk-ant-...      # Alternative
GOOGLE_API_KEY=AIza...            # Alternative

# Optional: Financial Data APIs
ALPHA_VANTAGE_API_KEY=your_key    # For historical data
REDDIT_CLIENT_ID=your_id          # For social sentiment
REDDIT_CLIENT_SECRET=your_secret
REDDIT_USER_AGENT=your_app_name

# Optional: Research APIs
TAVILY_API_KEY=your_key           # For web search
PERPLEXITY_API_KEY=your_key       # For research

# Database (for authentication)
DATABASE_URL=your_database_url
```

---

## 🎯 Usage

### Running the Services

**Terminal 1: Unified API Gateway (Recommended)**
```bash
cd agents
python unified_api_server.py
# Runs on http://localhost:8000
```

**Terminal 2: News Researcher Agent**
```bash
cd agents/news-researcher
python api_server.py
# Runs on http://localhost:8002
```

**Terminal 3: Debate Analyst Agent**
```bash
cd agents/debate-analyst
python api_server.py
# Runs on http://localhost:8001
```

**Terminal 4: Next.js Dashboard**
```bash
# In project root
npm run dev
# Runs on http://localhost:3000
```

### Using the Dashboard

1. Open http://localhost:3000
2. Navigate to the **API Data** tab
3. Select a stock list (e.g., "Magnificent 7", "FAANG", "S&P 500 Top 10")
4. Choose a stock symbol (e.g., "AAPL", "GOOGL", "TSLA")
5. Click **Analyze** to get AI-powered insights
6. View analysis results including:
   - Trading decision (BUY/SELL/HOLD)
   - Confidence score
   - Bull and bear arguments
   - Risk assessment
   - Position sizing recommendation

### API Usage Examples

#### Analyze with Debate Analyst
```bash
curl -X POST http://localhost:8000/debate-analyst/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "deep_think_llm": "llama-3.1-70b-versatile",
    "quick_think_llm": "llama-3.1-8b-instant"
  }'
```

#### Analyze with News Researcher
```bash
curl -X POST http://localhost:8000/news-researcher/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL", "GOOGL", "MSFT"],
    "date": "2024-01-15"
  }'
```

#### Run Backtest
```bash
curl -X POST http://localhost:8000/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "printlog": false
  }'
```

### JavaScript/TypeScript SDK

```typescript
import { stockAgentsAPI, TOP_STOCKS } from '@/lib/api/stock-agents-api'

// Analyze a single stock
const result = await stockAgentsAPI.analyzeWithDebateAnalyst({
  symbol: 'AAPL',
  deep_think_llm: 'llama-3.1-70b-versatile',
  quick_think_llm: 'llama-3.1-8b-instant',
  max_debate_rounds: 1
})

console.log(result.decision.action)      // BUY, SELL, or HOLD
console.log(result.decision.confidence)  // 0.0 - 1.0
console.log(result.decision.reasoning)   // Detailed explanation

// Batch analyze top stocks
const results = await stockAgentsAPI.analyzeTopStocks('mag7', 'debate-analyst')
```

---

## 📖 API Documentation

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/news-researcher/analyze` | POST | Analyze stocks with News Researcher |
| `/news-researcher/analyze/batch` | POST | Batch analyze multiple dates |
| `/debate-analyst/analyze` | POST | Analyze with Debate Analyst |
| `/debate-analyst/reflect` | POST | Update agent memory |
| `/debate-analyst/config` | GET | Get agent configuration |
| `/backtest` | POST | Run historical backtest |
| `/backtest/available-stocks` | GET | List available stocks for backtest |

### Interactive API Documentation

Once the services are running, visit:
- **Next.js API (Scalar)**: http://localhost:3000/api/docs - Modern, interactive API documentation
- **OpenAPI Spec**: http://localhost:3000/api/openapi - Raw OpenAPI specification
- **Unified Gateway**: http://localhost:8000/docs - Python agents Swagger UI
- **News Researcher**: http://localhost:8002/docs - News Researcher API
- **Debate Analyst**: http://localhost:8001/docs - Debate Analyst API

The Scalar documentation provides a modern, searchable interface for exploring all Next.js API endpoints.

### Supported Stock Lists

- **Magnificent 7**: AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA
- **S&P 500 Top 10**: AAPL, MSFT, NVDA, GOOGL, AMZN, META, TSLA, BRK.B, LLY, V
- **Top Tech**: AAPL, MSFT, NVDA, GOOGL, META, TSLA, ORCL, CRM, ADBE, NFLX
- **FAANG**: META, AAPL, AMZN, NFLX, GOOGL
- **Most Active**: TSLA, NVDA, AAPL, AMD, PLTR, SOFI, F, NIO, LCID, RIVN

---

## 🔧 Configuration

### LLM Provider Selection

The platform supports multiple LLM providers. Configure in agent config files:

**News Researcher**: `agents/news-researcher/src/config/config.json`
```json
{
  "models": {
    "portfolio_manager": {
      "provider": "groq",
      "model": "llama-3.1-70b-versatile",
      "temperature": 0.3
    }
  }
}
```

**Debate Analyst**: `agents/debate-analyst/tradingagents/default_config.py`
```python
DEFAULT_CONFIG = {
    "llm_provider": "groq",
    "deep_think_llm": "llama-3.1-70b-versatile",
    "quick_think_llm": "llama-3.1-8b-instant"
}
```

### Performance Optimization

**Recommended for Production:**
- Use **Groq** for fast inference (up to 500 tokens/sec)
- Use `llama-3.1-70b-versatile` for complex analysis
- Use `llama-3.1-8b-instant` for quick responses
- Enable caching with React Query (5-10 minute stale time)
- Implement batch requests for multiple stocks

---

## 🧪 Testing

### Run Unit Tests
```bash
# Frontend tests
npm test

# Python agent tests
cd agents/tests
pytest
```

### Run Backtests
```bash
# Via API
curl -X POST http://localhost:8000/backtest \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL"}'
```

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Stop services
docker-compose down
```

### Individual Services

**News Researcher**
```bash
cd agents/news-researcher
docker build -t news-researcher .
docker run -p 8002:8002 --env-file .env news-researcher
```

**Debate Analyst**
```bash
cd agents/debate-analyst
docker build -t debate-analyst .
docker run -p 8001:8001 --env-file .env debate-analyst
```

---

## 📚 Documentation

### Additional Documentation

- **[Turso Database Setup](docs/TURSO_SETUP.md)** - Turso/LibSQL database configuration guide
- **[Scalar API Documentation](docs/SCALAR_API_DOCS.md)** - Interactive API documentation setup
- **[Agent Services Documentation](agents/README.md)** - Trading bot services setup
- **[API Integration Guide](docs/DASHBOARD_API_README.md)** - Dashboard API integration
- **[Unified LLM API](agents/UNIFIED_API_README.md)** - LLM client documentation
- **[API Data Summary](docs/API_DATA_SUMMARY.md)** - API endpoints and responses
- **[Documentation Index](docs/README.md)** - Complete documentation overview

### Project Structure

```
investment-prediction-agent/
├── agents/                    # AI agent services
│   ├── news-researcher/      # News-driven analysis agent
│   ├── debate-analyst/       # Multi-agent debate system
│   ├── unified_llm_client.py # Universal LLM interface
│   └── unified_api_server.py # API gateway
├── app/                       # Next.js pages and routes
├── components/               # React components
│   ├── landing/             # Landing page sections
│   └── dashboard/           # Dashboard components
├── docs/                     # Documentation files
├── lib/                      # Utility libraries
├── public/                   # Static assets
└── styles/                   # Global styles
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

---

## 🔒 Security

- All API keys are stored in environment variables
- Analysis data is encrypted and never shared
- Authentication uses Better Auth with secure sessions
- Database credentials managed through environment variables

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **LangChain** - AI agent orchestration framework
- **Next.js** - React framework for production
- **Groq** - High-performance LLM inference
- **Yahoo Finance** - Market data provider
- **Radix UI** - Accessible component library

---

## 📞 Support

For issues, questions, or feature requests:

- **GitHub Issues**: https://github.com/vtempest/investment-prediction-agent/issues
- **API Documentation**: http://localhost:8000/docs (when server is running)
- **Documentation**: Check the [docs/](docs/) directory

---

## 🚧 Roadmap

- [ ] Real-time WebSocket streaming for live analysis
- [ ] Mobile app (iOS/Android)
- [ ] Additional trading strategies (Options, Crypto)
- [ ] Portfolio optimization with genetic algorithms
- [ ] Multi-timeframe analysis (1H, 4H, Weekly)
- [ ] Integration with broker APIs for live trading
- [ ] Advanced backtesting with slippage and fees
- [ ] Machine learning model ensemble
- [ ] Custom indicator builder

---

## 📄 Research Paper

For more details on the technical implementation and research behind this project, see our paper:

[Investment Prediction Agent Research Paper](https://drive.google.com/file/d/1haVl0uguVYnLh8D3EUdaIyi3Tl4kSOIP/view?usp=drive_link)

---

**Built with ❤️ by the Investment Prediction Agent Team**
