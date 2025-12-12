# Stock Prediction Agent API Tests

Comprehensive test suite for the Stock Prediction Agent unified API and individual agent services.

## Overview

This test suite provides:
- **Unit Tests**: Individual API endpoint testing
- **Integration Tests**: Multi-service workflow testing
- **API Contract Tests**: OpenAPI specification validation
- **Performance Tests**: Load and response time testing
- **Error Handling Tests**: Edge case and failure scenario testing

## Test Structure

```
tests/
├── conftest.py                    # Shared pytest fixtures and configuration
├── pytest.ini                     # Pytest configuration
├── requirements-test.txt          # Testing dependencies
├── test_news_researcher_api.py    # News Researcher (PrimoAgent) tests
├── test_debate_analyst_api.py     # Debate Analyst (TradingAgents) tests
├── test_unified_api.py            # Unified API Gateway tests
└── README.md                      # This file
```

## Installation

### 1. Install Test Dependencies

```bash
cd agents/tests
pip install -r requirements-test.txt
```

### 2. Set Up Environment Variables

```bash
# News Researcher service URL
export NEWS_RESEARCHER_URL="http://localhost:8002"

# Debate Analyst service URL
export DEBATE_ANALYST_URL="http://localhost:8001"

# Optional: API keys for LLM providers
export OPENAI_API_KEY="sk-..."
export GROQ_API_KEY="gsk_..."
export ANTHROPIC_API_KEY="sk-ant-..."
```

## Running Tests

### Run All Tests

```bash
pytest
```

### Run Specific Test Files

```bash
# News Researcher tests only
pytest test_news_researcher_api.py

# Debate Analyst tests only
pytest test_debate_analyst_api.py

# Unified API tests only
pytest test_unified_api.py
```

### Run Specific Test Classes

```bash
# Health check tests
pytest test_unified_api.py::TestHealthEndpoints

# Analysis endpoint tests
pytest test_news_researcher_api.py::TestAnalysisEndpoints
```

### Run Specific Tests

```bash
# Single test
pytest test_unified_api.py::TestHealthEndpoints::test_root_endpoint

# Tests matching pattern
pytest -k "health"
```

### Run with Coverage

```bash
# Generate coverage report
pytest --cov=. --cov-report=html

# View coverage report
open htmlcov/index.html
```

### Run with Markers

```bash
# Run only integration tests
pytest -m integration

# Skip slow tests
pytest -m "not slow"

# Run unit tests only
pytest -m unit
```

## Test Categories

### 1. Health & Status Tests

Test service availability and health endpoints.

```bash
pytest -k "health"
```

**Coverage:**
- Service online/offline detection
- Health check response format
- Status endpoint availability

### 2. Analysis Tests

Test stock analysis functionality for both agents.

```bash
pytest -k "analyze"
```

**Coverage:**
- Single stock analysis
- Multiple stock analysis
- Custom LLM configuration
- Date handling
- Request validation

### 3. Batch Processing Tests

Test batch analysis across multiple dates.

```bash
pytest test_news_researcher_api.py::TestBatchAnalysisEndpoints
```

**Coverage:**
- Multi-date processing
- Weekend exclusion
- Parallel execution
- Error aggregation

### 4. Backtesting Tests

Test historical backtesting functionality.

```bash
pytest -k "backtest"
```

**Coverage:**
- Strategy comparison
- Performance metrics
- Available stocks listing
- Data loading

### 5. Reflection Tests

Test learning and memory updates (Debate Analyst).

```bash
pytest test_debate_analyst_api.py::TestReflectionEndpoints
```

**Coverage:**
- Positive returns reflection
- Negative returns reflection
- Memory persistence

### 6. Error Handling Tests

Test error scenarios and edge cases.

```bash
pytest -k "error or invalid"
```

**Coverage:**
- Malformed requests
- Missing required fields
- Invalid data types
- Service failures
- Network errors

## Test Fixtures

### Date Fixtures
- `today`: Current date
- `yesterday`: Yesterday's date
- `test_date`: Fixed test date (2024-01-15)
- `date_range`: Test date range

### Symbol Fixtures
- `single_symbol`: "AAPL"
- `multiple_symbols`: ["AAPL", "GOOGL", "MSFT"]
- `tech_stocks`: Extended tech stock list

### Request Fixtures
- `news_researcher_analyze_request`
- `debate_analyst_analyze_request`
- `backtest_request`
- `reflection_request`

### Mock Response Fixtures
- `mock_news_researcher_response`
- `mock_debate_analyst_response`
- `mock_backtest_response`

## Writing New Tests

### Test Template

```python
import pytest
from fastapi.testclient import TestClient

class TestNewFeature:
    """Test description"""

    def test_basic_functionality(self, single_symbol, test_date):
        """Test basic case"""
        response = client.post(
            "/endpoint",
            json={"symbol": single_symbol, "date": test_date}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_error_handling(self):
        """Test error case"""
        response = client.post(
            "/endpoint",
            json={"invalid": "data"}
        )
        assert response.status_code == 422

    @pytest.mark.parametrize("symbol", ["AAPL", "GOOGL", "MSFT"])
    def test_multiple_symbols(self, symbol):
        """Test with multiple symbols"""
        response = client.post(
            "/endpoint",
            json={"symbol": symbol}
        )
        assert response.status_code == 200
```

