declare type ArrayStyle = 'form' | 'spaceDelimited' | 'pipeDelimited';

declare interface Auth {
    /**
     * Which part of the request do we use to send the auth?
     *
     * @default 'header'
     */
    in?: 'header' | 'query' | 'cookie';
    /**
     * Header or query parameter name.
     *
     * @default 'Authorization'
     */
    name?: string;
    scheme?: 'basic' | 'bearer';
    type: 'apiKey' | 'http';
}

declare type AuthToken = string | undefined;

export declare type BacktestRequest = {
    symbol: string;
    printlog?: boolean;
};

export declare type BacktestResponse = {
    success?: boolean;
    symbol?: string;
    primo_results?: {
        total_return?: number;
        sharpe_ratio?: number;
        max_drawdown?: number;
        win_rate?: number;
    };
    buyhold_results?: {
        [key: string]: unknown;
    };
    comparison?: {
        [key: string]: unknown;
    };
};

declare type BodySerializer = (body: any) => any;

declare type BuildUrlFn = <TData extends {
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    url: string;
}>(options: TData & Options_2<TData>) => string;

declare type Client = Client_2<RequestFn, Config, MethodFn, BuildUrlFn, SseFn> & {
    interceptors: Middleware<Request, Response, unknown, ResolvedRequestOptions>;
};

declare type Client_2<RequestFn = never, Config = unknown, MethodFn = never, BuildUrlFn = never, SseFn = never> = {
    /**
     * Returns the final request URL.
     */
    buildUrl: BuildUrlFn;
    getConfig: () => Config;
    request: RequestFn;
    setConfig: (config: Config) => Config;
} & {
    [K in HttpMethod]: MethodFn;
} & ([SseFn] extends [never] ? {
    sse?: never;
} : {
    sse: {
        [K in HttpMethod]: SseFn;
    };
});

export declare type ClientOptions = {
    baseUrl: 'https://autoinvestment.broker/api' | 'http://localhost:3000/api' | (string & {});
};

declare interface ClientOptions_2 {
    baseUrl?: string;
    responseStyle?: ResponseStyle;
    throwOnError?: boolean;
}

declare interface Config<T extends ClientOptions_2 = ClientOptions_2> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config_2 {
    /**
     * Base URL for all requests made by this client.
     */
    baseUrl?: T['baseUrl'];
    /**
     * Fetch API implementation. You can use this option to provide a custom
     * fetch instance.
     *
     * @default globalThis.fetch
     */
    fetch?: typeof fetch;
    /**
     * Please don't use the Fetch client for Next.js applications. The `next`
     * options won't have any effect.
     *
     * Install {@link https://www.npmjs.com/package/@hey-api/client-next `@hey-api/client-next`} instead.
     */
    next?: never;
    /**
     * Return the response data parsed in a specified format. By default, `auto`
     * will infer the appropriate method from the `Content-Type` response header.
     * You can override this behavior with any of the {@link Body} methods.
     * Select `stream` if you don't want to parse response data at all.
     *
     * @default 'auto'
     */
    parseAs?: 'arrayBuffer' | 'auto' | 'blob' | 'formData' | 'json' | 'stream' | 'text';
    /**
     * Should we return only data or multiple fields (data, error, response, etc.)?
     *
     * @default 'fields'
     */
    responseStyle?: ResponseStyle;
    /**
     * Throw an error instead of returning it in the response?
     *
     * @default false
     */
    throwOnError?: T['throwOnError'];
}

declare interface Config_2 {
    /**
     * Auth token or a function returning auth token. The resolved value will be
     * added to the request payload as defined by its `security` array.
     */
    auth?: ((auth: Auth) => Promise<AuthToken> | AuthToken) | AuthToken;
    /**
     * A function for serializing request body parameter. By default,
     * {@link JSON.stringify()} will be used.
     */
    bodySerializer?: BodySerializer | null;
    /**
     * An object containing any HTTP headers that you want to pre-populate your
     * `Headers` object with.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init See more}
     */
    headers?: RequestInit['headers'] | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined | unknown>;
    /**
     * The request method.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#method See more}
     */
    method?: Uppercase<HttpMethod>;
    /**
     * A function for serializing request query parameters. By default, arrays
     * will be exploded in form style, objects will be exploded in deepObject
     * style, and reserved characters are percent-encoded.
     *
     * This method will have no effect if the native `paramsSerializer()` Axios
     * API function is used.
     *
     * {@link https://swagger.io/docs/specification/serialization/#query View examples}
     */
    querySerializer?: QuerySerializer | QuerySerializerOptions;
    /**
     * A function validating request data. This is useful if you want to ensure
     * the request conforms to the desired shape, so it can be safely sent to
     * the server.
     */
    requestValidator?: (data: unknown) => Promise<unknown>;
    /**
     * A function transforming response data before it's returned. This is useful
     * for post-processing data, e.g. converting ISO strings into Date objects.
     */
    responseTransformer?: (data: unknown) => Promise<unknown>;
    /**
     * A function validating response data. This is useful if you want to ensure
     * the response conforms to the desired shape, so it can be safely passed to
     * the transformers and returned to the user.
     */
    responseValidator?: (data: unknown) => Promise<unknown>;
}

