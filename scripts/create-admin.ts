import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

// Standalone script: builds its own service-role client rather than importing
// src/lib/supabase/admin.ts, which is guarded by `server-only` for RSC only.
function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
    process.exit(1);
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME || null;

  if (!email || !password) {
    console.error(
      'Missing ADMIN_EMAIL / ADMIN_PASSWORD environment variables. See .env.example.'
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  const admin = createAdminClient();

  // Reuse the auth user if it already exists instead of failing.
  const { data: existing } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });
  const found = existing?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  let userId: string;

  if (found) {
    userId = found.id;
    console.log(`Auth user already exists: ${email}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: fullName ? { full_name: fullName } : undefined,
    });
    if (error || !data.user) {
      console.error('Failed to create auth user:', error?.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log(`Created auth user: ${email}`);
  }

  // The on_auth_user_created trigger seeds a profile with role 'author';
  // promote it to 'admin' (or insert directly if the trigger did not run).
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (profile) {
    const { error } = await admin
      .from('profiles')
      .update({ role: 'admin', full_name: fullName ?? undefined })
      .eq('id', userId);
    if (error) {
      console.error('Failed to promote profile:', error.message);
      process.exit(1);
    }
  } else {
    const { error } = await admin.from('profiles').insert({
      id: userId,
      email,
      full_name: fullName,
      role: 'admin',
    });
    if (error) {
      console.error('Failed to create profile:', error.message);
      process.exit(1);
    }
  }

  console.log(`Done. ${email} is now an administrator. You can log in at /admin/login.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
