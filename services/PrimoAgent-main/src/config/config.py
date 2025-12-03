import json
import os
from pathlib import Path
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        self._config_data = self._load_config()
        self._api_keys = self._load_api_keys()
    
    def _load_config(self) -> Dict[str, Any]:
        config_path = Path(__file__).parent / "config.json"
        if not config_path.exists():
            raise FileNotFoundError(f"config.json not found at {config_path}")
        
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _load_api_keys(self) -> Dict[str, Optional[str]]:
        return {
            'openai': os.getenv('OPENAI_API_KEY'),
            'anthropic': os.getenv('ANTHROPIC_API_KEY'),
            'finnhub': os.getenv('FINNHUB_API_KEY'),
            'firecrawl': os.getenv('FIRECRAWL_API_KEY'),
            'perplexity': os.getenv('PERPLEXITY_API_KEY')
        }
    
    # API Keys
    @property
    def api_keys(self) -> Dict[str, Optional[str]]:
        return self._api_keys
    
    def get_api_key(self, service: str) -> Optional[str]:
        return self._api_keys.get(service)
    
    # Trading Configuration
    @property 
    def market_open_time(self) -> str:
        return self._config_data['trading']['market_open_time']
    
    @property
    def trading_timezone(self) -> str:
        return self._config_data['trading']['timezone']
    
    # Portfolio Configuration
    @property
    def portfolio_historical_context_count(self) -> int:
        return self._config_data['portfolio']['historical_context_count']
    
    # News Configuration
    @property 
    def news_significance_threshold(self) -> float:
        return self._config_data['news']['significance_threshold']
    
    @property
    def news_moderate_threshold(self) -> float:
        return self._config_data['news']['moderate_threshold']
    
    @property
    def news_max_per_minute(self) -> int:
        return self._config_data['news']['max_news_per_minute']
    
    @property
    def news_sample_count(self) -> int:
        return self._config_data['news']['sample_news_count']
    
    @property
    def news_enable_firecrawl(self) -> bool:
        return self._config_data['news']['enable_firecrawl_extraction']
    
    @property
    def news_valid_sources(self) -> list:
        return self._config_data['news']['valid_sources']
    
    # Models Configuration
    @property
    def model_portfolio_manager(self) -> Dict[str, Any]:
        """Get portfolio manager model configuration."""
        config_value = self._config_data['models']['portfolio_manager']
        # Handle both legacy string format and new dict format
        if isinstance(config_value, str):
            return {"provider": "openai", "model": config_value, "temperature": 0.7}
        return config_value
    
    @property
    def model_assess_significance(self) -> Dict[str, Any]:
        """Get assess significance model configuration."""
        config_value = self._config_data['models']['assess_significance']
        # Handle both legacy string format and new dict format
        if isinstance(config_value, str):
            return {"provider": "openai", "model": config_value, "temperature": 0.5}
        return config_value
    
    @property
    def model_enhanced_summary(self) -> Dict[str, Any]:
        """Get enhanced summary model configuration."""
        config_value = self._config_data['models']['enhanced_summary']
        # Handle both legacy string format and new dict format
        if isinstance(config_value, str):
            return {"provider": "openai", "model": config_value, "temperature": 0.3}
        return config_value
    
    @property
    def model_nlp_features(self) -> Dict[str, Any]:
        """Get NLP features model configuration."""
        config_value = self._config_data['models']['nlp_features']
        # Handle both legacy string format and new dict format
        if isinstance(config_value, str):
            return {"provider": "openai", "model": config_value, "temperature": 0.3}
        return config_value
    
    # Output Configuration
    @property
    def csv_output_path(self) -> str:
        return self._config_data['output']['csv_path']
    
    @property
    def reports_output_path(self) -> str:
        return self._config_data['output']['reports_path']

# Global config instance
config = Config() 