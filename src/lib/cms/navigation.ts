import 'server-only';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import type { NavigationItem } from '@/lib/cms/types';

export interface PublicNavigationItem {
  id: string;
  label: string;
  url: string;
  opensInNewTab: boolean;
  children: PublicNavigationItem[];
}

/** Fetches visible navigation items for a location, nested one level deep. */
export async function getNavigation(location: 'header' | 'footer'): Promise<PublicNavigationItem[] | null> {
  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('navigation_items')
      .select('id, label, url, parent_id, position, opens_in_new_tab')
      .eq('location', location)
      .eq('is_visible', true)
      .order('position', { ascending: true });

    if (error) return null;

    const items = (data ?? []) as Pick<
      NavigationItem,
      'id' | 'label' | 'url' | 'parent_id' | 'opens_in_new_tab'
    >[];

    const roots: PublicNavigationItem[] = [];
    const byId = new Map<string, PublicNavigationItem>();

    for (const item of items) {
      byId.set(item.id, {
        id: item.id,
        label: item.label,
        url: item.url,
        opensInNewTab: item.opens_in_new_tab,
        children: [],
      });
    }
    for (const item of items) {
      const node = byId.get(item.id);
      if (!node) continue;
      if (item.parent_id && byId.has(item.parent_id)) {
        byId.get(item.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  } catch {
    // CMS unreachable / not configured — callers fall back to defaults.
    return null;
  }
}
