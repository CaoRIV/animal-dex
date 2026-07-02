"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogIn, Mail } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "signup") {
      setMessage("Tài khoản đã được tạo. Nếu Supabase bật email confirmation, hãy xác nhận email trước.");
      return;
    }

    router.push("/");
  }

  return (
    <section className="auth-shell">
      <div className="auth-panel">
        <div className="auth-art" role="img" aria-label="Ảnh minh họa voi trong thiên nhiên" />
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">
              <KeyRound size={16} aria-hidden="true" />
              Supabase Auth
            </span>
            <h1>{mode === "login" ? "Đăng nhập AnimalDex" : "Tạo tài khoản"}</h1>
            <p className="section-subtitle">Đăng nhập để lưu ảnh đã nhận diện vào album cá nhân.</p>
          </div>

          <div className="segmented" role="tablist" aria-label="Chọn chế độ tài khoản">
            <button
              className={mode === "login" ? "active" : ""}
              type="button"
              onClick={() => setMode("login")}
            >
              Đăng nhập
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              type="button"
              onClick={() => setMode("signup")}
            >
              Đăng ký
            </button>
          </div>

          {!isSupabaseConfigured() ? (
            <div className="notice error">Chưa cấu hình `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.</div>
          ) : null}
          {error ? <div className="notice error">{error}</div> : null}
          {message ? <div className="notice">{message}</div> : null}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              autoComplete="email"
              id="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              id="password"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          <button className="button button-primary" disabled={isSubmitting || !isSupabaseConfigured()} type="submit">
            {mode === "login" ? <LogIn size={18} /> : <Mail size={18} />}
            {isSubmitting ? "Đang xử lý" : mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
      </div>
    </section>
  );
}
