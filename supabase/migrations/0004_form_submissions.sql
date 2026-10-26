-- ============================================================================
-- Website form submissions (contact form, profile enquiry, profile feedback)
-- Inserts happen only via a server action using the service-role key; staff
-- with the admin role can read, mark as read, and delete.
-- ============================================================================
create table if not exists public.form_submissions (
  id         uuid primary key default gen_random_uuid(),
  source     text not null check (source in ('contact', 'profile_enquiry', 'profile_feedback')),
  name       text,
  email      text,
  phone      text,
  service    text,
  message    text,
  rating     smallint check (rating between 1 and 5),
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_created_idx on public.form_submissions (created_at desc);

alter table public.form_submissions enable row level security;

create policy "admins read submissions" on public.form_submissions
  for select to authenticated using (public.is_admin());
create policy "admins update submissions" on public.form_submissions
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete submissions" on public.form_submissions
  for delete to authenticated using (public.is_admin());
