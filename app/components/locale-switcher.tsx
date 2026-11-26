"use client";

import { useI18n } from "@/app/i18n";

export function LocaleSwitcher() {
  const { locale, locales, languageNames, setLocale, t } = useI18n();

  return (
    <label className="ms-auto flex items-center gap-2 text-sm">
      <span>{t("language")}</span>
      <select
        aria-label={t("language")}
        value={locale}
        onChange={(event) => setLocale(event.target.value as (typeof locales)[number])}
        className="rounded-md border border-black/15 bg-background px-2 py-1 dark:border-white/20"
      >
        {locales.map((option) => (
          <option key={option} value={option}>
            {t(languageNames[option])}
          </option>
        ))}
      </select>
    </label>
  );
}
