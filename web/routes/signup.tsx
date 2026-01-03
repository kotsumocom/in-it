import { Handlers, PageProps } from "$fresh/server.ts";
import { signUp } from "@in-it/backend/services/auth.ts";

interface SignUpData {
  error?: string;
  success?: boolean;
}

export const handler: Handlers<SignUpData> = {
  GET(_req, ctx) {
    return ctx.render({});
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";
    const confirmPassword = form.get("confirmPassword")?.toString() || "";
    const displayName = form.get("displayName")?.toString() || "";

    const agreeTerms = form.get("agreeTerms") === "on";

    // バリデーション
    if (!email || !password || !displayName) {
      return ctx.render({ error: "必須項目を入力してください" });
    }

    if (password.length < 8) {
      return ctx.render({ error: "パスワードは8文字以上で入力してください" });
    }

    if (password !== confirmPassword) {
      return ctx.render({ error: "パスワードが一致しません" });
    }

    if (!agreeTerms) {
      return ctx.render({ error: "利用規約に同意してください" });
    }

    // ユーザー登録
    const result = await signUp(email, password, displayName);

    if (!result.success) {
      return ctx.render({ error: result.error || "登録に失敗しました" });
    }

    // セッションがあればCookieに保存してダッシュボードへリダイレクト
    if (result.session) {
      const headers = new Headers();
      headers.set(
        "Set-Cookie",
        `access_token=${result.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`
      );
      headers.set("Location", "/dashboard");
      return new Response(null, { status: 303, headers });
    }

    // メール確認が必要な場合
    return ctx.render({ success: true });
  },
};

export default function SignUp({ data }: PageProps<SignUpData>) {
  const { error, success } = data;

  if (success) {
    return (
      <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div class="max-w-md w-full bg-white p-8 border border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900 mb-4 text-center">
            確認メールを送信しました
          </h1>
          <p class="text-gray-600 text-center mb-6">
            メールに記載されたリンクをクリックして、登録を完了してください。
          </p>
          <a
            href="/login"
            class="block w-full text-center py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            ログインページへ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <a href="/" class="text-xl font-bold text-blue-600">
            in-it
          </a>
        </div>
      </header>

      <div class="flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full">
          <h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">
            in-it
          </h1>
          <p class="text-gray-600 mb-8 text-center">メンターとして登録</p>

          {error && (
            <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <form method="POST" class="bg-white p-8 border border-gray-200">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                表示名 <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                required
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="山田太郎"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span class="text-red-500">*</span>
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
                パスワード（8文字以上） <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                パスワード（確認） <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                class="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div class="mb-6">
              <label class="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  required
                  class="mt-1"
                />
                <span class="text-sm text-gray-600">
                  <a href="/terms" class="text-blue-600 hover:underline">
                    利用規約
                  </a>
                  および
                  <a href="/privacy" class="text-blue-600 hover:underline">
                    プライバシーポリシー
                  </a>
                  に同意します
                </span>
              </label>
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              アカウント作成
            </button>
          </form>

          <p class="mt-6 text-center text-gray-600">
            既にアカウントをお持ちの方は{" "}
            <a href="/login" class="text-blue-600 hover:underline">
              ログイン
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
