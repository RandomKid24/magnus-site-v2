'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import type { FieldDescriptor } from '@/lib/cms/blocks/types';
import { getPath, setPath } from '@/lib/cms/blocks/path-utils';
import { safeTransformUrl } from '@/lib/cloudinary-utils';
import MediaPickerModal from './MediaPickerModal';
import Tooltip from './Tooltip';
import type { MediaItem } from '@/lib/cms/types';

interface FieldGroupProps {
  fields: FieldDescriptor[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  mediaItems: MediaItem[];
}

function ScalarField({
  field,
  val,
  update,
  mediaItems,
}: {
  field: FieldDescriptor;
  val: unknown;
  update: (v: unknown) => void;
  mediaItems: MediaItem[];
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  switch (field.kind) {
    case 'text':
      return (
        <div>
          <label className="adm-label">{field.label}</label>
          <input
            type="text"
            value={typeof val === 'string' ? val : ''}
            placeholder={field.placeholder}
            maxLength={300}
            onChange={(e) => update(e.target.value)}
            className="adm-input"
          />
        </div>
      );
    case 'textarea':
      return (
        <div>
          <label className="adm-label">{field.label}</label>
          <textarea
            rows={field.rows ?? 4}
            value={typeof val === 'string' ? val : ''}
            maxLength={8000}
            onChange={(e) => update(e.target.value)}
            className="adm-input resize-y"
          />
        </div>
      );
    case 'url':
      return (
        <div>
          <label className="adm-label">{field.label}</label>
          <input
            type="text"
            value={typeof val === 'string' ? val : ''}
            onChange={(e) => update(e.target.value)}
            className="adm-input"
          />
          {typeof val === 'string' && val && /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(val) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={safeTransformUrl(val, 'thumbnail')}
              alt=""
              className="mt-2 h-20 w-auto rounded-lg border border-slate-200 object-cover"
            />
          )}
        </div>
      );
    case 'image':
      return (
        <div>
          <label className="adm-label">{field.label}</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={typeof val === 'string' ? val : ''}
              placeholder="No image selected — click the button to pick one"
              onClick={() => setPickerOpen(true)}
              className="adm-input cursor-pointer text-slate-400"
            />
            <Tooltip label="Choose from Media Library" placement="top">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="adm-btn adm-btn-ghost !px-3 shrink-0"
                title="Choose from Media Library"
              >
                <ImageIcon size={15} />
              </button>
            </Tooltip>
          </div>
          {typeof val === 'string' && val && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={safeTransformUrl(val, 'thumbnail')} alt="" className="mt-2 h-20 w-auto rounded-lg border border-slate-200 object-cover" />
          )}
          <MediaPickerModal
            open={pickerOpen}
            onClose={() => setPickerOpen(false)}
            items={mediaItems}
            onSelect={(url) => update(url)}
          />
        </div>
      );
    case 'select':
      return (
        <div>
          <label className="adm-label">{field.label}</label>
          <select
            value={typeof val === 'string' ? val : field.options[0]?.value ?? ''}
            onChange={(e) => update(e.target.value)}
            className="adm-select"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    case 'boolean':
      return (
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(val)}
            onChange={(e) => update(e.target.checked)}
            className="accent-indigo-600 w-4 h-4"
          />
          <span className="text-xs font-semibold text-slate-600">{field.label}</span>
        </label>
      );
    default:
      return null;
  }
}

function StringListField({
  field,
  items,
  onChangeItems,
}: {
  field: Extract<FieldDescriptor, { kind: 'stringList' }>;
  items: string[];
  onChangeItems: (items: string[]) => void;
}) {
  const addItem = () => {
    if (field.maxItems && items.length >= field.maxItems) return;
    onChangeItems([...items, '']);
  };

  const removeItem = (index: number) => {
    onChangeItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChangeItems(next);
  };

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChangeItems(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {field.label} ({items.length})
        </span>
        <button
          type="button"
          onClick={addItem}
          disabled={!!field.maxItems && items.length >= field.maxItems}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
        >
          <Plus size={14} /> Add {field.label.replace(/s$/, '')}
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 p-3">
            <input
              type="text"
              value={item}
              placeholder={field.placeholder ?? 'Item'}
              maxLength={300}
              onChange={(e) => updateItem(index, e.target.value)}
              className="adm-input flex-1"
            />
            <div className="flex items-center gap-0.5 shrink-0">
              <Tooltip label="Move up" placement="top">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors"
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </button>
              </Tooltip>
              <Tooltip label="Move down" placement="top">
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors"
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </button>
              </Tooltip>
              <Tooltip label="Remove" placement="top">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-slate-400 mb-3">No items yet.</p>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition-colors shadow-sm"
            >
              <Plus size={14} /> Add First {field.label.replace(/s$/, '')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ListField({
  field,
  items,
  onChangeItems,
  mediaItems,
}: {
  field: Extract<FieldDescriptor, { kind: 'list' }>;
  items: Record<string, unknown>[];
  onChangeItems: (items: Record<string, unknown>[]) => void;
  mediaItems: MediaItem[];
}) {
  const addItem = () => {
    if (field.maxItems && items.length >= field.maxItems) return;
    onChangeItems([...items, structuredClone(field.defaultItem)]);
  };

  const removeItem = (index: number) => {
    onChangeItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChangeItems(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {field.label} ({items.length})
        </span>
        <button
          type="button"
          onClick={addItem}
          disabled={!!field.maxItems && items.length >= field.maxItems}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-sm"
        >
          <Plus size={14} /> Add {field.label.replace(/s$/, '')}
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item, index) => (
          <div key={index} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 truncate max-w-[60%]">
                {String(item[field.itemLabelKey] ?? `Item ${index + 1}`) || `Item ${index + 1}`}
              </span>
              <div className="flex items-center gap-0.5">
                <Tooltip label="Move up" placement="top">
                  <button
                    type="button"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                </Tooltip>
                <Tooltip label="Move down" placement="top">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === items.length - 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </Tooltip>
                <Tooltip label="Remove" placement="top">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </Tooltip>
              </div>
            </div>

            <FieldGroup
              fields={field.itemFields}
              value={item}
              onChange={(nextItem) => {
                const next = [...items];
                next[index] = nextItem;
                onChangeItems(next);
              }}
              mediaItems={mediaItems}
            />
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-slate-400 mb-3">No items yet.</p>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer transition-colors shadow-sm"
            >
              <Plus size={14} /> Add First {field.label.replace(/s$/, '')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FieldGroup({ fields, value, onChange, mediaItems }: FieldGroupProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        if (field.kind === 'stringList') {
          const raw = getPath(value, field.path);
          const items = Array.isArray(raw) ? raw.filter((v): v is string => typeof v === 'string') : [];
          return (
            <StringListField
              key={field.path}
              field={field}
              items={items}
              onChangeItems={(nextItems) => onChange(setPath(value, field.path, nextItems))}
            />
          );
        }
        if (field.kind === 'list') {
          const raw = getPath(value, field.path);
          const items = Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
          return (
            <ListField
              key={field.path}
              field={field}
              items={items}
              mediaItems={mediaItems}
              onChangeItems={(nextItems) => onChange(setPath(value, field.path, nextItems))}
            />
          );
        }
        return (
          <ScalarField
            key={field.path}
            field={field}
            val={getPath(value, field.path)}
            mediaItems={mediaItems}
            update={(v) => onChange(setPath(value, field.path, v))}
          />
        );
      })}
    </div>
  );
}
