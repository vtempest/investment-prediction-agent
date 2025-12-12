import pandas as pd
import numpy as np
import fbprophet
import pytrends
from pytrends.request import TrendReq
from alpha_vantage.timeseries import TimeSeries
from utilities.stock_model_loader import StockModelLoader
import matplotlib
import matplotlib.pyplot as plt


class StockTrainer():
    def __init__(self, api_key, ticker):
        stockLoader = StockModelLoader(api_key, ticker)
        stock = stockLoader.load()

        self.stock = stock
        self.symbol = ticker

        # Minimum and maximum date in range
        self.min_date = min(stock['Date'])
        self.max_date = max(stock['Date'])
        self.min_date = pd.to_datetime(self.min_date)
        self.max_date = pd.to_datetime(self.max_date)

        # Find max and min prices and dates on which they occurred
        self.max_price = np.max(stock['y'])
        self.min_price = np.min(stock['y'])

        self.min_price_date = stock[stock['y'] == self.min_price]['Date']
        self.min_price_date = self.min_price_date[self.min_price_date.index[0]]
        self.max_price_date = stock[stock['y'] == self.max_price]['Date']
        self.max_price_date = self.max_price_date[self.max_price_date.index[0]]

        # The starting price (starting with the opening price)
        self.starting_price = float(stock.ix[0, 'Adj. Open'])

        # The most recent price
        self.most_recent_price = float(stock.ix[len(stock) - 1, 'y'])

        # Whether or not to round dates
        self.round_dates = True

        # Number of years of data to train on
        self.training_years = 3

        # Prophet parameters
        # Default prior from library
        self.changepoint_prior_scale = 0.05
        self.weekly_seasonality = False
        self.daily_seasonality = False
        self.monthly_seasonality = True
        self.yearly_seasonality = True
        self.changepoints = None

    # Basic prophet model for specified number of days
    def create_prophet_model(self, days=0, resample=False):
        model = self.create_model()

        # Fit on the stock history for self.training_years number of years
        stock_history = self.stock[self.stock['Date'] > (
            self.max_date - pd.DateOffset(years=self.training_years)).date()]

        # if resample:
        #     stock_history = self.resample(stock_history)

        model.fit(stock_history)

        # Make and predict for next year with future dataframe
        future = model.make_future_dataframe(periods=days, freq='D')
        future = model.predict(future)

        return model, stock_history, future

    # Evaluate prediction model for one year
    def evaluate_prediction(self, start_date=None, end_date=None, nshares=None):

        # Default start date is one year before end of data
        # Default end date is end date of data
        if start_date is None:
            start_date = self.max_date - pd.DateOffset(years=1)
        if end_date is None:
            end_date = self.max_date

        start_date, end_date = self.handle_dates(start_date, end_date)

        # Training data starts self.training_years years before start date and goes up to start date
        train = self.stock[(self.stock['Date'] < start_date.date()) &
                           (self.stock['Date'] > (start_date - pd.DateOffset(years=self.training_years)).date())]

        # Testing data is specified in the range
        test = self.stock[(self.stock['Date'] >= start_date.date()) & (
            self.stock['Date'] <= end_date.date())]

        # Create and train the model
        model = self.create_model()
        model.fit(train)

        # Make a future dataframe and predictions
        future = model.make_future_dataframe(periods=365, freq='D')
        future = model.predict(future)

        # Merge predictions with the known values
        test = pd.merge(test, future, on='ds', how='inner')

        train = pd.merge(train, future, on='ds', how='inner')

        # Calculate the differences between consecutive measurements
        test['pred_diff'] = test['yhat'].diff()
        test['real_diff'] = test['y'].diff()

        # Correct is when we predicted the correct direction
        test['correct'] = (np.sign(test['pred_diff']) ==
                           np.sign(test['real_diff'])) * 1

        # Accuracy when we predict increase and decrease
        increase_accuracy = 100 * \
            np.mean(test[test['pred_diff'] > 0]['correct'])
        decrease_accuracy = 100 * \
            np.mean(test[test['pred_diff'] < 0]['correct'])

        # Calculate mean absolute error
        test_errors = abs(test['y'] - test['yhat'])
        test_mean_error = np.mean(test_errors)

        train_errors = abs(train['y'] - train['yhat'])
        train_mean_error = np.mean(train_errors)

        # Calculate percentage of time actual value within prediction range
        test['in_range'] = False

        for i in test.index:
            if (test.ix[i, 'y'] < test.ix[i, 'yhat_upper']) & (test.ix[i, 'y'] > test.ix[i, 'yhat_lower']):
                test.ix[i, 'in_range'] = True

        in_range_accuracy = 100 * np.mean(test['in_range'])

        if not nshares:

            # Date range of predictions
            print('\nPrediction Range: {} to {}.'.format(start_date.date(),
                                                         end_date.date()))

            # Final prediction vs actual value
            print('\nPredicted price on {} = ${:.2f}.'.format(
                max(future['ds']).date(), future.ix[len(future) - 1, 'yhat']))
            print('Actual price on    {} = ${:.2f}.\n'.format(
                max(test['ds']).date(), test.ix[len(test) - 1, 'y']))

            print('Average Absolute Error on Training Data = ${:.2f}.'.format(
                train_mean_error))
            print('Average Absolute Error on Testing  Data = ${:.2f}.\n'.format(
                test_mean_error))

            # Direction accuracy
            print('When the model predicted an increase, the price increased {:.2f}% of the time.'.format(
                increase_accuracy))
            print('When the model predicted a  decrease, the price decreased  {:.2f}% of the time.\n'.format(
                decrease_accuracy))

            print('The actual value was within the {:d}% confidence interval {:.2f}% of the time.'.format(
                int(100 * model.interval_width), in_range_accuracy))

            return train_mean_error, test_mean_error

        # If a number of shares is specified, play the game
        elif nshares:

            # Only playing the stocks when we predict the stock will increase
            test_pred_increase = test[test['pred_diff'] > 0]

            test_pred_increase.reset_index(inplace=True)
            prediction_profit = []

            # Iterate through all the predictions and calculate profit from playing
            for i, correct in enumerate(test_pred_increase['correct']):

                # If we predicted up and the price goes up, we gain the difference
                if correct == 1:
                    prediction_profit.append(
                        nshares * test_pred_increase.ix[i, 'real_diff'])
                # If we predicted up and the price goes down, we lose the difference
                else:
                    prediction_profit.append(
                        nshares * test_pred_increase.ix[i, 'real_diff'])

            test_pred_increase['pred_profit'] = prediction_profit

            # Put the profit into the test dataframe
            test = pd.merge(
                test, test_pred_increase[['ds', 'pred_profit']], on='ds', how='left')
            test.ix[0, 'pred_profit'] = 0

            # Profit for either method at all dates
            test['pred_profit'] = test['pred_profit'].cumsum().ffill()
            test['hold_profit'] = nshares * \
                (test['y'] - float(test.ix[0, 'y']))

            # Display information
            print('You played the stock market in {} from {} to {} with {} shares.\n'.format(
                self.symbol, start_date.date(), end_date.date(), nshares))

            print('When the model predicted an increase, the price increased {:.2f}% of the time.'.format(
                increase_accuracy))
            print('When the model predicted a  decrease, the price decreased  {:.2f}% of the time.\n'.format(
                decrease_accuracy))

            # Display some friendly information about the perils of playing the stock market
            print('The total profit using the Prophet model = ${:.2f}.'.format(
                np.sum(prediction_profit)))
            print('The Buy and Hold strategy profit =         ${:.2f}.'.format(
                float(test.ix[len(test) - 1, 'hold_profit'])))
            print('\nThanks for playing the stock market!\n')

    # Create a prophet model without training
    def create_model(self):

        # Make the model
        model = fbprophet.Prophet(daily_seasonality=self.daily_seasonality,
                                  weekly_seasonality=self.weekly_seasonality,
                                  yearly_seasonality=self.yearly_seasonality,
                                  changepoint_prior_scale=self.changepoint_prior_scale,
                                  changepoints=self.changepoints)

        if self.monthly_seasonality:
            # Add monthly seasonality
            model.add_seasonality(name='monthly', period=30.5, fourier_order=5)

        return model

    def handle_dates(self, start_date, end_date):

            # Default start and end date are the beginning and end of data
        if start_date is None:
            start_date = self.min_date
        if end_date is None:
            end_date = self.max_date

        try:
            # Convert to pandas datetime for indexing dataframe
            start_date = pd.to_datetime(start_date)
            end_date = pd.to_datetime(end_date)

        except Exception as e:
            print('Enter valid pandas date format.')
            print(e)
            return

        valid_start = False
        valid_end = False

        # User will continue to enter dates until valid dates are met
        while (not valid_start) & (not valid_end):
            valid_end = True
            valid_start = True

            if end_date.date() < start_date.date():
                print('End Date must be later than start date.')
                start_date = pd.to_datetime(input('Enter a new start date: '))
                end_date = pd.to_datetime(input('Enter a new end date: '))
                valid_end = False
                valid_start = False

            else:
                if end_date.date() > self.max_date.date():
                    print('End Date exceeds data range')
                    end_date = pd.to_datetime(input('Enter a new end date: '))
                    valid_end = False

                if start_date.date() < self.min_date.date():
                    print('Start Date is before date range')
                    start_date = pd.to_datetime(
                        input('Enter a new start date: '))
                    valid_start = False

        return start_date, end_date

    # Not sure if this should be a static method
    @staticmethod
    def reset_plot():

        # Restore default parameters
        matplotlib.rcParams.update(matplotlib.rcParamsDefault)

        # Adjust a few parameters to liking
        matplotlib.rcParams['figure.figsize'] = (8, 5)
        matplotlib.rcParams['axes.labelsize'] = 10
        matplotlib.rcParams['xtick.labelsize'] = 8
        matplotlib.rcParams['ytick.labelsize'] = 8
        matplotlib.rcParams['axes.titlesize'] = 14
        matplotlib.rcParams['text.color'] = 'k'

    # def plot_evaluation(self):
    #     # Reset the plot
    #     self.reset_plot()

    #     # Set up the plot
    #     fig, ax = plt.subplots(1, 1)

    #     # Plot the actual values
    #     ax.plot(train['ds'], train['y'], 'ko-', linewidth=1.4, alpha=0.8, ms=1.8, label='Observations')
    #     ax.plot(test['ds'], test['y'], 'ko-', linewidth=1.4, alpha=0.8, ms=1.8, label='Observations')

    #     # Plot the predicted values
    #     ax.plot(future['ds'], future['yhat'], 'navy', linewidth=2.4, label='Predicted')

    #     # Plot the uncertainty interval as ribbon
    #     ax.fill_between(future['ds'].dt.to_pydatetime(), future['yhat_upper'], future['yhat_lower'], alpha=0.6,
    #                     facecolor='gold', edgecolor='k', linewidth=1.4, label='Confidence Interval')

    #     # Put a vertical line at the start of predictions
    #     plt.vlines(x=min(test['ds']).date(), ymin=min(future['yhat_lower']), ymax=max(future['yhat_upper']), colors='r',
    #                linestyles='dashed', label='Prediction Start')

    #     # Plot formatting
    #     plt.legend(loc=2, prop={'size': 8})
    #     plt.xlabel('Date')
    #     plt.ylabel('Price $')
    #     plt.grid(linewidth=0.6, alpha=0.6)

    #     plt.title('{} Model Evaluation from {} to {}.'.format(self.symbol,
    #                                                           start_date.date(), end_date.date()))
    #     plt.show()
