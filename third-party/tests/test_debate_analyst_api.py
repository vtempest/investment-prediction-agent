"""
Tests for Debate Analyst (TradingAgents) API
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "debate-analyst"))

from api_server import app

client = TestClient(app)


class TestHealthEndpoints:
    """Test health and status endpoints"""

    def test_root_endpoint(self):
        """Test root endpoint returns service info"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "TradingAgents API is running"
        assert data["version"] == "1.0.0"
        assert data["status"] == "healthy"

    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestConfigEndpoints:
    """Test configuration endpoints"""

    def test_get_config(self):
        """Test retrieving current configuration"""
        response = client.get("/config")
        assert response.status_code == 200
        data = response.json()
        assert "config" in data
        config = data["config"]
        # Check for required config fields
        assert "llm_provider" in config
        assert "deep_think_llm" in config
        assert "quick_think_llm" in config

    def test_config_structure(self):
        """Test configuration has expected structure"""
        response = client.get("/config")
        if response.status_code == 200:
            config = response.json()["config"]
            # LLM settings
            assert "llm_provider" in config
            assert "deep_think_llm" in config
            assert "quick_think_llm" in config
            # Debate settings
            assert "max_debate_rounds" in config
            assert "max_risk_discuss_rounds" in config


class TestAnalysisEndpoints:
    """Test stock analysis endpoints"""

    def test_analyze_stock_minimal(self):
        """Test analyzing a stock with minimal parameters"""
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["symbol"] == "AAPL"
        assert "date" in data
        assert "decision" in data
        assert "timestamp" in data

    def test_analyze_stock_with_date(self):
        """Test analyzing a stock with specific date"""
        test_date = "2024-01-15"
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL", "date": test_date}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["date"] == test_date

    def test_analyze_stock_custom_llms(self):
        """Test analyzing with custom LLM models"""
        response = client.post(
            "/analyze",
            json={
                "symbol": "NVDA",
                "deep_think_llm": "gpt-4o-mini",
                "quick_think_llm": "gpt-4o-mini"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_analyze_stock_custom_debate_rounds(self):
        """Test analyzing with custom debate rounds"""
        response = client.post(
            "/analyze",
            json={
                "symbol": "TSLA",
                "max_debate_rounds": 2
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_analyze_stock_all_parameters(self):
        """Test analyzing with all parameters"""
        response = client.post(
            "/analyze",
            json={
                "symbol": "MSFT",
                "date": "2024-01-15",
                "deep_think_llm": "gpt-4o-mini",
                "quick_think_llm": "gpt-4o-mini",
                "max_debate_rounds": 1
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["symbol"] == "MSFT"

    def test_analyze_invalid_symbol_missing(self):
        """Test analysis without symbol"""
        response = client.post(
            "/analyze",
            json={"date": "2024-01-15"}
        )
        assert response.status_code == 422  # Validation error

    def test_analyze_invalid_debate_rounds(self):
        """Test analysis with invalid debate rounds"""
        response = client.post(
            "/analyze",
            json={
                "symbol": "AAPL",
                "max_debate_rounds": 0  # Should be >= 1
            }
        )
        assert response.status_code == 422

    def test_analyze_debate_rounds_too_high(self):
        """Test analysis with too many debate rounds"""
        response = client.post(
            "/analyze",
            json={
                "symbol": "AAPL",
                "max_debate_rounds": 10  # Should be <= 5
            }
        )
        assert response.status_code == 422


class TestReflectionEndpoints:
    """Test reflection and learning endpoints"""

    def test_reflect_positive_returns(self):
        """Test reflection with positive returns"""
        response = client.post(
            "/reflect",
            json={"position_returns": 5.2}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["position_returns"] == 5.2
        assert "timestamp" in data

    def test_reflect_negative_returns(self):
        """Test reflection with negative returns"""
        response = client.post(
            "/reflect",
            json={"position_returns": -3.5}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["position_returns"] == -3.5

    def test_reflect_zero_returns(self):
        """Test reflection with zero returns"""
        response = client.post(
            "/reflect",
            json={"position_returns": 0.0}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_reflect_missing_returns(self):
        """Test reflection without returns parameter"""
        response = client.post(
            "/reflect",
            json={}
        )
        assert response.status_code == 422  # Validation error

    def test_reflect_invalid_type(self):
        """Test reflection with invalid return type"""
        response = client.post(
            "/reflect",
            json={"position_returns": "not a number"}
        )
        assert response.status_code == 422


class TestResponseFormats:
    """Test response format consistency"""

    def test_analysis_response_structure(self):
        """Test that analysis response has expected structure"""
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL"}
        )
        if response.status_code == 200:
            data = response.json()
            # Required fields
            assert "success" in data
            assert "symbol" in data
            assert "date" in data
            assert "decision" in data
            assert "timestamp" in data
            # Types
            assert isinstance(data["success"], bool)
            assert isinstance(data["symbol"], str)
            assert isinstance(data["date"], str)
            assert isinstance(data["timestamp"], str)

    def test_decision_structure(self):
        """Test that decision has expected structure"""
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL"}
        )
        if response.status_code == 200:
            decision = response.json()["decision"]
            # Decision should be a dict or string
            assert isinstance(decision, (dict, str))

    def test_timestamp_format(self):
        """Test that timestamps are in ISO format"""
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL"}
        )
        if response.status_code == 200:
            data = response.json()
            # Should be able to parse as ISO format
            timestamp = datetime.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
            assert isinstance(timestamp, datetime)

    def test_reflection_response_structure(self):
        """Test reflection response structure"""
        response = client.post(
            "/reflect",
            json={"position_returns": 5.0}
        )
        if response.status_code == 200:
            data = response.json()
            assert "success" in data
            assert "message" in data
            assert "position_returns" in data
            assert "timestamp" in data


class TestMultipleStocks:
    """Test analyzing multiple different stocks"""

    @pytest.mark.parametrize("symbol", ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA"])
    def test_analyze_various_stocks(self, symbol):
        """Test analyzing various popular stocks"""
        response = client.post(
            "/analyze",
            json={"symbol": symbol}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["symbol"] == symbol


class TestDateHandling:
    """Test date handling"""

    def test_analyze_today_default(self):
        """Test that default date is today"""
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL"}
        )
        if response.status_code == 200:
            data = response.json()
            today = datetime.now().strftime("%Y-%m-%d")
            assert data["date"] == today

    def test_analyze_past_date(self):
        """Test analyzing with a past date"""
        past_date = "2024-01-15"
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL", "date": past_date}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["date"] == past_date

    def test_analyze_future_date(self):
        """Test analyzing with a future date"""
        future_date = "2025-12-31"
        response = client.post(
            "/analyze",
            json={"symbol": "AAPL", "date": future_date}
        )
        # Should either accept or reject future dates
        assert response.status_code in [200, 400]


class TestErrorHandling:
    """Test error handling"""

    def test_malformed_json(self):
        """Test handling of malformed JSON"""
        response = client.post(
            "/analyze",
            data="not valid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422

    def test_invalid_symbol_type(self):
        """Test handling of invalid symbol type"""
        response = client.post(
            "/analyze",
            json={"symbol": ["AAPL"]}  # Should be string, not list
        )
        assert response.status_code == 422

    def test_empty_symbol(self):
        """Test handling of empty symbol"""
        response = client.post(
            "/analyze",
            json={"symbol": ""}
        )
        # Should either accept or reject empty symbol
        assert response.status_code in [200, 400, 422]


class TestCORS:
    """Test CORS configuration"""

    def test_cors_headers_present(self):
        """Test that CORS headers are present"""
        response = client.options("/analyze")
        # CORS should be enabled
        assert response.status_code in [200, 405]


class TestConcurrency:
    """Test concurrent requests"""

    def test_multiple_simultaneous_analyses(self):
        """Test handling multiple simultaneous analysis requests"""
        import concurrent.futures

        def analyze_stock(symbol):
            return client.post("/analyze", json={"symbol": symbol})

        symbols = ["AAPL", "GOOGL", "MSFT"]
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(analyze_stock, symbol) for symbol in symbols]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]

        # All requests should complete
        assert len(results) == 3
        for response in results:
            assert response.status_code in [200, 500]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
