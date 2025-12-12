
# %%
import sys
sys.path.insert(0, '../')
from lstm.LSTM_model import build_model_and_predict
from datetime import date
from prophet.prophet_predictor import ProphetPredictor
from prophet.stocker import Stocker
from environs import Env

# env = Env()
# api_key = env('alphavantage_api_key')
ProphetPredictor().predict()

# model_loss, X_predict = build_model_and_predict("AAPL")

# print(X_predict * 200)
# print(model_loss)
