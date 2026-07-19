from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    cors_origins: str
    rate_limit_default: str = "60/minute"
    rate_limit_ai: str = "10/minute"
    environment: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()