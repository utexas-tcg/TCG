import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.models.email_log import EmailLog
from app.utils.encryption import encrypt, decrypt


async def refresh_token_if_needed(db: AsyncSession, user: User) -> User:
    """Refresh Gmail OAuth token if expired or close to expiring."""
    if not user.gmail_refresh_token:
        return user
    if user.gmail_token_expiry and user.gmail_token_expiry > datetime.now(timezone.utc):
        return user
    # In a real implementation, call Google OAuth refresh endpoint
    # For now, return the user as-is
    return user


async def store_gmail_tokens(
    db: AsyncSession, user: User, access_token: str, refresh_token: str, expiry: datetime
) -> User:
    """Encrypt and store Gmail OAuth tokens."""
    user.gmail_access_token = encrypt(access_token)
    user.gmail_refresh_token = encrypt(refresh_token)
    user.gmail_token_expiry = expiry
    await db.flush()
    return user


async def get_gmail_credentials(user: User) -> dict | None:
    """Get decrypted Gmail credentials."""
    if not user.gmail_access_token:
        return None
    return {
        "access_token": decrypt(user.gmail_access_token),
        "refresh_token": decrypt(user.gmail_refresh_token) if user.gmail_refresh_token else None,
        "token_expiry": user.gmail_token_expiry,
    }


async def send_email(
    db: AsyncSession, user: User, to: str, subject: str, body_html: str,
    contact_id: uuid.UUID | None = None, outreach_id: uuid.UUID | None = None,
    template_id: uuid.UUID | None = None,
) -> EmailLog:
    """Create an email log entry and mark as sent (Gmail API call would go here)."""
    user = await refresh_token_if_needed(db, user)
    log = EmailLog(
        contact_id=contact_id, outreach_id=outreach_id, template_id=template_id,
        from_address=user.email, to_address=to, subject=subject, body_html=body_html,
        status="sent", sent_at=datetime.now(timezone.utc), created_by=user.id,
    )
    db.add(log)
    await db.flush()
    return log


async def schedule_email(
    db: AsyncSession, user: User, to: str, subject: str, body_html: str,
    scheduled_for: datetime, contact_id: uuid.UUID | None = None,
    outreach_id: uuid.UUID | None = None, template_id: uuid.UUID | None = None,
) -> EmailLog:
    """Create a scheduled email log entry and enqueue Celery task."""
    log = EmailLog(
        contact_id=contact_id, outreach_id=outreach_id, template_id=template_id,
        from_address=user.email, to_address=to, subject=subject, body_html=body_html,
        status="scheduled", scheduled_for=scheduled_for, created_by=user.id,
    )
    db.add(log)
    await db.flush()
    # Enqueue Celery task (import here to avoid circular imports)
    from app.tasks.celery_app import send_scheduled_email
    send_scheduled_email.apply_async(
        args=[str(log.id)],
        eta=scheduled_for
    )
    return log
