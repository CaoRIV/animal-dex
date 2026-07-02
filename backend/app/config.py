from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_url: str = Field(alias="SUPABASE_URL")
    supabase_anon_key: str = Field(alias="SUPABASE_ANON_KEY")
    supabase_service_role_key: str = Field(alias="SUPABASE_SERVICE_ROLE_KEY")
    supabase_storage_bucket: str = Field(default="animal-uploads", alias="SUPABASE_STORAGE_BUCKET")

    model_path: Path = Field(default=Path("model/animal_model.keras"), alias="MODEL_PATH")
    class_indices_path: Path = Field(default=Path("model/class_indices.json"), alias="CLASS_INDICES_PATH")
    species_info_path: Path = Field(default=Path("model/species_info.json"), alias="SPECIES_INFO_PATH")
    cors_origins: str = Field(default="http://localhost:3000", alias="CORS_ORIGINS")

    confidence_high: float = 0.7
    confidence_low: float = 0.4
    max_upload_bytes: int = 10 * 1024 * 1024

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    @property
    def supabase_base_url(self) -> str:
        return self.supabase_url.rstrip("/")

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
