import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.models.email_log import EmailLog
from app.models.email_template import EmailTemplate
from app.schemas.email_log import EmailSendRequest, EmailLogResponse
from app.schemas.email_template import EmailTemplateCreate, EmailTemplateUpdate, EmailTemplateResponse
from app.schemas.common import PaginatedResponse, SingleResponse, Meta
from app.services import gmail_service

router = APIRouter(prefix="/api/v1/emails", tags=["emails"])


@router.post("/send", response_model=SingleResponse[EmailLogResponse])
async def send_email(
    request: EmailSendRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Send an email immediately or schedule it."""
    if not current_user.gmail_access_token:
        raise HTTPException(status_code=400, detail="Gmail not connected")
    if request.scheduled_for:
        log = await gmail_service.schedule_email(
            db, current_user, request.to_address, request.subject, request.body_html,
            request.scheduled_for, request.contact_id, request.outreach_id, request.template_id
        )
    else:
        log = await gmail_service.send_email(
            db, current_user, request.to_address, request.subject, request.body_html,
            request.contact_id, request.outreach_id, request.template_id
        )
    return {"data": log}


@router.get("", response_model=PaginatedResponse[EmailLogResponse])
async def list_emails(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(EmailLog).where(EmailLog.created_by == current_user.id).order_by(EmailLog.created_at.desc())
    )
    logs = result.scalars().all()
    return {"data": logs, "meta": Meta(total=len(logs), page=1, per_page=len(logs))}


@router.get("/templates", response_model=PaginatedResponse[EmailTemplateResponse])
async def list_templates(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(EmailTemplate).where(EmailTemplate.created_by == current_user.id)
    )
    templates = result.scalars().all()
    return {"data": templates, "meta": Meta(total=len(templates), page=1, per_page=len(templates))}


@router.post("/templates", response_model=SingleResponse[EmailTemplateResponse], status_code=201)
async def create_template(
    data: EmailTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    template = EmailTemplate(**data.model_dump(), created_by=current_user.id)
    db.add(template)
    await db.flush()
    return {"data": template}
