from typing import Any
from uuid import uuid4

import httpx
from fastapi import HTTPException, UploadFile, status

from .config import Settings
from .schemas import CollectionCreate


class SupabaseService:
    def __init__(self, settings: Settings):
        self.settings = settings

    async def get_user(self, access_token: str) -> dict[str, Any]:
        response = await self._request(
            "GET",
            "/auth/v1/user",
            token=access_token,
            key=self.settings.supabase_anon_key,
        )
        return response

    async def upload_image(self, user_id: str, image: UploadFile) -> dict[str, str]:
        extension = self._extension_for(image.filename)
        path = f"{user_id}/{uuid4()}{extension}"
        content = await image.read()

        if not content:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded image is empty.")
        if len(content) > self.settings.max_upload_bytes:
            raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Uploaded image is too large.")

        headers = {
            "apikey": self.settings.supabase_service_role_key,
            "Authorization": f"Bearer {self.settings.supabase_service_role_key}",
            "Content-Type": image.content_type or "application/octet-stream",
            "x-upsert": "false",
        }
        url = f"{self.settings.supabase_base_url}/storage/v1/object/{self.settings.supabase_storage_bucket}/{path}"

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, headers=headers, content=content)

        if response.status_code >= 400:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Could not upload image to Supabase Storage.")

        signed_url = await self.create_signed_url(path)
        return {"image_path": path, "signed_image_url": signed_url}

    async def create_collection(self, user_id: str, payload: CollectionCreate) -> dict[str, Any]:
        data = payload.model_dump()
        data["user_id"] = user_id

        response = await self._request(
            "POST",
            "/rest/v1/collections",
            json=data,
            key=self.settings.supabase_service_role_key,
            token=self.settings.supabase_service_role_key,
            headers={"Prefer": "return=representation"},
        )
        item = response[0] if isinstance(response, list) and response else response
        return await self._with_signed_url(item)

    async def list_collections(self, user_id: str) -> list[dict[str, Any]]:
        rows = await self._request(
            "GET",
            f"/rest/v1/collections?select=*&user_id=eq.{user_id}&order=created_at.desc",
            key=self.settings.supabase_service_role_key,
            token=self.settings.supabase_service_role_key,
        )
        return [await self._with_signed_url(row) for row in rows]

    async def delete_collection(self, user_id: str, item_id: str) -> dict[str, bool]:
        await self._request(
            "DELETE",
            f"/rest/v1/collections?id=eq.{item_id}&user_id=eq.{user_id}",
            key=self.settings.supabase_service_role_key,
            token=self.settings.supabase_service_role_key,
        )
        return {"deleted": True}

    async def create_signed_url(self, path: str, expires_in: int = 3600) -> str | None:
        response = await self._request(
            "POST",
            f"/storage/v1/object/sign/{self.settings.supabase_storage_bucket}/{path}",
            json={"expiresIn": expires_in},
            key=self.settings.supabase_service_role_key,
            token=self.settings.supabase_service_role_key,
        )
        signed_url = response.get("signedURL") or response.get("signedUrl")
        if not signed_url:
            return None
        if signed_url.startswith("http"):
            return signed_url
        return f"{self.settings.supabase_base_url}/storage/v1{signed_url}"

    async def _with_signed_url(self, item: dict[str, Any]) -> dict[str, Any]:
        image_path = item.get("image_path")
        item["signed_image_url"] = await self.create_signed_url(image_path) if image_path else None
        return item

    async def _request(
        self,
        method: str,
        path: str,
        *,
        key: str,
        token: str,
        json: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
    ) -> Any:
        request_headers = {
            "apikey": key,
            "Authorization": f"Bearer {token}",
        }
        if headers:
            request_headers.update(headers)

        async with httpx.AsyncClient(base_url=self.settings.supabase_base_url, timeout=30) as client:
            response = await client.request(method, path, headers=request_headers, json=json)

        if response.status_code in {401, 403}:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired Supabase token.")
        if response.status_code >= 400:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Supabase request failed.")
        if not response.content:
            return {}
        return response.json()

    @staticmethod
    def _extension_for(filename: str | None) -> str:
        if not filename or "." not in filename:
            return ".jpg"
        extension = "." + filename.rsplit(".", 1)[-1].lower()
        return extension if extension in {".jpg", ".jpeg", ".png", ".webp"} else ".jpg"
