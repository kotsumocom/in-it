import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { getCategories, getTags } from "../../lib/api.ts";
import type { Category, Tag } from "../../lib/api.ts";
import SpaceForm from "../../islands/SpaceForm.tsx";

interface NewSpaceData {
  user: State["user"];
  categories: Category[];
  tags: Tag[];
  accessToken: string | null;
}

export const handler: Handlers<NewSpaceData, State> = {
  async GET(req, ctx) {
    // 未ログインの場合はログインページへリダイレクト
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
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

export default function NewSpacePage({ data }: PageProps<NewSpaceData>) {
  const { categories, tags, accessToken } = data;

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

        <h1 class="text-2xl font-bold text-gray-900 mb-8">
          新しいスペースを作成
        </h1>

        <div class="bg-white border border-gray-200 p-6">
          <SpaceForm
            mode="create"
            categories={categories}
            tags={tags}
            accessToken={accessToken}
          />
        </div>
      </div>
    </div>
  );
}
