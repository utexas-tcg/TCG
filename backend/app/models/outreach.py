import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class OutreachRecord(Base):
    __tablename__ = "outreach_records"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    contact_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("contacts.id"))
    company_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("companies.id"))
    status: Mapped[str] = mapped_column(String, default="not_contacted")
    channel: Mapped[str | None] = mapped_column(String)
    priority: Mapped[str] = mapped_column(String, default="medium")
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    next_follow_up: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notes: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
