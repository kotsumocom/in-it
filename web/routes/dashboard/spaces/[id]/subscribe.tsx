import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../../_middleware.ts";
import { getSpace } from "@in-it/backend/services/spaces.ts";
import DashboardLayout from "../../../../components/DashboardLayout.tsx";

interface SubscribeData {
  user: State["user"];
  space: {
    id: string;
    title: string;
    slug: string | null;
  };
  error?: string;
}

const API_URL = Deno.env.get("API_URL") || "http://localhost:3001";
const APP_URL = Deno.env.get("APP_URL") || "https://in-it.dev";

export const handler: Handlers<SubscribeData, State> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    const result = await getSpace(id, user.id);
    if (!result.success || !result.space) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard/spaces" },
      });
    }

    return ctx.render({
      user,
      space: {
        id: result.space.id,
        title: result.space.title,
        slug: result.space.slug,
      },
    });
  },

  async POST(req, ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    if (!user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    const formData = await req.formData();
    const planType = formData.get("planType") as "monthly" | "yearly";
    const couponCode = formData.get("couponCode") as string | null;

    try {
      const res = await fetch(`${API_URL}/api/stripe/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          spaceId: id,
          planType: planType || "monthly",
          referralCode: couponCode || undefined,
          successUrl: `${APP_URL}/dashboard?success=1`,
          cancelUrl: `${APP_URL}/dashboard/spaces/${id}/subscribe?canceled=1`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const result = await getSpace(id, user.id);
        return ctx.render({
          user,
          space: {
            id,
            title: result.space?.title || "",
            slug: result.space?.slug || null,
          },
          error: data.error || "決済セッションの作成に失敗しました",
        });
      }

      const data = await res.json();
      return new Response(null, {
        status: 302,
        headers: { Location: data.url },
      });
    } catch (e) {
      console.error("Checkout error:", e);
      const result = await getSpace(id, user.id);
      return ctx.render({
        user,
        space: {
          id,
          title: result.space?.title || "",
          slug: result.space?.slug || null,
        },
        error: "エラーが発生しました",
      });
    }
  },
};

export default function SubscribePage({ data }: PageProps<SubscribeData>) {
  const { user, space, error } = data;

  return (
    <DashboardLayout activeSection="spaces" user={user}>
      <div class="max-w-lg">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          スペースを公開する
        </h1>
        <p class="text-gray-600 mb-8">
          「{space.title}」を公開するには、サブスクリプションが必要です。
        </p>

        {error && (
          <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        <form method="POST" class="space-y-6">
          {/* プラン選択 */}
          <div class="space-y-4">
            <label class="block p-4 border-2 border-blue-500 bg-blue-50 cursor-pointer">
              <div class="flex items-center justify-between">
                <div>
                  <input
                    type="radio"
                    name="planType"
                    value="monthly"
                    checked
                    class="mr-2"
                  />
                  <span class="font-medium">月額プラン</span>
                </div>
                <span class="text-xl font-bold">
                  ¥1,000
                  <span class="text-sm font-normal text-gray-600">/月</span>
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-2 ml-6">いつでも解約可能</p>
            </label>

            <label class="block p-4 border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <input
                    type="radio"
                    name="planType"
                    value="yearly"
                    class="mr-2"
                  />
                  <span class="font-medium">年額プラン</span>
                  <span class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs">
                    2ヶ月分お得
                  </span>
                </div>
                <span class="text-xl font-bold">
                  ¥10,000
                  <span class="text-sm font-normal text-gray-600">/年</span>
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-2 ml-6">年間で2,000円お得！</p>
            </label>
          </div>

          {/* クーポンコード */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              クーポンコード（オプション）
            </label>
            <input
              type="text"
              name="couponCode"
              placeholder="クーポンコードを入力"
              class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            class="w-full py-4 bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            決済へ進む
          </button>
        </form>

        <div class="mt-8 p-4 bg-gray-100 text-sm text-gray-600">
          <p class="font-medium mb-2">✅ サブスクリプションに含まれるもの</p>
          <ul class="space-y-1">
            <li>• スペースの公開</li>
            <li>• 外部リンクの掲載</li>
            <li>• 手数料なしでサービス提供</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
