import { UserProfile } from "@in-it/backend/services/auth.ts";

interface HeaderProps {
  user: UserProfile | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header class="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" class="flex items-center">
          <img src="/type.svg" alt="in-it" class="h-8" />
        </a>

        <nav class="flex items-center gap-4">
          <a
            href="/map"
            class="text-gray-300 hover:text-white transition-colors"
          >
            学習マップ
          </a>

          {user ? (
            <>
              <a
                href="/dashboard"
                class="text-gray-300 hover:text-white transition-colors"
              >
                {user.nickname || "マイページ"}
              </a>
              <a
                href="/logout"
                class="px-4 py-2 text-sm border border-gray-600 hover:border-red-400 hover:text-red-400 rounded-lg transition-colors"
              >
                ログアウト
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                class="px-4 py-2 text-sm border border-gray-500 hover:border-indigo-400 rounded-lg transition-colors"
              >
                ログイン
              </a>
              <a
                href="/signup"
                class="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                サインアップ
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
