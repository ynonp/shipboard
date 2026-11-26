import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { hasLocale, type Locale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { RequestCard } from "@/app/components/request-card";
import { getRequest } from "@/db/queries";

async function RequestDetail({
  params,
  lang,
}: {
  params: Promise<{ id: string }>;
  lang: Locale;
}) {
  const { id } = await params;
  const request = await getRequest(Number(id));
  if (!request) notFound();
  return <RequestCard request={request} lang={lang} />;
}

export default async function RequestPage(props: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getMessages(lang);
  return (
    <>
      <Link href={`/${lang}`} className="mb-6 inline-block text-sm opacity-70 hover:underline">
        {t.detail.back}
      </Link>
      <Suspense fallback={<p className="opacity-70">{t.detail.loading}</p>}>
        <RequestDetail params={props.params} lang={lang} />
      </Suspense>
    </>
  );
}
