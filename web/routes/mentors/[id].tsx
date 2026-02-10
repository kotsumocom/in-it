import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../_middleware.ts";
import ShareButtons from "../../islands/ShareButtons.tsx";

interface SpaceItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  slug: string | null;
  category: {
    display_name: string;
  } | null;
  tags: {
    tag: {
      display_name: string;
    };
  }[];
}

interface MentorProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

interface MentorPageData {
  mentor: MentorProfile | null;
  spaces: SpaceItem[];
  user: State["user"];
}

export const handler: Handlers<MentorPageData, State> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;

    // メンターのプロフィールを取得
    const { data: mentor } = await supabase
      .from("mentor_profiles")
      .select("id, display_name, avatar_url")
      .eq("id", id)
      .single();

    if (!mentor) {
      return ctx.renderNotFound();
    }

    // メンターの公開スペース一覧を取得
    const { data: spaces } = await supabase
      .from("mentor_spaces")
      .select(
        `
        id,
        title,
        thumbnail_url,
        slug,
        category:categories(display_name),
        tags:space_tags(tag:tags(display_name))
      `,
      )
      .eq("user_id", id)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    return ctx.render({
      mentor: mentor as MentorProfile,
      spaces: (spaces || []) as SpaceItem[],
      user: ctx.state.user,
    });
  },
};

export default function MentorPage({ data }: PageProps<MentorPageData>) {
  const { mentor, spaces, user } = data;

  if (!mentor) {
    return <div>メンターが見つかりません</div>;
  }

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニット" class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/" class="text-gray-600 hover:text-gray-900">
              スペース一覧
            </a>
            {user ? (
              <a href="/dashboard" class="text-gray-600 hover:text-gray-900">
                ダッシュボード
              </a>
            ) : (
              <a
                href="/login"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                ログイン
              </a>
            )}
          </nav>
        </div>
      </header>

      <div class="max-w-3xl mx-auto py-12 px-4">
        {/* メンター基本情報 */}
        <section class="mb-8 p-8 bg-white border border-gray-200">
          <div class="flex items-center gap-6">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt={mentor.display_name}
                class="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                👤
              </div>
            )}
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
                {mentor.display_name}
              </h1>
            </div>
          </div>
          {/* SNS共有ボタン */}
          <div class="mt-4">
            <ShareButtons
              url={`https://in-it.ooo/mentors/${mentor.id}`}
              title={mentor.display_name}
            />
          </div>
        </section>

        {/* スペース一覧 */}
        <section>
          <h2 class="text-xl font-bold text-gray-900 mb-6">スペース</h2>

          {spaces.length === 0 ? (
            <div class="text-center py-12 text-gray-500">
              公開中のスペースはありません
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spaces.map((space) => (
                <a
                  href={`/s/${space.slug}`}
                  class="block bg-white border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  {space.thumbnail_url ? (
                    <img
                      src={space.thumbnail_url}
                      alt={space.title}
                      class="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div class="w-full aspect-square bg-gray-100 flex items-center justify-center text-4xl text-gray-400">
                      📦
                    </div>
                  )}
                  <div class="p-4">
                    <h3 class="font-bold text-gray-900 mb-2">{space.title}</h3>
                    {space.category && (
                      <p class="text-sm text-blue-600 mb-2">
                        {space.category.display_name}
                      </p>
                    )}
                    {space.tags && space.tags.length > 0 && (
                      <div class="flex flex-wrap gap-1">
                        {space.tags.map((t) => (
                          <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs">
                            {t.tag.display_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
