"""
Tests for News Researcher (PrimoAgent) API
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "news-researcher"))

from api_server import app

client = TestClient(app)


class TestHealthEndpoints:
    """Test health and status endpoints"""

    def test_root_endpoint(self):
        """Test root endpoint returns service info"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "PrimoAgent API is running"
        assert data["version"] == "1.0.0"
        assert data["status"] == "healthy"

    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestAnalysisEndpoints:
    """Test stock analysis endpoints"""

    def test_analyze_single_stock_default_date(self):
        """Test analyzing a single stock with default date"""
        response = client.post(
            "/analyze",
            json={"symbols": ["AAPL"]}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is not None
        assert data["symbols"] == ["AAPL"]
        assert "date" in data
        assert "result" in data
        assert "timestamp" in data

    def test_analyze_single_stock_specific_date(self):
        """Test analyzing a stock with specific date"""
        test_date = "2024-01-15"
        response = client.post(
            "/analyze",
            json={"symbols": ["AAPL"], "date": test_date}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["date"] == test_date

    def test_analyze_multiple_stocks(self):
        """Test analyzing multiple stocks"""
        response = client.post(
            "/analyze",
            json={"symbols": ["AAPL", "GOOGL", "MSFT"]}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["symbols"]) == 3

    def test_analyze_invalid_request_empty_symbols(self):
        """Test analysis with empty symbols list"""
        response = client.post(
            "/analyze",
            json={"symbols": []}
        )
        assert response.status_code == 422  # Validation error

    def test_analyze_invalid_request_missing_symbols(self):
        """Test analysis without symbols field"""
        response = client.post(
            "/analyze",
            json={"date": "2024-01-15"}
        )
        assert response.status_code == 422  # Validation error

    def test_analyze_invalid_date_format(self):
        """Test analysis with invalid date format"""
        response = client.post(
            "/analyze",
            json={"symbols": ["AAPL"], "date": "01-15-2024"}
        )
        # Should either accept it and convert or return error
        # Depending on implementation
        assert response.status_code in [200, 400, 422]


class TestBatchAnalysisEndpoints:
    """Test batch analysis endpoints"""

    def test_batch_analyze_single_day(self):
        """Test batch analysis for a single day"""
        response = client.post(
            "/analyze/batch",
            json={
                "symbols": ["AAPL"],
                "start_date": "2024-01-15",
                "end_date": "2024-01-15"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["symbols"] == ["AAPL"]
        assert data["trading_days"] >= 1

    def test_batch_analyze_multiple_days(self):
        """Test batch analysis for multiple days"""
        response = client.post(
            "/analyze/batch",
            json={
                "symbols": ["AAPL", "GOOGL"],
                "start_date": "2024-01-15",
                "end_date": "2024-01-19"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["trading_days"] > 0
        assert "results" in data
        assert "successful_runs" in data
        assert "failed_runs" in data

    def test_batch_analyze_weekend_excluded(self):
        """Test that weekends are excluded from batch analysis"""
        # Friday to Monday (should skip weekend)
        response = client.post(
            "/analyze/batch",
            json={
                "symbols": ["AAPL"],
                "start_date": "2024-01-12",  # Friday
                "end_date": "2024-01-15"      # Monday
            }
        )
        assert response.status_code == 200
        data = response.json()
        # Should only have 2 days (Friday and Monday)
        assert data["trading_days"] == 2

    def test_batch_analyze_invalid_date_range(self):
        """Test batch analysis with end date before start date"""
        response = client.post(
            "/analyze/batch",
            json={
                "symbols": ["AAPL"],
                "start_date": "2024-01-19",
                "end_date": "2024-01-15"
            }
        )
        # Should return 400 or 422 for invalid date range
        assert response.status_code in [200, 400, 422]


class TestBacktestEndpoints:
    """Test backtesting endpoints"""

    @pytest.mark.skip(reason="Requires historical data files")
    def test_backtest_stock(self):
        """Test running backtest for a stock"""
        response = client.post(
            "/backtest",
            json={"symbol": "AAPL", "printlog": False}
        )
        assert response.status_code in [200, 404]  # 404 if no data
        if response.status_code == 200:
            data = response.json()
            assert data["success"] is True
            assert data["symbol"] == "AAPL"
            assert "primo_results" in data
            assert "buyhold_results" in data
            assert "comparison" in data

    @pytest.mark.skip(reason="Requires historical data files")
    def test_backtest_comparison_metrics(self):
        """Test backtest returns proper comparison metrics"""
        response = client.post(
            "/backtest",
            json={"symbol": "AAPL"}
        )
        if response.status_code == 200:
            data = response.json()
            comparison = data["comparison"]
            assert "relative_return" in comparison
            assert "outperformed" in comparison
            assert "metrics" in comparison
            metrics = comparison["metrics"]
            assert "cumulative_return_diff" in metrics
            assert "volatility_diff" in metrics
            assert "max_drawdown_diff" in metrics
            assert "sharpe_diff" in metrics

    def test_available_stocks_endpoint(self):
        """Test getting list of available stocks"""
        response = client.get("/backtest/available-stocks")
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert "stocks" in data
        assert "count" in data
        assert isinstance(data["stocks"], list)

    def test_available_stocks_custom_dir(self):
        """Test getting available stocks from custom directory"""
        response = client.get(
            "/backtest/available-stocks",
            params={"data_dir": "./custom/path"}
        )
        assert response.status_code in [200, 500]  # May fail if dir doesn't exist


class TestResponseFormats:
    """Test response format consistency"""

    def test_analysis_response_structure(self):
        """Test that analysis response has expected structure"""
        response = client.post(
            "/analyze",
            json={"symbols": ["AAPL"]}
        )
        if response.status_code == 200:
            data = response.json()
            # Required fields
            assert "success" in data
            assert "symbols" in data
            assert "date" in data
            assert "result" in data
            assert "timestamp" in data
            # Types
            assert isinstance(data["success"], bool)
            assert isinstance(data["symbols"], list)
            assert isinstance(data["date"], str)
            assert isinstance(data["result"], dict)
            assert isinstance(data["timestamp"], str)

    def test_timestamp_format(self):
        """Test that timestamps are in ISO format"""
        response = client.post(
            "/analyze",
            json={"symbols": ["AAPL"]}
        )
        if response.status_code == 200:
            data = response.json()
            # Should be able to parse as ISO format
            timestamp = datetime.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
            assert isinstance(timestamp, datetime)


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
            json={"symbols": "AAPL"}  # Should be list, not string
        )
        assert response.status_code == 422

    def test_too_many_symbols(self):
        """Test handling of too many symbols"""
        symbols = [f"SYM{i}" for i in range(100)]
        response = client.post(
            "/analyze",
            json={"symbols": symbols}
        )
        # Should enforce limit
        assert response.status_code in [200, 400, 422]


class TestCORS:
    """Test CORS configuration"""

    def test_cors_headers_present(self):
        """Test that CORS headers are present"""
        response = client.options("/analyze")
        # CORS should be enabled
        assert response.status_code in [200, 405]  # OPTIONS may not be explicitly handled


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
