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

-- Tidy up the upload probe left behind while testing the upload path.
delete from storage.objects
where bucket_id = 'media' and name like 'upload-check-%';

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
