"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addComment, type CommentFormState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Posting…" : "Post comment"}
    </button>
  );
}

export function CommentForm({ requestId }: { requestId: number }) {
  const [state, formAction] = useActionState(addComment, {
    body: "",
    author: "",
  } satisfies CommentFormState);
  const field =
    "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="requestId" value={requestId} />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Comment</span>
        <textarea
          name="body"
          rows={4}
          required
          maxLength={2000}
          defaultValue={state.body}
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Your name (optional)</span>
        <input
          name="author"
          maxLength={80}
          defaultValue={state.author}
          className={field}
        />
      </label>
      <div aria-live="polite" className="text-sm" role="status">
        {state.error && <p className="text-red-700 dark:text-red-300">{state.error}</p>}
        {state.notice && <p>{state.notice}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
