-- =====================================================================
--  Run this if the landing page does not update without a reload.
--  Safe to run more than once.
--
--  Needed because adding a table to the realtime publication is a
--  separate step from creating it — schema.sql now does both, but a
--  database created before that change is missing this part.
--
--  https://supabase.com/dashboard/project/ewnqpitxxtyjzjuzniah/sql/new
-- =====================================================================

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'site_content'
  ) then
    alter publication supabase_realtime add table public.site_content;
  end if;
end
$$;

-- Send the whole changed row to subscribers, not just the primary key.
alter table public.site_content replica identity full;

-- Verify — this should return one row.
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime' and tablename = 'site_content';
