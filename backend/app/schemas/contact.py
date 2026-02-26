import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional


class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    linkedin_url: Optional[str] = None
    company_id: Optional[uuid.UUID] = None
    source: Optional[str] = "manual"
    notes: Optional[str] = None
    tags: Optional[list[str]] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    title: Optional[str] = None
    linkedin_url: Optional[str] = None
    company_id: Optional[uuid.UUID] = None
    notes: Optional[str] = None
    tags: Optional[list[str]] = None


class ContactResponse(ContactBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    apollo_id: Optional[str] = None
    created_by: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
