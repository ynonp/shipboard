import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CommentForm } from "@/app/components/comment-form";
import { RequestCard } from "@/app/components/request-card";
import { getComments, getRequest } from "@/db/queries";

async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = Number(id);
  const [request, comments] = await Promise.all([
    getRequest(requestId),
    getComments(requestId),
  ]);
  if (!request) notFound();
  return (
    <div className="flex flex-col gap-6">
      <RequestCard request={request} />
      <section aria-labelledby="comments-heading" className="flex flex-col gap-4">
        <h2 id="comments-heading" className="text-xl font-semibold">
          Comments ({comments.length})
        </h2>
        {comments.length === 0 ? (
          <p className="text-sm opacity-70">No comments yet. Start the conversation.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-lg border border-black/10 p-4 dark:border-white/15"
              >
                <p className="whitespace-pre-wrap break-words">{comment.body}</p>
                <p className="mt-2 text-xs opacity-70">
                  {comment.author} · {comment.createdAt.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ol>
        )}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">Leave a comment</h3>
          <CommentForm requestId={request.id} />
        </div>
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
