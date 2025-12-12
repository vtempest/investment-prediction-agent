/*
# US Stock Symbols

A GitHub Action runs daily to fetch the latest data from offical APIs of NASDAQ, NYSE, and AMEX.

## Output
- **`stock-names.json`**: A JSON array containing tickers and their cleaned names.
  ```json
  [
    ["AAPL", "Apple Inc."],
    ["MSFT", "Microsoft Corporation"],
    ...
  ]
  ```
*/

import fs from 'fs';

const OUTPUT_FILE = 'data/stock-names.json';

// Configuration for output fields
// 'symbol' is the ticker
// 'name' is the company name (will be cleaned)
// 'cik' is the SEC Central Index Key
// Other available fields from API: lastsale, netchange, pctchange, marketCap, country, ipoyear, volume, sector, industry, url
const CONFIG = {
    fields: ['symbol', 'name', 'sector', 'industry', 'marketCap', 'cik']
};

const SEC_URL = 'https://www.sec.gov/files/company_tickers.json';

/*
"0":{"cik_str":1045810,"ticker":"NVDA","title":"NVIDIA CORP"},"1":{"cik_str":320193,"ticker":"AAPL","title":"Apple Inc."},"2":{"cik_str":1652044,"ticker":"GOOGL","title":"Alphabet Inc."},"3":{"cik_str":789019,"ticker":"MSFT","title":"MICROSOFT CORP"},"4":{"cik_str":1018724,"ticker":"AMZN","title":"AMAZON COM INC"},"5":{"cik_str":1730168,"ticker":"AVGO","title":"Broadcom Inc."},"6":{"cik_str":1326801,"ticker":"META","title":"Meta Platforms, Inc."},"7":{"cik_str":1318605,"ticker":"TSLA","title":"Tesla, Inc."},"8":{"cik_str":1067983,"ticker":"BRK-B","title":"BERKSHIRE HATHAWAY INC"},"9":{"cik_str":104169,"ticker":"WMT","title":"Walmart Inc."},"10":{"cik_str":59478,"ticker":"LLY","title":"ELI LILLY & Co"},"11":{"cik_str":19617,"ticker":"JPM","title":"JPMORGAN CHASE & CO"},"12":{"cik_str":1403161,"ticker":"V","title":"VISA INC."},"13":{"cik_str":1341439,"ticker":"ORCL","title":"ORACLE CORP"},"14":{"cik_str":884394,"ti
*/
const EXCHANGES = ['nasdaq', 'nyse', 'amex'];
const BASE_URL = 'https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true';

const SUFFIXES = [
    " American Depositary Shares",
    " Depositary Shares",
    " Ordinary Shares",
    " Common Stock",
    " Common Shares",
    " Capital Stock",
    " Units",
    " Warrants",
    " Warrant",
    " Rights",
    " Preferred Stock",
    " Preferred Shares",
    " Depositary Share", // Singular
    " Ordinary Share",   // Singular
    " Common Share"      // Singular
];

const cleanName = (name: string) => {
    let cleaned = name;
    for (const suffix of SUFFIXES) {
        // Escape special regex chars if any (though our list is simple text)
        // We want to match the suffix and anything after it (.*)
        // Case insensitive match "i" to catch "ordinary share" vs "Ordinary Share"
        const regex = new RegExp(suffix + ".*$", "i");
        if (regex.test(cleaned)) {
            cleaned = cleaned.replace(regex, "");
            break; // Stop after first match to avoid over-cleaning? 
                   // Usually one main asset type per name.
        }
    }
    return cleaned;
};

const formatMarketCap = (cap: string | number) => {
    if (!cap) return null;
    // Remove ',' and '$' if present, then parse
    const num = parseFloat(String(cap).replace(/,/g, '').replace(/\$/g, ''));
    if (isNaN(num)) return null;
    // Round to millions
    return Math.round(num / 1000000);
};

async function fetchData(exchange: string) {
    const url = `${BASE_URL}&exchange=${exchange}`;
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:85.0) Gecko/20100101 Firefox/85.0'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Request failed. Status Code: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error(`Error fetching ${exchange}:`, err);
        return null; // Return null on error so Promise.all doesn't reject entirely if we handle it
    }
}

