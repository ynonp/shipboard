import { addTag } from "@/app/actions";

export function TagEditor({ requestId }: { requestId: number }) {
  return (
    <form action={addTag} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="id" value={requestId} />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Add a tag</span>
        <input
          name="tag"
          placeholder="Type a tag and press Enter"
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>
      <button
        type="submit"
        className="rounded-md border border-black/15 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        Add tag
      </button>
    </form>
  );
}
