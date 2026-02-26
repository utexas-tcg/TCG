import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional


class OutreachCreate(BaseModel):
    contact_id: Optional[uuid.UUID] = None
    company_id: Optional[uuid.UUID] = None
    status: str = "not_contacted"
    channel: Optional[str] = None
    priority: str = "medium"
    assigned_to: Optional[uuid.UUID] = None
    next_follow_up: Optional[datetime] = None
    notes: Optional[str] = None


class OutreachUpdate(BaseModel):
    status: Optional[str] = None
    channel: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[uuid.UUID] = None
    next_follow_up: Optional[datetime] = None
    notes: Optional[str] = None


class OutreachResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    contact_id: Optional[uuid.UUID] = None
    company_id: Optional[uuid.UUID] = None
    status: str
    channel: Optional[str] = None
    priority: str
    assigned_to: Optional[uuid.UUID] = None
    next_follow_up: Optional[datetime] = None
    notes: Optional[str] = None
    created_by: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
