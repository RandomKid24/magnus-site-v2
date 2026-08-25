import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import type { Category, Post } from '@/lib/cms/types';

export async function listPosts(): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  return (data ?? []) as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`Failed to load post: ${error.message}`);
  return (data as Post) ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return (data ?? []) as Category[];
}

export async function getPublicSeoForPost(postId: string) {
  const supabase = createSupabasePublicClient();
  const { data } = await supabase
    .from('seo_metadata')
    .select('*')
    .eq('post_id', postId)
    .maybeSingle();
  return data ?? null;
}
