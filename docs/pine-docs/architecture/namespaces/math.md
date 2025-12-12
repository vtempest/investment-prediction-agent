---
layout: default
title: Math (math)
parent: Namespaces
nav_order: 2
permalink: /architecture/namespaces/math/
---

# PineTS Math (`math`) Namespace

This directory contains the implementation of Pine Script's `math.*` namespace functions. These functions provide standard mathematical operations adapted for time-series data.

## Architecture

Like other namespaces, `math` functions are factory functions that receive the `context` and return the implementation.

## The `param()` Method

The `math.param()` method is identical to `ta.param()`. It ensures that all mathematical operations can handle both scalar values and `Series` objects seamlessly.

### Behavior
*   **Series Input**: Returns the Series object (with offset if specified).
*   **Scalar Input**: Wraps the scalar in a new `Series` object.
*   **Array Input**: Wraps the array in a `Series` object.

This uniformity allows math functions to work directly on `Series` objects, enabling operations like `math.abs(close)`.

## Implementation Specifics

### 1. Series Support
Most math functions are designed to work on the *current value* of a Series. They typically extract the value using `Series.from(source).get(0)` and perform the operation.

```typescript
// Example: math.abs
const val = Series.from(source).get(0);
return Math.abs(val);
```

### 2. NaN Handling
Math functions should propagate `NaN` correctly. `Math.abs(NaN)` returns `NaN` in JavaScript, which aligns with Pine Script behavior.

### 3. Equality Check (`__eq`)
A special `__eq` function handles equality checks, specifically for `NaN`. In Pine Script, `NaN == NaN` is true (unlike JavaScript). The transpiler converts `==` to `$.math.__eq()` to ensure correct behavior.

## Generating the Barrel File

To regenerate the `math.index.ts` file after adding new methods:

```bash
npm run generate:math-index
```

