import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";

interface ForgotPasswordData {
  error?: string;
  success?: boolean;
}

const APP_URL = Deno.env.get("APP_URL") || "https://in-it.ooo";

export const handler: Handlers<ForgotPasswordData> = {
  GET(_req, ctx) {
    return ctx.render({});
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email")?.toString() || "";

    if (!email) {
      return ctx.render({
        error: "メールアドレスを入力してください",
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${APP_URL}/reset-password`,
    });

    if (error) {
      return ctx.render({
        error:
          "リセットメールの送信に失敗しました。メールアドレスをご確認ください。",
      });
    }

    return ctx.render({ success: true });
  },
};

export default function ForgotPassword({
  data,
}: PageProps<ForgotPasswordData>) {
  const { error, success } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニット" class="h-8" />
          </a>
        </div>
      </header>

      <div class="flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900">
              パスワードをリセット
            </h1>
            <p class="text-gray-600 mt-2">
              登録済みのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
            </p>
          </div>

          {error && (
            <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {success ? (
            <div class="bg-white p-8 border border-gray-200">
              <div class="text-center">
                <div class="text-4xl mb-4">📧</div>
                <h2 class="text-lg font-bold text-gray-900 mb-2">
                  メールを送信しました
                </h2>
                <p class="text-gray-600 mb-6">
                  パスワードリセット用のリンクをメールで送信しました。メールをご確認ください。
                </p>
                <a
                  href="/login"
                  class="inline-block px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  ログインページへ戻る
                </a>
              </div>
            </div>
          ) : (
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

              <button
                type="submit"
                class="w-full py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                リセットリンクを送信
              </button>
            </form>
          )}

          <p class="mt-6 text-center">
            <a href="/login" class="text-sm text-blue-600 hover:underline">
              ← ログインページへ戻る
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
