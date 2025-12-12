from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from typing import Dict, Any, List


def get_portfolio_manager_template() -> ChatPromptTemplate:
    """
    Portfolio Manager with clean input/output structure.
    Provides comprehensive data analysis without prescriptive decision-making rules.
    """
    template = """You are a quantitative portfolio manager responsible for making trading decisions based on comprehensive market analysis.

[TRADING OBJECTIVE]
Your primary goal is to maximize portfolio returns while minimizing losses by predicting whether the stock price will move up or down in the next trading period (tomorrow/next few days).

Use historical context to learn from previous decisions and improve future predictions. Focus on identifying patterns that led to successful vs unsuccessful trades.

[COMPANY INFORMATION]
Symbol: {symbol} | Company: {company_name} | Industry: {industry}
Exchange: {exchange} | Market Cap: {market_cap}
Current Date: {analysis_date} | Current Price: ${current_price}

[MARKET DATA ANALYSIS]

Technical Indicators (Price Momentum & Market Sentiment):

Price vs Moving Average: {price_vs_sma}
- Shows current price relationship to 20-day simple moving average
- Indicates short-term trend direction relative to recent average

RSI (Relative Strength Index): {rsi_interpretation}
- Measures momentum on 0-100 scale
- Higher values indicate stronger upward momentum, lower values indicate stronger downward momentum

MACD (Moving Average Convergence Divergence): {macd_interpretation}
- Measures relationship between two moving averages
- Signal line crossovers and histogram changes indicate momentum shifts

Bollinger Bands: {bb_interpretation}
- Volatility bands around moving average
- Price position relative to bands indicates volatility and potential reversal points

ADX (Average Directional Index): {adx_interpretation}
- Measures trend strength regardless of direction
- Higher values indicate stronger trends

CCI (Commodity Channel Index): {cci_interpretation}
- Measures cyclical trends and momentum
- Values above +100 or below -100 indicate strong momentum conditions

Fundamental Analysis:
{fundamental_analysis}

[NEWS ANALYSIS - MARKET RISK ASSESSMENT]
These features reflect current market conditions and represent real-time risk factors that can significantly impact price movements, regardless of technical setup:

News Relevance: {news_relevance} (scale: -2 to +2)
- Measures how relevant current news is to the stock
- Higher absolute values indicate more significant potential price impact
- Values reflect the degree of direct business or financial relevance

Overall Sentiment: {sentiment} (scale: -2 to +2)
- Current market sentiment direction from news analysis
- Positive values indicate market optimism and bullish expectations
- Negative values signal pessimism and potential downward pressure

Price Impact Potential: {price_impact_potential} (scale: -2 to +2)
- Expected magnitude of price movement based on current news
- Higher absolute values suggest stronger potential price reactions
- Direction indicates whether impact is likely positive or negative

Trend Direction: {trend_direction} (scale: -2 to +2)
- Directional bias from news analysis
- Positive values suggest news-driven upward momentum
- Negative values indicate potential downward pressure from news events

Earnings Impact: {earnings_impact} (scale: -2 to +2)
- Influence of earnings-related news on market perception
- Positive values reflect strong financial performance or positive outlook
- Negative values indicate disappointing results or concerning guidance

Investor Confidence: {investor_confidence} (scale: -2 to +2)
- Current level of investor confidence based on news sentiment
- Positive values indicate strong market psychology and risk appetite
- Negative values suggest deteriorating confidence and risk aversion

Risk Profile Change: {risk_profile_change} (scale: -2 to +2)
- Change in perceived risk profile from recent news events
- Positive values indicate decreased risk perception and improved outlook
- Negative values suggest heightened risk and increased uncertainty

Multiple aligned news factors in the same direction often compound to create significant market momentum that can reinforce or contradict technical indicators.

[HISTORICAL ANALYSIS]
Previous trading decisions and market outcomes:
{historical_context}

[TRADING DECISION FRAMEWORK]

Signal Logic:
- BUY: When you expect price to rise AND technical momentum supports the move
- SELL: When you expect price to fall AND technical momentum confirms weakness AND news sentiment is negative  
- HOLD: When signals conflict or during trend uncertainty - preservation of capital over missed opportunities

Momentum Confirmation (Required for BUY signals):
- Is current price above 5-day moving average?
- Is MACD histogram improving (becoming less negative or more positive)?
- Are multiple news factors aligned, not just one strong factor?

Trend Analysis Guidelines:
- If MACD histogram negative for 3+ consecutive periods: downtrend active
- If MACD histogram positive for 3+ consecutive periods: uptrend active
- When technical indicators show consistent bearish momentum (negative MACD histogram, declining RSI), positive news sentiment should be weighted more conservatively
- Technical indicators should be weighted more heavily during established trends
- Strong positive news during technical downtrends may represent dead cat bounce rather than reversal

HOLD Guidelines:
- Use HOLD when technical and news signals conflict significantly
- Use HOLD when RSI < 35 (oversold) unless news sentiment is extremely positive (>1.5)
- Use HOLD when MACD histogram has been negative for 5+ consecutive periods
- Default to HOLD during uncertain trend transitions

Position Sizing Rules:
- Base percentage: 10-100% in steps of 10%
- Higher conviction and stronger expected moves warrant larger positions
- Reduce position size by 50% when technical and news signals conflict
- Maximum 30% position size when RSI < 30 or RSI > 70 (extreme conditions)
- Maximum 40% position size when MACD histogram opposite to news sentiment

[OUTPUT REQUIREMENTS]
Based on your analysis of all provided data, generate a trading decision with the following format:

Trading Signal: BUY, SELL, or HOLD (using the decision framework above)

Confidence Level: Decimal between 0.1 and 1.0 (in steps of 0.1)
- Represents your confidence in the price direction prediction
- Higher values indicate stronger conviction in your forecast

Position Size: Integer between 10 and 100 (in steps of 10)
- Percentage of capital to allocate based on conviction and potential profit

[OUTPUT]
Return ONLY valid JSON structure with these exact keys:
{format_instructions}"""

    return ChatPromptTemplate.from_template(template)


