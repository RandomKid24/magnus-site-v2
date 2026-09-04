import 'server-only';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const VIEWS_KEY = 'profile_views';
const FALLBACK_VIEWS = 1;

type ViewsValue = { count?: number };

function parseCount(value: unknown): number {
  if (!value || typeof value !== 'object') return FALLBACK_VIEWS;
  const count = (value as ViewsValue).count;
  return typeof count === 'number' && count >= 0 ? Math.floor(count) : FALLBACK_VIEWS;
}

/** Reads the public profile view counter from site_settings. */
export async function getProfileViews(): Promise<number> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', VIEWS_KEY)
      .maybeSingle();

    if (error || !data) return FALLBACK_VIEWS;
    return parseCount(data.value);
  } catch {
    return FALLBACK_VIEWS;
  }
}

/**
 * Increments the profile view counter using the service-role client (anon
 * cannot write site_settings). Returns the new count, or the previous/fallback
 * count if the write fails — the page must never break.
 */
export async function incrementProfileViews(): Promise<number> {
  const current = await getProfileViews();
  const next = current + 1;

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.from('site_settings').upsert(
      { key: VIEWS_KEY, value: { count: next } },
      { onConflict: 'key' }
    );
    if (error) return current;
    return next;
  } catch {
    return current;
  }
}
