from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import List, Tuple, Dict, Any

import matplotlib.pyplot as plt

from .engine import DEFAULT_CASH


def calculate_trade_execution(
    signals_df, dates: List, prices: List[float], starting_cash: float
) -> Tuple[List, List[float], List, List[float]]:
    """Calculate executed buy/sell points to overlay on portfolio chart."""
    buy_dates, buy_values, sell_dates, sell_values = [], [], [], []
    current_shares = 0
    current_cash = starting_cash

    for i, date in enumerate(dates):
        matching_signals = signals_df[signals_df["date"].dt.date == date]
        if matching_signals.empty:
            continue
        signal_row = matching_signals.iloc[0]
        current_price = prices[i]

        if signal_row["trading_signal"] == "BUY":
            position_percent = signal_row["position_size"] / 100.0
            target_cash = current_cash * position_percent
            shares_bought = int(target_cash / current_price) if current_cash > current_price else 0
            if shares_bought > 0:
                current_shares += shares_bought
                current_cash -= shares_bought * current_price
                buy_dates.append(date)
                buy_values.append(current_shares * current_price + current_cash)

        elif signal_row["trading_signal"] == "SELL":
            position_percent = signal_row["position_size"] / 100.0
            shares_sold = int(current_shares * position_percent) if current_shares > 0 else 0
            if shares_sold > 0:
                current_shares -= shares_sold
                current_cash += shares_sold * current_price
                sell_dates.append(date)
                sell_values.append(current_shares * current_price + current_cash)

    return buy_dates, buy_values, sell_dates, sell_values


def _extract_dates_prices(cerebro) -> Tuple[List, List[float]]:
    data_feed = cerebro.datas[0]
    data_len = len(data_feed.close.array)
    dates, prices = [], []
    for i in range(data_len):
        dt_val = data_feed.datetime.array[i]
        date_obj = datetime.fromordinal(int(dt_val)).date()
        dates.append(date_obj)
        prices.append(data_feed.close.array[i])
    return dates, prices


def plot_single_stock(symbol: str, primo_cerebro, buyhold_cerebro, output_dir: str, filename: str | None = None) -> Path:
    """Create single-stock portfolio comparison chart and save it."""
    dates, prices = _extract_dates_prices(primo_cerebro)

    primo_strategy = primo_cerebro.runstrats[0][0]
    primo_portfolio = getattr(primo_strategy, "portfolio_values", [])

    buyhold_portfolio = [DEFAULT_CASH]
    if prices:
        buyhold_shares = int(DEFAULT_CASH / prices[0])
        buyhold_cash_left = DEFAULT_CASH - (buyhold_shares * prices[0])
        for price in prices[1:]:
            buyhold_portfolio.append(buyhold_shares * price + buyhold_cash_left)

    if len(primo_portfolio) != len(dates):
        if len(primo_portfolio) < len(dates):
            last_value = primo_portfolio[-1] if primo_portfolio else DEFAULT_CASH
            primo_portfolio.extend([last_value] * (len(dates) - len(primo_portfolio)))
        else:
            primo_portfolio = primo_portfolio[: len(dates)]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(15, 10), gridspec_kw={"height_ratios": [2, 1]})

    ax1.plot(dates, primo_portfolio, color="blue", linewidth=2, label="PrimoAgent Portfolio")
    ax1.plot(dates, buyhold_portfolio, color="red", linewidth=2, label="Buy & Hold Portfolio")
    ax1.set_ylabel("Portfolio Value ($)")

    signals_df = getattr(primo_strategy, "signals_df", None)
    if signals_df is not None:
        buy_dates, buy_values, sell_dates, sell_values = calculate_trade_execution(
            signals_df, dates, prices, DEFAULT_CASH
        )
        if buy_dates:
            ax1.scatter(buy_dates, buy_values, color="green", marker="^", s=100, alpha=0.8, label="BUY Executed", zorder=5)
        if sell_dates:
            ax1.scatter(sell_dates, sell_values, color="red", marker="v", s=100, alpha=0.8, label="SELL Executed", zorder=5)

    ax1.legend(loc="upper left")
    ax1.set_title(f"{symbol}: PrimoAgent vs Buy & Hold Performance")
    ax1.grid(True, alpha=0.3)

    if signals_df is not None:
        buy_volumes, sell_volumes = [], []
        current_shares, current_cash = 0, DEFAULT_CASH
        for i, date in enumerate(dates):
            matching_signals = signals_df[signals_df["date"].dt.date == date]
            if not matching_signals.empty:
                signal_row = matching_signals.iloc[0]
                price = prices[i]
                if signal_row["trading_signal"] == "BUY":
                    position_percent = signal_row["position_size"] / 100.0
                    target_cash = current_cash * position_percent
                    shares_bought = int(target_cash / price) if current_cash > price else 0
                    if shares_bought > 0:
                        current_shares += shares_bought
                        current_cash -= shares_bought * price
                        buy_volumes.append(shares_bought)
                        sell_volumes.append(0)
                    else:
                        buy_volumes.append(0)
                        sell_volumes.append(0)
                elif signal_row["trading_signal"] == "SELL":
                    position_percent = signal_row["position_size"] / 100.0
                    shares_sold = int(current_shares * position_percent) if current_shares > 0 else 0
                    if shares_sold > 0:
                        current_shares -= shares_sold
                        current_cash += shares_sold * price
                        buy_volumes.append(0)
                        sell_volumes.append(-shares_sold)
                    else:
                        buy_volumes.append(0)
                        sell_volumes.append(0)
                else:
                    buy_volumes.append(0)
                    sell_volumes.append(0)
            else:
                buy_volumes.append(0)
                sell_volumes.append(0)

        ax2.bar(dates, buy_volumes, color="green", alpha=0.7, label="BUY Shares")
        ax2.bar(dates, sell_volumes, color="red", alpha=0.7, label="SELL Shares")
        ax2.set_ylabel("Number of Shares")
        ax2.set_xlabel("Date")
        ax2.set_title("Trading Volume")
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        ax2.axhline(y=0, color="black", linewidth=0.5)

    plt.tight_layout()
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    save_path = output_path / (filename or f"single_backtest_{symbol}.png")
    plt.savefig(save_path, dpi=300, bbox_inches="tight")
    plt.close()
    return save_path


