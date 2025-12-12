---
layout: default
title: Series Class
parent: Runtime
nav_order: 2
permalink: /architecture/runtime/series/
---

# Series Class (`Series.ts`)

The `Series` class is the bridge between JavaScript arrays and Pine Script semantics.

## Storage Strategy: Forward vs. Reverse

### Visual Representation

```
Pine Script Perspective (User View):
[Bar 0, Bar 1, Bar 2, Bar 3, ..., Bar N]
   ↑
  Current bar (index 0)

PineTS Internal Storage (Forward Order):
[Bar 0, Bar 1, Bar 2, ..., Bar N-1, Bar N]
   ↑                                   ↑
  Oldest bar                     Newest bar (current)

Series Access Layer:
Series.get(0) → Bar N (most recent)
Series.get(1) → Bar N-1 (previous)
Series.get(n) → Bar N-n (n bars ago)
```

### Why Forward Storage with Series Wrapper?

1.  **Pine Script Compatibility**: The Series class provides `series[0]` = current bar semantics
2.  **Efficient Appending**: New bars are added with `.push()` at the end
3.  **Natural Storage**: Matches chronological order of market data
4.  **Reverse Index Calculation**: `Series.get(index)` translates to `data[length - 1 - index]`

**Internal Storage**: Standard JavaScript array, **forward chronological order** (oldest at index 0, newest at end).

**External Access**: Pine Script **reverse indexing** (0 = current, 1 = previous).

## The `Series` Wrapper

```typescript
class Series {
    constructor(public data: any[], public offset: number = 0) {}

    // Get value at Pine Script index (0 = current, 1 = previous, etc.)
    get(index: number): any {
        const realIndex = this.data.length - 1 - (this.offset + index);
        if (realIndex < 0 || realIndex >= this.data.length) {
            return NaN;
        }
        return this.data[realIndex];
    }

    // Set value at Pine Script index
    set(index: number, value: any): void {
        const realIndex = this.data.length - 1 - (this.offset + index);
        if (realIndex >= 0 && realIndex < this.data.length) {
            this.data[realIndex] = value;
        }
    }
}
```

**Key Features:**

-   **Offset Support**: Enables lookback operations like `close[1]` by creating a new Series with `offset = 1`
-   **Automatic NaN**: Returns NaN for out-of-bounds access (Pine Script behavior)
-   **Forward Array**: Wraps a standard forward-ordered array

### Offset Handling

When you do `close[1]`, PineTS doesn't copy the array. It creates a lightweight `Series` wrapper with `offset = 1`.

```
close (offset = 0):
Series.get(0) → data[length - 1 - (0 + 0)] = data[length - 1] = last element

close[1] (offset = 1):
Series.get(0) → data[length - 1 - (1 + 0)] = data[length - 2] = second-to-last
```

-   `close`: `offset = 0`. `get(0)` -> last element.
-   `close[1]`: `offset = 1`. `get(0)` -> second to last element.

This allows efficient passing of "historical views" to functions without data duplication.

## Series Growth Pattern

At the end of each iteration, all series grow by pushing the current value:

```
Before iteration N+1: [val0, val1, ..., valN]
                                          ↑ current
                                          index N-1

After processing N+1:  [val0, val1, ..., valN, valN+1]
                                          ↑       ↑
                                          [1]     [0] current
                                          index   index N
                                          N-1

Access via $.get():
  $.get(arr, 0) → arr[N]     (current)
  $.get(arr, 1) → arr[N-1]   (previous)
```

## Series.from() Helper

Many TA functions use `Series.from()` to normalize inputs:

```typescript
static from(source: any): Series {
    if (source instanceof Series) return source;
    if (Array.isArray(source)) return new Series(source);
    return new Series([source]); // Wrap scalar in array
}
```

This allows functions to accept:

-   Series objects (pass through)
-   Arrays (wrap in Series)
-   Scalar values (wrap in single-element array, then Series)
