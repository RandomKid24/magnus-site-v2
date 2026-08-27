'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { BLOCK_DEFINITIONS } from '@/lib/cms/blocks/definitions';
import { saveSectionAction } from '../../actions';
import FieldGroup from '@/components/admin/BlockFieldsForm';
import { showToast } from '@/components/admin/Toast';
import type { MediaItem } from '@/lib/cms/types';

export default function SectionEditor({
  pageId,
  position,
  type,
  initialData,
  mediaItems,
}: {
  pageId: string;
  position: number;
  type: string;
  initialData: Record<string, unknown>;
  mediaItems: MediaItem[];
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [pending, startTransition] = useTransition();

  const def = BLOCK_DEFINITIONS[type];

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSectionAction(pageId, position, type, data);
      if (result.error) {
        showToast('error', result.error);
        return;
      }
      showToast('success', 'Section saved.');
      router.push('/admin/content');
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="adm-card bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <FieldGroup
          key={`${type}-${position}`}
          fields={def?.fields ?? []}
          value={data}
          onChange={setData}
          mediaItems={mediaItems}
        />
      </div>

      <div className="sticky bottom-4 z-10">
        <div className="adm-card p-4 shadow-xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
            >
              <Save size={16} />
              {pending ? 'Saving…' : 'Save & Back'}
            </button>

            <a
              href="/admin/content"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={14} /> Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
