from datetime import datetime
from typing import List, Dict, Any
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser


def get_news_analysis_template() -> ChatPromptTemplate:
    """
    Main news analysis prompt template for generating 7 quantified features.
    """
    template = """You are a quantitative analyst extracting trading signals from news for algorithmic trading.

[TASK]
Analyze news for {symbol} and generate 7 precise features predicting next trading day price movement.
Each feature must be an integer value: -2, -1, 0, 1, or 2.
Scale: -2 (very negative) | -1 (negative) | 0 (no impact) | 1 (positive) | 2 (very positive)

[NEWS DATA]
Recent news articles with significance scores:
- 0.4-0.6: Moderate significance (business developments, operational updates)
- 0.7-1.0: High significance (earnings, major announcements, strategic shifts)
{news}

[SIGNIFICANT NEWS]
High-impact news with detailed analysis:
{significant_news}

[ANALYSIS PRINCIPLES]
1. Material Information Priority: Earnings results, guidance changes, M&A activity > routine announcements
2. Actual vs Expected Analysis: Compare results to consensus estimates - surprises move markets more
3. Forward-Looking Weight: Future guidance and management outlook > historical performance data  
4. Quantitative vs Qualitative: Concrete numbers (EPS, revenue, margins) > vague management statements
5. Market Anomaly Detection: Unusual volume, insider activity, or sector-wide moves amplify individual news impact
6. Fact vs Speculation Distinction: Confirmed announcements > rumors, official sources > speculation

[FEATURE DEFINITIONS]
Generate these 7 features based on collective news impact:
- news_relevance: How directly news affects the stock's business/price (-2: very irrelevant, -1: somewhat irrelevant, 0: neutral/no relevance, 1: somewhat relevant, 2: highly relevant)
- sentiment: Overall positive/negative tone toward the company (-2: very negative, -1: negative, 0: neutral, 1: positive, 2: very positive)
- price_impact_potential: Likely magnitude of price movement tomorrow (-2: strong negative impact, -1: negative impact, 0: no impact, 1: positive impact, 2: strong positive impact)
- trend_direction: Which way the news suggests price will move (-2: strong downward trend, -1: downward trend, 0: neutral/sideways, 1: upward trend, 2: strong upward trend)
- earnings_impact: How news affects future earnings expectations (-2: very negative impact, -1: negative impact, 0: no impact, 1: positive impact, 2: very positive impact)
- investor_confidence: Impact on investor trust and conviction (-2: major confidence decrease, -1: confidence decrease, 0: no change, 1: confidence increase, 2: major confidence increase)
- risk_profile_change: Changes to perceived company risk level (-2: major risk increase, -1: risk increase, 0: no change, 1: risk decrease, 2: major risk decrease)

[OUTPUT]
Return ONLY valid JSON structure with these exact keys and integer values (-2 to 2):
{format_instructions}"""
    
    return ChatPromptTemplate.from_template(template)


def get_news_significance_assessment_template() -> ChatPromptTemplate:
    """
    Template for assessing news significance to determine if Firecrawl should be used.
    """
    template = """You are a trading analyst assessing if news warrants full content extraction for trading signals.

[CONTEXT]
{symbol} | {company_name} | {industry} | Market Cap: {market_cap}

[NEWS]
Date: {date}
Headline: {headline}
Summary: {summary}

[SIGNIFICANCE PRINCIPLES]
HIGH (0.7-1.0): Direct, immediate price impact
- Quantifiable financial changes (earnings, revenue, guidance)
- Strategic shifts affecting business model or competitive position
- Events requiring immediate investor action or portfolio adjustment
- Material changes to company fundamentals or outlook

MODERATE (0.4-0.6): Notable business developments
- Growth initiatives or operational changes
- Market position updates without immediate financial impact
- Industry developments with clear company implications
- Changes that affect medium-term prospects

LOW (0.0-0.3): Minimal trading relevance
- Routine operations without material impact
- General market commentary
- Indirect or speculative connections
- Promotional or repetitive content

[KEY QUESTION]
Will this news likely influence {symbol}'s price in the next 1-3 trading sessions based on new, material information?

Output only a decimal number between 0.0 and 1.0."""
    
    return ChatPromptTemplate.from_template(template)


