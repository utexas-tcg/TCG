from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import uuid


async def universal_search(db: AsyncSession, query: str, user_id: uuid.UUID) -> dict:
    """Full-text search using PostgreSQL tsvector."""
    safe_query = query.strip()
    if not safe_query:
        return {"contacts": [], "companies": [], "outreach": []}

    contact_result = await db.execute(
        text("""
            SELECT id, first_name, last_name, email, title
            FROM contacts
            WHERE created_by = :user_id
            AND to_tsvector('english',
                coalesce(first_name,'') || ' ' || coalesce(last_name,'') ||
                ' ' || coalesce(email,'') || ' ' || coalesce(title,''))
            @@ plainto_tsquery('english', :q)
            LIMIT 10
        """),
        {"user_id": str(user_id), "q": safe_query}
    )
    contacts = [dict(row._mapping) for row in contact_result]

    company_result = await db.execute(
        text("""
            SELECT id, name, domain, industry
            FROM companies
            WHERE created_by = :user_id
            AND to_tsvector('english',
                coalesce(name,'') || ' ' || coalesce(domain,'') ||
                ' ' || coalesce(industry,''))
            @@ plainto_tsquery('english', :q)
            LIMIT 10
        """),
        {"user_id": str(user_id), "q": safe_query}
    )
    companies = [dict(row._mapping) for row in company_result]

    return {"contacts": contacts, "companies": companies, "outreach": []}
