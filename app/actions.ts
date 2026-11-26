"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { comments, requests, STATUSES, type Status } from "@/db/schema";

export type CommentFormState = {
  error?: string;
  notice?: string;
  body: string;
  author: string;
};

export async function createRequest(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || "Anonymous";
  if (!title) throw new Error("Title is required");

  const created = db
    .insert(requests)
    .values({ title, description, author })
    .returning({ id: requests.id })
    .get();

  revalidatePath("/", "layout");
  redirect(`/requests/${created.id}`);
}

export async function upvote(formData: FormData) {
  const id = Number(formData.get("id"));
  db.update(requests)
    .set({ votes: sql`${requests.votes} + 1` })
    .where(eq(requests.id, id))
    .run();
  revalidatePath("/", "layout");
}

export async function setStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as Status;
  if (!STATUSES.includes(status)) throw new Error(`Invalid status: ${status}`);
  db.update(requests).set({ status }).where(eq(requests.id, id)).run();
  revalidatePath("/", "layout");
}

export async function addComment(
  _previousState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const requestId = Number(formData.get("requestId"));
  const body = String(formData.get("body") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || "Anonymous";

  if (!Number.isSafeInteger(requestId) || requestId < 1) {
    return { error: "This request could not be found.", body, author };
  }
  if (!body) {
    return { error: "Write a comment before posting.", body, author };
  }
  if (author.length > 80) {
    return { error: "Names must be 80 characters or fewer.", body, author };
  }
  if (body.length > 2000) {
    return { error: "Comments must be 2,000 characters or fewer.", body, author };
  }
  const request = db
    .select({ id: requests.id })
    .from(requests)
    .where(eq(requests.id, requestId))
    .get();
  if (!request) {
    return { error: "This request could not be found.", body, author };
  }

  db.insert(comments).values({ requestId, body, author }).run();
  revalidatePath(`/requests/${requestId}`);
  return { notice: "Comment added.", body: "", author: "" };
}
