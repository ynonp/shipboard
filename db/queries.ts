import "server-only";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "./index";
import { requestTags, requests, tags } from "./schema";

// better-sqlite3 is synchronous, so without connection() these queries would
// run once at build time and be baked into the static shell.

export async function getRequests(tag?: string) {
  await connection();
  const normalizedTag = tag?.trim().toLowerCase();
  const requestRows = await db
    .select()
    .from(requests)
    .where(
      normalizedTag
        ? inArray(
            requests.id,
            db
              .select({ requestId: requestTags.requestId })
              .from(requestTags)
              .innerJoin(tags, eq(requestTags.tagId, tags.id))
              .where(eq(tags.name, normalizedTag)),
          )
        : undefined,
    )
    .orderBy(desc(requests.votes), desc(requests.createdAt))
    .all();

  if (requestRows.length === 0) return [];

  const tagRows = await db
    .select({ requestId: requestTags.requestId, name: tags.name })
    .from(requestTags)
    .innerJoin(tags, eq(requestTags.tagId, tags.id))
    .where(inArray(requestTags.requestId, requestRows.map((request) => request.id)))
    .orderBy(asc(tags.name))
    .all();
  const tagsByRequest = new Map<number, string[]>();
  for (const { requestId, name } of tagRows) {
    const requestTags = tagsByRequest.get(requestId) ?? [];
    requestTags.push(name);
    tagsByRequest.set(requestId, requestTags);
  }

  return requestRows.map((request) => ({
    ...request,
    tags: tagsByRequest.get(request.id) ?? [],
  }));
}

export async function getTags() {
  await connection();
  return db.select({ name: tags.name }).from(tags).orderBy(asc(tags.name)).all();
}

export async function getRequest(id: number) {
  await connection();
  const request = await db
    .select()
    .from(requests)
    .where(eq(requests.id, id))
    .get();
  if (!request) return undefined;

  const requestTagRows = await db
    .select({ name: tags.name })
    .from(requestTags)
    .innerJoin(tags, eq(requestTags.tagId, tags.id))
    .where(eq(requestTags.requestId, id))
    .orderBy(asc(tags.name))
    .all();
  return { ...request, tags: requestTagRows.map(({ name }) => name) };
}
