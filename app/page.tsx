import Link from "next/link";
import { Suspense } from "react";
import { getRequests, getTags } from "@/db/queries";
import { RequestCard } from "./components/request-card";

async function RequestList({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const [{ tag }, availableTags] = await Promise.all([searchParams, getTags()]);
  const selectedTag = tag?.trim().toLowerCase() ?? "";
  const requests = await getRequests(selectedTag);
  if (requests.length === 0) {
    return (
      <>
        <TagFilter tags={availableTags.map(({ name }) => name)} selectedTag={selectedTag} />
        <p className="opacity-70">
          {selectedTag ? (
            <>
              No requests tagged “{selectedTag}”.{" "}
              <Link href="/" className="underline">
                Clear filter
              </Link>
            </>
          ) : (
            "No requests yet. Be the first!"
          )}
        </p>
      </>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <TagFilter tags={availableTags.map(({ name }) => name)} selectedTag={selectedTag} />
      <div className="flex flex-col gap-3">
        {requests.map((r) => (
          <RequestCard key={r.id} request={r} />
        ))}
      </div>
    </div>
  );
}

function TagFilter({
  tags,
  selectedTag,
}: {
  tags: string[];
  selectedTag: string;
}) {
  return (
    <form action="/" method="get" className="flex flex-wrap items-end gap-2">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Filter by tag</span>
        <select
          name="tag"
          defaultValue={selectedTag}
          className="rounded-md border border-black/15 bg-background px-3 py-2 dark:border-white/20"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded-md border border-black/15 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        Apply
      </button>
      {selectedTag && (
        <Link href="/" className="px-2 py-2 text-sm underline">
          Clear
        </Link>
      )}
    </form>
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
