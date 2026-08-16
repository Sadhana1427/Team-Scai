import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Client for public operations
export const supabasePublic = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Admin client for server-side uploads & deletions
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export const STORAGE_BUCKETS = {
  POSTERS: "event-posters",
  IMAGES: "event-images",
  WINNERS: "winner-images",
  TEAM: "team-images",
  CAROUSEL: "carousel-images",
  DOCUMENTS: "event-documents",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_DOCUMENT_SIZE = 30 * 1024 * 1024; // 30 MB

export function validateFile(file: File, isDocument = false): { valid: boolean; error?: string } {
  const allowed = isDocument ? ALLOWED_DOCUMENT_TYPES : ALLOWED_IMAGE_TYPES;
  const maxSize = isDocument ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE;

  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type}). Allowed formats: ${allowed.join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit (${(maxSize / (1024 * 1024)).toFixed(0)}MB).`,
    };
  }

  return { valid: true };
}

// Ensure bucket exists or auto-create with public read
export async function ensureBucket(bucket: StorageBucket): Promise<void> {
  try {
    const { data: existing } = await supabaseAdmin.storage.getBucket(bucket);
    if (!existing) {
      await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: MAX_DOCUMENT_SIZE,
      });
    }
  } catch {
    // Ignore error if already exists
  }
}

export async function uploadFileToSupabase(
  bucket: StorageBucket,
  path: string,
  fileBuffer: Buffer | ArrayBuffer | Uint8Array,
  contentType: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Auto-ensure bucket exists
    await ensureBucket(bucket);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage upload error:", error);
      return { url: null, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Upload failed";
    console.error("Upload exception:", errorMsg);
    return { url: null, error: errorMsg };
  }
}

export async function deleteFileFromSupabase(
  bucket: StorageBucket,
  pathOrUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    let filePath = pathOrUrl;
    if (pathOrUrl.includes(`/${bucket}/`)) {
      filePath = pathOrUrl.split(`/${bucket}/`)[1];
    }

    const { error } = await supabaseAdmin.storage.from(bucket).remove([filePath]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Delete failed";
    return { success: false, error: errorMsg };
  }
}