async function fetchSecData() {
    const SEC_FILE = 'data/company_tickers.json';
    
    try {
        console.log('Loading SEC CIK data from local file...');
        
        // Check if file exists
        if (!fs.existsSync(SEC_FILE)) {
            console.warn(`SEC data file not found: ${SEC_FILE}`);
            console.warn('Skipping CIK data. Download from: https://www.sec.gov/files/company_tickers.json');
            return { tickerToCik: new Map(), secCompanies: new Map() };
        }
        
        const fileContent = fs.readFileSync(SEC_FILE, 'utf-8');
        const data = JSON.parse(fileContent);
        
        // Parse SEC data: {"0": {"cik_str": 1045810, "ticker": "NVDA", "title": "NVIDIA CORP"}, ...}
        const tickerToCik = new Map();
        const secCompanies = new Map();
        
        Object.values(data).forEach((item: any) => {
            if (item.ticker && item.cik_str) {
                tickerToCik.set(item.ticker, item.cik_str);
                secCompanies.set(item.ticker, {
                    ticker: item.ticker,
                    name: item.title,
                    cik: item.cik_str
                });
            }
        });
        
        console.log(`Loaded ${tickerToCik.size} SEC tickers with CIK numbers from local file`);
        return { tickerToCik, secCompanies };
    } catch (err) {
        console.error('Error loading SEC data:', err);
        return { tickerToCik: new Map(), secCompanies: new Map() };
    }
}

