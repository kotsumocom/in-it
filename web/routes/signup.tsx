import { Handlers, PageProps } from "$fresh/server.ts";
import { signUp } from "@in-it/backend/services/auth.ts";
import { State } from "./_middleware.ts";

interface SignupData {
  error?: string;
}

export const handler: Handlers<SignupData, State> = {
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
    const nickname = form.get("nickname")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";
    const passwordConfirm = form.get("password_confirm")?.toString() || "";

    if (!nickname || !email || !password || !passwordConfirm) {
      return ctx.render({ error: "すべての項目を入力してください" });
    }

    if (password !== passwordConfirm) {
      return ctx.render({ error: "パスワードが一致しません" });
    }

    if (password.length < 6) {
      return ctx.render({ error: "パスワードは6文字以上で入力してください" });
    }

    const result = await signUp(email, password, nickname);

    if (!result.success) {
      return ctx.render({
        error: result.error || "サインアップに失敗しました",
      });
    }

    // セッションがある場合はCookieを設定
    if (result.session) {
      const headers = new Headers();
      headers.set("Location", "/dashboard");

      const cookieOptions = "Path=/; HttpOnly; SameSite=Lax; Max-Age=604800";
      headers.append(
        "Set-Cookie",
        `access_token=${result.session.access_token}; ${cookieOptions}`
      );
      headers.append(
        "Set-Cookie",
        `refresh_token=${result.session.refresh_token}; ${cookieOptions}`
      );

      return new Response(null, {
        status: 302,
        headers,
      });
    }

    // メール確認が必要な場合
    return ctx.render({
      error: "確認メールを送信しました。メールをご確認ください。",
    });
  },
};

export default function SignupPage({ data }: PageProps<SignupData>) {
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
          <p class="text-gray-400 mt-2">新規アカウント作成</p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          {data.error && (
            <div
              class={`px-4 py-3 rounded-lg mb-6 ${
                data.error.includes("確認メール")
                  ? "bg-green-500/20 border border-green-500 text-green-300"
                  : "bg-red-500/20 border border-red-500 text-red-300"
              }`}
            >
              {data.error}
            </div>
          )}

          <form method="POST" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                ニックネーム
              </label>
              <input
                type="text"
                name="nickname"
                required
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="表示名"
              />
            </div>

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
                minLength={6}
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="6文字以上"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                name="password_confirm"
                required
                minLength={6}
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="もう一度入力"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
            >
              サインアップ
            </button>
          </form>

          <div class="mt-6 text-center text-gray-400">
            既にアカウントをお持ちですか？{" "}
            <a
              href="/login"
              class="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              ログイン
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
