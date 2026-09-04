'use server';

import { incrementProfileViews } from '@/lib/profile/views';

/** Called once per profile page visit from the client. Safe to fail soft. */
export async function recordProfileViewAction(): Promise<{ views: number }> {
  const views = await incrementProfileViews();
  return { views };
}
