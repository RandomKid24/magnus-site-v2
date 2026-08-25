import { createClient } from '@supabase/supabase-js';

/**
 * Cookieless anonymous client for PUBLIC page rendering. Because it never
 * touches cookies, routes using it remain statically cacheable (ISR) and are
 * refreshed via revalidatePath on publish. RLS restricts reads to published
 * content.
 */
export function createSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
