"""
Unified API Gateway for Stock Prediction Agents
Routes requests to News Researcher (PrimoAgent) and Debate Analyst (TradingAgents)
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import httpx
import os
from pathlib import Path

# FastAPI app
app = FastAPI(
    title="Stock Prediction Agent API",
    description="Unified API for AI-powered stock analysis and trading decisions",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
NEWS_RESEARCHER_URL = os.getenv("NEWS_RESEARCHER_URL", "http://localhost:8002")
DEBATE_ANALYST_URL = os.getenv("DEBATE_ANALYST_URL", "http://localhost:8001")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "300"))  # 5 minutes default

# HTTP client with timeout
http_client = httpx.AsyncClient(timeout=REQUEST_TIMEOUT)


# ============================================================================
# Request/Response Models
# ============================================================================

class NewsResearcherAnalysisRequest(BaseModel):
    symbols: List[str] = Field(..., min_items=1, max_items=10)
    date: Optional[str] = None


class DebateAnalystAnalysisRequest(BaseModel):
    symbol: str
    date: Optional[str] = None
    deep_think_llm: Optional[str] = "gpt-4o-mini"
    quick_think_llm: Optional[str] = "gpt-4o-mini"
    max_debate_rounds: Optional[int] = Field(default=1, ge=1, le=5)


class BatchAnalysisRequest(BaseModel):
    symbols: List[str]
    start_date: str
    end_date: str


class BacktestRequest(BaseModel):
    symbol: str
    data_dir: Optional[str] = "./output/csv"
    printlog: Optional[bool] = False


class ReflectionRequest(BaseModel):
    position_returns: float


# ============================================================================
# Health & Info Endpoints
# ============================================================================

@app.get("/")
async def root():
    """API root with service information"""
    return {
        "message": "Stock Prediction Agent API",
        "version": "1.0.0",
        "status": "healthy",
        "services": {
            "news_researcher": NEWS_RESEARCHER_URL,
            "debate_analyst": DEBATE_ANALYST_URL
        },
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi_spec": "/openapi.yaml"
        }
    }


@app.get("/health")
async def health():
    """Health check with service status"""
    services_status = {}

    # Check News Researcher
    try:
        response = await http_client.get(f"{NEWS_RESEARCHER_URL}/health", timeout=5.0)
        services_status["news_researcher"] = "online" if response.status_code == 200 else "error"
    except Exception:
        services_status["news_researcher"] = "offline"

    # Check Debate Analyst
    try:
        response = await http_client.get(f"{DEBATE_ANALYST_URL}/health", timeout=5.0)
        services_status["debate_analyst"] = "online" if response.status_code == 200 else "error"
    except Exception:
        services_status["debate_analyst"] = "offline"

    all_healthy = all(status == "online" for status in services_status.values())

    return {
        "status": "healthy" if all_healthy else "degraded",
        "timestamp": datetime.now().isoformat(),
        "services": services_status
    }


@app.get("/openapi.yaml")
async def get_openapi_yaml():
    """Serve OpenAPI specification in YAML format"""
    yaml_path = Path(__file__).parent / "openapi.yaml"
    if yaml_path.exists():
        return FileResponse(yaml_path, media_type="application/x-yaml")
    raise HTTPException(status_code=404, detail="OpenAPI spec not found")


# ============================================================================
# News Researcher (PrimoAgent) Endpoints
# ============================================================================

@app.post("/news-researcher/analyze")
async def news_researcher_analyze(request: NewsResearcherAnalysisRequest):
    """
    Analyze stocks using News Researcher (PrimoAgent)

    Multi-agent workflow that analyzes:
    - Market data and fundamentals
    - Technical indicators and patterns
    - News sentiment and significance
    - Portfolio management recommendations
    """
    try:
        response = await http_client.post(
            f"{NEWS_RESEARCHER_URL}/analyze",
            json=request.dict(),
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=getattr(e.response, 'status_code', 500),
            detail=f"News Researcher service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/news-researcher/analyze/batch")
async def news_researcher_batch_analyze(request: BatchAnalysisRequest):
    """Batch analyze stocks across multiple dates using News Researcher"""
    try:
        response = await http_client.post(
            f"{NEWS_RESEARCHER_URL}/analyze/batch",
            json=request.dict(),
            timeout=REQUEST_TIMEOUT * 2  # Double timeout for batch
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=getattr(e.response, 'status_code', 500),
            detail=f"News Researcher service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")


# ============================================================================
# Debate Analyst (TradingAgents) Endpoints
# ============================================================================

@app.post("/debate-analyst/analyze")
async def debate_analyst_analyze(request: DebateAnalystAnalysisRequest):
    """
    Analyze stock using Debate Analyst (TradingAgents)

    Multi-agent debate system that includes:
    - Multiple analyst agents (market, news, social, fundamentals)
    - Bull vs Bear researcher debate
    - Risk management debate
    - Final trading decision with confidence
    """
    try:
        response = await http_client.post(
            f"{DEBATE_ANALYST_URL}/analyze",
            json=request.dict(),
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=getattr(e.response, 'status_code', 500),
            detail=f"Debate Analyst service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/debate-analyst/reflect")
async def debate_analyst_reflect(request: ReflectionRequest):
    """
    Reflect on trade performance and update agent memory

    Helps agents learn from past trading decisions
    """
    try:
        response = await http_client.post(
            f"{DEBATE_ANALYST_URL}/reflect",
            json=request.dict(),
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=getattr(e.response, 'status_code', 500),
            detail=f"Debate Analyst service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reflection failed: {str(e)}")


@app.get("/debate-analyst/config")
async def debate_analyst_config():
    """Get Debate Analyst configuration"""
    try:
        response = await http_client.get(
            f"{DEBATE_ANALYST_URL}/config",
            timeout=5.0
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=getattr(e.response, 'status_code', 500),
            detail=f"Debate Analyst service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Config retrieval failed: {str(e)}")


# ============================================================================
# Backtesting Endpoints
# ============================================================================

@app.post("/backtest")
async def run_backtest(request: BacktestRequest):
    """
    Run backtest using historical data

    Compares PrimoAgent strategy against Buy & Hold baseline
    """
    try:
        response = await http_client.post(
            f"{NEWS_RESEARCHER_URL}/backtest",
            json=request.dict(),
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=getattr(e.response, 'status_code', 500),
            detail=f"Backtest service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")


@app.get("/backtest/available-stocks")
async def get_available_stocks(data_dir: str = "./output/csv"):
    """Get list of stocks available for backtesting"""
    try:
        response = await http_client.get(
            f"{NEWS_RESEARCHER_URL}/backtest/available-stocks",
            params={"data_dir": data_dir},
            timeout=5.0
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=getattr(e.response, 'status_code', 500),
            detail=f"Backtest service error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list stocks: {str(e)}")


# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """General exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Internal server error: {str(exc)}",
            "status_code": 500,
            "timestamp": datetime.now().isoformat()
        }
    )


# ============================================================================
# Lifecycle Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("Starting Unified API Gateway...")
    print(f"News Researcher URL: {NEWS_RESEARCHER_URL}")
    print(f"Debate Analyst URL: {DEBATE_ANALYST_URL}")
    print(f"Request timeout: {REQUEST_TIMEOUT}s")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown"""
    await http_client.aclose()
    print("Unified API Gateway shut down")


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"""
╔══════════════════════════════════════════════════════════════╗
║        Stock Prediction Agent - Unified API Gateway         ║
╠══════════════════════════════════════════════════════════════╣
║  Listening on: http://{host}:{port:<44} ║
║  Documentation: http://localhost:{port}/docs{' ' * (26 - len(str(port)))} ║
║  OpenAPI Spec: http://localhost:{port}/openapi.yaml{' ' * (21 - len(str(port)))} ║
╚══════════════════════════════════════════════════════════════╝
    """)

    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info"
    )
