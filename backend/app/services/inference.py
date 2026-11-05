import json
from pathlib import Path

from app.config import settings


class TomatoInferenceService:
    def __init__(self):
        self.model = None
        self.labels = []
        self.torch = None

    def load(self):
        if not settings.model_path.exists():
            raise FileNotFoundError(
                f"Model file not found: {settings.model_path}"
            )

        if not settings.labels_path.exists():
            raise FileNotFoundError(
                f"Labels file not found: {settings.labels_path}"
            )

        try:
            import torch
            from torchvision import transforms
        except ImportError as error:
            raise RuntimeError(
                "Torch is not installed. The API can run in demo mode, "
                "but model inference is unavailable."
            ) from error

        self.torch = torch

        with settings.labels_path.open(
            encoding="utf-8",
        ) as file:
            self.labels = json.load(file)

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

        self.model = torch.load(
            settings.model_path,
            map_location="cpu",
            weights_only=False,
        )

        self.model.eval()

    def predict(self, image_path: Path):
        if self.model is None:
            self.load()

        from PIL import Image

        image = Image.open(image_path).convert("RGB")

        tensor = self.transform(image).unsqueeze(0)

        with self.torch.no_grad():
            logits = self.model(tensor)

            probabilities = self.torch.softmax(logits, dim=1)[0]

        confidence, predicted_index = self.torch.max(
            probabilities,
            dim=0,
        )

        predicted_label = self.labels[predicted_index.item()]

        score = float(confidence.item())

        return {
            "quality_state": predicted_label,
            "confidence": score,
            "quality_score": self._convert_to_quality_score(
                predicted_label,
                score,
            ),
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