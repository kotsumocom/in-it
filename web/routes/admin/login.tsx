import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import { signIn } from "@in-it/backend/services/auth.ts";

interface LoginData {
  error?: string;
}

export const handler: Handlers<LoginData, State> = {
  GET(_req, ctx) {
    // 既にログイン済みで管理者なら /admin にリダイレクト
    if (ctx.state.user?.is_admin) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin" },
      });
    }
    return ctx.render({});
  },

  async POST(req, ctx) {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn(email, password);

    if (!result.success || !result.session) {
      return ctx.render({ error: result.error || "ログインに失敗しました" });
    }

    // Cookie にトークンを保存
    const headers = new Headers();
    headers.set("Location", "/admin");
    headers.set(
      "Set-Cookie",
      `access_token=${result.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    );

    return new Response(null, { status: 302, headers });
  },
};

export default function AdminLoginPage({ data }: PageProps<LoginData>) {
  const { error } = data;

  return (
    <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-white mb-2">イニット Admin</h1>
          <p class="text-gray-400">管理者ログイン</p>
        </div>

        {error && (
          <div class="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-300">
            {error}
          </div>
        )}

        <form method="POST" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              required
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              required
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            ログイン
          </button>
        </form>

        <div class="mt-6 text-center">
          <a href="/login" class="text-gray-400 hover:text-white text-sm">
            メンターログインはこちら
          </a>
        </div>
      </div>
    </div>
  );
}
