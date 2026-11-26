import Link from "next/link";
import { setStatus, upvote } from "@/app/actions";
import { type FeatureRequestWithTags, STATUSES } from "@/db/schema";
import { StatusBadge } from "./status-badge";

export function RequestCard({ request }: { request: FeatureRequestWithTags }) {
  return (
    <article className="flex gap-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
      <form action={upvote}>
        <input type="hidden" name="id" value={request.id} />
        <button
          type="submit"
          className="flex w-14 flex-col items-center rounded-md border border-black/10 py-2 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          aria-label={`Upvote ${request.title}`}
        >
          <span aria-hidden>▲</span>
          <span className="font-semibold">{request.votes}</span>
        </button>
      </form>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/requests/${request.id}`}
            className="font-semibold hover:underline"
          >
            {request.title}
          </Link>
          <StatusBadge status={request.status} />
        </div>
        {request.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Request tags">
            {request.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  aria-label={`Filter requests by ${tag}`}
                  className="inline-block rounded-full border border-black/15 px-2 py-0.5 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {request.description && (
          <p className="text-sm opacity-80">{request.description}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-70">
          <span>
            by {request.author} · {request.createdAt.toLocaleDateString()}
          </span>
          <form action={setStatus} className="flex gap-1">
            <input type="hidden" name="id" value={request.id} />
            {STATUSES.filter((s) => s !== request.status).map((s) => (
              <button
                key={s}
                type="submit"
                name="status"
                value={s}
                className="rounded border border-black/10 px-2 py-0.5 capitalize hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                Mark {s}
              </button>
            ))}
          </form>
        </div>
      </div>
    </article>
  );
}
