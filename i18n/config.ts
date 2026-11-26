export const LOCALES = ["en", "he", "fr", "ru", "ar", "de", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: readonly Locale[] = ["he", "ar"];

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  fr: "Français",
  ru: "Русский",
  ar: "العربية",
  de: "Deutsch",
  es: "Español",
};

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const candidates = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { base } of candidates) {
    if (hasLocale(base)) return base;
    if (base === "iw") return "he";
  }
  return DEFAULT_LOCALE;
}
