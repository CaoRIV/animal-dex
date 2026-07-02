# AnimalDex

AnimalDex is an AI-powered animal recognition web application. Users can upload an animal image, receive a model prediction with confidence scores, review species information, and save recognized animals into a personal collection through Supabase Auth and Storage.

## Features

- Image-based animal classification with a trained TensorFlow/Keras model.
- Top prediction results with confidence scores.
- Species metadata display, including habitat, diet, animal group, danger level, and short facts.
- Vietnamese and English UI support.
- Optional Vietnamese species display layer for localized species names and summary fields.
- Supabase authentication for personal collections.
- Supabase Storage integration for saved animal images.
- FastAPI backend with health check, prediction, upload, and collection APIs.
- Next.js frontend with responsive dashboard-style UI.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, CSS |
| Backend | FastAPI, Uvicorn, Pydantic |
| Model | TensorFlow/Keras |
| Database/Auth/Storage | Supabase |
| Runtime | Node.js, Python |

## Project Structure

```text
AnimalDex/
|-- backend/                 # FastAPI API service
|   |-- app/
|   |   |-- main.py          # API routes and CORS setup
|   |   |-- model_service.py # Model loading and prediction logic
|   |   |-- supabase_service.py
|   |   |-- schemas.py
|   |   `-- config.py
|   `-- requirements.txt
|-- frontend/                # Next.js application
|   |-- app/
|   |-- components/
|   `-- lib/
|-- model/                   # Local model artifacts
|   |-- animal_model.keras
|   |-- class_indices.json
|   |-- species_info.json
|   |-- model_metrics.json
|   `-- confusion_matrix.png
|-- supabase/                # Supabase schema and setup notes
|-- .env.example
`-- README.md
```

## Required Model Files

The backend expects these files to exist before prediction can work:

```text
model/animal_model.keras
model/class_indices.json
model/species_info.json
```

You can verify model availability through:

```text
GET http://127.0.0.1:8000/health
```

## Environment Variables

Copy the root example file:

```powershell
Copy-Item .env.example .env
```

Required backend variables:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_STORAGE_BUCKET=animal-uploads

MODEL_PATH=model/animal_model.keras
CLASS_INDICES_PATH=model/class_indices.json
SPECIES_INFO_PATH=model/species_info.json
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Required frontend variables are stored in `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Never commit real `.env` or `.env.local` files.

## Supabase Setup

1. Create a Supabase project.
2. Run the SQL schema in `supabase/schema.sql`.
3. Create or verify the storage bucket:

```text
animal-uploads
```

4. Enable authentication providers as needed.
5. Add the Supabase URL, anon key, and service role key to `.env`.

See `supabase/setup.md` for the local setup notes.

## Backend Setup

From the project root:

```powershell
python -m venv env
.\env\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

Run the backend:

```powershell
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

The root route `/` is not used by the API, so `http://127.0.0.1:8000/` may return `404`. Use `/health` to check backend status.

## Frontend Setup

From the frontend directory:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

Useful frontend commands:

```powershell
npm run dev
npm run build
npm run start
```

## API Overview

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/health` | Backend, model, and Supabase configuration status | No |
| `POST` | `/predict` | Predict animal class from uploaded image | No |
| `POST` | `/uploads` | Upload an image to Supabase Storage | Yes |
| `POST` | `/collection` | Save a prediction result to the user's collection | Yes |
| `GET` | `/collection` | List saved collection items | Yes |
| `DELETE` | `/collection/{item_id}` | Delete one saved collection item | Yes |

Authenticated routes require:

```text
Authorization: Bearer <supabase_access_token>
```

## Development Notes

- Use `env` as the main Python virtual environment on Windows.
- `venv` and `.venv` are older local environments and are ignored by Git.
- Keep large datasets outside the repository.
- Keep trained model artifacts organized under `model/`.
- The frontend uses public Supabase variables only; backend service role keys must stay server-side.

## Troubleshooting

If the frontend appears stuck at `Starting...`:

1. Stop the terminal with `Ctrl + C`.
2. Check whether port `3000` is already in use:

```powershell
netstat -ano | Select-String ":3000"
```

3. Stop the old process if needed:

```powershell
Stop-Process -Id <PID> -Force
```

4. Start again:

```powershell
cd frontend
npm run dev
```

If the backend port is busy:

```powershell
netstat -ano | Select-String ":8000"
Stop-Process -Id <PID> -Force
```

## Current Status

- Backend API is implemented.
- Frontend upload, prediction, auth, collection, and profile views are implemented.
- Model artifacts are present locally under `model/`.
- Supabase schema and setup notes are included.

## License

This project is currently for learning and portfolio development. Add a license file before publishing or distributing it publicly.
