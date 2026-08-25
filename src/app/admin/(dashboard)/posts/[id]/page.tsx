import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { getPostById, listCategories } from '@/lib/cms/posts';
import { listMedia } from '@/lib/cms/media';
import PostEditor from './PostEditor';

export const metadata = {
  title: 'Edit Post | Magnus CMS',
};

export default async function AdminPostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole('admin', 'editor', 'author');
  const { id } = await params;

  let post = null;
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let media: Awaited<ReturnType<typeof listMedia>> = [];
  try {
    post = await getPostById(id);
    if (post) {
      [categories, media] = await Promise.all([listCategories(), listMedia()]);
    }
  } catch {
    post = null;
  }

  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="adm-link inline-flex items-center gap-1.5">
          <ArrowLeft size={14} /> All Posts
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="adm-title text-2xl truncate">
          {post.title}
        </h1>
      </div>

      <PostEditor
        postId={post.id}
        initialTitle={post.title}
        initialSlug={post.slug}
        initialStatus={post.status}
        initialExcerpt={post.excerpt ?? ''}
        initialCoverUrl={post.cover_image_url ?? ''}
        initialCategoryId={post.category_id ?? ''}
        initialBlocks={post.content?.blocks ?? []}
        categories={categories}
        mediaItems={media}
      />
    </div>
  );
}
