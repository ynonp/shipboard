import { createComment } from "@/app/actions";
import type { RequestComment } from "@/db/schema";
import { CommentForm } from "./comment-form";

export function RequestComments({
  requestId,
  comments,
}: {
  requestId: number;
  comments: RequestComment[];
}) {
  return (
    <section aria-labelledby="comments-heading" className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
      <h2 id="comments-heading" className="mb-4 text-xl font-bold">
        Comments
      </h2>
      {comments.length === 0 ? (
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          No comments yet. Start the conversation.
        </p>
      ) : (
        <ol className="mb-8 flex flex-col gap-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-lg border border-black/10 p-4 dark:border-white/15"
            >
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-medium break-words">{comment.author}</span>
                <time
                  dateTime={comment.createdAt.toISOString()}
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {comment.createdAt.toLocaleString()}
                </time>
              </div>
              <p className="whitespace-pre-wrap break-words">{comment.body}</p>
            </li>
          ))}
        </ol>
      )}
      <CommentForm requestId={requestId} action={createComment} />
    </section>
  );
}
