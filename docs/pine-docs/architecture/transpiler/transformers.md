---
layout: default
title: Transformers
parent: Transpiler
nav_order: 2
permalink: /architecture/transpiler/transformers/
---

# Code Transformers

The transformation logic is split into specialized transformers found in `src/transpiler/transformers/`.

## WrapperTransformer
Ensures the user code is wrapped in a standard context function:
```javascript
(context) => {
    // user code
}
```

## NormalizationTransformer
Prevents users from aliasing standard Pine Script symbols in import destructuring. This ensures the transpiler can reliably identify standard variables like `close` or `ta`.

## InjectionTransformer
Scans for usage of standard variables (like `close`, `open`) and injects the necessary destructuring statements if they are missing:
```javascript
const { close, open } = context.data;
```

## MainTransformer & StatementTransformer
These handle the bulk of the logic:

*   **Variable Declaration**: Transforms `let x = ...` into `$.let.scope_x = $.init(...)`.
*   **Assignment**: Transforms `x = ...` into `$.set($.let.scope_x, ...)`.
*   **Array Access**: Transforms `x[1]` into `$.get($.let.scope_x, 1)`.
*   **Loops/Conditionals**: Ensures scoping rules are respected within blocks.

## ExpressionTransformer
Handles expressions, primarily function calls and binary operations.

*   **Function Calls**: Injects `param()` wrappers around arguments.
*   **Hoisting**: "Unwraps" nested calls. `ta.ema(ta.sma(close, 10), 10)` is transformed into:
    1. Calculate SMA -> temp var.
    2. Calculate EMA using temp var.
    This simplifies the generated code and ensures proper order of operations for stateful functions.

