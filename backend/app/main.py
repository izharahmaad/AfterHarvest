from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import assessments
from app.services.inference import inference_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    try:
        inference_service.load()
    except FileNotFoundError:
        print(
            "WARNING: model files are missing. "
            "Add model.pt and labels.json before using inference.",
        )

    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessments.router)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "environment": settings.environment,
    }