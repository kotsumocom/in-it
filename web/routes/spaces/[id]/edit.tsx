import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import { getCategories, getTags, getSpace } from "../../../lib/api.ts";
import type { Category, Tag, Space } from "../../../lib/api.ts";
import SpaceForm from "../../../islands/SpaceForm.tsx";

interface EditSpaceData {
  user: State["user"];
  space: Space;
  categories: Category[];
  tags: Tag[];
  accessToken: string | null;
}

export const handler: Handlers<EditSpaceData, State> = {
  async GET(req, ctx) {
    // 未ログインの場合はログインページへリダイレクト
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const spaceId = ctx.params.id;

    // スペースを取得
    const { space, error } = await getSpace(spaceId);
    if (error || !space) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard?error=space_not_found" },
      });
    }

    // 所有権チェック
    if (space.user_id !== ctx.state.user.id) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard?error=unauthorized" },
      });
    }

    // カテゴリとタグを並列取得
    const [{ categories }, { tags }] = await Promise.all([
      getCategories(),
      getTags(),
    ]);

    // アクセストークンを取得
    const cookies = req.headers.get("cookie") || "";
    const accessToken = getCookie(cookies, "access_token");

    return ctx.render({
      user: ctx.state.user,
      space,
      categories,
      tags,
      accessToken,
    });
  },
};

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export default function EditSpacePage({ data }: PageProps<EditSpaceData>) {
  const { space, categories, tags, accessToken } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/dashboard" class="flex items-center gap-2">
            <img src="/type.svg" alt="in-it" class="h-8" />
            <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium">
              メンター
            </span>
          </a>
          <nav class="flex items-center gap-4">
            <a href="/dashboard" class="text-gray-600 hover:text-gray-900">
              ダッシュボード
            </a>
            <a href="/logout" class="text-gray-600 hover:text-gray-900">
              ログアウト
            </a>
          </nav>
        </div>
      </header>

      <div class="max-w-2xl mx-auto py-12 px-4">
        <div class="mb-8">
          <a
            href="/dashboard"
            class="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← ダッシュボードに戻る
          </a>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-8">スペースを編集</h1>

        <div class="bg-white border border-gray-200 p-6">
          <SpaceForm
            mode="edit"
            spaceId={space.id}
            initialData={{
              title: space.title,
              description: space.description || undefined,
              category_id: space.category_id || undefined,
              website_url: space.website_url || undefined,
              x_url: space.x_url || undefined,
              instagram_url: space.instagram_url || undefined,
              slug: space.slug || undefined,
              is_public: space.is_public,
            }}
            initialTagIds={space.tags?.map((t) => t.id) || []}
            categories={categories}
            tags={tags}
            accessToken={accessToken}
            isSubscribed={["active", "trialing", "forever_free"].includes(
              space.subscription_status || ""
            )}
          />
        </div>
      </div>
    </div>
  );
}
