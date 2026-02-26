import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.company import Company
from app.models.activity_log import ActivityLog
from app.schemas.company import CompanyCreate, CompanyUpdate


async def list_companies(
    db: AsyncSession, created_by: uuid.UUID, page: int = 1, per_page: int = 50
) -> tuple[list[Company], int]:
    offset = (page - 1) * per_page
    total_result = await db.execute(
        select(func.count()).select_from(Company).where(Company.created_by == created_by)
    )
    total = total_result.scalar_one()
    result = await db.execute(
        select(Company)
        .where(Company.created_by == created_by)
        .order_by(Company.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    return result.scalars().all(), total


async def get_company(db: AsyncSession, company_id: uuid.UUID) -> Company | None:
    result = await db.execute(select(Company).where(Company.id == company_id))
    return result.scalar_one_or_none()


async def create_company(
    db: AsyncSession, data: CompanyCreate, created_by: uuid.UUID
) -> Company:
    company = Company(**data.model_dump(), created_by=created_by)
    db.add(company)
    await db.flush()
    log = ActivityLog(
        entity_type="company", entity_id=company.id,
        action="created", performed_by=created_by,
        metadata={"name": company.name}
    )
    db.add(log)
    return company


async def update_company(
    db: AsyncSession, company: Company, data: CompanyUpdate, updated_by: uuid.UUID
) -> Company:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(company, field, value)
    await db.flush()
    log = ActivityLog(
        entity_type="company", entity_id=company.id,
        action="updated", performed_by=updated_by,
    )
    db.add(log)
    return company


async def delete_company(db: AsyncSession, company: Company) -> None:
    await db.delete(company)
