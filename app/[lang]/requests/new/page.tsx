import { notFound } from "next/navigation";
import { createRequest } from "@/app/actions";
import { hasLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";

const field =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20";

export default async function NewRequestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getMessages(lang);
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{t.form.title}</h1>
      <form action={createRequest} className="flex flex-col gap-4">
        <input type="hidden" name="lang" value={lang} />
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">{t.form.fieldTitle}</span>
          <input name="title" required className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">{t.form.fieldDescription}</span>
          <textarea name="description" rows={4} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">{t.form.fieldAuthor}</span>
          <input name="author" className={field} />
        </label>
        <button
          type="submit"
          className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          {t.form.submit}
        </button>
      </form>
    </>
  );
}
