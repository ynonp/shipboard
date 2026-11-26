import en from "./messages/en.json";
import he from "./messages/he.json";
import fr from "./messages/fr.json";
import ru from "./messages/ru.json";
import ar from "./messages/ar.json";
import de from "./messages/de.json";
import es from "./messages/es.json";
import type { Locale } from "./config";

export type Messages = typeof en;

const dictionaries: Record<Locale, Messages> = { en, he, fr, ru, ar, de, es };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
