import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RequestComments } from "@/app/components/request-comments";
import { RequestCard } from "@/app/components/request-card";
import { getRequest, getRequestComments } from "@/db/queries";

async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = Number(id);
  const request = await getRequest(requestId);
  if (!request) notFound();
  const comments = await getRequestComments(request.id);
  return (
    <>
      <RequestCard request={request} />
      <RequestComments requestId={request.id} comments={comments} />
    </>
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
