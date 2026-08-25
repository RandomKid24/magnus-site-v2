import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { listPosts, listCategories } from '@/lib/cms/posts';
import {
  createPostAction,
  createCategoryAction,
  deleteCategoryAction,
} from './actions';
import { AdminPageHeader, AdminCard, StatusBadge, EmptyState } from '@/components/admin/AdminUI';

export const metadata = {
  title: 'Posts | Magnus CMS',
};

function CategoryManager({ categories }: { categories: Awaited<ReturnType<typeof listCategories>> }) {
  return (
    <AdminCard className="p-6 mb-8">
      <h2 className="adm-title text-base mb-1">Categories</h2>
      <p className="adm-hint mb-4">Topics used to organise your blog articles.</p>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3 py-1.5"
            >
              <span className="text-xs font-bold">{cat.name}</span>
              <form action={deleteCategoryAction.bind(null, cat.id)}>
                <button
                  type="submit"
                  aria-label={`Delete category ${cat.name}`}
                  className="text-indigo-300 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </form>
            </span>
          ))}
        </div>
      )}
      <form action={createCategoryAction} className="flex flex-col sm:flex-row gap-2 max-w-md">
        <input
          name="name"
          required
          maxLength={100}
          placeholder="New category name"
          className="adm-input flex-1"
        />
        <button type="submit" className="adm-btn adm-btn-ghost whitespace-nowrap">
          <Plus size={13} /> Add
        </button>
      </form>
    </AdminCard>
  );
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireRole('admin', 'editor', 'author');
  const params = await searchParams;

  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];
  let loadError: string | null = null;
  try {
    [posts, categories] = await Promise.all([listPosts(), listCategories()]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load posts.';
  }

  // Authors only see their own posts in the list (RLS also enforces this).
  const visiblePosts =
    user.role === 'author' ? posts.filter((p) => p.author_id === user.id) : posts;

  return (
    <div>
      <AdminPageHeader title="Posts" subtitle="Write blog articles and announcements" />

      {params.error && (
        <div className="adm-alert-error mb-6">{params.error}</div>
      )}

      {(user.role === 'admin' || user.role === 'editor') && (
        <CategoryManager categories={categories} />
      )}

      <AdminCard className="p-6 mb-8">
        <h2 className="adm-title text-base mb-1">New Post</h2>
        <p className="adm-hint mb-4">Give it a title — you can write the content on the next screen.</p>
        <form action={createPostAction} className="flex flex-col sm:flex-row gap-3">
          <input
            name="title"
            required
            maxLength={200}
            placeholder="Post title"
            className="adm-input flex-1"
          />
          <input
            name="slug"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers and hyphens (optional — derived from title)"
            placeholder="web-address (optional)"
            className="adm-input w-full sm:w-56"
          />
          <button
            type="submit"
            className="adm-btn adm-btn-primary whitespace-nowrap"
          >
            <Plus size={15} />
            Create
          </button>
        </form>
      </AdminCard>

      {loadError ? (
        <AdminCard className="p-6">
          <p className="adm-alert-error">{loadError}</p>
        </AdminCard>
      ) : visiblePosts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Create your first article above. Drafts stay private until you publish them."
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th className="hidden md:table-cell">Updated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visiblePosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.id}`} className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      {post.title}
                    </Link>
                    <code className="block text-[11px] text-slate-400">/blog/{post.slug}</code>
                  </td>
                  <td>
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="hidden md:table-cell">
                    <span className="adm-hint">{new Date(post.updated_at).toLocaleDateString()}</span>
                  </td>
                  <td className="text-right">
                    <Link href={`/admin/posts/${post.id}`} className="adm-link">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  );
}
