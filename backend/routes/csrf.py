from fastapi import APIRouter
from fastapi.responses import JSONResponse
from backend.middleware.csrf import generate_csrf_token

router = APIRouter()

@router.get("/get-csrf-token")
def get_csrf_token():
    token = generate_csrf_token()
    return JSONResponse(content={"csrf_token": token})
