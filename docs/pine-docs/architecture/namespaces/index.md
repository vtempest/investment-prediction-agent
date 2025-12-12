---
layout: default
title: Namespaces
parent: Architecture
nav_order: 3
permalink: /architecture/namespaces/
---

# Namespace Architecture

PineTS mimics Pine Script's namespacing (`ta.`, `math.`, `request.`) through modular namespace classes attached to the `Context`.

## Common Pattern: The Factory

Every function in a namespace is implemented using a factory pattern:

```typescript
// Factory receives the Context
export function myFunc(context: any) {
    // Returns the actual function to be called by user code
    return (arg1, arg2, _callId) => {
        // Logic accessing context...
    };
}
```

## The `param()` Function

Each namespace implements its own `param()` function. This is the interface between the transpiler and the runtime.

-   **Input**: Raw value, Array, or Series.
-   **Output**: `Series` object (usually), or raw value (for `array` namespace).

### Why different `param()` implementations?

1.  **`ta` / `math`**: Need to operate on **Series**. They wrap scalars in Series so `.get(0)` works universally.
2.  **`array`**: Operates on **Pine Array Objects**. `param()` returns the raw object/value, not a Series wrapper.
3.  **`request`**: Handles **Tuples** and needs the **Parameter ID** for caching secondary contexts.

## Property-Like Access (Universal Method Pattern)

In Pine Script, namespace members can be accessed without parentheses:

```pinescript
// Pine Script - property-like access
tr1 = ta.tr        // No parentheses
tr2 = ta.tr(true)  // With parameter
pi = math.pi       // Constant access
```

### PineTS Unified Approach

PineTS simplifies this by implementing **everything as methods**. The transpiler automatically converts property access to method calls. This eliminates the complexity of maintaining separate getters and methods.

#### How It Works

1. **Implementation**: All namespace members are implemented as methods (even constants):

```typescript
// Indicator with optional parameter
export function tr(context: any) {
    return (handle_na?: any) => {
        const handleNa = handle_na !== undefined ? Series.from(handle_na).get(0) : true;
        // ... calculation logic
    };
}

// Constant (zero-parameter method)
export function pi(context: any) {
    return () => Math.PI;
}
```

2. **Transpiler Transformation**: When the transpiler encounters namespace member access without parentheses, it automatically adds them:

```javascript
// User writes:
const tr = ta.tr;
const pi = math.pi;

// Transpiler converts to:
const tr = ta.tr();
const pi = math.pi();
```

3. **Explicit Calls**: Methods called with parentheses work normally:

```javascript
// User writes:
const tr = ta.tr(true);

// Transpiler passes through (with parameter wrapping):
const tr = ta.tr(ta.param(true, undefined, 'p0'), '_ta0');
```

#### Transpiler Logic

The transformation applies to **direct namespace access** for known Pine Script namespaces (`ta`, `math`, `request`, `array`, `input`):

```typescript
// ✅ Transformed: Direct namespace access (all members)
ta.tr          → ta.tr()
ta.ema         → ta.ema()
math.pi        → math.pi()
math.abs       → math.abs()

// ✅ Not transformed: Already a call
ta.tr()        → ta.tr()
ta.tr(true)    → ta.tr(true)

// ✅ Not transformed: Variable assignment
const myTa = context.ta;
myTa.tr        → myTa.tr  (no transformation)
```

#### Benefits of This Approach

1. **Simplicity**: Single implementation pattern for all namespace members
2. **No Special Cases**: No need to distinguish between "getters" and "methods"
3. **Consistency**: All namespace functions follow the same factory pattern
4. **Flexibility**: Easy to add optional parameters to any function
5. **Maintainability**: Less code, fewer edge cases to handle
6. **Performance**: No overhead from property getters or descriptor lookups

#### Examples in PineTS

**All namespace members work the same way:**

```javascript
// Indicators with optional parameters
const tr1 = ta.tr; // Auto-converted to ta.tr()
const tr2 = ta.tr(true); // With parameter

// Indicators with required parameters
const ema = ta.ema; // Auto-converted to ta.ema() (transpiler adds params)
const ema2 = ta.ema(close, 14); // With explicit parameters

// Constants (zero-parameter methods)
const pi = math.pi; // Auto-converted to math.pi()
const e = math.e; // Auto-converted to math.e()
```

### Why Not JavaScript Getters?

Prior to this approach, PineTS used JavaScript getters for some namespace members. This created unnecessary complexity:

-   ❌ Two different patterns to maintain (getters vs methods)
-   ❌ Getters couldn't accept optional parameters
-   ❌ Required special handling in the namespace class
-   ❌ More complex barrel file generation

**The unified method approach solves all of these issues** by treating everything the same way.

## Specific Namespace Details

For implementation details of specific namespaces, see their source READMEs:

-   [Technical Analysis (`ta`)](./ta.md)
-   [Math (`math`)](./math.md)
-   [Array (`array`)](./array.md)
-   [Request (`request`)](./request.md)
-   [Input (`input`)](./input.md)
