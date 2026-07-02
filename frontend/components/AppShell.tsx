"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Camera, Compass, Images, UserRound } from "lucide-react";
import { I18nProvider, useI18n } from "@/lib/i18n";

const links = [
  { href: "/", labelKey: "navIdentify", icon: Camera },
  { href: "/collection", labelKey: "navCollection", icon: Images },
  { href: "/profile", labelKey: "navStats", icon: Compass },
  { href: "/auth", labelKey: "navAccount", icon: UserRound }
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AppShellContent>{children}</AppShellContent>
    </I18nProvider>
  );
}

function AppShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" href="/" aria-label="AnimalDex home">
            <span className="brand-mark" aria-hidden="true">
              <BookOpen size={19} />
            </span>
            <span>AnimalDex</span>
          </Link>
          <nav className="nav-links" aria-label={t("primaryNav")}>
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  className="nav-link"
                  href={link.href}
                  key={link.href}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{t(link.labelKey)}</span>
                </Link>
              );
            })}
          </nav>
          <div className="language-switcher" aria-label={t("langLabel")}>
            <button
              className={language === "vi" ? "active" : ""}
              type="button"
              onClick={() => setLanguage("vi")}
              aria-pressed={language === "vi"}
            >
              VI
            </button>
            <button
              className={language === "en" ? "active" : ""}
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>
        </div>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
