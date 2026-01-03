import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { getCategories, getTags } from "../lib/api.ts";
import type { Category, Tag, Space } from "../lib/api.ts";

interface HomeData {
  user: State["user"];
  categories: Category[];
  featuredTags: Tag[];
  spaces: Space[];
  searchQuery: string;
  selectedCategory: string;
  selectedTag: string;
}

const API_URL = Deno.env.get("API_URL") || "http://localhost:3001";

export const handler: Handlers<HomeData, State> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("q") || "";
    const selectedCategory = url.searchParams.get("category") || "";
    const selectedTag = url.searchParams.get("tag") || "";

    // カテゴリとタグを並列取得
    const [{ categories }, { tags }] = await Promise.all([
      getCategories(),
      getTags(),
    ]);
    const featuredTags = tags.filter((t) => t.is_featured);

    // 公開スペース一覧を取得（検索クエリ付き）
    let spaces: Space[] = [];
    try {
      const apiParams = new URLSearchParams();
      if (searchQuery) apiParams.set("q", searchQuery);
      if (selectedCategory) apiParams.set("category", selectedCategory);
      if (selectedTag) apiParams.set("tag", selectedTag);
      apiParams.set("limit", "24");

      const res = await fetch(`${API_URL}/api/public/spaces?${apiParams}`);
      if (res.ok) {
        spaces = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch spaces:", e);
    }

    return ctx.render({
      user: ctx.state.user,
      categories,
      featuredTags,
      spaces,
      searchQuery,
      selectedCategory,
      selectedTag,
    });
  },
};

export default function Home({ data }: PageProps<HomeData>) {
  const {
    user,
    categories,
    featuredTags,
    spaces,
    searchQuery,
    selectedCategory,
    selectedTag,
  } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニット" class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/lp" class="text-gray-600 hover:text-gray-900 text-sm">
              メンター向け
            </a>
            {user ? (
              <a
                href="/dashboard"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                マイページ
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  class="text-gray-600 hover:text-gray-900 text-sm"
                >
                  ログイン
                </a>
                <a
                  href="/signup"
                  class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  登録
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section class="bg-gradient-to-b from-blue-600 to-blue-700 text-white py-12 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            あなたにぴったりのメンターを見つけよう
          </h1>
          <p class="text-lg opacity-90 mb-8">
            プログラミング、デザイン、マーケティングなど様々な分野のプロに相談できます
          </p>

          {/* 検索バー */}
          <div class="max-w-xl mx-auto">
            <form action="/" method="GET" class="flex gap-2">
              <input
                type="text"
                name="q"
                placeholder="キーワードで検索..."
                value={searchQuery}
                class="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                class="px-6 py-3 bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors"
              >
                検索
              </button>
            </form>
            {searchQuery && (
              <p class="mt-3 text-sm opacity-75">
                「{searchQuery}」の検索結果: {spaces.length}件
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 注目タグ */}
      {featuredTags.length > 0 && (
        <section class="py-6 px-4 border-b border-gray-200 bg-white">
          <div class="max-w-6xl mx-auto">
            <div class="flex flex-wrap gap-2 justify-center">
              {featuredTags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/?tag=${tag.id}`}
                  class={`px-4 py-2 text-sm transition-colors ${
                    selectedTag === tag.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  {tag.display_name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <div class="max-w-6xl mx-auto py-8 px-4">
        <div class="flex gap-8">
          {/* サイドバー: カテゴリ */}
          <aside class="hidden md:block w-64 flex-shrink-0">
            <div class="sticky top-24">
              <h2 class="text-lg font-bold text-gray-900 mb-4">カテゴリ</h2>
              <nav class="space-y-1">
                <a
                  href="/"
                  class={`block px-3 py-2 font-medium ${
                    !selectedCategory
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  すべて
                </a>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <a
                      href={`/?category=${cat.id}`}
                      class={`block px-3 py-2 font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.display_name}
                    </a>
                    {/* サブカテゴリ */}
                    {cat.children && cat.children.length > 0 && (
                      <div class="ml-4 border-l border-gray-200">
                        {cat.children.map((child) => (
                          <a
                            key={child.id}
                            href={`/?category=${child.id}`}
                            class={`block px-3 py-1.5 text-sm transition-colors ${
                              selectedCategory === child.id
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            }`}
                          >
                            {child.display_name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* メインコンテンツ: スペース一覧 */}
          <main class="flex-1">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">スペース一覧</h2>
              <select class="px-3 py-2 border border-gray-300 text-gray-700 text-sm">
                <option value="newest">新着順</option>
                <option value="popular">人気順</option>
              </select>
            </div>

            {spaces.length === 0 ? (
              <div class="text-center py-16 text-gray-500">
                <p class="text-lg mb-4">まだスペースがありません</p>
                <a
                  href="/lp"
                  class="text-blue-600 hover:text-blue-700 font-medium"
                >
                  メンターとして登録する →
                </a>
              </div>
            ) : (
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <a
                    key={space.id}
                    href={`/s/${space.slug}`}
                    class="block bg-white border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* サムネイル 16:9 */}
                    <div class="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      {space.thumbnail_url ? (
                        <img
                          src={space.thumbnail_url}
                          alt={space.title}
                          class="w-full h-full object-cover"
                        />
                      ) : (
                        <span class="text-4xl">📚</span>
                      )}
                    </div>

                    <div class="p-4">
                      {/* カテゴリ */}
                      {space.category && (
                        <p class="text-xs text-blue-600 mb-1">
                          {space.category.display_name}
                        </p>
                      )}

                      {/* タイトル */}
                      <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
                        {space.title}
                      </h3>

                      {/* タグ */}
                      {space.tags && space.tags.length > 0 && (
                        <div class="flex flex-wrap gap-1 mb-2">
                          {space.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs"
                            >
                              {tag.display_name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 説明 */}
                      {space.description && (
                        <p class="text-sm text-gray-500 line-clamp-2">
                          {space.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* フッター */}
      <footer class="py-12 px-4 bg-gray-900 text-gray-400 mt-12">
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-wrap justify-between items-start gap-8 mb-8">
            <div>
              <img src="/type.svg" alt="イニット" class="h-6 mb-2" />
              <p class="text-sm">手数料ゼロのメンタープラットフォーム</p>
            </div>
            <div class="flex flex-wrap gap-6">
              <a href="/lp" class="hover:text-white">
                メンター向け
              </a>
              <a href="/terms" class="hover:text-white">
                利用規約
              </a>
              <a href="/privacy" class="hover:text-white">
                プライバシーポリシー
              </a>
              <a
                href="https://forms.gle/6PkZAk7AdMu52qGUA"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white"
              >
                お問い合わせ
              </a>
            </div>
          </div>
          <p class="text-sm">
            <a
              href="https://kotsumo.com/"
              class="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              © 2025 コツモ
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
