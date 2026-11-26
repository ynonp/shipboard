import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

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

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const requestTags = sqliteTable(
  "request_tags",
  {
    requestId: integer("request_id")
      .notNull()
      .references(() => requests.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.requestId, table.tagId] })],
);

export type FeatureRequest = typeof requests.$inferSelect;
export type NewFeatureRequest = typeof requests.$inferInsert;
export type FeatureRequestWithTags = FeatureRequest & { tags: string[] };
