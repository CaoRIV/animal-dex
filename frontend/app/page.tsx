import Link from "next/link";
import { ArrowRight, FlaskConical, Images, ShieldCheck } from "lucide-react";
import { UploadStudio } from "@/components/UploadStudio";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <FlaskConical size={16} aria-hidden="true" />
            AI animal recognition journal
          </span>
          <h1>AnimalDex</h1>
          <p className="hero-lede">
            Upload một ảnh động vật ngoài đời, để model nhận diện loài, xem top-3 dự đoán và lưu lại như một album khám phá cá nhân.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#identify">
              Bắt đầu nhận diện
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" href="/collection">
              <Images size={18} aria-hidden="true" />
              Mở album
            </Link>
          </div>
        </div>

        <aside className="hero-panel" aria-label="AnimalDex preview">
          <div className="specimen-stage">
            <div className="specimen-photo" role="img" aria-label="Ảnh minh họa động vật trong bộ sưu tập" />
            <div className="specimen-card">
              <span className="confidence-pill high">
                <ShieldCheck size={16} aria-hidden="true" />
                91.7% test accuracy
              </span>
              <h2>Khám phá theo ảnh thật</h2>
              <p>
                Thiết kế ưu tiên ảnh, độ tin cậy và dữ liệu loài để người dùng hiểu model đang chắc đến đâu.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <div id="identify">
        <UploadStudio />
      </div>
    </>
  );
}
