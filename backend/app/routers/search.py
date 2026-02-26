from fastapi import APIRouter, Depends, Query
from app.middleware.auth import get_current_user
from app.models.user import User
from app.services.search_service import universal_search
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

router = APIRouter(prefix="/api/v1/search", tags=["search"])


@router.get("")
async def search(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Universal search across contacts, companies, and outreach."""
    results = await universal_search(db, q, current_user.id)
    return {"data": results}
