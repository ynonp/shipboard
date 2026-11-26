"use client";

import { useState } from "react";

export function TagsInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [value, setValue] = useState("");

  function addTag() {
    const tag = value.trim();
    if (tag && !tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setTags([...tags, tag]);
    }
    setValue("");
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="request-tags" className="text-sm font-medium">
        Tags
      </label>
      <input type="hidden" name="tags" value={JSON.stringify(tags)} />
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Added tags">
          {tags.map((tag) => (
            <li
              key={tag.toLowerCase()}
              className="flex items-center gap-1 rounded-full border border-black/15 px-2 py-1 text-sm dark:border-white/20"
            >
              <span>{tag}</span>
              <button
                type="button"
                aria-label={`Remove ${tag} tag`}
                onClick={() =>
                  setTags(tags.filter((existing) => existing !== tag))
                }
                className="rounded px-1 hover:bg-black/5 dark:hover:bg-white/10"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id="request-tags"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addTag();
          }
        }}
        placeholder="Type a tag and press Enter"
        className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
      />
      <p className="text-xs opacity-70">Press Enter after each tag.</p>
    </div>
  );
}
