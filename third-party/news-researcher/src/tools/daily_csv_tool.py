import os
import pandas as pd
from datetime import datetime
from typing import Dict, Any, List, Union
from pathlib import Path
from ..config import config

def format_number_to_2_decimals(value: Union[int, float, str, None]) -> Union[str, None]:
    """
    Format numeric values to 2 decimal places.
    
    Args:
        value: The value to format
        
    Returns:
        Formatted string with 2 decimals, or original value if not numeric
    """
    if value is None:
        return None
    
    # Keep string values like 'N/A' unchanged
    if isinstance(value, str):
        return value
    
    # Format numeric values to 2 decimal places
    if isinstance(value, (int, float)):
        return f"{value:.2f}"
    
    return value

def save_workflow_to_csv(workflow_result: Dict[str, Any], date: str) -> bool:
    """
    Save workflow results to a single CSV file with each row representing a different date.
    
    Args:
        workflow_result: Complete workflow result containing all analysis data
        date: Date string for the analysis
        
    Returns:
        bool: True if saved successfully, False otherwise
    """
    try:
        if not workflow_result.get('success', False):
            print(f"No data to save to CSV.")
            return False
        
        # Extract results from workflow 
        results = workflow_result.get('results', {})
        symbols = workflow_result.get('symbols', [])
        
        if not symbols:
            print(f"No symbols found in workflow result.")
            return False
            
        symbol = symbols[0]  # We process one symbol at a time
        
        # Get portfolio manager results - Access through symbol key
        portfolio_results = results.get('portfolio_manager', {})
        if not portfolio_results or symbol not in portfolio_results:
            print(f"No portfolio manager results found for {symbol}.")
            return False
            
        symbol_portfolio_result = portfolio_results[symbol]
        
        # Check if portfolio analysis was successful
        if not symbol_portfolio_result.get('success', False):
            print(f"Portfolio analysis failed for {symbol}: {symbol_portfolio_result.get('error', 'Unknown error')}")
            return False
        
        # Get data collection results for current price
        data_results = results.get('data_collection', {})
        market_data = data_results.get('market_data', {}) if data_results else {}
        current_price = market_data.get('current_price', 'N/A')
        
        # Get technical analysis results
        tech_results = results.get('technical_analysis', {})
        tech_indicators = {}
        if tech_results and tech_results.get('success'):
            indicators_data = tech_results.get('indicators', {})
            tech_indicators = indicators_data.get('technical_indicators', {})
        
        # Helper function to get last value from indicator lists
        def get_last_value(data):
            if isinstance(data, list) and data:
                return data[-1]
            elif isinstance(data, (int, float)):
                return data
            return None
        
        # Extract individual technical indicators
        sma = get_last_value(tech_indicators.get('SMA', []))
        rsi = get_last_value(tech_indicators.get('RSI', []))
        adx = get_last_value(tech_indicators.get('ADX', []))
        cci = get_last_value(tech_indicators.get('CCI', []))
        
        # MACD components
        macd_data = tech_indicators.get('MACD', {})
        macd_line = get_last_value(macd_data.get('macd', [])) if isinstance(macd_data, dict) else None
        macd_signal = get_last_value(macd_data.get('signal', [])) if isinstance(macd_data, dict) else None
        macd_histogram = get_last_value(macd_data.get('histogram', [])) if isinstance(macd_data, dict) else None
        
        # Bollinger Bands components  
        bb_data = tech_indicators.get('BBANDS', {})
        bb_upper = get_last_value(bb_data.get('upper', [])) if isinstance(bb_data, dict) else None
        bb_middle = get_last_value(bb_data.get('middle', [])) if isinstance(bb_data, dict) else None
        bb_lower = get_last_value(bb_data.get('lower', [])) if isinstance(bb_data, dict) else None
        
        # Get news intelligence results for NLP features
        news_results = results.get('news_intelligence', {})
        nlp_features = {}
        if news_results and news_results.get('success'):
            nlp_features = news_results.get('nlp_features', {})
        
        # Create comprehensive CSV data with all indicators and NLP features
        # Apply 2-decimal formatting ONLY to technical/financial fields
        csv_data = {
            # Basic data
            'date': date,
            'symbol': symbol,
            'close': format_number_to_2_decimals(current_price),
            'trading_signal': symbol_portfolio_result.get('trading_signal', 'N/A'),
            'confidence_level': symbol_portfolio_result.get('confidence_level', 'N/A'),  # Keep original precision
            'position_size': symbol_portfolio_result.get('position_size', 'N/A'),        # Keep original precision
            
            # Technical indicators - format to 2 decimals
            'sma': format_number_to_2_decimals(sma),
            'rsi': format_number_to_2_decimals(rsi),
            'adx': format_number_to_2_decimals(adx), 
            'cci': format_number_to_2_decimals(cci),
            
            # MACD components - format to 2 decimals
            'macd_line': format_number_to_2_decimals(macd_line),
            'macd_signal': format_number_to_2_decimals(macd_signal),
            'macd_histogram': format_number_to_2_decimals(macd_histogram),
            
            # Bollinger Bands components - format to 2 decimals
            'bb_upper': format_number_to_2_decimals(bb_upper),
            'bb_middle': format_number_to_2_decimals(bb_middle),
            'bb_lower': format_number_to_2_decimals(bb_lower),
            
            # NLP features from news intelligence - keep original precision
            'news_relevance': nlp_features.get('news_relevance'),
            'sentiment': nlp_features.get('sentiment'),
            'price_impact_potential': nlp_features.get('price_impact_potential'),
            'trend_direction': nlp_features.get('trend_direction'),
            'earnings_impact': nlp_features.get('earnings_impact'),
            'investor_confidence': nlp_features.get('investor_confidence'),
            'risk_profile_change': nlp_features.get('risk_profile_change')
        }
        
        # Create CSV file path - SINGLE FILE for all dates
        csv_path = config.csv_output_path
        os.makedirs(csv_path, exist_ok=True)
        csv_file = os.path.join(csv_path, 'daily_analysis.csv')
        
        # Check if file exists and load existing data
        file_exists = os.path.exists(csv_file)
        
        if file_exists:
            # Load existing data and append new row
            try:
                existing_df = pd.read_csv(csv_file)
                new_df = pd.DataFrame([csv_data])
                combined_df = pd.concat([existing_df, new_df], ignore_index=True)
                
                # Remove duplicate entries for same date/symbol, keeping the latest
                combined_df = combined_df.drop_duplicates(subset=['date', 'symbol'], keep='last')
                
                # Sort by date descending (newest first)
                combined_df = combined_df.sort_values(by='date', ascending=False)
                
            except pd.errors.EmptyDataError:
                # File exists but is empty
                combined_df = pd.DataFrame([csv_data])
        else:
            # Create new file
            combined_df = pd.DataFrame([csv_data])
        
        # Save to CSV
        combined_df.to_csv(csv_file, index=False)
        
        print(f"CSV saved successfully: {csv_file}")
        print(f"Total rows in CSV: {len(combined_df)}")
        return True
        
    except Exception as e:
        print(f"Error saving CSV: {e}")
        import traceback
        traceback.print_exc()
        return False


