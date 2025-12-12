---
layout: default
title: Runtime
parent: Architecture
has_children: true
nav_order: 2
permalink: /architecture/runtime/
---

# PineTS Runtime Engine

The runtime environment executes the transpiled code. It simulates the Pine Script execution model where the script runs once for every bar in the dataset.

## Key Components

-   **PineTS Class**: The entry point. Manages the data provider, pagination, and execution loop.
-   **Context Class**: The "Global State" passed to the script. Holds all variables, series data, and namespace instances.
-   **Series Class**: The fundamental data structure wrapping arrays.

## Execution Model

PineTS follows a "Push-Based" execution model:

1.  **Load Data**: Fetch OHLCV data from a Provider.
2.  **Initialize Context**: Create the `$` object.
3.  **Run Loop**:
    -   For each historical bar:
        -   Update `context.idx`.
        -   Push new OHLCV data into `context.data` arrays.
        -   Execute the user script.
        -   Grow all user variables (push current value to history).
    -   Collect results/plots.

This ensures that `close[1]` always refers to the data from the previous iteration.
