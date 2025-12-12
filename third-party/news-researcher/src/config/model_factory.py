from typing import Dict, Any, Union
import sys
from pathlib import Path

# Add agents directory to path for unified client import
agents_dir = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(agents_dir))

from unified_llm_client import UnifiedLLMClient, LLMConfig
from langchain_core.language_models.chat_models import BaseChatModel
from . import config

class ModelFactory:
    @staticmethod
    def create_model(model_config: Union[Dict[str, Any], str]) -> BaseChatModel:
        """
        Create LLM model based on provider configuration using Unified LLM Client.

        Supports: OpenAI, Anthropic, Google, Groq, Ollama, OpenRouter

        Args:
            model_config: Either a dict with provider/model/temperature or a string model name (legacy)

        Returns:
            Configured LLM instance
        """
        # Handle legacy string model names (default to OpenAI for backward compatibility)
        if isinstance(model_config, str):
            llm_config = LLMConfig(
                provider="openai",
                model=model_config,
                temperature=0.7
            )
            return UnifiedLLMClient.create_llm(llm_config)

        # Handle new dict-based configuration with unified client
        provider = model_config.get('provider')
        model_name = model_config.get('model')
        temperature = model_config.get('temperature', 0.3)

        if not model_name:
            raise ValueError("Model name is required in configuration")

        # Create LLM config for unified client
        llm_config = LLMConfig(
            provider=provider,
            model=model_name,
            temperature=temperature,
            max_tokens=model_config.get('max_tokens'),
            api_key=model_config.get('api_key'),
            base_url=model_config.get('base_url'),
            timeout=model_config.get('timeout', 60)
        )

        return UnifiedLLMClient.create_llm(llm_config)
    
    @staticmethod
    def get_portfolio_manager_model():
        """Get configured portfolio manager model."""
        return ModelFactory.create_model(config.model_portfolio_manager)
    
    @staticmethod
    def get_nlp_features_model():
        """Get configured NLP features model."""
        return ModelFactory.create_model(config.model_nlp_features)
    
    @staticmethod
    def get_assess_significance_model():
        """Get configured assess significance model."""
        return ModelFactory.create_model(config.model_assess_significance)
    
    @staticmethod
    def get_enhanced_summary_model():
        """Get configured enhanced summary model."""
        return ModelFactory.create_model(config.model_enhanced_summary) 