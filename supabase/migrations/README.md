# Supabase Migrations

Apply these files in order, top to bottom, in one of two ways:

## Option A — Supabase Dashboard (no CLI required)

1. Open your project at https://supabase.com/dashboard
2. Go to **SQL Editor** → **New query**
3. Paste the full contents of each file in numbered order and run:
   1. `0001_init.sql` — tables, enums, indexes, triggers
   2. `0002_rls.sql` — role helpers + Row Level Security policies
   3. `0003_seed.sql` — default settings and navigation
   4. `0004_form_submissions.sql` — website form submissions (admin inbox)

## Option B — Supabase CLI

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## After applying

Create the first administrator:

```bash
cp .env.example .env.local   # fill in real values first
npm run create-admin         # reads SUPABASE_SERVICE_ROLE_KEY + ADMIN_EMAIL/ADMIN_PASSWORD
```
