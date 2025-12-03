from __future__ import annotations

from typing import Any, Dict, Tuple, Type

import backtrader as bt

DEFAULT_CASH = 100000
DEFAULT_COMMISSION = 0


def create_cerebro(cash: float = DEFAULT_CASH, commission: float = DEFAULT_COMMISSION) -> bt.Cerebro:
    """Create and configure Backtrader Cerebro engine with analyzers."""
    cerebro = bt.Cerebro()
    cerebro.broker.setcash(cash)
    cerebro.broker.setcommission(commission=commission)
    cerebro.addanalyzer(bt.analyzers.PyFolio, _name="pyfolio")
    cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name="trades")
    return cerebro


def run_backtest(
    ohlc_data,
    strategy_class: Type[bt.Strategy],
    strategy_name: str,
    **strategy_params: Any,
) -> Tuple[Dict[str, Any], bt.Cerebro]:
    """Run a backtest with given strategy; return metrics and the Cerebro instance."""
    cerebro = create_cerebro()
    cerebro.addstrategy(strategy_class, **strategy_params)

    data_params = {
        "dataname": ohlc_data.set_index("Date"),
        "datetime": None,
        "open": "Open",
        "high": "High",
        "low": "Low",
        "close": "Close",
        "volume": "Volume",
        "openinterest": None,
    }
    data = bt.feeds.PandasData(**data_params)
    cerebro.adddata(data)

    results = cerebro.run()
    final_value = cerebro.broker.getvalue()

    strat = results[0]
    pyfolio_analyzer = strat.analyzers.pyfolio
    pf_items = pyfolio_analyzer.get_pf_items()

    # Some versions may return 3 or 4 items; we only need returns
    returns_series = pf_items[0]

    cumulative_return = (returns_series + 1).prod() - 1
    cumulative_return_pct = cumulative_return * 100

    # Manual metrics
    annual_volatility = returns_series.std() * (252 ** 0.5) * 100
    running_max = (1 + returns_series).cumprod().cummax()
    drawdown = (1 + returns_series).cumprod() / running_max - 1
    max_drawdown = abs(drawdown.min()) * 100
    excess_returns = returns_series - 0.02 / 252  # assume 2% risk-free
    sharpe_ratio = (
        excess_returns.mean() / returns_series.std() * (252 ** 0.5)
        if returns_series.std() != 0
        else 0
    )

    trades = strat.analyzers.trades.get_analysis()
    total_closed_trades = trades.get("total", {}).get("closed", 0) if isinstance(trades.get("total", {}), dict) else 0
    total_trades = total_closed_trades if total_closed_trades > 0 else getattr(strat, "order_count", 0)

    results_dict: Dict[str, Any] = {
        "Final Value": final_value,
        "Cumulative Return [%]": cumulative_return_pct,
        "Annual Volatility [%]": annual_volatility,
        "Max Drawdown [%]": max_drawdown,
        "Sharpe Ratio": sharpe_ratio,
        "Total Trades": total_trades,
        "Strategy": strategy_name,
    }

    return results_dict, cerebro