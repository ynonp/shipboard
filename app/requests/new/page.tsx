import { createRequest } from "@/app/actions";
import { TagsInput } from "@/app/components/tags-input";

const field =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20";

export default function NewRequestPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">New feature request</h1>
      <form action={createRequest} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Title</span>
          <input name="title" required className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Description</span>
          <textarea name="description" rows={4} className={field} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Your name</span>
          <input name="author" className={field} />
        </label>
        <TagsInput />
        <button
          type="submit"
          className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Submit request
        </button>
      </form>
    </>
  );
}
