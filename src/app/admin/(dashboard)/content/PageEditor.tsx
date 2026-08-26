'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  Globe,
  MoreHorizontal,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOCK_DEFINITIONS, BLOCK_TYPE_ORDER } from '@/lib/cms/blocks/definitions';
import { savePageAction, setPageStatusAction } from './actions';
import FieldGroup from '@/components/admin/BlockFieldsForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { showToast } from '@/components/admin/Toast';
import type { MediaItem } from '@/lib/cms/types';

interface EditorSection {
  key: string;
  type: string;
  data: Record<string, unknown>;
}

function str(d: Record<string, unknown>, path: string): string {
  const v = d[path];
  return typeof v === 'string' ? v.trim() : '';
}

function itemCount(d: Record<string, unknown>, path: string): number {
  const v = d[path];
  return Array.isArray(v) ? v.length : 0;
}

function getSectionPreview(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case 'hero':
      return str(data, 'tagline') || 'No tagline set';
    case 'features':
    case 'usps':
    case 'customers': {
      const title = [str(data, 'title_plain'), str(data, 'title_accent')].filter(Boolean).join(' ');
      const n = itemCount(data, 'items');
      return `${title || 'Untitled'} · ${n} item${n !== 1 ? 's' : ''}`;
    }
    case 'products': {
      const title = [str(data, 'title_plain'), str(data, 'title_accent')].filter(Boolean).join(' ');
      const n = itemCount(data, 'items');
      return `${title || 'Untitled'} · ${n} product${n !== 1 ? 's' : ''}`;
    }
    case 'services': {
      const title = [str(data, 'title_plain'), str(data, 'title_accent')].filter(Boolean).join(' ');
      const n = itemCount(data, 'items');
      return `${title || 'Untitled'} · ${n} service${n !== 1 ? 's' : ''}`;
    }
    case 'industries': {
      const title = [str(data, 'title_plain'), str(data, 'title_accent')].filter(Boolean).join(' ');
      const n = itemCount(data, 'items');
      return `${title || 'Untitled'} · ${n} industr${n !== 1 ? 'ies' : 'y'}`;
    }
    case 'fleet': {
      const title = [str(data, 'title_plain'), str(data, 'title_accent')].filter(Boolean).join(' ');
      const n = itemCount(data, 'machines');
      return `${title || 'Untitled'} · ${n} machine${n !== 1 ? 's' : ''}`;
    }
    case 'gallery': {
      const title = [str(data, 'title_plain'), str(data, 'title_accent')].filter(Boolean).join(' ');
      const n = itemCount(data, 'images');
      return `${title || 'Untitled'} · ${n} image${n !== 1 ? 's' : ''}`;
    }
    case 'about': {
      const title = [str(data, 'title_plain'), str(data, 'title_accent'), str(data, 'title_suffix')].filter(Boolean).join(' ');
      return title || str(data, 'narrative_lead').slice(0, 60) || 'Untitled';
    }
    case 'quality':
      return str(data, 'certification') || str(data, 'quote_plain').slice(0, 60) || 'Untitled';
    case 'contact':
      return [str(data, 'title_plain'), str(data, 'title_accent')].filter(Boolean).join(' ') || 'Contact section';
    case 'text':
      return str(data, 'heading') || str(data, 'body').slice(0, 60) || 'Empty text section';
    case 'image':
      return str(data, 'caption') || str(data, 'alt') || 'Image (no caption)';
    case 'pricing':
      return str(data, 'heading') || `${itemCount(data, 'tiers')} tier${itemCount(data, 'tiers') !== 1 ? 's' : ''}`;
    case 'testimonials':
      return str(data, 'heading') || `${itemCount(data, 'items')} testimonial${itemCount(data, 'items') !== 1 ? 's' : ''}`;
    case 'faq':
      return str(data, 'heading') || `${itemCount(data, 'items')} question${itemCount(data, 'items') !== 1 ? 's' : ''}`;
    case 'cta':
      return str(data, 'heading') || 'CTA banner';
    case 'custom':
      return str(data, 'heading') || `${itemCount(data, 'entries')} entr${itemCount(data, 'entries') !== 1 ? 'ies' : 'y'}`;
    default:
      return '';
  }
}

