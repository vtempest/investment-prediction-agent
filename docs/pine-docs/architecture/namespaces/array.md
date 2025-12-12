---
layout: default
title: Array (array)
parent: Namespaces
nav_order: 3
permalink: /architecture/namespaces/array/
---

# PineTS Array (`array`) Namespace

This directory contains the implementation of Pine Script's `array.*` namespace functions. These functions manage dynamically sized arrays, distinct from time-series variables.

## Architecture

Functions are factory functions accessing the `context`.

## The `param()` Method

**Crucial Difference**: unlike `ta` or `math`, the `array.param()` method returns the **raw value**, not a `Series` object.

```typescript
export function param(context: any) {
    return (source: any, index: number = 0) => {
        return Series.from(source).get(index);
    };
}
```

### Why?
`array.*` functions (like `array.new`, `array.push`) operate on specific array instances or scalar values at the current bar. They do not operate on the "history" of an array variable in the same way `ta.sma` operates on the history of `close`.

## Pine Array Object

PineTS implements a `PineArrayObject` (or uses native JS arrays with specific handling) to mimic Pine Script array behavior (e.g., distinct from time-series arrays).

## Implementation Specifics

### 1. Mutability
Pine Script arrays are mutable references. `array.push(id, value)` modifies the array in place.

### 2. Type Safety
While JavaScript is loosely typed, Pine Script arrays are typed (`float[]`, `int[]`, etc.). The implementation may enforce or ignore strict typing depending on the specific method's requirements.

## Generating the Barrel File

To regenerate the `array.index.ts` file:

```bash
npm run generate:array-index
```

