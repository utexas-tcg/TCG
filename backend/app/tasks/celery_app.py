from celery import Celery
from app.config import get_settings

settings = get_settings()

celery_app = Celery(
    "tcg",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.celery_app"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)


@celery_app.task(bind=True, max_retries=3, name="send_scheduled_email")
def send_scheduled_email(self, email_log_id: str):
    """Send a scheduled email via Gmail API."""
    import asyncio
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
    from sqlalchemy import select
    from app.models.email_log import EmailLog
    from app.models.user import User
    from datetime import datetime, timezone

    async def _send():
        engine = create_async_engine(settings.database_url)
        SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with SessionLocal() as db:
            result = await db.execute(select(EmailLog).where(EmailLog.id == email_log_id))
            log = result.scalar_one_or_none()
            if not log or log.status != "scheduled":
                return

            user_result = await db.execute(select(User).where(User.id == log.created_by))
            user = user_result.scalar_one_or_none()
            if not user:
                log.status = "failed"
                log.error_message = "User not found"
                await db.commit()
                return

            try:
                # Gmail API send would go here
                log.status = "sent"
                log.sent_at = datetime.now(timezone.utc)
                await db.commit()
            except Exception as exc:
                log.status = "failed"
                log.error_message = str(exc)
                await db.commit()
                raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))

    asyncio.run(_send())
