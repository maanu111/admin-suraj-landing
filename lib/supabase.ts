import { createClient } from "@supabase/supabase-js";

// Trimmed, with trailing slashes stripped, to match the landing repo. A value
// pasted into a hosting panel with a stray slash or newline builds a malformed
// request URL, and the landing site already lost an afternoon to exactly that.
const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

/** False when .env is missing — callers fall back to the bundled defaults. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url || "http://localhost", anonKey || "public-anon-key", {
  auth: { persistSession: false },
});

export const MEDIA_BUCKET = "media";

/** Uploads a file to the public `media` bucket and returns its public URL. */
export async function uploadMedia(file: File): Promise<string> {
  // Collapse anything that is not a word character, dot or dash, then guard
  // against a name that sanitises away to nothing or to bare dots.
  const safeName = file.name.replace(/[^\w.-]+/g, "-").replace(/^[.\-]+/, "").toLowerCase();
  const path = `${Date.now()}-${safeName || "upload"}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  // The filename is in the message on purpose: an upload failure is otherwise
  // impossible to diagnose from a screenshot.
  if (error) throw new Error(`${error.message} (file: ${file.name} -> ${path})`);

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
