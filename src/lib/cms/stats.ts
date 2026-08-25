import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * Server-side CMS data access layer. All database reads/writes for the admin
 * area flow through these helpers so authorization and error handling stay in
 * one place instead of leaking into UI components.
 */

export interface CmsStats {
  pages: number;
  publishedPages: number;
  posts: number;
  media: number;
}

async function count(client: SupabaseClient, table: string, filters?: {
  column: string;
  value: string;
}): Promise<number> {
  let query = client.from(table).select('*', { count: 'exact', head: true });
  if (filters) query = query.eq(filters.column, filters.value);
  const { count: total, error } = await query;
  if (error) throw new Error(`Failed to count ${table}: ${error.message}`);
  return total ?? 0;
}

export async function getCmsStats(): Promise<CmsStats> {
  const supabase = await createSupabaseServerClient();
  const [pages, publishedPages, posts, media] = await Promise.all([
    count(supabase, 'pages'),
    count(supabase, 'pages', { column: 'status', value: 'published' }),
    count(supabase, 'posts'),
    count(supabase, 'media'),
  ]);
  return { pages, publishedPages, posts, media };
}
