import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False when .env is missing — callers fall back to the bundled defaults. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url || "http://localhost", anonKey || "public-anon-key", {
  auth: { persistSession: false },
});

export const MEDIA_BUCKET = "media";

/** Uploads a file to the public `media` bucket and returns its public URL. */
export async function uploadMedia(file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, "-").toLowerCase();
  const path = `${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) throw new Error(error.message);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
