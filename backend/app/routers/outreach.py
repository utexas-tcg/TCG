import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.outreach import OutreachCreate, OutreachUpdate, OutreachResponse
from app.schemas.common import PaginatedResponse, SingleResponse, Meta, MessageResponse
from app.services import outreach_service

router = APIRouter(prefix="/api/v1/outreach", tags=["outreach"])


@router.get("", response_model=PaginatedResponse[OutreachResponse])
async def list_outreach(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    records, total = await outreach_service.list_outreach(db, current_user.id, page, per_page)
    return {"data": records, "meta": Meta(total=total, page=page, per_page=per_page)}


@router.post("", response_model=SingleResponse[OutreachResponse], status_code=status.HTTP_201_CREATED)
async def create_outreach(
    data: OutreachCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    record = await outreach_service.create_outreach(db, data, current_user.id)
    return {"data": record}


@router.get("/{outreach_id}", response_model=SingleResponse[OutreachResponse])
async def get_outreach(
    outreach_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    record = await outreach_service.get_outreach(db, outreach_id)
    if not record or record.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return {"data": record}


@router.put("/{outreach_id}", response_model=SingleResponse[OutreachResponse])
async def update_outreach(
    outreach_id: uuid.UUID,
    data: OutreachUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    record = await outreach_service.get_outreach(db, outreach_id)
    if not record or record.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    record = await outreach_service.update_outreach(db, record, data, current_user.id)
    return {"data": record}
