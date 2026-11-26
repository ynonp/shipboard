import Link from "next/link";
import { Suspense } from "react";
import { getAllTags, getRequests } from "@/db/queries";
import { RequestCard } from "./components/request-card";

async function RequestList({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const { tag: rawTag } = await searchParams;
  const tag = Array.isArray(rawTag) ? rawTag[0] : rawTag;
  const [requests, allTags] = await Promise.all([getRequests(tag), getAllTags()]);
  return (
    <div className="flex flex-col gap-3">
      {allTags.length > 0 && (
        <nav aria-label="Filter by tag" className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/"
            className={`rounded-full border px-2 py-0.5 ${!tag ? "bg-foreground text-background" : "border-black/10 dark:border-white/15"}`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/?tag=${encodeURIComponent(t)}`}
              className={`rounded-full border px-2 py-0.5 ${t === tag ? "bg-foreground text-background" : "border-black/10 dark:border-white/15"}`}
            >
              #{t}
            </Link>
          ))}
        </nav>
      )}
      {requests.length === 0 && (
        <p className="opacity-70">
          {tag ? `No requests tagged #${tag}.` : "No requests yet. Be the first!"}
        </p>
      )}
      {requests.map((r) => (
        <RequestCard key={r.id} request={r} />
      ))}
    </div>
  );
}

export default function Home(props: PageProps<"/">) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feature requests</h1>
        <Link
          href="/requests/new"
          className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
        >
          New request
        </Link>
      </div>
      <Suspense fallback={<p className="opacity-70">Loading requests…</p>}>
        <RequestList searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}
