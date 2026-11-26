import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const STATUSES = ["open", "planned", "shipped"] as const;
export type Status = (typeof STATUSES)[number];

export const requests = sqliteTable("requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  author: text("author").notNull(),
  status: text("status", { enum: STATUSES }).notNull().default("open"),
  votes: integer("votes").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id")
    .notNull()
    .references(() => requests.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  author: text("author").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type FeatureRequest = typeof requests.$inferSelect;
export type NewFeatureRequest = typeof requests.$inferInsert;
export type FeatureComment = typeof comments.$inferSelect;
