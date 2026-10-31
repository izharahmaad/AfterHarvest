from datetime import datetime

from pydantic import BaseModel, Field


class AssessmentContext(BaseModel):
    temperature: float = Field(ge=-20, le=60)
    humidity: float = Field(ge=0, le=100)
    days: int = Field(ge=0, le=365)
    packaging: str


class AssessmentResponse(BaseModel):
    assessment_id: str
    produce_type: str
    quality_state: str
    quality_score: float
    confidence: float | None
    recommendation: str
    model_version: str
    inference_mode: str
    created_at: datetime

    temperature: float
    humidity: float
    storage_days: int
    packaging: str

    image_url: str | None = None


class AssessmentListResponse(BaseModel):
    items: list[AssessmentResponse]
    total: int