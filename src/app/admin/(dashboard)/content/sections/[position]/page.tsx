import { notFound } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSectionsByPageId } from '@/lib/cms/pages';
import { listMedia } from '@/lib/cms/media';
import { BLOCK_DEFINITIONS } from '@/lib/cms/blocks/definitions';
import { AdminPageHeader } from '@/components/admin/AdminUI';
import SectionEditor from './SectionEditor';

export const metadata = {
  title: 'Edit Section | Magnus CMS',
};

export default async function AdminSectionEditPage({
  params,
}: {
  params: Promise<{ position: string }>;
}) {
  await requireRole('admin', 'editor');

  const position = Number((await params).position);
  if (!Number.isInteger(position) || position < 0) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: home } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .maybeSingle();

  if (!home) notFound();

  const sections = await getSectionsByPageId(home.id).catch(() => []);
  const section = sections[position];
  if (!section) notFound();

  const media = await listMedia().catch(() => []);

  const def = BLOCK_DEFINITIONS[section.type];

  return (
    <div className="space-y-6 pb-24">
      <AdminPageHeader
        title={`Edit: ${def?.label ?? section.type}`}
        subtitle={`Section ${position + 1} of ${sections.length} — changes apply to the live site when saved.`}
      />

      <SectionEditor
        pageId={home.id}
        position={position}
        type={section.type}
        initialData={(section.data ?? {}) as Record<string, unknown>}
        mediaItems={media}
      />
    </div>
  );
}
