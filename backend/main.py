from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from backend.routes import auth_router, user_router, category_level_router, lessons_router, questions_router, insignias_router, csrf_router
from backend.middleware.csrf import CSRFMiddleware

app = FastAPI(title="GamifyPy")

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(CSRFMiddleware)

app.mount("/static", StaticFiles(directory="backend/static"), name="static")
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(category_level_router, prefix="/category-level", tags=["category_level"])
app.include_router(lessons_router, prefix="/lessons", tags=["lessons"])
app.include_router(questions_router, prefix="/questions", tags=["questions"])
app.include_router(insignias_router, prefix="/insignias", tags=["insignias"])
app.include_router(csrf_router, prefix="/csrf", tags=["csrf"])

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )
