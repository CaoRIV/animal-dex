"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, ImageUp, LoaderCircle, Save, ShieldAlert, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
import { predictAnimal, saveCollectionItem, uploadImage } from "@/lib/api";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { PredictionResponse } from "@/lib/types";
import { AuthStatus } from "@/components/AuthStatus";
import { useI18n } from "@/lib/i18n";
import { localizeSpeciesDisplayName, localizeSpeciesInfo } from "@/lib/species-info-vi";

export function UploadStudio() {
  const { language, t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [correctedLabel, setCorrectedLabel] = useState("");
  const [labelEdited, setLabelEdited] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSave = Boolean(file && prediction && !isSaving && isSupabaseConfigured());
  const localizedSpecies = useMemo(
    () => (prediction ? localizeSpeciesInfo(prediction.species_info, language) : null),
    [prediction, language]
  );
  const localizedDisplayName = useMemo(
    () => (prediction ? localizeSpeciesDisplayName(prediction.predicted_class, prediction.display_name, language) : ""),
    [prediction, language]
  );

  const funFact = useMemo(() => {
    if (!localizedSpecies) return null;
    return localizedSpecies.fun_fact;
  }, [localizedSpecies]);

  useEffect(() => {
    if (prediction && !labelEdited) {
      setCorrectedLabel(localizedDisplayName);
    }
  }, [prediction, localizedDisplayName, labelEdited]);

  function handleFileChange(nextFile: File | null) {
    setError(null);
    setMessage(null);
    setPrediction(null);
    setCorrectedLabel("");
    setLabelEdited(false);
    setFile(nextFile);
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
  }

  async function handlePredict() {
    if (!file) {
      setError(t("needImage"));
      return;
    }

    setIsPredicting(true);
    setError(null);
    setMessage(null);

    try {
      const result = await predictAnimal(file);
      setPrediction(result);
      setCorrectedLabel(localizeSpeciesDisplayName(result.predicted_class, result.display_name, language));
      setLabelEdited(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("predictFailed"));
    } finally {
      setIsPredicting(false);
    }
  }

  async function handleSave() {
    if (!file || !prediction || !supabase) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError(t("loginRequired"));
        return;
      }

      const upload = await uploadImage(file, token);
      const defaultDisplayName = localizedDisplayName || prediction.display_name;
      const displayName = correctedLabel.trim() || defaultDisplayName;
      const labelWasEdited =
        labelEdited && displayName !== defaultDisplayName && displayName !== prediction.display_name;
      const predictedClass = labelWasEdited ? toClassName(displayName) : prediction.predicted_class;
      const savedDisplayName = labelWasEdited ? displayName : prediction.display_name;
      const speciesInfo = labelWasEdited
        ? {
            ...prediction.species_info,
            class_name: predictedClass,
            display_name: displayName,
            description: displayName,
            habitat: language === "vi" ? "\u0110ang c\u1eadp nh\u1eadt." : "No data yet.",
            diet: language === "vi" ? "\u0110ang c\u1eadp nh\u1eadt." : "No data yet.",
            animal_group: language === "vi" ? "Do b\u1ea1n \u0111\u1eb7t t\u00ean" : "Named by you",
            danger_level: language === "vi" ? "Kh\u00f4ng r\u00f5" : "Unknown",
            fun_fact:
              language === "vi"
                ? "T\u00ean n\u00e0y \u0111\u01b0\u1ee3c b\u1ea1n ch\u1ec9nh l\u1ea1i tr\u01b0\u1edbc khi l\u01b0u v\u00e0o album."
                : "You adjusted this name before saving it to the album."
          }
        : prediction.species_info;
      await saveCollectionItem(
        {
          image_path: upload.image_path,
          image_url: null,
          predicted_class: predictedClass,
          display_name: savedDisplayName,
          confidence: prediction.confidence,
          top_predictions: prediction.top_predictions,
          species_info: speciesInfo
        },
        token
      );
      setMessage(t("saved"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="workspace" aria-label="Animal identification workspace">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <h2 className="section-title">{t("uploadTitle")}</h2>
            <p className="section-subtitle">{t("uploadHint")}</p>
          </div>
          <AuthStatus />
        </div>

        <div className="upload-zone">
          <input
            accept="image/*"
            capture="environment"
            id="animal-image"
            type="file"
            onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          />
          <label htmlFor="animal-image">
            {previewUrl ? (
              <img className="upload-preview" src={previewUrl} alt={t("selectedImageAlt")} />
            ) : (
              <div>
                <span className="upload-icon" aria-hidden="true">
                  <ImageUp size={30} />
                </span>
                <strong>{t("chooseImage")}</strong>
                <p className="section-subtitle">{t("uploadHint")}</p>
              </div>
            )}
          </label>
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <button className="button button-primary" type="button" onClick={handlePredict} disabled={isPredicting}>
            {isPredicting ? <LoaderCircle className="loading" size={18} /> : <Sparkles size={18} />}
            {isPredicting ? t("predictLoading") : t("predictIdle")}
          </button>
          <button className="button button-secondary" type="button" onClick={() => handleFileChange(null)}>
            <XCircle size={18} />
            {t("clearImage")}
          </button>
        </div>
      </div>

      <div className="result-grid">
        {error ? <div className="notice error">{error}</div> : null}
        {message ? <div className="notice">{message}</div> : null}

        {!prediction ? (
          <div className="card empty-state">
            <div>
              <Camera size={42} aria-hidden="true" />
              <h2 className="section-title">{t("emptyResultTitle")}</h2>
              <p className="section-subtitle">{t("emptyResultBody")}</p>
            </div>
          </div>
        ) : (
          <div className="card species-summary">
            <div className="species-heading">
              <div>
                <span className={`confidence-pill ${prediction.confidence_label}`}>
                  {prediction.confidence_label === "high" ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                  {prediction.confidence_label === "high"
                    ? t("highConfidence")
                    : prediction.confidence_label === "uncertain"
                      ? t("uncertainConfidence")
                      : t("lowConfidence")}
                </span>
                <h2>{localizedDisplayName}</h2>
                <p className="section-subtitle">{localizedSpecies?.description}</p>
              </div>
              <strong>{Math.round(prediction.confidence * 100)}%</strong>
            </div>

            <div className="info-grid">
              <InfoTile label={t("habitat")} value={localizedSpecies?.habitat ?? ""} />
              <InfoTile label={t("diet")} value={localizedSpecies?.diet ?? ""} />
              <InfoTile label={t("group")} value={localizedSpecies?.animal_group ?? ""} />
              <InfoTile label={t("danger")} value={localizedSpecies?.danger_level ?? ""} />
            </div>

            {funFact ? <div className="notice">{funFact}</div> : null}

            <div className="field">
              <label htmlFor="corrected-label">{t("correctLabel")}</label>
              <input
                id="corrected-label"
                type="text"
                value={correctedLabel}
                onChange={(event) => {
                  setCorrectedLabel(event.target.value);
                  setLabelEdited(true);
                }}
              />
              <span className="field-hint">{t("correctionHint")}</span>
            </div>

            <div>
              <h3>{t("topPredictions")}</h3>
              <div className="prediction-list">
                {prediction.top_predictions.map((item) => (
                  <div className="prediction-row" key={item.class_name}>
                    <strong>{localizeSpeciesDisplayName(item.class_name, item.display_name, language)}</strong>
                    <div className="meter" aria-hidden="true">
                      <span style={{ width: `${Math.round(item.confidence * 100)}%` }} />
                    </div>
                    <span>{Math.round(item.confidence * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <button className="button button-primary" type="button" disabled={!canSave} onClick={handleSave}>
                {isSaving ? <LoaderCircle className="loading" size={18} /> : <Save size={18} />}
                {isSaving ? t("saveLoading") : t("saveIdle")}
              </button>
              <Link className="button button-secondary" href="/collection">
                {t("viewAlbum")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function toClassName(label: string) {
  return label
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "user_label";
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
