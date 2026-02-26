from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.common import SingleResponse
from app.services import apollo_service
from app.services.auth_service import get_apollo_key

router = APIRouter(prefix="/api/v1/apollo", tags=["apollo"])


class ApolloSearchRequest(BaseModel):
    query: str
    page: int = 1


@router.post("/search/people")
async def search_people(
    request: ApolloSearchRequest,
    current_user: User = Depends(get_current_user),
):
    """Search Apollo.io for people."""
    api_key = await get_apollo_key(current_user)
    if not api_key:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Apollo API key not configured")
    results = await apollo_service.search_people(api_key, request.query, request.page)
    return {"data": results}


@router.post("/search/companies")
async def search_companies(
    request: ApolloSearchRequest,
    current_user: User = Depends(get_current_user),
):
    """Search Apollo.io for companies."""
    api_key = await get_apollo_key(current_user)
    if not api_key:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Apollo API key not configured")
    results = await apollo_service.search_organizations(api_key, request.query, request.page)
    return {"data": results}


@router.post("/import/contact")
async def import_contact(
    apollo_contact: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Import a contact from Apollo.io into the CRM."""
    contact = await apollo_service.import_contact_to_db(db, apollo_contact, current_user.id)
    return {"data": {"id": str(contact.id), "name": f"{contact.first_name} {contact.last_name}"}}


@router.post("/import/company")
async def import_company(
    apollo_company: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Import a company from Apollo.io into the CRM."""
    company = await apollo_service.import_company_to_db(db, apollo_company, current_user.id)
    return {"data": {"id": str(company.id), "name": company.name}}


@router.post("/test-connection")
async def test_apollo_connection(current_user: User = Depends(get_current_user)):
    """Test if the stored Apollo API key is valid."""
    api_key = await get_apollo_key(current_user)
    if not api_key:
        raise HTTPException(status_code=400, detail="No API key configured")
    try:
        await apollo_service.search_people(api_key, "test", page=1)
        return {"data": {"valid": True}}
    except Exception as e:
        return {"data": {"valid": False, "error": str(e)}}
