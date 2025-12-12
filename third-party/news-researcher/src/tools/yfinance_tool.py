from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import yfinance as yf
import pandas as pd
from .utils import ToolResult

async def get_market_data(symbol: str, analysis_date: Optional[str] = None, period: str = "1y") -> ToolResult:
    """
    Get market data for a symbol for a specific date or latest data.
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL')
        analysis_date: Specific date for analysis in YYYY-MM-DD format (optional)
        period: Period for data (default: 1y)
        
    Returns:
        ToolResult with market data
    """
    try:
        symbol = symbol.upper()
        ticker = yf.Ticker(symbol)
        data = ticker.history(period=period)
        
        if data.empty:
            return ToolResult(
                success=False,
                error=f"No data available for {symbol}"
            )
        
        # Filter data up to analysis_date if provided
        if analysis_date:
            analysis_dt = datetime.strptime(analysis_date, "%Y-%m-%d")
            # Convert index to datetime and filter data up to and including the analysis date
            data_with_dates = data.reset_index()
            data_with_dates = data_with_dates[pd.to_datetime(data_with_dates['Date']).dt.date <= analysis_dt.date()]
            
            if data_with_dates.empty:
                return ToolResult(
                    success=False,
                    error=f"No data available for {symbol} on or before {analysis_date}"
                )
            
            # Set the Date back as index
            data_with_dates = data_with_dates.set_index('Date')
            data = data_with_dates
        
        # Get latest data (for analysis_date or most recent if no date specified)
        latest = data.iloc[-1]
        
        # Calculate price change if we have previous data
        previous_close = None
        price_change = None
        price_change_pct = None
        
        if len(data) >= 2:
            previous = data.iloc[-2]
            previous_close = float(previous['Close'])
            current_close = float(latest['Close'])
            price_change = current_close - previous_close
            price_change_pct = (price_change / previous_close) * 100 if previous_close != 0 else 0
        
        # Convert DataFrame to LangChain-compatible format (no Timestamp objects)
        historical_clean = data.reset_index()
        historical_clean['Date'] = historical_clean['Date'].dt.strftime('%Y-%m-%d')
        
        # Convert all numeric columns to regular Python types
        for col in ['Open', 'High', 'Low', 'Close', 'Volume']:
            if col in historical_clean.columns:
                historical_clean[col] = historical_clean[col].astype(float)
        
        historical_dict = historical_clean.to_dict('records')
        
        # Use analysis_date if provided, otherwise use latest data date
        result_date = analysis_date if analysis_date else str(latest.name)[:10]
        
        result_data = {
            'symbol': symbol,
            'date': result_date,
            'current_price': float(latest['Close']),  # Add current price for easy access
            'price_data': {
                'open': float(latest['Open']),
                'high': float(latest['High']),
                'low': float(latest['Low']),
                'close': float(latest['Close']),
                'volume': int(latest['Volume']),
                'previous_close': previous_close,
                'price_change': price_change,
                'price_change_pct': price_change_pct
            },
            'historical_data': historical_dict  # LangChain-friendly version only
        }
        
        return ToolResult(success=True, data=result_data)
        
    except Exception as e:
        return ToolResult(
            success=False,
            error=f"Error getting market data for {symbol}: {str(e)}"
        )

async def get_company_info(symbol: str) -> ToolResult:
    """
    Get company information for a symbol.
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL')
        
    Returns:
        ToolResult with company info
    """
    try:
        symbol = symbol.upper()
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        if not info:
            return ToolResult(
                success=False,
                error=f"No company info available for {symbol}"
            )
        
        company_data = {
            'symbol': symbol,
            'name': info.get('longName', info.get('shortName', 'N/A')),
            'sector': info.get('sector', 'N/A'),
            'industry': info.get('industry', 'N/A'),
            'country': info.get('country', 'N/A'),
            'exchange': info.get('exchange', 'N/A'),
            'market_cap': info.get('marketCap', 'N/A'),
            'website': info.get('website', 'N/A'),
            'description': info.get('longBusinessSummary', 'N/A')[:500]  # Limit description
        }
        
        return ToolResult(success=True, data=company_data)
        
    except Exception as e:
        return ToolResult(
            success=False,
            error=f"Error getting company info for {symbol}: {str(e)}"
        )
