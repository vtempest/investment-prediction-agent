# %%
import pandas_datareader.data as pdr
import yfinance as fix
import tensorflow as tf
import numpy as np
import pandas as pd
from datetime import date, timedelta
import sys
sys.path.insert(0, "../")
from utilities.get_prices import get_stock_data
from lstm.preprocessing import DataProcessing
fix.pdr_override()


def build_model_and_predict(ticker):
    stock_file_path, stock_data = get_stock_data("AAPL")
    process = DataProcessing(stock_file_path, 0.9)
    process.gen_test(10)
    process.gen_train(10)

    X_train = process.X_train.reshape((-1, 10, 1)) / 200
    Y_train = process.Y_train / 200

    X_test = process.X_test.reshape((-1, 10, 1)) / 200
    Y_test = process.Y_test / 200

    model = tf.keras.Sequential()
    model.add(tf.keras.layers.LSTM(
        20, input_shape=(10, 1), return_sequences=True))
    model.add(tf.keras.layers.LSTM(20))
    model.add(tf.keras.layers.Dense(1, activation=tf.nn.relu))

    model.compile(optimizer="adam", loss="mean_squared_error")

    model.fit(X_train, Y_train, epochs=3)

    model_loss = model.evaluate(X_test, Y_test)

    # today = date.today().strftime("%Y-%m-%d")
    # twenty_days_ago = (date.today() - timedelta(20)).strftime("%Y-%m-%d")
    # data = pdr.get_data_yahoo("AAPL", twenty_days_ago, today)

    stock_predict = stock_data[-10:]
    X_predict = np.array(stock_predict).reshape((1, 10, 1)) / 200

    # print(model.predict(X_predict) * 200)

    return model_loss, X_predict

    # If instead of a full backtest, you just want to see how accurate the model is for a particular prediction, run this:
    # data = pdr.get_data_yahoo("AAPL", "2017-12-19", "2018-01-03")
    # stock = data["Adj Close"]
    # X_predict = np.array(stock).reshape((1, 10)) / 200
    # print(model.predict(X_predict)*200)


# %%
