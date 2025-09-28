from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class CSPMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)

        # Política CSP
        csp_policy = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self'; "
            "connect-src 'self' http://localhost:8000; "
            "img-src 'self' data:; "
            "object-src 'none';"
        )

        response.headers["Content-Security-Policy"] = csp_policy
        return response
