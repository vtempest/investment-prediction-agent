import os
import glob
import asyncio
import finnhub
import pandas as pd
from datetime import datetime, timedelta, time as dt_time
from typing import Dict, Any, Optional, Tuple, List
from .utils import ToolResult
from ..config.config import config

def _get_finnhub_client():
    """Get Finnhub client with API key from config."""
    finnhub_key = config.get_api_key('finnhub')
    
    if not finnhub_key:
        return None
    
    return finnhub.Client(api_key=finnhub_key)

async def _apply_rate_limiting():
    """Apply rate limiting for Finnhub API calls."""
    # Use existing news rate limiting config (60 seconds / max_per_minute)
    rate_limit = 60.0 / config.news_max_per_minute if config.news_max_per_minute > 0 else 0.2
    if rate_limit > 0:
        await asyncio.sleep(rate_limit)

def is_trading_day(date_obj: datetime) -> bool:
    """
    Check if a given date is a trading day (Monday-Friday, excluding major holidays).
    Uses Finnhub API to check for US market holidays.
    
    Args:
        date_obj: DateTime object to check
        
    Returns:
        bool: True if trading day, False if weekend or holiday
    """
    # Check if it's weekend
    if date_obj.weekday() >= 5:  # Saturday=5, Sunday=6
        return False
    
    # Check market holidays using Finnhub API
    client = _get_finnhub_client()
    if client:
        try:
            holidays = client.market_holiday(exchange='US')
            date_str = date_obj.strftime('%Y-%m-%d')
            
            # Check if date is in holiday list
            if hasattr(holidays, 'get') and holidays.get('data'):
                for holiday in holidays['data']:
                    if holiday.get('date') == date_str:
                        print(f"  {date_str} is market holiday: {holiday.get('holidayName', 'Unknown')}")
                        return False
            elif isinstance(holidays, list):
                # Handle if holidays is directly a list
                for holiday in holidays:
                    if holiday.get('date') == date_str:
                        print(f"  {date_str} is market holiday: {holiday.get('holidayName', 'Unknown')}")
                        return False
                        
        except Exception as e:
            print(f"  Warning: Could not check market holidays: {e}")
            pass  # Fallback to basic weekend check
    
    return True

def get_market_status() -> dict:
    """
    Check current US market status using Finnhub API.
    
    Returns:
        dict: Market status information including isOpen, session, timezone
    """
    client = _get_finnhub_client()
    if client:
        try:
            status = client.market_status(exchange='US')
            return {
                'is_open': status.get('isOpen', False),
                'session': status.get('session', 'unknown'),
                'timezone': status.get('timezone', 'America/New_York'),
                'status': 'success'
            }
        except Exception as e:
            return {
                'is_open': False,
                'session': 'unknown',
                'timezone': 'America/New_York',
                'status': 'error',
                'error': str(e)
            }
    
    return {
        'is_open': False,
        'session': 'unknown', 
        'timezone': 'America/New_York',
        'status': 'no_client'
    }

def get_last_processed_date_from_csv(symbol: str) -> Optional[datetime]:
    """
    Find the last processed date for a symbol from CSV files in output/csv/.
    
    Args:
        symbol: Stock symbol to check
        
    Returns:
        datetime: Last processed date or None if no CSV found
    """
    try:
        csv_pattern = f"output/csv/*{symbol}*.csv"
        csv_files = glob.glob(csv_pattern)
        
        if not csv_files:
            return None
        
        # Get the most recent CSV file
        latest_csv = max(csv_files, key=os.path.getctime)
        
        # Read CSV and get last date
        df = pd.read_csv(latest_csv)
        if 'Date' in df.columns and len(df) > 0:
            last_date_str = df['Date'].iloc[-1]
            return datetime.strptime(last_date_str, '%Y-%m-%d')
                    
    except Exception as e:
        print(f"Error reading CSV for {symbol}: {e}")
    
    return None

def find_next_trading_day(start_date: datetime) -> datetime:
    """
    Find the next trading day after the given date.
    
    Args:
        start_date: Starting date
        
    Returns:
        datetime: Next trading day after start_date
    """
    # Start checking from the next day
    check_date = start_date + timedelta(days=1)
    
    # Look ahead up to 7 days to find next trading day
    for i in range(7):
        if is_trading_day(check_date):
            return check_date
        check_date += timedelta(days=1)
    
    # If no trading day found in 7 days, default to 3 days ahead
    return start_date + timedelta(days=3)


