import pandas as pd
from environs import Env
from datetime import date
import json
from utilities.mongo_connection import get_db_connection
from prophet.prophet_stock_trainer import StockTrainer
import os

env = Env()
api_key = env('alphavantage_api_key')


class ProphetPredictor():

    def predict(self):
        symbol = 'TSLA'

        print(f'Running prediction for {symbol}')

        trainer = StockTrainer(api_key, "TSLA")
        model, stock_history, stock_forecast = trainer.create_prophet_model(30)
        train_mean_error, test_mean_error = trainer.evaluate_prediction()

        title = 'Stock Prediction using Prophet for {} with mean error {:.2f}'.format(
            symbol, test_mean_error)

        self.save_model_in_db(symbol, title, stock_history[["ds", "Adj. Close"]].to_json(),
                              stock_forecast[['ds', 'yhat']].to_json(), train_mean_error, test_mean_error)

        return model, stock_history, stock_forecast

    def save_model_in_db(self, symbol, title, stock_history, stock_forecast, train_mean_error, test_mean_error):
        conn = get_db_connection()
        stocksdb = conn["stocksdb"]
        modelCollection = stocksdb["models"]

        dbModel = {
            "symbol": symbol,
            "title": title,
            "stock_history": stock_history,
            "stock_forecast": stock_forecast,
            "train_mean_error": train_mean_error,
            "test_mean_error": test_mean_error,
            "date_created": date.today().strftime("%Y-%m-%d")
        }

        modelCollection.find_one_and_replace(
            {"symbol": symbol}, dbModel, upsert=True)
