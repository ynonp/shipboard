import Link from "next/link";
import { Suspense } from "react";
import { getRequests } from "@/db/queries";
import { hasLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { notFound } from "next/navigation";
import { RequestCard } from "@/app/components/request-card";

async function RequestList({ lang }: { lang: Locale }) {
  const t = getMessages(lang);
  const requests = await getRequests();
  if (requests.length === 0) {
    return <p className="opacity-70">{t.home.empty}</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {requests.map((r) => (
        <RequestCard key={r.id} request={r} lang={lang} />
      ))}
    </div>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getMessages(lang);
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.home.title}</h1>
        <Link
          href={`/${lang}/requests/new`}
          className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background"
        >
          {t.home.newRequest}
        </Link>
      </div>
      <Suspense fallback={<p className="opacity-70">{t.home.loading}</p>}>
        <RequestList lang={lang} />
      </Suspense>
    </>
  );
}