export default function PageEditor({
  pageId,
  initialTitle,
  initialSlug,
  initialStatus,
  initialSections,
  mediaItems,
}: {
  pageId: string;
  initialTitle: string;
  initialSlug: string;
  initialStatus: string;
  initialSections: EditorSection[];
  mediaItems: MediaItem[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [status, setStatus] = useState(initialStatus);
  const [sections, setSections] = useState<EditorSection[]>(initialSections);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<{ label: string; message: string; fn: () => void } | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editingRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const editing = useMemo(
    () => sections.find((s) => s.key === editingKey) ?? null,
    [sections, editingKey]
  );

  const updateEditingData = (nextData: Record<string, unknown>) => {
    setSections((prev) =>
      prev.map((s) => (s.key === editingKey ? { ...s, data: nextData } : s))
    );
  };

  const addSection = (type: string) => {
    const def = BLOCK_DEFINITIONS[type];
    if (!def) return;
    const key = `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setSections((prev) => [...prev, { key, type, data: def.defaultData() }]);
    setEditingKey(key);
    setAddOpen(false);
  };

  const duplicateSection = (key: string) => {
    const index = sections.findIndex((s) => s.key === key);
    if (index === -1) return;
    const source = sections[index];
    const newKey = `dup-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const clone: EditorSection = {
      key: newKey,
      type: source.type,
      data: structuredClone(source.data),
    };
    const next = [...sections];
    next.splice(index + 1, 0, clone);
    setSections(next);
    setOpenMenuKey(null);
  };

  const removeSection = (key: string) => {
    setSections((prev) => prev.filter((s) => s.key !== key));
    if (editingKey === key) setEditingKey(null);
    setOpenMenuKey(null);
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  };

  const handleSave = useCallback(() => {
    startTransition(async () => {
      const result = await savePageAction(
        pageId,
        { title, slug },
        sections.map((s) => ({ type: s.type, data: s.data }))
      );
      if (result.error) {
        showToast('error', result.error);
      } else {
        setStatus(status === 'published' ? 'published' : status);
        const now = new Date();
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        showToast('success', status === 'published' ? 'Saved — live site updated.' : 'Draft saved.');
        router.refresh();
      }
    });
  }, [pageId, title, slug, sections, status, router]);

  const handleStatusChange = (nextStatus: 'draft' | 'published' | 'archived') => {
    startTransition(async () => {
      const saved = await savePageAction(
        pageId,
        { title, slug },
        sections.map((s) => ({ type: s.type, data: s.data }))
      );
      if (saved.error) {
        showToast('error', saved.error);
        return;
      }
      const result = await setPageStatusAction(pageId, nextStatus, slug);
      if (result.error) {
        showToast('error', result.error);
        return;
      }
      setStatus(nextStatus);
      showToast(
        'success',
        nextStatus === 'published'
          ? 'Published — live site updated.'
          : `Page ${nextStatus}.`
      );
      router.refresh();
    });
  };

  const sectionJson = JSON.stringify(sections);
  const changed = title !== initialTitle || slug !== initialSlug || sectionJson !== JSON.stringify(initialSections);

  useEffect(() => {
    if (!changed || pending) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleSave();
    }, 8000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [changed, pending, handleSave]);

  useEffect(() => {
    if (editingKey && editingRef.current) {
      editingRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [editingKey]);

  // Close three-dot menu when clicking outside
  useEffect(() => {
    if (!openMenuKey) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuKey(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuKey]);

  return (
    <div className="space-y-6">
      {/* Page Settings */}
      <div className="adm-card p-5">
        <h2 className="adm-title text-base mb-4">Page Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="adm-label">Page Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="adm-input" />
          </div>
          <div>
            <label className="adm-label">Web Address</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-semibold">/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                maxLength={140}
                className="adm-input flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="adm-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="adm-title text-base">Page Sections</h2>
              <p className="adm-hint mt-0.5">Drag to reorder. Click Edit to change content.</p>
            </div>
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-indigo-500" />
            </div>
            <h3 className="adm-title text-lg mb-1">Start Building Your Page</h3>
            <p className="adm-hint mb-6 max-w-sm mx-auto">Add sections to build your page. Each section is a piece of content like a hero banner, text block, or image gallery.</p>
            <button onClick={() => setAddOpen(true)} className="adm-btn adm-btn-primary !px-8 !py-3 !text-sm">
              <Plus size={18} /> Add Your First Section
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {sections.map((section, index) => {
                const def = BLOCK_DEFINITIONS[section.type];
                const isEditing = section.key === editingKey;
                const isMenuOpen = openMenuKey === section.key;
                return (
                  <div key={section.key}>
                    {/* Section row */}
                    <div
                      className={cn(
                        'flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors',
                        isEditing ? 'bg-indigo-50' : 'hover:bg-slate-50'
                      )}
                      onClick={() => setEditingKey(isEditing ? null : section.key)}
                    >
                      {/* Number + reorder */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs font-bold text-slate-300 w-6 text-center">{index + 1}</span>
                        <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="p-1 rounded hover:bg-slate-200 text-slate-400 disabled:opacity-30 transition-colors" title="Move up">
                          <ArrowUp size={14} />
                        </button>
                        <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="p-1 rounded hover:bg-slate-200 text-slate-400 disabled:opacity-30 transition-colors" title="Move down">
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-bold', isEditing ? 'text-indigo-700' : 'text-slate-900')}>
                          {def?.label ?? section.type}
                        </p>
                        <p className={cn('text-xs truncate mt-0.5', isEditing ? 'text-indigo-500' : 'text-slate-400')}>
                          {getSectionPreview(section.type, section.data)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setEditingKey(isEditing ? null : section.key)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all',
                            isEditing
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                          )}
                        >
                          <Pencil size={13} />
                          {isEditing ? 'Editing' : 'Edit'}
                        </button>

                        {/* Three-dot menu for secondary actions */}
                        <div className="relative" ref={isMenuOpen ? menuRef : undefined}>
                          <button
                            onClick={() => setOpenMenuKey(isMenuOpen ? null : section.key)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                            title="More options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-20">
                              <button
                                onClick={() => duplicateSection(section.key)}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                              >
                                <Copy size={14} className="text-slate-400" /> Duplicate
                              </button>
                              <hr className="my-1 border-slate-100" />
                              <button
                                onClick={() => {
                                  setConfirmAction({
                                    label: 'Delete Section',
                                    message: `Delete this ${def?.label ?? section.type} section? This cannot be undone.`,
                                    fn: () => removeSection(section.key),
                                  });
                                  setOpenMenuKey(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Inline edit panel */}
                    {isEditing && editing && (
                      <div ref={editingRef} className="bg-indigo-50/50 border-t border-indigo-100 px-5 py-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <ChevronRight size={14} className="text-indigo-400" />
                            <h3 className="text-sm font-bold text-indigo-700">
                              Editing: {def?.label ?? section.type}
                            </h3>
                          </div>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Check size={13} /> Done Editing
                          </button>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                          <FieldGroup
                            key={editing.key}
                            fields={BLOCK_DEFINITIONS[editing.type]?.fields ?? []}
                            value={editing.data}
                            onChange={updateEditingData}
                            mediaItems={mediaItems}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Section button — always visible at bottom of list */}
            <button
              onClick={() => setAddOpen(true)}
              className="w-full py-4 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 border-t border-indigo-100 transition-colors cursor-pointer"
            >
              <Plus size={16} /> Add Another Section
            </button>
          </>
        )}
      </div>

      {/* Save bar — prominent and always visible */}
      <div className="sticky bottom-4 z-10">
        <div className="adm-card p-4 shadow-xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              disabled={pending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
            >
              <Save size={16} />
              {pending ? 'Saving…' : status === 'published' ? 'Save & Update Site' : 'Save Draft'}
            </button>

            {status !== 'published' ? (
              <button
                onClick={() => handleStatusChange('published')}
                disabled={pending}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all shadow-md"
              >
                <Globe size={16} /> Publish to Live Site
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  <Eye size={14} /> View Live
                </a>
                <button
                  onClick={() =>
                    setConfirmAction({
                      label: 'Unpublish',
                      message: 'This will remove the page from the live site. You can re-publish it later.',
                      fn: () => handleStatusChange('draft'),
                    })
                  }
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-300 transition-colors"
                >
                  Unpublish
                </button>
                <button
                  onClick={() =>
                    setConfirmAction({
                      label: 'Archive',
                      message: 'This will archive the page. It will no longer be accessible on the live site.',
                      fn: () => handleStatusChange('archived'),
                    })
                  }
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 transition-colors"
                >
                  Archive
                </button>
              </div>
            )}

            <span className="ml-auto text-xs font-semibold text-slate-400">
              {pending ? (
                <span className="text-indigo-500">Saving…</span>
              ) : lastSaved ? (
                <span>Saved {lastSaved}</span>
              ) : changed ? (
                <span className="text-amber-500">Unsaved changes</span>
              ) : null}
            </span>
          </div>
        </div>
      </div>

      {/* Add-section picker */}
      {addOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setAddOpen(false)}>
          <div className="adm-card w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="adm-title text-xl">Add a Section</h3>
                <p className="adm-hint mt-1">Pick the type of content you want to add.</p>
              </div>
              <button onClick={() => setAddOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <div className="overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BLOCK_TYPE_ORDER.map((type) => {
                const def = BLOCK_DEFINITIONS[type];
                return (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="text-left p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60 bg-white transition-all cursor-pointer group"
                  >
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{def.label}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{def.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