def get_structured_output_parser():
    """
    Creates a structured output parser for portfolio manager decisions.
    """
    response_schemas = [
        ResponseSchema(
            name="trading_signal",
            description="The recommended trading action: BUY, SELL, or HOLD"
        ),
        ResponseSchema(
            name="confidence_level",
            description="Confidence level in the decision (0.1-1.0)"
        ),
        ResponseSchema(
            name="position_size",
            description="Recommended position size as percentage (10-100)"
        )
    ]
    
    return StructuredOutputParser.from_response_schemas(response_schemas)


def format_basic_financials(financials_data: Dict[str, Any]) -> str:
    """
    Format key Finnhub financial metrics for trading decisions.
    Focuses on essential metrics that impact short-term price movements.
    
    Args:
        financials_data: Basic financials data from Finnhub API
        
    Returns:
        Formatted string with essential financial metrics and trading context
    """
    if not financials_data:
        return "Fundamental Analysis: No financial metrics available"
    
    # Check if data structure has metrics (from successful API call)
    metrics = None
    if isinstance(financials_data, dict):
        if 'metrics' in financials_data:
            metrics = financials_data['metrics']
        elif 'success' in financials_data and not financials_data['success']:
            return f"Fundamental Analysis: {financials_data.get('error', 'Data unavailable')}"
        else:
            # Direct metrics dict
            metrics = financials_data
    
    if not metrics:
        return "Fundamental Analysis: No financial metrics available"
    
    try:
        essential_metrics = []
        
        # 1. VALUATION - Is stock overvalued/undervalued?
        pe_ttm = metrics.get('peTTM')
        if pe_ttm is not None:
            pe_context = "expensive" if pe_ttm > 25 else "reasonable" if pe_ttm > 15 else "cheap"
            essential_metrics.append(f"P/E: {pe_ttm:.2f} ({pe_context})")
        
        # Market Cap for context
        market_cap = metrics.get('marketCapitalization')
        if market_cap is not None:
            cap_actual = market_cap * 1e6
            if cap_actual > 500e9:
                cap_size = "mega-cap"
            elif cap_actual > 10e9:
                cap_size = "large-cap"
            elif cap_actual > 2e9:
                cap_size = "mid-cap"
            else:
                cap_size = "small-cap"
            
            if cap_actual > 1e12:
                cap_formatted = f"${cap_actual/1e12:.2f}T"
            elif cap_actual > 1e9:
                cap_formatted = f"${cap_actual/1e9:.2f}B"
            else:
                cap_formatted = f"${cap_actual/1e6:.2f}M"
            essential_metrics.append(f"Market Cap: {cap_formatted} ({cap_size})")
        
        # 2. PROFITABILITY - How efficient is the business?
        net_margin = metrics.get('netProfitMarginTTM')
        roe = metrics.get('roeTTM')
        if net_margin is not None and roe is not None:
            margin_quality = "excellent" if net_margin > 20 else "good" if net_margin > 10 else "weak"
            roe_quality = "excellent" if roe > 20 else "good" if roe > 15 else "weak"
            essential_metrics.append(f"Profitability: {net_margin:.2f}% margin ({margin_quality}), {roe:.2f}% ROE ({roe_quality})")
        
        # 3. GROWTH - Is the company growing?
        revenue_growth = metrics.get('revenueGrowthTTMYoy')
        eps_growth = metrics.get('epsGrowthTTMYoy')
        if revenue_growth is not None and eps_growth is not None:
            rev_trend = "strong" if revenue_growth > 15 else "moderate" if revenue_growth > 5 else "slow" if revenue_growth > 0 else "declining"
            eps_trend = "strong" if eps_growth > 15 else "moderate" if eps_growth > 5 else "slow" if eps_growth > 0 else "declining"
            essential_metrics.append(f"Growth: Revenue {revenue_growth:.2f}% ({rev_trend}), EPS {eps_growth:.2f}% ({eps_trend})")
        
        # 4. FINANCIAL HEALTH - Is the company financially stable?
        current_ratio = metrics.get('currentRatioQuarterly')
        debt_equity = metrics.get('totalDebt/totalEquityQuarterly')
        if current_ratio is not None and debt_equity is not None:
            liquidity = "strong" if current_ratio > 1.5 else "adequate" if current_ratio > 1.0 else "weak"
            leverage = "low" if debt_equity < 0.5 else "moderate" if debt_equity < 1.5 else "high"
            essential_metrics.append(f"Financial Health: {current_ratio:.2f} current ratio ({liquidity}), {debt_equity:.2f} debt/equity ({leverage})")
        
        # 5. MARKET PERFORMANCE - How has it performed recently?
        beta = metrics.get('beta')
        ytd_return = metrics.get('yearToDatePriceReturnDaily')
        if beta is not None and ytd_return is not None:
            volatility = "high" if beta > 1.5 else "moderate" if beta > 0.7 else "low"
            performance = "strong" if ytd_return > 10 else "positive" if ytd_return > 0 else "negative"
            essential_metrics.append(f"Market: {ytd_return:.2f}% YTD ({performance}), {beta:.2f} beta ({volatility} volatility)")
        
        # Return formatted output with context
        if essential_metrics:
            formatted_output = "Fundamental Analysis (Key Trading Metrics):\n" + "\n".join([f"• {metric}" for metric in essential_metrics])
            
            # Add brief interpretation guidance
            formatted_output += "\n\nTrading Context: Strong fundamentals suggest potential for price appreciation, while weak metrics indicate higher risk of price decline."
            return formatted_output
        else:
            return "Fundamental Analysis: Essential financial metrics not available"
    
    except Exception as e:
        return f"Fundamental Analysis: Error processing financial data - {str(e)}"


