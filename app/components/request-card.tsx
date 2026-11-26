import Link from "next/link";
import { addTag, removeTag, setStatus, upvote } from "@/app/actions";
import type { RequestWithTags } from "@/db/queries";
import { STATUSES } from "@/db/schema";
import { StatusBadge } from "./status-badge";

export function RequestCard({ request }: { request: RequestWithTags }) {
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
        {request.description && (
          <p className="text-sm opacity-80">{request.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {request.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10"
            >
              <Link href={`/?tag=${encodeURIComponent(tag)}`} className="hover:underline">
                #{tag}
              </Link>
              <form action={removeTag}>
                <input type="hidden" name="id" value={request.id} />
                <input type="hidden" name="tag" value={tag} />
                <button type="submit" aria-label={`Remove tag ${tag}`} className="opacity-60 hover:opacity-100">
                  ×
                </button>
              </form>
            </span>
          ))}
          <form action={addTag}>
            <input type="hidden" name="id" value={request.id} />
            <input
              name="tag"
              placeholder="Add tag + Enter"
              aria-label={`Add tag to ${request.title}`}
              autoComplete="off"
              className="w-32 rounded border border-black/10 bg-transparent px-2 py-0.5 text-xs dark:border-white/15"
            />
          </form>
        </div>
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
