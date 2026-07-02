"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, Images, Layers3, LoaderCircle } from "lucide-react";
import { getCollection } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { CollectionItem } from "@/lib/types";

export function ProfileStats() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        setItems(await getCollection(token));
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const species = new Set(items.map((item) => item.predicted_class));
    const groupCounts = items.reduce<Record<string, number>>((acc, item) => {
      const group = item.species_info.animal_group || "Unknown";
      acc[group] = (acc[group] ?? 0) + 1;
      return acc;
    }, {});
    const topGroup = Object.entries(groupCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Chưa có";
    return {
      total: items.length,
      species: species.size,
      topGroup
    };
  }, [items]);

  return (
    <section>
      <div className="profile-header">
        <div>
          <span className="eyebrow">Profile statistics</span>
          <h1 className="section-title">Dấu chân khám phá</h1>
          <p className="section-subtitle">Theo dõi số ảnh đã lưu, số loài khác nhau và nhóm động vật xuất hiện nhiều nhất.</p>
        </div>
        <Link className="button button-primary" href="/">
          Nhận diện thêm
        </Link>
      </div>

      {isLoading ? (
        <div className="card empty-state">
          <LoaderCircle className="loading" size={38} aria-hidden="true" />
        </div>
      ) : (
        <div className="stats-grid">
          <StatCard icon={<Images size={24} />} label="Ảnh đã lưu" value={stats.total.toString()} />
          <StatCard icon={<Layers3 size={24} />} label="Loài khác nhau" value={stats.species.toString()} />
          <StatCard icon={<BarChart3 size={24} />} label="Nhóm nổi bật" value={stats.topGroup} />
        </div>
      )}
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="stat-card">
      <div className="row">
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </article>
  );
}
