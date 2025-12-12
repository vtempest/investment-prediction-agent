
import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(
    request: NextRequest,
    { params }: { params: { symbol: string } }
) {
    try {
        const { symbol } = params;
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '1mo'; // 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        const interval = searchParams.get('interval') || '1d'; // 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

        // yahoo-finance2 'chart' method or 'historical'
        // 'chart' is often more robust for ranges
        const queryOptions = { period1: range, interval: interval as any };
        
        // Note: yahoo-finance2 chart API might use slightly different options, 
        // but 'historical' is standard. Let's use 'historical' with calculated dates or just 'chart' if supported.
        // Actually, 'chart' is supported in many versions but let's check docs or stick to 'historical' if unsure.
        // But 'historical' needs dates. 'query' (search) is different.
        // A safer bet defined in types is available. wrapper usually exposes 'historical'.
        // Let's try to map range to start/end dates for 'historical'.
        
        let startDate = new Date();
        const endDate = new Date();
        
        switch(range) {
            case '1mo': startDate.setMonth(startDate.getMonth() - 1); break;
            case '3mo': startDate.setMonth(startDate.getMonth() - 3); break;
            case '6mo': startDate.setMonth(startDate.getMonth() - 6); break;
            case '1y': startDate.setFullYear(startDate.getFullYear() - 1); break;
            default: startDate.setMonth(startDate.getMonth() - 1); // default 1mo
        }

        const queryPeriod1 = startDate.toISOString().split('T')[0];
        const queryPeriod2 = endDate.toISOString().split('T')[0];

        const result = await yahooFinance.historical(symbol, {
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
