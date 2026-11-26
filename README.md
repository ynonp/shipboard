# Shipboard

A small team feature-request board: post requests, upvote them, and move them
through **Open → Planned → Shipped**.

Next.js 16 (App Router, Cache Components) · Drizzle ORM · SQLite (better-sqlite3)

## Getting started

```bash
npm install
npm run dev        # creates and seeds shipboard.db on first run
```

## Database scripts

| Script             | What it does                                         |
| ------------------ | ---------------------------------------------------- |
| `npm run db:push`  | Sync `db/schema.ts` to the database (drizzle-kit)    |
| `npm run db:seed`  | Wipe the `requests` table and insert the seed data   |
| `npm run db:reset` | Delete the DB file, then push the schema and seed it |
| `npm run db:studio`| Open Drizzle Studio                                  |

The DB file defaults to `./shipboard.db`; override it with `DB_FILE_NAME`.

## Layout

- `db/schema.ts`: the `requests` table
- `db/queries.ts`: reads (call `connection()` so they run per request)
- `db/seed.ts`: seed data
- `app/actions.ts`: server actions `createRequest`, `upvote`, `setStatus`
- `app/components/request-card.tsx`: the request card
- `app/i18n/*.json`: UI translations for English, Hebrew, French, Russian,
  Arabic, German, and Spanish. Hebrew and Arabic use right-to-left layout.
- Pages: `/` (list), `/requests/new`, `/requests/[id]`, `/roadmap`
- `.github/agents/ui-expert.agent.md`: custom agent profile for UI/UX-focused work
