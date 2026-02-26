from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import uuid


async def universal_search(db: AsyncSession, query: str, user_id: uuid.UUID) -> dict:
    """Full-text search across contacts, companies, and outreach records."""
    safe_query = query.strip()
    if not safe_query:
        return {"contacts": [], "companies": [], "outreach": []}

    # Use ILIKE for now; will switch to tsvector in Phase 5
    contact_result = await db.execute(
        text("""
            SELECT id, first_name, last_name, email, title
            FROM contacts
            WHERE created_by = :user_id
            AND (
                first_name ILIKE :q OR last_name ILIKE :q
                OR email ILIKE :q OR title ILIKE :q
            )
            LIMIT 10
        """),
        {"user_id": str(user_id), "q": f"%{safe_query}%"}
    )
    contacts = [dict(row._mapping) for row in contact_result]

    company_result = await db.execute(
        text("""
            SELECT id, name, domain, industry
            FROM companies
            WHERE created_by = :user_id
            AND (name ILIKE :q OR domain ILIKE :q OR industry ILIKE :q)
            LIMIT 10
        """),
        {"user_id": str(user_id), "q": f"%{safe_query}%"}
    )
    companies = [dict(row._mapping) for row in company_result]

    return {"contacts": contacts, "companies": companies, "outreach": []}
