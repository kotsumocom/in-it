import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { getUserSpaces } from "../../lib/api.ts";
import type { Space } from "../../lib/api.ts";
import DashboardLayout from "../../components/DashboardLayout.tsx";

interface DashboardData {
  user: State["user"];
  spaces: Space[];
}

export const handler: Handlers<DashboardData, State> = {
  async GET(_req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const { spaces } = await getUserSpaces(ctx.state.user.id);

    return ctx.render({
      user: ctx.state.user,
      spaces,
    });
  },
};

export default function DashboardIndex({ data }: PageProps<DashboardData>) {
  const { user, spaces } = data;
  const profile = user?.mentor_profile;

  const activeSpaces = spaces.filter((s) =>
    ["active", "trialing", "forever_free"].includes(
      s.subscription_status || "",
    ),
  );

  return (
    <DashboardLayout activeSection="dashboard" user={user}>
      <div class="flex items-center gap-4 mb-8">
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
          {profile?.display_name || "メンター"} さん
        </h1>
      </div>

      {/* 概要カード */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white border border-gray-200 p-6">
          <p class="text-sm text-gray-500 mb-1">スペース数</p>
          <p class="text-2xl font-bold text-gray-900">{spaces.length}</p>
        </div>
        <div class="bg-white border border-gray-200 p-6">
          <p class="text-sm text-gray-500 mb-1">公開中</p>
          <p class="text-2xl font-bold text-green-600">{activeSpaces.length}</p>
        </div>
        <div class="bg-white border border-gray-200 p-6">
          <p class="text-sm text-gray-500 mb-1">メール</p>
          <p class="text-sm font-medium text-gray-900 truncate">
            {user?.email}
          </p>
        </div>
      </div>

      <p class="text-gray-600">左のメニューから操作を選択してください。</p>
    </DashboardLayout>
  );
}
