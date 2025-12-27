# Debate Agents Integration Summary

The `@lib/debate-agents-js/` library has been successfully integrated into the project and is now accessible from the dashboard.

## Multi-Agent System Overview

The system employs **10 specialized AI agents** working in three phases:

### Phase 1: Analysis Team (Parallel)
- **Market Analyst** 🔷 - Technical analysis, liquidity, price trends
- **Sentiment Analyst** 💭 - Social media, retail sentiment, discovery status
- **News Analyst** 📰 - Recent events, catalysts, jurisdiction risks
- **Fundamentals Analyst** 📊 - Financial scoring, valuation metrics

### Phase 2: Research Team (Debate)
- **Bull Researcher** 🐂 - Advocates for BUY, identifies opportunities
- **Bear Researcher** 🐻 - Identifies risks, checks thesis violations
- **Research Manager** 🎯 - Synthesizes debate, ensures thesis compliance

### Phase 3: Execution Team (Decision)
- **Trader** ⚡ - Proposes execution parameters
- **Risk Team** ⚖️ (3 managers: Risky/Safe/Neutral) - Debates position sizing
- **Portfolio Manager** 👔 - Final authority, makes BUY/SELL/HOLD decision

For detailed agent descriptions, see [lib/debate-agents-js/AGENTS.md](lib/debate-agents-js/AGENTS.md).

## Quick Access

### Dashboard
- **URL**: `/dashboard/debate-agents`
- **Access**: Dashboard → Agents tab → "Try Debate Agents" button
- **Features**: Interactive stock analysis with AI agents