export declare type CreateStrategyRequest = {
    name: string;
    type: 'momentum' | 'mean-reversion' | 'breakout' | 'day-scalp';
    riskLevel?: 'low' | 'medium' | 'high';
};

export declare type DebateAnalysisResponse = {
    /**
     * Whether the analysis completed successfully
     */
    success: boolean;
    /**
     * Stock ticker symbol analyzed
     */
    symbol: string;
    /**
     * Analysis date
     */
    date: string;
    analysis?: {
        /**
         * Bullish arguments from Bull Researcher
         */
        bull_arguments?: Array<string>;
        /**
         * Bearish arguments from Bear Researcher
         */
        bear_arguments?: Array<string>;
        /**
         * Final investment decision from Research Manager
         */
        final_decision: 'BUY' | 'SELL' | 'HOLD' | 'REJECT';
        /**
         * Confidence in the decision
         */
        confidence_level: 'High' | 'Medium-High' | 'Medium' | 'Medium-Low' | 'Low';
        /**
         * Detailed reasoning for the decision
         */
        reasoning: string;
        /**
         * Risk management assessment
         */
        risk_assessment?: string;
        /**
         * Thesis compliance metrics
         */
        thesis_compliance?: {
            financial_health?: string;
            growth_score?: string;
            pe_ratio?: number;
            adr_status?: string;
            analyst_coverage?: number;
            compliance_percentage?: number;
        };
    };
    /**
     * Full debate conversation history
     */
    debate_history?: Array<{
        agent?: string;
        message?: string;
        timestamp?: string;
    }>;
    /**
     * Execution metadata
     */
    metadata?: {
        llm_provider?: string;
        deep_think_model?: string;
        quick_think_model?: string;
        debate_rounds?: number;
        total_tokens?: number;
        execution_time_ms?: number;
    };
    /**
     * Error message if analysis failed
     */
    error?: string;
};

/**
 * Delete strategy
 *
 * Delete a strategy
 */
export declare const deleteUserStrategiesById: <ThrowOnError extends boolean = false>(options: Options<DeleteUserStrategiesByIdData, ThrowOnError>) => RequestResult<DeleteUserStrategiesByIdResponses, unknown, ThrowOnError, "fields">;

export declare type DeleteUserStrategiesByIdData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/user/strategies/{id}';
};

export declare type DeleteUserStrategiesByIdResponses = {
    /**
     * Strategy deleted successfully
     */
    200: unknown;
};

declare type ErrInterceptor<Err, Res, Req, Options> = (error: Err, response: Res, request: Req, options: Options) => Err | Promise<Err>;

/**
 * Get debate analysis system info
 *
 * Retrieve information about available agents, models, and system capabilities
 */
export declare const getGroqDebate: <ThrowOnError extends boolean = false>(options?: Options<GetGroqDebateData, ThrowOnError>) => RequestResult<GetGroqDebateResponses, unknown, ThrowOnError, "fields">;

export declare type GetGroqDebateData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/groq-debate';
};

export declare type GetGroqDebateResponse = GetGroqDebateResponses[keyof GetGroqDebateResponses];

export declare type GetGroqDebateResponses = {
    /**
     * System information
     */
    200: {
        system?: string;
        version?: string;
        agents?: Array<string>;
        supported_providers?: Array<string>;
    };
};

/**
 * Get prediction markets
 *
 * Get active Polymarket prediction markets
 */
export declare const getPolymarketMarkets: <ThrowOnError extends boolean = false>(options?: Options<GetPolymarketMarketsData, ThrowOnError>) => RequestResult<GetPolymarketMarketsResponses, unknown, ThrowOnError, "fields">;

export declare type GetPolymarketMarketsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Max results (default: 20)
         */
        limit?: number;
        /**
         * Time window for sorting (24h, total)
         */
        window?: string;
    };
    url: '/polymarket/markets';
};

export declare type GetPolymarketMarketsResponses = {
    /**
     * Successful response
     */
    200: unknown;
};

/**
 * Get company SEC filings
 *
 * Retrieve SEC filings for a company
 */
export declare const getSecCompaniesByTickerOrCikFilings: <ThrowOnError extends boolean = false>(options: Options<GetSecCompaniesByTickerOrCikFilingsData, ThrowOnError>) => RequestResult<GetSecCompaniesByTickerOrCikFilingsResponses, unknown, ThrowOnError, "fields">;

export declare type GetSecCompaniesByTickerOrCikFilingsData = {
    body?: never;
    path: {
        /**
         * Stock ticker or CIK number
         */
        tickerOrCik: string;
    };
    query?: never;
    url: '/sec/companies/{tickerOrCik}/filings';
};

export declare type GetSecCompaniesByTickerOrCikFilingsResponses = {
    /**
     * Successful response
     */
    200: unknown;
};

