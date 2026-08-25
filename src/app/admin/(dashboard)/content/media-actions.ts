'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  uploadBuffer,
  destroyAsset,
  isAllowedMime,
  maxBytesForMime,
} from '@/lib/cloudinary';

export interface MediaActionState {
  error?: string;
  success?: string;
}

const altTextSchema = z.string().max(500).optional();

export async function uploadMediaAction(
  _prevState: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  const user = await requireRole('admin', 'editor', 'author');

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'Please choose a file to upload.' };
  }

  if (!isAllowedMime(file.type)) {
    return { error: 'Unsupported file type. Images and videos only.' };
  }

  const maxBytes = maxBytesForMime(file.type);
  if (file.size > maxBytes) {
    return {
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Limit: ${maxBytes / 1024 / 1024} MB.`,
    };
  }

  const parsedAlt = altTextSchema.safeParse(formData.get('altText') ?? undefined);
  const altText = typeof parsedAlt.data === 'string' ? parsedAlt.data.trim() : undefined;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await uploadBuffer(buffer, file.type);

    const supabase = await createSupabaseServerClient();
    const { error: dbError } = await supabase.from('media').insert({
      public_id: asset.publicId,
      url: asset.url,
      kind: asset.kind,
      format: asset.format,
      width: asset.width,
      height: asset.height,
      bytes: asset.bytes,
      alt_text: altText ?? null,
      folder: 'magnus-cms',
      uploaded_by: user.id,
    });

    if (dbError) {
      // Keep storage and database consistent: remove the orphaned asset.
      await destroyAsset(asset.publicId, asset.kind).catch(() => undefined);
      return { error: `Upload saved to Cloudinary but not registered: ${dbError.message}` };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Upload failed. Please try again.',
    };
  }

  revalidatePath('/admin/content');
  revalidatePath('/admin/posts');
  return { success: 'Uploaded — it now appears in the list below.' };
}