### API
- **Endpoint**: `/api/debate-agents`
- **Methods**: POST, GET
- **Example**:
  \`\`\`bash
  curl -X POST http://localhost:3000/api/debate-agents \
    -H "Content-Type: application/json" \
    -d '{"ticker": "AAPL", "quickMode": true}'
  \`\`\`

## What Was Added

### New Files
1. **[app/api/debate-agents/route.ts](app/api/debate-agents/route.ts)**
   - REST API endpoint for analysis requests
   - Spawns subprocess to run analysis
   - Returns JSON results

2. **[lib/debate-agents-js/simple-runner.js](lib/debate-agents-js/simple-runner.js)**
   - Lightweight analysis runner
   - Uses available debate-agents modules
   - CLI and programmatic interface

3. **[components/dashboard/debate-agents-analysis.tsx](components/dashboard/debate-agents-analysis.tsx)**
   - React component for user interaction
   - Ticker input, quick mode toggle
   - Results display with decision badges

4. **[app/dashboard/debate-agents/page.tsx](app/dashboard/debate-agents/page.tsx)**
   - Full page dedicated to debate agents
   - Explains how the system works
   - Shows agent roles and capabilities

5. **[lib/debate-agents-js/INTEGRATION.md](lib/debate-agents-js/INTEGRATION.md)**
   - Detailed integration documentation
   - Architecture diagrams
   - API usage examples

### Modified Files
1. **[components/dashboard/agents-tab.tsx](components/dashboard/agents-tab.tsx)**
   - Added prominent call-to-action card
   - Links to debate agents page
   - Featured at top of Agents tab

## How It Works

\`\`\`
User (Dashboard) → API Endpoint → simple-runner.js → Debate Agents Modules → LLM Analysis → Results
\`\`\`

1. User enters ticker symbol in dashboard
2. API endpoint receives request
3. Spawns Node.js subprocess running simple-runner.js
4. Runner uses debate-agents-js modules:
   - Validates ticker
   - Fetches market data
   - Runs LLM analysis using market analyst prompts
   - Generates BUY/SELL/HOLD recommendation
5. Results returned to dashboard
6. User sees analysis with decision badge and details

## Current Features

✅ **Working**:
- Ticker validation and correction
- Real-time quote data from Yahoo Finance
- Market data analysis (price, volume, P/E ratio, 52-week range)
- LLM-based investment analysis
- BUY/SELL/HOLD decision making
- Token usage tracking and cost estimation
- Quick Mode (Gemini Flash) and Deep Mode (Gemini Pro)
- Markdown report generation

⚠️ **Simplified** (awaiting full multi-agent implementation):
- Currently uses single market analyst instead of full debate system
- Full multi-agent debate requires: agents.js, graph.js, toolkit.js, main.js

See [lib/debate-agents-js/COMPLETION_SUMMARY.md](lib/debate-agents-js/COMPLETION_SUMMARY.md) for implementation status.

## Environment Variables

Required in `.env` or `.env.local`:

\`\`\`bash
# Required
GOOGLE_API_KEY=your_gemini_api_key
FINNHUB_API_KEY=your_finnhub_key (optional for simple runner)
TAVILY_API_KEY=your_tavily_key (optional for simple runner)

# Optional
OPENAI_API_KEY=your_openai_key
DEEP_MODEL=gemini-3-pro-preview
QUICK_MODEL=gemini-2.0-flash
\`\`\`

## Usage Examples

### From Dashboard
1. Go to http://localhost:3000/dashboard/debate-agents
2. Enter ticker: AAPL
3. Toggle Quick Mode if needed
4. Click "Analyze"
5. View BUY/SELL/HOLD recommendation with analysis

### From API (JavaScript)
\`\`\`javascript
const response = await fetch('/api/debate-agents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ticker: 'AAPL',
    quickMode: true,
    quiet: true
  })
})

const { result } = await response.json()
console.log(result.decision) // BUY, SELL, or HOLD
console.log(result.analysis) // Full analysis text
\`\`\`

### From Command Line
\`\`\`bash
cd lib/debate-agents-js
node simple-runner.js --ticker AAPL
node simple-runner.js --ticker NVDA --quick
\`\`\`

## Performance

- **Quick Mode**: 5-15 seconds
- **Deep Mode**: 30-60 seconds
- **Token Usage**: 1,000-5,000 tokens
- **Cost**: $0.002-$0.01 per analysis

## Testing

\`\`\`bash
# Start dev server
npm run dev

# Test API endpoint
curl -X POST http://localhost:3000/api/debate-agents \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL", "quickMode": true}'

# Test runner directly
cd lib/debate-agents-js
node simple-runner.js --ticker AAPL --quick
\`\`\`

## Next Steps

To enable the full multi-agent debate system:

1. Implement `agents.js` - Agent factory functions for all roles
2. Implement `graph.js` - LangGraph state machine for debate flow
3. Implement `toolkit.js` - Market data and research tools
4. Implement `main.js` - Full CLI with complete workflow

This will enable the complete multi-agent debate with:
- 4 Analysts (Market, Sentiment, News, Fundamentals)
- 3 Researchers (Bull, Bear, Research Manager)
- 3 Execution agents (Trader, Risk Team, Portfolio Manager)

## Documentation

- **Agent Descriptions**: [lib/debate-agents-js/AGENTS.md](lib/debate-agents-js/AGENTS.md) - Detailed descriptions of all 10 agents
- **Integration Details**: [lib/debate-agents-js/INTEGRATION.md](lib/debate-agents-js/INTEGRATION.md) - Technical integration guide
- **Library README**: [lib/debate-agents-js/README.md](lib/debate-agents-js/README.md) - Main library documentation
- **Quick Start**: [lib/debate-agents-js/QUICKSTART.md](lib/debate-agents-js/QUICKSTART.md) - 5-minute setup guide
- **Setup Guide**: [lib/debate-agents-js/SETUP.md](lib/debate-agents-js/SETUP.md) - Detailed configuration
- **Completion Status**: [lib/debate-agents-js/COMPLETION_SUMMARY.md](lib/debate-agents-js/COMPLETION_SUMMARY.md) - Implementation progress
- **OpenAPI Spec**: [lib/openapi/investment-agent-openapi.json](lib/openapi/investment-agent-openapi.json) - API specification (includes `/api/debate-agents`)

## Support

For issues:
1. Check environment variables are set correctly
2. Verify API keys are valid
3. Review server logs for subprocess errors
4. Check browser console for client-side errors
5. See documentation links above

---

**Status**: ✅ Integration Complete
**Accessible From**: Dashboard → Agents tab → "Try Debate Agents"
**API Endpoint**: `/api/debate-agents`
