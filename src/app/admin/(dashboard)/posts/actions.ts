'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { PostContentBlock } from '@/lib/cms/types';

export interface PostSaveState {
  error?: string;
  success?: string;
}

const RESERVED_SLUGS = new Set(['admin', 'api', '_next', 'static', 'preview', 'blog']);

const slugSchema = z
  .string()
  .min(1, 'Slug is required.')
  .max(140)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens.')
  .refine((s) => !RESERVED_SLUGS.has(s), 'That slug is reserved.');

const titleSchema = z.string().min(1, 'Title is required.').max(200);

const safeAssetUrl = z
  .string()
  .max(1000)
  .refine((v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v), {
    message: 'Image URL must be a path or https:// link',
  });

const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: z.string().max(8000) }),
  z.object({ type: z.literal('heading'), text: z.string().max(300), level: z.union([z.literal(2), z.literal(3)]) }),
  z.object({ type: z.literal('quote'), text: z.string().max(2000) }),
  z.object({ type: z.literal('list'), items: z.array(z.string().max(300)).max(20), ordered: z.boolean() }),
  z.object({ type: z.literal('image'), url: safeAssetUrl, alt: z.string().max(300) }),
]);

const contentSchema = z.object({
  blocks: z.array(contentBlockSchema).max(200),
});

function normalizeContent(raw: unknown): { blocks: PostContentBlock[] } | null {
  const parsed = contentSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

async function assertCanEditPost(postId: string): Promise<void> {
  const user = await requireRole('admin', 'editor', 'author');
  if (user.role === 'author') {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from('posts').select('author_id').eq('id', postId).single();
    if (!data || data.author_id !== user.id) {
      throw new Error('Authors can only edit their own posts.');
    }
  }
}

export async function createPostAction(formData: FormData): Promise<void> {
  const user = await requireRole('admin', 'editor', 'author');

  const title = String(formData.get('title') ?? '').trim();
  const parsedTitle = titleSchema.safeParse(title);
  if (!parsedTitle.success) {
    redirect('/admin/posts?error=' + encodeURIComponent(parsedTitle.error.issues[0].message));
  }

  const slugInput = String(formData.get('slug') ?? '').trim();
  let slug = slugInput;
  if (!slug) {
    // Auto-derive from title when left blank.
    slug = parsedTitle.data
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100);
  }
  const parsedSlug = slugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    redirect('/admin/posts?error=' + encodeURIComponent(parsedSlug.error.issues[0].message));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: parsedTitle.data,
      slug: parsedSlug.data,
      status: 'draft',
      author_id: user.id,
      content: { blocks: [] },
    })
    .select('id')
    .single();

  if (error) {
    const message =
      error.code === '23505'
        ? 'A post with that slug already exists.'
        : `Could not create post: ${error.message}`;
    redirect('/admin/posts?error=' + encodeURIComponent(message));
  }

  revalidatePath('/admin/posts');
  redirect(`/admin/posts/${data.id}`);
}

export async function savePostAction(
  postId: string,
  meta: {
    title: string;
    slug: string;
    excerpt: string;
    cover_image_url: string;
    category_id: string;
  },
  content: unknown
): Promise<PostSaveState> {
  try {
    await assertCanEditPost(postId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Not allowed.' };
  }

  const parsedTitle = titleSchema.safeParse(meta.title?.trim());
  if (!parsedTitle.success) return { error: parsedTitle.error.issues[0].message };

  const parsedSlug = slugSchema.safeParse(meta.slug?.trim());
  if (!parsedSlug.success) return { error: parsedSlug.error.issues[0].message };

  const content_ = normalizeContent(content);
  if (content_ === null) return { error: 'Invalid post content.' };

  const supabase = await createSupabaseServerClient();

  // Capture publish state and previous slug BEFORE updating, so we can
  // invalidate the right public cache entries below.
  const { data: current } = await supabase
    .from('posts')
    .select('slug, status')
    .eq('id', postId)
    .single();

  const { error } = await supabase
    .from('posts')
    .update({
      title: parsedTitle.data,
      slug: parsedSlug.data,
      excerpt: meta.excerpt?.slice(0, 500) || null,
      cover_image_url: safeAssetUrl.safeParse(meta.cover_image_url ?? '').success
        ? meta.cover_image_url?.slice(0, 1000) || null
        : null,
      category_id: meta.category_id || null,
      content: content_,
    })
    .eq('id', postId);

  if (error) {
    console.error('[CMS] savePostAction failed:', error.code, error.message);
    return {
      error:
        error.code === '23505'
          ? 'A post with that slug already exists.'
          : `Could not save post: ${error.message}`,
    };
  }

  // Published posts must reflect edits on /blog immediately.
  if (current?.status === 'published') {
    const slugs = new Set<string>([parsedSlug.data]);
    if (current.slug) slugs.add(current.slug);
    for (const slug of slugs) {
      revalidatePath(`/blog/${slug}`);
    }
    revalidatePath('/blog');
  }

  revalidatePath('/admin/posts');
  return { success: 'Saved.' };
}

export async function setPostStatusAction(
  postId: string,
  status: 'draft' | 'published' | 'archived'
): Promise<PostSaveState> {
  try {
    await assertCanEditPost(postId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Not allowed.' };
  }

  const supabase = await createSupabaseServerClient();

  const updates: Record<string, unknown> = { status };
  if (status === 'published') updates.published_at = new Date().toISOString();

  const { data: current } = await supabase.from('posts').select('slug').eq('id', postId).single();
  const { error } = await supabase.from('posts').update(updates).eq('id', postId);
  if (error) {
    console.error('[CMS] setPostStatusAction failed:', error.code, error.message);
    return { error: `Could not change status: ${error.message}` };
  }

  if (current?.slug && status !== 'draft') {
    revalidatePath(`/blog/${current.slug}`);
    revalidatePath('/blog');
  }
  revalidatePath('/admin/posts');
  return { success: `Post ${status}.` };
}

export async function deletePostAction(postId: string): Promise<PostSaveState> {
  try {
    await assertCanEditPost(postId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Not allowed.' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) {
    console.error('[CMS] deletePostAction failed:', error.message);
    return { error: `Could not delete post: ${error.message}` };
  }
  revalidatePath('/admin/posts');
  return { success: 'Deleted.' };
}

export async function createCategoryAction(formData: FormData): Promise<void> {
  await requireRole('admin', 'editor');

  const name = String(formData.get('name') ?? '').trim();
  if (!name || name.length > 100) {
    redirect('/admin/posts?error=' + encodeURIComponent('Category name is required.'));
  }
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100) || `category-${Date.now()}`;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('categories').insert({ name, slug });
  if (error && error.code !== '23505') {
    redirect('/admin/posts?error=' + encodeURIComponent(`Could not create category: ${error.message}`));
  }
  revalidatePath('/admin/posts');
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await requireRole('admin', 'editor');
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    redirect('/admin/posts?error=' + encodeURIComponent(`Could not delete category: ${error.message}`));
  }
  revalidatePath('/admin/posts');
}
