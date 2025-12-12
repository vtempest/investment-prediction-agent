import pandas as pd
import numpy as np
import fbprophet
import pytrends
from pytrends.request import TrendReq
from alpha_vantage.timeseries import TimeSeries


class StockModelLoader():
    def __init__(self, api_key, ticker):
        ticker = ticker.upper()

        self.api_key = api_key
        self.ticker = ticker

    def load(self):
        stock_file_path = './data/' + self.ticker + '.csv'

        try:
            stock = pd.read_csv(stock_file_path, index_col=0, parse_dates=['index'])
        except FileNotFoundError:
            try:
                ts = TimeSeries(key=self.api_key, output_format='pandas', indexing_type='integer')
                stock, meta_data = ts.get_daily_adjusted(symbol=self.ticker, outputsize='full')

                stock.rename(columns={"index": "Date"},  inplace=True)
                stock.to_csv(stock_file_path)
            except Exception as e:
                print('Error Retrieving Data.')
                print(e)
                return

        # Set the index to a column called Date
        stock = stock.reset_index(level=0)
        stock['Date'] = pd.to_datetime(stock['Date'])

        # Columns required for prophet
        stock['ds'] = stock['Date']

        if ('Adj. Close' not in stock.columns):
            stock['Adj. Close'] = stock['5. adjusted close']
            stock['Adj. Open'] = stock['1. open'] * stock['5. adjusted close'] / stock['4. close']
            stock['Adj. Volume'] = stock['6. volume'] * stock['4. close'] / stock['5. adjusted close']
            stock['Adj. High'] = stock['2. high'] * stock['5. adjusted close'] / stock['4. close']
            stock['Adj. Close'] = stock['4. close'] * stock['5. adjusted close'] / stock['4. close']

        stock['y'] = stock['Adj. Close']
        stock['Daily Change'] = stock['Adj. Close'] - stock['Adj. Open']
        stock.drop(['1. open', '2. high', '3. low', '4. close', '5. adjusted close',
                    '6. volume', '7. dividend amount', '8. split coefficient'], axis=1)

        return stock
