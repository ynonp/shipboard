import Link from "next/link";
import { Suspense } from "react";
import { StatusBadge } from "@/app/components/status-badge";
import { getRequests } from "@/db/queries";
import { STATUSES } from "@/db/schema";
import { TranslatedText } from "@/app/components/translated-text";

async function Columns() {
  const requests = await getRequests();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STATUSES.map((status) => {
        const items = requests.filter((r) => r.status === status);
        return (
          <section
            key={status}
            className="rounded-lg border border-black/10 p-4 dark:border-white/15"
          >
            <h2 className="mb-3 flex items-center gap-2 font-semibold">
              <StatusBadge status={status} />
              <span className="text-sm opacity-60">{items.length}</span>
            </h2>
            <ul className="flex flex-col gap-2">
              {items.map((r) => (
                <li key={r.id} className="flex justify-between gap-2 text-sm">
                  <Link href={`/requests/${r.id}`} className="hover:underline">
                    {r.title}
                  </Link>
                  <span className="opacity-60">▲ {r.votes}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        <TranslatedText id="roadmap" />
      </h1>
      <Suspense
        fallback={
          <p className="opacity-70">
            <TranslatedText id="loadingRoadmap" />
          </p>
        }
      >
        <Columns />
      </Suspense>
    </>
  );
}
