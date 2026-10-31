import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Assessment
from app.schemas import (
    AssessmentListResponse,
    AssessmentResponse,
)
from app.services.inference import inference_service
from app.services.storage import save_uploaded_image

router = APIRouter(
    prefix="/api/assessments",
    tags=["Assessments"],
)


@router.post("", response_model=AssessmentResponse)
async def create_assessment(
    image: UploadFile = File(...),
    temperature: float = Form(...),
    humidity: float = Form(...),
    days: int = Form(...),
    packaging: str = Form(...),
    db: Session = Depends(get_db),
):
    if temperature < -20 or temperature > 60:
        raise HTTPException(
            status_code=422,
            detail="Temperature must be between -20 and 60°C.",
        )

    if humidity < 0 or humidity > 100:
        raise HTTPException(
            status_code=422,
            detail="Humidity must be between 0 and 100%.",
        )

    if days < 0 or days > 365:
        raise HTTPException(
            status_code=422,
            detail="Storage days must be between 0 and 365.",
        )

    try:
        image_path = await save_uploaded_image(image)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    try:
        prediction = inference_service.predict(image_path)
    except Exception as error:
        image_path.unlink(missing_ok=True)

        raise HTTPException(
            status_code=503,
            detail="Model inference is unavailable.",
        ) from error

    assessment = Assessment(
        id=str(uuid.uuid4()),
        produce_type="tomato",
        image_path=str(image_path),
        temperature=temperature,
        humidity=humidity,
        storage_days=days,
        packaging=packaging,
        quality_state=prediction["quality_state"],
        quality_score=prediction["quality_score"],
        confidence=prediction["confidence"],
        recommendation=get_recommendation(
            prediction["quality_state"],
        ),
        model_version=prediction["model_version"],
        inference_mode=prediction["inference_mode"],
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return AssessmentResponse(
        assessment_id=assessment.id,
        produce_type=assessment.produce_type,
        quality_state=assessment.quality_state,
        quality_score=assessment.quality_score,
        confidence=assessment.confidence,
        recommendation=assessment.recommendation,
        model_version=assessment.model_version,
        inference_mode=assessment.inference_mode,
        created_at=assessment.created_at,
        temperature=assessment.temperature,
        humidity=assessment.humidity,
        storage_days=assessment.storage_days,
        packaging=assessment.packaging,
        image_url=f"/api/assessments/{assessment.id}/image",
    )


@router.get("", response_model=AssessmentListResponse)
def list_assessments(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    query = (
        select(Assessment)
        .order_by(Assessment.created_at.desc())
        .offset(offset)
        .limit(min(limit, 100))
    )

    assessments = db.scalars(query).all()

    total = len(
        db.scalars(select(Assessment.id)).all(),
    )

    return AssessmentListResponse(
        items=[
            AssessmentResponse(
                assessment_id=item.id,
                produce_type=item.produce_type,
                quality_state=item.quality_state,
                quality_score=item.quality_score,
                confidence=item.confidence,
                recommendation=item.recommendation,
                model_version=item.model_version,
                inference_mode=item.inference_mode,
                created_at=item.created_at,
                temperature=item.temperature,
                humidity=item.humidity,
                storage_days=item.storage_days,
                packaging=item.packaging,
                image_url=f"/api/assessments/{item.id}/image",
            )
            for item in assessments
        ],
        total=total,
    )


@router.get("/{assessment_id}/image")
def get_assessment_image(
    assessment_id: str,
    db: Session = Depends(get_db),
):
    assessment = db.get(Assessment, assessment_id)

    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found.",
        )

    image_path = Path(assessment.image_path)

    if not image_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Image not found.",
        )

    from fastapi.responses import FileResponse

    return FileResponse(image_path)


def get_recommendation(state: str) -> str:
    state = state.lower()

    if state == "fresh":
        return (
            "Continue normal storage and inspect the batch "
            "before distribution."
        )

    if state == "aging":
        return (
            "Prioritize this batch for earlier use and review "
            "storage conditions."
        )

    return (
        "Isolate affected produce and inspect it manually "
        "before making any handling decision."
    )