/**
 * Autocomplete stock search
 *
 * Search for stocks by symbol or name prefix
 */
export declare const getStocksAutocomplete: <ThrowOnError extends boolean = false>(options: Options<GetStocksAutocompleteData, ThrowOnError>) => RequestResult<GetStocksAutocompleteResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksAutocompleteData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Search query string
         */
        q: string;
        /**
         * Max results (default: 10)
         */
        limit?: number;
    };
    url: '/stocks/autocomplete';
};

export declare type GetStocksAutocompleteResponse = GetStocksAutocompleteResponses[keyof GetStocksAutocompleteResponses];

export declare type GetStocksAutocompleteResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        count?: number;
        data?: Array<{
            symbol?: string;
            name?: string;
        }>;
    };
};

/**
 * Get delisted stocks
 *
 * Retrieve list of delisted stocks or check if a specific symbol is delisted
 */
export declare const getStocksDelisted: <ThrowOnError extends boolean = false>(options?: Options<GetStocksDelistedData, ThrowOnError>) => RequestResult<GetStocksDelistedResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksDelistedData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Optional: Check if specific symbol is delisted
         */
        symbol?: string;
        /**
         * Exchange code (default: US). Examples: US, LSE, TO
         */
        exchange?: string;
        /**
         * Number of results to return (default: 50)
         */
        limit?: number;
    };
    url: '/stocks/delisted';
};

export declare type GetStocksDelistedResponse = GetStocksDelistedResponses[keyof GetStocksDelistedResponses];

export declare type GetStocksDelistedResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        delisted?: boolean;
        count?: number;
        total?: number;
        data?: {
            symbol?: string;
            name?: string;
            delistedDate?: string;
            reason?: string;
        } | Array<{
            symbol?: string;
            name?: string;
            delistedDate?: string;
            reason?: string;
        }>;
    };
};

/**
 * Get top gainers
 *
 * Retrieve stocks with the highest gains
 */
export declare const getStocksGainers: <ThrowOnError extends boolean = false>(options?: Options<GetStocksGainersData, ThrowOnError>) => RequestResult<GetStocksGainersResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksGainersData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/stocks/gainers';
};

export declare type GetStocksGainersResponse = GetStocksGainersResponses[keyof GetStocksGainersResponses];

export declare type GetStocksGainersResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        data?: Array<Stock>;
    };
};

/**
 * Get historical data
 *
 * Get historical price data for a stock
 */
export declare const getStocksHistoricalBySymbol: <ThrowOnError extends boolean = false>(options: Options<GetStocksHistoricalBySymbolData, ThrowOnError>) => RequestResult<GetStocksHistoricalBySymbolResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksHistoricalBySymbolData = {
    body?: never;
    path: {
        /**
         * Stock symbol
         */
        symbol: string;
    };
    query?: {
        /**
         * Time period (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max)
         */
        period?: string;
        /**
         * Data interval (1m, 5m, 15m, 30m, 1h, 1d, 1wk, 1mo)
         */
        interval?: string;
    };
    url: '/stocks/historical/{symbol}';
};

export declare type GetStocksHistoricalBySymbolResponse = GetStocksHistoricalBySymbolResponses[keyof GetStocksHistoricalBySymbolResponses];

export declare type GetStocksHistoricalBySymbolResponses = {
    /**
     * Successful response
     */
    200: HistoricalData;
};

/**
 * Get stock quote
 *
 * Get current price and details for a stock symbol
 */
export declare const getStocksQuoteBySymbol: <ThrowOnError extends boolean = false>(options: Options<GetStocksQuoteBySymbolData, ThrowOnError>) => RequestResult<GetStocksQuoteBySymbolResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksQuoteBySymbolData = {
    body?: never;
    path: {
        /**
         * Stock symbol (e.g., AAPL)
         */
        symbol: string;
    };
    query?: never;
    url: '/stocks/quote/{symbol}';
};

export declare type GetStocksQuoteBySymbolResponse = GetStocksQuoteBySymbolResponses[keyof GetStocksQuoteBySymbolResponses];

export declare type GetStocksQuoteBySymbolResponses = {
    /**
     * Successful response
     */
    200: StockQuote;
};

/**
 * Search stocks
 *
 * Search for stocks by symbol or company name
 */
export declare const getStocksSearch: <ThrowOnError extends boolean = false>(options: Options<GetStocksSearchData, ThrowOnError>) => RequestResult<GetStocksSearchResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksSearchData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Search query
         */
        q: string;
    };
    url: '/stocks/search';
};

export declare type GetStocksSearchResponse = GetStocksSearchResponses[keyof GetStocksSearchResponses];

export declare type GetStocksSearchResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        data?: Array<StockSearchResult>;
    };
};

/**
 * Get sector information
 *
 * Retrieve aggregated sector data, including total companies, market cap, and top companies. Can filter by specific sector.
 */
