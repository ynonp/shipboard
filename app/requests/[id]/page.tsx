import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RequestCard } from "@/app/components/request-card";
import { TagEditor } from "@/app/components/tag-editor";
import { getRequest } from "@/db/queries";

async function RequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequest(Number(id));
  if (!request) notFound();
  return (
    <div className="flex flex-col gap-4">
      <RequestCard request={request} />
      <TagEditor requestId={request.id} />
    </div>
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
