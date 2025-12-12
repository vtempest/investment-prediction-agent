import os
import random
from typing import Dict, Any, List, Optional
from datetime import datetime
from ..workflows.state import AgentState
from ..tools.finnhub_tool import get_company_news
from ..tools.firecrawl_tool import scrape_url
from ..config.model_factory import ModelFactory
from ..config import config

from ..prompts import (
    get_news_analysis_template,
    get_news_output_parser,
    get_news_significance_assessment_template,
    get_article_summarization_template,
    format_news_data,
    format_significant_news_data,
    clean_input_string
)

def format_date_for_display(date_str: str) -> str:
    """Format date string from YYYYMMDDHHMMSS to YYYY-MM-DD HH:MM:SS for better readability."""
    try:
        if len(date_str) == 14 and date_str.isdigit():
            dt = datetime.strptime(date_str, '%Y%m%d%H%M%S')
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        return date_str  # Return original if parsing fails
    except ValueError:
        return date_str  # Return original if parsing fails


def sample_random_news(news_items: List[Dict], max_count: int = 5) -> List[Dict]:
    """Sample random news items, filtering out promotional content."""
    if not news_items:
        return []
    
    # Filter out promotional content
    filtered = [
        item for item in news_items
        if not item.get('summary', '').startswith("Looking for stock market analysis")
    ]
    
    return random.sample(filtered, min(max_count, len(filtered)))


async def assess_significance(
    headline: str, 
    summary: str, 
    date: str,
    symbol: str,
    company_info: Optional[Dict[str, Any]] = None
) -> float:
    """Assess news significance using AI with company context."""
    try:
        api_key = config.get_api_key('openai')
        
        if not api_key:
            return 0.0
            
        os.environ['OPENAI_API_KEY'] = api_key
        llm = ModelFactory.get_assess_significance_model()
        
        prompt_template = get_news_significance_assessment_template()
        
        # Extract company information for context
        if company_info:
            company_name = company_info.get('name', company_info.get('longName', symbol))
            industry = company_info.get('industry', company_info.get('sector', 'Unknown Industry'))
            market_cap = company_info.get('marketCap', company_info.get('market_cap', 'N/A'))
            business_description = company_info.get('longBusinessSummary', company_info.get('description', 'No description available'))
            
            # Format market cap if it's a number
            if isinstance(market_cap, (int, float)) and market_cap > 0:
                market_cap = f"${market_cap:,.0f}"
            elif market_cap == 'N/A' or not market_cap:
                market_cap = "N/A"
        else:
            company_name = symbol
            industry = "Unknown Industry"
            market_cap = "N/A"
            business_description = "No company information available"
        
        response = await (prompt_template | llm).ainvoke({
            'headline': headline,
            'summary': summary,
            'date': format_date_for_display(date),
            'symbol': symbol,
            'company_name': company_name,
            'industry': industry,
            'market_cap': market_cap,
            'business_description': business_description
        })
        
        significance_text = str(response.content).strip()
        return max(0.0, min(1.0, float(significance_text)))
        
    except Exception as e:
        print(f"Significance assessment failed: {e}")
        return 0.0


async def scrape_article_content(news_item: Dict) -> Optional[str]:
    """Scrape full article content using Firecrawl."""
    try:
        url = news_item.get('url')
        if not url:
            return None
            
        result = await scrape_url(url)
        
        if result.success and result.data:
            return result.data.get('content', '')
            
        return None
        
    except Exception as e:
        print(f"Article scraping failed: {e}")
        return None


async def create_enhanced_summary(title: str, original_summary: str, full_content: str, symbol: str) -> Optional[str]:
    """Create enhanced summary from scraped content."""
    try:
        api_key = config.get_api_key('openai')
        
        if not api_key:
            return None
            
        os.environ['OPENAI_API_KEY'] = api_key
        llm = ModelFactory.get_enhanced_summary_model()
        
        prompt_template = get_article_summarization_template()
        
        response = await (prompt_template | llm).ainvoke({
            'title': title,
            'source': 'News',
            'original_summary': original_summary,
            'full_content': full_content[:8000],
            'symbol': symbol
        })
        
        return str(response.content).strip()
        
    except Exception as e:
        print(f"Enhanced summary failed: {e}")
        return None


