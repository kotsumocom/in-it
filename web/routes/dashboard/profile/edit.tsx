import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../../_middleware.ts";
import AvatarUploader from "../../../islands/AvatarUploader.tsx";
import DashboardLayout from "../../../components/DashboardLayout.tsx";

interface ProfileEditData {
  user: State["user"];
  accessToken: string | null;
  error?: string;
}

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export const handler: Handlers<ProfileEditData, State> = {
  GET(req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const cookies = req.headers.get("cookie") || "";
    const accessToken = getCookie(cookies, "access_token");

    return ctx.render({
      user: ctx.state.user,
      accessToken,
    });
  },

  async POST(req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const form = await req.formData();
    const displayName = form.get("displayName")?.toString() || "";

    const cookies = req.headers.get("cookie") || "";
    const accessToken = getCookie(cookies, "access_token");

    if (!displayName) {
      return ctx.render({
        user: ctx.state.user,
        accessToken,
        error: "表示名は必須です",
      });
    }

    const { error } = await supabase
      .from("mentor_profiles")
      .update({
        display_name: displayName,
      })
      .eq("id", ctx.state.user.id);

    if (error) {
      return ctx.render({
        user: ctx.state.user,
        accessToken,
        error: "保存に失敗しました: " + error.message,
      });
    }

    return new Response(null, {
      status: 303,
      headers: { Location: "/dashboard/profile?saved=1" },
    });
  },
};

export default function ProfileEditPage({ data }: PageProps<ProfileEditData>) {
  const { user, accessToken, error } = data;
  const profile = user?.mentor_profile;

  return (
    <DashboardLayout activeSection="profile" user={user}>
      <h1 class="text-2xl font-bold text-gray-900 mb-8">プロフィール編集</h1>

      {error && (
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* プロフィール画像（Island） */}
      {accessToken && user && (
        <section class="p-6 bg-white border border-gray-200 mb-8">
          <h2 class="text-lg font-bold text-gray-900 mb-4">プロフィール画像</h2>
          <AvatarUploader
            accessToken={accessToken}
            userId={user.id}
            currentAvatarUrl={profile?.avatar_url || null}
          />
        </section>
      )}

      <form method="POST" class="space-y-8">
        <section class="p-6 bg-white border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4">基本情報</h2>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              表示名 <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="displayName"
              value={profile?.display_name || ""}
              required
              class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </section>

        <div class="flex gap-4">
          <a
            href="/dashboard/profile"
            class="flex-1 py-4 text-center text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </a>
          <button
            type="submit"
            class="flex-1 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            保存する
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
