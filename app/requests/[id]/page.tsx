import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RequestCard } from "@/app/components/request-card";
import { getRequest } from "@/db/queries";

async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(Number(id));
  if (!request) notFound();
  return <RequestCard request={request} />;
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
