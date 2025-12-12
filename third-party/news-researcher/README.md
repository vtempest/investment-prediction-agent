# PrimoAgent: Multi-Agent Stock Analysis

## Overview

PrimoAgent is an multi agent AI stock analysis system built on LangGraph architecture that orchestrates four specialized agents to provide comprehensive daily trading insights and next-day price predictions. The system integrates Natural Language Processing (NLP) with technical analysis and portfolio management to enhance decision-making in stock markets, aiming to minimize risk and potential losses through deep financial market analysis.


## Core Architecture

### Sequential Pipeline Design
The system implements a **linear LangGraph workflow** where each specialized agent processes and enhances the shared state:

```
Data Collection Agent
    ↓ (Market data, company info, financial metrics)
Technical Analysis Agent  
    ↓ (SMA, RSI, MACD, Bollinger Bands, ADX, CCI)
News Intelligence Agent
    ↓ (7 quantified NLP features from financial news)
Portfolio Manager Agent
    ↓ (Trading signals with confidence levels)
```

### Key Components

**1. Data Collection Agent** (`src/agents/data_collection_agent.py`)
- Collects real-time market data via yFinance and Finnhub APIs
- Retrieves company profiles, financial metrics, and recent news
- Handles weekend/holiday news periods automatically

**2. Technical Analysis Agent** (`src/agents/technical_analysis_agent.py`)
- Calculates 6 technical indicators: SMA, RSI, MACD, Bollinger Bands, ADX, CCI
- Provides momentum and trend analysis for informed decision-making

**3. News Intelligence Agent** (`src/agents/news_intelligence_agent.py`)
- Processes financial news through **7 quantified NLP features**:
  - `news_relevance` (-2 to 2)
  - `sentiment` (-2 to 2)
  - `price_impact_potential` (-2 to 2)
  - `trend_direction` (-2 to 2)
  - `earnings_impact` (-2 to 2)
  - `investor_confidence` (-2 to 2)
  - `risk_profile_change` (-2 to 2)
- Filters trusted financial sources and extracts significant news content

**4. Portfolio Manager Agent** (`src/agents/portfolio_manager_agent.py`)
- Integrates all previous analysis into trading signals (BUY/SELL/HOLD)
- Provides confidence levels (0.0-1.0) and position sizing recommendations
- Uses historical context from previous decisions for adaptive strategies

## Project Structure

```
src/
  agents/            # Four specialized agents
  backtesting/       # Backtest engine, strategies, reporting
  config/            # Configuration management and model factory
  prompts/           # LLM prompt templates for each agent
  tools/             # External API integrations
  workflows/         # LangGraph state management and workflow

output/
  csv/               # Daily analysis results per symbol
  backtests/         # Backtest charts and reports
```


## Performance Results

### Recent Multi-Stock Backtest Results

Our latest backtest results demonstrate PrimoAgent's effectiveness across diverse stocks:

| Stock | Strategy | Final Value | Return % | Volatility % | Sharpe | Max DD % | Trades |
|-------|----------|-------------|----------|--------------|--------|----------|--------|
| AAPL | PrimoAgent | $93,122 | -6.88% | 8.03% | -2.042 | 9.82% | 36 |
| AAPL | Buy & Hold | $84,750 | -15.25% | 40.05% | -0.707 | 29.76% | 1 |
| | | | | | | | |
| AMZN | PrimoAgent | $100,152 | +0.15% | 21.47% | 0.028 | 18.07% | 25 |
| AMZN | Buy & Hold | $98,602 | -1.40% | 38.10% | 0.058 | 30.79% | 1 |
| | | | | | | | |
| META | PrimoAgent | $131,967 | +31.97% | 19.75% | 2.899 | 8.99% | 26 |
| META | Buy & Hold | $122,165 | +22.16% | 43.10% | 1.124 | 34.04% | 1 |
| | | | | | | | |
| NFLX | PrimoAgent | $128,606 | +28.61% | 20.25% | 2.570 | 12.13% | 20 |
| NFLX | Buy & Hold | $149,506 | +49.51% | 36.60% | 2.399 | 19.01% | 1 |
| | | | | | | | |
| TSLA | PrimoAgent | $96,647 | -3.35% | 6.52% | -1.355 | 7.72% | 33 |
| TSLA | Buy & Hold | $83,407 | -16.59% | 75.75% | -0.149 | 47.84% | 1 |
| | | | | | | | |


### Performance Comparison Charts

![Returns Comparison](output/backtests/returns_comparison.png)

Individual stock performance charts available in `output/backtests/`:
- [AAPL Performance Chart](output/backtests/backtest_results_AAPL.png)
- [META Performance Chart](output/backtests/backtest_results_META.png) 
- [NFLX Performance Chart](output/backtests/backtest_results_NFLX.png)
- [AMZN Performance Chart](output/backtests/backtest_results_AMZN.png)
- [TSLA Performance Chart](output/backtests/backtest_results_TSLA.png)

## Quick Start

### Environment Setup

1) **Create and activate virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate
```

2) **Install dependencies**
```bash
pip install -r requirements.txt
```

3) **Configure API keys**
```bash
cp .env.example .env
```

Required API keys in `.env`:
```bash
OPENAI_API_KEY=your_openai_key_here
FINNHUB_API_KEY=your_finnhub_key_here  
FIRECRAWL_API_KEY=your_firecrawl_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here
```

### Two-Step Workflow
#### Step 1: Data Collection and Analysis
```bash
python main.py
```
This **must be run first** to collect and analyze market data. The system will interactively prompt for:
- **Stock symbol** (e.g., `AAPL`, `TSLA`, `META`)
- **Start date** in `YYYY-MM-DD` format (e.g., `2025-05-28`)
- **End date** in `YYYY-MM-DD` format (e.g., `2025-06-30`)


#### Step 2: Backtesting (Only After Step 1 Complete)
```bash
python backtest.py
```

## License and Disclaimer

This project is licensed under the MIT License. This repository contains academic research code intended for educational purposes only. Nothing herein constitutes financial advice or trading recommendations. The trading strategies and analyses are experimental in nature and have not been validated for real-world trading. Users should be aware that trading involves substantial risk of loss and should always consult financial professionals before making investment decisions.
