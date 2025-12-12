---
layout: home
title: Home
nav_order: 1
permalink: /
---

# PineTS

PineTS is a TypeScript implementation of the Pine Script language, allowing you to write trading indicators and strategies using TypeScript while leveraging the power of Pine Script's execution model and functions.

With PineTS, you can create, test and visualize technical indicators using modern web technologies while maintaining compatibility with the Pine Script language features.

<div class="cta-container" style="text-align: center; margin: 2rem 0;">
  <a href="getting-started/" class="btn btn-primary fs-5 mb-4 mb-md-0 mr-2">Get Started →</a>
  <a href="https://github.com/alaa-eddine/PineTS" class="btn btn-outline fs-5 mb-4 mb-md-0">View on GitHub</a>
</div>

# Demo

This is a BTCUSDT chart with the Williams Vix Fix indicator applied.
The chart data and indicator are generated using PineTS, showcasing the capabilities of the library in creating interactive and dynamic charts.

The visualization is done using the [Lightweight Charts](https://tradingview.github.io/lightweight-charts/) library.

<div class="chart-container">
    <div id="main-chart"></div>
    <div id="indicator-chart"></div>
</div>

<script src="https://unpkg.com/lightweight-charts@4.1.1/dist/lightweight-charts.standalone.production.js"></script>
<link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="./js/pinets.dev.browser.js"></script>
<script src="./indicators/willvixfix/WillVixFix.js"></script>
<script src="./js/chart.js"></script>
<style>
    .chart-container td {
        min-width: 0 !important;
    }
</style>

## Documentation

### [Getting Started](getting-started.md)

Learn the basics of converting Pine Script to PineTS and understand key differences.

### [Initialization and Usage](initialization-and-usage.md)

Complete guide on how to initialize PineTS and run indicators with detailed API documentation, including all constructor parameters, run method options, and return value formats.

### [Syntax Guide](syntax-guide.md)

Detailed guide on PineTS syntax and how to write code equivalent to Pine Script, including variable declarations (`var` vs `let`), series access, and control structures.

### [Language Coverage](lang-coverage.md)

Click here to [explore](lang-coverage.md) the [Pine Script language](lang-coverage.md) features implemented in PineTS, including execution model, time series, and more.

### [API Coverage](api-coverage.md)

Click [here](api-coverage.md) to check the implementation status of [Pine Script API](api-coverage.md) functions and methods in PineTS.

## Demo Indicators

### [WillVixFix Indicator](indicators/willvixfix/index.html)

WillVixFix is a volatility-based indicator that helps identify potential reversal points in the market.
Click [here](indicators/willvixfix/index.html) to see the demo.

### [Squeeze Momentum Indicator](indicators/sqzmom/index.html)

The Squeeze Momentum indicator identifies when the market is "squeezing" (low volatility) and about to break out with increased momentum.
Click [here](indicators/sqzmom/index.html) to see the demo.

---

Created by [Alaa-eddine KADDOURI](https://github.com/alaa-eddine) | Licensed under AGPL-3.0
