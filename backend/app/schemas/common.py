from pydantic import BaseModel
from typing import Generic, TypeVar, Any

T = TypeVar("T")


class Meta(BaseModel):
    total: int
    page: int
    per_page: int


class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    meta: Meta


class SingleResponse(BaseModel, Generic[T]):
    data: T


class MessageResponse(BaseModel):
    message: str