export declare const getStocksSectors: <ThrowOnError extends boolean = false>(options?: Options<GetStocksSectorsData, ThrowOnError>) => RequestResult<GetStocksSectorsResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksSectorsData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Optional: Filter by specific sector name (e.g., 'Technology')
         */
        sector?: string;
        /**
         * Include top 10 companies for each sector (default: false)
         */
        includeCompanies?: boolean;
        /**
         * Include industry breakdown for each sector (default: false)
         */
        includeIndustries?: boolean;
    };
    url: '/stocks/sectors';
};

export declare type GetStocksSectorsResponse = GetStocksSectorsResponses[keyof GetStocksSectorsResponses];

export declare type GetStocksSectorsResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        count?: number;
        data?: Array<{
            sector?: string;
            totalCompanies?: number;
            totalMarketCap?: number;
            top10Companies?: Array<Stock>;
            industries?: Array<{
                name?: string;
                totalCompanies?: number;
                totalMarketCap?: number;
            }>;
        }> | {
            sector?: string;
            totalCompanies?: number;
            totalMarketCap?: number;
            top10Companies?: Array<Stock>;
            industries?: Array<{
                name?: string;
                totalCompanies?: number;
                totalMarketCap?: number;
            }>;
        };
    };
};

/**
 * Get trending stocks
 *
 * Retrieve currently trending stocks in the market
 */
export declare const getStocksTrending: <ThrowOnError extends boolean = false>(options?: Options<GetStocksTrendingData, ThrowOnError>) => RequestResult<GetStocksTrendingResponses, unknown, ThrowOnError, "fields">;

export declare type GetStocksTrendingData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/stocks/trending';
};

export declare type GetStocksTrendingResponse = GetStocksTrendingResponses[keyof GetStocksTrendingResponses];

export declare type GetStocksTrendingResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        data?: Array<Stock>;
    };
};

/**
 * Get algo scripts
 *
 * Retrieve list of algorithmic trading scripts from the library
 */
export declare const getStrategiesAlgoScripts: <ThrowOnError extends boolean = false>(options?: Options<GetStrategiesAlgoScriptsData, ThrowOnError>) => RequestResult<GetStrategiesAlgoScriptsResponses, unknown, ThrowOnError, "fields">;

export declare type GetStrategiesAlgoScriptsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/strategies/algo-scripts';
};

export declare type GetStrategiesAlgoScriptsResponse = GetStrategiesAlgoScriptsResponses[keyof GetStrategiesAlgoScriptsResponses];

export declare type GetStrategiesAlgoScriptsResponses = {
    /**
     * Successful response
     */
    200: Array<{
        url?: string;
        name?: string;
        description?: string;
        image_url?: string;
        author?: string;
        likes_count?: number;
        comments_count?: number;
        script_type?: string;
        created?: string;
        updated?: string;
        source?: string;
    }>;
};

/**
 * Get user portfolio
 *
 * Get current portfolio summary
 */
export declare const getUserPortfolio: <ThrowOnError extends boolean = false>(options?: Options<GetUserPortfolioData, ThrowOnError>) => RequestResult<GetUserPortfolioResponses, unknown, ThrowOnError, "fields">;

export declare type GetUserPortfolioData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/user/portfolio';
};

export declare type GetUserPortfolioResponse = GetUserPortfolioResponses[keyof GetUserPortfolioResponses];

export declare type GetUserPortfolioResponses = {
    /**
     * Successful response
     */
    200: Portfolio;
};

/**
 * Get user settings
 *
 * Retrieve user settings and API keys (masked)
 */
export declare const getUserSettings: <ThrowOnError extends boolean = false>(options?: Options<GetUserSettingsData, ThrowOnError>) => RequestResult<GetUserSettingsResponses, GetUserSettingsErrors, ThrowOnError, "fields">;

export declare type GetUserSettingsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/user/settings';
};

export declare type GetUserSettingsErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
};

export declare type GetUserSettingsResponses = {
    /**
     * Successful response
     */
    200: unknown;
};

/**
 * Get user signals
 *
 * Get user watchlist and trading signals
 */
export declare const getUserSignals: <ThrowOnError extends boolean = false>(options?: Options<GetUserSignalsData, ThrowOnError>) => RequestResult<GetUserSignalsResponses, unknown, ThrowOnError, "fields">;

export declare type GetUserSignalsData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/user/signals';
};

export declare type GetUserSignalsResponse = GetUserSignalsResponses[keyof GetUserSignalsResponses];

export declare type GetUserSignalsResponses = {
    /**
     * Successful response
     */
    200: Array<Signal>;
};

/**
 * Get user strategies
 *
 * List all user trading strategies
 */
export declare const getUserStrategies: <ThrowOnError extends boolean = false>(options?: Options<GetUserStrategiesData, ThrowOnError>) => RequestResult<GetUserStrategiesResponses, unknown, ThrowOnError, "fields">;

export declare type GetUserStrategiesData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/user/strategies';
};

export declare type GetUserStrategiesResponse = GetUserStrategiesResponses[keyof GetUserStrategiesResponses];

export declare type GetUserStrategiesResponses = {
    /**
     * Successful response
     */
    200: Array<Strategy>;
};

