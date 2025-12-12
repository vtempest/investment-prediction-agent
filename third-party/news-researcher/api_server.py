"""
PrimoAgent OpenAPI Server
FastAPI server to expose PrimoAgent functionality via REST API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import sys
from pathlib import Path
import asyncio

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from src.workflows.workflow import run_analysis
from src.tools.daily_csv_tool import save_workflow_to_symbol_csv
from src.backtesting import run_backtest, PrimoAgentStrategy, BuyAndHoldStrategy
from src.backtesting.data import load_stock_data, list_available_stocks

app = FastAPI(
    title="PrimoAgent API",
    description="AI-powered financial analysis and backtesting API",
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


class AnalysisRequest(BaseModel):
    symbols: List[str]
    date: Optional[str] = None


class AnalysisResponse(BaseModel):
    success: bool
    symbols: List[str]
    date: str
    result: Dict[str, Any]
    timestamp: str


class BacktestRequest(BaseModel):
    symbol: str
    data_dir: Optional[str] = "./output/csv"
    printlog: Optional[bool] = False


class BacktestResponse(BaseModel):
    success: bool
    symbol: str
    primo_results: Dict[str, Any]
    buyhold_results: Dict[str, Any]
    comparison: Dict[str, Any]
    timestamp: str


class BatchAnalysisRequest(BaseModel):
    symbols: List[str]
    start_date: str
    end_date: str


def get_trading_dates(start_date: str, end_date: str) -> List[str]:
    """Generate list of trading dates (excluding weekends)."""
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    
    dates = []
    current = start
    while current <= end:
        if current.weekday() < 5:  # Monday to Friday
            dates.append(current.strftime("%Y-%m-%d"))
        current += timedelta(days=1)
    
    return dates


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "PrimoAgent API is running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_stocks(request: AnalysisRequest):
    """
    Analyze stocks for a specific date
    
    Args:
        symbols: List of stock ticker symbols (e.g., ['AAPL', 'GOOGL'])
        date: Analysis date in YYYY-MM-DD format (defaults to today)
    
    Returns:
        Analysis results for the given symbols and date
    """
    try:
        analysis_date = request.date or datetime.now().strftime("%Y-%m-%d")
        date_formatted = analysis_date.replace("-", "_")
        session_id = f"api_analysis_{date_formatted}"
        
        # Run analysis
        result = await run_analysis(request.symbols, session_id, analysis_date)
        
        # Save to CSV if successful
        if result.get('success'):
            save_workflow_to_symbol_csv(result, analysis_date, data_dir="./output/csv")
        
        return AnalysisResponse(
            success=result.get('success', False),
            symbols=request.symbols,
            date=analysis_date,
            result=result,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/analyze/batch")
async def batch_analyze(request: BatchAnalysisRequest):
    """
    Analyze stocks across multiple dates
    
    Args:
        symbols: List of stock ticker symbols
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
    
    Returns:
        Batch analysis results
    """
    try:
        trading_dates = get_trading_dates(request.start_date, request.end_date)
        
        if not trading_dates:
            raise HTTPException(status_code=400, detail="No trading days in the selected date range")
        
        results = []
        successful_runs = 0
        failed_runs = 0
        
        for date in trading_dates:
            date_formatted = date.replace("-", "_")
            session_id = f"batch_analysis_{date_formatted}"
            
            try:
                result = await run_analysis(request.symbols, session_id, date)
                
                if result.get('success'):
                    successful_runs += 1
                    save_workflow_to_symbol_csv(result, date, data_dir="./output/csv")
                else:
                    failed_runs += 1
                
                results.append({
                    "date": date,
                    "success": result.get('success', False),
                    "result": result
                })
                
            except Exception as e:
                failed_runs += 1
                results.append({
                    "date": date,
                    "success": False,
                    "error": str(e)
                })
        
        return {
            "success": True,
            "symbols": request.symbols,
            "date_range": {
                "start": request.start_date,
                "end": request.end_date
            },
            "trading_days": len(trading_dates),
            "successful_runs": successful_runs,
            "failed_runs": failed_runs,
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")


@app.post("/backtest", response_model=BacktestResponse)
async def backtest_stock(request: BacktestRequest):
    """
    Run backtest for a stock symbol
    
    Args:
        symbol: Stock ticker symbol
        data_dir: Directory containing historical data CSV files
        printlog: Enable detailed strategy logs
    
    Returns:
        Backtest results comparing PrimoAgent vs Buy & Hold strategy
    """
    try:
        # Load stock data
        ohlc_data, signals_df = load_stock_data(request.symbol, request.data_dir)
        
        if ohlc_data is None or signals_df is None:
            raise HTTPException(status_code=404, detail=f"No data found for symbol {request.symbol}")
        
        # Run backtests
        primo_results, primo_cerebro = run_backtest(
            ohlc_data, 
            PrimoAgentStrategy, 
            "PrimoAgent", 
            signals_df=signals_df, 
            printlog=request.printlog
        )
        
        buyhold_results, buyhold_cerebro = run_backtest(
            ohlc_data, 
            BuyAndHoldStrategy, 
            "Buy & Hold"
        )
        
        # Calculate comparison
        rel_return = primo_results["Cumulative Return [%]"] - buyhold_results["Cumulative Return [%]"]
        
        comparison = {
            "relative_return": rel_return,
            "outperformed": rel_return > 0,
            "metrics": {
                "cumulative_return_diff": rel_return,
                "volatility_diff": primo_results["Annual Volatility [%]"] - buyhold_results["Annual Volatility [%]"],
                "max_drawdown_diff": primo_results["Max Drawdown [%]"] - buyhold_results["Max Drawdown [%]"],
                "sharpe_diff": primo_results["Sharpe Ratio"] - buyhold_results["Sharpe Ratio"]
            }
        }
        
        return BacktestResponse(
            success=True,
            symbol=request.symbol,
            primo_results=primo_results,
            buyhold_results=buyhold_results,
            comparison=comparison,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")


@app.get("/backtest/available-stocks")
async def get_available_stocks(data_dir: str = "./output/csv"):
    """
    Get list of available stocks for backtesting
    
    Args:
        data_dir: Directory containing CSV files
    
    Returns:
        List of available stock symbols
    """
    try:
        stocks = list_available_stocks(data_dir)
        return {
            "success": True,
            "data_dir": data_dir,
            "stocks": stocks,
            "count": len(stocks),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list stocks: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)
