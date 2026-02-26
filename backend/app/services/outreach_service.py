import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.outreach import OutreachRecord
from app.models.activity_log import ActivityLog
from app.schemas.outreach import OutreachCreate, OutreachUpdate


async def list_outreach(
    db: AsyncSession, created_by: uuid.UUID, page: int = 1, per_page: int = 50
) -> tuple[list[OutreachRecord], int]:
    offset = (page - 1) * per_page
    total_result = await db.execute(
        select(func.count()).select_from(OutreachRecord).where(OutreachRecord.created_by == created_by)
    )
    total = total_result.scalar_one()
    result = await db.execute(
        select(OutreachRecord)
        .where(OutreachRecord.created_by == created_by)
        .order_by(OutreachRecord.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    return result.scalars().all(), total


async def get_outreach(db: AsyncSession, outreach_id: uuid.UUID) -> OutreachRecord | None:
    result = await db.execute(select(OutreachRecord).where(OutreachRecord.id == outreach_id))
    return result.scalar_one_or_none()


async def create_outreach(
    db: AsyncSession, data: OutreachCreate, created_by: uuid.UUID
) -> OutreachRecord:
    record = OutreachRecord(**data.model_dump(), created_by=created_by)
    db.add(record)
    await db.flush()
    log = ActivityLog(
        entity_type="outreach", entity_id=record.id,
        action="created", performed_by=created_by,
        metadata={"status": record.status}
    )
    db.add(log)
    return record


async def update_outreach(
    db: AsyncSession, record: OutreachRecord, data: OutreachUpdate, updated_by: uuid.UUID
) -> OutreachRecord:
    old_status = record.status
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(record, field, value)
    await db.flush()
    action = "status_changed" if data.status and data.status != old_status else "updated"
    log = ActivityLog(
        entity_type="outreach", entity_id=record.id,
        action=action, performed_by=updated_by,
        metadata={"old_status": old_status, "new_status": record.status} if action == "status_changed" else None
    )
    db.add(log)
    return record
