import Link from "next/link";
import { Suspense } from "react";
import { getRequests } from "@/db/queries";
import { RequestCard } from "./components/request-card";

async function RequestList() {
  const requests = await getRequests();
  if (requests.length === 0) {
    return <p className="opacity-70">No requests yet. Be the first!</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {requests.map((r) => (
        <RequestCard key={r.id} request={r} />
      ))}
    </div>
  );
}

export default function Home() {
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
        <RequestList />
      </Suspense>
    </>
  );
}
