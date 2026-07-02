"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ImageOff, LoaderCircle, Trash2 } from "lucide-react";
import { deleteCollectionItem, getCollection } from "@/lib/api";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { CollectionItem } from "@/lib/types";

export function CollectionView() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(() => {
    const unique = new Set(items.map((item) => item.species_info.animal_group).filter(Boolean));
    return ["All", ...Array.from(unique).sort()];
  }, [items]);

  const visibleItems = filter === "All" ? items : items.filter((item) => item.species_info.animal_group === filter);

  async function loadCollection() {
    setIsLoading(true);
    setError(null);

    try {
      if (!supabase) {
        setItems([]);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setItems([]);
        return;
      }
      setItems(await getCollection(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải album.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(itemId: string) {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    await deleteCollectionItem(itemId, token);
    setItems((current) => current.filter((item) => item.id !== itemId));
  }

  useEffect(() => {
    loadCollection();
  }, []);

  return (
    <section>
      <div className="collection-header">
        <div>
          <span className="eyebrow">Personal discovery album</span>
          <h1 className="section-title">Collection</h1>
          <p className="section-subtitle">Các ảnh đã nhận diện được lưu cùng confidence, top predictions và dữ liệu loài.</p>
        </div>
        <div className="filter-row" aria-label="Lọc album theo nhóm động vật">
          {groups.map((group) => (
            <button
              className={`group-chip ${filter === group ? "active" : ""}`}
              key={group}
              type="button"
              onClick={() => setFilter(group)}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {!isSupabaseConfigured() ? <div className="notice error">Cần cấu hình Supabase env để xem album.</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      {isLoading ? (
        <div className="card empty-state">
          <LoaderCircle className="loading" size={38} aria-hidden="true" />
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="card empty-state">
          <div>
            <ImageOff size={44} aria-hidden="true" />
            <h2 className="section-title">Album đang trống</h2>
            <p className="section-subtitle">Nhận diện một ảnh rồi lưu vào collection để bắt đầu bộ sưu tập.</p>
            <Link className="button button-primary" href="/">
              Nhận diện ảnh mới
            </Link>
          </div>
        </div>
      ) : (
        <div className="collection-grid">
          {visibleItems.map((item) => (
            <article className="animal-card" key={item.id}>
              <div className="animal-image">
                {item.signed_image_url ? (
                  <img src={item.signed_image_url} alt={`Ảnh đã lưu của ${item.display_name}`} loading="lazy" />
                ) : null}
              </div>
              <div className="animal-body">
                <div className="animal-title">
                  <div>
                    <h2>{item.display_name}</h2>
                    <span className="muted">{new Date(item.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <span className="confidence-pill high">{Math.round(item.confidence * 100)}%</span>
                </div>
                <p className="muted">{item.species_info.fun_fact}</p>
                <div className="row">
                  <span className="tag">{item.species_info.animal_group}</span>
                  <button className="button button-danger" type="button" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} />
                    Xóa
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