def plot_returns_bar_chart(all_results: Dict[str, Dict[str, Any]], save_path: Path) -> None:
    """Create simple bar chart showing returns for all stocks and strategies."""
    fig, ax = plt.subplots(figsize=(12, 8))

    symbols = sorted(all_results.keys())
    primo_returns = [all_results[s]["primo"]["Cumulative Return [%]"] for s in symbols]
    buyhold_returns = [all_results[s]["buyhold"]["Cumulative Return [%]"] for s in symbols]

    x = range(len(symbols))
    width = 0.35
    bars1 = ax.bar([i - width / 2 for i in x], primo_returns, width, label="PrimoAgent", color="#1f77b4", alpha=0.8)
    bars2 = ax.bar([i + width / 2 for i in x], buyhold_returns, width, label="Buy & Hold", color="#ff7f0e", alpha=0.8)

    ax.set_xlabel("Stocks")
    ax.set_ylabel("Cumulative Return (%)")
    ax.set_title("Performance Comparison: PrimoAgent vs Buy & Hold")
    ax.set_xticks(list(x))
    ax.set_xticklabels(symbols)
    ax.legend()
    ax.grid(True, alpha=0.3, axis="y")
    ax.axhline(y=0, color="black", linewidth=0.5)

    for bar, value in zip(bars1, primo_returns):
        height = bar.get_height()
        ax.text(
            bar.get_x() + bar.get_width() / 2.0,
            height + (0.5 if height >= 0 else -1.5),
            f"{value:.1f}%",
            ha="center",
            va="bottom" if height >= 0 else "top",
            fontsize=10,
            fontweight="bold",
        )

    for bar, value in zip(bars2, buyhold_returns):
        height = bar.get_height()
        ax.text(
            bar.get_x() + bar.get_width() / 2.0,
            height + (0.5 if height >= 0 else -1.5),
            f"{value:.1f}%",
            ha="center",
            va="bottom" if height >= 0 else "top",
            fontsize=10,
            fontweight="bold",
        )

    plt.tight_layout()
    save_path.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(save_path, dpi=300, bbox_inches="tight")
    plt.close()

