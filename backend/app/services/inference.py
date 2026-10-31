import json
from pathlib import Path

import torch
from PIL import Image
from torchvision import transforms

from app.config import settings


class TomatoInferenceService:
    def __init__(self):
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        self.model = None
        self.labels: list[str] = []

        self.transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225],
                ),
            ]
        )

    def load(self):
        if not settings.model_path.exists():
            raise FileNotFoundError(
                f"Model file not found: {settings.model_path}"
            )

        if not settings.labels_path.exists():
            raise FileNotFoundError(
                f"Labels file not found: {settings.labels_path}"
            )

        with settings.labels_path.open(
            encoding="utf-8",
        ) as file:
            self.labels = json.load(file)

        self.model = torch.load(
            settings.model_path,
            map_location=self.device,
            weights_only=False,
        )

        self.model.eval()

    def predict(self, image_path: Path) -> dict:
        if self.model is None:
            self.load()

        image = Image.open(image_path).convert("RGB")

        tensor = self.transform(image).unsqueeze(0).to(
            self.device,
        )

        with torch.no_grad():
            logits = self.model(tensor)

            probabilities = torch.softmax(logits, dim=1)[0]

        confidence, predicted_index = torch.max(
            probabilities,
            dim=0,
        )

        predicted_label = self.labels[predicted_index.item()]

        score = float(confidence.item())

        quality_score = self._convert_to_quality_score(
            predicted_label,
            score,
        )

        return {
            "quality_state": predicted_label,
            "confidence": score,
            "quality_score": quality_score,
            "model_version": "tomato-cnn-v1",
            "inference_mode": "model",
        }

    def _convert_to_quality_score(
        self,
        label: str,
        confidence: float,
    ) -> float:
        label = label.lower()

        if label == "fresh":
            base = 85
        elif label == "aging":
            base = 55
        else:
            base = 20

        return round(min(100, base + confidence * 15), 1)


inference_service = TomatoInferenceService()