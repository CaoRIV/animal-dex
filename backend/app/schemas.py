from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class TopPrediction(BaseModel):
    class_name: str
    display_name: str
    confidence: float


class PredictionResponse(BaseModel):
    predicted_class: str
    display_name: str
    confidence: float
    confidence_label: str
    top_predictions: list[TopPrediction]
    species_info: dict[str, Any]


class CollectionCreate(BaseModel):
    image_path: str
    image_url: str | None = None
    predicted_class: str
    display_name: str
    confidence: float = Field(ge=0, le=1)
    top_predictions: list[dict[str, Any]]
    species_info: dict[str, Any]


class CollectionItem(CollectionCreate):
    id: str
    user_id: str
    created_at: str
    signed_image_url: str | None = None

    model_config = ConfigDict(extra="allow")


class HealthResponse(BaseModel):
    status: str
    model_file: bool
    class_indices_file: bool
    species_info_file: bool
    model_loaded: bool
    supabase_url_configured: bool
    storage_bucket: str
