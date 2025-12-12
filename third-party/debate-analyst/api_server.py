"""
TradingAgents OpenAPI Server
FastAPI server to expose TradingAgents functionality via REST API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG

app = FastAPI(
    title="TradingAgents API",
    description="AI-powered trading analysis and decision-making API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global trading graph instance
trading_graph: Optional[TradingAgentsGraph] = None


class AnalysisRequest(BaseModel):
    symbol: str
    date: Optional[str] = None
    deep_think_llm: Optional[str] = "gpt-4o-mini"
    quick_think_llm: Optional[str] = "gpt-4o-mini"
    max_debate_rounds: Optional[int] = 1


class AnalysisResponse(BaseModel):
    success: bool
    symbol: str
    date: str
    decision: Dict[str, Any]
    timestamp: str


class ReflectionRequest(BaseModel):
    position_returns: float


class ConfigResponse(BaseModel):
    config: Dict[str, Any]


@app.on_event("startup")
async def startup_event():
    """Initialize the trading graph on startup"""
    global trading_graph
    config = DEFAULT_CONFIG.copy()
    config["deep_think_llm"] = "gpt-4o-mini"
    config["quick_think_llm"] = "gpt-4o-mini"
    config["max_debate_rounds"] = 1
    config["data_vendors"] = {
        "core_stock_apis": "yfinance",
        "technical_indicators": "yfinance",
        "fundamental_data": "alpha_vantage",
        "news_data": "alpha_vantage",
    }
    trading_graph = TradingAgentsGraph(debug=False, config=config)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "TradingAgents API is running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/config", response_model=ConfigResponse)
async def get_config():
    """Get current trading graph configuration"""
    if not trading_graph:
        raise HTTPException(status_code=500, detail="Trading graph not initialized")
    
    return {"config": trading_graph.config}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_stock(request: AnalysisRequest):
    """
    Analyze a stock symbol and get trading decision
    
    Args:
        symbol: Stock ticker symbol (e.g., 'AAPL', 'NVDA')
        date: Analysis date in YYYY-MM-DD format (defaults to today)
        deep_think_llm: LLM model for deep analysis (default: gpt-4o-mini)
        quick_think_llm: LLM model for quick analysis (default: gpt-4o-mini)
        max_debate_rounds: Number of debate rounds (default: 1)
    
    Returns:
        Analysis results with trading decision
    """
    try:
        # Update config if custom parameters provided
        if request.deep_think_llm or request.quick_think_llm or request.max_debate_rounds:
            config = DEFAULT_CONFIG.copy()
            config["deep_think_llm"] = request.deep_think_llm or "gpt-4o-mini"
            config["quick_think_llm"] = request.quick_think_llm or "gpt-4o-mini"
            config["max_debate_rounds"] = request.max_debate_rounds or 1
            config["data_vendors"] = {
                "core_stock_apis": "yfinance",
                "technical_indicators": "yfinance",
                "fundamental_data": "alpha_vantage",
                "news_data": "alpha_vantage",
            }
            graph = TradingAgentsGraph(debug=False, config=config)
        else:
            graph = trading_graph
        
        if not graph:
            raise HTTPException(status_code=500, detail="Trading graph not initialized")
        
        # Use provided date or today
        analysis_date = request.date or datetime.now().strftime("%Y-%m-%d")
        
        # Run analysis
        _, decision = graph.propagate(request.symbol, analysis_date)
        
        return AnalysisResponse(
            success=True,
            symbol=request.symbol,
            date=analysis_date,
            decision=decision,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/reflect")
async def reflect_on_trade(request: ReflectionRequest):
    """
    Reflect on a completed trade and update memory
    
    Args:
        position_returns: The returns from the position (positive or negative)
    
    Returns:
        Reflection results
    """
    try:
        if not trading_graph:
            raise HTTPException(status_code=500, detail="Trading graph not initialized")
        
        trading_graph.reflect_and_remember(request.position_returns)
        
        return {
            "success": True,
            "message": "Reflection completed and memory updated",
            "position_returns": request.position_returns,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reflection failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