async def analyze_news(
    symbol: str, 
    analysis_date: Optional[str] = None, 
    technical_data: Optional[Dict[str, Any]] = None,
    company_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Complete news analysis with PrimoGPT workflow:
    1. Get news -> 2. Sample random articles -> 3. Assess significance 
    4. Scrape significant articles -> 5. Generate NLP features
    """
    try:
        symbol = symbol.upper()
        
        # Extract company information from data_collection_results
        company_info = None
        if company_data:
            company_info = company_data.get('company_info') or company_data.get('company_profile')
        
        # 1. Get news data for analysis
        news_result = await get_company_news(symbol, analysis_date)
        
        # Extract news data
        news_data = []
        if news_result and news_result.success and news_result.data:
            if isinstance(news_result.data, dict):
                news_data = news_result.data.get('news', [])
            elif isinstance(news_result.data, list):
                news_data = news_result.data
        
        if not news_data:
            return {
                'symbol': symbol,
                'success': False,
                'error': 'No news data available'
            }
        
        # 2. Sample random news items per config
        sampled_news = sample_random_news(news_data, max_count=config.news_sample_count)
        
        # 3. Process each news item for significance with company context
        processed_news = []
        significant_news = []
        
        for news_item in sampled_news:
            # Assess significance with company context
            significance = await assess_significance(
                news_item.get('headline', ''),
                news_item.get('summary', ''),
                news_item.get('date', ''),
                symbol,
                company_info
            )
            
            news_item['significance_score'] = significance
            
            # 4. If significant (threshold per config), scrape and enhance
            if significance >= config.news_significance_threshold:
                full_content = await scrape_article_content(news_item)
                if full_content:
                    enhanced_summary = await create_enhanced_summary(
                        news_item.get('headline', ''),
                        news_item.get('summary', ''),
                        full_content,
                        symbol
                    )
                    if enhanced_summary:
                        news_item['enhanced_summary'] = enhanced_summary
                        significant_news.append(news_item)
            
            processed_news.append(news_item)
        
        # 5. Generate NLP features
        nlp_features = await extract_nlp_features(
            symbol, 
            processed_news, 
            significant_news,
            technical_data
        )
        
        if not nlp_features:
            return {
                'symbol': symbol,
                'success': False,
                'error': 'NLP feature extraction failed'
            }
        
        return {
            'symbol': symbol,
            'nlp_features': nlp_features,
            'news_count': len(processed_news),
            'significant_count': len(significant_news),
            'success': True
        }
        
    except Exception as e:
        print(f"Error in news analysis for {symbol}: {e}")
        return {
            'symbol': symbol,
            'success': False,
            'error': str(e)
        }


async def extract_nlp_features(
    symbol: str,
    all_news: List[Dict],
    significant_news: List[Dict],
    technical_data: Optional[Dict[str, Any]] = None
) -> Optional[Dict[str, int]]:
    """Extract 7 NLP features using proper separation of regular vs significant news."""
    try:
        api_key = config.get_api_key('openai')
        
        if not api_key:
            print(f"No OpenAI API key available for {symbol}")
            return None
        
        os.environ['OPENAI_API_KEY'] = api_key
        llm = ModelFactory.get_nlp_features_model()
        
        # Prepare prompts and data
        prompt_template = get_news_analysis_template()
        output_parser = get_news_output_parser()
        
        # Separate regular and significant news, filtering out low significance items
        # Only include news with significance >= moderate_threshold in the analysis
        moderate_news = [item for item in all_news if item not in significant_news and item.get('significance_score', 0.0) >= config.news_moderate_threshold]
        
        # Format data (company_info removed - focusing only on news content)
        formatted_regular_news = format_news_data(moderate_news)
        formatted_significant_news = format_significant_news_data(significant_news)
        
        # Clean strings
        formatted_regular_news = clean_input_string(formatted_regular_news)
        formatted_significant_news = clean_input_string(formatted_significant_news)
        
        # Prepare prompt input
        prompt_input = {
            'symbol': symbol,
            'news': formatted_regular_news,
            'significant_news': formatted_significant_news,
            'format_instructions': output_parser.get_format_instructions()
        }
        
        # Execute chain
        chain = prompt_template | llm | output_parser
        result = await chain.ainvoke(prompt_input)
        
        # Validate and convert results
        if isinstance(result, dict):
            nlp_features = {}
            required_features = [
                'news_relevance', 'sentiment', 'price_impact_potential',
                'trend_direction', 'earnings_impact', 'investor_confidence', 
                'risk_profile_change'
            ]
            
            for feature in required_features:
                value = result.get(feature)
                if value is not None:
                    try:
                        int_value = int(value)
                        # Validate that value is in allowed range: -2, -1, 0, 1, 2
                        if int_value not in [-2, -1, 0, 1, 2]:
                            print(f"Invalid {feature} value: {int_value} (must be -2, -1, 0, 1, or 2)")
                            return None
                        nlp_features[feature] = int_value
                    except (ValueError, TypeError):
                        print(f"Invalid {feature} value: {value} (must be integer)")
                        return None
                else:
                    print(f"Missing {feature} in result")
                    return None
            
            return nlp_features
        else:
            print(f"Invalid result format: {type(result)}")
            return None
        
    except Exception as e:
        print(f"Error extracting NLP features for {symbol}: {e}")
        return None


async def news_intelligence_agent_node(state: AgentState) -> AgentState:
    """
    LangGraph node for news intelligence with complete PrimoGPT workflow.
    """
    try:
        # Get symbol, analysis_date and technical data from previous agents
        symbol = state['symbols'][0] if state['symbols'] else 'AAPL'
        analysis_date = state['analysis_date']
        technical_data = state.get('technical_analysis_results')
        
        # Get company data from data collection results
        company_data = state.get('data_collection_results')
        
        # Perform complete news analysis with company context
        result = await analyze_news(symbol, analysis_date, technical_data, company_data)
        
        # Update state
        state['news_intelligence_results'] = result
        state['current_step'] = 'news_intelligence_complete'
        
        if not result['success']:
            state['error'] = result.get('error', 'News intelligence failed')
            
        return state
        
    except Exception as e:
        print(f"News intelligence node error: {e}")
        state['error'] = str(e)
        state['current_step'] = 'error'
        return state 