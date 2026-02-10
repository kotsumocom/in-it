import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../_middleware.ts";

interface Mentor {
  id: string;
  display_name: string;
  avatar_url: string | null;
  space_count: number;
}

interface MentorsData {
  mentors: Mentor[];
  searchQuery: string;
  user: State["user"];
}

export const handler: Handlers<MentorsData, State> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("q") || "";

    // 公開スペースを持つメンター一覧を取得
    // mentor_spacesテーブルからis_public=trueのスペースを持つユーザーを集計
    let query = supabase.from("mentor_profiles").select(`
        id,
        display_name,
        avatar_url
      `);

    if (searchQuery) {
      query = query.ilike("display_name", `%${searchQuery}%`);
    }

    const { data: profiles } = await query;

    // 公開スペース数を各メンターに付与
    const mentors: Mentor[] = [];
    if (profiles) {
      for (const profile of profiles) {
        const { count } = await supabase
          .from("mentor_spaces")
          .select("id", { count: "exact", head: true })
          .eq("user_id", profile.id)
          .eq("is_public", true);

        if (count && count > 0) {
          mentors.push({
            ...profile,
            space_count: count,
          });
        }
      }
    }

    return ctx.render({
      mentors,
      searchQuery,
      user: ctx.state.user,
    });
  },
};

export default function Mentors({ data }: PageProps<MentorsData>) {
  const { mentors, searchQuery, user } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="in-it" class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/" class="text-gray-600 hover:text-gray-900">
              スペース一覧
            </a>
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

        {/* 検索 */}
        <form method="GET" class="mb-8">
          <div class="flex gap-4">
            <input
              type="text"
              name="q"
              value={searchQuery}
              placeholder="メンター名で検索..."
              class="flex-1 px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
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
                href={`/mentors/${mentor.id}`}
                class="block p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center gap-4">
                  {mentor.avatar_url ? (
                    <img
                      src={mentor.avatar_url}
                      alt={mentor.display_name}
                      class="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  )}
                  <div class="flex-1 min-w-0">
                    <h2 class="text-lg font-bold text-gray-900 truncate">
                      {mentor.display_name}
                    </h2>
                    <p class="text-sm text-gray-500">
                      {mentor.space_count} スペース
                    </p>
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
