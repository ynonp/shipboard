"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { requests, STATUSES, type Status } from "@/db/schema";

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
