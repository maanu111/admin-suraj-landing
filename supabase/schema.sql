-- =====================================================================
--  Studio landing page — content store
--  Run this once in the Supabase SQL Editor:
--  https://supabase.com/dashboard/project/ewnqpitxxtyjzjuzniah/sql/new
-- =====================================================================

-- One row per landing-page section. `content` holds that section's whole
-- shape as JSON, so adding a field to a section needs no migration.
create table if not exists public.site_content (
  section    text primary key,
  content    jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before update on public.site_content
  for each row execute function public.touch_updated_at();

alter table public.site_content enable row level security;

-- Anyone may read — this is public website copy.
drop policy if exists "site_content read" on public.site_content;
create policy "site_content read"
  on public.site_content for select
  using (true);

-- ⚠️  WRITE ACCESS IS CURRENTLY OPEN TO ANYONE WITH THE ANON KEY.
--     The anon key ships in the browser bundle, so in its present form
--     any visitor could rewrite your site content. This is fine while you
--     are building locally. BEFORE DEPLOYING PUBLICLY, replace the two
--     policies below with the authenticated versions at the bottom of
--     this file and sign the admin in through Supabase Auth.
drop policy if exists "site_content write" on public.site_content;
create policy "site_content write"
  on public.site_content for insert
  with check (true);

drop policy if exists "site_content update" on public.site_content;
create policy "site_content update"
  on public.site_content for update
  using (true) with check (true);

-- ---------------------------------------------------------------------
--  Realtime — required for the landing page to update without a reload
-- ---------------------------------------------------------------------
-- Streams INSERT/UPDATE/DELETE on this table to subscribed browsers.
alter publication supabase_realtime add table public.site_content;

-- Ship the full new row to subscribers rather than just the primary key.
alter table public.site_content replica identity full;

-- ---------------------------------------------------------------------
--  Storage bucket for uploaded images and videos
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media read" on storage.objects;
create policy "media read"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media upload" on storage.objects;
create policy "media upload"
  on storage.objects for insert
  with check (bucket_id = 'media');

drop policy if exists "media replace" on storage.objects;
create policy "media replace"
  on storage.objects for update
  using (bucket_id = 'media');

-- =====================================================================
--  HARDENING — swap to these before going live
-- =====================================================================
-- drop policy "site_content write"  on public.site_content;
-- drop policy "site_content update" on public.site_content;
-- drop policy "media upload"        on storage.objects;
-- drop policy "media replace"       on storage.objects;
--
-- create policy "site_content write" on public.site_content
--   for insert to authenticated with check (true);
-- create policy "site_content update" on public.site_content
--   for update to authenticated using (true) with check (true);
-- create policy "media upload" on storage.objects
--   for insert to authenticated with check (bucket_id = 'media');
-- create policy "media replace" on storage.objects
--   for update to authenticated using (bucket_id = 'media');
