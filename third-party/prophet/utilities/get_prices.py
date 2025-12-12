# %%
import pandas as pd
import pandas_datareader.data as pdr
import yfinance as fix
import time
fix.pdr_override()


def get_stock_data(ticker):
    i = 1
    stock_file_path = '../data/' + ticker + '.csv'

    try:
        stock_data = pd.read_csv(stock_file_path, index_col=0, parse_dates=['Date'])
    except FileNotFoundError:
        try:
            all_data = pdr.get_data_yahoo(ticker)
        except ValueError:
            print("ValueError, trying again")
            i += 1
            if i < 5:
                time.sleep(10)
                get_stock_data(ticker)
            else:
                print("Tried 5 times, Yahoo error. Trying after 2 minutes")
                time.sleep(120)
                get_stock_data(ticker)
        stock_data = all_data["Adj Close"]
        stock_data.to_csv(path_or_buf=stock_file_path, header=True)

    return stock_file_path, stock_data


if __name__ == "__main__":
    stock_file_path, stock_data = get_stock_data("AAPL")
    print(f'stock_file_path {stock_file_path}')
    # get_sp500("2018-05-01", "2018-06-01")
