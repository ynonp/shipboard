"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { CommentActionState } from "@/app/actions";

const initialState: CommentActionState = { status: "idle", message: "" };
const field =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/20";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Posting…" : "Post comment"}
    </button>
  );
}

export function CommentForm({
  requestId,
  action,
}: {
  requestId: number;
  action: (
    previousState: CommentActionState,
    formData: FormData,
  ) => Promise<CommentActionState>;
}) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [state, formAction] = useActionState(
    async (previousState: CommentActionState, formData: FormData) => {
      const result = await action(previousState, formData);
      if (result.status === "success") {
        setAuthor("");
        setBody("");
      }
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="requestId" value={requestId} />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Your name (optional)</span>
        <input
          name="author"
          maxLength={80}
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Comment</span>
        <textarea
          name="body"
          rows={4}
          maxLength={2000}
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className={field}
        />
      </label>
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={
              state.status === "error"
                ? "text-sm text-red-700 dark:text-red-300"
                : "text-sm text-green-700 dark:text-green-300"
            }
          >
            {state.message}
          </p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
