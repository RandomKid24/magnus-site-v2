import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { requireStaff } from '@/lib/auth';
import { getPageById, getSectionsByPageId } from '@/lib/cms/pages';
import { SectionRenderer } from '@/components/cms/blocks';

export const metadata: Metadata = {
  title: 'Preview | Magnus CMS',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * Staff-only draft preview. Renders the page exactly as the public site will,
 * regardless of publish status.
 */
export default async function AdminPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  let page = null;
  let sections: Awaited<ReturnType<typeof getSectionsByPageId>> = [];
  try {
    page = await getPageById(id);
    if (page) sections = await getSectionsByPageId(id);
  } catch {
    page = null;
  }

  if (!page) notFound();

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <div className="sticky top-0 z-50 bg-yellow-300 text-slate-900 text-center py-2 font-sans text-xs font-bold uppercase tracking-wider shadow-md">
        Draft Preview — this is how “{page.title}” will appear once published
      </div>
      {sections.length === 0 ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="font-sans text-xs font-bold tracking-[3px] uppercase text-zinc-500">
            No sections yet — add blocks in the editor and save to see them here.
          </p>
        </div>
      ) : (
        <SectionRenderer sections={sections} context={{ debug: true }} />
      )}
    </div>
  );
}
