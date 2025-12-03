
### Basic Usage

Calculate P/E ratios for a single stock:

```javascript
const HistoricalPECalculator = require('./pe');
const yahooFinance = require('yahoo-finance2').default;

async function basicExample() {
    // Suppress Yahoo Finance notices
    yahooFinance.suppressNotices(['ripHistorical', 'yahooSurvey']);
    
    const calculator = new HistoricalPECalculator();
    
    const result = await calculator.calculateHistoricalPEForStock(
        'MSFT',
        '2022-01-01',
        '2024-12-31',
        '1wk'  // Weekly data
    );
    
    // Display statistics
    console.log('P/E Statistics:');
    console.log(`  Current P/E: ${result.statistics.current.toFixed(2)}`);
    console.log(`  Average P/E: ${result.statistics.average.toFixed(2)}`);
    console.log(`  Median P/E: ${result.statistics.median.toFixed(2)}`);
    console.log(`  Min P/E: ${result.statistics.min.toFixed(2)}`);
    console.log(`  Max P/E: ${result.statistics.max.toFixed(2)}`);
}

basicExample();
```

### Export to CSV

Export historical P/E data to a CSV file:

```javascript
const HistoricalPECalculator = require('./pe');
const fs = require('fs');

async function exportExample() {
    const calculator = new HistoricalPECalculator();
    
    await calculator.calculateHistoricalPEForStock(
        'GOOGL',
        '2023-01-01',
        '2024-12-31',
        '1mo'
    );
    
    // Export to CSV
    const csvData = calculator.exportToCSV();
    fs.writeFileSync('GOOGL_historical_pe.csv', csvData);
    console.log('Data exported to GOOGL_historical_pe.csv');
}

exportExample();
```

### Multiple Stocks Comparison

Compare P/E ratios across multiple stocks:

```javascript
const HistoricalPECalculator = require('./pe');

async function compareStocks() {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    const results = {};
    
    for (const symbol of symbols) {
        const calculator = new HistoricalPECalculator();
        
        try {
            const result = await calculator.calculateHistoricalPEForStock(
                symbol,
                '2023-01-01',
                '2024-12-31',
                '1mo'
            );
            
            results[symbol] = result.statistics;
        } catch (error) {
            console.error(`Error processing ${symbol}:`, error.message);
        }
    }
    
    // Display comparison
    console.log('\nP/E Ratio Comparison:');
    console.log('Symbol | Current | Average | Median | Min | Max');
    console.log('-------|---------|---------|--------|-----|----');
    
    for (const [symbol, stats] of Object.entries(results)) {
        console.log(
            `${symbol.padEnd(6)} | ` +
            `${stats.current?.toFixed(2).padEnd(7)} | ` +
            `${stats.average.toFixed(2).padEnd(7)} | ` +
            `${stats.median.toFixed(2).padEnd(6)} | ` +
            `${stats.min.toFixed(2).padEnd(3)} | ` +
            `${stats.max.toFixed(2)}`
        );
    }
}

compareStocks();
```

### Custom Date Range with Daily Data

Get detailed daily P/E ratios:

```javascript
const HistoricalPECalculator = require('./pe');

async function dailyPEExample() {
    const calculator = new HistoricalPECalculator();
    
    const result = await calculator.calculateHistoricalPEForStock(
        'TSLA',
        '2024-01-01',
        '2024-03-31',
        '1d'  // Daily intervals
    );
    
    // Get recent P/E ratios
    const recentPE = result.peRatios
        .filter(item => item.peRatio !== null)
        .slice(-10);
    
    console.log('Last 10 trading days:');
    recentPE.forEach(item => {
        console.log(
            `${item.date.toISOString().split('T')[0]}: ` +
            `Price=$${item.price.toFixed(2)}, ` +
            `EPS=$${item.ttmEPS.toFixed(4)}, ` +
            `P/E=${item.peRatio.toFixed(2)}`
        );
    });
}

dailyPEExample();
```

### Access Individual Components

Use individual methods for custom workflows:

