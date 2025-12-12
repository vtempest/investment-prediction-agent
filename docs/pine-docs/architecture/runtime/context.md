---
layout: default
title: Context Class
parent: Runtime
nav_order: 1
permalink: /architecture/runtime/context/
---

# The Context Class (`Context.class.ts`)

The `Context` is the central object (usually named `$`) passed to the transpiled function. It acts as the container for:

1.  **Market Data**: `$.data.open`, `$.data.close`, etc.
2.  **User Variables**: `$.let`, `$.const`, `$.var`.
3.  **Function State**: `$.taState`, `$.params`.
4.  **Namespaces**: `$.ta`, `$.math`, `$.request`, `$.pine`.

## Initialization (`init`)

The `init` method is used for every variable assignment.

```typescript
init(target, source, index = 0)
```

*   If `target` exists, it updates the current value.
*   If `target` is null, it creates a new `Series`.
*   It handles converting raw values or arrays into `Series`.

## Accessors (`get` / `set`)

PineTS uses specific accessors to handle Pine Script indexing semantics.

*   `get(series, index)`: Returns `series[length - 1 - index]`. Index 0 is the most recent item.
*   `set(series, value)`: Updates `series[length - 1]`.

## Precision

All numeric outputs are routed through `context.precision()` to enforce consistent decimal rounding (default 10 places), matching Pine Script behavior.

