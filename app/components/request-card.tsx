import Link from "next/link";
import { setStatus } from "@/app/actions";
import { STATUSES, type FeatureRequest } from "@/db/schema";
import { StatusBadge } from "./status-badge";
import { UpvoteButton } from "./upvote-button";

export function RequestCard({ request }: { request: FeatureRequest }) {
  return (
    <article className="flex gap-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
      <UpvoteButton
        id={request.id}
        title={request.title}
        votes={request.votes}
      />

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
