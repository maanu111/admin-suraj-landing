# Studio — Content Admin

Standalone Next.js admin for the Studio landing page. It writes to a Supabase
table; the landing site subscribes to the same table over Supabase Realtime and
re-renders within about a second of a save. The two apps share no code at
runtime — only the database.

```
suraj-admin (:3001)  ──upsert──▶  Supabase: public.site_content
                                        │
                                        └──realtime──▶  suraj-landing (:3000)
```

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill it in.
3. Run `supabase/schema.sql` in the Supabase SQL editor. This creates the table,
   the RLS policies, the `media` storage bucket, **and adds the table to the
   `supabase_realtime` publication** — without that last step the landing page
   will not live-update.
4. `npm run dev` → http://localhost:3001

## How content is stored

One row per section of the landing page:

| column | type | meaning |
|--------|------|---------|
| `section` | `text` (PK) | `hero`, `services`, `work`, … |
| `content` | `jsonb` | that section's entire shape |
| `updated_at` | `timestamptz` | touched by a trigger on every write |

Because each section is a single JSON blob, adding a field to
`lib/content.ts` needs no database migration. The landing site merges whatever
it finds over its own bundled defaults, so a missing section or a field added
after the last save still renders.

## Adding or changing a field

Everything the admin shows is generated from `SECTIONS` in `lib/content.ts`.
Add an entry and the form control appears automatically.

| `type` | Control |
|--------|---------|
| `text` | single-line input |
| `textarea` | multi-line input |
| `url` | single-line input for `#anchor`, `/path`, or `https://…` |
| `image` | **Paste URL / Upload file** toggle, with live thumbnail |
| `video` | same toggle; empty falls back to the poster image |
| `list` | repeatable group with add / reorder / delete |

`lib/content.ts` is duplicated between this repo and the landing repo. Keep the
two copies in step when you change the schema.

## Realtime behaviour

- The sidebar shows the live connection state — green and pulsing when
  subscribed, amber while connecting, red if the socket drops.
- If someone else saves a section you are **not** editing, your copy updates in
  place silently.
- If they save a section you **are** editing, your work is never overwritten.
  A warning appears and you choose: save over theirs, or Reload and take theirs.

## Security

Writes are currently open to anyone holding the anon key, which ships in the
browser bundle. The password gate is client-side and readable in the page
source — it stops casual visitors, nothing more.

Before deploying anywhere public, apply the hardened policies at the bottom of
`supabase/schema.sql` and sign the admin in through Supabase Auth.
