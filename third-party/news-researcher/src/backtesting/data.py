from __future__ import annotations

from pathlib import Path
from typing import Dict, Tuple, Optional

import pandas as pd
import yfinance as yf


def load_stock_data(symbol: str, data_dir: str) -> Tuple[Optional[pd.DataFrame], Optional[pd.DataFrame]]:
    """Load AI signals CSV for symbol and fetch OHLC data via yfinance.

    Returns (ohlc_df, signals_df) or (None, None) on error.
    """
    data_path = Path(data_dir)
    csv_file = data_path / f"daily_analysis_{symbol}.csv"

    if not csv_file.exists():
        print(f"Error: File {csv_file} not found!")
        return None, None

    signals_df = pd.read_csv(csv_file)
    signals_df["date"] = pd.to_datetime(signals_df["date"])
    signals_df = signals_df.sort_values("date").reset_index(drop=True)

    start_date = signals_df["date"].min()
    end_date = signals_df["date"].max()

    ticker = yf.Ticker(symbol)
    ohlc_data = ticker.history(start=start_date, end=end_date + pd.Timedelta(days=1))

    if ohlc_data.empty:
        print(f"No OHLC data available for {symbol}")
        return None, None

    return ohlc_data.reset_index(), signals_df


def load_all_data(data_dir: str) -> Dict[str, Tuple[pd.DataFrame, pd.DataFrame]]:
    """Load all symbols from data_dir as mapping symbol -> (ohlc_df, signals_df)."""
    data_path = Path(data_dir)
    csv_files = list(data_path.glob("daily_analysis_*.csv"))
    all_data: Dict[str, Tuple[pd.DataFrame, pd.DataFrame]] = {}

    for csv_file in csv_files:
        symbol = csv_file.stem.replace("daily_analysis_", "")
        try:
            signals_df = pd.read_csv(csv_file)
            signals_df["date"] = pd.to_datetime(signals_df["date"])
            signals_df = signals_df.sort_values("date").reset_index(drop=True)

            start_date = signals_df["date"].min()
            end_date = signals_df["date"].max()

            ticker = yf.Ticker(symbol)
            ohlc_data = ticker.history(start=start_date, end=end_date + pd.Timedelta(days=1))
            if not ohlc_data.empty:
                all_data[symbol] = (ohlc_data.reset_index(), signals_df)
            else:
                print(f"✗ {symbol}: No OHLC data available")
        except Exception as e:
            print(f"✗ {symbol}: Failed to load - {e}")

    return all_data


def list_available_stocks(data_dir: str) -> list[str]:
    """List stock symbols available as CSVs in data_dir."""
    path = Path(data_dir)
    if not path.exists():
        return []
    return sorted([p.stem.replace("daily_analysis_", "") for p in path.glob("daily_analysis_*.csv")])