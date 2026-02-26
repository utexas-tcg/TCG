import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.contact import Contact
from app.models.activity_log import ActivityLog
from app.schemas.contact import ContactCreate, ContactUpdate


async def list_contacts(
    db: AsyncSession, created_by: uuid.UUID, page: int = 1, per_page: int = 50
) -> tuple[list[Contact], int]:
    """List contacts with pagination."""
    offset = (page - 1) * per_page
    total_result = await db.execute(
        select(func.count()).select_from(Contact).where(Contact.created_by == created_by)
    )
    total = total_result.scalar_one()
    result = await db.execute(
        select(Contact)
        .where(Contact.created_by == created_by)
        .order_by(Contact.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    return result.scalars().all(), total


async def get_contact(db: AsyncSession, contact_id: uuid.UUID) -> Contact | None:
    """Get a single contact by ID."""
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    return result.scalar_one_or_none()


async def create_contact(
    db: AsyncSession, data: ContactCreate, created_by: uuid.UUID
) -> Contact:
    """Create a new contact and log the activity."""
    contact = Contact(**data.model_dump(), created_by=created_by)
    db.add(contact)
    await db.flush()
    log = ActivityLog(
        entity_type="contact", entity_id=contact.id,
        action="created", performed_by=created_by,
        metadata={"name": f"{contact.first_name} {contact.last_name}"}
    )
    db.add(log)
    return contact


async def update_contact(
    db: AsyncSession, contact: Contact, data: ContactUpdate, updated_by: uuid.UUID
) -> Contact:
    """Update contact fields and log the activity."""
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    await db.flush()
    log = ActivityLog(
        entity_type="contact", entity_id=contact.id,
        action="updated", performed_by=updated_by,
    )
    db.add(log)
    return contact


async def delete_contact(db: AsyncSession, contact: Contact) -> None:
    """Delete a contact."""
    await db.delete(contact)
