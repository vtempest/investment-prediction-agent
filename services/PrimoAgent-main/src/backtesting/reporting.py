from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Dict, Any


def generate_markdown_report(all_results: Dict[str, Dict[str, Any]], report_path: Path) -> None:
    """Generate a markdown report with a metrics table for each stock/strategy."""
    lines = []
    lines.append("# PrimoAgent Multi-Stock Backtest Results")
    lines.append(f"\n*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*")

    lines.append("\n## Performance Metrics")
    lines.append("\n| Stock | Strategy | Final Value | Return % | Volatility % | Sharpe | Max DD % | Trades |")
    lines.append("|-------|----------|-------------|----------|--------------|--------|----------|--------|")

    for symbol in sorted(all_results.keys()):
        primo = all_results[symbol]["primo"]
        buyhold = all_results[symbol]["buyhold"]
        lines.append(
            f"| {symbol} | PrimoAgent | ${primo['Final Value']:,.0f} | {primo['Cumulative Return [%]']:+.2f}% | "
            f"{primo['Annual Volatility [%]']:.2f}% | {primo['Sharpe Ratio']:.3f} | {primo['Max Drawdown [%]']:.2f}% | {primo['Total Trades']} |"
        )
        lines.append(
            f"| {symbol} | Buy & Hold | ${buyhold['Final Value']:,.0f} | {buyhold['Cumulative Return [%]']:+.2f}% | "
            f"{buyhold['Annual Volatility [%]']:.2f}% | {buyhold['Sharpe Ratio']:.3f} | {buyhold['Max Drawdown [%]']:.2f}% | {buyhold['Total Trades']} |"
        )
        lines.append("| | | | | | | | |")

    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text("\n".join(lines), encoding="utf-8")

