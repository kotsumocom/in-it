import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables."
  );
}

// 通常のクライアント（RLS適用）- フロントエンド/認証用
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin クライアント（RLSバイパス）- Webhook/バックエンド処理用
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
