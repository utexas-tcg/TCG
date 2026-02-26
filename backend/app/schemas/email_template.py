import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional


class EmailTemplateCreate(BaseModel):
    name: str
    subject: str
    body_html: str
    body_text: Optional[str] = None
    variables: Optional[list[str]] = None


class EmailTemplateUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    body_html: Optional[str] = None
    body_text: Optional[str] = None
    variables: Optional[list[str]] = None


class EmailTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    subject: str
    body_html: str
    body_text: Optional[str] = None
    variables: Optional[list[str]] = None
    created_by: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
