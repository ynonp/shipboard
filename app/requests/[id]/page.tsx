import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createComment } from "@/app/actions";
import { RequestCard } from "@/app/components/request-card";
import { getRequest, getRequestComments } from "@/db/queries";

const field =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20";

async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = Number(id);
  const request = await getRequest(requestId);
  if (!request) notFound();
  const comments = await getRequestComments(requestId);
  return (
    <div className="flex flex-col gap-8">
      <RequestCard request={request} />
      <section aria-labelledby="comments-heading" className="flex flex-col gap-4">
        <h2 id="comments-heading" className="text-xl font-bold">
          Comments ({comments.length})
        </h2>
        {comments.length > 0 ? (
          <ol className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-lg border border-black/10 p-4 dark:border-white/15"
              >
                <p className="break-words whitespace-pre-wrap">{comment.body}</p>
                <p className="mt-2 break-words text-xs opacity-70">
                  by {comment.author} · {comment.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm opacity-70">No comments yet.</p>
        )}
        <form action={createComment} className="flex flex-col gap-4">
          <input type="hidden" name="requestId" value={request.id} />
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Add a comment</span>
            <textarea name="body" required rows={4} className={field} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Your name (optional)</span>
            <input name="author" className={field} />
          </label>
          <button
            type="submit"
            className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Post comment
          </button>
        </form>
      </section>
    </div>
  );
}

export default function RequestPage(props: PageProps<"/requests/[id]">) {
  return (
    <>
      <Link href="/" className="mb-6 inline-block text-sm opacity-70 hover:underline">
        ← All requests
      </Link>
      <Suspense fallback={<p className="opacity-70">Loading…</p>}>
        <RequestDetail params={props.params} />
      </Suspense>
    </>
  );
}
