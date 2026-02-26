import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_contacts_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/contacts")
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_create_contact_unauthorized(client: AsyncClient):
    response = await client.post("/api/v1/contacts", json={
        "first_name": "John", "last_name": "Doe", "email": "john@example.com"
    })
    assert response.status_code == 403
