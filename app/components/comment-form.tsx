"use client";

import { useActionState, useEffect, useRef } from "react";
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
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="requestId" value={requestId} />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Your name (optional)</span>
        <input name="author" maxLength={80} className={field} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Comment</span>
        <textarea
          name="body"
          rows={4}
          maxLength={2000}
          required
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
