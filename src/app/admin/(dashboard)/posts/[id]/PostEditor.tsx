'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Globe,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Type,
  Heading as HeadingIcon,
  Quote,
  List as ListIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { savePostAction, setPostStatusAction } from '../actions';
import MediaPickerModal from '@/components/admin/MediaPickerModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { showToast } from '@/components/admin/Toast';
import type { Category, MediaItem, PostContentBlock } from '@/lib/cms/types';

const BLOCK_TYPE_META: Record<
  PostContentBlock['type'],
  { label: string; icon: React.ComponentType<{ size?: number }> }
> = {
  paragraph: { label: 'Paragraph', icon: Type },
  heading: { label: 'Heading', icon: HeadingIcon },
  quote: { label: 'Quote', icon: Quote },
  list: { label: 'List', icon: ListIcon },
  image: { label: 'Image', icon: ImageIcon },
};

function newBlock(type: PostContentBlock['type']): PostContentBlock {
  switch (type) {
    case 'paragraph':
      return { type, text: '' };
    case 'heading':
      return { type, text: '', level: 2 };
    case 'quote':
      return { type, text: '' };
    case 'list':
      return { type, items: [''], ordered: false };
    case 'image':
      return { type, url: '', alt: '' };
  }
}

function BlockFields({
  block,
  onChange,
  mediaItems,
}: {
  block: PostContentBlock;
  onChange: (next: PostContentBlock) => void;
  mediaItems: MediaItem[];
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  switch (block.type) {
    case 'paragraph':
      return (
        <textarea
          rows={4}
          value={block.text}
          maxLength={8000}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          className="adm-input resize-y"
          placeholder="Write your paragraph…"
        />
      );
    case 'heading':
      return (
        <div className="flex gap-2">
          <select
            value={block.level}
            onChange={(e) => onChange({ ...block, level: Number(e.target.value) === 3 ? 3 : 2 })}
            className="adm-select w-24"
            aria-label="Heading level"
          >
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
          <input
            value={block.text}
            maxLength={300}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            className="adm-input"
            placeholder="Heading text…"
          />
        </div>
      );
    case 'quote':
      return (
        <textarea
          rows={2}
          value={block.text}
          maxLength={2000}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          className="adm-input resize-y"
          placeholder="Quoted text…"
        />
      );
    case 'list':
      return (
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={block.ordered}
              onChange={(e) => onChange({ ...block, ordered: e.target.checked })}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-600">Numbered list</span>
          </label>
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item}
                maxLength={300}
                onChange={(e) => {
                  const items = [...block.items];
                  items[i] = e.target.value;
                  onChange({ ...block, items });
                }}
                className="adm-input"
                placeholder={`Item ${i + 1}`}
              />
              <button
                onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })}
                className="adm-icon-btn adm-icon-btn-danger shrink-0"
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({ ...block, items: [...block.items, ''] })}
            className="adm-link inline-flex items-center gap-1 !normal-case"
          >
            <Plus size={12} /> Add item
          </button>
        </div>
      );
    case 'image':
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              readOnly
              value={block.url}
              onClick={() => setPickerOpen(true)}
              placeholder="No image selected — click the button to pick one"
              className="adm-input cursor-pointer text-slate-400"
            />
            <button
              onClick={() => setPickerOpen(true)}
              className="adm-btn adm-btn-ghost !px-3 shrink-0"
              aria-label="Choose image"
            >
              <ImageIcon size={15} />
            </button>
          </div>
          <input
            value={block.alt}
            maxLength={300}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            className="adm-input"
            placeholder="Describe the image (accessibility)"
          />
          <MediaPickerModal
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            items={mediaItems}
            onSelect={(url) => onChange({ ...block, url })}
          />
        </div>
      );
  }
}

