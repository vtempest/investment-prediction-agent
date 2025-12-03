import os
from typing import Dict, Any, Optional
import aiohttp
from .utils import ToolResult
from ..config import config

PERPLEXITY_BASE_URL = "https://api.perplexity.ai/chat/completions"

async def research_with_perplexity(
    symbol: Optional[str] = None,
    query: Optional[str] = None,
    model: str = "llama-3.1-sonar-small-128k-online",
    max_tokens: int = 1000
) -> ToolResult:
    """
    Research with Perplexity - backward compatibility function.
    
    Args:
        symbol: Stock symbol to research (optional)
        query: Custom query string (optional)
        model: Perplexity model to use
        max_tokens: Maximum tokens in response
        
    Returns:
        ToolResult with research data
    """
    if query:
        research_text = query
    elif symbol:
        research_text = f"Latest developments and financial performance analysis for {symbol} stock"
    else:
        return ToolResult(success=False, error="Either symbol or query must be provided")
    
    return await research_query(research_text, model, max_tokens)

async def research_query(
    query: str,
    model: str = "llama-3.1-sonar-small-128k-online",
    max_tokens: int = 1000
) -> ToolResult:
    """
    Perform research query using Perplexity API.
    
    Args:
        query: Research question or query
        model: Perplexity model to use
        max_tokens: Maximum tokens in response
        
    Returns:
        ToolResult with research response
    """
    perplexity_key = config.get_api_key('perplexity')
    
    if not perplexity_key:
        return ToolResult(
            success=False,
            error="PERPLEXITY_API_KEY not found in environment variables"
        )
    
    try:
        headers = {
            "Authorization": f"Bearer {perplexity_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": query}
            ],
            "max_tokens": max_tokens,
            "temperature": 0.2,
            "return_citations": True,
            "return_images": False
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(PERPLEXITY_BASE_URL, json=payload, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Extract response content
                    content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
                    citations = data.get('citations', [])
                    
                    return ToolResult(
                        success=True,
                        data={
                            'query': query,
                            'response': content,
                            'citations': citations,
                            'model': model,
                            'usage': data.get('usage', {})
                        }
                    )
                else:
                    error_text = await response.text()
                    return ToolResult(
                        success=False,
                        error=f"HTTP {response.status}: {error_text}"
                    )
                    
    except Exception as e:
        return ToolResult(
            success=False,
            error=f"Research query failed: {str(e)}"
        )
