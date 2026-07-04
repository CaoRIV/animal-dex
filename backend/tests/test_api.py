from fastapi.testclient import TestClient

from backend.app import main
from backend.app.schemas import PredictionResponse, TopPrediction


class FakeModelService:
    model_loaded = False

    def predict(self, image_bytes: bytes) -> PredictionResponse:
        if image_bytes == b"invalid-image":
            raise ValueError("File upload is not a valid image.")
        return PredictionResponse(
            predicted_class="cat",
            display_name="Cat",
            confidence=0.95,
            confidence_label="high",
            top_predictions=[
                TopPrediction(class_name="cat", display_name="Cat", confidence=0.95),
                TopPrediction(class_name="dog", display_name="Dog", confidence=0.03),
                TopPrediction(class_name="fox", display_name="Fox", confidence=0.02),
            ],
            species_info={
                "class_name": "cat",
                "display_name": "Cat",
                "description": "Small domesticated mammal.",
                "habitat": "Homes",
                "diet": "Carnivore",
                "animal_group": "Mammal",
                "danger_level": "Low",
                "fun_fact": "Cats are agile.",
            },
        )


class FakeSupabaseService:
    async def get_user(self, access_token: str) -> dict:
        if access_token == "valid-token":
            return {"id": "user-123"}
        raise AssertionError("Unexpected token in fake auth service.")

    async def upload_image(self, user_id: str, image) -> dict[str, str]:
        assert user_id == "user-123"
        return {"image_path": "user-123/test.jpg", "signed_image_url": "https://signed.example/test.jpg"}

    async def create_collection(self, user_id: str, payload) -> dict:
        data = payload.model_dump()
        data.update({"id": "item-123", "user_id": user_id, "created_at": "2026-07-04T00:00:00Z", "signed_image_url": None})
        return data

    async def list_collections(self, user_id: str) -> list[dict]:
        assert user_id == "user-123"
        return [
            {
                "id": "item-123",
                "user_id": user_id,
                "image_path": "user-123/test.jpg",
                "image_url": None,
                "predicted_class": "cat",
                "display_name": "Cat",
                "confidence": 0.95,
                "top_predictions": [],
                "species_info": {},
                "created_at": "2026-07-04T00:00:00Z",
                "signed_image_url": "https://signed.example/test.jpg",
            }
        ]

    async def delete_collection(self, user_id: str, item_id: str) -> dict[str, bool]:
        assert user_id == "user-123"
        assert item_id == "item-123"
        return {"deleted": True}


def make_client() -> TestClient:
    main.app.dependency_overrides[main.get_model_service] = lambda: FakeModelService()
    main.app.dependency_overrides[main.get_supabase_service] = lambda: FakeSupabaseService()
    return TestClient(main.app)


def teardown_function() -> None:
    main.app.dependency_overrides.clear()


def auth_headers() -> dict[str, str]:
    return {"Authorization": "Bearer valid-token"}


def collection_payload() -> dict:
    return {
        "image_path": "user-123/test.jpg",
        "image_url": None,
        "predicted_class": "cat",
        "display_name": "Cat",
        "confidence": 0.95,
        "top_predictions": [{"class_name": "cat", "display_name": "Cat", "confidence": 0.95}],
        "species_info": {
            "class_name": "cat",
            "display_name": "Cat",
            "description": "Small domesticated mammal.",
            "habitat": "Homes",
            "diet": "Carnivore",
            "animal_group": "Mammal",
            "danger_level": "Low",
            "fun_fact": "Cats are agile.",
        },
    }


def test_predict_returns_prediction_for_image_upload() -> None:
    client = make_client()

    response = client.post("/predict", files={"image": ("cat.jpg", b"fake-image-bytes", "image/jpeg")})

    assert response.status_code == 200
    body = response.json()
    assert body["predicted_class"] == "cat"
    assert body["confidence_label"] == "high"
    assert len(body["top_predictions"]) == 3


def test_predict_rejects_non_image_upload() -> None:
    client = make_client()

    response = client.post("/predict", files={"image": ("notes.txt", b"hello", "text/plain")})

    assert response.status_code == 400
    assert response.json()["detail"] == "Uploaded file must be an image."


def test_collection_requires_bearer_token() -> None:
    client = make_client()

    response = client.get("/collection")

    assert response.status_code == 401
    assert response.json()["detail"] == "Missing bearer token."


def test_list_collection_uses_authenticated_user() -> None:
    client = make_client()

    response = client.get("/collection", headers=auth_headers())

    assert response.status_code == 200
    assert response.json()[0]["user_id"] == "user-123"


def test_create_collection_uses_authenticated_user() -> None:
    client = make_client()

    response = client.post("/collection", json=collection_payload(), headers=auth_headers())

    assert response.status_code == 200
    assert response.json()["id"] == "item-123"
    assert response.json()["user_id"] == "user-123"


def test_delete_collection_uses_authenticated_user() -> None:
    client = make_client()

    response = client.delete("/collection/item-123", headers=auth_headers())

    assert response.status_code == 200
    assert response.json() == {"deleted": True}