export default function PostEditor({
  postId,
  initialTitle,
  initialSlug,
  initialStatus,
  initialExcerpt,
  initialCoverUrl,
  initialCategoryId,
  initialBlocks,
  categories,
  mediaItems,
}: {
  postId: string;
  initialTitle: string;
  initialSlug: string;
  initialStatus: string;
  initialExcerpt: string;
  initialCoverUrl: string;
  initialCategoryId: string;
  initialBlocks: PostContentBlock[];
  categories: Category[];
  mediaItems: MediaItem[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [status, setStatus] = useState(initialStatus);
  const [blocks, setBlocks] = useState<PostContentBlock[]>(initialBlocks);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<{ label: string; message: string; fn: () => void } | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const meta = () => ({
    title,
    slug,
    excerpt,
    cover_image_url: coverUrl,
    category_id: categoryId,
  });

  const handleSave = useCallback(() => {
    startTransition(async () => {
      const result = await savePostAction(postId, meta(), { blocks });
      if (result.error) {
        showToast('error', result.error);
      } else {
        const now = new Date();
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        showToast('success', status === 'published' ? 'Saved — live article updated.' : 'Saved.');
        router.refresh();
      }
    });
  }, [postId, meta, blocks, status, router]);

  const handleStatusChange = (next: 'draft' | 'published' | 'archived') => {
    startTransition(async () => {
      const saved = await savePostAction(postId, meta(), { blocks });
      if (saved.error) {
        showToast('error', saved.error);
        return;
      }
      const result = await setPostStatusAction(postId, next);
      if (result.error) {
        showToast('error', result.error);
        return;
      }
      setStatus(next);
      showToast(
        'success',
        next === 'published'
          ? 'Published! Your article is now live at /blog.'
          : `Post ${next}.`
      );
      router.refresh();
    });
  };

  // Autosave: debounce saves while editing.
  const contentJson = JSON.stringify(blocks);
  const changed =
    title !== initialTitle ||
    slug !== initialSlug ||
    excerpt !== initialExcerpt ||
    coverUrl !== initialCoverUrl ||
    categoryId !== initialCategoryId ||
    contentJson !== JSON.stringify(initialBlocks);

  useEffect(() => {
    if (!changed || pending) return;
    const timer = setTimeout(() => {
      handleSave();
    }, 8000);
    return () => clearTimeout(timer);
  }, [changed, pending, handleSave]);

  const updateBlock = (index: number, next: PostContentBlock) => {
    const copy = [...blocks];
    copy[index] = next;
    setBlocks(copy);
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setBlocks(copy);
  };

  return (
    <div className="space-y-6">
        {/* Meta */}
        <div className="adm-card p-5 space-y-4">
          <h2 className="adm-title text-base">Article Details</h2>
          <div>
            <label className="adm-label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="adm-input" />
          </div>
          <div>
            <label className="adm-label">Web Address</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-semibold">/blog/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                maxLength={140}
                className="adm-input flex-1"
              />
            </div>
          </div>
          <div>
            <label className="adm-label">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={500}
              className="adm-input resize-y"
              placeholder="Short summary shown in listings"
            />
          </div>
          <div>
            <label className="adm-label">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="adm-select">
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="adm-label">Cover Image</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={coverUrl}
                onClick={() => setCoverPickerOpen(true)}
                placeholder="No cover selected — click the button to pick one"
                className="adm-input cursor-pointer text-slate-400"
              />
              <button
                onClick={() => setCoverPickerOpen(true)}
                className="adm-btn adm-btn-ghost !px-3 shrink-0"
                aria-label="Choose cover"
              >
                <ImageIcon size={15} />
              </button>
            </div>
            <MediaPickerModal
              open={coverPickerOpen}
              onClose={() => setCoverPickerOpen(false)}
              items={mediaItems}
              onSelect={(url) => setCoverUrl(url)}
            />
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            Status:
            {status === 'published' ? (
              <span className="adm-badge adm-badge-published">published</span>
            ) : (
              <span className="adm-badge adm-badge-draft">{status}</span>
            )}
          </p>
        </div>

        {/* Content blocks */}
        <div className="adm-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <h2 className="adm-title text-base">Article Content ({blocks.length})</h2>
            <p className="adm-hint">Build the article by stacking blocks — text, headings, quotes, lists and images.</p>
          </div>

          <div className="p-4 space-y-3">
            {blocks.length === 0 && (
              <p className="py-6 text-center adm-hint">
                No content yet — add blocks below.
              </p>
            )}
            {blocks.map((block, index) => {
              const Meta = BLOCK_TYPE_META[block.type];
              return (
                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                      <Meta.icon size={13} /> {Meta.label}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => moveBlock(index, -1)} disabled={index === 0} className="adm-icon-btn" aria-label="Move up">
                        <ArrowUp size={14} />
                      </button>
                      <button onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="adm-icon-btn" aria-label="Move down">
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => {
                          const copy = [...blocks];
                          copy.splice(index + 1, 0, structuredClone(block));
                          setBlocks(copy);
                        }}
                        className="adm-icon-btn"
                        aria-label="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => setBlocks(blocks.filter((_, i) => i !== index))}
                        className="adm-icon-btn adm-icon-btn-danger"
                        aria-label="Delete block"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <BlockFields block={block} onChange={(next) => updateBlock(index, next)} mediaItems={mediaItems} />
                </div>
              );
            })}

            <div className="flex flex-wrap gap-2 pt-2">
              {(Object.keys(BLOCK_TYPE_META) as PostContentBlock['type'][]).map((type) => (
                <button
                  key={type}
                  onClick={() => setBlocks([...blocks, newBlock(type)])}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-[11px] font-bold px-3 py-2 cursor-pointer transition-colors"
                >
                  <Plus size={12} /> {BLOCK_TYPE_META[type].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="sticky bottom-4 adm-card p-4 flex flex-wrap items-center gap-3 shadow-lg z-10">
          <button onClick={handleSave} disabled={pending} className="adm-btn adm-btn-primary">
            <Save size={15} />
            {pending ? 'Saving…' : status === 'published' ? 'Save & Update Site' : 'Save'}
          </button>

          {status !== 'published' && (
            <button onClick={() => handleStatusChange('published')} disabled={pending} className="adm-btn adm-btn-success">
              <Globe size={15} /> Publish
            </button>
          )}
          {status === 'published' && (
            <>
              <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
                View Live
              </a>
              <button
                onClick={() =>
                  setConfirmAction({
                    label: 'Unpublish',
                    message: 'This will remove the post from the live blog. You can re-publish it later.',
                    fn: () => handleStatusChange('draft'),
                  })
                }
                disabled={pending}
                className="adm-btn adm-btn-ghost"
              >
                Unpublish
              </button>
            </>
          )}
          {status !== 'archived' && (
            <button
              onClick={() =>
                setConfirmAction({
                  label: 'Archive',
                  message: 'This will archive the post. It will no longer appear on the live blog.',
                  fn: () => handleStatusChange('archived'),
                })
              }
              disabled={pending}
              className="adm-btn adm-btn-ghost"
            >
              Archive
            </button>
          )}

          <span className="ml-auto text-[11px] font-semibold text-slate-400">
            {pending ? (
              <span className="text-indigo-500">Saving…</span>
            ) : lastSaved ? (
              <span>Saved {lastSaved}</span>
            ) : changed ? (
              <span className="text-amber-500">Unsaved changes</span>
            ) : null}
          </span>
        </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.label ?? ''}
        message={confirmAction?.message ?? ''}
        confirmLabel={confirmAction?.label}
        variant="danger"
        onConfirm={() => {
          confirmAction?.fn();
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
