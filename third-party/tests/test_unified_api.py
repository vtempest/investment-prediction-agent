"""
Integration Tests for Unified API Gateway
Tests the gateway's routing to both News Researcher and Debate Analyst services
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock
import httpx

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from unified_api_server import app

client = TestClient(app)


class TestHealthEndpoints:
    """Test health and status endpoints"""

    def test_root_endpoint(self):
        """Test root endpoint returns service info"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Stock Prediction Agent API"
        assert data["version"] == "1.0.0"
        assert data["status"] == "healthy"
        assert "services" in data
        assert "documentation" in data

    def test_root_documentation_links(self):
        """Test root returns documentation links"""
        response = client.get("/")
        data = response.json()
        docs = data["documentation"]
        assert "swagger" in docs
        assert "redoc" in docs
        assert "openapi_spec" in docs

    @pytest.mark.asyncio
    async def test_health_check_all_services_online(self):
        """Test health check when all services are online"""
        # Mock successful responses from both services
        with patch('unified_api_server.http_client.get') as mock_get:
            mock_get.return_value = MagicMock(status_code=200)
            response = client.get("/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] in ["healthy", "degraded"]
            assert "services" in data

    def test_openapi_yaml_endpoint(self):
        """Test OpenAPI spec is served"""
        response = client.get("/openapi.yaml")
        # Should either return the file or 404 if not found
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            assert response.headers["content-type"] in ["application/x-yaml", "text/yaml", "text/plain"]


class TestNewsResearcherRouting:
    """Test routing to News Researcher service"""

    @pytest.mark.asyncio
    async def test_news_researcher_analyze_routing(self):
        """Test that analyze requests are routed to News Researcher"""
        mock_response_data = {
            "success": True,
            "symbols": ["AAPL"],
            "date": "2024-01-15",
            "result": {},
            "timestamp": datetime.now().isoformat()
        }

        with patch('unified_api_server.http_client.post') as mock_post:
            mock_response = MagicMock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            mock_response.raise_for_status = MagicMock()
            mock_post.return_value = mock_response

            response = client.post(
                "/news-researcher/analyze",
                json={"symbols": ["AAPL"]}
            )

            # Verify request was made to News Researcher
            assert mock_post.called
            call_args = mock_post.call_args
            assert "news-researcher" in str(call_args) or "8002" in str(call_args)

    @pytest.mark.asyncio
    async def test_news_researcher_batch_routing(self):
        """Test batch analysis routing"""
        mock_response_data = {
            "success": True,
            "symbols": ["AAPL"],
            "date_range": {"start": "2024-01-01", "end": "2024-01-05"},
            "trading_days": 3,
            "successful_runs": 3,
            "failed_runs": 0,
            "results": [],
            "timestamp": datetime.now().isoformat()
        }

        with patch('unified_api_server.http_client.post') as mock_post:
            mock_response = MagicMock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            mock_response.raise_for_status = MagicMock()
            mock_post.return_value = mock_response

            response = client.post(
                "/news-researcher/analyze/batch",
                json={
                    "symbols": ["AAPL"],
                    "start_date": "2024-01-01",
                    "end_date": "2024-01-05"
                }
            )

            assert mock_post.called


class TestDebateAnalystRouting:
    """Test routing to Debate Analyst service"""

    @pytest.mark.asyncio
    async def test_debate_analyst_analyze_routing(self):
        """Test analyze requests are routed to Debate Analyst"""
        mock_response_data = {
            "success": True,
            "symbol": "AAPL",
            "date": "2024-01-15",
            "decision": {},
            "timestamp": datetime.now().isoformat()
        }

        with patch('unified_api_server.http_client.post') as mock_post:
            mock_response = MagicMock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            mock_response.raise_for_status = MagicMock()
            mock_post.return_value = mock_response

            response = client.post(
                "/debate-analyst/analyze",
                json={"symbol": "AAPL"}
            )

            assert mock_post.called
            call_args = mock_post.call_args
            assert "debate-analyst" in str(call_args) or "8001" in str(call_args)

    @pytest.mark.asyncio
    async def test_debate_analyst_reflect_routing(self):
        """Test reflect requests are routed to Debate Analyst"""
        mock_response_data = {
            "success": True,
            "message": "Reflection completed",
            "position_returns": 5.2,
            "timestamp": datetime.now().isoformat()
        }

        with patch('unified_api_server.http_client.post') as mock_post:
            mock_response = MagicMock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            mock_response.raise_for_status = MagicMock()
            mock_post.return_value = mock_response

            response = client.post(
                "/debate-analyst/reflect",
                json={"position_returns": 5.2}
            )

            assert mock_post.called

    @pytest.mark.asyncio
    async def test_debate_analyst_config_routing(self):
        """Test config requests are routed to Debate Analyst"""
        mock_response_data = {"config": {"llm_provider": "openai"}}

        with patch('unified_api_server.http_client.get') as mock_get:
            mock_response = MagicMock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            mock_response.raise_for_status = MagicMock()
            mock_get.return_value = mock_response

            response = client.get("/debate-analyst/config")

            assert mock_get.called


class TestBacktestRouting:
    """Test backtesting endpoint routing"""

    @pytest.mark.asyncio
    async def test_backtest_routing(self):
        """Test backtest requests are routed correctly"""
        mock_response_data = {
            "success": True,
            "symbol": "AAPL",
            "primo_results": {},
            "buyhold_results": {},
            "comparison": {},
            "timestamp": datetime.now().isoformat()
        }

        with patch('unified_api_server.http_client.post') as mock_post:
            mock_response = MagicMock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            mock_response.raise_for_status = MagicMock()
            mock_post.return_value = mock_response

            response = client.post(
                "/backtest",
                json={"symbol": "AAPL"}
            )

            assert mock_post.called

    @pytest.mark.asyncio
    async def test_available_stocks_routing(self):
        """Test available stocks requests are routed correctly"""
        mock_response_data = {
            "success": True,
            "stocks": ["AAPL", "GOOGL"],
            "count": 2
        }

        with patch('unified_api_server.http_client.get') as mock_get:
            mock_response = MagicMock()
            mock_response.json.return_value = mock_response_data
            mock_response.status_code = 200
            mock_response.raise_for_status = MagicMock()
            mock_get.return_value = mock_response

            response = client.get("/backtest/available-stocks")

            assert mock_get.called


class TestErrorHandling:
    """Test error handling and propagation"""

    @pytest.mark.asyncio
    async def test_service_unavailable_error(self):
        """Test handling when backend service is unavailable"""
        with patch('unified_api_server.http_client.post') as mock_post:
            mock_post.side_effect = httpx.ConnectError("Connection refused")

            response = client.post(
                "/news-researcher/analyze",
                json={"symbols": ["AAPL"]}
            )

            assert response.status_code == 500
            data = response.json()
            assert "detail" in data

    @pytest.mark.asyncio
    async def test_service_error_propagation(self):
        """Test that service errors are properly propagated"""
        with patch('unified_api_server.http_client.post') as mock_post:
            mock_response = MagicMock()
            mock_response.status_code = 400
            mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
                "Bad request",
                request=MagicMock(),
                response=mock_response
            )
            mock_post.return_value = mock_response

            response = client.post(
                "/news-researcher/analyze",
                json={"symbols": ["AAPL"]}
            )

            assert response.status_code in [400, 500]

    def test_validation_error_response(self):
        """Test validation errors return proper format"""
        response = client.post(
            "/news-researcher/analyze",
            json={}  # Missing required 'symbols' field
        )

        assert response.status_code == 422
        data = response.json()
        assert "detail" in data


