---
layout: default
title: Best Practices
parent: Architecture
nav_order: 6
permalink: /architecture/best-practices/
---

# Best Practices and Common Pitfalls

This guide covers common mistakes and recommended patterns when working with PineTS.

## Common Pitfalls

### ⚠️ Pitfall 1: Confusing Storage Order vs Access Order

**Problem:**

```javascript
// Thinking arrays are stored in reverse
let lastValue = context.data.close[0]; // ❌ Actually OLDEST bar!
let currentValue = context.data.close[context.data.close.length - 1]; // ✅ Current bar
```

**Explanation:**

-   **Storage**: Forward order (oldest at `[0]`, newest at `[length-1]`)
-   **Access via `$.get()` or Series**: Pine Script semantics (0 = current, 1 = previous)

**Solution:**

```javascript
// ✅ Always use $.get() or Series for Pine Script semantics
let currentValue = context.get(close, 0); // Current
let previousValue = context.get(close, 1); // Previous

// Or with Series
let currentValue = Series.from(close).get(0);
let previousValue = Series.from(close).get(1);

// ❌ Direct array access gives chronological order
close[0]; // Oldest bar (not current!)
```

### ⚠️ Pitfall 2: Modifying Transpiler Without Understanding Scope

**Problem:**
Changing variable transformation logic can break scope isolation and cause variable collisions.

```javascript
// ❌ Bad: Removing scope prefixes
$.let.x = $.init($.let.x, value); // Collisions possible!

// ✅ Good: Keep scope prefixes
$.let.glb1_x = $.init($.let.glb1_x, value);
$.let.fn2_x = $.init($.let.fn2_x, value); // Different variable
```

**Solution:**

-   Always test with the transpiler test suite
-   Understand the scope tree before modifying
-   Respect the ScopeManager's variable naming conventions

### ⚠️ Pitfall 3: Not Handling NaN Properly

**Problem:**

```javascript
// ❌ JavaScript NaN behavior
if (value == NaN) { ... }  // Will NEVER be true in JavaScript
value === NaN;  // Always false
```

**Solution:**

```javascript
// ✅ The transpiler automatically converts == to $.math.__eq()
if (value == NaN) { ... }  // Transpiled to $.math.__eq(value, NaN)

// ✅ Or use isNaN()
if (isNaN(value)) { ... }

// ✅ In TA functions, check before updating state
const current = Series.from(source).get(0);
if (!isNaN(current)) {
    state.sum += current;  // Avoid NaN corruption
}
```

### ⚠️ Pitfall 4: Sharing State Across Function Calls

**Problem:**

```javascript
// Two calls with same parameters should be independent
let ema1 = ta.ema(close, 9);
let ema2 = ta.ema(close, 9); // ❌ Could share state without call IDs
```

**Explanation:**
Without unique call IDs, both calls would use the same state key (`ema_9`), causing them to return identical values.

**Solution:**

```javascript
// ✅ Transpiler automatically injects unique call IDs
// Transpiled:
// ta.ema(close, 9, '_ta0')  // First call
// ta.ema(close, 9, '_ta1')  // Second call

// ✅ In TA function implementation, ALWAYS use _callId
export function ema(context: any) {
    return (source: any, period: any, _callId?: string) => {
        const stateKey = _callId || `ema_${period}`; // Use unique ID
        // ...
    };
}
```

### ⚠️ Pitfall 5: Not Initializing Variables with $.init()

**Problem:**

```javascript
// ❌ Direct assignment bypasses Series initialization
$.let.var = someValue; // Won't work as time-series
```

**Solution:**

```javascript
// ✅ Always use $.init() for assignments
$.let.var = $.init($.let.var, someValue);

// Note: Transpiler handles this automatically for user code
```

### ⚠️ Pitfall 6: Incorrect Tuple Return Format

**Problem:**

```javascript
// ❌ Returning plain array (ambiguous with time-series)
export function myFunc(context: any) {
    return (source: any) => {
        return [value1, value2]; // Is this a tuple or time-series?
    };
}
```

**Solution:**

```javascript
// ✅ Wrap tuple in double brackets
export function myFunc(context: any) {
    return (source: any) => {
        return [[value1, value2]]; // Clear tuple marker
    };
}
```

