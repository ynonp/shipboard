"use client";

import { useI18n, type TranslationKey } from "@/app/i18n";

export function TranslatedText({
  id,
  values,
}: {
  id: TranslationKey;
  values?: Record<string, string | number>;
}) {
  const { t } = useI18n();
  return t(id, values);
}
