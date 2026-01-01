import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { getSubscriptionStatus, getUserSpaces } from "../lib/api.ts";
import type { Space } from "../lib/api.ts";
import ReferralCode from "../islands/ReferralCode.tsx";

interface DashboardData {
  user: State["user"];
  subscriptionStatus: string | null;
  spaces: Space[];
}

export const handler: Handlers<DashboardData, State> = {
  async GET(_req, ctx) {
    // 未ログインの場合はログインページへリダイレクト
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    // サブスク状態をバックエンドAPIから取得
    const { status: subscriptionStatus, error } = await getSubscriptionStatus(
      ctx.state.user.id
    );

    if (error) {
      console.error("Dashboard subscription fetch error:", error);
    }

    // ユーザーのスペース一覧を取得
    const { spaces } = await getUserSpaces(ctx.state.user.id);

    return ctx.render({
      user: ctx.state.user,
      subscriptionStatus: subscriptionStatus,
      spaces,
    });
  },
};

export default function Dashboard({ data }: PageProps<DashboardData>) {
  const { user, subscriptionStatus, spaces } = data;
  const profile = user?.mentor_profile;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return (
          <span class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium">
            有効
          </span>
        );
      case "trialing":
        return (
          <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium">
            トライアル中
          </span>
        );
      case "past_due":
        return (
          <span class="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium">
            支払い遅延
          </span>
        );
      case "canceled":
        return (
          <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium">
            解約済み
          </span>
        );
      default:
        return (
          <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium">
            未登録
          </span>
        );
    }
  };

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
              メンター一覧
            </a>
            <a href="/logout" class="text-gray-600 hover:text-gray-900">
              ログアウト
            </a>
          </nav>
        </div>
      </header>

      <div class="max-w-3xl mx-auto py-12 px-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">
          👋 {profile?.display_name || "メンター"} さん
        </h1>

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
              {spaces.map((space) => (
                <div
                  key={space.id}
                  class="flex items-center justify-between p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-medium text-gray-900">{space.title}</h3>
                      {space.is_public ? (
                        <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs">
                          公開中
                        </span>
                      ) : (
                        <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs">
                          非公開
                        </span>
                      )}
                    </div>
                    {space.category && (
                      <p class="text-sm text-gray-500">
                        {space.category.display_name}
                      </p>
                    )}
                  </div>
                  <div class="flex items-center gap-2">
                    {space.slug && space.is_public && (
                      <a
                        href={`/s/${space.slug}`}
                        class="px-3 py-1 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
                      >
                        プレビュー
                      </a>
                    )}
                    <a
                      href={`/spaces/${space.id}/edit`}
                      class="px-3 py-1 text-sm text-blue-600 border border-blue-300 hover:bg-blue-50"
                    >
                      編集
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* サブスク状態 */}
        <section class="mb-8 p-6 bg-white border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4">📊 ステータス</h2>
          <div class="flex items-center gap-4 mb-4">
            <span class="text-gray-600">サブスクリプション:</span>
            {getStatusBadge(subscriptionStatus)}
          </div>
          {(!subscriptionStatus ||
            subscriptionStatus === "inactive" ||
            subscriptionStatus === "canceled") && (
            <a
              href="/subscribe"
              class="inline-block px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              プランを選択
            </a>
          )}
          {(subscriptionStatus === "active" ||
            subscriptionStatus === "trialing") && (
            <a
              href="/billing"
              class="inline-block px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              支払い設定を管理
            </a>
          )}
        </section>

        {/* 招待コード */}
        <section class="p-6 bg-white border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4">🎫 招待コード</h2>
          <ReferralCode
            code={user?.id?.slice(0, 8).toUpperCase() || "--------"}
          />
        </section>
      </div>
    </div>
  );
}
