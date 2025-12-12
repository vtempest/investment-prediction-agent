from typing import Dict, Any, List, Optional
import pandas as pd
from ta import add_all_ta_features
from ta.trend import SMAIndicator, EMAIndicator, ADXIndicator, MACD, CCIIndicator
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands
from .utils import ToolResult

# Supported indicators
SUPPORTED_INDICATORS = ['SMA', 'EMA', 'RSI', 'MACD', 'BBANDS', 'ADX', 'CCI']

async def calculate_technical_indicators(
    price_data: pd.DataFrame,
    indicators: Optional[List[str]] = None,
    symbol: Optional[str] = None,
    analysis_date: Optional[str] = None
) -> ToolResult:
    """
    Calculate technical indicators for price data using ta library.
    
    Args:
        price_data: DataFrame with OHLCV data (already filtered to analysis_date)
        indicators: List of indicators to calculate (default: all supported)
        symbol: Symbol name for metadata
        analysis_date: Analysis date for metadata
        
    Returns:
        ToolResult with calculated indicators
    """
    try:
        if price_data.empty:
            return ToolResult(
                success=False,
                error="Empty price data provided"
            )
        
        # Check required columns
        required_columns = ['Open', 'High', 'Low', 'Close', 'Volume']
        missing_columns = [col for col in required_columns if col not in price_data.columns]
        if missing_columns:
            return ToolResult(
                success=False,
                error=f"Missing required columns: {missing_columns}"
            )
        
        # Use all supported indicators if none specified
        if indicators is None:
            indicators = SUPPORTED_INDICATORS.copy()
        
        # Calculate indicators using ta library
        results = {}
        for indicator in indicators:
            if indicator not in SUPPORTED_INDICATORS:
                results[indicator] = f"Unsupported indicator: {indicator}"
                continue
                
            try:
                # Calculate using ta library with explicit type casting
                close_series = pd.Series(price_data['Close'])
                high_series = pd.Series(price_data['High'])
                low_series = pd.Series(price_data['Low'])
                
                if indicator == 'SMA':
                    sma_indicator = SMAIndicator(close=close_series, window=20)
                    result = sma_indicator.sma_indicator()
                    
                elif indicator == 'EMA':
                    ema_indicator = EMAIndicator(close=close_series, window=20)
                    result = ema_indicator.ema_indicator()
                    
                elif indicator == 'RSI':
                    rsi_indicator = RSIIndicator(close=close_series, window=14)
                    result = rsi_indicator.rsi()
                    
                elif indicator == 'MACD':
                    macd_indicator = MACD(close=close_series)
                    macd_line = macd_indicator.macd()
                    macd_signal = macd_indicator.macd_signal()
                    macd_histogram = macd_indicator.macd_diff()
                    
                    # Get the last values for the analysis date
                    last_macd = macd_line.iloc[-1] if len(macd_line) > 0 else None
                    last_signal = macd_signal.iloc[-1] if len(macd_signal) > 0 else None
                    last_histogram = macd_histogram.iloc[-1] if len(macd_histogram) > 0 else None
                    
                    result = {
                        'macd': [round(last_macd, 4)] if last_macd is not None else [],
                        'signal': [round(last_signal, 4)] if last_signal is not None else [],
                        'histogram': [round(last_histogram, 4)] if last_histogram is not None else []
                    }
                    
                elif indicator == 'BBANDS':
                    bb_indicator = BollingerBands(close=close_series, window=20, window_dev=2)
                    bb_upper = bb_indicator.bollinger_hband()
                    bb_middle = bb_indicator.bollinger_mavg()
                    bb_lower = bb_indicator.bollinger_lband()
                    
                    # Get the last values for the analysis date
                    last_upper = bb_upper.iloc[-1] if len(bb_upper) > 0 else None
                    last_middle = bb_middle.iloc[-1] if len(bb_middle) > 0 else None
                    last_lower = bb_lower.iloc[-1] if len(bb_lower) > 0 else None
                    
                    result = {
                        'upper': [round(last_upper, 4)] if last_upper is not None else [],
                        'middle': [round(last_middle, 4)] if last_middle is not None else [],
                        'lower': [round(last_lower, 4)] if last_lower is not None else []
                    }
                    
                elif indicator == 'ADX':
                    adx_indicator = ADXIndicator(high=high_series, low=low_series, close=close_series, window=14)
                    result = adx_indicator.adx()
                    
                elif indicator == 'CCI':
                    cci_indicator = CCIIndicator(high=high_series, low=low_series, close=close_series, window=20)
                    result = cci_indicator.cci()
                
                # Format result (get last value for series)
                if hasattr(result, 'iloc') and not isinstance(result, dict):
                    # Get the last value for the analysis date
                    last_value = result.iloc[-1] if len(result) > 0 else None
                    results[indicator] = [round(last_value, 4)] if last_value is not None and pd.notna(last_value) else []
                else:
                    results[indicator] = result
                    
            except Exception as e:
                results[indicator] = f"Error calculating {indicator}: {str(e)}"
        
        return ToolResult(
            success=True,
            data={
                'symbol': symbol or 'unknown',
                'technical_indicators': results,
                'data_points': len(price_data),
                'analysis_date': analysis_date,
                'supported_indicators': SUPPORTED_INDICATORS
            }
        )
        
    except Exception as e:
        return ToolResult(
            success=False,
            error=f"Error calculating technical indicators: {str(e)}"
        ) 