/**
 * Search Zulu traders
 *
 * Search for Zulu traders with performance filters
 */
export declare const getZuluSearch: <ThrowOnError extends boolean = false>(options?: Options<GetZuluSearchData, ThrowOnError>) => RequestResult<GetZuluSearchResponses, unknown, ThrowOnError, "fields">;

export declare type GetZuluSearchData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Minimum ROI percentage
         */
        minRoi?: number;
        /**
         * Minimum Win Rate percentage
         */
        minWinRate?: number;
        /**
         * Maximum Drawdown percentage
         */
        maxDrawdown?: number;
        /**
         * Filter by EA (Expert Advisor) usage
         */
        isEa?: boolean;
        /**
         * Max results (default: 50)
         */
        limit?: number;
    };
    url: '/zulu/search';
};

export declare type GetZuluSearchResponses = {
    /**
     * Successful response
     */
    200: unknown;
};

/**
 * Get top ranked traders
 *
 * Get list of top ranked Zulu traders
 */
export declare const getZuluTopRank: <ThrowOnError extends boolean = false>(options?: Options<GetZuluTopRankData, ThrowOnError>) => RequestResult<GetZuluTopRankResponses, unknown, ThrowOnError, "fields">;

export declare type GetZuluTopRankData = {
    body?: never;
    path?: never;
    query?: {
        /**
         * Max results (default 50)
         */
        limit?: number;
    };
    url: '/zulu/top-rank';
};

export declare type GetZuluTopRankResponses = {
    /**
     * Successful response
     */
    200: unknown;
};

export declare type HistoricalData = {
    symbol?: string;
    timestamps?: Array<number>;
    prices?: Array<number>;
};

declare type HttpMethod = 'connect' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace';

declare class Interceptors<Interceptor> {
    fns: Array<Interceptor | null>;
    clear(): void;
    eject(id: number | Interceptor): void;
    exists(id: number | Interceptor): boolean;
    getInterceptorIndex(id: number | Interceptor): number;
    update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false;
    use(fn: Interceptor): number;
}

declare type MethodFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;

declare interface Middleware<Req, Res, Err, Options> {
    error: Interceptors<ErrInterceptor<Err, Res, Req, Options>>;
    request: Interceptors<ReqInterceptor<Req, Options>>;
    response: Interceptors<ResInterceptor<Res, Req, Options>>;
}

declare type ObjectStyle = 'form' | 'deepObject';

declare type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;

export declare type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = Options_2<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

declare type Options_2<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean, TResponse = unknown, TResponseStyle extends ResponseStyle = 'fields'> = OmitKeys<RequestOptions<TResponse, TResponseStyle, ThrowOnError>, 'body' | 'path' | 'query' | 'url'> & ([TData] extends [never] ? unknown : Omit<TData, 'url'>);

export declare type Portfolio = {
    totalEquity?: number;
    cash?: number;
    stocks?: number;
    dailyPnL?: number;
    dailyPnLPercent?: number;
    winRate?: number;
    openPositions?: number;
};

/**
 * Run strategy backtest
 *
 * Run historical backtest for a trading strategy
 */
export declare const postBacktest: <ThrowOnError extends boolean = false>(options?: Options<PostBacktestData, ThrowOnError>) => RequestResult<PostBacktestResponses, unknown, ThrowOnError, "fields">;

export declare type PostBacktestData = {
    body?: BacktestRequest;
    path?: never;
    query?: never;
    url: '/backtest';
};

export declare type PostBacktestResponse = PostBacktestResponses[keyof PostBacktestResponses];

export declare type PostBacktestResponses = {
    /**
     * Successful response
     */
    200: BacktestResponse;
};

/**
 * Run technical strategy backtest
 *
 * Backtest technical analysis strategies
 */
export declare const postBacktestTechnical: <ThrowOnError extends boolean = false>(options?: Options<PostBacktestTechnicalData, ThrowOnError>) => RequestResult<PostBacktestTechnicalResponses, unknown, ThrowOnError, "fields">;

export declare type PostBacktestTechnicalData = {
    body?: {
        symbol?: string;
        strategy?: 'momentum' | 'mean-reversion' | 'breakout' | 'day-scalp';
        startDate?: string;
        endDate?: string;
    };
    path?: never;
    query?: never;
    url: '/backtest-technical';
};

export declare type PostBacktestTechnicalResponses = {
    /**
     * Successful response
     */
    200: unknown;
};

/**
 * Multi-agent debate analysis
 *
 * Comprehensive multi-agent stock analysis system using Bull vs Bear debate, Risk Management consensus, and Memory-based learning. Supports Groq, OpenAI, and Anthropic LLMs.
 */
export declare const postGroqDebate: <ThrowOnError extends boolean = false>(options: Options<PostGroqDebateData, ThrowOnError>) => RequestResult<PostGroqDebateResponses, PostGroqDebateErrors, ThrowOnError, "fields">;

