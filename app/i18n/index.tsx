"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import en from "./en.json";
import he from "./he.json";
import fr from "./fr.json";
import ru from "./ru.json";
import ar from "./ar.json";
import de from "./de.json";
import es from "./es.json";

export const locales = ["en", "he", "fr", "ru", "ar", "de", "es"] as const;
export type Locale = (typeof locales)[number];
export type TranslationKey = keyof typeof en;

const dictionaries = { en, he, fr, ru, ar, de, es } satisfies Record<
  Locale,
  typeof en
>;
const rtlLocales: Locale[] = ["he", "ar"];
const localeChangeEvent = "shipboard-locale-change";

const languageNames: Record<Locale, TranslationKey> = {
  en: "languageEnglish",
  he: "languageHebrew",
  fr: "languageFrench",
  ru: "languageRussian",
  ar: "languageArabic",
  de: "languageGerman",
  es: "languageSpanish",
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

function subscribeToLocale(callback: () => void) {
  window.addEventListener(localeChangeEvent, callback);
  return () => window.removeEventListener(localeChangeEvent, callback);
}

function getSavedLocale(): Locale {
  const savedLocale = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("shipboard-locale="))
    ?.split("=")[1];
  return locales.includes(savedLocale as Locale)
    ? (savedLocale as Locale)
    : "en";
}

export function getLocaleDirection(locale: Locale) {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getSavedLocale,
    () => initialLocale,
  );

  const setLocale = (nextLocale: Locale) => {
    document.cookie = `shipboard-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event(localeChangeEvent));
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useI18n must be used within LocaleProvider");

  const { locale, setLocale } = context;
  const t = (key: TranslationKey, values?: Record<string, string | number>) => {
    let text: string = dictionaries[locale][key];
    for (const [name, value] of Object.entries(values ?? {})) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  };

  return { locale, locales, languageNames, setLocale, t };
}
