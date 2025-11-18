import logging
import json
import time
from pathlib import Path
from fastapi import Request

Path("logs").mkdir(exist_ok=True)

# Configurar logger
logger = logging.getLogger("api-logger")
logger.setLevel(logging.INFO)
handler = logging.FileHandler("backend/logs/api.log")
handler.setFormatter(logging.Formatter('%(message)s'))
logger.addHandler(handler)

async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = (time.time() - start_time) * 1000

    log_data = {
        "@timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "service.name": "fastapi-backend",
        "http.request.method": request.method,
        "url.path": request.url.path,
        "http.response.status_code": response.status_code,
        "event.duration": duration,
        "log.level": "info",
    }

    logger.info(json.dumps(log_data))
    return response
