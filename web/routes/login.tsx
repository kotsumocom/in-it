import { Handlers, PageProps } from "$fresh/server.ts";
import { signIn } from "@in-it/backend/services/auth.ts";
import { State } from "./_middleware.ts";

interface LoginData {
  error?: string;
}

export const handler: Handlers<LoginData, State> = {
  GET(_req, ctx) {
    // 既にログイン済みの場合はダッシュボードへ
    if (ctx.state.user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard" },
      });
    }
    return ctx.render({});
  },

  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    if (!email || !password) {
      return ctx.render({
        error: "メールアドレスとパスワードを入力してください",
      });
    }

    const result = await signIn(email, password);

    if (!result.success) {
      return ctx.render({ error: result.error || "ログインに失敗しました" });
    }

    // セッションCookieを設定してダッシュボードへリダイレクト
    const headers = new Headers();
    headers.set("Location", "/dashboard");

    // アクセストークンをCookieに保存
    const cookieOptions = "Path=/; HttpOnly; SameSite=Lax; Max-Age=604800"; // 7日間
    headers.append(
      "Set-Cookie",
      `access_token=${result.session?.access_token}; ${cookieOptions}`
    );
    headers.append(
      "Set-Cookie",
      `refresh_token=${result.session?.refresh_token}; ${cookieOptions}`
    );

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};

export default function LoginPage({ data }: PageProps<LoginData>) {
  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <a
            href="/"
            class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
          >
            in-it
          </a>
          <p class="text-gray-400 mt-2">アカウントにログイン</p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          {data.error && (
            <div class="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {data.error}
            </div>
          )}

          <form method="POST" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                required
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                パスワード
              </label>
              <input
                type="password"
                name="password"
                required
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
            >
              ログイン
            </button>
          </form>

          <div class="mt-6 text-center text-gray-400">
            アカウントをお持ちでないですか？{" "}
            <a
              href="/signup"
              class="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              サインアップ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
