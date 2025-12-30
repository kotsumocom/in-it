import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../_middleware.ts";

interface Mentor {
  id: string;
  display_name: string;
  tagline: string | null;
  avatar_url: string | null;
  slug: string;
  category: {
    display_name: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  display_name: string;
}

interface MentorsData {
  mentors: Mentor[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  user: State["user"];
}

export const handler: Handlers<MentorsData, State> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const selectedCategory = url.searchParams.get("category");
    const searchQuery = url.searchParams.get("q") || "";

    // カテゴリ一覧を取得
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, display_name")
      .order("display_order");

    // メンター一覧を取得
    let query = supabase
      .from("mentor_profiles")
      .select(
        `
        id,
        display_name,
        tagline,
        avatar_url,
        slug,
        category:categories(display_name)
      `
      )
      .eq("is_public", true)
      .not("slug", "is", null);

    if (selectedCategory) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("name", selectedCategory)
        .single();
      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    if (searchQuery) {
      query = query.or(
        `display_name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%`
      );
    }

    const { data: mentors } = await query;

    return ctx.render({
      mentors: (mentors || []) as Mentor[],
      categories: (categories || []) as Category[],
      selectedCategory,
      searchQuery,
      user: ctx.state.user,
    });
  },
};

export default function Mentors({ data }: PageProps<MentorsData>) {
  const { mentors, categories, selectedCategory, searchQuery, user } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="text-xl font-bold text-blue-600">
            in-it
          </a>
          <nav class="flex items-center gap-4">
            {user ? (
              <a
                href="/dashboard"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                マイページ
              </a>
            ) : (
              <a
                href="/login"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                ログイン
              </a>
            )}
          </nav>
        </div>
      </header>

      <div class="max-w-5xl mx-auto py-8 px-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">メンター一覧</h1>

        {/* 検索・フィルター */}
        <form method="GET" class="mb-8">
          <div class="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="q"
              value={searchQuery}
              placeholder="キーワードで検索..."
              class="flex-1 px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <select
              name="category"
              class="px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">すべてのカテゴリ</option>
              {categories.map((cat) => (
                <option
                  value={cat.name}
                  selected={selectedCategory === cat.name}
                >
                  {cat.display_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              検索
            </button>
          </div>
        </form>

        {/* メンターカード */}
        {mentors.length === 0 ? (
          <div class="text-center py-12 text-gray-500">
            メンターが見つかりませんでした
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <a
                href={`/mentors/${mentor.slug}`}
                class="block p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start gap-4">
                  {mentor.avatar_url ? (
                    <img
                      src={mentor.avatar_url}
                      alt={mentor.display_name}
                      class="w-16 h-16 object-cover"
                    />
                  ) : (
                    <div class="w-16 h-16 bg-gray-200 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  )}
                  <div class="flex-1 min-w-0">
                    <h2 class="text-lg font-bold text-gray-900 truncate">
                      {mentor.display_name}
                    </h2>
                    {mentor.category && (
                      <p class="text-sm text-blue-600 mb-1">
                        {mentor.category.display_name}
                      </p>
                    )}
                    {mentor.tagline && (
                      <p class="text-gray-600 text-sm line-clamp-2">
                        {mentor.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