```javascript
const HistoricalPECalculator = require('./pe');

async function customWorkflow() {
    const calculator = new HistoricalPECalculator();
    
    // Step 1: Fetch price data
    await calculator.fetchHistoricalPrices(
        'NVDA',
        '2023-01-01',
        '2024-12-31',
        '1mo'
    );
    
    // Step 2: Fetch earnings data
    await calculator.fetchEarningsData('NVDA');
    
    // Step 3: Calculate P/E ratios
    calculator.calculateHistoricalPE();
    
    // Step 4: Get statistics
    const stats = calculator.getPEStatistics();
    
    // Step 5: Access raw data
    console.log('Price data points:', calculator.priceData.length);
    console.log('Earnings periods:', calculator.earningsData.length);
    console.log('P/E calculations:', calculator.peRatios.length);
    console.log('Statistics:', stats);
}

customWorkflow();
```

## API Reference

### Class: `HistoricalPECalculator`

#### Constructor

```javascript
const calculator = new HistoricalPECalculator();
```

Creates a new instance of the calculator.

#### Methods

##### `calculateHistoricalPEForStock(symbol, startDate, endDate, interval)`

Main method to calculate historical P/E ratios.

**Parameters:**
- `symbol` (string): Stock ticker symbol (e.g., 'AAPL')
- `startDate` (string): Start date in 'YYYY-MM-DD' format
- `endDate` (string): End date in 'YYYY-MM-DD' format
- `interval` (string, optional): Data interval - '1d', '1wk', or '1mo' (default: '1mo')

**Returns:** Promise<Object>
```javascript
{
    priceData: Array,      // Historical price data
    earningsData: Array,   // Earnings data
    peRatios: Array,       // Calculated P/E ratios
    statistics: Object     // Statistical summary
}
```

##### `fetchHistoricalPrices(symbol, startDate, endDate, interval)`

Fetch historical price data.

**Parameters:** Same as `calculateHistoricalPEForStock`

**Returns:** Promise<Array> - Array of price data objects

##### `fetchEarningsData(symbol)`

Fetch earnings data for calculating TTM EPS.

**Parameters:**
- `symbol` (string): Stock ticker symbol

**Returns:** Promise<Array> - Array of earnings data objects

##### `calculateTTMEPS(targetDate)`

Calculate trailing twelve-month EPS for a specific date.

**Parameters:**
- `targetDate` (Date): Target date for TTM calculation

**Returns:** number|null - TTM EPS value or null if insufficient data

##### `calculateHistoricalPE()`

Calculate P/E ratios for all price data points.

**Returns:** Array - Array of P/E ratio objects

##### `getPEStatistics()`

Get statistical summary of P/E ratios.

**Returns:** Object|null
```javascript
{
    count: number,      // Number of valid P/E ratios
    min: number,        // Minimum P/E ratio
    max: number,        // Maximum P/E ratio
    average: number,    // Average P/E ratio
    median: number,     // Median P/E ratio
    current: number     // Most recent P/E ratio
}
```

##### `exportToCSV()`

Export data to CSV format.

**Returns:** string - CSV formatted data

#### Properties

- `priceData` (Array): Historical price data
- `earningsData` (Array): Processed earnings data
- `peRatios` (Array): Calculated P/E ratios

## Error Handling

The library includes comprehensive error handling:

```javascript
const HistoricalPECalculator = require('./pe');

async function withErrorHandling() {
    const calculator = new HistoricalPECalculator();
    
    try {
        const result = await calculator.calculateHistoricalPEForStock(
            'INVALID',  // Invalid symbol
            '2023-01-01',
            '2024-12-31',
            '1mo'
        );
    } catch (error) {
        if (error.message.includes('Could not fetch')) {
            console.error('Data fetch error:', error.message);
        } else if (error.message.includes('Could not obtain')) {
            console.error('No EPS data available for this stock');
        } else {
            console.error('Unexpected error:', error);
        }
    }
}
```

## Troubleshooting

### No P/E Ratios Calculated

**Problem:** The calculator returns empty P/E ratios.

**Solutions:**
1. Extend the date range further back (e.g., start from 2020-01-01)
2. Verify the stock has sufficient earnings history
3. Try a different stock symbol
4. Check if the stock is newly listed

### Limited Earnings Data

