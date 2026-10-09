-- =====================================================================
--  Delete policies — run once in the Supabase SQL editor.
--
--  Neither the content table nor the media bucket has a delete policy, so
--  deletes are silently filtered to zero rows: the API answers 204 (table)
--  or 403 (storage) and nothing is removed.
--
--  Nothing in the app deletes rows today — the admin only upserts — but
--  replacing an uploaded image currently orphans the old file in the bucket
--  forever, and that adds up.
--
--  https://supabase.com/dashboard/project/ewnqpitxxtyjzjuzniah/sql/new
-- =====================================================================

drop policy if exists "site_content delete" on public.site_content;
create policy "site_content delete"
  on public.site_content for delete
  using (true);

drop policy if exists "media delete" on storage.objects;
create policy "media delete"
  on storage.objects for delete
  using (bucket_id = 'media');

-- NOTE: do not try to clean the bucket with `delete from storage.objects`.
-- Supabase blocks it with a protect_delete() trigger, because deleting the
-- row leaves the actual file orphaned in the backing store:
--   ERROR 42501: Direct deletion from storage tables is not allowed.
-- Remove files through the Storage API or the dashboard instead. Once the
-- policy above exists, this works:
--
--   curl -X DELETE --     'https://ewnqpitxxtyjzjuzniah.supabase.co/storage/v1/object/media/<file>' --     -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"

-- =====================================================================
--  HARDENING — swap to these before going live, alongside the policies at
--  the bottom of schema.sql
-- =====================================================================
-- drop policy "site_content delete" on public.site_content;
-- drop policy "media delete"        on storage.objects;
--
-- create policy "site_content delete" on public.site_content
--   for delete to authenticated using (true);
-- create policy "media delete" on storage.objects
--   for delete to authenticated using (bucket_id = 'media');
