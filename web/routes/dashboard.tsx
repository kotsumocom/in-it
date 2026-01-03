import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { getUserSpaces } from "../lib/api.ts";
import type { Space } from "../lib/api.ts";
import ReferralCode from "../islands/ReferralCode.tsx";
import SpacePublicToggle from "../islands/SpacePublicToggle.tsx";

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

interface DashboardData {
  user: State["user"];
  spaces: Space[];
  accessToken: string | null;
}

export const handler: Handlers<DashboardData, State> = {
  async GET(req, ctx) {
    // 未ログインの場合はログインページへリダイレクト
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    // ユーザーのスペース一覧を取得
    const { spaces } = await getUserSpaces(ctx.state.user.id);

    // アクセストークンを取得
    const cookies = req.headers.get("cookie") || "";
    const accessToken = getCookie(cookies, "access_token");

    return ctx.render({
      user: ctx.state.user,
      spaces,
      accessToken,
    });
  },
};

export default function Dashboard({ data }: PageProps<DashboardData>) {
  const { user, spaces, accessToken } = data;
  const profile = user?.mentor_profile;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/dashboard" class="flex items-center gap-2">
            <img src="/type.svg" alt="イニット" class="h-8" />
            <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium">
              メンター
            </span>
          </a>
          <nav class="flex items-center gap-4">
            <a href="/mentors" class="text-gray-600 hover:text-gray-900">
              メンター一覧
            </a>
            <a href="/logout" class="text-gray-600 hover:text-gray-900">
              ログアウト
            </a>
          </nav>
        </div>
      </header>

      <div class="max-w-3xl mx-auto py-12 px-4">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            {/* プロフィール画像 */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || "アバター"}
                class="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div class="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <h1 class="text-2xl font-bold text-gray-900">
              👋 {profile?.display_name || "メンター"} さん
            </h1>
          </div>
          <a
            href="/profile/edit"
            class="text-blue-600 hover:text-blue-700 text-sm"
          >
            プロフィール編集 →
          </a>
        </div>

        {/* スペース一覧 */}
        <section class="mb-8 p-6 bg-white border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-900">📦 マイスペース</h2>
            <a
              href="/spaces/new"
              class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              + 新規作成
            </a>
          </div>

          {spaces.length === 0 ? (
            <div class="text-center py-8 text-gray-500">
              <p class="mb-4">まだスペースがありません</p>
              <a
                href="/spaces/new"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                最初のスペースを作成する →
              </a>
            </div>
          ) : (
            <div class="space-y-3">
              {spaces.map((space) => {
                const isSubscribed = [
                  "active",
                  "trialing",
                  "forever_free",
                ].includes(space.subscription_status || "");
                return (
                  <div
                    key={space.id}
                    class="p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        {/* タイトル行 */}
                        <div class="flex items-center gap-2 mb-1">
                          <h3 class="font-medium text-gray-900 truncate">
                            {space.title}
                          </h3>
                          {!isSubscribed && (
                            <span class="flex-shrink-0 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs">
                              未課金
                            </span>
                          )}
                        </div>

                        {/* カテゴリ */}
                        {space.category && (
                          <p class="text-sm text-gray-500 mb-2">
                            {space.category.display_name}
                          </p>
                        )}

                        {/* 課金・公開ステータス行 */}
                        <div class="flex flex-wrap items-center gap-2 text-xs mb-2">
                          {/* 課金ステータス */}
                          <span
                            class={`px-2 py-0.5 ${
                              isSubscribed
                                ? space.subscription_status === "forever_free"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            課金ステータス：
                            {space.subscription_status === "active"
                              ? "課金中"
                              : space.subscription_status === "trialing"
                              ? "トライアル中"
                              : space.subscription_status === "forever_free"
                              ? "永久無料"
                              : space.subscription_status === "past_due"
                              ? "支払い遅延"
                              : "未課金"}
                          </span>

                          {/* 公開トグル */}
                          {isSubscribed && (
                            <div class="flex items-center gap-2">
                              <span class="text-gray-500">公開:</span>
                              <SpacePublicToggle
                                spaceId={space.id}
                                initialValue={space.is_public}
                                accessToken={accessToken}
                              />
                            </div>
                          )}
                        </div>

                        {/* タグ */}
                        {space.tags && space.tags.length > 0 && (
                          <div class="flex flex-wrap gap-1">
                            {space.tags.slice(0, 5).map((tag) => (
                              <span
                                key={tag.id}
                                class="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200"
                              >
                                {tag.display_name}
                              </span>
                            ))}
                            {space.tags.length > 5 && (
                              <span class="px-2 py-0.5 text-gray-400 text-xs">
                                +{space.tags.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ボタン */}
                      <div class="flex flex-col gap-2">
                        {!isSubscribed && (
                          <a
                            href={`/spaces/${space.id}/subscribe`}
                            class="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 text-center"
                          >
                            課金する
                          </a>
                        )}
                        {isSubscribed &&
                          space.subscription_status !== "forever_free" && (
                            <a
                              href="/billing"
                              class="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 text-center"
                            >
                              請求管理
                            </a>
                          )}
                        <a
                          href={`/spaces/${space.id}/edit`}
                          class="px-4 py-1.5 text-sm text-blue-600 border border-blue-300 hover:bg-blue-50 text-center"
                        >
                          編集
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 招待コード */}
        <section class="p-6 bg-white border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4">🎫 招待コード</h2>
          <ReferralCode
            code={user?.id?.slice(0, 8).toUpperCase() || "--------"}
            baseUrl={Deno.env.get("APP_URL") || "https://in-it.ooo"}
          />
        </section>
      </div>
    </div>
  );
}
