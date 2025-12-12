import pytest
from utilities.stock_model_loader import StockModelLoader


@pytest.mark.integration
def test_stock_load():

    loader = StockModelLoader("", "TSLA")
    stock = loader.load()

    assert stock is not None
