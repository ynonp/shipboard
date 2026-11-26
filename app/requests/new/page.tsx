import { createRequest } from "@/app/actions";
import { TranslatedText } from "@/app/components/translated-text";

const field =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20";

export default function NewRequestPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        <TranslatedText id="newFeatureRequest" />
      </h1>
      <form action={createRequest} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            <TranslatedText id="title" />
          </span>
          <input name="title" required dir="auto" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            <TranslatedText id="description" />
          </span>
          <textarea name="description" rows={4} dir="auto" className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            <TranslatedText id="yourName" />
          </span>
          <input name="author" dir="auto" className={field} />
        </label>
        <button
          type="submit"
          className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          <TranslatedText id="submitRequest" />
        </button>
      </form>
    </>
  );
}
