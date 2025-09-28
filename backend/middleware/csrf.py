import secrets
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("csrf-middleware")

UNPROTECTED_PATHS = [
    "/auth/login",
    "/auth/send-pin",
    "/auth/verify-pin",
    "/auth/refresh",
    "/get-csrf-token",
]

csrf_tokens = {}

def generate_csrf_token() -> str:
    """Genera un token seguro y lo guarda en memoria."""
    token = secrets.token_hex(16)
    csrf_tokens[token] = True
    return token

def validate_csrf_token(token: str) -> bool:
    """Valida y opcionalmente invalida un token."""
    if token in csrf_tokens:
        del csrf_tokens[token]
        return True
    return False

class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        method = request.method

        if method in ("POST", "PUT", "PATCH", "DELETE"):
            if not any(path.startswith(exc) for exc in UNPROTECTED_PATHS):
                csrf_header = request.headers.get("x-csrf-token")
                if not csrf_header or csrf_header not in csrf_tokens:
                    logger.warning(f"❌ Bloqueado CSRF en {method} {path}")
                    return JSONResponse(
                        status_code=403,
                        content={"detail": "CSRF token inválido o ausente"},
                    )
                else:
                    logger.info(f"✅ CSRF validado en {method} {path}")
            else:
                logger.info(f"⚠️ CSRF ignorado en {method} {path} (unprotected)")
        else:
            logger.info(f"➡️ GET u otro método seguro en {method} {path} (no valida CSRF)")

        response = await call_next(request)
        return response
