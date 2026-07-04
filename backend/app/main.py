from functools import lru_cache

from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings, get_settings
from .model_service import ModelService
from .schemas import CollectionCreate, CollectionItem, HealthResponse, PredictionResponse
from .supabase_service import SupabaseService


app = FastAPI(title="AnimalDex API", version="0.1.0")


@lru_cache
def get_model_service() -> ModelService:
    return ModelService(get_settings())


@lru_cache
def get_supabase_service() -> SupabaseService:
    return SupabaseService(get_settings())


settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def current_user(
    authorization: str | None = Header(default=None),
    supabase: SupabaseService = Depends(get_supabase_service),
) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token.")
    token = authorization.split(" ", 1)[1].strip()
    return await supabase.get_user(token)


@app.get("/health", response_model=HealthResponse)
async def health(settings: Settings = Depends(get_settings), model_service: ModelService = Depends(get_model_service)) -> HealthResponse:
    return HealthResponse(
        status="ok",
        model_file=settings.model_path.exists(),
        class_indices_file=settings.class_indices_path.exists(),
        species_info_file=settings.species_info_path.exists(),
        model_loaded=model_service.model_loaded,
        supabase_url_configured=bool(settings.supabase_url),
        storage_bucket=settings.supabase_storage_bucket,
    )


@app.post("/predict", response_model=PredictionResponse)
async def predict(
    image: UploadFile = File(...),
    model_service: ModelService = Depends(get_model_service),
    settings: Settings = Depends(get_settings),
) -> PredictionResponse:
    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file must be an image.")

    content = await image.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded image is empty.")
    if len(content) > settings.max_upload_bytes:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Uploaded image is too large.")

    try:
        return model_service.predict(content)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@app.post("/uploads")
async def upload_image(
    image: UploadFile = File(...),
    user: dict = Depends(current_user),
    supabase: SupabaseService = Depends(get_supabase_service),
) -> dict[str, str]:
    if image.content_type and not image.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file must be an image.")
    return await supabase.upload_image(user["id"], image)


@app.post("/collection", response_model=CollectionItem)
async def create_collection_item(
    payload: CollectionCreate,
    user: dict = Depends(current_user),
    supabase: SupabaseService = Depends(get_supabase_service),
) -> dict:
    return await supabase.create_collection(user["id"], payload)


@app.get("/collection", response_model=list[CollectionItem])
async def list_collection_items(
    user: dict = Depends(current_user),
    supabase: SupabaseService = Depends(get_supabase_service),
) -> list[dict]:
    return await supabase.list_collections(user["id"])


@app.delete("/collection/{item_id}")
async def delete_collection_item(
    item_id: str,
    user: dict = Depends(current_user),
    supabase: SupabaseService = Depends(get_supabase_service),
) -> dict[str, bool]:
    return await supabase.delete_collection(user["id"], item_id)
