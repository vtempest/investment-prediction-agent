import { TradingAgentsGraph } from '../lib/trading-agents/graph/trading-graph'

async function main() {
  console.log('Verifying News Integration...')
  
  // Create graph with news analyst enabled
  const graph = new TradingAgentsGraph(['news'])
  
  // Use a well-known ticker and a recent date
  const ticker = 'AAPL'
  const date = new Date().toISOString().split('T')[0] // today
  
  console.log(`Running propagation for ${ticker} on ${date}`)
  
  try {
    const { state } = await graph.propagate(ticker, date)
    
    console.log('\n--- News Report ---')
    console.log(state.newsReport)
    console.log('-------------------\n')
    
    if (state.newsReport && state.newsReport !== 'No news analysis performed.' && !state.newsReport.includes('Error analyzing news')) {
      console.log('✅ Verification Successful: News report generated.')
    } else {
      console.error('❌ Verification Failed: consistent news report not found.')
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Verification Failed with error:', error)
    process.exit(1)
  }
}

main()
