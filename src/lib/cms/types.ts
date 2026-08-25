export type MediaKind = 'image' | 'video' | 'raw';

export interface MediaItem {
  id: string;
  public_id: string;
  url: string;
  kind: MediaKind;
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  alt_text: string | null;
  folder: string | null;
  created_at: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface PageSection {
  id: string;
  page_id: string;
  type: string;
  position: number;
  data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface SeoMetadata {
  id?: string;
  page_id?: string | null;
  post_id?: string | null;
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  no_index: boolean;
  no_follow: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  position: number;
  is_visible: boolean;
  opens_in_new_tab: boolean;
  location: 'header' | 'footer';
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: { blocks: PostContentBlock[] };
  cover_image_url: string | null;
  status: ContentStatus;
  author_id: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

/** Structured rich-text block used inside post content. */
export type PostContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level: 2 | 3 }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[]; ordered: boolean }
  | { type: 'image'; url: string; alt: string };

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'editor' | 'author';
  created_at: string;
}
