"use client";

import { usePathname, useRouter } from "next/navigation";
import { LANGUAGE_NAMES, LOCALES, type Locale } from "@/i18n/config";

export function LanguageSwitcher({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function change(next: string) {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  }

  return (
    <select
      aria-label={label}
      value={lang}
      onChange={(e) => change(e.target.value)}
      className="ms-auto rounded-md border border-black/15 bg-transparent px-2 py-1 text-sm dark:border-white/20"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l} className="text-black">
          {LANGUAGE_NAMES[l]}
        </option>
      ))}
    </select>
  );
}
