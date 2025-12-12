---
layout: default
title: Syntax Evolution
parent: Architecture
nav_order: 7
permalink: /architecture/syntax-evolution/
---

# Syntax Evolution and Deprecation

PineTS is evolving to provide a more unified and cleaner API surface. While older syntax patterns remain supported for backward compatibility, they may trigger runtime warnings.

## The Unified Namespace Pattern

### ✅ Recommended (New Syntax)

Destructure all Pine Script namespaces and built-in functions from `context.pine`. This creates a cleaner import section that mirrors Pine Script's unified environment.

```javascript
(context) => {
    const { close, open, high, low, hlc3, volume } = context.data;
    // Import everything from context.pine - unified namespace
    const { plotchar, color, plot, na, nz, ta, math } = context.pine;

    const sma = ta.sma(close, 20);
    const abs = math.abs(sma - close);
};
```

**Transpiled Output:**

```javascript
($) => {
    const { close, open, high, low, hlc3, volume } = $.data;
    const { plotchar, color, plot, na, nz, ta, math } = $.pine;
    // ... rest of transpiled code
};
```

### ⚠️ Deprecated (Old Syntax)

Accessing namespaces directly from the context root or splitting imports between `context.core` and direct assignments is considered legacy behavior and may trigger warnings.

```javascript
(context) => {
    const { close, open, high, low, hlc3, volume } = context.data;
    const { plotchar, color, plot, na, nz } = context.core; // ⚠️ Legacy: context.core
    const ta = context.ta; // ⚠️ Legacy: Direct access
    const math = context.math; // ⚠️ Legacy: Direct access

    const sma = ta.sma(close, 20);
    const abs = math.abs(sma - close);
};
```

**Transpiled Output:**

```javascript
($) => {
    const { close, open, high, low, hlc3, volume } = $.data;
    const { plotchar, color, plot, na, nz } = $.core; // ⚠️ Deprecated
    const ta = $.ta; // ⚠️ Deprecated
    const math = $.math; // ⚠️ Deprecated
    // ... rest of transpiled code
};
```

## Key Differences

1.  **`context.pine` vs `context.core`**: Use `context.pine` as the single source of truth for Pine Script functions and variables. The `context.core` namespace is deprecated.

2.  **Namespace Access**: Prefer destructuring `ta`, `math`, `array`, etc., from `context.pine` rather than accessing them directly from `context.ta`, `context.math`, etc.

3.  **Consistency**: The new syntax provides a single, consistent pattern that's easier to understand and maintain.

## Migration Guide

### Before (Old Syntax)

```javascript
(context) => {
    const { close, open } = context.data;
    const { plot, color } = context.core;
    const ta = context.ta;
    const math = context.math;
    const array = context.array;

    // Your indicator logic
};
```

### After (New Syntax)

```javascript
(context) => {
    const { close, open } = context.data;
    const { plot, color, ta, math, array } = context.pine;

    // Your indicator logic (unchanged)
};
```

## Backward Compatibility

-   **Old syntax still works**: Existing indicators using the old syntax will continue to function correctly.
-   **Runtime warnings**: Indicators using deprecated syntax may log warnings to help developers migrate.
-   **No breaking changes**: The transpiler handles both syntaxes identically after normalization.
-   **Gradual migration**: You can migrate indicators at your own pace.

## Why the Change?

1.  **Simplification**: One unified namespace (`context.pine`) instead of multiple access patterns.
2.  **Clarity**: Clear distinction between market data (`context.data`) and Pine Script functions (`context.pine`).
3.  **Maintainability**: Easier to document and understand for new users.
4.  **Future-proofing**: Provides a cleaner foundation for future API enhancements.

## Complete Example

### Old Style (Still Works)

```javascript
(context) => {
    // Scattered imports from different sources
    const { close, open, high, low } = context.data;
    const { plotchar, plot, color } = context.core;
    const ta = context.ta;
    const math = context.math;

    // Indicator logic
    let ema = ta.ema(close, 9);
    let diff = math.abs(ema - close);
    plotchar(diff, 'diff', { color: color.red });
};
```

### New Style (Recommended)

```javascript
(context) => {
    // Clean, unified imports
    const { close, open, high, low } = context.data;
    const { plotchar, plot, color, ta, math } = context.pine;

    // Indicator logic (identical)
    let ema = ta.ema(close, 9);
    let diff = math.abs(ema - close);
    plotchar(diff, 'diff', { color: color.red });
};
```

## Timeline

-   **Current**: Both syntaxes supported, warnings for old syntax
-   **Future**: Old syntax may be removed in major version update (with ample notice)
-   **Recommendation**: Migrate to new syntax at your earliest convenience

## Getting Help

If you encounter issues migrating to the new syntax:

1.  Check the transpiled output for any errors
2.  Review this documentation
3.  Open an issue on GitHub with your code example
