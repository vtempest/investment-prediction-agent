import { NextRequest, NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['ripHistorical'] });

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ symbol: string }> }
) {
    try {
        const { symbol } = await params;
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '1mo'; // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        const interval = searchParams.get('interval') || '1d'; // 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

        // Calculate start date based on range
        let startDate = new Date();
        const endDate = new Date();

        switch(range) {
            case '1d':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case '5d':
                startDate.setDate(startDate.getDate() - 5);
                break;
            case '1mo':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case '3mo':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case '6mo':
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '1y':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            case '2y':
                startDate.setFullYear(startDate.getFullYear() - 2);
                break;
            case '5y':
                startDate.setFullYear(startDate.getFullYear() - 5);
                break;
            case '10y':
                startDate.setFullYear(startDate.getFullYear() - 10);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 1); // default 1mo
        }

        const queryPeriod1 = startDate.toISOString().split('T')[0];
        const queryPeriod2 = endDate.toISOString().split('T')[0];

        const result = await yahooFinance.chart(symbol, {
            period1: queryPeriod1,
            period2: queryPeriod2,
            interval: interval as any
        });

        return NextResponse.json({
            success: true,
            symbol,
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Chart API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch chart data',
                code: 'CHART_ERROR',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
