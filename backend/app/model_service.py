import json
from io import BytesIO
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, UnidentifiedImageError

from .config import Settings
from .schemas import PredictionResponse, TopPrediction


class ModelService:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.class_indices = self._load_json(settings.class_indices_path)
        self.species_info = self._load_json(settings.species_info_path)
        self.index_to_class = {index: name for name, index in self.class_indices.items()}
        self._model: Any | None = None

    @property
    def model_loaded(self) -> bool:
        return self._model is not None

    def predict(self, image_bytes: bytes) -> PredictionResponse:
        model = self._load_model()
        image_array = self._prepare_image(image_bytes)
        probabilities = np.asarray(model.predict(image_array, verbose=0)[0], dtype=float)

        top_indices = probabilities.argsort()[-3:][::-1]
        top_predictions = [self._prediction_for_index(int(index), probabilities) for index in top_indices]
        best = top_predictions[0]
        species = self.species_info.get(best.class_name, {"class_name": best.class_name, "display_name": best.display_name})

        return PredictionResponse(
            predicted_class=best.class_name,
            display_name=best.display_name,
            confidence=best.confidence,
            confidence_label=self._confidence_label(best.confidence),
            top_predictions=top_predictions,
            species_info=species,
        )

    def _load_model(self) -> Any:
        if self._model is None:
            from tensorflow.keras.models import load_model

            self._model = load_model(self.settings.model_path)
        return self._model

    def _prediction_for_index(self, index: int, probabilities: np.ndarray) -> TopPrediction:
        class_name = self.index_to_class[index]
        species = self.species_info.get(class_name, {})
        return TopPrediction(
            class_name=class_name,
            display_name=species.get("display_name", class_name.replace("_", " ").title()),
            confidence=round(float(probabilities[index]), 6),
        )

    def _confidence_label(self, confidence: float) -> str:
        if confidence >= self.settings.confidence_high:
            return "high"
        if confidence >= self.settings.confidence_low:
            return "uncertain"
        return "low"

    @staticmethod
    def _prepare_image(image_bytes: bytes) -> np.ndarray:
        try:
            with Image.open(BytesIO(image_bytes)) as image:
                image = image.convert("RGB").resize((224, 224))
                array = np.asarray(image, dtype=np.float32)
        except UnidentifiedImageError as exc:
            raise ValueError("File upload is not a valid image.") from exc

        try:
            from tensorflow.keras.applications.efficientnet import preprocess_input

            array = preprocess_input(array)
        except Exception:
            array = array / 255.0

        return np.expand_dims(array, axis=0)

    @staticmethod
    def _load_json(path: Path) -> dict[str, Any]:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)