### ⚠️ Pitfall 7: Forgetting context.precision()

**Problem:**

```javascript
// ❌ Returning raw floating point (inconsistent precision)
return sum / period; // 14.666666666666667
```

**Solution:**

```javascript
// ✅ Use context.precision() for consistent rounding
return context.precision(sum / period); // 14.6666666667 (10 decimals)
```

### ⚠️ Pitfall 8: Recalculating Instead of Incremental Updates

**Problem:**

```javascript
// ❌ Inefficient: Recalculate entire history every bar
export function sma(context: any) {
    return (source: any, period: any) => {
        let sum = 0;
        for (let i = 0; i < period; i++) {
            sum += Series.from(source).get(i); // O(n) per bar
        }
        return sum / period;
    };
}
```

**Solution:**

```javascript
// ✅ Efficient: Incremental calculation with state
export function sma(context: any) {
    return (source: any, period: any, _callId?: string) => {
        const stateKey = _callId || `sma_${period}`;

        if (!context.taState[stateKey]) {
            context.taState[stateKey] = { window: [], sum: 0 };
        }

        const state = context.taState[stateKey];
        const current = Series.from(source).get(0);

        state.window.push(current);
        state.sum += current;

        if (state.window.length > period) {
            state.sum -= state.window.shift(); // O(1) per bar
        }

        return state.window.length >= period ? context.precision(state.sum / period) : NaN;
    };
}
```

## Best Practices

### ✅ Best Practice 1: Always Use the Transpiler

**Don't write transpiled code manually.**

```javascript
// ❌ Bad: Manually writing transpiled code
const ema = (context) => {
    $.let.glb1_ema = $.init($.let.glb1_ema, ta.ema(...));
};

// ✅ Good: Write user code, let transpiler transform it
const ema = (context) => {
    let ema = ta.ema(close, 9);
};
```

### ✅ Best Practice 2: Test with Multiple Scenarios

When modifying the transpiler or implementing TA functions, test with:

-   Simple variable assignments
-   Complex nested expressions
-   Multiple function calls with same parameters
-   Array operations and lookback
-   Conditional logic (if/else)
-   Loops (for/while)
-   Tuple returns
-   Edge cases (NaN, empty data, single bar)

### ✅ Best Practice 3: Understand the Context

Before debugging, understand what the context contains:

```javascript
// Check context state
console.log('Variables:', context.let);
console.log('Parameters:', context.params);
console.log('TA State:', context.taState);
console.log('Current Index:', context.idx);
console.log('Market Data Length:', context.data.close.length);
```

### ✅ Best Practice 4: Respect the Scope Manager

The ScopeManager tracks:

-   Variable scopes and renaming
-   Context-bound variables
-   Loop variables
-   Array pattern elements
-   Parameter and cache ID generation

**Don't bypass it or modify its state inconsistently.**

### ✅ Best Practice 5: Implement Incremental TA Functions

**Key Points:**

-   Use `_callId` for unique state per function call
-   Extract values from Series using `.get(0)` or `Series.from()`
-   Maintain internal state (window, sum, etc.) for efficiency
-   Return `NaN` during initialization period (Pine Script behavior)
-   Use `context.precision()` for consistent decimal precision

**Template:**

```typescript
export function myIndicator(context: any) {
    return (source: any, period: any, _callId?: string) => {
        // 1. Extract values
        const periodValue = Series.from(period).get(0);
        const currentValue = Series.from(source).get(0);

        // 2. Initialize state
        const stateKey = _callId || `myInd_${periodValue}`;
        if (!context.taState[stateKey]) {
            context.taState[stateKey] = {
                // Initial state
            };
        }

        const state = context.taState[stateKey];

        // 3. Handle NaN inputs
        if (isNaN(currentValue)) {
            return NaN;
        }

        // 4. Update state incrementally
        // ... your calculation logic ...

        // 5. Return with precision
        return context.precision(result);
    };
}
```

### ✅ Best Practice 6: Handle Initialization Periods

```javascript
// ✅ Return NaN until enough data is available
if (state.window.length < period) {
    return NaN; // Pine Script behavior
}

// Calculate and return
return context.precision(state.sum / period);
```

