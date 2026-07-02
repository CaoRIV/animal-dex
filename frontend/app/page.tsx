"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Images, ShieldCheck } from "lucide-react";
import { UploadStudio } from "@/components/UploadStudio";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <FlaskConical size={16} aria-hidden="true" />
            {t("heroEyebrow")}
          </span>
          <h1>AnimalDex</h1>
          <div className="hero-actions">
            <Link className="button button-primary" href="#identify">
              {t("heroCta")}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" href="/collection">
              <Images size={18} aria-hidden="true" />
              {t("heroAlbum")}
            </Link>
          </div>
        </div>

        <aside className="hero-panel" aria-label="AnimalDex preview">
          <div className="specimen-stage">
            <div className="specimen-photo" role="img" aria-label="AnimalDex specimen preview" />
            <span className="confidence-pill high specimen-badge">
              <ShieldCheck size={16} aria-hidden="true" />
              {t("heroMetric")}
            </span>
          </div>
        </aside>
      </section>

      <div id="identify">
        <UploadStudio />
      </div>
    </>
  );
}
