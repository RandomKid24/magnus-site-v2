import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import { getNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import SiteShell from '@/components/site/SiteShell';
import { renderInlineText, splitParagraphs } from '@/components/cms/inline-text';
import type { PostContentBlock } from '@/lib/cms/types';

export const revalidate = 60;

const RESERVED = new Set(['admin', 'api', '_next', 'static', 'preview']);

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: { blocks: PostContentBlock[] } | null;
  cover_image_url: string | null;
  published_at: string | null;
}

async function getPost(slug: string): Promise<PostRow | null> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('posts')
      .select('id, slug, title, excerpt, content, cover_image_url, published_at')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) return null;
    return (data as PostRow) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      type: 'article',
    },
  };
}

function ContentBlocks({ blocks }: { blocks: PostContentBlock[] }) {
  return (
    <div className="max-w-3xl">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <div key={i} className="space-y-5 mb-8">
                {splitParagraphs(block.text).map((p, j) => (
                  <p key={j} className="font-sans text-lg text-gray-300 leading-relaxed font-light">
                    {renderInlineText(p)}
                  </p>
                ))}
              </div>
            );
          case 'heading':
            return block.level === 2 ? (
              <h2
                key={i}
                className="font-space text-3xl font-bold uppercase tracking-tighter text-white mt-14 mb-6"
              >
                {block.text}
              </h2>
            ) : (
              <h3
                key={i}
                className="font-space text-xl font-bold uppercase tracking-tight text-white mt-10 mb-4"
              >
                {block.text}
              </h3>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="border-l-4 border-lime pl-8 my-10 font-serif italic text-2xl text-gray-200 leading-relaxed"
              >
                {block.text}
              </blockquote>
            );
          case 'list':
            return block.ordered ? (
              <ol key={i} className="list-decimal pl-8 space-y-3 mb-8 font-sans text-base text-gray-300">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="list-disc pl-8 space-y-3 mb-8 font-sans text-base text-gray-300">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'image':
            return block.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={block.url}
                alt={block.alt || ''}
                className="w-full border border-white/10 my-10"
                loading="lazy"
              />
            ) : null;
        }
      })}
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const post = await getPost(slug);
  if (!post) notFound();

  const [settings, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getNavigation('header'),
    getNavigation('footer'),
  ]);

  return (
    <SiteShell
      sections={[]}
      navItems={{ header: headerNav, footer: footerNav }}
      settings={settings}
      override={
        <article className="py-24 px-[5%] bg-black min-h-[60vh]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-lime" />
              <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Article'}
              </span>
            </div>

            <h1 className="font-space text-[clamp(32px,5vw,60px)] leading-[1.05] text-white tracking-tighter font-bold uppercase mb-12">
              {post.title}
            </h1>

            {post.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full border border-white/10 mb-12"
              />
            )}

            {post.content?.blocks?.length ? (
              <ContentBlocks blocks={post.content.blocks} />
            ) : (
              post.excerpt && (
                <p className="font-sans text-lg text-gray-300 leading-relaxed font-light max-w-3xl">
                  {post.excerpt}
                </p>
              )
            )}
          </div>
        </article>
      }
    />
  );
}