def calculate_news_datetime_range(last_processed_date: Optional[datetime], 
                                target_date: datetime) -> Tuple[datetime, datetime]:
    """
    Calculate the precise datetime range for news fetching using intelligent trading day detection.
    Uses Finnhub API to detect weekends and holidays, automatically expands for non-trading days.
    
    Args:
        last_processed_date: Last processed date (can be None, only used for logging)
        target_date: Date we want to analyze
        
    Returns:
        Tuple[datetime, datetime]: (from_datetime, to_datetime) for API call
    """
    # Trading hours from config
    market_open_str = config.market_open_time
    hour, minute = map(int, market_open_str.split(':'))
    market_open = dt_time(hour, minute)
    
    # Check if target_date is a trading day
    is_target_trading_day = is_trading_day(target_date)
    
    # Find the last trading day before target_date
    last_trading_day = None
    for i in range(7):
        check_date = target_date - timedelta(days=i+1)
        if is_trading_day(check_date):
            last_trading_day = check_date
            break
    
    # If we couldn't find a trading day in the last 7 days, default to 3 days back
    if last_trading_day is None:
        last_trading_day = target_date - timedelta(days=3)
    
    # Calculate days gap between last trading day and target date
    days_gap = (target_date.date() - last_trading_day.date()).days
    
    # Find the next trading day after target_date for proper weekend/holiday handling
    next_trading_day = find_next_trading_day(target_date)
    
    # Simple logic: if target_date is a trading day, use it; otherwise use last trading day
    if is_target_trading_day:
        # Target date is a trading day - use standard single day range
        from_datetime = datetime.combine(target_date.date(), market_open)
        to_datetime = datetime.combine(next_trading_day.date(), market_open)
    else:
        # Target date is not a trading day (weekend/holiday) - use extended range
        from_datetime = datetime.combine(last_trading_day.date(), market_open)
        to_datetime = datetime.combine(next_trading_day.date(), market_open)
    
    return from_datetime, to_datetime


def filter_news_by_trading_session(news_items: list, 
                                 from_datetime: datetime, 
                                 to_datetime: datetime) -> list:
    """
    Filter news items to include only those within the trading session timeframe
    and from valid news sources.
    
    Args:
        news_items: List of news items from Finnhub API
        from_datetime: Start of trading session
        to_datetime: End of trading session
        
    Returns:
        list: Filtered news items within trading session from valid sources
    """
    filtered_news = []
    
    for news in news_items:
        try:
            # Convert timestamp to datetime
            if not news.get('datetime') or news['datetime'] <= 0:
                continue
                
            news_datetime = datetime.fromtimestamp(news['datetime'])
            news_source = news.get('source', '')
            
            # Check if news is within our timeframe and from valid source
            if (from_datetime <= news_datetime < to_datetime and 
                news_source in config.news_valid_sources):
                
                filtered_news.append({
                    'date': news_datetime.strftime('%Y%m%d%H%M%S'),
                    'headline': news.get('headline', ''),
                    'summary': news.get('summary', ''),
                    'url': news.get('url', '')
                })
                
        except (ValueError, TypeError, OSError) as e:
            print(f"Error processing news timestamp: {e}")
            continue
    
    # Sort by date
    filtered_news.sort(key=lambda x: x['date'])
    return filtered_news

