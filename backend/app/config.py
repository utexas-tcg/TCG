from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://tcg:tcgpassword@localhost:5432/tcg"
    redis_url: str = "redis://localhost:6379/0"
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = "placeholder-secret"
    apollo_base_url: str = "https://api.apollo.io/v1"
    encryption_key: str = ""
    frontend_url: str = "http://localhost:3000"
    environment: str = "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()
