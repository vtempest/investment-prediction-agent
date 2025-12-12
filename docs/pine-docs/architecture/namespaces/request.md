---
layout: default
title: Request (request)
parent: Namespaces
nav_order: 4
permalink: /architecture/namespaces/request/
---

# PineTS Request (`request`) Namespace

This directory contains the implementation of Pine Script's `request.*` functions, primarily `request.security` for multi-timeframe analysis.

## Architecture

Functions are factory functions accessing the `context`.

## The `param()` Method

The `request.param()` method is highly specialized. It performs two critical tasks:

1.  **Tuple Detection**: It distinguishes between a **tuple of expressions** (e.g., `[open, close]`) and a **time-series array**.
    *   If inputs are `Series` objects, it extracts their current values.
    *   If inputs are scalars, it preserves them.
    *   Heuristic: `hasOnlySeries` or `hasOnlyScalars` check.

2.  **ID Return**: Unlike other param methods, it returns a tuple **`[value, name]`**.
    *   `value`: The extracted value(s).
    *   `name`: The unique ID (`p0`, `p1`...) assigned by the transpiler.

```typescript
return [val, name];
```

### Why Return the Name?
The `request.security` function relies on caching secondary contexts (HTF contexts). To do this efficiently, it constructs a cache key using the parameter ID (`name`). Without this ID, it wouldn't know which expression corresponds to which cached context.

## Implementation Specifics

### 1. Secondary Contexts
`request.security` creates a **new PineTS instance** (a secondary context) to evaluate the expression in the requested timeframe.
*   It prevents recursion: Secondary contexts have a flag `isSecondaryContext = true`.
*   If `request.security` is called within a secondary context, it returns the expression directly (no new context).

### 2. Tuple Handling
When `request.security` returns a tuple (e.g., from `[open, close]`), it wraps the result in a **2D array** `[[val1, val2]]`. This signals to `Context.init()` that the result is a tuple to be destructured, not a history array.

## Generating the Barrel File

To regenerate the `request.index.ts` file:

```bash
npm run generate:request-index
```

