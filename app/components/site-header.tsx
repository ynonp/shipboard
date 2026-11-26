"use client";

import Link from "next/link";
import { useI18n } from "@/app/i18n";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-6 px-4 py-4">
        <Link href="/" className="text-lg font-bold">
          🚢 Shipboard
        </Link>
        <Link href="/" className="text-sm opacity-80 hover:opacity-100">
          {t("navRequests")}
        </Link>
        <Link href="/roadmap" className="text-sm opacity-80 hover:opacity-100">
          {t("navRoadmap")}
        </Link>
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
