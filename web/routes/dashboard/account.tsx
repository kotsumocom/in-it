import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import AccountSettings from "../../islands/AccountSettings.tsx";
import DeleteMentorButton from "../../islands/DeleteMentorButton.tsx";
import DashboardLayout from "../../components/DashboardLayout.tsx";

interface AccountData {
  user: State["user"];
  accessToken: string | null;
}

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export const handler: Handlers<AccountData, State> = {
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

export default function AccountPage({ data }: PageProps<AccountData>) {
  const { user, accessToken } = data;

  return (
    <DashboardLayout activeSection="account" user={user}>
      <h1 class="text-2xl font-bold text-gray-900 mb-8">登録情報の変更</h1>

      {/* 登録メールアドレス */}
      <section class="p-6 bg-white border border-gray-200 mb-8">
        <h2 class="text-lg font-bold text-gray-900 mb-4">登録メールアドレス</h2>
        <p class="text-gray-700">{user?.email}</p>
      </section>

      {/* アカウント設定（メール・パスワード変更） */}
      {accessToken && user && (
        <div class="mb-8">
          <AccountSettings
            accessToken={accessToken}
            currentEmail={user.email || ""}
          />
        </div>
      )}

      {/* デンジャーゾーン */}
      <section class="p-6 bg-white border border-red-200">
        <h2 class="text-lg font-bold text-red-600 mb-4">デンジャーゾーン</h2>
        <DeleteMentorButton accessToken={accessToken} />
      </section>
    </DashboardLayout>
  );
}
