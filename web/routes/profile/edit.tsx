import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../_middleware.ts";

interface Category {
  id: string;
  name: string;
  display_name: string;
}

interface ProfileEditData {
  user: State["user"];
  categories: Category[];
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

    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, display_name")
      .order("display_order");

    return ctx.render({
      user: ctx.state.user,
      categories: categories || [],
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
    const categoryId = form.get("categoryId")?.toString() || null;
    const slug = form.get("slug")?.toString() || "";
    const isPublic = form.get("isPublic") === "on";

    // 外部リンク
    const externalLinks = [];
    for (let i = 0; i < 5; i++) {
      const linkType = form.get(`linkType${i}`)?.toString();
      const linkUrl = form.get(`linkUrl${i}`)?.toString();
      const linkLabel = form.get(`linkLabel${i}`)?.toString();
      if (linkUrl && linkLabel) {
        externalLinks.push({
          type: linkType || "website",
          url: linkUrl,
          label: linkLabel,
        });
      }
    }

    // バリデーション
    if (!displayName) {
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name, display_name")
        .order("display_order");
      return ctx.render({
        user: ctx.state.user,
        categories: categories || [],
        error: "表示名は必須です",
      });
    }

    // スラッグの一意性チェック
    if (slug) {
      const { data: existing } = await supabase
        .from("mentor_profiles")
        .select("id")
        .eq("slug", slug)
        .neq("id", ctx.state.user.id)
        .single();

      if (existing) {
        const { data: categories } = await supabase
          .from("categories")
          .select("id, name, display_name")
          .order("display_order");
        return ctx.render({
          user: ctx.state.user,
          categories: categories || [],
          error: "このURLは既に使用されています",
        });
      }
    }

    // 更新
    const { error } = await supabase
      .from("mentor_profiles")
      .update({
        display_name: displayName,
        tagline: tagline || null,
        bio: bio || null,
        category_id: categoryId || null,
        external_links: externalLinks,
        slug: slug || null,
        is_public: isPublic,
      })
      .eq("id", ctx.state.user.id);

    if (error) {
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name, display_name")
        .order("display_order");
      return ctx.render({
        user: ctx.state.user,
        categories: categories || [],
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
  const { user, categories, error } = data;
  const profile = user?.mentor_profile;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="text-xl font-bold text-blue-600">
            in-it
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

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                name="categoryId"
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">選択してください</option>
                {categories.map((cat) => (
                  <option
                    value={cat.id}
                    selected={profile?.category_id === cat.id}
                  >
                    {cat.display_name}
                  </option>
                ))}
              </select>
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

          {/* 外部リンク */}
          <section class="p-6 bg-white border border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 mb-4">外部リンク</h2>
            <p class="text-gray-600 mb-4 text-sm">
              予約ページ、SNS、ポートフォリオなど自由にリンクを追加できます
            </p>

            {[0, 1, 2, 3, 4].map((i) => {
              const link = profile?.external_links?.[i];
              return (
                <div class="mb-4 p-4 bg-gray-50 border border-gray-200">
                  <div class="grid grid-cols-3 gap-4">
                    <select
                      name={`linkType${i}`}
                      class="px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none"
                    >
                      <option
                        value="website"
                        selected={link?.type === "website"}
                      >
                        🌐 Web
                      </option>
                      <option
                        value="calendly"
                        selected={link?.type === "calendly"}
                      >
                        📅 予約
                      </option>
                      <option
                        value="twitter"
                        selected={link?.type === "twitter"}
                      >
                        𝕏 X
                      </option>
                      <option
                        value="youtube"
                        selected={link?.type === "youtube"}
                      >
                        ▶️ YouTube
                      </option>
                      <option value="zoom" selected={link?.type === "zoom"}>
                        💬 Zoom
                      </option>
                    </select>
                    <input
                      type="url"
                      name={`linkUrl${i}`}
                      value={link?.url || ""}
                      placeholder="https://..."
                      class="col-span-2 px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    name={`linkLabel${i}`}
                    value={link?.label || ""}
                    placeholder="ボタンに表示するテキスト"
                    class="mt-2 w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              );
            })}
          </section>

          {/* 公開設定 */}
          <section class="p-6 bg-white border border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 mb-4">公開設定</h2>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                プロフィールURL
              </label>
              <div class="flex items-center gap-2">
                <span class="text-gray-500">in-it.io/mentors/</span>
                <input
                  type="text"
                  name="slug"
                  value={profile?.slug || ""}
                  pattern="[a-z0-9-]+"
                  placeholder="your-name"
                  class="flex-1 px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">
                半角英数字とハイフンのみ使用可能
              </p>
            </div>

            <div>
              <label class="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={profile?.is_public}
                  class="w-5 h-5"
                />
                <span class="text-gray-700">プロフィールを公開する</span>
              </label>
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