async function main() {
    try {
        console.log('Fetching stock data...');
        
        // Ensure output directory exists
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');
        }

        // Fetch both NASDAQ and SEC data concurrently
        const [nasdaqResults, secData] = await Promise.all([
            Promise.all(EXCHANGES.map(fetchData)),
            fetchSecData()
        ]);

        const { tickerToCik, secCompanies } = secData;

        const allRows: any[] = [];
        nasdaqResults.forEach(result => {
             if (result && result.data && result.data.rows) {
                 allRows.push(...result.data.rows);
             }
         });

        console.log(`Fetched ${allRows.length} total rows from NASDAQ/NYSE/AMEX.`);

        const uniqueTickers = new Map();
        
        allRows.forEach(row => {
            if (row.symbol) {
                const symbol = row.symbol.trim();
                
                // Deduplicate by symbol
                if (!uniqueTickers.has(symbol)) {
                    // Get CIK from SEC data
                    const cik = tickerToCik.get(symbol) || null;
                    
                    // Map config fields to values
                    const entry = CONFIG.fields.map(field => {
                        if (field === 'symbol') return symbol;
                        if (field === 'name') return cleanName(row.name ? row.name.trim() : '');
                        if (field === 'marketCap') return formatMarketCap(row.marketCap);
                        if (field === 'cik') return cik;
                        return (row as any)[field];
                    });
                    uniqueTickers.set(symbol, entry);
                }
            }
        });

        console.log(`Unique tickers from NASDAQ/NYSE/AMEX: ${uniqueTickers.size}`);

        // Add missing tickers from SEC that weren't in NASDAQ data
        let addedFromSec = 0;
        secCompanies.forEach((secCompany, ticker) => {
            if (!uniqueTickers.has(ticker)) {
                // Create entry with SEC data: [symbol, name, null, null, null, cik]
                const entry = CONFIG.fields.map(field => {
                    if (field === 'symbol') return ticker;
                    if (field === 'name') return cleanName(secCompany.name);
                    if (field === 'cik') return secCompany.cik;
                    return null; // sector, industry, marketCap will be null
                });
                uniqueTickers.set(ticker, entry);
                addedFromSec++;
            }
        });

        console.log(`Added ${addedFromSec} additional tickers from SEC data`);
        console.log(`Total unique tickers: ${uniqueTickers.size}`);
        console.log(`Output fields: ${JSON.stringify(CONFIG.fields)}`);

        // One output as a Map values iterator
        // Convert map values to array and sort by the first field (usually symbol)
        const outputList = Array.from(uniqueTickers.values())
            .sort((a, b) => {
                const valA = String(a[0] || '');
                const valB = String(b[0] || '');
                return valA.localeCompare(valB);
            });

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputList));
        console.log(`Successfully wrote to ${OUTPUT_FILE}`);

        // Extract just the symbols for the second output file
        // // const symbolsOnly = outputList.map(entry => entry[0]);
        // // const OUTPUT_FILE_SYMBOLS = 'data/stock-symbols.json';
        // // fs.writeFileSync(OUTPUT_FILE_SYMBOLS, JSON.stringify(symbolsOnly));
        // console.log(`Successfully wrote to ${OUTPUT_FILE_SYMBOLS}`);

        // Generate sector info
        // entry indices based on CONFIG: 0=symbol, 1=name, 2=sector, 3=industry, 4=marketCap, 5=cik
        const sectorInfo: Record<string, any> = {};
        const overallInfo: any = {
             sector: "Overall US Public Stocks",
             totalCompanies: 0,
             totalMarketCap: 0,
             industries: {}, 
             companies: []
        };

        outputList.forEach(item => {
            const symbol = item[0];
            const name = item[1];
            const sector = item[2] || 'Unknown';
            // Trim industry name
            const industry = String(item[3] || 'Unknown').trim();
            const marketCap = typeof item[4] === 'number' ? item[4] : 0; 
            // item[5] is CIK, not needed for sector aggregation 

            // Sector aggregation
            if (!sectorInfo[sector]) {
                sectorInfo[sector] = {
                    totalCompanies: 0,
                    totalMarketCap: 0,
                    industries: {}, // Changed to object
                    companies: []
                };
            }
            sectorInfo[sector].totalCompanies++;
            sectorInfo[sector].totalMarketCap += marketCap;
            
            // Sector Industry aggregation
            if (!sectorInfo[sector].industries[industry]) {
                sectorInfo[sector].industries[industry] = {
                    name: industry,
                    totalCompanies: 0,
                    totalMarketCap: 0,
                    symbols: []
                };
            }
            sectorInfo[sector].industries[industry].totalCompanies++;
            sectorInfo[sector].industries[industry].totalMarketCap += marketCap;
            sectorInfo[sector].industries[industry].symbols.push(symbol);

            sectorInfo[sector].companies.push({ symbol, name, marketCap });

            // Overall aggregation
            overallInfo.totalCompanies++;
            overallInfo.totalMarketCap += marketCap;
            
            // Overall Industry aggregation (Keep calculating if we ever need it, but we won't output it for Overall)
            /* 
            if (!overallInfo.industries[industry]) {
                overallInfo.industries[industry] = {
                    name: industry,
                    totalCompanies: 0,
                    totalMarketCap: 0
                };
            }
            overallInfo.industries[industry].totalCompanies++;
            overallInfo.industries[industry].totalMarketCap += marketCap;
            */

            overallInfo.companies.push({ symbol, name, marketCap });
        });

        const processInfo = (info: any, sectorName: string, includeIndustries = true) => {
             // Sort companies by market cap desc
            info.companies.sort((a: any, b: any) => b.marketCap - a.marketCap);
            
            // Top 10
            const top10 = info.companies.slice(0, 10);

            // Process and sort industries
            let industriesList = [] as any;
            if (includeIndustries) {
                industriesList = Object.values(info.industries)
                    .sort((a: any, b: any) => b.totalMarketCap - a.totalMarketCap);
            }

            const result: any = {
                sector: sectorName,
                totalCompanies: info.totalCompanies,
                totalMarketCap: info.totalMarketCap,
                top10Companies: top10,
            };

            if (includeIndustries) {
                result.industries = industriesList;
            }

            return result;
        };

        const finalSectorOutput = Object.keys(sectorInfo).map(sector => processInfo(sectorInfo[sector], sector, true));

        // Sort sectors by Total Market Cap descending
        finalSectorOutput.sort((a, b) => b.totalMarketCap - a.totalMarketCap);

        // Add Overall entry at the top, without industries
        finalSectorOutput.unshift(processInfo(overallInfo, "Overall US Public Stocks", false));

        const OUTPUT_FILE_SECTORS = 'data/sector-info.json';
        fs.writeFileSync(OUTPUT_FILE_SECTORS, JSON.stringify(finalSectorOutput, null, 2)); // Pretty print for readability
        console.log(`Successfully wrote to ${OUTPUT_FILE_SECTORS}`);

    } catch (err) {
        console.error('An error occurred:', err);
        process.exit(1);
    }
}

main();
