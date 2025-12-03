from typing import TypedDict, Optional, Dict, Any, List
from datetime import datetime

class AgentState(TypedDict):
    """
    Unified state structure for all PrimoAgent agents.
    Used by Data Collection, Technical Analysis, News Intelligence, and Portfolio Manager.
    """
    # Core workflow
    session_id: str
    symbols: List[str]
    current_step: str
    analysis_date: str  # Date for analysis in YYYY-MM-DD format
    
    # Agent results (simple dictionaries)
    data_collection_results: Optional[Dict[str, Any]]
    technical_analysis_results: Optional[Dict[str, Any]]
    news_intelligence_results: Optional[Dict[str, Any]]
    portfolio_manager_results: Optional[Dict[str, Any]]
    
    # Simple error handling
    error: Optional[str]


def create_initial_state(session_id: str, symbols: List[str], analysis_date: Optional[str] = None) -> AgentState:
    """Create initial workflow state."""
    # If no date provided, use today's date
    if analysis_date is None:
        analysis_date = datetime.now().strftime("%Y-%m-%d")
        
    return AgentState(
        session_id=session_id,
        symbols=symbols,
        analysis_date=analysis_date,
        current_step="initialized",
        data_collection_results=None,
        technical_analysis_results=None,
        news_intelligence_results=None,
        portfolio_manager_results=None,
        error=None
    )


def update_step(state: AgentState, step: str) -> AgentState:
    """Update current step."""
    state["current_step"] = step
    return state


def set_error(state: AgentState, error_message: str) -> AgentState:
    """Set error in state."""
    state["error"] = error_message
    state["current_step"] = "error"
    return state 