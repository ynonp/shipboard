"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { upvote } from "@/app/actions";

function getServerSnapshot() {
  return false;
}

export function UpvoteButton({
  id,
  title,
  votes,
}: {
  id: number;
  title: string;
  votes: number;
}) {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const storageKey = `shipboard:upvoted:${id}`;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key === storageKey) onStoreChange();
      };
      const onLocalVote = (event: Event) => {
        if ((event as CustomEvent<string>).detail === storageKey) {
          onStoreChange();
        }
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener("shipboard:upvote", onLocalVote);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("shipboard:upvote", onLocalVote);
      };
    },
    [storageKey],
  );
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  }, [storageKey]);
  const storedUpvote = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    let alreadyUpvoted = hasUpvoted || storedUpvote;
    try {
      alreadyUpvoted ||= window.localStorage.getItem(storageKey) === "true";
    } catch {
      // Keep the in-memory state as a fallback.
    }

    if (alreadyUpvoted) {
      event.preventDefault();
      setHasUpvoted(true);
      return;
    }

    try {
      window.localStorage.setItem(storageKey, "true");
      window.dispatchEvent(
        new CustomEvent("shipboard:upvote", { detail: storageKey }),
      );
    } catch {
      // Keep the in-memory state as a fallback.
    }
    setHasUpvoted(true);
  }

  return (
    <form action={upvote} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={hasUpvoted || storedUpvote}
        className="flex w-14 flex-col items-center rounded-md border border-black/10 py-2 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10"
        aria-label={`Upvote ${title}`}
        aria-pressed={hasUpvoted || storedUpvote}
      >
        <span aria-hidden>▲</span>
        <span className="font-semibold">{votes}</span>
      </button>
    </form>
  );
}