def save_workflow_to_symbol_csv(workflow_result: Dict[str, Any], date: str, data_dir: str = "./output/csv") -> bool:
    """
    Save workflow results to a per-symbol CSV under data_dir with filename
    pattern: daily_analysis_{SYMBOL}.csv.

    The file will include at least: date, symbol, close, trading_signal,
    confidence_level, position_size, and selected indicators and NLP features.

    Args:
        workflow_result: Workflow result dict
        date: Analysis date (YYYY-MM-DD)
        data_dir: Target directory for symbol CSV files (default ./data)

    Returns:
        bool: True if saved successfully
    """
    try:
        if not workflow_result.get('success', False):
            return False

        results = workflow_result.get('results', {})
        symbols = workflow_result.get('symbols', [])
        if not symbols:
            return False
        symbol = symbols[0].upper()

        portfolio_results = results.get('portfolio_manager', {})
        if not portfolio_results or symbol not in portfolio_results:
            return False
        symbol_portfolio_result = portfolio_results[symbol]
        if not symbol_portfolio_result.get('success', False):
            return False

        data_results = results.get('data_collection', {})
        market_data = data_results.get('market_data', {}) if data_results else {}
        current_price = market_data.get('current_price', 'N/A')

        tech_results = results.get('technical_analysis', {})
        tech_indicators = {}
        if tech_results and tech_results.get('success'):
            indicators_data = tech_results.get('indicators', {})
            tech_indicators = indicators_data.get('technical_indicators', {})

        def get_last_value(data):
            if isinstance(data, list) and data:
                return data[-1]
            elif isinstance(data, (int, float)):
                return data
            return None

        sma = get_last_value(tech_indicators.get('SMA', []))
        rsi = get_last_value(tech_indicators.get('RSI', []))
        adx = get_last_value(tech_indicators.get('ADX', []))
        cci = get_last_value(tech_indicators.get('CCI', []))

        macd_data = tech_indicators.get('MACD', {})
        macd_line = get_last_value(macd_data.get('macd', [])) if isinstance(macd_data, dict) else None
        macd_signal = get_last_value(macd_data.get('signal', [])) if isinstance(macd_data, dict) else None
        macd_histogram = get_last_value(macd_data.get('histogram', [])) if isinstance(macd_data, dict) else None

        bb_data = tech_indicators.get('BBANDS', {})
        bb_upper = get_last_value(bb_data.get('upper', [])) if isinstance(bb_data, dict) else None
        bb_middle = get_last_value(bb_data.get('middle', [])) if isinstance(bb_data, dict) else None
        bb_lower = get_last_value(bb_data.get('lower', [])) if isinstance(bb_data, dict) else None

        news_results = results.get('news_intelligence', {})
        nlp_features = news_results.get('nlp_features', {}) if news_results and news_results.get('success') else {}

        csv_row = {
            'date': date,
            'symbol': symbol,
            'close': format_number_to_2_decimals(current_price),
            'trading_signal': symbol_portfolio_result.get('trading_signal', 'N/A'),
            'confidence_level': symbol_portfolio_result.get('confidence_level', 'N/A'),
            'position_size': symbol_portfolio_result.get('position_size', 'N/A'),
            'sma': format_number_to_2_decimals(sma),
            'rsi': format_number_to_2_decimals(rsi),
            'adx': format_number_to_2_decimals(adx),
            'cci': format_number_to_2_decimals(cci),
            'macd_line': format_number_to_2_decimals(macd_line),
            'macd_signal': format_number_to_2_decimals(macd_signal),
            'macd_histogram': format_number_to_2_decimals(macd_histogram),
            'bb_upper': format_number_to_2_decimals(bb_upper),
            'bb_middle': format_number_to_2_decimals(bb_middle),
            'bb_lower': format_number_to_2_decimals(bb_lower),
            'news_relevance': nlp_features.get('news_relevance'),
            'sentiment': nlp_features.get('sentiment'),
            'price_impact_potential': nlp_features.get('price_impact_potential'),
            'trend_direction': nlp_features.get('trend_direction'),
            'earnings_impact': nlp_features.get('earnings_impact'),
            'investor_confidence': nlp_features.get('investor_confidence'),
            'risk_profile_change': nlp_features.get('risk_profile_change'),
        }

        # Ensure directory and file path
        Path(data_dir).mkdir(parents=True, exist_ok=True)
        symbol_csv = Path(data_dir) / f"daily_analysis_{symbol}.csv"

        # Append/update row
        if symbol_csv.exists():
            try:
                existing_df = pd.read_csv(symbol_csv)
                new_df = pd.DataFrame([csv_row])
                combined = pd.concat([existing_df, new_df], ignore_index=True)
                combined = combined.drop_duplicates(subset=['date'], keep='last')
                combined = combined.sort_values(by='date', ascending=True)
            except pd.errors.EmptyDataError:
                combined = pd.DataFrame([csv_row])
        else:
            combined = pd.DataFrame([csv_row])

        combined.to_csv(symbol_csv, index=False)
        print(f"Symbol CSV saved: {symbol_csv}")
        return True
    except Exception as e:
        print(f"Error saving symbol CSV: {e}")
        return False
