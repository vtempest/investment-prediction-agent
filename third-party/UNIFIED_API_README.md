# Unified LLM API for Stock Prediction Agents

This document describes the unified API layer that abstracts LLM provider implementations across all agent systems.

## Overview

The `unified_llm_client.py` module provides a consistent interface for multiple LLM providers, enabling seamless switching between providers without code changes. All agents now use this unified client for LLM interactions.

## Supported Providers

| Provider | Speed | Cost | Best For | Models Available |
|----------|-------|------|----------|-----------------|
| **Groq** | ⚡️ Very Fast | 💰 Low | High-throughput tasks | llama-3.1-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768 |
| **OpenAI** | Fast | High | Advanced reasoning | gpt-4o, gpt-4o-mini, o1-mini, o1-preview |
| **Anthropic** | Fast | High | Analysis & research | claude-3-5-sonnet-20241022, claude-3-5-haiku-20241022 |
| **Google** | Fast | Medium | Multimodal tasks | gemini-1.5-pro, gemini-1.5-flash |
| **Ollama** | Variable | Free | Local deployment | llama3.1, mistral, codellama |
| **OpenRouter** | Variable | Variable | Access to many models | Various open & closed models |

## Installation

The unified API requires the following dependencies:

```bash
# Core dependencies (already in requirements.txt)
pip install langchain>=0.3.25
pip install langchain-core>=0.3.65
pip install langchain-openai
pip install langchain-anthropic>=0.2.0
pip install langchain-google-genai
pip install langchain-groq>=0.1.0  # NEW!
```

## Environment Variables

Set API keys for the providers you want to use:

```bash
# OpenAI
export OPENAI_API_KEY="sk-..."

# Groq (recommended for fast inference)
export GROQ_API_KEY="gsk_..."

# Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# Google
export GOOGLE_API_KEY="AIza..."

# OpenRouter
export OPENROUTER_API_KEY="sk-or-..."

# Ollama (runs locally, no key needed)
# Just ensure Ollama server is running: ollama serve
```

## Usage Examples

### 1. Basic Usage - Single LLM

```python
from unified_llm_client import UnifiedLLMClient, LLMConfig

# Create a Groq LLM (fast & cheap)
config = LLMConfig(
    provider="groq",
    model="llama-3.1-70b-versatile",
    temperature=0.3
)
llm = UnifiedLLMClient.create_llm(config)

# Use it
response = llm.invoke("What are the current market trends?")
print(response.content)
```

### 2. Convenience Functions

```python
from unified_llm_client import create_groq_llm, create_anthropic_llm

# Quick Groq instance
groq_llm = create_groq_llm(model="llama-3.1-8b-instant")

# Quick Anthropic instance
claude_llm = create_anthropic_llm(model="claude-3-5-sonnet-20241022")
```

### 3. Multiple LLMs for Different Tasks

```python
from unified_llm_client import UnifiedLLMClient

llms = UnifiedLLMClient.create_multiple_llms({
    # Fast LLM for quick analysis
    "fast": {
        "provider": "groq",
        "model": "llama-3.1-8b-instant",
        "temperature": 0.2
    },
    # Smart LLM for complex reasoning
    "smart": {
        "provider": "openai",
        "model": "gpt-4o",
        "temperature": 0.3
    },
    # Creative LLM for report generation
    "creative": {
        "provider": "anthropic",
        "model": "claude-3-5-sonnet-20241022",
        "temperature": 0.7
    }
})

# Use different LLMs for different tasks
quick_analysis = llms["fast"].invoke("Summarize this data...")
deep_analysis = llms["smart"].invoke("Analyze complex patterns...")
report = llms["creative"].invoke("Generate a detailed report...")
```

### 4. Custom Configuration with All Options

```python
config = LLMConfig(
    provider="groq",
    model="llama-3.1-70b-versatile",
    temperature=0.5,
    max_tokens=2000,
    api_key="gsk_...",  # Optional: falls back to env var
    base_url=None,      # Optional: custom endpoint
    timeout=60          # Request timeout in seconds
)
llm = UnifiedLLMClient.create_llm(config)
```

## Agent Integration

### News Researcher Agent

The News Researcher uses the unified client through its `ModelFactory`. Configuration is in `agents/news-researcher/src/config/config.json`:

```json
{
  "models": {
    "portfolio_manager": {
      "provider": "groq",
      "model": "llama-3.1-70b-versatile",
      "temperature": 0.3
    },
    "nlp_features": {
      "provider": "groq",
      "model": "llama-3.1-70b-versatile",
      "temperature": 0.3
    },
    "assess_significance": {
      "provider": "groq",
      "model": "llama-3.1-8b-instant",
      "temperature": 0.3
    }
  }
}
```