def format_technical_indicators(technical_data: Dict[str, Any], current_price: float) -> Dict[str, Any]:
    """
    Format technical indicators with raw data and explanations (NOT interpretations).
    AI analyst should make trading conclusions from raw data, not from our interpretations.
    Returns None/N/A for missing data instead of default values.
    """
    # Technical Analysis Agent sends data in nested structure: technical_analysis -> technical_indicators
    technical_analysis = technical_data.get('technical_analysis', {}) if technical_data else {}
    indicators = technical_analysis.get('technical_indicators', {})
    
    # Get indicator values safely - NO DEFAULT VALUES, return None if missing
    sma_data = indicators.get('SMA', [])
    sma_20 = sma_data[-1] if isinstance(sma_data, list) and sma_data else None
    
    rsi_data = indicators.get('RSI', [])
    rsi_14 = rsi_data[-1] if isinstance(rsi_data, list) and rsi_data else None
    
    adx_data = indicators.get('ADX', [])
    adx = adx_data[-1] if isinstance(adx_data, list) and adx_data else None
    
    cci_data = indicators.get('CCI', [])
    cci = cci_data[-1] if isinstance(cci_data, list) and cci_data else None
    
    macd_data = indicators.get('MACD', {})
    # Extract MACD values - NO DEFAULT VALUES
    macd_line = None
    macd_signal = None
    macd_histogram = None
    
    if isinstance(macd_data, dict):
        macd_line_list = macd_data.get('macd', [])
        macd_signal_list = macd_data.get('signal', [])
        macd_histogram_list = macd_data.get('histogram', [])
        
        if isinstance(macd_line_list, list) and macd_line_list:
            macd_line = macd_line_list[-1]
        if isinstance(macd_signal_list, list) and macd_signal_list:
            macd_signal = macd_signal_list[-1]
        if isinstance(macd_histogram_list, list) and macd_histogram_list:
            macd_histogram = macd_histogram_list[-1]
    
    # Bollinger Bands
    bb_data = indicators.get('BBANDS', {})
    bb_upper = None
    bb_middle = None
    bb_lower = None
    
    if isinstance(bb_data, dict):
        bb_upper_list = bb_data.get('upper', [])
        bb_middle_list = bb_data.get('middle', [])
        bb_lower_list = bb_data.get('lower', [])
        
        if isinstance(bb_upper_list, list) and bb_upper_list:
            bb_upper = bb_upper_list[-1]
        if isinstance(bb_middle_list, list) and bb_middle_list:
            bb_middle = bb_middle_list[-1]
        if isinstance(bb_lower_list, list) and bb_lower_list:
            bb_lower = bb_lower_list[-1]
    
    # Format raw data with explanations - ALL VALUES TO 2 DECIMALS
    if sma_20 is not None:
        price_vs_sma_data = f"Current: ${current_price:.2f}, SMA-20: ${sma_20:.2f} (20-day moving average)"
    else:
        price_vs_sma_data = "N/A (SMA data missing)"
    
    if rsi_14 is not None:
        rsi_data_formatted = f"{rsi_14:.2f} (scale: 0-100, measures momentum and speed of price changes)"
    else:
        rsi_data_formatted = "N/A (RSI data missing)"
    
    if macd_line is not None and macd_signal is not None and macd_histogram is not None:
        macd_data_formatted = f"MACD: {macd_line:.2f}, Signal: {macd_signal:.2f}, Histogram: {macd_histogram:.2f} (measures trend changes)"
    else:
        macd_data_formatted = "N/A (MACD data missing)"
    
    if bb_upper is not None and bb_lower is not None and bb_middle is not None:
        bb_data_formatted = f"Price: ${current_price:.2f}, Upper: ${bb_upper:.2f}, Middle: ${bb_middle:.2f}, Lower: ${bb_lower:.2f} (volatility bands)"
    else:
        bb_data_formatted = "N/A (Bollinger Bands data missing)"
    
    if adx is not None:
        adx_data_formatted = f"{adx:.2f} (scale: 0-100, measures trend strength regardless of direction)"
    else:
        adx_data_formatted = "N/A (ADX data missing)"
    
    if cci is not None:
        cci_data_formatted = f"{cci:.2f} (scale: -200 to +200, measures cyclical trends and momentum)"
    else:
        cci_data_formatted = "N/A (CCI data missing)"
    
    return {
        "price_vs_sma": price_vs_sma_data,
        "rsi_interpretation": rsi_data_formatted,
        "macd_interpretation": macd_data_formatted,
        "bb_interpretation": bb_data_formatted,
        "adx_interpretation": adx_data_formatted,
        "cci_interpretation": cci_data_formatted
    }


