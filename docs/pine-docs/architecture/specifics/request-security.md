---
layout: default
title: Request Security
parent: Specifics
nav_order: 2
permalink: /architecture/specifics/request-security/
---

# Request Security Architecture

`request.security` is the most complex function in PineTS as it involves creating and managing secondary execution contexts.

## Context Hierarchy

PineTS creates a strictly **Two-Level Hierarchy** to prevent infinite recursion.

1.  **Primary Context**: The main script execution.
2.  **Secondary Context**: Created by `request.security` to run the same script on a different timeframe/symbol.

**Guard**: Secondary contexts have `isSecondaryContext = true`. If `request.security` is called inside a secondary context, it returns the expression directly instead of creating a tertiary context.

## Caching Strategy

Since creating a `PineTS` instance and running a script is expensive, secondary contexts are aggressively cached.

### Cache Key
The cache key is composite:
```typescript
key = `${symbol}_${timeframe}_${expressionID}`;
```
*   `expressionID`: The unique ID (`p0`, `p1`...) of the expression parameter passed to `security`. This is why `request.param()` returns `[val, name]`.

## Data Flow

1.  **User calls `request.security(..., expression)`**.
2.  **Primary Context**:
    *   Checks cache.
    *   If miss: Creates `new PineTS(...)` for target timeframe.
    *   Sets `isSecondaryContext = true`.
    *   Runs the script.
    *   Stores result in cache.
    *   Extracts result aligned to primary timeframe.
3.  **Secondary Context**:
    *   Runs the same script.
    *   When it encounters `request.security`:
    *   Checks `isSecondaryContext`.
    *   Returns `expression` directly.
    *   This effectively "unwraps" the security call inside the secondary context, allowing the script to calculate the expression natively in that timeframe.

