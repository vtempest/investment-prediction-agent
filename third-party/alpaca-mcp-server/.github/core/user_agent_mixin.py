USER_AGENT = "ALPACA-MCP-SERVER"

class UserAgentMixin:
    def _get_default_headers(self) -> dict:
        headers = self._get_auth_headers()
        headers["User-Agent"] = USER_AGENT
        return headers