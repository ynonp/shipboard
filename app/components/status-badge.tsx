import type { Status } from "@/db/schema";
import { useI18n, type TranslationKey } from "@/app/i18n";

const styles: Record<Status, string> = {
  open: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  planned: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  shipped: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export function StatusBadge({ status }: { status: Status }) {
  const { t } = useI18n();
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status]}`}
    >
      {t(`status${status[0].toUpperCase()}${status.slice(1)}` as TranslationKey)}
    </span>
  );
}
