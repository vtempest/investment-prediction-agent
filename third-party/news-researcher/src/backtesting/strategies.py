import backtrader as bt


class PrimoAgentStrategy(bt.Strategy):
    """AI-driven trading strategy using PrimoAgent signals."""

    params = (
        ("signals_df", None),
        ("printlog", False),
    )

    def __init__(self):
        self.signals_df = self.p.signals_df
        self.portfolio_values = []
        self.order_count = 0

    def log(self, txt, dt=None):
        """Log function for optional debug output."""
        if self.p.printlog:
            dt = dt or self.datas[0].datetime.date(0)
            print(f"{dt.isoformat()}: {txt}")

    def next(self):
        """Main strategy logic executed on each bar."""
        current_date = self.data.datetime.date(0)
        current_price = self.data.close[0]

        # Track portfolio value for plotting
        portfolio_value = self.broker.getvalue()
        self.portfolio_values.append(portfolio_value)

        if self.signals_df is None:
            return

        current_signal_row = self.signals_df[
            self.signals_df["date"].dt.date == current_date
        ]

        if current_signal_row.empty:
            return

        signal = current_signal_row.iloc[0]["trading_signal"]
        position_percent = current_signal_row.iloc[0]["position_size"] / 100.0

        self.log(
            f"{current_date} | Signal: {signal} | Price: ${current_price:.2f} | "
            f"Position: {self.position.size} shares"
        )

        if signal == "BUY":
            available_cash = self.broker.getcash()
            target_cash = available_cash * position_percent
            size = int(target_cash / current_price)

            if size >= 1:
                self.buy(size=size)
                self.order_count += 1
                self.log(f"   BOUGHT {size} shares @ ${current_price:.2f}")
            else:
                self.log(
                    f"   Not enough cash for 1 share (need ${current_price:.2f}, "
                    f"have ${available_cash:.2f})"
                )

        elif signal == "SELL" and self.position:
            size = int(self.position.size * position_percent)
            if size >= 1:
                self.sell(size=size)
                self.order_count += 1
                self.log(f"   SOLD {size} shares @ ${current_price:.2f}")
            else:
                self.log("   Less than 1 share to sell")


class BuyAndHoldStrategy(bt.Strategy):
    """Simple buy and hold strategy for comparison."""

    def __init__(self):
        self.bought = False
        self.portfolio_values = []
        self.order_count = 0

    def next(self):
        portfolio_value = self.broker.getvalue()
        self.portfolio_values.append(portfolio_value)

        if not self.bought:
            commission_factor = 1.012
            safe_cash = self.broker.getcash() / commission_factor
            size = int(safe_cash / self.data.close[0])

            if size > 0:
                self.buy(size=size)
                self.order_count += 1
                self.bought = True

