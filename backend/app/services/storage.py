import uuid
from pathlib import Path

from fastapi import UploadFile

from app.config import settings


async def save_uploaded_image(
    file: UploadFile,
) -> Path:
    if file.content_type not in settings.allowed_image_types:
        raise ValueError("Unsupported image type")

    contents = await file.read()

    if len(contents) > settings.max_upload_bytes:
        raise ValueError("Image is too large")

    extension = Path(file.filename or "image.jpg").suffix.lower()

    if extension not in {".jpg", ".jpeg", ".png", ".webp"}:
        extension = ".jpg"

    filename = f"{uuid.uuid4()}{extension}"

    destination = settings.upload_dir / filename

    destination.write_bytes(contents)

    return destination