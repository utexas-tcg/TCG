import uuid
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.contact import Contact
from app.models.company import Company
from app.utils.encryption import decrypt


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=30))
async def search_people(apollo_api_key: str, query: str, page: int = 1) -> dict:
    """Search Apollo.io for people."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.apollo.io/v1/mixed_people/search",
            headers={"X-Api-Key": apollo_api_key, "Content-Type": "application/json"},
            json={"q_keywords": query, "page": page, "per_page": 25},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=30))
async def search_organizations(apollo_api_key: str, query: str, page: int = 1) -> dict:
    """Search Apollo.io for organizations."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.apollo.io/v1/mixed_companies/search",
            headers={"X-Api-Key": apollo_api_key, "Content-Type": "application/json"},
            json={"q_keywords": query, "page": page, "per_page": 25},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()


async def import_contact_to_db(
    db: AsyncSession, apollo_contact: dict, user_id: uuid.UUID
) -> Contact:
    """Import an Apollo contact into the DB, deduplicating by apollo_id."""
    apollo_id = apollo_contact.get("id")
    if apollo_id:
        result = await db.execute(select(Contact).where(Contact.apollo_id == apollo_id))
        existing = result.scalar_one_or_none()
        if existing:
            return existing

    # Find or create company
    company_id = None
    org = apollo_contact.get("organization")
    if org and org.get("id"):
        result = await db.execute(select(Company).where(Company.apollo_id == org["id"]))
        company = result.scalar_one_or_none()
        if not company:
            company = Company(
                name=org.get("name", "Unknown"),
                domain=org.get("primary_domain"),
                apollo_id=org["id"],
                created_by=user_id,
            )
            db.add(company)
            await db.flush()
        company_id = company.id

    phone = None
    phones = apollo_contact.get("phone_numbers", [])
    if phones:
        phone = phones[0].get("sanitized_number")

    contact = Contact(
        first_name=apollo_contact.get("first_name", ""),
        last_name=apollo_contact.get("last_name", ""),
        email=apollo_contact.get("email"),
        phone=phone,
        title=apollo_contact.get("title"),
        linkedin_url=apollo_contact.get("linkedin_url"),
        company_id=company_id,
        apollo_id=apollo_id,
        source="apollo",
        created_by=user_id,
    )
    db.add(contact)
    await db.flush()
    return contact


async def import_company_to_db(
    db: AsyncSession, apollo_org: dict, user_id: uuid.UUID
) -> Company:
    """Import an Apollo organization into the DB, deduplicating by apollo_id."""
    apollo_id = apollo_org.get("id")
    if apollo_id:
        result = await db.execute(select(Company).where(Company.apollo_id == apollo_id))
        existing = result.scalar_one_or_none()
        if existing:
            return existing

    company = Company(
        name=apollo_org.get("name", "Unknown"),
        domain=apollo_org.get("primary_domain"),
        industry=apollo_org.get("industry"),
        website=apollo_org.get("website_url"),
        linkedin_url=apollo_org.get("linkedin_url"),
        apollo_id=apollo_id,
        created_by=user_id,
    )
    db.add(company)
    await db.flush()
    return company