### Debate Analyst Agent

The Debate Analyst uses the unified client in its graph setup. Configuration is in `agents/debate-analyst/tradingagents/default_config.py`:

```python
DEFAULT_CONFIG = {
    # Use Groq for fast inference
    "llm_provider": "groq",
    "deep_think_llm": "llama-3.1-70b-versatile",
    "quick_think_llm": "llama-3.1-8b-instant",
    "backend_url": None,
    "temperature": 0.3,

    # Or use OpenAI
    # "llm_provider": "openai",
    # "deep_think_llm": "o1-mini",
    # "quick_think_llm": "gpt-4o-mini",
    # "backend_url": "https://api.openai.com/v1",

    # Or use Anthropic
    # "llm_provider": "anthropic",
    # "deep_think_llm": "claude-3-5-sonnet-20241022",
    # "quick_think_llm": "claude-3-5-haiku-20241022",
}
```

## Provider-Specific Features

### Groq - High Performance Inference

**Advantages:**
- ⚡️ Extremely fast inference (up to 500 tokens/sec)
- 💰 Very cost-effective
- 🔧 Great for production workloads

**Best Models:**
- `llama-3.1-70b-versatile` - Best for complex analysis
- `llama-3.1-8b-instant` - Best for quick responses
- `mixtral-8x7b-32768` - Best for long context

**Example:**
```python
config = LLMConfig(
    provider="groq",
    model="llama-3.1-70b-versatile",
    temperature=0.3
)
```

### OpenAI - Advanced Reasoning

**Advantages:**
- 🧠 Most advanced reasoning capabilities
- 📊 Excellent for complex financial analysis
- 🔬 Best-in-class performance

**Best Models:**
- `o1-mini` - Best for reasoning tasks
- `gpt-4o` - Best for general intelligence
- `gpt-4o-mini` - Best for cost-efficient tasks

### Anthropic - Research & Analysis

**Advantages:**
- 📖 Excellent long-form analysis
- 🎯 Strong factual accuracy
- 🔍 Great for research tasks

**Best Models:**
- `claude-3-5-sonnet-20241022` - Best overall
- `claude-3-5-haiku-20241022` - Best for speed

### Ollama - Local Deployment

**Advantages:**
- 🏠 Runs locally, no API costs
- 🔒 Complete data privacy
- ⚙️ Full control over models

**Setup:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.1

# Start server
ollama serve
```

**Example:**
```python
config = LLMConfig(
    provider="ollama",
    model="llama3.1",
    base_url="http://localhost:11434/v1"
)
```

## Performance Recommendations

### For Production Trading Agents

**Recommended Setup:**
```python
llms = {
    # Fast Groq for quick analysis & data processing
    "quick": create_groq_llm("llama-3.1-8b-instant", temperature=0.2),

    # Smart OpenAI for complex reasoning
    "deep": create_openai_llm("o1-mini", temperature=0.3),

    # Anthropic for research & reports
    "research": create_anthropic_llm("claude-3-5-sonnet-20241022", temperature=0.3)
}
```

### For Development & Testing

**Recommended Setup:**
```python
# Use Groq for everything (fast & cheap)
llms = {
    "quick": create_groq_llm("llama-3.1-8b-instant"),
    "deep": create_groq_llm("llama-3.1-70b-versatile")
}
```

### For Cost Optimization

**Lowest Cost Setup:**
```python
# Use Ollama locally (free)
config = LLMConfig(
    provider="ollama",
    model="llama3.1",
    base_url="http://localhost:11434/v1"
)
llm = UnifiedLLMClient.create_llm(config)
```

## Migration Guide

### From Direct OpenAI Calls

**Before:**
```python
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)
```

**After:**
```python
from unified_llm_client import create_openai_llm
llm = create_openai_llm("gpt-4o-mini", temperature=0.3)

# Or switch to Groq for faster inference
from unified_llm_client import create_groq_llm
llm = create_groq_llm("llama-3.1-70b-versatile", temperature=0.3)
```

### From Provider-Specific Code

**Before:**
```python
if provider == "openai":
    llm = ChatOpenAI(model=model)
elif provider == "anthropic":
    llm = ChatAnthropic(model=model)
