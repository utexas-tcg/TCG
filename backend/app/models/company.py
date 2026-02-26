import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func, ForeignKey, ARRAY, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    domain: Mapped[str | None] = mapped_column(String)
    industry: Mapped[str | None] = mapped_column(String)
    size_range: Mapped[str | None] = mapped_column(String)
    headquarters: Mapped[str | None] = mapped_column(String)
    website: Mapped[str | None] = mapped_column(String)
    linkedin_url: Mapped[str | None] = mapped_column(String)
    apollo_id: Mapped[str | None] = mapped_column(String, unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    tags: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    created_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
