---
layout: default
title: Input (input)
parent: Namespaces
nav_order: 5
permalink: /architecture/namespaces/input/
---

# PineTS Input (`input`) Namespace

This directory contains the implementation of Pine Script's `input.*` namespace functions. These functions handle user inputs/parameters for indicators.

## Architecture

Functions are factory functions accessing the `context`.

## The `param()` Method

The `input.param()` method returns the value wrapped in a **single-element array**: `[val]`.

```typescript
return [val];
```

### Purpose
This wrapping might be a historical artifact or used to distinguish input values from standard scalar values in the `Context.init()` logic, similar to how tuple returns are wrapped in double brackets.

## Implementation Specifics

### 1. Constant Nature
In Pine Script, `input` values are constant throughout the script execution (except for `input.source` or `input.price` which might vary if mapped to changing data).

### 2. Types
Functions like `input.int`, `input.float`, `input.bool` perform validation or casting to ensure the provided value matches the expected type.

## Generating the Barrel File

To regenerate the `input.index.ts` file:

```bash
npm run generate:input-index
```

