import Link from 'next/link';
import type { Metadata } from 'next';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import { getNavigation } from '@/lib/cms/navigation';
import { getSiteSettings } from '@/lib/cms/settings';
import SiteShell from '@/components/site/SiteShell';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog | Magnus Enterprises',
};

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
}

async function getPublishedPosts(): Promise<PostRow[]> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('posts')
      .select('id, slug, title, excerpt, cover_image_url, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);
    if (error) return [];
    return (data ?? []) as PostRow[];
  } catch {
    return [];
  }
}

export default async function BlogIndexPage() {
  const [posts, settings, headerNav, footerNav] = await Promise.all([
    getPublishedPosts(),
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
        <section className="py-24 px-[5%] bg-black min-h-[60vh]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-lime" />
              <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">
                Insights & Updates
              </span>
            </div>
            <h1 className="font-space text-[clamp(32px,5vw,64px)] leading-[1.05] text-white tracking-tighter font-bold uppercase mb-16">
              THE <span className="text-lime">BLOG.</span>
            </h1>

            {posts.length === 0 ? (
              <p className="font-sans text-sm text-zinc-500 uppercase tracking-widest">
                No articles published yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group border border-white/10 bg-zinc-950 hover:border-lime/50 transition-colors duration-300 flex flex-col"
                  >
                    <div className="aspect-video bg-black overflow-hidden relative">
                      {post.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-space text-4xl font-bold text-white/5 uppercase">M</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      {post.published_at && (
                        <span className="font-sans text-[9px] font-bold tracking-[3px] uppercase text-zinc-600 mb-3">
                          {new Date(post.published_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                      <h2 className="font-space text-lg font-bold text-white uppercase tracking-tight group-hover:text-lime transition-colors mb-3">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="font-sans text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      }
    />
  );
}
