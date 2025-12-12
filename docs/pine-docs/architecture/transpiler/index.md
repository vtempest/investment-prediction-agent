---
layout: default
title: Transpiler
parent: Architecture
has_children: true
nav_order: 1
permalink: /architecture/transpiler/
---

# PineTS Transpiler Architecture

The transpiler is responsible for converting user-written "PineTS" code (which mimics Pine Script syntax) into executable JavaScript that runs within the PineTS runtime environment.

## The Pipeline

The transpilation process follows a multi-pass pipeline:

```
Input Code String/Function
        ↓
┌─────────────────────────┐
│  0. Wrapper Check     │
│  • Detect if code is  │
│    already wrapped in │
│    a function         │
│  • Auto-wrap unwrapped│
│    code in (context)  │
│    => { ... }         │
└───────┬─────────────────┘
        ↓
┌─────────────────────────┐
│  1. Parse to AST      │ (using acorn)
│     (ECMAScript AST)  │
└───────┬─────────────────┘
        ↓
┌─────────────────────────┐
│  2. Pre-Processing    │
│  • Transform nested   │
│    arrow functions    │
│  • Normalize native   │
│    imports (aliasing) │
│  • Inject implicit    │
│    imports (context.*)│
│  • Identify context-  │
│    bound variables    │
└───────┬─────────────────┘
        ↓
┌─────────────────────────┐
│  3. Analysis Pass     │
│  • Register functions │
│  • Track parameters   │
│  • Build scope tree   │
│  • Destructure arrays │
└───────┬─────────────────┘
        ↓
┌─────────────────────────┐
│  4. Transformation    │
│  • Variable scoping   │
│  • Series wrapping    │
│  • Expression Unwrapping│ (Hoisting)
│  • param() injection  │
│  • ID generation      │
└───────┬─────────────────┘
        ↓
┌─────────────────────────┐
│  5. Post-Processing   │
│  • Transform == to    │
│    $.math.__eq()      │
└───────┬─────────────────┘
        ↓
┌─────────────────────────┐
│  6. Code Generation   │ (using astring)
│     (Final JS code)   │
└─────────────────────────┘
```

### Pipeline Details

1.  **Pre-Processing**:

    -   **Wrapper Check**: Ensures code is wrapped in a function: `(context) => { ... }`.
    -   **Implicit Imports**: Injects `const { close } = context.data` etc. if missing.
    -   **Normalization**: Prevents renaming of native symbols (e.g. `const { close: c } = ...` -> `const { close } = ...`).

2.  **Parsing**:

    -   Uses `acorn` to parse code into an ESTree-compatible AST.

3.  **Analysis Pass (`AnalysisPass.ts`)**:

    -   Scans the AST to build a **Scope Tree**.
    -   Registers function declarations and parameters.
    -   Identifies "Context-Bound" variables (variables that come from `context.data` or `context.pine`).

4.  **Transformation Pass (`MainTransformer.ts`)**:

    -   Traverses the AST and modifies nodes based on rules.
    -   **Variable Renaming**: Transforms `let x = 10` into `$.let.glb1_x = ...` using the `ScopeManager`.
    -   **Series Wrapping**: Wraps inputs to functions with `param()`.
    -   **Expression Unwrapping**: Hoists complex expressions into temporary variables to ensure correct execution order.

5.  **Post-Processing**:

    -   Transforms equality checks (`==`, `===`) into `$.math.__eq()` calls to handle `NaN` correctly.

6.  **Code Generation**:
    -   Uses `astring` to generate the final JavaScript string from the modified AST.

## Key Components

-   **ScopeManager**: Tracks variable scopes, renames variables to avoid collisions (`glb1_`, `fn2_`), and manages unique IDs.
-   **Transformers**: Specialized classes (`ExpressionTransformer`, `StatementTransformer`) that handle specific AST node types.
