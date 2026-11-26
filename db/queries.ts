import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "./index";
import { requests, requestTags } from "./schema";

// better-sqlite3 is synchronous, so without connection() these queries would
// run once at build time and be baked into the static shell.

export type RequestWithTags = typeof requests.$inferSelect & { tags: string[] };

function withTags(rows: (typeof requests.$inferSelect)[]): RequestWithTags[] {
  if (rows.length === 0) return [];
  const tagRows = db
    .select()
    .from(requestTags)
    .where(inArray(requestTags.requestId, rows.map((r) => r.id)))
    .orderBy(requestTags.tag)
    .all();
  return rows.map((r) => ({
    ...r,
    tags: tagRows.filter((t) => t.requestId === r.id).map((t) => t.tag),
  }));
}

export async function getRequests(tag?: string): Promise<RequestWithTags[]> {
  await connection();
  const rows = db
    .select()
    .from(requests)
    .orderBy(desc(requests.votes), desc(requests.createdAt))
    .all();
  const all = withTags(rows);
  return tag ? all.filter((r) => r.tags.includes(tag)) : all;
}

export async function getAllTags() {
  await connection();
  return db
    .selectDistinct({ tag: requestTags.tag })
    .from(requestTags)
    .orderBy(requestTags.tag)
    .all()
    .map((r) => r.tag);
}

export async function getRequest(id: number) {
  await connection();
  const row = db.select().from(requests).where(eq(requests.id, id)).get();
  return row ? withTags([row])[0] : undefined;
}
