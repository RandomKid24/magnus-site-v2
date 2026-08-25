-- ============================================================================
-- Magnus CMS — initial schema
-- Apply via Supabase Dashboard → SQL Editor (or `supabase db push`).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'editor', 'author');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.media_kind as enum ('image', 'video', 'raw');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Generic updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- profiles — extends auth.users with CMS role information
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        public.user_role not null default 'author',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- pages
-- ----------------------------------------------------------------------------
create table if not exists public.pages (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null,
  title        text not null,
  status       public.content_status not null default 'draft',
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  published_at timestamptz
);

create unique index if not exists pages_slug_key on public.pages (slug);
create index if not exists pages_status_idx on public.pages (status);
create index if not exists pages_published_at_idx on public.pages (published_at desc);

-- ----------------------------------------------------------------------------
-- page_sections — ordered content blocks; block config lives in `data` JSONB
-- ----------------------------------------------------------------------------
create table if not exists public.page_sections (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages (id) on delete cascade,
  type       text not null,
  position   integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists page_sections_page_id_idx on public.page_sections (page_id);
create index if not exists page_sections_page_position_idx on public.page_sections (page_id, position);

-- ----------------------------------------------------------------------------
-- categories
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists categories_slug_key on public.categories (slug);

-- ----------------------------------------------------------------------------
-- posts — blog articles; `content` stores a structured block document (JSONB)
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null,
  title           text not null,
  excerpt         text,
  content         jsonb not null default '{"blocks":[]}'::jsonb,
  cover_image_url text,
  status          public.content_status not null default 'draft',
  author_id       uuid references public.profiles (id) on delete set null,
  category_id     uuid references public.categories (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);

create unique index if not exists posts_slug_key on public.posts (slug);
create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_published_at_idx on public.posts (published_at desc);
create index if not exists posts_author_idx on public.posts (author_id);
create index if not exists posts_category_idx on public.posts (category_id);

-- ----------------------------------------------------------------------------
-- media — Cloudinary asset registry (binary data lives in Cloudinary, not PG)
-- ----------------------------------------------------------------------------
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  public_id   text not null,
  url         text not null,
  kind        public.media_kind not null default 'image',
  format      text,
  width       integer,
  height      integer,
  bytes       bigint,
  alt_text    text,
  folder      text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

create unique index if not exists media_public_id_key on public.media (public_id);
create index if not exists media_kind_idx on public.media (kind);
create index if not exists media_created_at_idx on public.media (created_at desc);

-- ----------------------------------------------------------------------------
-- navigation_items — supports nesting via parent_id
-- ----------------------------------------------------------------------------
create table if not exists public.navigation_items (
  id               uuid primary key default gen_random_uuid(),
  label            text not null,
  url              text not null,
  parent_id        uuid references public.navigation_items (id) on delete cascade,
  position         integer not null default 0,
  is_visible       boolean not null default true,
  opens_in_new_tab boolean not null default false,
  location         text not null default 'header',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint navigation_location_check check (location in ('header', 'footer'))
);

create index if not exists navigation_parent_idx on public.navigation_items (parent_id);
create index if not exists navigation_location_position_idx on public.navigation_items (location, position);

-- ----------------------------------------------------------------------------
-- site_settings — flexible key/value store (contact info, socials, branding…)
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- seo_metadata — one row per page XOR post
-- ----------------------------------------------------------------------------
create table if not exists public.seo_metadata (
  id             uuid primary key default gen_random_uuid(),
  page_id        uuid references public.pages (id) on delete cascade,
  post_id        uuid references public.posts (id) on delete cascade,
  title          text,
  description    text,
  canonical_url  text,
  og_title       text,
  og_description text,
  og_image_url   text,
  no_index       boolean not null default false,
  no_follow      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint seo_single_target_check check (
    ((page_id is not null)::int + (post_id is not null)::int) = 1
  )
);

create unique index if not exists seo_page_unique on public.seo_metadata (page_id) where page_id is not null;
create unique index if not exists seo_post_unique on public.seo_metadata (post_id) where post_id is not null;

-- ----------------------------------------------------------------------------
-- Triggers: updated_at maintenance
-- ----------------------------------------------------------------------------
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at before update on public.pages
  for each row execute function public.set_updated_at();

drop trigger if exists page_sections_updated_at on public.page_sections;
create trigger page_sections_updated_at before update on public.page_sections
  for each row execute function public.set_updated_at();

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists navigation_updated_at on public.navigation_items;
create trigger navigation_updated_at before update on public.navigation_items
  for each row execute function public.set_updated_at();

drop trigger if exists seo_updated_at on public.seo_metadata;
create trigger seo_updated_at before update on public.seo_metadata
  for each row execute function public.set_updated_at();

drop trigger if exists settings_updated_at on public.site_settings;
create trigger settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
