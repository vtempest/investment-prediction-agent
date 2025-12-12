"""
Unified LLM Client for Stock Prediction Agents
Provides a consistent interface for multiple LLM providers:
- OpenAI
- Anthropic
- Google (Gemini)
- Groq
- Ollama/OpenRouter
"""

from typing import Dict, Any, Optional, Union, List
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import BaseMessage
from pydantic import BaseModel, Field
import os


class LLMConfig(BaseModel):
    """Configuration for LLM instances"""
    provider: str = Field(description="LLM provider: openai, anthropic, google, groq, ollama, openrouter")
    model: str = Field(description="Model name/ID")
    temperature: float = Field(default=0.3, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=None, description="Maximum tokens in response")
    api_key: Optional[str] = Field(default=None, description="API key (falls back to env vars)")
    base_url: Optional[str] = Field(default=None, description="Custom base URL for API")
    timeout: Optional[int] = Field(default=60, description="Request timeout in seconds")

    class Config:
        extra = "allow"  # Allow additional provider-specific parameters


class UnifiedLLMClient:
    """
    Factory for creating LLM instances with consistent interface across providers.

    Usage:
        config = LLMConfig(provider="groq", model="llama-3.1-70b-versatile")
        llm = UnifiedLLMClient.create_llm(config)
        response = llm.invoke("What is the stock market outlook?")
    """

    # Default models for each provider
    DEFAULT_MODELS = {
        "openai": "gpt-4o-mini",
        "anthropic": "claude-3-5-sonnet-20241022",
        "google": "gemini-1.5-flash",
        "groq": "llama-3.1-70b-versatile",
        "ollama": "llama3.1",
        "openrouter": "meta-llama/llama-3.1-70b-instruct"
    }

    # Environment variable mappings
    ENV_KEY_MAP = {
        "openai": "OPENAI_API_KEY",
        "anthropic": "ANTHROPIC_API_KEY",
        "google": "GOOGLE_API_KEY",
        "groq": "GROQ_API_KEY",
        "ollama": None,  # Ollama typically doesn't need API key
        "openrouter": "OPENROUTER_API_KEY"
    }

    @staticmethod
    def create_llm(config: Union[LLMConfig, Dict[str, Any], str]) -> BaseChatModel:
        """
        Create an LLM instance based on configuration.

        Args:
            config: Either a LLMConfig object, dict with config params, or string provider name

        Returns:
            BaseChatModel instance configured for the specified provider

        Raises:
            ValueError: If provider is unsupported or configuration is invalid
        """
        # Handle different input types
        if isinstance(config, str):
            config = LLMConfig(provider=config, model=UnifiedLLMClient.DEFAULT_MODELS.get(config))
        elif isinstance(config, dict):
            config = LLMConfig(**config)
        elif not isinstance(config, LLMConfig):
            raise ValueError(f"Invalid config type: {type(config)}")

        provider = config.provider.lower()

        # Get API key from config or environment
        api_key = config.api_key or os.getenv(UnifiedLLMClient.ENV_KEY_MAP.get(provider))

        # Common parameters
        common_params = {
            "model": config.model or UnifiedLLMClient.DEFAULT_MODELS.get(provider),
            "temperature": config.temperature,
            "timeout": config.timeout
        }

        if config.max_tokens:
            common_params["max_tokens"] = config.max_tokens

        # Provider-specific initialization
        if provider == "openai":
            from langchain_openai import ChatOpenAI
            params = {**common_params, "model_name": common_params.pop("model")}
            if api_key:
                params["api_key"] = api_key
            if config.base_url:
                params["base_url"] = config.base_url
            return ChatOpenAI(**params)

        elif provider == "anthropic":
            from langchain_anthropic import ChatAnthropic
            params = {**common_params, "model_name": common_params.pop("model")}
            if api_key:
                params["api_key"] = api_key
            if config.base_url:
                params["base_url"] = config.base_url
            return ChatAnthropic(**params)

        elif provider == "google":
            from langchain_google_genai import ChatGoogleGenerativeAI
            params = {**common_params}
            if api_key:
                params["google_api_key"] = api_key
            return ChatGoogleGenerativeAI(**params)

        elif provider == "groq":
            from langchain_groq import ChatGroq
            params = {**common_params, "model_name": common_params.pop("model")}
            if api_key:
                params["groq_api_key"] = api_key
            return ChatGroq(**params)

        elif provider in ["ollama", "openrouter"]:
            from langchain_openai import ChatOpenAI
            params = {**common_params, "model_name": common_params.pop("model")}

            if provider == "ollama":
                params["base_url"] = config.base_url or "http://localhost:11434/v1"
            elif provider == "openrouter":
                params["base_url"] = config.base_url or "https://openrouter.ai/api/v1"
                if api_key:
                    params["api_key"] = api_key

            return ChatOpenAI(**params)

        else:
            raise ValueError(
                f"Unsupported provider: {provider}. "
                f"Supported: {', '.join(UnifiedLLMClient.DEFAULT_MODELS.keys())}"
            )

    @staticmethod
    def create_multiple_llms(configs: Dict[str, Union[LLMConfig, Dict, str]]) -> Dict[str, BaseChatModel]:
        """
        Create multiple LLM instances with different configurations.

        Args:
            configs: Dict mapping names to LLM configs

        Returns:
            Dict mapping names to initialized LLM instances

        Example:
            llms = UnifiedLLMClient.create_multiple_llms({
                "deep_think": {"provider": "openai", "model": "o1-mini"},
                "quick_think": {"provider": "groq", "model": "llama-3.1-70b-versatile"},
                "analyze": {"provider": "anthropic", "model": "claude-3-5-sonnet-20241022"}
            })
        """
        return {name: UnifiedLLMClient.create_llm(config) for name, config in configs.items()}

    @staticmethod
    def get_available_providers() -> List[str]:
        """Get list of supported providers"""
        return list(UnifiedLLMClient.DEFAULT_MODELS.keys())

    @staticmethod
    def get_default_model(provider: str) -> str:
        """Get default model for a provider"""
        return UnifiedLLMClient.DEFAULT_MODELS.get(provider.lower())


