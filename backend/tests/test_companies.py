import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_list_companies_unauthorized(client: AsyncClient):
    response = await client.get("/api/v1/companies")
    assert response.status_code == 403
