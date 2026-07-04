"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ImageOff, LoaderCircle, Trash2, X } from "lucide-react";
import { deleteCollectionItem, getCollection } from "@/lib/api";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { CollectionItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { localizeSpeciesDisplayName, localizeSpeciesInfo } from "@/lib/species-info-vi";

export function CollectionView() {
  const { language, t } = useI18n();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLElement | null>(null);
  const openerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const groups = useMemo(() => {
    const unique = new Set(
      items.map((item) => localizeSpeciesInfo(item.species_info, language).animal_group).filter(Boolean)
    );
    return ["All", ...Array.from(unique).sort()];
  }, [items, language]);

  const visibleItems = useMemo(
    () =>
      filter === "All"
        ? items
        : items.filter((item) => localizeSpeciesInfo(item.species_info, language).animal_group === filter),
    [filter, items, language]
  );

  const selectedItem = useMemo(
    () => visibleItems.find((item) => item.id === selectedItemId) ?? null,
    [visibleItems, selectedItemId]
  );
  const selectedSpecies = useMemo(
    () => (selectedItem ? localizeSpeciesInfo(selectedItem.species_info, language) : null),
    [selectedItem, language]
  );
  const selectedTitleId = selectedItem ? `animal-preview-title-${selectedItem.id}` : undefined;

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
    setSelectedItemId((current) => (current === itemId ? null : current));
  }

  useEffect(() => {
    loadCollection();
  }, []);

  useEffect(() => {
    if (!groups.includes(filter)) {
      setFilter("All");
    }
  }, [filter, groups]);

  useEffect(() => {
    if (selectedItemId && !visibleItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(null);
    }
  }, [selectedItemId, visibleItems]);

  useEffect(() => {
    if (!selectedItemId) return;

    document.body.classList.add("modal-open");
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedItemId(null);
        return;
      }

      if (event.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
      openerRefs.current[selectedItemId]?.focus();
    };
  }, [selectedItemId]);

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
        <>
          <div className="collection-grid">
            {visibleItems.map((item) => {
              const speciesInfo = localizeSpeciesInfo(item.species_info, language);

              return (
                <article className={`animal-card ${selectedItem?.id === item.id ? "active" : ""}`} key={item.id}>
                  <button
                    aria-label={`${t("openAnimalDetails")} ${speciesInfo.display_name}`}
                    aria-haspopup="dialog"
                    className="animal-image animal-image-button"
                    ref={(node) => {
                      openerRefs.current[item.id] = node;
                    }}
                    type="button"
                    onClick={() => setSelectedItemId(item.id)}
                  >
                    {item.signed_image_url ? (
                      <img
                        src={item.signed_image_url}
                        alt={`${t("savedPhotoAlt")} ${speciesInfo.display_name}`}
                        loading="lazy"
                      />
                    ) : null}
                  </button>
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

          {selectedItem && selectedSpecies ? (
            <div
              className="album-hover-layer"
              aria-live="polite"
              role="presentation"
              onClick={() => setSelectedItemId(null)}
            >
              <aside
                aria-labelledby={selectedTitleId}
                className="album-hover-modal"
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  aria-label={t("closePreview")}
                  className="album-hover-close"
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setSelectedItemId(null)}
                >
                  <X size={18} />
                </button>
              <div className="album-hover-image">
                {selectedItem.signed_image_url ? (
                  <img src={selectedItem.signed_image_url} alt={`${t("savedPhotoAlt")} ${selectedSpecies.display_name}`} />
                ) : (
                  <div className="album-hover-empty">
                    <ImageOff size={42} aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="album-hover-body">
                <div className="album-hover-title">
                  <div>
                    <span className="eyebrow">{t("hoverPreviewEyebrow")}</span>
                    <h2 id={selectedTitleId}>{selectedSpecies.display_name}</h2>
                  </div>
                  <span className="confidence-pill high">{Math.round(selectedItem.confidence * 100)}%</span>
                </div>

                <p className="album-hover-description">{selectedSpecies.description}</p>

                <div className="album-hover-facts">
                  <PreviewFact label={t("matchScore")} value={`${Math.round(selectedItem.confidence * 100)}%`} />
                  <PreviewFact
                    label={t("savedAt")}
                    value={new Date(selectedItem.created_at).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                  />
                  <PreviewFact label={t("group")} value={selectedSpecies.animal_group} />
                  <PreviewFact label={t("danger")} value={selectedSpecies.danger_level} />
                  <PreviewFact label={t("habitat")} value={selectedSpecies.habitat} />
                  <PreviewFact label={t("diet")} value={selectedSpecies.diet} />
                </div>

                {selectedSpecies.fun_fact ? <p className="album-hover-note">{selectedSpecies.fun_fact}</p> : null}

                {selectedItem.top_predictions.length > 0 ? (
                  <div className="album-hover-matches">
                    <h3>{t("topPredictions")}</h3>
                    {selectedItem.top_predictions.map((prediction) => (
                      <div className="album-hover-match" key={prediction.class_name}>
                        <span>{localizeSpeciesDisplayName(prediction.class_name, prediction.display_name, language)}</span>
                        <strong>{Math.round(prediction.confidence * 100)}%</strong>
                        <div className="album-hover-meter" aria-hidden="true">
                          <span style={{ width: `${Math.round(prediction.confidence * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              </aside>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function PreviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="album-hover-fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
