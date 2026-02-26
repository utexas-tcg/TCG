from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.common import SingleResponse

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.get("/me", response_model=SingleResponse[UserResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user."""
    return {"data": current_user}


@router.put("/me", response_model=SingleResponse[UserResponse])
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user profile."""
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.avatar_url is not None:
        current_user.avatar_url = data.avatar_url
    if data.apollo_api_key is not None:
        from app.services.auth_service import update_apollo_key
        await update_apollo_key(db, current_user, data.apollo_api_key)
    return {"data": current_user}
