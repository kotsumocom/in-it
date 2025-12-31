import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { getSubscriptionStatus } from "../lib/api.ts";

interface DashboardData {
  user: State["user"];
  subscriptionStatus: string | null;
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

    // サブスク状態をバックエンドAPIから取得（最新状態を反映）
    const { status: subscriptionStatus, error } = await getSubscriptionStatus(
      ctx.state.user.id
    );

    if (error) {
      console.error("Dashboard subscription fetch error:", error);
    }

    return ctx.render({
      user: ctx.state.user,
      subscriptionStatus: subscriptionStatus,
    });
  },
};

export default function Dashboard({ data }: PageProps<DashboardData>) {
  const { user, subscriptionStatus } = data;
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

        {/* プロフィール管理 */}
        <section class="mb-8 p-6 bg-white border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4">👤 プロフィール</h2>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <span class="text-gray-600">公開状態:</span>
              {profile?.is_public ? (
                <span class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium">
                  公開中
                </span>
              ) : (
                <span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium">
                  非公開
                </span>
              )}
            </div>
            <div class="flex gap-3 mt-2">
              <a
                href="/profile/edit"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                プロフィールを編集
              </a>
              {profile?.slug && (
                <a
                  href={`/mentors/${profile.slug}`}
                  class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  公開ページをプレビュー
                </a>
              )}
            </div>
          </div>
        </section>

        {/* 招待コード */}
        <section class="p-6 bg-white border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4">🎫 招待コード</h2>
          <div class="mb-4">
            <p class="text-gray-600 mb-2">あなたの招待コード:</p>
            <div class="flex items-center gap-2">
              <code class="px-4 py-2 bg-gray-100 text-lg font-mono">
                COMING_SOON
              </code>
              <button
                class="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                disabled
              >
                コピー
              </button>
            </div>
          </div>
          <div class="p-4 bg-blue-50 border border-blue-100">
            <p class="text-blue-700 text-sm">
              ✨ 招待特典: 招待された人も、招待した人も1ヶ月無料！
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
