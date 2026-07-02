"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ImageOff, LoaderCircle, Trash2 } from "lucide-react";
import { deleteCollectionItem, getCollection } from "@/lib/api";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { CollectionItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { localizeSpeciesInfo } from "@/lib/species-info-vi";

export function CollectionView() {
  const { language, t } = useI18n();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groups = useMemo(() => {
    const unique = new Set(
      items.map((item) => localizeSpeciesInfo(item.species_info, language).animal_group).filter(Boolean)
    );
    return ["All", ...Array.from(unique).sort()];
  }, [items, language]);

  const visibleItems =
    filter === "All"
      ? items
      : items.filter((item) => localizeSpeciesInfo(item.species_info, language).animal_group === filter);

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
      setError(err instanceof Error ? err.message : t("collectionLoadFailed"));
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

  useEffect(() => {
    if (!groups.includes(filter)) {
      setFilter("All");
    }
  }, [filter, groups]);

  return (
    <section>
      <div className="collection-header">
        <div>
          <span className="eyebrow">{t("collectionEyebrow")}</span>
          <h1 className="section-title">{t("collectionTitle")}</h1>
        </div>
        <div className="filter-row" aria-label="Filter album by animal group">
          {groups.map((group) => (
            <button
              className={`group-chip ${filter === group ? "active" : ""}`}
              key={group}
              type="button"
              onClick={() => setFilter(group)}
            >
              {group === "All" ? t("all") : group}
            </button>
          ))}
        </div>
      </div>

      {!isSupabaseConfigured() ? <div className="notice error">{t("collectionNeedsConfig")}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      {isLoading ? (
        <div className="card empty-state">
          <LoaderCircle className="loading" size={38} aria-hidden="true" />
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="card empty-state">
          <div>
            <ImageOff size={44} aria-hidden="true" />
            <h2 className="section-title">{t("collectionEmpty")}</h2>
            <p className="section-subtitle">{t("collectionEmptyBody")}</p>
            <Link className="button button-primary" href="/">
              {t("identifyNew")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="collection-grid">
          {visibleItems.map((item) => {
            const speciesInfo = localizeSpeciesInfo(item.species_info, language);

            return (
              <article className="animal-card" key={item.id}>
                <div className="animal-image">
                  {item.signed_image_url ? (
                    <img
                      src={item.signed_image_url}
                      alt={`${t("savedPhotoAlt")} ${speciesInfo.display_name}`}
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="animal-body">
                  <div className="animal-title">
                    <div>
                      <h2>{speciesInfo.display_name}</h2>
                      <span className="muted">
                        {new Date(item.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                      </span>
                    </div>
                    <span className="confidence-pill high">{Math.round(item.confidence * 100)}%</span>
                  </div>
                  <p className="muted">{speciesInfo.fun_fact}</p>
                  <div className="row">
                    <span className="tag">{speciesInfo.animal_group}</span>
                    <button className="button button-danger" type="button" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
