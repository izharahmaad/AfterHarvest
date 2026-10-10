from pydantic import BaseModel, Field


class VisualProbabilities(BaseModel):
    fresh: float
    aging: float
    spoiled: float


class ContributingFactor(BaseModel):
    name: str
    weight: float


class PredictionResponse(BaseModel):
    assessment_id: str
    produce_type: str
    quality_state: str
    quality_score: float
    confidence: float
    visual_probabilities: VisualProbabilities
    context_score: float
    estimated_usable_days_min: int
    estimated_usable_days_max: int
    contributing_factors: list[ContributingFactor]
    recommendation: str
    model_version: str
    inference_mode: str
    created_at: str


class HistoryItem(BaseModel):
    assessment_id: str
    produce_type: str
    quality_state: str
    quality_score: float
    confidence: float
    temperature: float
    humidity: float
    storage_days: int
    packaging: str
    recommendation: str
    model_version: str
    inference_mode: str
    created_at: str


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
