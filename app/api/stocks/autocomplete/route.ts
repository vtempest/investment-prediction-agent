// Stock Autocomplete API Route
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STOCK_NAMES_FILE = path.join(process.cwd(), 'lib/data/stock-names.json');
let stockCache: any[] | null = null;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.toLowerCase();
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!query || query.length < 1) {
            return NextResponse.json({ success: true, data: [] });
        }

        // Cache stock data in memory for performance
        if (!stockCache) {
            if (fs.existsSync(STOCK_NAMES_FILE)) {
                const fileContent = fs.readFileSync(STOCK_NAMES_FILE, 'utf-8');
                stockCache = JSON.parse(fileContent);
            } else {
                return NextResponse.json(
                    { success: false, error: 'Stock data not available' },
                    { status: 503 }
                );
            }
        }

        // Filter stocks: match beginning of symbol OR includes in name
        // Optimize for speed: simple loop
        const results = [];
        if (stockCache) {
            for (const stock of stockCache) {
                // stock format: [symbol, name, sector, industry, marketCap, cik]
                const symbol = String(stock[0] || '').toLowerCase();
                const name = String(stock[1] || '').toLowerCase();

                if (symbol.startsWith(query) || name.includes(query)) {
                    results.push({
                        symbol: stock[0],
                        name: stock[1]
                    });
                    if (results.length >= limit) break;
                }
            }
        }

        return NextResponse.json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error: any) {
        console.error('Autocomplete Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch suggestions' },
            { status: 500 }
        );
    }
}