### ✅ Best Practice 7: Use Namespace-Specific param()

```javascript
// ✅ Each namespace has its own param
ta.param(value, index, 'p0'); // For TA functions
math.param(value, index, 'p1'); // For math functions
request.param(value, index, 'p2'); // For request functions

// ❌ Don't use context.param for namespace functions
context.param(value, index, 'p0'); // Use namespace-specific one instead
```

### ✅ Best Practice 8: Document Complex Transformations

```javascript
// ✅ Add comments explaining non-obvious behavior
export function complexIndicator(context: any) {
    return (source: any, _callId?: string) => {
        // State stores a rolling window of 14 bars for efficiency.
        // We maintain both sum and sum-of-squares to calculate
        // standard deviation in O(1) time per bar.
        const state = context.taState[_callId];
        // ...
    };
}
```

### ✅ Best Practice 9: Use TypeScript Types

```typescript
// ✅ Type your state structures
interface EMAState {
    prevEma: number | null;
    initSum: number;
    initCount: number;
}

export function ema(context: any) {
    return (source: any, period: any, _callId?: string): number => {
        const state: EMAState = context.taState[_callId];
        // ... TypeScript will catch mistakes
    };
}
```

### ✅ Best Practice 10: Clean Up Temporary Files

If you create temporary files for debugging:

```javascript
// After development, remove:
// - Debug console.log statements
// - Temporary test files
// - Commented-out code
// - Unused imports
```

### ✅ Best Practice 11: Implement All Namespace Members as Methods

**Everything in namespaces is a method** - even constants. The transpiler handles the conversion from property access to method calls:

```typescript
// ✅ CORRECT: Indicator with optional parameter
export function tr(context: any) {
    return (handle_na?: any) => {
        const handleNa = handle_na !== undefined ? Series.from(handle_na).get(0) : true;
        // ... implementation
    };
}

// ✅ CORRECT: Constant (zero-parameter method)
export function pi(context: any) {
    return () => Math.PI;
}

// ❌ WRONG: Don't use JavaScript getters
// (These belong in getters/ directory which is deprecated)
```

**Key Points:**

-   Always implement in `methods/` directory
-   Use optional parameters when needed
-   The transpiler automatically converts `ta.tr` to `ta.tr()`
-   No special cases - everything follows the same pattern
-   Simpler to maintain and extend

## Performance Best Practices

### 1. Use Incremental Calculations

**Avoid:** O(n) per bar
**Prefer:** O(1) per bar with state

### 2. Cache Expensive Computations

```javascript
// ✅ Cache in context
if (!context.cache[cacheKey]) {
    context.cache[cacheKey] = expensiveCalculation();
}
return context.cache[cacheKey];
```

### 3. Avoid Redundant Series Wrapping

```javascript
// ❌ Wasteful
for (let i = 0; i < 1000; i++) {
    Series.from(source).get(0); // Creates 1000 Series objects
}

// ✅ Efficient
const series = Series.from(source);
for (let i = 0; i < 1000; i++) {
    series.get(0); // Reuses Series object
}
```

### 4. Limit State Size

```javascript
// ✅ Store only what you need
state.window = state.window.slice(-period); // Keep fixed size

// ❌ Don't store entire history
state.history.push(value); // Grows indefinitely
```

## Code Organization

### Structure for New TA Functions

```
src/namespaces/ta/methods/
    myindicator.ts          ← Implementation
tests/namespaces/
    ta.myindicator.test.ts  ← Unit tests
```

### Regenerate Barrel Files

```bash
# After adding new method
npm run generate:ta-index
npm run generate:math-index
npm run generate:array-index
# etc.
```

## Testing Checklist

Before submitting TA function implementations:

-   [ ] Returns `NaN` during initialization period
-   [ ] Uses `_callId` for state isolation
-   [ ] Uses `context.precision()` for output
-   [ ] Handles `NaN` inputs gracefully
-   [ ] Implements incremental calculation (if applicable)
-   [ ] Includes unit tests with expected values
-   [ ] Tested with multiple calls (same parameters)
-   [ ] Tested with edge cases (single bar, all NaN, etc.)
-   [ ] Regenerated barrel file (`npm run generate:*-index`)
