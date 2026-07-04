import os

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "test-anon-key")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")
os.environ.setdefault("SUPABASE_STORAGE_BUCKET", "animal-uploads")
os.environ.setdefault("MODEL_PATH", "model/animal_model.keras")
os.environ.setdefault("CLASS_INDICES_PATH", "model/class_indices.json")
os.environ.setdefault("SPECIES_INFO_PATH", "model/species_info.json")
