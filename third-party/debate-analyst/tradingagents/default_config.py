import os

DEFAULT_CONFIG = {
    "project_dir": os.path.abspath(os.path.join(os.path.dirname(__file__), ".")),
    "results_dir": os.getenv("TRADINGAGENTS_RESULTS_DIR", "./results"),
    "data_dir": "/Users/yluo/Documents/Code/ScAI/FR1-data",
    "data_cache_dir": os.path.join(
        os.path.abspath(os.path.join(os.path.dirname(__file__), ".")),
        "dataflows/data_cache",
    ),
    # LLM settings
    # Supported providers: openai, anthropic, google, groq, ollama, openrouter
    "llm_provider": "groq",  # Using Groq for fast, cost-effective inference
    "deep_think_model": "llama-3.3-70b-versatile",
    "quick_think_llm": "llama-3.1-8b-instant",
    "backend_url": None,
    "temperature": 0.3,

    # Alternative OpenAI configuration:
    # "llm_provider": "openai",
    # "deep_think_llm": "o4-mini",
    # "quick_think_llm": "gpt-4o-mini",
    # "backend_url": "https://api.openai.com/v1",

    # Example Anthropic configuration:
    # "llm_provider": "anthropic",
    # "deep_think_llm": "claude-3-5-sonnet-20241022",
    # "quick_think_llm": "claude-3-5-haiku-20241022",
    # "backend_url": None,
    # Debate and discussion settings
    "max_debate_rounds": 2,  # Increased for more thorough debate
    "max_risk_discuss_rounds": 1,
    "max_recur_limit": 100,
    # Data vendor configuration
    # Category-level configuration (default for all tools in category)
    "data_vendors": {
        "core_stock_apis": "yfinance",       # Options: yfinance, alpha_vantage, local
        "technical_indicators": "yfinance",  # Options: yfinance, alpha_vantage, local
        "fundamental_data": "alpha_vantage", # Options: openai, alpha_vantage, local
        "news_data": "alpha_vantage",        # Options: openai, alpha_vantage, google, local
    },
    # Tool-level configuration (takes precedence over category-level)
    "tool_vendors": {
        # Example: "get_stock_data": "alpha_vantage",  # Override category default
        # Example: "get_news": "openai",               # Override category default
    },
}
