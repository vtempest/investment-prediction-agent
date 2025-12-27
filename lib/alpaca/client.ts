import Alpaca from '@alpacahq/alpaca-trade-api'

export interface AlpacaConfig {
  paper?: boolean
  keyId?: string
  secretKey?: string
  baseUrl?: string
}

/**
 * Creates an Alpaca API client with the provided configuration
 * Supports both Trading API and Broker API
 * @param config - Configuration options for the Alpaca client
 * @returns Alpaca client instance
 */
export function createAlpacaClient(config?: Partial<AlpacaConfig>) {
  const keyId = config?.keyId || process.env.ALPACA_API_KEY || process.env.ALPACA_KEY_ID || ""
  const secretKey = config?.secretKey || process.env.ALPACA_SECRET || process.env.ALPACA_SECRET_KEY || ""
  const paper = config?.paper ?? true

  if (!keyId || !secretKey) {
    console.warn("Alpaca keys missing - check .env or user settings")
  }

  // Determine base URL based on paper trading and config
  let baseUrl = config?.baseUrl
  if (!baseUrl) {
    if (paper) {
      baseUrl = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets'
    } else {
      baseUrl = process.env.ALPACA_BASE_URL || 'https://api.alpaca.markets'
    }
  }

  return new Alpaca({
    keyId,
    secretKey,
    paper,
    baseUrl,
    usePolygon: false, // Use Alpaca data instead of Polygon
  })
}

/**
 * Creates an Alpaca Broker API client for creating and managing user accounts
 * @param config - Broker API configuration
 * @returns Alpaca Broker client instance
 */
export function createAlpacaBrokerClient(config?: Partial<AlpacaConfig>) {
  const keyId = config?.keyId || process.env.ALPACA_BROKER_API_KEY || process.env.ALPACA_API_KEY || ""
  const secretKey = config?.secretKey || process.env.ALPACA_BROKER_SECRET_KEY || process.env.ALPACA_SECRET || ""
  const baseUrl = config?.baseUrl || process.env.ALPACA_BROKER_BASE_URL || 'https://broker-api.alpaca.markets'

  if (!keyId || !secretKey) {
    throw new Error("Alpaca Broker API keys missing - check .env")
  }

  return new Alpaca({
    keyId,
    secretKey,
    baseUrl,
    paper: false, // Broker API doesn't use paper trading flag
  })
}