# Convenience functions for common use cases
def create_groq_llm(model: str = "llama-3.1-70b-versatile", temperature: float = 0.3, **kwargs) -> BaseChatModel:
    """Create a Groq LLM instance with sensible defaults"""
    config = LLMConfig(provider="groq", model=model, temperature=temperature, **kwargs)
    return UnifiedLLMClient.create_llm(config)


def create_openai_llm(model: str = "gpt-4o-mini", temperature: float = 0.3, **kwargs) -> BaseChatModel:
    """Create an OpenAI LLM instance with sensible defaults"""
    config = LLMConfig(provider="openai", model=model, temperature=temperature, **kwargs)
    return UnifiedLLMClient.create_llm(config)


def create_anthropic_llm(model: str = "claude-3-5-sonnet-20241022", temperature: float = 0.3, **kwargs) -> BaseChatModel:
    """Create an Anthropic LLM instance with sensible defaults"""
    config = LLMConfig(provider="anthropic", model=model, temperature=temperature, **kwargs)
    return UnifiedLLMClient.create_llm(config)


# Example usage
if __name__ == "__main__":
    # Example 1: Simple creation with defaults
    groq_llm = create_groq_llm()
    print(f"Created Groq LLM: {groq_llm.model_name}")

    # Example 2: Custom configuration
    config = LLMConfig(
        provider="groq",
        model="mixtral-8x7b-32768",
        temperature=0.5,
        max_tokens=2000
    )
    llm = UnifiedLLMClient.create_llm(config)
    print(f"Created custom LLM: {llm.model_name}")

    # Example 3: Multiple LLMs for different tasks
    llms = UnifiedLLMClient.create_multiple_llms({
        "fast": {"provider": "groq", "model": "llama-3.1-8b-instant"},
        "smart": {"provider": "openai", "model": "gpt-4o"},
        "creative": {"provider": "anthropic", "model": "claude-3-5-sonnet-20241022", "temperature": 0.7}
    })
    print(f"Created {len(llms)} LLMs: {list(llms.keys())}")
