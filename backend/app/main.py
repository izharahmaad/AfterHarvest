from contextlib import asynccontextmanager


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from backend.app.api.routes import router
from backend.app.config import settings
from backend.app.database import Base, engine



@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)


    print("Backend started in demo mode.")


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


app.include_router(router)



@app.get("/")
def root():
    return {
        "message": "AfterHarvest API is running",
        "docs": "/docs",
        "health": "/api/health",
    }



@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "environment": settings.environment,
        "inference_mode": "demo",
    }