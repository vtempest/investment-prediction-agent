# Swagger UI Integration Guide

## Overview

The Stock P/E Calculator API includes Swagger UI for interactive API documentation. This provides a user-friendly interface to explore and test all API endpoints.

## Accessing Swagger UI

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:3000/api-docs
   ```

## Features

### 1. Interactive API Testing

Swagger UI allows you to test API endpoints directly from the browser:

- Click on any endpoint to expand it
- Click "Try it out" button
- Fill in the required parameters
- Click "Execute" to make the API call
- View the response in real-time

### 2. Endpoint Documentation

Each endpoint shows:
- HTTP method and path
- Required and optional parameters
- Request body schema (if applicable)
- Response codes and schemas
- Example requests and responses

### 3. Schema Definitions

View detailed schemas for:
- Request parameters
- Response objects
- Error formats
- Data models

## Example: Testing the P/E Ratio Endpoint

1. Navigate to http://localhost:3000/api-docs
2. Scroll to "P/E Ratio" section
3. Click on `GET /api/pe-ratio/{symbol}`
4. Click "Try it out"
5. Enter parameters:
   - symbol: `AAPL`
   - startDate: `2023-01-01`
   - endDate: `2024-12-31`
   - interval: `1mo`
6. Click "Execute"
7. View the response with P/E statistics and data

## Customization

The Swagger UI is configured with:
- Custom title: "Stock P/E Calculator API Documentation"
- Hidden top bar for cleaner interface
- Full OpenAPI 3.0 specification support

## OpenAPI Specification

The raw OpenAPI specification is available at:
```
http://localhost:3000/openapi.yaml
```

You can use this file to:
- Generate client SDKs in various languages
- Import into API testing tools (Postman, Insomnia)
- Share API documentation with team members
- Validate API contracts

## Benefits

✅ **No setup required** - Works out of the box  
✅ **Interactive testing** - Test endpoints without writing code  
✅ **Always up-to-date** - Documentation synced with implementation  
✅ **Standards-based** - Uses OpenAPI 3.0 specification  
✅ **Developer-friendly** - Clear, visual interface  

## Screenshots

### Main Interface
The Swagger UI shows all available endpoints organized by tags (Quote, Historical, P/E Ratio, System).

### Endpoint Details
Each endpoint displays:
- Description and summary
- Parameters with types and constraints
- Response schemas with examples
- Try-it-out functionality

### Response Viewer
After executing a request, you can see:
- Response code
- Response headers
- Response body (formatted JSON)
- Curl command equivalent

## Integration with Development Workflow

### 1. API Design
Use Swagger UI to review and validate API design before implementation.

### 2. Testing
Test endpoints during development without writing test scripts.

### 3. Documentation
Share the Swagger UI URL with team members for API reference.

### 4. Client Generation
Export the OpenAPI spec to generate client libraries:
```bash
# Download the spec
curl http://localhost:3000/openapi.yaml > openapi.yaml

# Generate client (example with openapi-generator)
openapi-generator-cli generate -i openapi.yaml -g javascript -o ./client
```

## Troubleshooting

### Swagger UI not loading
- Ensure server is running: `npm start`
- Check console for errors
- Verify openapi.yaml file exists

### Endpoints not appearing
- Check openapi.yaml syntax
- Restart server after modifying openapi.yaml
- Clear browser cache

### CORS errors when testing
- CORS is enabled by default in the API
- Check browser console for specific errors

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [API Design Best Practices](https://swagger.io/resources/articles/best-practices-in-api-design/)