export declare type PostGroqDebateData = {
    body: {
        /**
         * Stock ticker symbol
         */
        symbol: string;
        /**
         * Analysis date (defaults to today)
         */
        date?: string;
        /**
         * Number of debate rounds between Bull and Bear analysts
         */
        max_debate_rounds?: number;
        /**
         * LLM provider to use
         */
        llm_provider?: 'groq' | 'openai' | 'anthropic';
        /**
         * Model for complex reasoning (defaults to provider's best model)
         */
        deep_think_llm?: string;
        /**
         * Model for fast analysis (defaults to provider's fast model)
         */
        quick_think_llm?: string;
    };
    path?: never;
    query?: never;
    url: '/groq-debate';
};

export declare type PostGroqDebateErrors = {
    /**
     * Invalid request parameters
     */
    400: unknown;
    /**
     * Analysis failed due to server error
     */
    500: unknown;
};

export declare type PostGroqDebateResponse = PostGroqDebateResponses[keyof PostGroqDebateResponses];

export declare type PostGroqDebateResponses = {
    /**
     * Successful debate analysis with comprehensive multi-agent consensus
     */
    200: DebateAnalysisResponse;
};

/**
 * Get trader positions
 *
 * Get positions for a specific Polymarket trader
 */
export declare const postPolymarketPositions: <ThrowOnError extends boolean = false>(options?: Options<PostPolymarketPositionsData, ThrowOnError>) => RequestResult<PostPolymarketPositionsResponses, unknown, ThrowOnError, "fields">;

export declare type PostPolymarketPositionsData = {
    body?: {
        trader_id: string;
    };
    path?: never;
    query?: never;
    url: '/polymarket/positions';
};

export declare type PostPolymarketPositionsResponses = {
    /**
     * Successful response
     */
    200: unknown;
};

/**
 * Calculate stock statistics
 *
 * Perform advanced statistical analysis including rolling statistics and timeseries correlation (e.g., price vs volume, cross-asset correlation).
 */
export declare const postStocksPredictStatistics: <ThrowOnError extends boolean = false>(options?: Options<PostStocksPredictStatisticsData, ThrowOnError>) => RequestResult<PostStocksPredictStatisticsResponses, unknown, ThrowOnError, "fields">;

export declare type PostStocksPredictStatisticsData = {
    body?: StatisticsRequest;
    path?: never;
    query?: never;
    url: '/stocks/predict/statistics';
};

export declare type PostStocksPredictStatisticsResponse = PostStocksPredictStatisticsResponses[keyof PostStocksPredictStatisticsResponses];

export declare type PostStocksPredictStatisticsResponses = {
    /**
     * Successful response
     */
    200: StatisticsResponse;
};

/**
 * Screen stocks
 *
 * Screen stocks based on criteria
 */
export declare const postStocksScreener: <ThrowOnError extends boolean = false>(options?: Options<PostStocksScreenerData, ThrowOnError>) => RequestResult<PostStocksScreenerResponses, unknown, ThrowOnError, "fields">;

export declare type PostStocksScreenerData = {
    body?: ScreenerRequest;
    path?: never;
    query?: never;
    url: '/stocks/screener';
};

export declare type PostStocksScreenerResponse = PostStocksScreenerResponses[keyof PostStocksScreenerResponses];

export declare type PostStocksScreenerResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        data?: Array<Stock>;
    };
};

/**
 * Analyze stock with AI agents
 *
 * Analyze a stock using multi-agent AI system (Debate Analyst or News Researcher)
 */
export declare const postTradingAgents: <ThrowOnError extends boolean = false>(options?: Options<PostTradingAgentsData, ThrowOnError>) => RequestResult<PostTradingAgentsResponses, unknown, ThrowOnError, "fields">;

export declare type PostTradingAgentsData = {
    body?: TradingAgentRequest;
    path?: never;
    query?: never;
    url: '/trading-agents';
};

export declare type PostTradingAgentsResponse = PostTradingAgentsResponses[keyof PostTradingAgentsResponses];

export declare type PostTradingAgentsResponses = {
    /**
     * Successful response
     */
    200: TradingAgentResponse;
};

/**
 * Initialize portfolio
 *
 * Initialize user portfolio with starting balance
 */
export declare const postUserPortfolioInitialize: <ThrowOnError extends boolean = false>(options?: Options<PostUserPortfolioInitializeData, ThrowOnError>) => RequestResult<PostUserPortfolioInitializeResponses, unknown, ThrowOnError, "fields">;

export declare type PostUserPortfolioInitializeData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/user/portfolio/initialize';
};

export declare type PostUserPortfolioInitializeResponses = {
    /**
     * Portfolio initialized successfully
     */
    200: unknown;
};

/**
 * Save user settings
 *
 * Save or update user settings and API keys
 */
export declare const postUserSettings: <ThrowOnError extends boolean = false>(options?: Options<PostUserSettingsData, ThrowOnError>) => RequestResult<PostUserSettingsResponses, PostUserSettingsErrors, ThrowOnError, "fields">;

export declare type PostUserSettingsData = {
    body?: unknown;
    path?: never;
    query?: never;
    url: '/user/settings';
};

