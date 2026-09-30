from typing import Literal
from pydantic import BaseModel, Field
class Factor(BaseModel):
    name: str
    weight: float = Field(ge=0, le=1)
class Assessment(BaseModel):
    assessment_id: str
    produce_type: Literal['tomato'] = 'tomato'
    quality_state: Literal['fresh','aging','spoiled']
    quality_score: float = Field(ge=0,le=1)
    context_score: float = Field(ge=0,le=1)
    visual_probabilities: dict[str,float] = {}
    contributing_factors: list[Factor]
    recommendation: str
    confidence: float = 0.0
    model_version: str = 'heuristic-demo-v1'
    inference_mode: Literal['demo'] = 'demo'
    image_analyzed: bool = False
    created_at: str
