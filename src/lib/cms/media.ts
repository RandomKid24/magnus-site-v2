import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { MediaItem } from '@/lib/cms/types';

export async function listMedia(search?: string): Promise<MediaItem[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (search && search.trim()) {
    const term = `%${search.trim().replace(/[%_]/g, '')}%`;
    query = query.or(`alt_text.ilike.${term},public_id.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load media: ${error.message}`);
  return (data ?? []) as MediaItem[];
}
