def get_visual_probabilities() -> dict[str, float]:
    return {
        "fresh": 0.21,
        "aging": 0.68,
        "spoiled": 0.11,
    }


def get_context_score(
    temperature: float,
    humidity: float,
    storage_days: int,
    packaging: str,
) -> float:
    temperature_risk = min(max((temperature - 4) / 26, 0), 1)
    humidity_risk = min(max((humidity - 70) / 30, 0), 1)
    duration_risk = min(storage_days / 14, 1)

    packaging_risk = {
        "open_crate": 0.8,
        "sealed_bag": 0.55,
        "ventilated_box": 0.35,
    }.get(packaging, 0.7)

    return round(
        temperature_risk * 0.30
        + humidity_risk * 0.20
        + duration_risk * 0.35
        + packaging_risk * 0.15,
        3,
    )


def combine_scores(context_score: float) -> float:
    visual_quality = 0.68
    context_quality = 1 - context_score

    return round(
        visual_quality * 0.65 + context_quality * 0.35,
        3,
    )


def get_quality_state(score: float) -> str:
    if score >= 0.70:
        return "fresh"

    if score >= 0.40:
        return "aging"

    return "spoiled"


def get_recommendation(state: str) -> str:
    if state == "fresh":
        return "Low visible spoilage risk. Use or sell this batch soon."

    if state == "aging":
        return "Prioritize this batch for use or sale soon and inspect it manually."

    return "High visible spoilage risk. Inspect manually before use or sale."


def get_confidence(state: str) -> float:
    return {
        "fresh": 0.72,
        "aging": 0.68,
        "spoiled": 0.64,
    }.get(state, 0.50)


def get_usable_days(state: str) -> tuple[int, int]:
    return {
        "fresh": (3, 7),
        "aging": (1, 3),
        "spoiled": (0, 1),
    }.get(state, (0, 1))


def get_contributing_factors(
    temperature: float,
    humidity: float,
    storage_days: int,
    packaging: str,
    context_score: float,
) -> list[dict[str, float | str]]:
    duration_weight = min(storage_days / 14, 1)
    temperature_weight = min(max((temperature - 4) / 26, 0), 1)
    humidity_weight = min(max((humidity - 70) / 30, 0), 1)

    return [
        {
            "name": "visual_color_change",
            "weight": 0.42,
        },
        {
            "name": "storage_duration",
            "weight": round(duration_weight, 3),
        },
        {
            "name": "temperature",
            "weight": round(temperature_weight, 3),
        },
        {
            "name": "humidity",
            "weight": round(humidity_weight, 3),
        },
        {
            "name": "packaging",
            "weight": round(context_score * 0.15, 3),
        },
    ]
