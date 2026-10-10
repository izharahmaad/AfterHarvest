import json
import os
from pathlib import Path
from typing import Any

DATA_DIR = Path(os.getenv("AFTERHARVEST_DATA_DIR", "data"))
DATABASE_PATH = DATA_DIR / "assessments.json"


def _load() -> list[dict[str, Any]]:
    if not DATABASE_PATH.exists():
        return []

    try:
        return json.loads(DATABASE_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []


def _save(records: list[dict[str, Any]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    DATABASE_PATH.write_text(
        json.dumps(records, indent=2),
        encoding="utf-8",
    )


def save_assessment(record: dict[str, Any]) -> dict[str, Any]:
    records = _load()
    records.append(record)
    _save(records)
    return record


def list_assessments() -> list[dict[str, Any]]:
    records = _load()

    return sorted(
        records,
        key=lambda record: record.get("created_at", ""),
        reverse=True,
    )
