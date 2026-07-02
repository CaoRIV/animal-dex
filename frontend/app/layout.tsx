import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap"
});

export const metadata: Metadata = {
  title: "AnimalDex",
  description: "AI animal recognition journal and personal discovery collection."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${archivo.variable} ${spaceGrotesk.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
