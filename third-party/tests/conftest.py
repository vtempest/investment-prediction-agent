"""
Pytest Configuration and Shared Fixtures
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from typing import Dict, Any
import os


# ============================================================================
# Environment Setup
# ============================================================================

@pytest.fixture(scope="session", autouse=True)
def setup_test_env():
    """Set up test environment variables"""
    os.environ["TESTING"] = "true"
    os.environ["NEWS_RESEARCHER_URL"] = "http://localhost:8002"
    os.environ["DEBATE_ANALYST_URL"] = "http://localhost:8001"
    yield
    # Cleanup
    del os.environ["TESTING"]


# ============================================================================
# Date Fixtures
# ============================================================================

@pytest.fixture
def today():
    """Current date in YYYY-MM-DD format"""
    return datetime.now().strftime("%Y-%m-%d")


@pytest.fixture
def yesterday():
    """Yesterday's date in YYYY-MM-DD format"""
    return (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")


@pytest.fixture
def last_week():
    """Date from one week ago in YYYY-MM-DD format"""
    return (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")


@pytest.fixture
def test_date():
    """Fixed test date for reproducible tests"""
    return "2024-01-15"


@pytest.fixture
def date_range():
    """Test date range for batch operations"""
    return {
        "start": "2024-01-15",
        "end": "2024-01-19"
    }


# ============================================================================
# Stock Symbol Fixtures
# ============================================================================

@pytest.fixture
def single_symbol():
    """Single test stock symbol"""
    return "AAPL"


@pytest.fixture
def multiple_symbols():
    """Multiple test stock symbols"""
    return ["AAPL", "GOOGL", "MSFT"]


@pytest.fixture
def tech_stocks():
    """Tech stock symbols for testing"""
    return ["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA"]


# ============================================================================
# Request/Response Fixtures
# ============================================================================

@pytest.fixture
def news_researcher_analyze_request(single_symbol, test_date):
    """Sample News Researcher analyze request"""
    return {
        "symbols": [single_symbol],
        "date": test_date
    }


@pytest.fixture
def news_researcher_batch_request(multiple_symbols, date_range):
    """Sample News Researcher batch request"""
    return {
        "symbols": multiple_symbols,
        "start_date": date_range["start"],
        "end_date": date_range["end"]
    }


@pytest.fixture
def debate_analyst_analyze_request(single_symbol, test_date):
    """Sample Debate Analyst analyze request"""
    return {
        "symbol": single_symbol,
        "date": test_date,
        "deep_think_llm": "gpt-4o-mini",
        "quick_think_llm": "gpt-4o-mini",
        "max_debate_rounds": 1
    }


@pytest.fixture
def backtest_request(single_symbol):
    """Sample backtest request"""
    return {
        "symbol": single_symbol,
        "data_dir": "./output/csv",
        "printlog": False
    }


@pytest.fixture
def reflection_request():
    """Sample reflection request"""
    return {
        "position_returns": 5.2
    }


# ============================================================================
# Mock Response Fixtures
# ============================================================================

@pytest.fixture
def mock_news_researcher_response(single_symbol, test_date):
    """Mock News Researcher successful response"""
    return {
        "success": True,
        "symbols": [single_symbol],
        "date": test_date,
        "result": {
            "data_collection_results": {},
            "technical_analysis_results": {},
            "news_intelligence_results": {},
            "portfolio_manager_results": {
                "decision": "BUY",
                "confidence": 0.85,
                "reasoning": "Strong technical and fundamental signals"
            }
        },
        "timestamp": datetime.now().isoformat()
    }


@pytest.fixture
def mock_debate_analyst_response(single_symbol, test_date):
    """Mock Debate Analyst successful response"""
    return {
        "success": True,
        "symbol": single_symbol,
        "date": test_date,
        "decision": {
            "action": "BUY",
            "confidence": 0.75,
            "position_size": 0.10,
            "reasoning": "Consensus from debate agents",
            "debate_summary": {
                "bull_arguments": ["Strong fundamentals", "Positive technical indicators"],
                "bear_arguments": ["Market volatility concerns"],
                "risk_assessment": "Moderate risk"
            }
        },
        "timestamp": datetime.now().isoformat()
    }


@pytest.fixture
def mock_backtest_response(single_symbol):
    """Mock backtest successful response"""
    return {
        "success": True,
        "symbol": single_symbol,
        "primo_results": {
            "Starting Portfolio Value [$]": 10000,
            "Final Portfolio Value [$]": 12500,
            "Cumulative Return [%]": 25.0,
            "Annual Return [%]": 15.5,
            "Annual Volatility [%]": 18.2,
            "Sharpe Ratio": 0.85,
            "Max Drawdown [%]": -8.5,
            "Total Trades": 12,
            "Win Rate [%]": 58.3
        },
        "buyhold_results": {
            "Starting Portfolio Value [$]": 10000,
            "Final Portfolio Value [$]": 11500,
            "Cumulative Return [%]": 15.0,
            "Annual Return [%]": 10.2,
            "Annual Volatility [%]": 20.1,
            "Sharpe Ratio": 0.51,
            "Max Drawdown [%]": -12.3,
            "Total Trades": 1,
            "Win Rate [%]": 100.0
        },
        "comparison": {
            "relative_return": 10.0,
            "outperformed": True,
            "metrics": {
                "cumulative_return_diff": 10.0,
                "volatility_diff": -1.9,
                "max_drawdown_diff": 3.8,
                "sharpe_diff": 0.34
            }
        },
        "timestamp": datetime.now().isoformat()
    }


# ============================================================================
# Helper Fixtures
# ============================================================================

@pytest.fixture
def assert_valid_timestamp():
    """Helper to validate ISO timestamp format"""
    def _validate(timestamp_str: str):
        try:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            assert isinstance(dt, datetime)
            return True
        except ValueError:
            return False
    return _validate


@pytest.fixture
def assert_valid_response_structure():
    """Helper to validate common response fields"""
    def _validate(response_data: Dict[str, Any], required_fields: list):
        for field in required_fields:
            assert field in response_data, f"Missing required field: {field}"
        return True
    return _validate


# ============================================================================
# Parametrize Data
# ============================================================================

@pytest.fixture(params=["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA"])
def popular_stock(request):
    """Parametrize popular stock symbols"""
    return request.param


@pytest.fixture(params=[
    {"deep": "gpt-4o-mini", "quick": "gpt-4o-mini"},
    {"deep": "gpt-4o", "quick": "gpt-4o-mini"},
])
def llm_configurations(request):
    """Parametrize LLM configurations"""
    return request.param


@pytest.fixture(params=[1, 2, 3])
def debate_rounds(request):
    """Parametrize debate round counts"""
    return request.param


# ============================================================================
# Marks
# ============================================================================

# Custom markers for test organization
pytest_markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "slow: Slow-running tests",
    "skip: Skip this test"
]
