import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://scvwbkgbocvrmjbntrrx.supabase.co';

export const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_BC9_yKuUd5uNr3OOHhoAmg_GVWRZKjN';

export const SUPABASE_BUCKET = 'portfolio-media';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  return supabaseInstance;
}

export interface SupabaseUploadResult {
  publicUrl: string;
  storagePath: string;
}

/**
 * Uploads any image or video file directly to Supabase Storage bucket ('portfolio-media')
 * and logs metadata to 'portfolio_uploads' table if created.
 * Returns null gracefully if the bucket/policy is not yet configured in Supabase Dashboard.
 */
export async function uploadFileToSupabase(
  file: File,
  uniqueFileName: string,
  folder: 'uploads' | 'videos' = 'uploads',
  onProgress?: (progressPercent: number) => void
): Promise<SupabaseUploadResult | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const storagePath = `${folder}/${uniqueFileName}`;

  try {
    if (onProgress) onProgress(18);

    const { error: uploadError } = await client.storage
      .from(SUPABASE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '31536000',
        contentType: file.type || (folder === 'videos' ? 'video/mp4' : 'image/jpeg'),
        upsert: false
      });

    if (uploadError) {
      return null;
    }

    if (onProgress) onProgress(75);

    const { data: urlData } = client.storage
      .from(SUPABASE_BUCKET)
      .getPublicUrl(storagePath);

    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) return null;

    // Best-effort metadata record in Supabase PostgreSQL ('portfolio_uploads' table)
    try {
      await client.from('portfolio_uploads').upsert({
        id: uniqueFileName.replace(/\./g, '_'),
        file_name: uniqueFileName,
        original_name: file.name,
        download_url: publicUrl,
        storage_path: storagePath,
        file_size: file.size,
        mime_type: file.type || (folder === 'videos' ? 'video/mp4' : 'image/jpeg'),
        created_at: new Date().toISOString()
      });
    } catch {
      // Table is optional; Firestore /uploads still tracks every item
    }

    if (onProgress) onProgress(95);
    return { publicUrl, storagePath };
  } catch {
    return null;
  }
}

/**
 * Deletes an uploaded asset from Supabase Storage and 'portfolio_uploads' table.
 */
export async function deleteFileFromSupabase(storagePath: string, docId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    if (storagePath) {
      await client.storage.from(SUPABASE_BUCKET).remove([storagePath]);
    }
    if (docId) {
      await client.from('portfolio_uploads').delete().eq('id', docId);
    }
  } catch {
    // Non-fatal cleanup
  }
}
