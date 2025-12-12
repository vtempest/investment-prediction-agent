# Scalar API Documentation Guide

This project uses [Scalar](https://github.com/scalar/scalar) for beautiful, interactive API documentation. Scalar provides a modern alternative to Swagger UI with better performance and developer experience.

## Why Scalar?

- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Interactive**: Test API endpoints directly in the browser
- **Fast**: Optimized performance with minimal bundle size
- **OpenAPI 3.1**: Full support for the latest OpenAPI specification
- **Search**: Powerful search functionality with keyboard shortcuts
- **Code Generation**: Automatic code examples in multiple languages

## Accessing API Documentation

### Development

Start the Next.js development server:

```bash
npm run dev
```

Then visit: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Production

The API documentation is available at `/api/docs` on your deployed domain.

## Features

### 1. Interactive Testing

- Click any endpoint to see detailed information
- Use "Try it out" to test endpoints directly
- View request/response examples
- See response schemas and status codes

### 2. Code Examples

Scalar automatically generates code examples in:
- JavaScript/TypeScript (fetch, axios)
- Python (requests)
- cURL
- Node.js
- PHP
- Go
- Ruby

### 3. Search

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open search:
- Search endpoints by name
- Search by tags
- Search by descriptions
- Jump to specific sections

### 4. Dark Mode

Scalar automatically respects your system's dark mode preference and integrates with Next.js theme.

## API Endpoints Documented

### Stocks
- `GET /api/stocks/trending` - Get trending stocks
- `GET /api/stocks/gainers` - Get top gainers
- `GET /api/stocks/search` - Search stocks
- `GET /api/stocks/quote/{symbol}` - Get stock quote
- `GET /api/stocks/historical/{symbol}` - Get historical data
- `POST /api/stocks/screener` - Screen stocks by criteria

### Trading Agents
- `POST /api/trading-agents` - AI-powered stock analysis
- `POST /api/groq-debate` - Fast debate analysis with Groq

### Backtesting
- `POST /api/backtest` - Run strategy backtest
- `POST /api/backtest-technical` - Technical strategy backtest

### SEC Filings
- `GET /api/sec/companies/{tickerOrCik}/filings` - Get company filings
- `GET /api/sec/filings/metadata` - Get filing metadata
- `GET /api/sec/filings/html` - Get filing HTML
- `GET /api/sec/filings/download` - Download filing

### User Portfolio
- `GET /api/user/portfolio` - Get portfolio summary
- `POST /api/user/portfolio/initialize` - Initialize portfolio

### User Strategies
- `GET /api/user/strategies` - List strategies
- `POST /api/user/strategies` - Create strategy
- `PUT /api/user/strategies/{id}` - Update strategy
- `DELETE /api/user/strategies/{id}` - Delete strategy

### User Signals
- `GET /api/user/signals` - Get watchlist signals

## Customization

The Scalar configuration is in `/app/api/docs/page.tsx`:

```typescript
<ApiReferenceReact
  configuration={{
    spec: {
      url: "/api/openapi",
    },
    theme: "default", // or "alternate", "moon", "purple", "solarized"
    layout: "modern", // or "classic"
    darkMode: true,
    searchHotKey: "k",
    showSidebar: true,
  }}
/>
```

### Available Themes

- `default` - Clean, professional look
- `alternate` - Alternative color scheme
- `moon` - Dark-first theme
- `purple` - Purple accent colors
- `solarized` - Solarized color palette

### Layout Options

- `modern` - Sidebar navigation with content area
- `classic` - Three-column layout

## Updating Documentation

### 1. Update OpenAPI Spec

Edit the OpenAPI specification in `/lib/openapi/spec.ts`:

```typescript
export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Your API",
    version: "1.0.0",
  },
  paths: {
    "/api/new-endpoint": {
      get: {
        summary: "Description",
        // ... endpoint definition
      }
    }
  }
}
```

### 2. Add New Schemas

Define reusable schemas in the `components.schemas` section:

```typescript
components: {
  schemas: {
    YourNewModel: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      }
    }
  }
}
```

### 3. Reference Schemas

Use `$ref` to reference schemas:

```typescript
responses: {
  "200": {
    description: "Successful response",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/YourNewModel" }
      }
    }
  }
}
```

## OpenAPI Specification

The raw OpenAPI spec is available at:
- Development: [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)
- Production: `https://your-domain.com/api/openapi`

You can use this URL with other OpenAPI tools like:
- Postman (import collection)
- Insomnia (import spec)
- OpenAPI Generator (generate client SDKs)

## Best Practices

### 1. Descriptive Summaries

```typescript
summary: "Get stock quote",
description: "Retrieves real-time quote data including price, volume, and market cap for a given stock symbol"
```

### 2. Clear Examples

```typescript
schema: {
  type: "string",
  example: "AAPL"
}
```

### 3. Use Tags

Organize endpoints with tags:

```typescript
tags: ["Stocks"]
```

### 4. Document Error Responses

```typescript
responses: {
  "200": { /* success */ },
  "404": {
    description: "Stock not found",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { type: "string" }
          }
        }
      }
    }
  }
}
```

### 5. Parameter Validation

```typescript
parameters: [
  {
    name: "symbol",
    in: "path",
    required: true,
    schema: {
      type: "string",
      pattern: "^[A-Z]{1,5}$",
      example: "AAPL"
    }
  }
]
```

## Troubleshooting

### Documentation Not Loading

1. Check that `/api/openapi` route returns valid JSON:
```bash
curl http://localhost:3000/api/openapi
```

2. Verify the OpenAPI spec is valid:
- Use [Swagger Editor](https://editor.swagger.io/)
- Paste your spec to check for errors

### Styles Not Applying

1. Ensure CSS import is present:
```typescript
import "@scalar/api-reference-react/style.css";
```

2. Check Next.js CSS configuration in `next.config.js`

### 404 on /api/docs

1. Verify file location: `/app/api/docs/page.tsx`
2. Check Next.js App Router is being used (not Pages Router)
3. Restart development server

## Advanced Features

### Authentication

Add security schemes to the OpenAPI spec:

```typescript
components: {
  securitySchemes: {
    BearerAuth: {
      type: "http",
      scheme: "bearer"
    }
  }
}

// Then apply to endpoints:
security: [{ BearerAuth: [] }]
```

### Multiple Servers

Document different environments:

```typescript
servers: [
  {
    url: "http://localhost:3000/api",
    description: "Development"
  },
  {
    url: "https://staging.example.com/api",
    description: "Staging"
  },
  {
    url: "https://api.example.com",
    description: "Production"
  }
]
```

### External Documentation

Link to additional resources:

```typescript
externalDocs: {
  description: "Full API Guide",
  url: "https://docs.example.com"
}
```

## Resources

- [Scalar Documentation](https://github.com/scalar/scalar)
- [Scalar Examples](https://github.com/scalar/scalar/tree/main/examples)
- [OpenAPI 3.1 Specification](https://spec.openapis.org/oas/v3.1.0)
- [OpenAPI Guide](https://learn.openapis.org/)

## Integration with Other Tools

### Postman

Import the OpenAPI spec into Postman:
1. Open Postman
2. Click "Import"
3. Enter: `http://localhost:3000/api/openapi`

### Generate Client SDKs

Use OpenAPI Generator:

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:3000/api/openapi \
  -g typescript-fetch \
  -o ./client
```

### CI/CD Integration

Add OpenAPI validation to your CI:

```yaml
# .github/workflows/validate-openapi.yml
name: Validate OpenAPI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Validate OpenAPI Spec
        uses: mbowman100/swagger-validator-action@master
        with:
          files: |
            lib/openapi/spec.ts
```

## Next Steps

1. Customize the theme to match your brand
2. Add authentication documentation
3. Include more detailed examples
4. Add webhooks documentation if applicable
5. Generate client SDKs for your users
6. Set up API versioning
