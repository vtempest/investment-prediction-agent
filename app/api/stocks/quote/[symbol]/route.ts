// Stock Quote API Route
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
        const modulesParam = searchParams.get('modules');

        const modules = modulesParam
            ? modulesParam.split(',')
            : ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData'];

        const data = await yahooFinance.quoteSummary(symbol, { modules: modules as any });

        return NextResponse.json({
            success: true,
            symbol,
            data,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch quote',
                code: 'QUOTE_ERROR',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
