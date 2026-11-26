"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { comments, requests, STATUSES, type Status } from "@/db/schema";

export type CommentActionState = {
  status: "idle" | "success" | "error";
  message: string;
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

export async function createComment(
  _previousState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const requestId = Number(formData.get("requestId"));
  const body = String(formData.get("body") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();

  if (!Number.isSafeInteger(requestId) || requestId < 1) {
    return { status: "error", message: "Invalid request." };
  }
  if (!body) {
    return { status: "error", message: "Enter a comment before posting." };
  }
  if (body.length > 2000) {
    return { status: "error", message: "Comments must be 2,000 characters or fewer." };
  }
  if (author.length > 80) {
    return { status: "error", message: "Names must be 80 characters or fewer." };
  }
  if (!db.select({ id: requests.id }).from(requests).where(eq(requests.id, requestId)).get()) {
    return { status: "error", message: "This request could not be found." };
  }

  db.insert(comments)
    .values({ requestId, author: author || "Anonymous", body })
    .run();
  revalidatePath(`/requests/${requestId}`);
  return { status: "success", message: "Comment added." };
}
