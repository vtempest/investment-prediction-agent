# Prophet Parameter Optimization for Energy Forecasting

## Overview

This document outlines the optimization of Prophet parameters specifically for energy forecasting tasks, focusing on improving prediction accuracy while maintaining model stability and interpretability.

## Key Parameter Improvements

### 1. Seasonality Settings

#### Before:
```python
'yearly_seasonality': 12,
'weekly_seasonality': 4,
'daily_seasonality': False,
```

#### After:
```python
'yearly_seasonality': 20,        # Increased for better annual patterns
'weekly_seasonality': 6,         # Increased for better weekly patterns
'daily_seasonality': False,      # Kept False to avoid overfitting
```

**Rationale:**
- **Yearly seasonality (12 → 20)**: Energy consumption often exhibits complex annual patterns due to seasonal weather changes, holidays, and operational cycles. Higher Fourier order captures more nuanced patterns.
- **Weekly seasonality (4 → 6)**: Energy facilities often have complex weekly patterns including weekend operations, maintenance schedules, and demand variations.
- **Daily seasonality**: Kept False for daily data to prevent overfitting and reduce computational complexity.

### 2. Flexibility and Regularization Parameters

#### Before:
```python
'changepoint_prior_scale': 0.01,
'seasonality_prior_scale': 10.0,
'holidays_prior_scale': 10.0,
```

#### After:
```python
'changepoint_prior_scale': 0.005,  # Reduced for more stable trends
'seasonality_prior_scale': 5.0,    # Reduced for less overfitting
'holidays_prior_scale': 5.0,       # Reduced for conservative holiday effects
```

**Rationale:**
- **Changepoint prior scale (0.01 → 0.005)**: Energy facilities typically have stable operations with gradual changes rather than abrupt shifts. Lower values create more stable trend lines.
- **Seasonality prior scale (10.0 → 5.0)**: Reduces overfitting while still capturing important seasonal patterns.
- **Holidays prior scale (10.0 → 5.0)**: More conservative holiday effects prevent overfitting to holiday patterns.

### 3. Changepoint Optimization

#### Before:
```python
'n_changepoints': 25,
'changepoint_range': 0.8,
```

#### After:
```python
'n_changepoints': 20,           # Reduced for more stable trends
'changepoint_range': 0.85,      # Increased for better trend detection
```

**Rationale:**
- **Number of changepoints (25 → 20)**: Fewer changepoints create smoother trend lines, which is appropriate for energy data that typically shows gradual changes.
- **Changepoint range (0.8 → 0.85)**: Slightly wider range allows for better detection of trend changes while maintaining stability.

### 4. Uncertainty Intervals

#### Before:
```python
'interval_width': 0.95,
```

#### After:
```python
'interval_width': 0.90,         # Tighter intervals for more precise predictions
```

**Rationale:**
- **Interval width (0.95 → 0.90)**: Tighter confidence intervals provide more precise uncertainty estimates, which is valuable for energy planning and decision-making.

## Custom Seasonality Additions

### 1. Quarterly Seasonality
```python
'quarterly': {
    'period': 91.25,      # Average days per quarter
    'fourier_order': 8,   # Increased from 6
    'prior_scale': 3.0    # Reduced from 5.0
}
```

**Rationale:**
- Energy facilities often operate on quarterly cycles for maintenance, reporting, and planning.
- Higher Fourier order captures more complex quarterly patterns.
- Reduced prior scale prevents overfitting.

### 2. Bi-weekly Seasonality
```python
'biweekly': {
    'period': 14,
    'fourier_order': 4,   # Increased from 3
    'prior_scale': 3.0    # Reduced from 5.0
}
```

**Rationale:**
- Many energy facilities have bi-weekly operational patterns.
- Higher Fourier order captures more nuanced bi-weekly variations.
- Conservative prior scale maintains stability.

### 3. Monthly Seasonality (New)
```python
'monthly': {
    'period': 30.44,      # Average days per month
    'fourier_order': 5,   # New addition
    'prior_scale': 2.0    # Conservative prior scale
}
```

**Rationale:**
- Monthly patterns are common in energy consumption due to billing cycles, seasonal changes, and operational schedules.
- Conservative prior scale ensures the new seasonality doesn't dominate the model.

## Expected Performance Improvements

### 1. Better Seasonal Pattern Capture
- Higher Fourier orders for yearly and weekly seasonality will capture more complex patterns
- Additional monthly seasonality will improve monthly trend detection
- Improved quarterly and bi-weekly seasonalities will better model operational cycles

### 2. More Stable Predictions
- Reduced changepoint prior scale will create smoother trend lines
- Fewer changepoints will reduce noise in predictions
- Conservative prior scales will prevent overfitting

### 3. Improved Uncertainty Estimation
- Tighter confidence intervals will provide more precise uncertainty estimates
- Better regularization will lead to more reliable prediction intervals

### 4. Enhanced Interpretability
- More stable trends will be easier to interpret
- Conservative parameters will reduce the risk of spurious patterns
- Clear seasonal components will aid in understanding energy consumption patterns

## Validation Strategy

### 1. Cross-Validation Performance
- Monitor MAE, RMSE, and MAPE improvements
- Compare prediction accuracy across different time periods
- Assess stability of predictions over multiple CV folds

### 2. Trend Analysis
- Examine trend stability before and after parameter changes
- Verify that changepoints align with known operational changes
- Ensure seasonal patterns are reasonable and interpretable

### 3. Uncertainty Calibration
- Validate that 90% confidence intervals contain approximately 90% of actual values
- Check for systematic bias in uncertainty estimates
- Ensure prediction intervals are neither too wide nor too narrow

## Implementation Notes

### 1. Parameter Configuration
- All parameters are now centralized in `config.py`
- Custom seasonalities are defined in `PROPHET_CUSTOM_SEASONALITIES`
- Easy to adjust parameters without modifying model code

### 2. Backward Compatibility
- Changes maintain the same Prophet model interface
- Existing functionality is preserved
- No changes required to prediction pipeline

### 3. Performance Monitoring
- Cross-validation results are saved for comparison
- Performance metrics are tracked over time
- Easy to revert changes if needed

## Future Optimizations

### 1. Hyperparameter Tuning
- Consider using grid search or Bayesian optimization for parameter tuning
- Implement automated parameter selection based on cross-validation performance
- Add facility-specific parameter optimization

### 2. Advanced Seasonalities
- Investigate facility-specific seasonal patterns
- Add holiday effects for energy-specific holidays
- Consider multi-year seasonal patterns

### 3. Dynamic Parameter Adjustment
- Implement adaptive parameters based on data characteristics
- Consider different parameters for different forecast horizons
- Add automatic parameter selection based on data quality

## References

[^1]: Taylor, S. J., & Letham, B. (2018). Forecasting at scale. The American Statistician, 72(1), 37-45.
[^2]: Facebook Prophet Documentation: https://facebook.github.io/prophet/
[^3]: Energy Forecasting Best Practices: https://www.sciencedirect.com/science/article/pii/S0301421518304567
[^4]: Time Series Forecasting in Energy: https://ieeexplore.ieee.org/document/8451650 