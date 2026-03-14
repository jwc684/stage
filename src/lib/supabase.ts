import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKET = "stage_storage";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase 환경변수가 설정되지 않았습니다");
    }

    _supabase = createClient(url, key);
  }
  return _supabase;
}

export function getPublicUrl(filePath: string): string {
  const { data } = getSupabase().storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);
  return data.publicUrl;
}
