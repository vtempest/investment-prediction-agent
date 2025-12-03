from typing import Dict, Any, List


def format_company_info(profile_data: Dict[str, Any]) -> str:
    """
    Format company profile information for use in prompt templates.
    Used by Portfolio Manager agent for trading context.
    """
    if not profile_data:
        return "No company profile data available."
    
    company_name = profile_data.get('name', 'Unknown Company')
    industry = profile_data.get('industry', 'Unknown Industry')
    country = profile_data.get('country', 'Unknown')
    
    formatted_info = f"Company: {company_name}\n"
    formatted_info += f"Industry: {industry}\n"
    formatted_info += f"Country: {country}"
    
    return formatted_info


def extract_company_info(profile_data: Dict[str, Any]) -> Dict[str, str]:
    """
    Extract company information into a structured format.
    Used by Portfolio Manager for trading context and prompt formatting.
    """
    if not profile_data:
        return {
            'company_name': 'Unknown Company',
            'industry': 'Unknown Industry',
            'exchange': 'Unknown Exchange',
            'market_cap': 'N/A'
        }
    
    # Extract market cap and format it
    market_cap = profile_data.get('market_cap', 0)
    if market_cap > 0:
        if market_cap > 1000:
            market_cap_str = f"${market_cap/1000:.1f}B"
        else:
            market_cap_str = f"${market_cap:.0f}M"
    else:
        market_cap_str = "N/A"
    
    return {
        'company_name': profile_data.get('name', profile_data.get('symbol', 'Unknown Company')),
        'industry': profile_data.get('industry', 'Unknown Industry'),
        'exchange': profile_data.get('exchange', 'Unknown Exchange'),
        'market_cap': market_cap_str
    }


def clean_input_string(input_str: str) -> str:
    """
    Clean and sanitize input strings for use in prompts.
    Removes problematic characters and normalizes text while preserving line breaks.
    """
    if not input_str:
        return ""
    
    # Remove null bytes and other problematic characters
    cleaned = input_str.replace('\x00', '').replace('\r', '\n')
    
    # Normalize whitespace but preserve line breaks
    lines = cleaned.split('\n')
    normalized_lines = []
    for line in lines:
        # Clean each line individually but preserve empty lines for formatting
        normalized_line = ' '.join(line.split()) if line.strip() else ''
        normalized_lines.append(normalized_line)
    
    cleaned = '\n'.join(normalized_lines)
    
    # Limit length to prevent token overflow
    if len(cleaned) > 2000:
        cleaned = cleaned[:2000] + "..."
    
    return cleaned


def format_template_factory_functions():
    """
    Placeholder for template factory functions that might be needed.
    Currently not in use but preserved for future expansion.
    """
    pass 