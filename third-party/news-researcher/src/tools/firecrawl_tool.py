import os
from typing import Dict, Any, Optional, List
import aiohttp
from .utils import ToolResult
from ..config import config

FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v0"

async def scrape_url(
    url: str,
    extract_main_content: bool = True,
    include_html: bool = False
) -> ToolResult:
    """
    Scrape a URL using Firecrawl API.
    
    Args:
        url: URL to scrape
        extract_main_content: Whether to extract main content only
        include_html: Whether to include HTML in response
        
    Returns:
        ToolResult with scraped content
    """
    firecrawl_key = config.get_api_key('firecrawl')
    
    if not firecrawl_key:
        return ToolResult(
            success=False,
            error="FIRECRAWL_API_KEY not found in environment variables"
        )
    
    try:
        headers = {
            "Authorization": f"Bearer {firecrawl_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "url": url,
            "extractorOptions": {
                "mode": "markdown" if extract_main_content else "html"
            },
            "pageOptions": {
                "includeHtml": include_html,
                "onlyMainContent": extract_main_content
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{FIRECRAWL_BASE_URL}/scrape", json=payload, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Extract relevant data
                    content = data.get('data', {}).get('content', '')
                    html = data.get('data', {}).get('html', '') if include_html else None
                    metadata = data.get('data', {}).get('metadata', {})
                    
                    return ToolResult(
                        success=True,
                        data={
                            'url': url,
                            'content': content,
                            'html': html,
                            'title': metadata.get('title', ''),
                            'description': metadata.get('description', ''),
                            'keywords': metadata.get('keywords', []),
                            'content_length': len(content)
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
            error=f"Web scraping failed: {str(e)}"
        )

async def crawl_website(
    url: str,
    max_pages: int = 5,
    include_paths: Optional[List[str]] = None,
    exclude_paths: Optional[List[str]] = None
) -> ToolResult:
    """
    Crawl a website using Firecrawl API.
    
    Args:
        url: Base URL to crawl
        max_pages: Maximum number of pages to crawl
        include_paths: List of paths to include
        exclude_paths: List of paths to exclude
        
    Returns:
        ToolResult with crawled content
    """
    firecrawl_key = config.get_api_key('firecrawl')
    
    if not firecrawl_key:
        return ToolResult(
            success=False,
            error="FIRECRAWL_API_KEY not found in environment variables"
        )
    
    try:
        headers = {
            "Authorization": f"Bearer {firecrawl_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "url": url,
            "crawlerOptions": {
                "limit": max_pages,
                "includePaths": include_paths or [],
                "excludePaths": exclude_paths or []
            },
            "pageOptions": {
                "onlyMainContent": True
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{FIRECRAWL_BASE_URL}/crawl", json=payload, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Extract crawled pages
                    pages = data.get('data', [])
                    formatted_pages = []
                    
                    for page in pages:
                        formatted_page = {
                            'url': page.get('url', ''),
                            'content': page.get('content', ''),
                            'title': page.get('metadata', {}).get('title', ''),
                            'description': page.get('metadata', {}).get('description', '')
                        }
                        formatted_pages.append(formatted_page)
                    
                    return ToolResult(
                        success=True,
                        data={
                            'base_url': url,
                            'pages_crawled': len(formatted_pages),
                            'pages': formatted_pages,
                            'total_content_length': sum(len(p['content']) for p in formatted_pages)
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
            error=f"Website crawling failed: {str(e)}"
        )


