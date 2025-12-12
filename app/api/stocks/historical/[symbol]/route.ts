// Historical Stock Data API Route
import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(
    request: NextRequest,
    { params }: { params: { symbol: string } }
) {
    try {
        const { symbol } = params;
        const { searchParams } = new URL(request.url);

        // Get parameters with defaults
        const interval = searchParams.get('interval') || '1d';
        const range = searchParams.get('range') || '1mo'; // default to 1 month
        
        // Allow either period1/period2 OR range
        const period1Param = searchParams.get('period1');
        const period2Param = searchParams.get('period2');

        let queryOptions: any = {
            interval: interval as any
        };

        // If period1 and period2 are provided, use them
        if (period1Param && period2Param) {
            queryOptions.period1 = period1Param;
            queryOptions.period2 = period2Param;
        } else {
            // Otherwise use range (defaults to 1mo)
            queryOptions.period1 = range;
        }

        console.log(`Fetching historical data for ${symbol} with options:`, queryOptions);

        const result = await yahooFinance.chart(symbol, queryOptions);

        if (!result || !result.quotes || result.quotes.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `No historical data found for ${symbol}`,
                    code: 'NO_DATA',
                    timestamp: new Date().toISOString()
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            symbol,
            period: {
                start: result.quotes[0]?.date || period1Param || range,
                end: result.quotes[result.quotes.length - 1]?.date || period2Param || 'now'
            },
            interval,
            dataPoints: result.quotes.length,
            data: result.quotes,
            meta: {
                currency: result.meta?.currency,
                symbol: result.meta?.symbol,
                exchangeName: result.meta?.exchangeName,
                instrumentType: result.meta?.instrumentType,
                firstTradeDate: result.meta?.firstTradeDate,
                regularMarketTime: result.meta?.regularMarketTime,
                gmtoffset: result.meta?.gmtoffset,
                timezone: result.meta?.timezone,
                exchangeTimezoneName: result.meta?.exchangeTimezoneName
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Historical data fetch error:', error);
        
        // Provide more helpful error messages
        let errorMessage = 'Failed to fetch historical data';
        let errorCode = 'HISTORICAL_ERROR';

        if (error.message?.includes('Invalid symbol')) {
            errorMessage = `Invalid symbol: ${params.symbol}`;
            errorCode = 'INVALID_SYMBOL';
        } else if (error.message?.includes('Not Found')) {
            errorMessage = `Symbol not found: ${params.symbol}`;
            errorCode = 'SYMBOL_NOT_FOUND';
        } else if (error.message) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                code: errorCode,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