def get_article_summarization_template() -> ChatPromptTemplate:
    """Get template for summarizing scraped article content with trading-focused analysis."""
    
    template = """You are a trading analyst extracting price-moving intelligence from news articles.

[ARTICLE]
Title: {title}
Source: {source}
Original Summary: {original_summary}

[FULL CONTENT]
{full_content}

[TASK]
Create a comprehensive summary (max 500 words) that captures ALL information likely to impact {symbol}'s stock price in the next 1-3 trading sessions.

Focus on:
- Specific numbers, metrics, and quantifiable data
- Changes from expectations or previous periods
- Management statements about future outlook
- Competitive dynamics and market positioning
- Analyst reactions and institutional moves
- Timeline of events and critical dates
- Any information that changes the investment thesis

Structure flexibly based on content relevance. Prioritize actionable trading intelligence over general information.

Be precise with data points but concise in explanations. If the article lacks specific trading-relevant information, note this clearly.

Enhanced Summary:"""
    
    return ChatPromptTemplate.from_template(template)


def get_news_response_schemas() -> List[ResponseSchema]:
    """
    Define response schemas for structured output parsing of news analysis.
    Simple validation schemas - detailed descriptions are in the prompt template.
    """
    return [
        ResponseSchema(name="news_relevance", description="Integer from -2 to 2"),
        ResponseSchema(name="sentiment", description="Integer from -2 to 2"), 
        ResponseSchema(name="price_impact_potential", description="Integer from -2 to 2"),
        ResponseSchema(name="trend_direction", description="Integer from -2 to 2"),
        ResponseSchema(name="earnings_impact", description="Integer from -2 to 2"),
        ResponseSchema(name="investor_confidence", description="Integer from -2 to 2"),
        ResponseSchema(name="risk_profile_change", description="Integer from -2 to 2")
    ]


def get_news_output_parser() -> StructuredOutputParser:
    """Create structured output parser for news analysis results."""
    response_schemas = get_news_response_schemas()
    return StructuredOutputParser.from_response_schemas(response_schemas)


def format_news_data(news_items: List[Dict[str, Any]]) -> str:
    """
    Format news data for prompt templates with significance scores and date information.
    """
    if not news_items:
        return "No recent news available."
    
    formatted_news = []
    for i, item in enumerate(news_items, 1):
        headline = item.get('headline', 'No headline')
        summary = item.get('summary', 'No summary available')
        significance = item.get('significance_score', 0.0)
        date = item.get('date', 'Unknown date')
        
        # Format date using datetime library
        formatted_date = date
        try:
            if len(date) == 14 and date.isdigit():
                dt = datetime.strptime(date, '%Y%m%d%H%M%S')
                formatted_date = dt.strftime('%Y-%m-%d %H:%M:%S')
        except ValueError:
            pass  # Keep original if parsing fails
        
        news_text = f"--- NEWS ARTICLE {i} ---\n"
        news_text += f"Date: {formatted_date}\n"
        news_text += f"Headline: {headline}\n"
        news_text += f"Summary: {summary}\n"
        news_text += f"Significance: {significance:.2f}\n"
        
        formatted_news.append(news_text)
    
    return "\n\n".join(formatted_news)



def format_significant_news_data(news_items: List[Dict[str, Any]]) -> str:
    """
    Format significant news data with enhanced summaries and date information for the [SIGNIFICANT NEWS] section.
    """
    if not news_items:
        return "No significant news identified."
    
    formatted_news = []
    for i, item in enumerate(news_items, 1):
        headline = item.get('headline', 'No headline')
        enhanced_summary = item.get('enhanced_summary', '')
        significance = item.get('significance_score', 0.0)
        date = item.get('date', 'Unknown date')
        
        # Format date using datetime library
        formatted_date = date
        try:
            if len(date) == 14 and date.isdigit():
                dt = datetime.strptime(date, '%Y%m%d%H%M%S')
                formatted_date = dt.strftime('%Y-%m-%d %H:%M:%S')
        except ValueError:
            pass  # Keep original if parsing fails
        
        news_text = f"--- SIGNIFICANT NEWS {i} ---\n"
        news_text += f"Date: {formatted_date}\n"
        news_text += f"Headline: {headline}\n"
        news_text += f"Enhanced Summary: {enhanced_summary}\n"
        news_text += f"Significance: {significance:.2f}\n"
        
        formatted_news.append(news_text)
    
    return "\n".join(formatted_news) 