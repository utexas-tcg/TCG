import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from app.schemas.common import PaginatedResponse, SingleResponse, Meta, MessageResponse
from app.services import company_service

router = APIRouter(prefix="/api/v1/companies", tags=["companies"])


@router.get("", response_model=PaginatedResponse[CompanyResponse])
async def list_companies(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    companies, total = await company_service.list_companies(db, current_user.id, page, per_page)
    return {"data": companies, "meta": Meta(total=total, page=page, per_page=per_page)}


@router.post("", response_model=SingleResponse[CompanyResponse], status_code=status.HTTP_201_CREATED)
async def create_company(
    data: CompanyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    company = await company_service.create_company(db, data, current_user.id)
    return {"data": company}


@router.get("/{company_id}", response_model=SingleResponse[CompanyResponse])
async def get_company(
    company_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    company = await company_service.get_company(db, company_id)
    if not company or company.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return {"data": company}


@router.put("/{company_id}", response_model=SingleResponse[CompanyResponse])
async def update_company(
    company_id: uuid.UUID,
    data: CompanyUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    company = await company_service.get_company(db, company_id)
    if not company or company.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    company = await company_service.update_company(db, company, data, current_user.id)
    return {"data": company}


@router.delete("/{company_id}", response_model=MessageResponse)
async def delete_company(
    company_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    company = await company_service.get_company(db, company_id)
    if not company or company.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    await company_service.delete_company(db, company)
    return {"message": "Company deleted"}