### Using Fixtures

```python
def test_with_fixtures(
    self,
    single_symbol,
    test_date,
    mock_news_researcher_response
):
    """Test using fixtures"""
    # Use fixtures in your test
    assert single_symbol == "AAPL"
    assert test_date == "2024-01-15"
```

### Parametrized Tests

```python
@pytest.mark.parametrize("symbol,expected", [
    ("AAPL", 200),
    ("INVALID", 400),
    ("", 422)
])
def test_symbol_validation(self, symbol, expected):
    """Test symbol validation"""
    response = client.post("/analyze", json={"symbol": symbol})
    assert response.status_code == expected
```

## Test Best Practices

### 1. Test Naming

```python
# Good - descriptive names
def test_analyze_stock_returns_valid_decision(self):
    ...

def test_analyze_invalid_symbol_returns_422(self):
    ...

# Bad - vague names
def test_analyze(self):
    ...

def test_1(self):
    ...
```

### 2. Arrange-Act-Assert Pattern

```python
def test_example(self):
    # Arrange - Set up test data
    request_data = {"symbol": "AAPL"}

    # Act - Perform action
    response = client.post("/analyze", json=request_data)

    # Assert - Verify results
    assert response.status_code == 200
    assert response.json()["success"] is True
```

### 3. Use Fixtures for Reusability

```python
# Create fixture
@pytest.fixture
def sample_request():
    return {"symbol": "AAPL", "date": "2024-01-15"}

# Use in tests
def test_endpoint(self, sample_request):
    response = client.post("/analyze", json=sample_request)
    assert response.status_code == 200
```

### 4. Test One Thing

```python
# Good - focused test
def test_returns_correct_status_code(self):
    response = client.get("/health")
    assert response.status_code == 200

def test_returns_correct_structure(self):
    response = client.get("/health")
    data = response.json()
    assert "status" in data

# Bad - testing multiple things
def test_health_endpoint(self):
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "healthy"
    # ... many more assertions
```

### 5. Use Markers for Organization

```python
@pytest.mark.integration
def test_full_workflow(self):
    """Integration test for complete workflow"""
    ...

@pytest.mark.slow
def test_batch_processing(self):
    """Test that takes significant time"""
    ...

@pytest.mark.skip(reason="Requires external service")
def test_external_api(self):
    """Test requiring external dependency"""
    ...
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install -r agents/tests/requirements-test.txt

      - name: Run tests
        run: |
          cd agents/tests
          pytest --cov=. --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
```

## Troubleshooting

### Tests Failing Due to Service Not Running

**Error:** Connection refused to localhost:8001 or localhost:8002

**Solution:**
```bash
# Start News Researcher service
cd agents/news-researcher
python api_server.py &

# Start Debate Analyst service
cd agents/debate-analyst
python api_server.py &

# Run tests
pytest
```

### Import Errors

**Error:** `ModuleNotFoundError: No module named 'xyz'`

**Solution:**
```bash
# Install test dependencies
pip install -r requirements-test.txt

# Install service dependencies
cd agents/news-researcher && pip install -r requirements.txt
cd agents/debate-analyst && pip install -r requirements.txt
```

### API Key Errors

**Error:** API key not found or invalid

**Solution:**
```bash
# Set API keys
export OPENAI_API_KEY="your-key-here"
export GROQ_API_KEY="your-key-here"

# Or create .env file
cat > .env << EOF
OPENAI_API_KEY=your-key-here
GROQ_API_KEY=your-key-here
EOF
```

### Timeout Errors

**Error:** Test timeout or slow response

**Solution:**
```python
# Increase timeout in test
@pytest.mark.timeout(300)  # 5 minutes
def test_slow_operation(self):
    ...

# Or skip slow tests
pytest -m "not slow"
```

## Performance Testing

### Load Testing with Locust

```python
from locust import HttpUser, task, between

class StockAnalysisUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def analyze_stock(self):
        self.client.post("/news-researcher/analyze", json={
            "symbols": ["AAPL"]
        })
```

Run load test:
```bash
locust -f locustfile.py --host http://localhost:8000
```

## Coverage Goals

Target coverage metrics:
- **Overall Coverage**: > 80%
- **Critical Paths**: > 95%
- **Error Handling**: > 90%

Generate coverage report:
```bash
pytest --cov=. --cov-report=term-missing
```

## Contributing

When adding new features:

1. Write tests FIRST (TDD approach)
2. Ensure tests pass locally
3. Add docstrings to test functions
4. Update this README if adding new test categories
5. Maintain > 80% coverage

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [Coverage.py](https://coverage.readthedocs.io/)
- [Locust Load Testing](https://locust.io/)

## License

Part of the Stock Prediction Agent project.