**Problem:** Only current TTM EPS is available (fallback method used).

**Solutions:**
1. This is normal for some stocks with limited historical data
2. The calculator will use current EPS for all historical periods (approximation)
3. Results will be less accurate but still useful for trend analysis

### API Rate Limiting

**Problem:** Yahoo Finance API returns errors after multiple requests.

**Solutions:**
1. Add delays between requests when processing multiple stocks:
```javascript
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
```
2. Process stocks in smaller batches
3. Cache results to avoid repeated API calls

### Date Range Issues

**Problem:** No data returned for specified date range.

**Solutions:**
1. Ensure dates are in 'YYYY-MM-DD' format
2. Verify the stock was trading during the specified period
3. Use valid intervals: '1d', '1wk', or '1mo'

## Data Intervals

- `'1d'` - Daily data (best for short-term analysis, < 1 year)
- `'1wk'` - Weekly data (good for medium-term analysis, 1-3 years)
- `'1mo'` - Monthly data (best for long-term analysis, > 3 years)

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[docs/WALKTHROUGH.md](./docs/WALKTHROUGH.md)** - Complete project walkthrough with examples
- **[docs/SWAGGER_GUIDE.md](./docs/SWAGGER_GUIDE.md)** - Swagger UI integration guide
- **[docs/README.md](./docs/README.md)** - Documentation index

### Quick Links

- 📖 [Complete Walkthrough](./docs/WALKTHROUGH.md) - Full project guide
- 🔧 [Swagger UI Guide](./docs/SWAGGER_GUIDE.md) - Interactive API testing
- 📄 [OpenAPI Specification](./openapi.yaml) - API specification
- 💻 [Code Examples](./examples/) - Usage examples
- 🧪 [Unit Tests](./pe.test.js) - Test suite

## Limitations

1. **Historical Earnings Data**: Yahoo Finance may have limited historical earnings data for some stocks
2. **TTM Calculation**: Requires at least 4 quarters of earnings data for accurate TTM EPS
3. **Fallback Method**: When detailed earnings unavailable, uses current TTM EPS (approximation)
4. **API Dependency**: Relies on Yahoo Finance API availability and data quality

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT


## Stocks API Integration

This application now includes a comprehensive stocks API that provides:

### Yahoo Finance Data
- **Stock Quotes** - Real-time stock quotes and financial data
- **Historical Prices** - Historical price data with customizable intervals
- **P/E Ratios** - Historical P/E ratio calculations with statistics
- **Market Discovery** - Search, trending stocks, daily gainers, and screeners

### SEC Filing Data
- **Filing Metadata** - Retrieve SEC filing metadata by ticker/form
- **Filing Downloads** - Download actual SEC filing documents
- **Company Filings** - Get all filings for a specific company

### API Endpoints

All endpoints are available at `/api/stocks/*` and `/api/sec/*`:

```bash
# Stock quote
GET /api/stocks/quote/{symbol}

# Historical data
GET /api/stocks/historical/{symbol}?period1=2024-01-01&period2=2024-12-31

# P/E ratios
GET /api/stocks/pe-ratio/{symbol}?startDate=2023-01-01&endDate=2024-12-31

# Search
GET /api/stocks/search?q=apple

# SEC filings
GET /api/sec/filings/metadata?query=AAPL/10-Q/3
```

See [docs/STOCKS_API.md](./docs/STOCKS_API.md) for complete API documentation.

### Library Usage

You can also use the core libraries directly:

```typescript
import { HistoricalPECalculator } from '@/lib/stocks/pe-calculator';
import { Downloader } from '@/lib/stocks/sec-downloader';

// Calculate P/E ratios
const calculator = new HistoricalPECalculator();
const result = await calculator.calculateHistoricalPEForStock('AAPL', '2023-01-01', '2024-12-31', '1mo');

// Download SEC filings
const downloader = new Downloader('My App', 'email@example.com');
const metadatas = await downloader.getFilingMetadatas('AAPL/10-Q/3');
```

## Acknowledgments

- Built with [yahoo-finance2](https://github.com/gadicc/node-yahoo-finance2)
- Inspired by the need for historical valuation analysis tools
