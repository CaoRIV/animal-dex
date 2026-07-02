"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured()) {
    return <div className="notice">Cần cấu hình Supabase env trước khi đăng nhập và lưu album.</div>;
  }

  if (!user) {
    return (
      <Link className="button button-secondary" href="/auth">
        <LogIn size={18} aria-hidden="true" />
        Đăng nhập để lưu
      </Link>
    );
  }

  return (
    <button
      className="button button-secondary"
      type="button"
      onClick={() => supabase?.auth.signOut()}
    >
      <LogOut size={18} aria-hidden="true" />
      Đăng xuất
    </button>
  );
}
