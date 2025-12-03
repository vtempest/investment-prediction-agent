from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, END
from .state import AgentState, create_initial_state
from ..agents.data_collection_agent import data_collection_agent_node
from ..agents.technical_analysis_agent import technical_analysis_agent_node
from ..agents.news_intelligence_agent import news_intelligence_agent_node
from ..agents.portfolio_manager_agent import portfolio_manager_agent_node


def debug_state(state: AgentState, agent_name: str) -> AgentState:
    """Debug function to log state after each agent."""
    print(f"\n{agent_name} Agent Complete:")
    
    # Basic info
    analysis_date = state.get('analysis_date', 'N/A')
    symbol = state['symbols'][0] if state.get('symbols') else 'N/A'
    print(f"Date: {analysis_date} | Symbol: {symbol}")
    
    # Data Collection Results
    data_results = state.get('data_collection_results')
    if data_results and agent_name == "Data Collection":
        market_data = data_results.get('market_data', {})
        current_price = market_data.get('current_price', 'N/A')
        print(f"Current Price: ${current_price}")
    
    # Technical Analysis Results
    tech_results = state.get('technical_analysis_results')
    if tech_results and agent_name == "Technical Analysis":
        success = tech_results.get('success', False)
        print(f"Technical Success: {success}")
    
    # News Intelligence Results
    news_results = state.get('news_intelligence_results')
    if news_results and agent_name == "News Intelligence":
        success = news_results.get('success', False)
        print(f"News Success: {success}")
    
    # Portfolio Manager Results
    portfolio_results = state.get('portfolio_manager_results')
    if portfolio_results and agent_name == "Portfolio Manager":
        symbol_data = portfolio_results.get(symbol, {})
        if symbol_data and symbol_data.get('success'):
            signal = symbol_data.get('trading_signal', 'N/A')
            confidence = symbol_data.get('confidence_level', 'N/A')
            print(f"Signal: {signal} | Confidence: {confidence}")
    
    # Error state
    if state.get('error'):
        print(f"Error: {state.get('error')}")
    
    return state


async def debug_data_collection_node(state: AgentState) -> AgentState:
    """Data collection node with debug output."""
    result = await data_collection_agent_node(state)
    return debug_state(result, "Data Collection")


async def debug_technical_analysis_node(state: AgentState) -> AgentState:
    """Technical analysis node with debug output.""" 
    result = await technical_analysis_agent_node(state)
    return debug_state(result, "Technical Analysis")


async def debug_news_intelligence_node(state: AgentState) -> AgentState:
    """News intelligence node with debug output."""
    result = await news_intelligence_agent_node(state)  
    return debug_state(result, "News Intelligence")


async def debug_portfolio_manager_node(state: AgentState) -> AgentState:
    """Portfolio manager node with debug output."""
    result = await portfolio_manager_agent_node(state)
    return debug_state(result, "Portfolio Manager")


def create_workflow() -> StateGraph:
    """
    Create LangGraph workflow connecting all agents.
            
        Returns:
        StateGraph: Configured workflow graph
    """
    # Initialize workflow
    workflow = StateGraph(AgentState)
    
    # Add nodes with debug output
    workflow.add_node("data_collection", debug_data_collection_node)
    workflow.add_node("technical_analysis", debug_technical_analysis_node)
    workflow.add_node("news_intelligence", debug_news_intelligence_node)
    workflow.add_node("portfolio_manager", debug_portfolio_manager_node)
    
    # Define linear flow
    workflow.set_entry_point("data_collection")
    workflow.add_edge("data_collection", "technical_analysis")
    workflow.add_edge("technical_analysis", "news_intelligence")
    workflow.add_edge("news_intelligence", "portfolio_manager")
    workflow.add_edge("portfolio_manager", END)
    
    return workflow


async def run_analysis(symbols: list[str], session_id: str = "default", analysis_date: Optional[str] = None) -> Dict[str, Any]:
    """
    Run complete analysis workflow for symbols.
        
        Args:
            symbols: List of stock symbols to analyze
        session_id: Session identifier
        analysis_date: Date for analysis in YYYY-MM-DD format (optional, defaults to today)
            
        Returns:
        Dict with analysis results
        """
    try:
        # Create workflow
        workflow = create_workflow()
        app = workflow.compile()
        
        # Initialize state with analysis date
        initial_state = create_initial_state(session_id, symbols, analysis_date)
        
        # Run workflow
        result = await app.ainvoke(initial_state)
        
        # Extract results
        return {
            'success': True,
            'session_id': session_id,
            'symbols': symbols,
            'analysis_date': analysis_date,
            'results': {
                'data_collection': result.get('data_collection_results'),
                'technical_analysis': result.get('technical_analysis_results'),
                'news_intelligence': result.get('news_intelligence_results'),
                'portfolio_manager': result.get('portfolio_manager_results')
            },
            'final_step': result.get('current_step'),
            'error': result.get('error')
        }
        
    except Exception as e:
        print(f"Workflow error: {e}")
        return {
            'success': False,
            'error': str(e),
            'symbols': symbols,
            'session_id': session_id,
            'analysis_date': analysis_date
        }


def should_continue(state: AgentState) -> str:
    """
    Simple conditional logic for workflow routing.
    
    Args:
        state: Current workflow state
        
    Returns:
        Next step or END
    """
    if state.get('error'):
        return END
    
    current_step = state.get('current_step', '')
    
    if current_step == 'data_collection_complete':
        return 'technical_analysis'
    elif current_step == 'technical_analysis_complete':
        return 'news_intelligence'
    elif current_step == 'news_intelligence_complete':
        return 'portfolio_manager'
    elif current_step == 'portfolio_management_complete':
        return END
    else:
        return END 