# ... many else-if statements
```

**After:**
```python
from unified_llm_client import UnifiedLLMClient, LLMConfig
config = LLMConfig(provider=provider, model=model)
llm = UnifiedLLMClient.create_llm(config)
```

## API Reference

### `UnifiedLLMClient`

Main factory class for creating LLM instances.

**Methods:**

- `create_llm(config)` - Create single LLM instance
- `create_multiple_llms(configs)` - Create multiple LLMs
- `get_available_providers()` - List supported providers
- `get_default_model(provider)` - Get default model for provider

### `LLMConfig`

Configuration object for LLM instances.

**Parameters:**

- `provider` (str, required) - Provider name
- `model` (str, required) - Model ID/name
- `temperature` (float, default=0.3) - Sampling temperature (0.0-2.0)
- `max_tokens` (int, optional) - Max tokens in response
- `api_key` (str, optional) - API key (falls back to env var)
- `base_url` (str, optional) - Custom API endpoint
- `timeout` (int, default=60) - Request timeout in seconds

### Convenience Functions

- `create_groq_llm(model, temperature, **kwargs)` - Quick Groq instance
- `create_openai_llm(model, temperature, **kwargs)` - Quick OpenAI instance
- `create_anthropic_llm(model, temperature, **kwargs)` - Quick Anthropic instance

## Troubleshooting

### Issue: Import Error

**Error:** `ModuleNotFoundError: No module named 'unified_llm_client'`

**Solution:** The module uses dynamic path resolution. Ensure you're importing from an agent directory that properly sets up the path:

```python
import sys
from pathlib import Path
agents_dir = Path(__file__).parent.parent  # Adjust as needed
sys.path.insert(0, str(agents_dir))
from unified_llm_client import UnifiedLLMClient
```

### Issue: API Key Not Found

**Error:** `ValueError: API key required`

**Solution:** Set the appropriate environment variable:
```bash
export GROQ_API_KEY="gsk_..."
export OPENAI_API_KEY="sk-..."
```

### Issue: Groq Rate Limits

**Error:** `RateLimitError: Rate limit exceeded`

**Solution:**
1. Add retry logic in your code
2. Use multiple API keys in rotation
3. Implement exponential backoff
4. Consider upgrading to paid tier

### Issue: Slow Response Times

**Solution:**
1. Use Groq for faster inference
2. Reduce `max_tokens` parameter
3. Use lighter models (e.g., `llama-3.1-8b-instant`)
4. Enable streaming for long responses

## Best Practices

1. **Use Fast Models for Quick Tasks**: Use Groq's `llama-3.1-8b-instant` for data processing
2. **Use Smart Models for Complex Analysis**: Use OpenAI's `o1-mini` or Anthropic's Claude for reasoning
3. **Cache Responses**: Implement caching for repeated queries
4. **Handle Errors Gracefully**: All provider APIs can fail - implement retry logic
5. **Monitor Costs**: Track API usage, especially for OpenAI/Anthropic
6. **Use Async When Possible**: Leverage `ainvoke()` for concurrent operations
7. **Test with Different Providers**: Different models have different strengths

## Example: Complete Trading Agent Setup

```python
from unified_llm_client import UnifiedLLMClient

# Create multi-tier LLM setup
llms = UnifiedLLMClient.create_multiple_llms({
    # Tier 1: Fast processing (Groq)
    "data_analysis": {
        "provider": "groq",
        "model": "llama-3.1-8b-instant",
        "temperature": 0.2,
    },

    # Tier 2: Smart analysis (Groq)
    "technical_analysis": {
        "provider": "groq",
        "model": "llama-3.1-70b-versatile",
        "temperature": 0.3,
    },

    # Tier 3: Deep reasoning (OpenAI)
    "trading_decision": {
        "provider": "openai",
        "model": "o1-mini",
        "temperature": 0.3,
    },

    # Tier 4: Research & reporting (Anthropic)
    "market_research": {
        "provider": "anthropic",
        "model": "claude-3-5-sonnet-20241022",
        "temperature": 0.5,
    }
})

# Use in trading pipeline
data = llms["data_analysis"].invoke("Analyze market data...")
technical = llms["technical_analysis"].invoke("Technical indicators...")
decision = llms["trading_decision"].invoke("Trading decision...")
report = llms["market_research"].invoke("Generate report...")
```

## Contributing

When adding new providers:

1. Add provider to `DEFAULT_MODELS` dict
2. Add environment variable mapping to `ENV_KEY_MAP`
3. Implement provider-specific initialization in `create_llm()`
4. Update documentation
5. Add tests

## License

Part of the Stock Prediction Agent project.
