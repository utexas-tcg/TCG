import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional


class CompanyBase(BaseModel):
    name: str
    domain: Optional[str] = None
    industry: Optional[str] = None
    size_range: Optional[str] = None
    headquarters: Optional[str] = None
    website: Optional[str] = None
    linkedin_url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
    industry: Optional[str] = None
    size_range: Optional[str] = None
    headquarters: Optional[str] = None
    website: Optional[str] = None
    linkedin_url: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None


class CompanyResponse(CompanyBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    apollo_id: Optional[str] = None
    created_by: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime
