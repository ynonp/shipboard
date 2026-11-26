import Link from "next/link";
import { setStatus, upvote } from "@/app/actions";
import { STATUSES, type FeatureRequest } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { format, getMessages } from "@/i18n";
import { StatusBadge } from "./status-badge";

export function RequestCard({
  request,
  lang,
}: {
  request: FeatureRequest;
  lang: Locale;
}) {
  const t = getMessages(lang);
  return (
    <article className="flex gap-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
      <form action={upvote}>
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="id" value={request.id} />
        <button
          type="submit"
          className="flex w-14 flex-col items-center rounded-md border border-black/10 py-2 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          aria-label={format(t.card.upvote, { title: request.title })}
        >
          <span aria-hidden>▲</span>
          <span className="font-semibold">{request.votes}</span>
        </button>
      </form>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/${lang}/requests/${request.id}`}
            className="font-semibold hover:underline"
          >
            {request.title}
          </Link>
          <StatusBadge status={request.status} lang={lang} />
        </div>
        {request.description && (
          <p className="text-sm opacity-80">{request.description}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-70">
          <span>
            {format(t.card.by, { author: request.author })} ·{" "}
            {request.createdAt.toLocaleDateString(lang)}
          </span>
          <form action={setStatus} className="flex gap-1">
            <input type="hidden" name="lang" value={lang} />
            <input type="hidden" name="id" value={request.id} />
            {STATUSES.filter((s) => s !== request.status).map((s) => (
              <button
                key={s}
                type="submit"
                name="status"
                value={s}
                className="rounded border border-black/10 px-2 py-0.5 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                {format(t.card.markAs, { status: t.status[s] })}
              </button>
            ))}
          </form>
        </div>
      </div>
    </article>
  );
}
