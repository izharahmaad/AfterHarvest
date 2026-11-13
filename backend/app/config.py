from pathlib import Path

from pydantic_settings import BaseSettings


BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    app_name: str = "AfterHarvest API"
    environment: str = "development"


    database_url: str = (
        f"sqlite:///{BACKEND_DIR / 'afterharvest.db'}"
    )

    upload_dir: Path = BACKEND_DIR / "uploads"
    max_upload_bytes: int = 5 * 1024 * 1024

    allowed_image_types: set[str] = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }

    model_path: Path = BACKEND_DIR / "app" / "ml" / "model.pt"
    labels_path: Path = BACKEND_DIR / "app" / "ml" / "labels.json"

    cors_origins: list[str] = [
        "http://localhost:8081",
        "http://localhost:19006",
        "http://192.168.0.182:8081",
        "http://192.168.0.182:19006",
    ]

    class Config:
        env_file = ".env"

settings = Settings()

settings.upload_dir.mkdir(parents=True, exist_ok=True)