def format_historical_context(historical_data: List[Dict[str, Any]]) -> str:
    """
    Format historical context data for pattern recognition and learning.
    Shows technical setup, news context, decision, and outcome for AI learning.
    """
    if not historical_data:
        return "No historical pattern data available - first analysis for this symbol."
    
    formatted_history = []
    correct_predictions = 0
    total_predictions = 0
    
    for entry in historical_data:
        analysis_date = entry.get('analysis_date', 'Unknown')
        signal = entry.get('trading_signal', 'Unknown')
        confidence = entry.get('confidence_level', 0)
        position_size = entry.get('position_size', 0)
        current_price = entry.get('current_price', 0)
        actual = entry.get('next_day_actual_price')
        
        # Extract technical analysis data
        tech_analysis = entry.get('technical_analysis', {})
        tech_indicators = tech_analysis.get('technical_analysis', {}).get('technical_indicators', {}) if 'technical_analysis' in tech_analysis else tech_analysis.get('technical_indicators', {})
        
        # Helper function to get last value from indicators
        def get_last_value(indicator_data):
            if isinstance(indicator_data, list) and indicator_data:
                return indicator_data[-1]
            elif isinstance(indicator_data, (int, float)):
                return indicator_data
            return None
        
        # Key technical indicators
        sma = get_last_value(tech_indicators.get('SMA'))
        rsi = get_last_value(tech_indicators.get('RSI'))
        adx = get_last_value(tech_indicators.get('ADX'))
        cci = get_last_value(tech_indicators.get('CCI'))
        
        # MACD components
        macd_data = tech_indicators.get('MACD', {})
        macd_histogram = get_last_value(macd_data.get('histogram', [])) if isinstance(macd_data, dict) else None
        
        # Bollinger Bands position
        bb_data = tech_indicators.get('BBANDS', {})
        bb_upper = get_last_value(bb_data.get('upper', [])) if isinstance(bb_data, dict) else None
        bb_lower = get_last_value(bb_data.get('lower', [])) if isinstance(bb_data, dict) else None
        
        # Extract news sentiment data
        news_intel = entry.get('news_intelligence', {})
        nlp_features = news_intel.get('nlp_features', {}) if 'nlp_features' in news_intel else news_intel
        
        # Build historical entry with sections
        hist_entry = f"{analysis_date} | ${current_price:.2f} | {signal} (conf:{confidence:.1f}, size:{position_size}%)"
        
        # Technical Setup section
        tech_setup = []
        
        # Price vs SMA trend
        if sma is not None:
            sma_trend = "above SMA" if current_price > sma else "below SMA"
            tech_setup.append(f"Price {sma_trend} ({sma:.2f})")
        
        # Momentum indicators
        if rsi is not None:
            rsi_state = "overbought" if rsi > 70 else "oversold" if rsi < 30 else "neutral"
            tech_setup.append(f"RSI:{rsi:.2f}({rsi_state})")
        
        # Trend strength
        if adx is not None:
            trend_strength = "strong trend" if adx > 25 else "weak trend"
            tech_setup.append(f"ADX:{adx:.2f}({trend_strength})")
        
        # MACD momentum
        if macd_histogram is not None:
            macd_momentum = "bullish" if macd_histogram > 0 else "bearish"
            tech_setup.append(f"MACD:{macd_momentum}")
        
        # BB position
        if bb_upper is not None and bb_lower is not None:
            if current_price > bb_upper:
                bb_position = "above upper band"
            elif current_price < bb_lower:
                bb_position = "below lower band"
            else:
                bb_position = "within bands"
            tech_setup.append(f"BB:{bb_position}")
        
        # CCI momentum
        if cci is not None:
            cci_state = "overbought" if cci > 100 else "oversold" if cci < -100 else "neutral"
            tech_setup.append(f"CCI:{cci:.2f}({cci_state})")
        
        hist_entry += f"\nTechnical Setup: {' | '.join(tech_setup) if tech_setup else 'No data'}"
        
        # News Context section - ALL 7 features
        news_context = []
        news_relevance = nlp_features.get('news_relevance', 0)
        sentiment = nlp_features.get('sentiment', 0)
        price_impact = nlp_features.get('price_impact_potential', 0)
        trend_direction = nlp_features.get('trend_direction', 0)
        earnings_impact = nlp_features.get('earnings_impact', 0)
        investor_confidence = nlp_features.get('investor_confidence', 0)
        risk_profile_change = nlp_features.get('risk_profile_change', 0)
        
        news_context.append(f"Relevance:{news_relevance}")
        news_context.append(f"Sentiment:{sentiment}")
        news_context.append(f"Price Impact:{price_impact}")
        news_context.append(f"Trend Direction:{trend_direction}")
        news_context.append(f"Earnings Impact:{earnings_impact}")
        news_context.append(f"Investor Confidence:{investor_confidence}")
        news_context.append(f"Risk Change:{risk_profile_change}")
        
        hist_entry += f"\nNews Context: {' | '.join(news_context)}"
        
        # Outcome & Learning section
        if actual:
            price_change_pct = ((actual - current_price) / current_price) * 100
            outcome_correct = (signal == "BUY" and price_change_pct > 0) or (signal == "SELL" and price_change_pct < 0) or (signal == "HOLD" and abs(price_change_pct) < 2)
            
            # Clear price movement description
            price_movement = f"Price goes from ${current_price:.2f} to ${actual:.2f} ({price_change_pct:+.2f}%)"
            
            # Clear accuracy assessment
            if outcome_correct:
                if signal == "BUY" and price_change_pct > 0:
                    accuracy_note = "BUY was CORRECT - price went up as predicted"
                elif signal == "SELL" and price_change_pct < 0:
                    accuracy_note = "SELL was CORRECT - price went down as predicted"
                elif signal == "HOLD" and abs(price_change_pct) < 2:
                    accuracy_note = "HOLD was CORRECT - price stayed relatively stable"
                else:
                    accuracy_note = "Prediction was CORRECT"
            else:
                if signal == "BUY" and price_change_pct < 0:
                    accuracy_note = "BUY was WRONG - price fell instead of rising"
                elif signal == "SELL" and price_change_pct > 0:
                    accuracy_note = "SELL was WRONG - price rose instead of falling"
                elif signal == "HOLD" and abs(price_change_pct) >= 2:
                    accuracy_note = "HOLD was WRONG - price moved significantly"
                else:
                    accuracy_note = "Prediction was WRONG"
            
            hist_entry += f"\nOutcome: {price_movement} | {accuracy_note}"
            
            total_predictions += 1
            if outcome_correct:
                correct_predictions += 1
        else:
            hist_entry += f"\nOutcome: Next day result pending"
        
        formatted_history.append(hist_entry)
    
    # Add pattern analysis summary
    if total_predictions > 0:
        accuracy = (correct_predictions / total_predictions) * 100
        
        if accuracy >= 70:
            performance_note = "Strong pattern recognition - trust similar setups"
        elif accuracy >= 50:
            performance_note = "Mixed results - analyze conflicting signals carefully"
        else:
            performance_note = "Poor accuracy - reconsider decision framework"
        
        summary = f"\nPATTERN ANALYSIS: {correct_predictions}/{total_predictions} correct ({accuracy:.2f}% accuracy) - {performance_note}"
        formatted_history.append(summary)
        formatted_history.append("Learning: Look for recurring patterns in successful vs failed predictions to improve future decisions.")
    
    return "\n\n".join(formatted_history) 