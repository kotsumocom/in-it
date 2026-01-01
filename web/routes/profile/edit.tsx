import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../_middleware.ts";

interface ProfileEditData {
  user: State["user"];
  error?: string;
  success?: boolean;
}

export const handler: Handlers<ProfileEditData, State> = {
  async GET(_req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    return ctx.render({
      user: ctx.state.user,
    });
  },

  async POST(req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const form = await req.formData();
    const displayName = form.get("displayName")?.toString() || "";
    const tagline = form.get("tagline")?.toString() || "";
    const bio = form.get("bio")?.toString() || "";

    // バリデーション
    if (!displayName) {
      return ctx.render({
        user: ctx.state.user,
        error: "表示名は必須です",
      });
    }

    // 更新
    const { error } = await supabase
      .from("mentor_profiles")
      .update({
        display_name: displayName,
        tagline: tagline || null,
        bio: bio || null,
      })
      .eq("id", ctx.state.user.id);

    if (error) {
      return ctx.render({
        user: ctx.state.user,
        error: "保存に失敗しました: " + error.message,
      });
    }

    // 成功したらダッシュボードへ
    return new Response(null, {
      status: 303,
      headers: { Location: "/dashboard" },
    });
  },
};

export default function ProfileEdit({ data }: PageProps<ProfileEditData>) {
  const { user, error } = data;
  const profile = user?.mentor_profile;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/dashboard" class="flex items-center gap-2">
            <img src="/type.svg" alt="in-it" class="h-8" />
          </a>
          <a href="/dashboard" class="text-gray-600 hover:text-gray-900">
            ← ダッシュボードに戻る
          </a>
        </div>
      </header>

      <div class="max-w-2xl mx-auto py-12 px-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">プロフィール編集</h1>

        {error && (
          <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        <form method="POST" class="space-y-8">
          {/* 基本情報 */}
          <section class="p-6 bg-white border border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 mb-4">基本情報</h2>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                表示名 <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                value={profile?.display_name || ""}
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                キャッチコピー
              </label>
              <input
                type="text"
                name="tagline"
                value={profile?.tagline || ""}
                placeholder="例: Pythonでデータ分析を教えます"
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                自己紹介
              </label>
              <textarea
                name="bio"
                rows={8}
                placeholder="あなたの経歴やスキル、教え方について..."
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {profile?.bio || ""}
              </textarea>
            </div>
          </section>

          <button
            type="submit"
            class="w-full py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            保存する
          </button>
        </form>
      </div>
    </div>
  );
}