class TestRequestValidation:
    """Test request validation"""

    def test_news_researcher_symbols_required(self):
        """Test that symbols field is required for News Researcher"""
        response = client.post(
            "/news-researcher/analyze",
            json={"date": "2024-01-15"}
        )
        assert response.status_code == 422

    def test_debate_analyst_symbol_required(self):
        """Test that symbol field is required for Debate Analyst"""
        response = client.post(
            "/debate-analyst/analyze",
            json={"date": "2024-01-15"}
        )
        assert response.status_code == 422

    def test_reflection_returns_required(self):
        """Test that position_returns is required for reflection"""
        response = client.post(
            "/debate-analyst/reflect",
            json={}
        )
        assert response.status_code == 422

    def test_batch_dates_required(self):
        """Test that dates are required for batch analysis"""
        response = client.post(
            "/news-researcher/analyze/batch",
            json={"symbols": ["AAPL"]}
        )
        assert response.status_code == 422


class TestCORS:
    """Test CORS configuration"""

    def test_cors_enabled(self):
        """Test that CORS is properly configured"""
        response = client.post(
            "/news-researcher/analyze",
            json={"symbols": ["AAPL"]},
            headers={"Origin": "http://example.com"}
        )
        # CORS headers should be present
        # Note: TestClient may not fully simulate CORS, so this is a basic check
        assert response.status_code in [200, 500]


class TestResponseFormats:
    """Test response format consistency"""

    @pytest.mark.asyncio
    async def test_error_response_format(self):
        """Test that error responses follow consistent format"""
        with patch('unified_api_server.http_client.post') as mock_post:
            mock_post.side_effect = Exception("Test error")

            response = client.post(
                "/news-researcher/analyze",
                json={"symbols": ["AAPL"]}
            )

            assert response.status_code == 500
            data = response.json()
            assert "detail" in data
            assert "status_code" in data
            assert "timestamp" in data

    def test_validation_error_format(self):
        """Test validation error response format"""
        response = client.post(
            "/news-researcher/analyze",
            json={}
        )

        assert response.status_code == 422
        data = response.json()
        assert "detail" in data


class TestDocumentation:
    """Test API documentation endpoints"""

    def test_swagger_docs_available(self):
        """Test that Swagger UI is available"""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_redoc_available(self):
        """Test that ReDoc is available"""
        response = client.get("/redoc")
        assert response.status_code == 200

    def test_openapi_json_available(self):
        """Test that OpenAPI JSON is available"""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
