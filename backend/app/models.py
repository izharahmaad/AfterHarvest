import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


def new_id():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=new_id,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
    )

    assessments: Mapped[list["Assessment"]] = relationship(
        back_populates="user",
    )


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=new_id,
    )

    user_id: Mapped[str | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    produce_type: Mapped[str] = mapped_column(
        String(50),
        default="tomato",
    )

    image_path: Mapped[str] = mapped_column(String(500))

    temperature: Mapped[float] = mapped_column(Float)

    humidity: Mapped[float] = mapped_column(Float)

    storage_days: Mapped[int] = mapped_column()

    packaging: Mapped[str] = mapped_column(String(50))

    quality_state: Mapped[str] = mapped_column(String(30))

    quality_score: Mapped[float] = mapped_column(Float)

    confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    recommendation: Mapped[str] = mapped_column(Text)

    model_version: Mapped[str] = mapped_column(
        String(50),
        default="v1",
    )

    inference_mode: Mapped[str] = mapped_column(
        String(20),
        default="model",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        index=True,
    )

    user: Mapped["User | None"] = relationship(
        back_populates="assessments",
    )