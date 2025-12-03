## Features Used in Prophet Model


**Data Loading and Preparation**

- Loads multiple data sources: historical energy output, future weather forecasts, and official actuals.
- Handles missing files and data validation, ensuring robust preprocessing.
- Converts date columns to datetime and ensures numeric types for calculations.
- Drops invalid or missing rows to maintain data integrity.

**Feature Engineering**

*Time-Based Features*

- Extracts year, month, day, day of week, and day of year from timestamps.
- Flags weekends.
- (Commented out but present) Flags for month start/end and quarter.
- (Commented out) Fourier-based cyclical features for month and day, capturing seasonality.

*Rolling and Statistical Features*

- Calculates rolling statistics (mean, std, max, min, median) for energy output over multiple window sizes (3, 7, 15, 30 days).
- Computes rolling skewness and kurtosis to capture distributional properties.
- Computes rolling volatility (std/mean), range (max-min), and trend (difference over window).
- Exponential moving averages (EMA) for different spans (7, 15, 30 days).
- Rolling ratios between different window sizes for both mean and std.
- Lag features for energy output (lags of 1, 2, 3, 7, 14, 21, 30 days).
- Interaction features (e.g., rolling mean × rolling std).

*Weather and Interaction Features*

- Includes weather variables: temperature, soil moisture, humidity, precipitation.
- (Commented out but present) Polynomial and interaction terms for temperature (squared, cubed), and interactions between temperature and other weather variables.
- Interaction features between temperature and rolling means.

*Missing Value Handling*

- Fills missing numeric values with median or forward/backward fill.
- Replaces infinities with NaN and fills again to ensure no invalid values.

**Modeling Approaches**

*Prophet Model*

- Uses Facebook Prophet with optimized parameters:
    - Increased seasonality complexity (higher Fourier orders for yearly, monthly, quarterly, biweekly).
    - Multiplicative seasonality mode.
    - More changepoints and wider changepoint range for flexibility.
    - Wider prediction intervals for uncertainty.
    - Custom seasonalities added for monthly, quarterly, and biweekly patterns.
- Adds multiple external regressors (weather and engineered features).
- Fits the model to training data and predicts on test and future data.

*Ensemble Machine Learning Models*

- Random Forest Regressor:
    - Tuned for more trees, deeper trees, and robust splitting criteria.
    - Uses all engineered features, including weather and rolling stats.
    - Trained on raw features.
- Ridge Regression:
    - Uses scaled features (RobustScaler for outlier resistance).
    - Regularization parameter tuned for reduced overfitting.
- Both models are trained and evaluated, and their predictions are compared.

*Train-Test Splitting*

- Splits data chronologically to preserve time series order, avoiding data leakage.

**Prediction and Evaluation**

*Prediction Preparation*

- Merges historical and future data to ensure continuity for rolling features.
- Ensures all required regressors are present for Prophet, filling missing ones with zeros if needed.

*Evaluation Metrics*

- Calculates MAE, RMSE, R², MAPE, accuracy percentage, average percent error, and data range for both actual and predicted values.
- Provides detailed printouts for model performance on both cross-validation and official prediction periods.

*Result Saving and Reporting*

- Saves final predictions (with confidence intervals and weather data) to JSON.
- Prints summary tables comparing model performance across all metrics.

---

## Summary Table of Feature Types

| Feature Type | Description |
| :-- | :-- |
| Time-based features | Year, month, day, dayofweek, dayofyear, is_weekend, (quarter, is_month_start/end) |
| Rolling statistics | Mean, std, max, min, median, skew, kurtosis (windows: 3, 7, 15, 30 days) |
| Volatility/trend features | std/mean ratio, range, trend (difference over window) |
| Exponential moving averages | EMA over 7, 15, 30 days |
| Lag features | Energy output at prior 1, 2, 3, 7, 14, 21, 30 days |
| Interaction features | Rolling mean × std, temperature × rolling mean, etc. |
| Weather features | Temperature, soil moisture, humidity, precipitation |
| Polynomial/interactions (weather) | Temperature squared/cubed, temp × moisture, temp × humidity, etc. (some commented out) |
| Model types | Prophet (with regressors and custom seasonalities), Random Forest, Ridge Regression |
| Evaluation metrics | MAE, RMSE, R², MAPE, accuracy, average percent error, data range |


---

## Explanation

This script integrates advanced time series feature engineering, robust data handling, and a hybrid modeling approach (statistical + machine learning) for improved energy forecasting. It leverages both domain-specific features (weather, time) and generic statistical properties (rolling stats, lags, interactions) to maximize predictive accuracy. The ensemble of Prophet and machine learning models allows for robust, interpretable, and flexible forecasting, validated with comprehensive metric reporting and result saving[^1].
