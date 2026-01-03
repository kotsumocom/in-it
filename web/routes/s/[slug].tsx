import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { getPublicSpace } from "../../lib/api.ts";
import type { Space } from "../../lib/api.ts";

interface SpacePageData {
  space: Space;
  user: State["user"];
}

export const handler: Handlers<SpacePageData, State> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;

    const { space, error } = await getPublicSpace(slug);

    if (error || !space) {
      return ctx.renderNotFound();
    }

    return ctx.render({
      space,
      user: ctx.state.user,
    });
  },
};

export default function SpacePage({ data }: PageProps<SpacePageData>) {
  const { space, user } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="in-it" class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/mentors" class="text-gray-600 hover:text-gray-900">
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
        {/* スペースヘッダー */}
        <div class="mb-8">
          {/* カテゴリ */}
          {space.category && (
            <p class="text-sm text-blue-600 mb-2">
              {space.category.display_name}
            </p>
          )}

          <h1 class="text-3xl font-bold text-gray-900 mb-4">{space.title}</h1>

          {/* タグ */}
          {space.tags && space.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mb-6">
              {space.tags.map((tag) => (
                <span
                  key={tag.id}
                  class="px-3 py-1 bg-gray-100 text-gray-700 text-sm"
                >
                  {tag.display_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 外部リンク */}
        {(space.website_url || space.x_url || space.instagram_url) && (
          <section class="p-6 bg-white border border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 mb-4">🔗 リンク</h2>
            <div class="space-y-2">
              {space.website_url && (
                <a
                  href={space.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  🌐 Website
                </a>
              )}
              {space.x_url && (
                <a
                  href={space.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  𝕏 X (Twitter)
                </a>
              )}
              {space.instagram_url && (
                <a
                  href={space.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  📷 Instagram
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
