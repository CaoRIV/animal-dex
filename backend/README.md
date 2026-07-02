# AnimalDex Backend

FastAPI backend cho AnimalDex.

## Chạy local

Từ root project:

```powershell
python -m venv env
env\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Kiểm tra:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

## API chính

- `GET /health`
- `POST /predict`
- `POST /uploads`
- `POST /collection`
- `GET /collection`
- `DELETE /collection/{item_id}`

Các route upload/collection cần header:

```text
Authorization: Bearer <supabase_access_token>
```
