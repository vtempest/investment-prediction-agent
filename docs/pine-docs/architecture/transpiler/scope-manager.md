---
layout: default
title: Scope Manager
parent: Transpiler
nav_order: 1
permalink: /architecture/transpiler/scope-manager/
---

# Scope Manager and Variable Transformation

One of the transpiler's most critical jobs is managing variable scope and state persistence across bar iterations.

## The Problem

In standard JavaScript:
```javascript
let x = 10; // Re-initialized every time the function runs?
```
If the entire indicator function runs for *every bar*, `let x = 10` would reset `x` every time. Pine Script variables need to maintain history (`x[1]`).

## The Solution: Context Object

The transpiler moves all variables into a persistent `context` object (`$`).

**User Code:**
```javascript
let ema9 = ta.ema(close, 9);
```

**Transformed Code:**
```javascript
$.let.glb1_ema9 = $.init($.let.glb1_ema9, temp_result);
```

### Variable Renaming

To prevent naming collisions between scopes (e.g., a variable `x` in the global scope vs `x` in a function), the `ScopeManager` assigns unique prefixes:

*   `glb1_`: Global scope variables.
*   `fn{id}_`: Function scope variables.
*   `if{id}_`: If-block scope variables.
*   `for{id}_`: For-loop scope variables.

This ensures that even if the user reuses variable names, they map to distinct properties on the context object.

## ID Generation

The transpiler generates unique IDs for:

1.  **Parameters (`p0`, `p1`...)**: Passed to `param()` to cache Series objects.
2.  **Function Calls (`_ta0`, `_ta1`...)**: Passed to namespace functions to maintain internal state (like `prevEma`).
3.  **Cache Keys**: For caching intermediate results.

This allows functions like `ta.ema` to identify *which* call they are handling, even if called multiple times with the same parameters.

