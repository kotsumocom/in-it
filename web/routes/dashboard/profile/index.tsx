import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import DashboardLayout from "../../../components/DashboardLayout.tsx";

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

interface ProfileData {
  user: State["user"];
  accessToken: string | null;
}

export const handler: Handlers<ProfileData, State> = {
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
};

export default function ProfilePage({ data }: PageProps<ProfileData>) {
  const { user } = data;
  const profile = user?.mentor_profile;

  return (
    <DashboardLayout activeSection="profile" user={user}>
      <h1 class="text-2xl font-bold text-gray-900 mb-8">プロフィール</h1>
      <div class="bg-white border border-gray-200 p-6">
        <div class="flex items-center gap-4 mb-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || "アバター"}
              class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
          <div>
            <h2 class="text-lg font-bold text-gray-900">
              {profile?.display_name || "未設定"}
            </h2>
            <p class="text-gray-600">{user?.email}</p>
          </div>
        </div>
        <a
          href="/dashboard/profile/edit"
          class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          プロフィールを編集
        </a>
      </div>
    </DashboardLayout>
  );
}
