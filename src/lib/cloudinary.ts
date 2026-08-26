import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
export { type TransformPreset, transformedUrl, safeTransformUrl } from './cloudinary-utils';

/**
 * Isolated Cloudinary integration. The API secret never leaves the server:
 * uploads happen through server actions using signed, server-side SDK calls.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function ensureConfig() {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error(
      'Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.'
    );
  }
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

export const MEDIA_FOLDER = 'magnus-cms';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

export interface UploadedAsset {
  publicId: string;
  url: string;
  kind: 'image' | 'video' | 'raw';
  format: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
}

export function isAllowedMime(mime: string): mime is `image/${string}` | `video/${string}` {
  return (
    (mime.startsWith('image/') && mime !== 'image/svg+xml') || // SVG can carry scripts
    mime.startsWith('video/')
  );
}

export function maxBytesForMime(mime: string): number {
  return mime.startsWith('video/') ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
}

/** Uploads a raw buffer to Cloudinary inside the CMS folder. */
export async function uploadBuffer(
  buffer: Buffer,
  mime: string
): Promise<UploadedAsset> {
  ensureConfig();

  const resourceType = mime.startsWith('video/') ? 'video' : 'image';

  const result = await new Promise<UploadedAsset>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: MEDIA_FOLDER,
        resource_type: resourceType,
        // Images are delivered via strict transformation URLs; keep originals private-ish.
        unique_filename: true,
        overwrite: false,
      },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(new Error(error?.message ?? 'Cloudinary upload failed.'));
          return;
        }
        resolve({
          publicId: uploaded.public_id,
          url: uploaded.secure_url,
          kind: resourceType === 'video' ? 'video' : 'image',
          format: uploaded.format ?? null,
          width: uploaded.width ?? null,
          height: uploaded.height ?? null,
          bytes: uploaded.bytes ?? null,
        });
      }
    );
    stream.end(buffer);
  });

  return result;
}

/** Permanently removes an asset from Cloudinary. */
export async function destroyAsset(publicId: string, kind: 'image' | 'video' | 'raw'): Promise<void> {
  ensureConfig();
  const resourceType = kind === 'video' ? 'video' : 'image';
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(`Cloudinary delete failed with result: ${result.result}`);
  }
}
