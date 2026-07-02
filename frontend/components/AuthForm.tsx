"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LogIn, Mail } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export function AuthForm() {
  const router = useRouter();
  const { t } = useI18n();
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
      setMessage(t("signupCreated"));
      return;
    }

    router.push("/");
  }

  return (
    <section className="auth-shell">
      <div className="auth-panel">
        <div className="auth-art" role="img" aria-label={t("authArtAlt")} />
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <span className="eyebrow">
              <KeyRound size={16} aria-hidden="true" />
              {t("authEyebrow")}
            </span>
            <h1>{mode === "login" ? t("loginTitle") : t("signupTitle")}</h1>
            <p className="section-subtitle">{t("authLead")}</p>
          </div>

          <div className="segmented" role="tablist" aria-label="Account mode">
            <button
              className={mode === "login" ? "active" : ""}
              type="button"
              onClick={() => setMode("login")}
            >
              {t("loginTab")}
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              type="button"
              onClick={() => setMode("signup")}
            >
              {t("signupTab")}
            </button>
          </div>

          {!isSupabaseConfigured() ? (
            <div className="notice error">{t("supabaseMissing")}</div>
          ) : null}
          {error ? <div className="notice error">{error}</div> : null}
          {message ? <div className="notice">{message}</div> : null}

          <div className="field">
            <label htmlFor="email">{t("email")}</label>
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
            <label htmlFor="password">{t("password")}</label>
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
            {isSubmitting ? t("submitting") : mode === "login" ? t("loginTab") : t("signupTab")}
          </button>
        </form>
      </div>
    </section>
  );
}