async def get_company_news(symbol: str, 
    analysis_date: Optional[str] = None,
    from_date: Optional[str] = None,
                         to_date: Optional[str] = None) -> ToolResult:
    """
    Get company news using trading session logic for proper timing.
    
    Args:
        symbol: Stock symbol (e.g., 'AAPL')
        analysis_date: Date to analyze (YYYY-MM-DD) - uses trading session logic
        from_date: Start date (YYYY-MM-DD) - manual override
        to_date: End date (YYYY-MM-DD) - manual override
        
    Returns:
        ToolResult with news data including trading session filtering
    """
    client = _get_finnhub_client()
    if not client:
        return ToolResult(success=False, error="Finnhub API key not configured")
    
    try:
        await _apply_rate_limiting()
        
        if analysis_date:
            # Use trading session logic
            target_date = datetime.strptime(analysis_date, '%Y-%m-%d')
            
            from_datetime, to_datetime = calculate_news_datetime_range(None, target_date)
            
            # Convert to string format for API
            api_from_date = from_datetime.strftime('%Y-%m-%d')
            api_to_date = to_datetime.strftime('%Y-%m-%d')
            

            
        else:
            # Use manual date range
            api_from_date = from_date or (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
            api_to_date = to_date or datetime.now().strftime('%Y-%m-%d')
            from_datetime = datetime.strptime(api_from_date, '%Y-%m-%d')
            to_datetime = datetime.strptime(api_to_date, '%Y-%m-%d') + timedelta(days=1)
        
        # Make API call
        result = client.company_news(symbol, _from=api_from_date, to=api_to_date)
        news_items = result if isinstance(result, list) else []
        
        if analysis_date:
            # Apply trading session filtering
            filtered_news = filter_news_by_trading_session(news_items, from_datetime, to_datetime)
        else:
            # Convert all news items to standard format with source filtering
            filtered_news = []
            for news in news_items:
                try:
                    if (news.get('datetime') and news['datetime'] > 0 and 
                        news.get('source', '') in config.news_valid_sources):
                        
                        news_datetime = datetime.fromtimestamp(news['datetime'])
                        filtered_news.append({
                            'date': news_datetime.strftime('%Y%m%d%H%M%S'),
                            'headline': news.get('headline', ''),
                            'summary': news.get('summary', ''),
                            'url': news.get('url', '')
                        })
                except (ValueError, TypeError, OSError):
                    continue
            
            filtered_news.sort(key=lambda x: x['date'])
            
        return ToolResult(
            success=True,
            data={
                'symbol': symbol,
                'news': filtered_news,
                'total_count': len(filtered_news),
                'period': f"{api_from_date} to {api_to_date}",
                'trading_session': analysis_date is not None
            }
        )
        
    except Exception as e:
        return ToolResult(success=False, error=f"Failed to fetch company news: {str(e)}")

async def get_company_profile(symbol: str) -> ToolResult:
    """Get company profile information."""
    client = _get_finnhub_client()
    if not client:
        return ToolResult(success=False, error="Finnhub API key not configured")
    
    try:
        await _apply_rate_limiting()
        result = client.company_profile2(symbol=symbol)
        
        if not result:
            return ToolResult(success=False, error=f"No profile data found for {symbol}")
        
        return ToolResult(
            success=True,
            data={
                'symbol': result.get('ticker', symbol),
                'name': result.get('name', ''),
                'country': result.get('country', ''),
                'currency': result.get('currency', ''),
                'exchange': result.get('exchange', ''),
                'industry': result.get('finnhubIndustry', ''),
                'ipo': result.get('ipo', ''),
                'logo': result.get('logo', ''),
                'market_cap': result.get('marketCapitalization', 0),
                'employees': result.get('shareOutstanding', 0),
                'weburl': result.get('weburl', '')
            }
        )
        
    except Exception as e:
        return ToolResult(success=False, error=f"Failed to fetch company profile: {str(e)}")

async def get_company_basic_financials(symbol: str, metric: str = "all") -> ToolResult:
    """Get company basic financial metrics."""
    client = _get_finnhub_client()
    if not client:
        return ToolResult(success=False, error="Finnhub API key not configured")
    
    try:
        await _apply_rate_limiting()
        result = client.company_basic_financials(symbol, metric)
        
        if not result or 'metric' not in result:
            return ToolResult(success=False, error=f"No financial data found for {symbol}")
        
        return ToolResult(
            success=True,
            data={
                'symbol': symbol,
                'metrics': result['metric'],
                'series': result.get('series', {}),
                'updated': datetime.now().isoformat()
            }
        )
        
    except Exception as e:
        return ToolResult(success=False, error=f"Failed to fetch financial data: {str(e)}")

async def get_market_holidays(year: Optional[int] = None) -> ToolResult:
    """
    Get US market holidays for a specific year using Finnhub API.
    
    Args:
        year: Year to get holidays for (optional, defaults to current year)
        
    Returns:
        ToolResult with market holidays data
    """
    client = _get_finnhub_client()
    if not client:
        return ToolResult(success=False, error="Finnhub API key not configured")
    
    try:
        await _apply_rate_limiting()
        
        # Get market holidays
        holidays_data = client.market_holiday(exchange='US')
        
        # Process holidays data
        holidays = []
        if hasattr(holidays_data, 'get') and holidays_data.get('data'):
            holidays = holidays_data['data']
        elif isinstance(holidays_data, list):
            holidays = holidays_data
        
        # Filter by year if specified
        if year:
            holidays = [h for h in holidays if h.get('date', '').startswith(str(year))]
        
        return ToolResult(
            success=True,
            data={
                'exchange': 'US',
                'holidays': holidays,
                'total_count': len(holidays),
                'year': year or 'all'
            }
        )
        
    except Exception as e:
        return ToolResult(success=False, error=f"Failed to fetch market holidays: {str(e)}")

async def get_current_market_status() -> ToolResult:
    """
    Get current US market status using Finnhub API.
        
    Returns:
        ToolResult with current market status
    """
    client = _get_finnhub_client()
    if not client:
        return ToolResult(success=False, error="Finnhub API key not configured")
    
    try:
        await _apply_rate_limiting()
        
        status_data = client.market_status(exchange='US')
        
        return ToolResult(
            success=True,
            data={
                'exchange': 'US',
                'is_open': status_data.get('isOpen', False),
                'session': status_data.get('session', 'unknown'),
                'timezone': status_data.get('timezone', 'America/New_York'),
                'timestamp': datetime.now().isoformat()
                }
        )
        
    except Exception as e:
        return ToolResult(success=False, error=f"Failed to fetch market status: {str(e)}")
