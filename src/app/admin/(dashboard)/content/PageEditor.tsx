'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  Globe,
  Plus,
  Save,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOCK_DEFINITIONS, BLOCK_TYPE_ORDER } from '@/lib/cms/blocks/definitions';
import { savePageAction, setPageStatusAction } from './actions';
import FieldGroup from '@/components/admin/BlockFieldsForm';
import type { MediaItem } from '@/lib/cms/types';

interface EditorSection {
  key: string;
  type: string;
  data: Record<string, unknown>;
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
  const [selectedKey, setSelectedKey] = useState<string | null>(
    initialSections[0]?.key ?? null
  );
  const [addOpen, setAddOpen] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [pending, startTransition] = useTransition();

  const selected = useMemo(
    () => sections.find((s) => s.key === selectedKey) ?? null,
    [sections, selectedKey]
  );

  const updateSelectedData = (nextData: Record<string, unknown>) => {
    setSections((prev) =>
      prev.map((s) => (s.key === selectedKey ? { ...s, data: nextData } : s))
    );
  };

  const addSection = (type: string) => {
    const def = BLOCK_DEFINITIONS[type];
    if (!def) return;
    const key = `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setSections((prev) => [...prev, { key, type, data: def.defaultData() }]);
    setSelectedKey(key);
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
  };

  const removeSection = (key: string) => {
    setSections((prev) => prev.filter((s) => s.key !== key));
    if (selectedKey === key) setSelectedKey(null);
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  };

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await savePageAction(
        pageId,
        { title, slug },
        sections.map((s) => ({ type: s.type, data: s.data }))
      );
      if (result.error) {
        setMessage({ kind: 'error', text: result.error });
      } else {
        setStatus(status === 'published' ? 'published' : status);
        setMessage({ kind: 'success', text: status === 'published' ? 'Saved — live site updated.' : 'Draft saved.' });
        setPreviewKey((k) => k + 1);
        router.refresh();
      }
    });
  };

  const handleStatusChange = (nextStatus: 'draft' | 'published' | 'archived') => {
    setMessage(null);
    startTransition(async () => {
      // Persist current edits first so the published state matches the editor.
      const saved = await savePageAction(
        pageId,
        { title, slug },
        sections.map((s) => ({ type: s.type, data: s.data }))
      );
      if (saved.error) {
        setMessage({ kind: 'error', text: saved.error });
        return;
      }
      const result = await setPageStatusAction(pageId, nextStatus, slug);
      if (result.error) {
        setMessage({ kind: 'error', text: result.error });
        return;
      }
      setStatus(nextStatus);
      setMessage({
        kind: 'success',
        text:
          nextStatus === 'published'
            ? 'Published — live site updated.'
            : `Page ${nextStatus}.`,
      });
      setPreviewKey((k) => k + 1);
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(420px,560px)_1fr] gap-6 items-start">
      {/* LEFT: editor */}
      <div className="space-y-6 min-w-0">
        {/* Sections list */}
        <div className="adm-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
            <div>
              <h2 className="adm-title text-base">Website Sections ({sections.length})</h2>
              <p className="adm-hint">Click a section to edit its content. Order = position on the page.</p>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="adm-btn adm-btn-primary !py-1.5 !px-3 text-[11px]"
            >
              <Plus size={14} /> Add Section
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {sections.length === 0 && (
              <p className="px-5 py-8 text-center adm-hint">
                No sections yet. Click “Add Section” to start building.
              </p>
            )}
            {sections.map((section, index) => {
              const def = BLOCK_DEFINITIONS[section.type];
              const isSelected = section.key === selectedKey;
              return (
                <div
                  key={section.key}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors border-l-[3px]',
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500'
                      : 'hover:bg-slate-50 border-transparent'
                  )}
                  onClick={() => setSelectedKey(section.key)}
                >
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-bold truncate', isSelected ? 'text-indigo-700' : 'text-slate-900')}>
                      {def?.label ?? section.type}
                    </p>
                    <p className="adm-hint truncate">{def?.description}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="adm-icon-btn" title="Move up">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="adm-icon-btn" title="Move down">
                      <ArrowDown size={14} />
                    </button>
                    <button onClick={() => duplicateSection(section.key)} className="adm-icon-btn" title="Duplicate">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => removeSection(section.key)} className="adm-icon-btn adm-icon-btn-danger" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected block fields */}
        {selected && (
          <div className="adm-card p-5">
            <h2 className="adm-title text-base mb-1">Edit Section</h2>
            <p className="adm-hint mb-5">{BLOCK_DEFINITIONS[selected.type]?.label ?? selected.type}</p>
            <FieldGroup
              key={selected.key}
              fields={BLOCK_DEFINITIONS[selected.type]?.fields ?? []}
              value={selected.data}
              onChange={updateSelectedData}
              mediaItems={mediaItems}
            />
          </div>
        )}

        {/* Action bar */}
        <div className="sticky bottom-4 adm-card p-4 flex flex-wrap items-center gap-3 shadow-lg z-10">
          <button onClick={handleSave} disabled={pending} className="adm-btn adm-btn-primary">
            <Save size={15} />
            {pending ? 'Saving…' : status === 'published' ? 'Save & Update Site' : 'Save Draft'}
          </button>

          {status !== 'published' && (
            <button onClick={() => handleStatusChange('published')} disabled={pending} className="adm-btn adm-btn-success">
              <Globe size={15} /> Publish
            </button>
          )}
          {status === 'published' && (
            <>
              <a href="/" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
                <Eye size={15} /> View Live Site
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
                message.kind === 'error'
                  ? 'adm-alert-error'
                  : 'adm-alert-success'
              )}
            >
              {message.kind === 'success' && <Check size={13} />}
              {message.text}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: live preview */}
      <div className="hidden xl:block xl:sticky xl:top-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="adm-label !mb-0">Live Preview <span className="normal-case">(saved state)</span></h2>
          <a href={`/admin/preview/${pageId}`} target="_blank" rel="noopener noreferrer" className="adm-link inline-flex items-center gap-1.5">
            <Eye size={13} /> Open Full
          </a>
        </div>
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md h-[calc(100vh-140px)] bg-white">
          <iframe
            key={previewKey}
            src={`/admin/preview/${pageId}?v=${previewKey}`}
            title="Page preview"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Add-section picker */}
      {addOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setAddOpen(false)}>
          <div className="adm-card w-full max-w-lg max-h-[75vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="adm-title text-lg">Add a Section</h3>
              <button onClick={() => setAddOpen(false)} className="adm-icon-btn" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BLOCK_TYPE_ORDER.map((type) => {
                const def = BLOCK_DEFINITIONS[type];
                return (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/60 bg-white transition-all cursor-pointer group"
                  >
                    <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">{def.label}</p>
                    <p className="adm-hint mt-1 leading-relaxed">{def.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
