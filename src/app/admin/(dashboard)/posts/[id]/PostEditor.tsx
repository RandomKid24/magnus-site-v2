'use client';

import { useState, useTransition } from 'react';
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
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const meta = () => ({
    title,
    slug,
    excerpt,
    cover_image_url: coverUrl,
    category_id: categoryId,
  });

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await savePostAction(postId, meta(), { blocks });
      if (result.error) setMessage({ kind: 'error', text: result.error });
      else {
        setMessage({ kind: 'success', text: status === 'published' ? 'Saved — live article updated.' : 'Saved.' });
        router.refresh();
      }
    });
  };

  const handleStatusChange = (next: 'draft' | 'published' | 'archived') => {
    setMessage(null);
    startTransition(async () => {
      const saved = await savePostAction(postId, meta(), { blocks });
      if (saved.error) {
        setMessage({ kind: 'error', text: saved.error });
        return;
      }
      const result = await setPostStatusAction(postId, next);
      if (result.error) {
        setMessage({ kind: 'error', text: result.error });
        return;
      }
      setStatus(next);
      setMessage({
        kind: 'success',
        text:
          next === 'published'
            ? 'Published! Your article is now live at /blog.'
            : `Post ${next}.`,
      });
      router.refresh();
    });
  };

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
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(420px,640px)_1fr] gap-6 items-start">
      <div className="space-y-6 min-w-0">
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
              <button onClick={() => handleStatusChange('draft')} disabled={pending} className="adm-btn adm-btn-ghost">
                Unpublish
              </button>
            </>
          )}
          {status !== 'archived' && (
            <button onClick={() => handleStatusChange('archived')} disabled={pending} className="adm-btn adm-btn-ghost">
              Archive
            </button>
          )}

          {message && (
            <span
              role="status"
              className={cn(
                'ml-auto flex items-center gap-1.5 text-xs font-bold rounded-lg px-3 py-1.5',
                message.kind === 'error' ? 'adm-alert-error' : 'adm-alert-success'
              )}
            >
              {message.kind === 'success' && <Check size={13} />}
              {message.text}
            </span>
          )}
        </div>
      </div>

      {/* Right column: live preview of rendered content */}
      <div className="hidden xl:block xl:sticky xl:top-6">
        <h2 className="adm-label mb-3">Content Preview</h2>
        <div className="adm-card p-8 h-[calc(100vh-140px)] overflow-y-auto max-w-none">
          {title && (
            <h1 className="font-space text-3xl font-bold tracking-tight mb-6 text-slate-900">{title}</h1>
          )}
          {blocks.map((block, i) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p key={i} className="text-sm text-slate-600 leading-relaxed mb-4">
                    {block.text}
                  </p>
                );
              case 'heading':
                return block.level === 2 ? (
                  <h2 key={i} className="font-space text-xl font-bold tracking-tight mt-8 mb-3 text-slate-900">
                    {block.text}
                  </h2>
                ) : (
                  <h3 key={i} className="font-space text-base font-bold tracking-tight mt-6 mb-2 text-slate-900">
                    {block.text}
                  </h3>
                );
              case 'quote':
                return (
                  <blockquote key={i} className="border-l-4 border-indigo-500 pl-4 my-6 italic text-slate-600">
                    {block.text}
                  </blockquote>
                );
              case 'list':
                return block.ordered ? (
                  <ol key={i} className="list-decimal pl-6 space-y-1.5 mb-4 text-sm text-slate-600">
                    {block.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ol>
                ) : (
                  <ul key={i} className="list-disc pl-6 space-y-1.5 mb-4 text-sm text-slate-600">
                    {block.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                );
              case 'image':
                return block.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={block.url} alt={block.alt} className="my-4 rounded-lg border border-slate-200" />
                ) : null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
