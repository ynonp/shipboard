import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "./index";
import { comments, requests } from "./schema";

// better-sqlite3 is synchronous, so without connection() these queries would
// run once at build time and be baked into the static shell.

export async function getRequests() {
  await connection();
  return db
    .select()
    .from(requests)
    .orderBy(desc(requests.votes), desc(requests.createdAt))
    .all();
}

export async function getRequest(id: number) {
  await connection();
  return db.select().from(requests).where(eq(requests.id, id)).get();
}

export async function getComments(requestId: number) {
  await connection();
  return db
    .select()
    .from(comments)
    .where(eq(comments.requestId, requestId))
    .orderBy(asc(comments.createdAt), asc(comments.id))
    .all();
}
