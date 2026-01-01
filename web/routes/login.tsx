import { Handlers, PageProps } from "$fresh/server.ts";
import { signIn } from "@in-it/backend/services/auth.ts";

interface LoginData {
  error?: string;
}

export const handler: Handlers<LoginData> = {
  GET(_req, ctx) {
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

    // CookieにセチE��ョンを保存してダチE��ュボ�EドへリダイレクチE
    const headers = new Headers();
    headers.set(
      "Set-Cookie",
      `access_token=${
        result.session!.access_token
      }; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
    );
    headers.set("Location", "/dashboard");
    return new Response(null, { status: 303, headers });
  },
};

export default function Login({ data }: PageProps<LoginData>) {
  const { error } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="in-it" class="h-8" />
          </a>
        </div>
      </header>

      <div class="flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full">
          <div class="text-center mb-8">
            <img src="/type.svg" alt="in-it" class="h-12 mx-auto mb-4" />
            <p class="text-gray-600">メンター向けログイン</p>
          </div>

          {error && (
            <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <form method="POST" class="bg-white p-8 border border-gray-200">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="email@example.com"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                パスワーチE
              </label>
              <input
                type="password"
                name="password"
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              ログイン
            </button>

            <p class="mt-4 text-center">
              <a
                href="/forgot-password"
                class="text-sm text-blue-600 hover:underline"
              >
                パスワードを忘れた方
              </a>
            </p>
          </form>

          <p class="mt-6 text-center text-gray-600">
            アカウントをお持ちでなぁE��は{" "}
            <a href="/signup" class="text-blue-600 hover:underline">
              新規登録
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
