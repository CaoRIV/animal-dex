"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Camera, Compass, Images, UserRound } from "lucide-react";

const links = [
  { href: "/", label: "Nhận diện", icon: Camera },
  { href: "/collection", label: "Album", icon: Images },
  { href: "/profile", label: "Thống kê", icon: Compass },
  { href: "/auth", label: "Tài khoản", icon: UserRound }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

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
          <nav className="nav-links" aria-label="Điều hướng chính">
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
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}