export declare type PostUserSettingsErrors = {
    /**
     * Unauthorized
     */
    401: unknown;
};

export declare type PostUserSettingsResponse = PostUserSettingsResponses[keyof PostUserSettingsResponses];

export declare type PostUserSettingsResponses = {
    /**
     * Settings saved successfully
     */
    200: {
        success?: boolean;
    };
};

/**
 * Create strategy
 *
 * Create a new trading strategy
 */
export declare const postUserStrategies: <ThrowOnError extends boolean = false>(options?: Options<PostUserStrategiesData, ThrowOnError>) => RequestResult<PostUserStrategiesResponses, unknown, ThrowOnError, "fields">;

export declare type PostUserStrategiesData = {
    body?: CreateStrategyRequest;
    path?: never;
    query?: never;
    url: '/user/strategies';
};

export declare type PostUserStrategiesResponses = {
    /**
     * Strategy created successfully
     */
    201: unknown;
};

/**
 * Sync Zulu Traders
 *
 * Manually trigger a sync of top traders from ZuluTrade
 */
export declare const postZuluSync: <ThrowOnError extends boolean = false>(options?: Options<PostZuluSyncData, ThrowOnError>) => RequestResult<PostZuluSyncResponses, unknown, ThrowOnError, "fields">;

export declare type PostZuluSyncData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/zulu/sync';
};

export declare type PostZuluSyncResponse = PostZuluSyncResponses[keyof PostZuluSyncResponses];

export declare type PostZuluSyncResponses = {
    /**
     * Successful response
     */
    200: {
        success?: boolean;
        data?: {
            traders?: number;
        };
        message?: string;
    };
};

/**
 * Update strategy
 *
 * Update an existing strategy
 */
export declare const putUserStrategiesById: <ThrowOnError extends boolean = false>(options: Options<PutUserStrategiesByIdData, ThrowOnError>) => RequestResult<PutUserStrategiesByIdResponses, unknown, ThrowOnError, "fields">;

export declare type PutUserStrategiesByIdData = {
    body?: UpdateStrategyRequest;
    path: {
        id: string;
    };
    query?: never;
    url: '/user/strategies/{id}';
};

export declare type PutUserStrategiesByIdResponses = {
    /**
     * Strategy updated successfully
     */
    200: unknown;
};

declare type QuerySerializer = (query: Record<string, unknown>) => string;

declare type QuerySerializerOptions = QuerySerializerOptionsObject & {
    /**
     * Per-parameter serialization overrides. When provided, these settings
     * override the global array/object settings for specific parameter names.
     */
    parameters?: Record<string, QuerySerializerOptionsObject>;
};

declare type QuerySerializerOptionsObject = {
    allowReserved?: boolean;
    array?: Partial<SerializerOptions<ArrayStyle>>;
    object?: Partial<SerializerOptions<ObjectStyle>>;
};

declare type ReqInterceptor<Req, Options> = (request: Req, options: Options) => Req | Promise<Req>;

declare type RequestFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'> & Pick<Required<RequestOptions<TData, TResponseStyle, ThrowOnError>>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;

declare interface RequestOptions<TData = unknown, TResponseStyle extends ResponseStyle = 'fields', ThrowOnError extends boolean = boolean, Url extends string = string> extends Config<{
    responseStyle: TResponseStyle;
    throwOnError: ThrowOnError;
}>, Pick<ServerSentEventsOptions<TData>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
    /**
     * Any body that you want to add to your request.
     *
     * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
     */
    body?: unknown;
    path?: Record<string, unknown>;
    query?: Record<string, unknown>;
    /**
     * Security mechanism(s) to use for the request.
     */
    security?: ReadonlyArray<Auth>;
    url: Url;
}

declare type RequestResult<TData = unknown, TError = unknown, ThrowOnError extends boolean = boolean, TResponseStyle extends ResponseStyle = 'fields'> = ThrowOnError extends true ? Promise<TResponseStyle extends 'data' ? TData extends Record<string, unknown> ? TData[keyof TData] : TData : {
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    request: Request;
    response: Response;
}> : Promise<TResponseStyle extends 'data' ? (TData extends Record<string, unknown> ? TData[keyof TData] : TData) | undefined : ({
    data: TData extends Record<string, unknown> ? TData[keyof TData] : TData;
    error: undefined;
} | {
    data: undefined;
    error: TError extends Record<string, unknown> ? TError[keyof TError] : TError;
}) & {
    request: Request;
    response: Response;
}>;

declare type ResInterceptor<Res, Req, Options> = (response: Res, request: Req, options: Options) => Res | Promise<Res>;

declare interface ResolvedRequestOptions<TResponseStyle extends ResponseStyle = 'fields', ThrowOnError extends boolean = boolean, Url extends string = string> extends RequestOptions<unknown, TResponseStyle, ThrowOnError, Url> {
    serializedBody?: string;
}

declare type ResponseStyle = 'data' | 'fields';

