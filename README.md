# Investment Prediction Agent

> AI-powered multi-agent trading system for comprehensive stock market analysis and automated trading decisions.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🚀 Overview

The **Investment Prediction Agent** is a sophisticated platform combining 8 specialized AI agents to analyze markets, debate strategies, and execute trades. It features real-time data processing, a "Bull vs. Bear" debate engine, and a modern dashboard for visualization.

### ✨ Key Features

- **Multi-Agent Architecture**: 8 agents including Fundamentals, News, Technical, and Risk Managers.
- **Top Traders Leaderboard**: Real-time tracking of top performers from ZuluTrade and Polymarket.
- **Interactive Dashboard**: Modern UI with specific agent reports, history tracking, and technical charts.
- **"Bull vs. Bear" Debates**: Automated debates to assess risk and reward before every trade.
- **Groq Integration**: High-speed inference using `llama-3.3-70b-versatile`.

## 🛠️ Quick Start

**Prerequisites**: Node.js 18+, Python 3.9+, and API Keys (Groq, OpenAI, etc.).

1.  **Clone & Install**
    ```bash
    git clone https://github.com/vtempest/investment-prediction-agent.git
    cd investment-prediction-agent
    npm install             # Install frontend deps
    npm run db:push         # Initialize database
    ```

2.  **Setup Python Agents**
    ```bash
    cd agents
    # Setup venv and install dependencies for specific agents as needed
    # See agents/README.md for detailed setup
    pip install -r requirements.txt
    ```

3.  **Run Services**
    ```bash
    # Terminal 1: Frontend
    npm run dev

    # Terminal 2: Unified Backend
    cd agents && python unified_api_server.py
    ```

4.  **Explore**: Open [http://localhost:3000](http://localhost:3000).

## 🤖 AI Agents & Strategies

| Agent/Team | Role |
| :--- | :--- |
| **Analyst Team** | Gathers data: Fundamentals, Sentiment (Social), News, & Technical Analysis. |
| **Researcher Team** | Conducts "Bull vs. Bear" debates; assesses risk. |
| **Trader Agent** | Synthesizes reports to propose trades. |
| **Portfolio Manager** | Final decision maker; manages risk and position sizing. |

**Strategies**: Momentum (Trend Following), Mean Reversion, Breakout (Volatility), and Day Trading Scalp.

## 📂 Project Ecosystem


- **[Documentation](./docs/README.md)**: Full architecture and API details.
- **[Lightweight Charts](https://www.tradingview.com/lightweight-charts/)**: Deep dive into the AI stack.
- **[LangChain Integration](./docs/GROQ_LANGCHAIN_INTEGRATION.md)**: Deep dive into the AI stack.
- **[API Docs](http://localhost:3000/api/docs)**: Interactive Scalar documentation (when running).

## 📦 Project Structure

```
├── agents/             # Python AI services (News, Debate, etc.)
├── app/                # Next.js App Router
├── components/         # React UI (Dashboard, Charts)
├── lib/                # Shared utilities & Database schema
└── docs/               # Detailed documentation
```

## 🤝 Contributing & License

Contributions are welcome! Please open an issue or PR. Licensed under [MIT](LICENSE).
