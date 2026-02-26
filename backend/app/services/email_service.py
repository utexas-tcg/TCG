"""
Email service module.
Core email sending logic is delegated to gmail_service.
This module provides higher-level email orchestration utilities.
"""
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.email_log import EmailLog
from app.models.email_template import EmailTemplate


async def get_email_log(db: AsyncSession, log_id: uuid.UUID) -> EmailLog | None:
    """Retrieve an email log entry by ID."""
    result = await db.execute(select(EmailLog).where(EmailLog.id == log_id))
    return result.scalar_one_or_none()


async def get_template(db: AsyncSession, template_id: uuid.UUID) -> EmailTemplate | None:
    """Retrieve an email template by ID."""
    result = await db.execute(select(EmailTemplate).where(EmailTemplate.id == template_id))
    return result.scalar_one_or_none()


def render_template(template: EmailTemplate, variables: dict) -> tuple[str, str]:
    """
    Render an email template with the provided variables.
    Returns (subject, body_html) with variables substituted.
    """
    subject = template.subject
    body_html = template.body_html
    for key, value in variables.items():
        placeholder = f"{{{{{key}}}}}"
        subject = subject.replace(placeholder, str(value))
        body_html = body_html.replace(placeholder, str(value))
    return subject, body_html
