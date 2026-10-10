import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.assessment import (
    ContributingFactor,
    HistoryItem,
    HistoryResponse,
    PredictionResponse,
    VisualProbabilities,
)
from app.services.assessment_engine import (
    combine_scores,
    get_confidence,
    get_context_score,
    get_contributing_factors,
    get_quality_state,
    get_recommendation,
    get_usable_days,
    get_visual_probabilities,
)
from app.services.history_store import (
    list_assessments,
    save_assessment,
)

router = APIRouter()

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_IMAGE_BYTES = 5 * 1024 * 1024
MODEL_VERSION = "afterharvest-tomato-v0-demo"


@router.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "afterharvest-api",
    }


@router.post("/quality/predict", response_model=PredictionResponse)
async def predict_quality(
    image: UploadFile = File(...),
    produce_type: str = Form(default="tomato"),
    temperature: float = Form(...),
    humidity: float = Form(...),
    storage_days: int = Form(...),
    packaging: str = Form(...),
) -> PredictionResponse:
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Unsupported image type. Use JPEG, PNG or WebP.",
        )

    image_bytes = await image.read()

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Image exceeds the 5 MB limit.",
        )

    if produce_type.lower() != "tomato":
        raise HTTPException(
            status_code=422,
            detail="Only tomato assessments are supported in this prototype.",
        )

    if packaging not in {"open_crate", "sealed_bag", "ventilated_box"}:
        raise HTTPException(
            status_code=422,
            detail="Packaging must be open_crate, sealed_bag or ventilated_box.",
        )

    context_score = get_context_score(
        temperature,
        humidity,
        storage_days,
        packaging,
    )

    quality_score = combine_scores(context_score)
    quality_state = get_quality_state(quality_score)
    usable_days = get_usable_days(quality_state)

    assessment_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    response = PredictionResponse(
        assessment_id=assessment_id,
        produce_type="tomato",
        quality_state=quality_state,
        quality_score=quality_score,
        confidence=get_confidence(quality_state),
        visual_probabilities=VisualProbabilities(
            **get_visual_probabilities()
        ),
        context_score=context_score,
        estimated_usable_days_min=usable_days[0],
        estimated_usable_days_max=usable_days[1],
        contributing_factors=[
            ContributingFactor(**factor)
            for factor in get_contributing_factors(
                temperature,
                humidity,
                storage_days,
                packaging,
                context_score,
            )
        ],
        recommendation=get_recommendation(quality_state),
        model_version=MODEL_VERSION,
        inference_mode="demo",
        created_at=created_at,
    )

    save_assessment(
        {
            "assessment_id": assessment_id,
            "produce_type": "tomato",
            "quality_state": quality_state,
            "quality_score": quality_score,
            "confidence": response.confidence,
            "temperature": temperature,
            "humidity": humidity,
            "storage_days": storage_days,
            "packaging": packaging,
            "recommendation": response.recommendation,
            "model_version": MODEL_VERSION,
            "inference_mode": "demo",
            "created_at": created_at,
        }
    )

    return response


@router.get("/history", response_model=HistoryResponse)
def get_history() -> HistoryResponse:
    records = list_assessments()

    return HistoryResponse(
        items=[HistoryItem(**record) for record in records]
    )
