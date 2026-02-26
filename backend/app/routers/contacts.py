import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.schemas.common import PaginatedResponse, SingleResponse, Meta, MessageResponse
from app.services import contact_service

router = APIRouter(prefix="/api/v1/contacts", tags=["contacts"])


@router.get("", response_model=PaginatedResponse[ContactResponse])
async def list_contacts(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    contacts, total = await contact_service.list_contacts(db, current_user.id, page, per_page)
    return {"data": contacts, "meta": Meta(total=total, page=page, per_page=per_page)}


@router.post("", response_model=SingleResponse[ContactResponse], status_code=status.HTTP_201_CREATED)
async def create_contact(
    data: ContactCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    contact = await contact_service.create_contact(db, data, current_user.id)
    return {"data": contact}


@router.get("/{contact_id}", response_model=SingleResponse[ContactResponse])
async def get_contact(
    contact_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    contact = await contact_service.get_contact(db, contact_id)
    if not contact or contact.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    return {"data": contact}


@router.put("/{contact_id}", response_model=SingleResponse[ContactResponse])
async def update_contact(
    contact_id: uuid.UUID,
    data: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    contact = await contact_service.get_contact(db, contact_id)
    if not contact or contact.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    contact = await contact_service.update_contact(db, contact, data, current_user.id)
    return {"data": contact}


@router.delete("/{contact_id}", response_model=MessageResponse)
async def delete_contact(
    contact_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    contact = await contact_service.get_contact(db, contact_id)
    if not contact or contact.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    await contact_service.delete_contact(db, contact)
    return {"message": "Contact deleted"}
