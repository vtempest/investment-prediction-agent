from datetime import datetime
from typing import Any, Optional
from dataclasses import dataclass

@dataclass
class ToolResult:
    """Simple result format for all tools."""
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    timestamp: Optional[datetime] = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now() 