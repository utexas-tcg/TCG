import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.utils.encryption import encrypt, decrypt


async def get_or_create_user(db: AsyncSession, user_id: str, email: str) -> User:
    """Get existing user or create new one on first login."""
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        user = User(id=uuid.UUID(user_id), email=email)
        db.add(user)
        await db.flush()
    return user


async def update_apollo_key(db: AsyncSession, user: User, api_key: str) -> User:
    """Store encrypted Apollo API key for user."""
    user.apollo_api_key = encrypt(api_key)
    await db.flush()
    return user


async def get_apollo_key(user: User) -> str | None:
    """Decrypt and return the Apollo API key."""
    if not user.apollo_api_key:
        return None
    return decrypt(user.apollo_api_key)
