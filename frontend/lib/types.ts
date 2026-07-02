export type ConfidenceLabel = "high" | "uncertain" | "low";

export type TopPrediction = {
  class_name: string;
  display_name: string;
  confidence: number;
};

export type SpeciesInfo = {
  class_name: string;
  display_name: string;
  description: string;
  habitat: string;
  diet: string;
  animal_group: string;
  danger_level: string;
  fun_fact: string;
};

export type PredictionResponse = {
  predicted_class: string;
  display_name: string;
  confidence: number;
  confidence_label: ConfidenceLabel;
  top_predictions: TopPrediction[];
  species_info: SpeciesInfo;
};

export type UploadResponse = {
  image_path: string;
  signed_image_url: string | null;
};

export type CollectionCreate = {
  image_path: string;
  image_url?: string | null;
  predicted_class: string;
  display_name: string;
  confidence: number;
  top_predictions: TopPrediction[];
  species_info: SpeciesInfo;
};

export type CollectionItem = CollectionCreate & {
  id: string;
  user_id: string;
  created_at: string;
  signed_image_url: string | null;
};
