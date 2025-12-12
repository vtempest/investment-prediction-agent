import os
from typing import Dict, Any, Optional, List
from ..workflows.state import AgentState
from ..config.model_factory import ModelFactory
from ..config import config
import pandas as pd

# Import all required prompt functions from prompts.py
from ..prompts.portfolio_manager import (
    get_portfolio_manager_template,
    get_structured_output_parser,
    format_basic_financials,
    format_technical_indicators,
    format_historical_context
)
from ..prompts.shared import extract_company_info

async def analyze_portfolio(
    symbol: str, 
    technical_data: Optional[Dict[str, Any]] = None,
    news_data: Optional[Dict[str, Any]] = None,
    analysis_date: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate trading decision for a symbol based on technical and news data.
    
    Args:
        symbol: Stock symbol
        technical_data: Technical analysis from previous agent
        news_data: News intelligence from previous agent
        
    Returns:
        Dict with trading decision or error info
    """
    try:
        symbol = symbol.upper()
        
        # Validate and extract the actual data for the symbol
        if not technical_data or not technical_data.get('success'):
            return {
                'symbol': symbol,
                'success': False,
                'error': 'No valid technical analysis data provided'
            }
        
        if not news_data or not news_data.get('success'):
            return {
                'symbol': symbol,
                'success': False,
                'error': 'No valid news intelligence data provided'
            }
            
        # Correctly pass only the relevant data
        trading_decision = await generate_trading_signal_with_prompts(
            symbol, 
            technical_data,
            news_data,
            analysis_date
        )
        
        if trading_decision is None:
            return {
                'symbol': symbol,
                'success': False,
                'error': 'Trading signal generation failed'
            }

        return {
            'symbol': symbol,
            'trading_signal': trading_decision.get('trading_signal'),
            'confidence_level': trading_decision.get('confidence_level'),
            'position_size': trading_decision.get('position_size'),
            'success': True
        }
                
    except Exception as e:
        print(f"Error in portfolio analysis for {symbol}: {e}")
        return {
            'symbol': symbol,
            'success': False,
            'error': str(e)
        }


async def generate_trading_signal_with_prompts(
    symbol: str,
    technical_data: Dict[str, Any], 
    news_data: Dict[str, Any],
    analysis_date: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Generate trading signal using proper Portfolio Manager prompts from prompts.py.
    
    Args:
        symbol: Stock symbol
        technical_data: Technical analysis data
        news_data: News intelligence data
        
    Returns:
        Dict with trading signal data or None if failed
    """
    try:
        # Get OpenAI configuration
        api_key = config.get_api_key('openai')
        
        if not api_key:
            print(f"No OpenAI API key available for {symbol}")
            return None
            
        # Set environment variable for LangChain
        os.environ['OPENAI_API_KEY'] = api_key
        
        # Create LLM instance
        llm = ModelFactory.get_portfolio_manager_model()
        
        # Get current price from technical data
        indicators_data = technical_data.get('indicators', {})
        technical_indicators = indicators_data.get('technical_indicators', {})
        current_price = extract_current_price(indicators_data)
        
        if current_price is None or current_price <= 0:
            print(f"No valid current price available for {symbol}")
            return None
        
        # Get company profile data from data collection results
        data_collection_results = technical_data.get('data_collection_results', {})
        basic_financials = data_collection_results.get('basic_financials', {})
        company_profile = data_collection_results.get('company_profile', {})
        
        # Build profile data with all available information
        profile_data = {
            'name': company_profile.get('name', symbol),
            'industry': company_profile.get('industry', 'Technology'),
            'exchange': company_profile.get('exchange', 'Unknown Exchange'),
            'market_cap': company_profile.get('market_cap', 0)
        }
        
        # Use proper prompts.py functions
        prompt_template = get_portfolio_manager_template()
        output_parser = get_structured_output_parser()
        
        # Format technical indicators using prompts.py function with correct structure
        tech_data_for_formatting = {
            'technical_analysis': {
                'technical_indicators': technical_indicators
            }
        }
        tech_formatted = format_technical_indicators(tech_data_for_formatting, current_price)
        
        # Format basic financials using prompts.py function
        fundamental_analysis = format_basic_financials(basic_financials)
        
        # Extract company info using prompts.py function
        company_info = extract_company_info(profile_data)
        
        # Get NLP features from news data
        nlp_features = news_data.get('nlp_features', {})
        
        # Read historical context from CSV file if exists
        historical_data = read_historical_context(symbol, analysis_date)
        historical_context = format_historical_context(historical_data)
        
        # Prepare prompt input with company context and trading data
        prompt_input = {
            'symbol': symbol,
            'company_name': company_info.get('company_name', symbol),
            'industry': company_info.get('industry', 'Unknown'),
            'exchange': company_info.get('exchange', 'Unknown Exchange'),
            'market_cap': company_info.get('market_cap', 'N/A'),
            'current_price': current_price,
            'analysis_date': analysis_date or 'Current',
            
            # Fundamental analysis - NEW
            'fundamental_analysis': fundamental_analysis,
            
            # Technical indicators - use formatted data from prompts.py
            'price_vs_sma': tech_formatted.get('price_vs_sma', 'N/A'),
            'rsi_interpretation': tech_formatted.get('rsi_interpretation', 'N/A'),
            'macd_interpretation': tech_formatted.get('macd_interpretation', 'N/A'),
            'bb_interpretation': tech_formatted.get('bb_interpretation', 'N/A'),
            'adx_interpretation': tech_formatted.get('adx_interpretation', 'N/A'),
            'cci_interpretation': tech_formatted.get('cci_interpretation', 'N/A'),
            
            # NLP features from news intelligence
            'news_relevance': nlp_features.get('news_relevance', 'N/A'),
            'sentiment': nlp_features.get('sentiment', 'N/A'),
            'price_impact_potential': nlp_features.get('price_impact_potential', 'N/A'),
            'trend_direction': nlp_features.get('trend_direction', 'N/A'),
            'earnings_impact': nlp_features.get('earnings_impact', 'N/A'),
            'investor_confidence': nlp_features.get('investor_confidence', 'N/A'),
            'risk_profile_change': nlp_features.get('risk_profile_change', 'N/A'),
            
            # Historical context
            'historical_context': historical_context,
            
            # Format instructions for structured output
            'format_instructions': output_parser.get_format_instructions()
        }
        
        # Create chain with prompt and parser
        chain = prompt_template | llm | output_parser
        
        # Execute the chain
        result = await chain.ainvoke(prompt_input)
        
        # Validate result structure
        if isinstance(result, dict):
            required_fields = ['trading_signal', 'confidence_level', 'position_size']
            
            for field in required_fields:
                if field not in result:
                    print(f"Missing {field} in portfolio result")
                    return None
            
            # Validate signal value
            if result.get('trading_signal') not in ['BUY', 'SELL', 'HOLD']:
                print(f"Invalid trading signal: {result.get('trading_signal')}")
                return None
            
            # Validate numeric values with new discrete formats
            try:
                confidence = float(result.get('confidence_level', 0))
                position = int(result.get('position_size', 0))
                
                # Validate confidence level: must be 0.1, 0.2, 0.3... 1.0
                valid_confidence = [round(i * 0.1, 1) for i in range(1, 11)]  # [0.1, 0.2, ... 1.0]
                if confidence not in valid_confidence:
                    print(f"Invalid confidence level: {confidence} (must be 0.1, 0.2, 0.3... 1.0)")
                    return None
                
                # Validate position size: must be 10, 20, 30... 100
                valid_positions = [i for i in range(10, 101, 10)]  # [10, 20, 30... 100]
                if position not in valid_positions:
                    print(f"Invalid position size: {position} (must be 10, 20, 30... 100)")
                    return None
                
                # Return validated result
                return {
                    'trading_signal': result.get('trading_signal'),
                    'confidence_level': confidence,
                    'position_size': position
                }
                
            except (ValueError, TypeError) as e:
                print(f"Invalid numeric values in result: {e}")
                return None
        else:
            print(f"Invalid result format: {type(result)}")
            return None
        
    except Exception as e:
        print(f"Error generating trading signal for {symbol}: {e}")
        return None


def extract_current_price(technical_indicators: Dict[str, Any]) -> Optional[float]:
    """
    Extract current price from technical indicators.
    
    Args:
        technical_indicators: Technical analysis data
        
    Returns:
        Current price or None if not found
    """
    # Try to get current price from various possible locations
    if isinstance(technical_indicators, dict):
        # Check direct price field
        if 'current_price' in technical_indicators:
            raw_price = technical_indicators['current_price']
            try:
                price_float = float(raw_price)
                return price_float
            except (ValueError, TypeError):
                pass
        
        # Try to get from SMA data (last value)
        sma_data = technical_indicators.get('SMA', [])
        if isinstance(sma_data, list) and sma_data:
            try:
                return float(sma_data[-1])
            except (ValueError, TypeError, IndexError):
                pass
        
        # Try to get from any price-related indicator
        for key in ['close', 'Close', 'price', 'Price']:
            if key in technical_indicators:
                try:
                    return float(technical_indicators[key])
                except (ValueError, TypeError):
                    pass
    
    return None


def read_historical_context(symbol: str, analysis_date: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Read historical trading decisions for a symbol from CSV file.
    
    Args:
        symbol: Stock symbol
        
    Returns:
        List of historical trading data formatted for format_historical_context
    """
    def is_valid_value(value):
        """Helper function to check if value is not None and not NaN"""
        if value is None:
            return False
        try:
            import math
            return not math.isnan(float(value))
        except (ValueError, TypeError):
            return value is not None
    
    try:
        csv_path = "output/csv/daily_analysis.csv"
        if not os.path.exists(csv_path):
            return []
        
        # Read CSV file
        df = pd.read_csv(csv_path)
        
        # Filter for this symbol
        symbol_data = df[df['symbol'] == symbol.upper()]
        
        if symbol_data.empty:
            return []
        
        # Convert to list of dictionaries with last N entries (configurable), and calculate next_day_actual_price
        historical_data = []
        symbol_data_list = symbol_data.head(config.portfolio_historical_context_count).reset_index(drop=True)
        
        for i, (index, row) in enumerate(symbol_data_list.iterrows()):
            # Calculate next day actual price by looking at the previous row (CSV is sorted newest first)
            next_day_actual_price = None
            if i > 0:  # Not the first row (newest date)
                next_row = symbol_data_list.iloc[i - 1]  # Previous index = next chronological day
                next_day_actual_price = next_row.get('close')
            
            # Restructure flat CSV data into hierarchical format expected by format_historical_context
            entry = {
                'analysis_date': row.get('date'),
                'trading_signal': row.get('trading_signal'),
                'confidence_level': row.get('confidence_level'),
                'position_size': row.get('position_size'),
                'current_price': row.get('close'),
                'next_day_actual_price': next_day_actual_price,  # This is the key addition!
                
                # Technical analysis in nested structure
                'technical_analysis': {
                    'technical_indicators': {
                        'SMA': [row.get('sma')] if is_valid_value(row.get('sma')) else [],
                        'RSI': [row.get('rsi')] if is_valid_value(row.get('rsi')) else [],
                        'ADX': [row.get('adx')] if is_valid_value(row.get('adx')) else [],
                        'CCI': [row.get('cci')] if is_valid_value(row.get('cci')) else [],
                        'MACD': {
                            'macd': [row.get('macd_line')] if is_valid_value(row.get('macd_line')) else [],
                            'signal': [row.get('macd_signal')] if is_valid_value(row.get('macd_signal')) else [],
                            'histogram': [row.get('macd_histogram')] if is_valid_value(row.get('macd_histogram')) else []
                        },
                        'BBANDS': {
                            'upper': [row.get('bb_upper')] if is_valid_value(row.get('bb_upper')) else [],
                            'middle': [row.get('bb_middle')] if is_valid_value(row.get('bb_middle')) else [],
                            'lower': [row.get('bb_lower')] if is_valid_value(row.get('bb_lower')) else []
                        }
                    }
                },
                
                # News intelligence in nested structure
                'news_intelligence': {
                    'nlp_features': {
                        'news_relevance': row.get('news_relevance') if is_valid_value(row.get('news_relevance')) else None,
                        'sentiment': row.get('sentiment') if is_valid_value(row.get('sentiment')) else None,
                        'price_impact_potential': row.get('price_impact_potential') if is_valid_value(row.get('price_impact_potential')) else None,
                        'trend_direction': row.get('trend_direction') if is_valid_value(row.get('trend_direction')) else None,
                        'earnings_impact': row.get('earnings_impact') if is_valid_value(row.get('earnings_impact')) else None,
                        'investor_confidence': row.get('investor_confidence') if is_valid_value(row.get('investor_confidence')) else None,
                        'risk_profile_change': row.get('risk_profile_change') if is_valid_value(row.get('risk_profile_change')) else None
                    }
                }
            }
            historical_data.append(entry)
        
        return historical_data
        
    except Exception as e:
        print(f"Warning: Could not read historical data for {symbol}: {e}")
        return []


async def portfolio_manager_agent_node(state: AgentState) -> AgentState:
    """
    Portfolio Manager Agent node for the workflow.
    
    Args:
        state: Current state of the workflow
        
    Returns:
        Updated state with portfolio management results
    """
    try:
        symbols = state.get('symbols', [])
        if not symbols:
            state['error'] = "No symbols found in state for Portfolio Manager"
            return state
            
        # Since we process one symbol at a time in this design
        symbol = symbols[0]
        
        # Get data directly from the state
        tech_results = state.get('technical_analysis_results', {})
        news_results = state.get('news_intelligence_results', {})
        data_collection_results = state.get('data_collection_results', {})
        
        # Add data_collection_results to tech_results for access to basic_financials
        if isinstance(tech_results, dict):
            tech_results_with_data = {
                **tech_results,
                'data_collection_results': data_collection_results
            }
        else:
            tech_results_with_data = {
                'data_collection_results': data_collection_results
            }
        
        # Analyze portfolio for the single symbol
        analysis_date = state.get('analysis_date')
        analysis_result = await analyze_portfolio(
            symbol, tech_results_with_data, news_results, analysis_date
        )
        
        # Structure the result under the symbol key
        all_results = {symbol: analysis_result}
        
        # Update the main state with the results
        state['portfolio_manager_results'] = all_results
        state['current_step'] = 'portfolio_management_complete'
        
        return state
        
    except Exception as e:
        print(f"Error in portfolio_manager_agent_node: {e}")
        state['error'] = f"Portfolio Manager Agent failed: {e}"
        return state 