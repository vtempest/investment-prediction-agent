# Trading Bots Services

This directory contains two AI-powered trading analysis bots with OpenAPI interfaces.

## Services Overview

### 1. TradingAgents
Multi-agent trading analysis system using LangGraph for decision-making.
- **Port**: 8001
- **Features**: Technical analysis, fundamental analysis, news sentiment, social media analysis
- **Architecture**: Multi-agent debate system with risk management

### 2. PrimoAgent
AI financial analysis and backtesting platform.
- **Port**: 8002
- **Features**: Comprehensive stock analysis, backtesting, batch analysis
- **Architecture**: LangGraph workflow with multiple analysis agents

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+ (for main app)
- API Keys (see Environment Variables below)

### Environment Variables

Create `.env` files in each service directory:

#### TradingAgents (.env)
```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key

# Optional: Alpha Vantage for financial data
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Optional: Reddit API for social sentiment
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_secret
REDDIT_USER_AGENT=your_app_name

# Server Port
PORT=8001
```

#### PrimoAgent (.env)
```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key

# Optional: Tavily for search
TAVILY_API_KEY=your_tavily_key

# Optional: Perplexity for research
PERPLEXITY_API_KEY=your_perplexity_key

# Server Port
PORT=8002
```

## Installation & Setup

### TradingAgents

```bash
cd services/TradingAgents

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-api.txt

# Create .env file with your API keys
cp .env.example .env
nano .env  # Add your API keys

# Run the API server
python api_server.py
```

Server will be available at: `http://localhost:8001`

### PrimoAgent

```bash
cd services/PrimoAgent-main

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-api.txt

# Create .env file with your API keys
cp .env.example .env
nano .env  # Add your API keys

# Run the API server
python api_server.py
```

Server will be available at: `http://localhost:8002`

## Running with Docker

### TradingAgents
```bash
cd services/TradingAgents
docker build -t tradingagents-api .
docker run -p 8001:8001 --env-file .env tradingagents-api
```

### PrimoAgent
```bash
cd services/PrimoAgent-main
docker build -t primoagent-api .
docker run -p 8002:8002 --env-file .env primoagent-api
```

## API Documentation

Once running, visit:
- TradingAgents: http://localhost:8001/docs
- PrimoAgent: http://localhost:8002/docs

Interactive API documentation (Swagger UI) is automatically available.

## Testing the APIs

### Test TradingAgents
```bash
# Health check
curl http://localhost:8001/health

# Analyze a stock
curl -X POST http://localhost:8001/analyze \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL", "date": "2024-05-10"}'
```

### Test PrimoAgent
```bash
# Health check
curl http://localhost:8002/health

# Analyze a stock
curl -X POST http://localhost:8002/analyze \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["AAPL"], "date": "2024-05-10"}'
```

## Integration with Main App

The main Next.js application can call these APIs:

```typescript
// Example: Call TradingAgents API
const response = await fetch('http://localhost:8001/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    symbol: 'AAPL',
    date: '2024-05-10'
  })
})
const data = await response.json()
```

## Production Deployment

### Using PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start TradingAgents
cd services/TradingAgents
pm2 start api_server.py --name tradingagents --interpreter python

# Start PrimoAgent
cd services/PrimoAgent-main
pm2 start api_server.py --name primoagent --interpreter python

# Save configuration
pm2 save
pm2 startup
```

### Using systemd (Linux)
Create service files in `/etc/systemd/system/`:

```ini
# /etc/systemd/system/tradingagents.service
[Unit]
Description=TradingAgents API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/services/TradingAgents
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/python api_server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start services
sudo systemctl enable tradingagents
sudo systemctl start tradingagents
sudo systemctl status tradingagents
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change PORT in .env file or kill existing process
   lsof -ti:8001 | xargs kill -9
   ```

2. **Missing API keys**
   - Ensure all required API keys are set in `.env`
   - Check environment variables: `printenv | grep API_KEY`

3. **Module not found**
   - Ensure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

4. **CORS errors**
   - Both APIs have CORS enabled for all origins
   - Check if API is running: `curl http://localhost:8001/health`

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the individual service READMEs for detailed documentation
- Review API docs at `/docs` endpoint

## License

See main repository LICENSE file.
