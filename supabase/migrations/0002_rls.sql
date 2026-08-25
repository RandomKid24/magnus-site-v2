-- ============================================================================
-- Magnus CMS — Row Level Security, role helpers, and auth integration
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Role helpers (SECURITY DEFINER so they bypass RLS on profiles and avoid
-- recursive policy evaluation). Never trust client-supplied roles: these read
-- the server-side profiles table keyed by the JWT subject (auth.uid()).
-- ----------------------------------------------------------------------------
create or replace function public.my_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select p.role from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.my_role() = 'admin';
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.my_role() in ('admin', 'editor');
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.my_role() is not null;
$$;

-- ----------------------------------------------------------------------------
-- Auto-create a profile for every new auth user. Default least-privilege
-- role: 'author'. Promotion to admin/editor happens via the bootstrap script
-- or an existing admin (service-role server action), never from the client.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    'author'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Enable RLS everywhere
-- ----------------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.pages            enable row level security;
alter table public.page_sections    enable row level security;
alter table public.categories       enable row level security;
alter table public.posts            enable row level security;
alter table public.media            enable row level security;
alter table public.navigation_items enable row level security;
alter table public.site_settings    enable row level security;
alter table public.seo_metadata     enable row level security;

-- Force RLS even for table owners (defense in depth)
alter table public.profiles         force row level security;
alter table public.pages            force row level security;
alter table public.page_sections    force row level security;
alter table public.categories       force row level security;
alter table public.posts            force row level security;
alter table public.media            force row level security;
alter table public.navigation_items force row level security;
alter table public.site_settings    force row level security;
alter table public.seo_metadata     force row level security;

-- ----------------------------------------------------------------------------
-- profiles
--   read: own profile or admin
--   update: own profile but ONLY non-privileged columns (role/email/id are
--           revoked below); role changes flow through service-role actions.
-- ----------------------------------------------------------------------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

revoke update (id, email, role) on public.profiles from authenticated;

-- ----------------------------------------------------------------------------
-- pages — public reads published; editors/admins manage everything
-- ----------------------------------------------------------------------------
drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read"
  on public.pages for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "pages_staff_read" on public.pages;
create policy "pages_staff_read"
  on public.pages for select
  to authenticated
  using (public.is_staff());

drop policy if exists "pages_editor_write" on public.pages;
create policy "pages_editor_write"
  on public.pages for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- page_sections — access follows the parent page's status/role
-- ----------------------------------------------------------------------------
drop policy if exists "sections_public_read" on public.page_sections;
create policy "sections_public_read"
  on public.page_sections for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.pages pg
      where pg.id = page_id and pg.status = 'published'
    )
  );

drop policy if exists "sections_staff_read" on public.page_sections;
create policy "sections_staff_read"
  on public.page_sections for select
  to authenticated
  using (public.is_staff());

drop policy if exists "sections_editor_write" on public.page_sections;
create policy "sections_editor_write"
  on public.page_sections for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- categories — public read; editor/admin write
-- ----------------------------------------------------------------------------
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_editor_write" on public.categories;
create policy "categories_editor_write"
  on public.categories for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- posts — public reads published; authors manage their OWN posts;
-- editors/admins manage all
-- ----------------------------------------------------------------------------
drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "posts_staff_read" on public.posts;
create policy "posts_staff_read"
  on public.posts for select
  to authenticated
  using (public.is_staff() or author_id = auth.uid());

drop policy if exists "posts_insert" on public.posts;
create policy "posts_insert"
  on public.posts for insert
  to authenticated
  with check (
    public.is_editor_or_admin()
    or (public.my_role() = 'author' and author_id = auth.uid())
  );

drop policy if exists "posts_update" on public.posts;
create policy "posts_update"
  on public.posts for update
  to authenticated
  using (
    public.is_editor_or_admin()
    or author_id = auth.uid()
  )
  with check (
    public.is_editor_or_admin()
    or (author_id = auth.uid() and public.my_role() = 'author')
  );

drop policy if exists "posts_delete" on public.posts;
create policy "posts_delete"
  on public.posts for delete
  to authenticated
  using (
    public.is_editor_or_admin()
    or author_id = auth.uid()
  );

-- ----------------------------------------------------------------------------
-- media — staff-only library (public site consumes URLs, not this table);
-- authors may upload and manage what they uploaded
-- ----------------------------------------------------------------------------
drop policy if exists "media_staff_read" on public.media;
create policy "media_staff_read"
  on public.media for select
  to authenticated
  using (public.is_staff());

drop policy if exists "media_insert" on public.media;
create policy "media_insert"
  on public.media for insert
  to authenticated
  with check (public.is_staff() and uploaded_by = auth.uid());

drop policy if exists "media_update" on public.media;
create policy "media_update"
  on public.media for update
  to authenticated
  using (public.is_editor_or_admin() or uploaded_by = auth.uid())
  with check (public.is_editor_or_admin() or uploaded_by = auth.uid());

drop policy if exists "media_delete" on public.media;
create policy "media_delete"
  on public.media for delete
  to authenticated
  using (public.is_editor_or_admin() or uploaded_by = auth.uid());

-- ----------------------------------------------------------------------------
-- navigation_items — public reads visible items; editor/admin writes
-- ----------------------------------------------------------------------------
drop policy if exists "navigation_public_read" on public.navigation_items;
create policy "navigation_public_read"
  on public.navigation_items for select
  to anon, authenticated
  using (is_visible);

drop policy if exists "navigation_staff_read" on public.navigation_items;
create policy "navigation_staff_read"
  on public.navigation_items for select
  to authenticated
  using (public.is_staff());

drop policy if exists "navigation_editor_write" on public.navigation_items;
create policy "navigation_editor_write"
  on public.navigation_items for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

-- ----------------------------------------------------------------------------
-- site_settings — public read (contact info etc. render on the site);
-- only admins write
-- ----------------------------------------------------------------------------
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- seo_metadata — public read (metadata renders on published pages);
-- editor/admin writes
-- ----------------------------------------------------------------------------
drop policy if exists "seo_public_read" on public.seo_metadata;
create policy "seo_public_read"
  on public.seo_metadata for select
  to anon, authenticated
  using (true);

drop policy if exists "seo_editor_write" on public.seo_metadata;
create policy "seo_editor_write"
  on public.seo_metadata for all
  to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());
