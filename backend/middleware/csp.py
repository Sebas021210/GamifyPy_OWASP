from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class CSPMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)

        # Política CSP
        csp_policy = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data:; "
            "connect-src 'self' http://localhost:8000 ws://localhost:5173; "
            "object-src 'none'; "
            "frame-ancestors 'none'; "
        )

        response.headers["Content-Security-Policy"] = csp_policy
        return response
