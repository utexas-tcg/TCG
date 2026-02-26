from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, contacts, companies, outreach, emails, apollo, search

settings = get_settings()

app = FastAPI(
    title="TCG Platform API",
    description="Internal operations platform for Tech Consulting Group @ UT Austin",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contacts.router)
app.include_router(companies.router)
app.include_router(outreach.router)
app.include_router(emails.router)
app.include_router(apollo.router)
app.include_router(search.router)


@app.get("/api/v1/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "tcg-backend"}
