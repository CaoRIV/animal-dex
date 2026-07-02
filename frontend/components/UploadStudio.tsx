"use client";

import { useMemo, useState } from "react";
import { Camera, CheckCircle2, ImageUp, LoaderCircle, Save, ShieldAlert, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
import { predictAnimal, saveCollectionItem, uploadImage } from "@/lib/api";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { PredictionResponse } from "@/lib/types";
import { AuthStatus } from "@/components/AuthStatus";

const confidenceText = {
  high: "AI khá chắc",
  uncertain: "AI chưa chắc chắn",
  low: "Không đủ tự tin"
};

export function UploadStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSave = Boolean(file && prediction && !isSaving && isSupabaseConfigured());

  const funFact = useMemo(() => {
    if (!prediction) return null;
    return prediction.species_info.fun_fact;
  }, [prediction]);

  function handleFileChange(nextFile: File | null) {
    setError(null);
    setMessage(null);
    setPrediction(null);
    setFile(nextFile);
    setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : null);
  }

  async function handlePredict() {
    if (!file) {
      setError("Chọn một ảnh động vật trước khi nhận diện.");
      return;
    }

    setIsPredicting(true);
    setError(null);
    setMessage(null);

    try {
      const result = await predictAnimal(file);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể nhận diện ảnh.");
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
        setError("Bạn cần đăng nhập trước khi lưu vào album.");
        return;
      }

      const upload = await uploadImage(file, token);
      await saveCollectionItem(
        {
          image_path: upload.image_path,
          image_url: null,
          predicted_class: prediction.predicted_class,
          display_name: prediction.display_name,
          confidence: prediction.confidence,
          top_predictions: prediction.top_predictions,
          species_info: prediction.species_info
        },
        token
      );
      setMessage("Đã lưu vào album khám phá.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu kết quả.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="workspace" aria-label="Khu vực nhận diện ảnh động vật">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <h2 className="section-title">Upload ảnh</h2>
            <p className="section-subtitle">Ảnh rõ, một loài chính trong khung hình sẽ cho kết quả tốt hơn.</p>
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
              <img className="upload-preview" src={previewUrl} alt="Ảnh động vật đang được chọn" />
            ) : (
              <div>
                <span className="upload-icon" aria-hidden="true">
                  <ImageUp size={30} />
                </span>
                <strong>Chọn hoặc chụp ảnh</strong>
                <p className="section-subtitle">JPG, PNG hoặc WebP. Tối đa theo backend: 10MB.</p>
              </div>
            )}
          </label>
        </div>

        <div className="row" style={{ marginTop: 16 }}>
          <button className="button button-primary" type="button" onClick={handlePredict} disabled={isPredicting}>
            {isPredicting ? <LoaderCircle className="loading" size={18} /> : <Sparkles size={18} />}
            {isPredicting ? "Đang nhận diện" : "Nhận diện bằng AI"}
          </button>
          <button className="button button-secondary" type="button" onClick={() => handleFileChange(null)}>
            <XCircle size={18} />
            Xóa ảnh
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
              <h2 className="section-title">Kết quả sẽ hiện ở đây</h2>
              <p className="section-subtitle">
                AnimalDex sẽ trả về loài dự đoán, độ tin cậy, top-3 khả năng và thông tin ngắn về loài.
              </p>
            </div>
          </div>
        ) : (
          <div className="card species-summary">
            <div className="species-heading">
              <div>
                <span className={`confidence-pill ${prediction.confidence_label}`}>
                  {prediction.confidence_label === "high" ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                  {confidenceText[prediction.confidence_label]}
                </span>
                <h2>{prediction.display_name}</h2>
                <p className="section-subtitle">{prediction.species_info.description}</p>
              </div>
              <strong>{Math.round(prediction.confidence * 100)}%</strong>
            </div>

            <div className="info-grid">
              <InfoTile label="Môi trường sống" value={prediction.species_info.habitat} />
              <InfoTile label="Chế độ ăn" value={prediction.species_info.diet} />
              <InfoTile label="Nhóm" value={prediction.species_info.animal_group} />
              <InfoTile label="Mức độ nguy hiểm" value={prediction.species_info.danger_level} />
            </div>

            {funFact ? <div className="notice">{funFact}</div> : null}

            <div>
              <h3>Top-3 dự đoán</h3>
              <div className="prediction-list">
                {prediction.top_predictions.map((item) => (
                  <div className="prediction-row" key={item.class_name}>
                    <strong>{item.display_name}</strong>
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
                {isSaving ? "Đang lưu" : "Save to Collection"}
              </button>
              <Link className="button button-secondary" href="/collection">
                Xem album
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
