from uuid import uuid4
from datetime import datetime, timezone
from app.schemas.assessment import Assessment
class DemoInferenceService:
    """Illustrative context-only heuristics, not learned or validated agronomy."""
    def predict(self, temperature_c, humidity_percent, storage_days, packaging):
        factors={'temperature':min(max((temperature_c-5)/15,0),1),'storage_duration':min(storage_days/10,1),'humidity':min(max((humidity_percent-70)/30,0),1)}
        risk=0.50*factors['temperature']+0.35*factors['storage_duration']+0.15*factors['humidity']
        score=round(max(0.10,0.90-0.70*risk),2)
        state='fresh' if score>=0.72 else 'aging' if score>=0.42 else 'spoiled'
        return Assessment(assessment_id=str(uuid4()),quality_state=state,quality_score=score,context_score=round(1-risk,2),contributing_factors=[{'name':k,'weight':round(v,2)} for k,v in factors.items()],recommendation='Demo only: inspect the tomato manually. No image-based quality or food-safety determination was performed.',created_at=datetime.now(timezone.utc).isoformat())