export declare type ScreenerRequest = {
    minMarketCap?: number;
    maxMarketCap?: number;
    minPE?: number;
    maxPE?: number;
    sector?: string;
};

export declare type SecuritySchemes = unknown;

declare interface SerializerOptions<T> {
    /**
     * @default true
     */
    explode: boolean;
    style: T;
}

declare type ServerSentEventsOptions<TData = unknown> = Omit<RequestInit, 'method'> & Pick<Config_2, 'method' | 'responseTransformer' | 'responseValidator'> & {
    /**
     * Fetch API implementation. You can use this option to provide a custom
     * fetch instance.
     *
     * @default globalThis.fetch
     */
    fetch?: typeof fetch;
    /**
     * Implementing clients can call request interceptors inside this hook.
     */
    onRequest?: (url: string, init: RequestInit) => Promise<Request>;
    /**
     * Callback invoked when a network or parsing error occurs during streaming.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @param error The error that occurred.
     */
    onSseError?: (error: unknown) => void;
    /**
     * Callback invoked when an event is streamed from the server.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @param event Event streamed from the server.
     * @returns Nothing (void).
     */
    onSseEvent?: (event: StreamEvent<TData>) => void;
    serializedBody?: RequestInit['body'];
    /**
     * Default retry delay in milliseconds.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @default 3000
     */
    sseDefaultRetryDelay?: number;
    /**
     * Maximum number of retry attempts before giving up.
     */
    sseMaxRetryAttempts?: number;
    /**
     * Maximum retry delay in milliseconds.
     *
     * Applies only when exponential backoff is used.
     *
     * This option applies only if the endpoint returns a stream of events.
     *
     * @default 30000
     */
    sseMaxRetryDelay?: number;
    /**
     * Optional sleep function for retry backoff.
     *
     * Defaults to using `setTimeout`.
     */
    sseSleepFn?: (ms: number) => Promise<void>;
    url: string;
};

declare type ServerSentEventsResult<TData = unknown, TReturn = void, TNext = unknown> = {
    stream: AsyncGenerator<TData extends Record<string, unknown> ? TData[keyof TData] : TData, TReturn, TNext>;
};

export declare type Signal = {
    id?: string;
    asset?: string;
    type?: string;
    combinedScore?: number;
    scoreLabel?: string;
    fundamentalsScore?: number;
    technicalScore?: number;
    sentimentScore?: number;
    suggestedAction?: string;
};

declare type SseFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;

export declare type StatisticsRequest = {
    symbol?: string;
    period?: string;
    metrics?: Array<'rolling_mean' | 'rolling_std' | 'bollinger_bands'>;
    window?: number;
    /**
     * Configuration for correlating different timeseries data
     */
    correlation?: {
        /**
         * Primary series to correlate against
         */
        target?: string;
        /**
         * List of other timeseries to test for correlation
         */
        features?: Array<string>;
        /**
         * Correlation method to use
         */
        method?: 'pearson' | 'spearman';
    };
};

export declare type StatisticsResponse = {
    success?: boolean;
    symbol?: string;
    data?: {
        timestamps?: Array<string>;
        values?: {
            [key: string]: Array<number>;
        };
        /**
         * Correlation coefficients between target and features
         */
        correlations?: {
            [key: string]: number;
        };
    };
};

export declare type Stock = {
    symbol?: string;
    name?: string;
    price?: number;
    change?: number;
    changePercent?: number;
};

export declare type StockQuote = {
    symbol?: string;
    price?: number;
    open?: number;
    high?: number;
    low?: number;
    volume?: number;
    marketCap?: number;
    pe?: number;
};

export declare type StockSearchResult = {
    symbol?: string;
    name?: string;
    exchange?: string;
    type?: string;
};

export declare type Strategy = {
    id?: string;
    name?: string;
    type?: 'momentum' | 'mean-reversion' | 'breakout' | 'day-scalp';
    status?: 'running' | 'paused' | 'paper';
    riskLevel?: 'low' | 'medium' | 'high';
    todayPnL?: number;
    winRate?: number;
};

declare interface StreamEvent<TData = unknown> {
    data: TData;
    event?: string;
    id?: string;
    retry?: number;
}

declare interface TDataShape {
    body?: unknown;
    headers?: unknown;
    path?: unknown;
    query?: unknown;
    url: string;
}

export declare type TradingAgentRequest = {
    symbol: string;
    agent: 'debate-analyst' | 'news-researcher';
    deep_think_llm?: string;
    quick_think_llm?: string;
    max_debate_rounds?: number;
};

export declare type TradingAgentResponse = {
    success?: boolean;
    symbol?: string;
    decision?: {
        action?: 'BUY' | 'SELL' | 'HOLD';
        confidence?: number;
        reasoning?: string;
        risk_assessment?: string;
    };
    analysis?: {
        bull_arguments?: Array<string>;
        bear_arguments?: Array<string>;
    };
};

export declare type UpdateStrategyRequest = {
    status?: 'running' | 'paused' | 'paper';
    config?: {
        [key: string]: unknown;
    };
};

export { }
