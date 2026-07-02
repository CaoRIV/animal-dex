import type { CollectionCreate, CollectionItem, PredictionResponse, UploadResponse } from "@/lib/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = "Request failed.";
    try {
      const body = await response.json();
      detail = body.detail ?? detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export async function predictAnimal(image: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${apiBaseUrl}/predict`, {
    method: "POST",
    body: formData
  });

  return parseResponse<PredictionResponse>(response);
}

export async function uploadImage(image: File, accessToken: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${apiBaseUrl}/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    body: formData
  });

  return parseResponse<UploadResponse>(response);
}

export async function saveCollectionItem(payload: CollectionCreate, accessToken: string): Promise<CollectionItem> {
  const response = await fetch(`${apiBaseUrl}/collection`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<CollectionItem>(response);
}

export async function getCollection(accessToken: string): Promise<CollectionItem[]> {
  const response = await fetch(`${apiBaseUrl}/collection`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  return parseResponse<CollectionItem[]>(response);
}

export async function deleteCollectionItem(itemId: string, accessToken: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/collection/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  await parseResponse<{ deleted: boolean }>(response);
}
