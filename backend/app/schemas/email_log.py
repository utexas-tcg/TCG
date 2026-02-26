import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional


class EmailSendRequest(BaseModel):
    contact_id: Optional[uuid.UUID] = None
    outreach_id: Optional[uuid.UUID] = None
    template_id: Optional[uuid.UUID] = None
    to_address: str
    subject: str
    body_html: str
    scheduled_for: Optional[datetime] = None


class EmailLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    contact_id: Optional[uuid.UUID] = None
    outreach_id: Optional[uuid.UUID] = None
    template_id: Optional[uuid.UUID] = None
    from_address: str
    to_address: str
    subject: str
    body_html: Optional[str] = None
    status: str
    scheduled_for: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    gmail_message_id: Optional[str] = None
    error_message: Optional[str] = None
    created_by: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
