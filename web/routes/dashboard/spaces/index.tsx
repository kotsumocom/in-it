import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { getUserSpaces } from "../../lib/api.ts";
import type { Space } from "../../lib/api.ts";
import SpacePublicToggle from "../../islands/SpacePublicToggle.tsx";
import DashboardLayout from "../../components/DashboardLayout.tsx";

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

interface SpacesData {
  user: State["user"];
  spaces: Space[];
  accessToken: string | null;
}

export const handler: Handlers<SpacesData, State> = {
  async GET(req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const { spaces } = await getUserSpaces(ctx.state.user.id);
    const cookies = req.headers.get("cookie") || "";
    const accessToken = getCookie(cookies, "access_token");

    return ctx.render({
      user: ctx.state.user,
      spaces,
      accessToken,
    });
  },
};

export default function SpacesIndex({ data }: PageProps<SpacesData>) {
  const { spaces, accessToken } = data;

  return (
    <DashboardLayout activeSection="spaces">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900">マイスペース</h1>
        <a
          href="/dashboard/spaces/new"
          class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          + 新規作成
        </a>
      </div>

      {spaces.length === 0 ? (
        <div class="bg-white border border-gray-200 p-8 text-center text-gray-500">
          <p class="mb-4">まだスペースがありません</p>
          <a
            href="/dashboard/spaces/new"
            class="text-blue-600 hover:text-blue-700 font-medium"
          >
            最初のスペースを作成する →
          </a>
        </div>
      ) : (
        <div class="space-y-4">
          {spaces.map((space) => {
            const isSubscribed = [
              "active",
              "trialing",
              "forever_free",
            ].includes(space.subscription_status || "");
            return (
              <div
                key={space.id}
                class="bg-white border border-gray-200 p-4 hover:border-gray-300 transition-colors"
              >
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

                {/* 課金ステータス */}
                <div class="flex flex-wrap items-center gap-2 text-xs mb-2">
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
                </div>

                {/* タグ */}
                {space.tags && space.tags.length > 0 && (
                  <div class="flex flex-wrap gap-1 mb-3">
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

                {/* 公開トグル（左）とボタン（右）の横並び */}
                <div class="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500">公開</span>
                    <SpacePublicToggle
                      spaceId={space.id}
                      initialValue={space.is_public}
                      accessToken={accessToken}
                      isSubscribed={isSubscribed}
                    />
                  </div>

                  <div class="flex items-center gap-2">
                    {!isSubscribed && (
                      <a
                        href={`/dashboard/spaces/${space.id}/subscribe`}
                        class="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        課金する
                      </a>
                    )}
                    {isSubscribed &&
                      space.subscription_status !== "forever_free" && (
                        <a
                          href="/billing"
                          class="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
                        >
                          請求管理
                        </a>
                      )}
                    <a
                      href={`/dashboard/spaces/${space.id}/edit`}
                      class="px-4 py-1.5 text-sm text-blue-600 border border-blue-300 hover:bg-blue-50"
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
    </DashboardLayout>
  );
}
