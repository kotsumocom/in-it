import { ComponentChildren } from "preact";

// サイドバーメニュー項目
const menuItems = [
  { id: "dashboard", label: "ダッシュボード", icon: "📊", href: "/dashboard" },
  {
    id: "profile",
    label: "プロフィール",
    icon: "👤",
    href: "/dashboard/profile",
  },
  { id: "spaces", label: "スペース", icon: "📦", href: "/dashboard/spaces" },
  {
    id: "account",
    label: "登録情報の変更",
    icon: "⚙️",
    href: "/dashboard/account",
  },
  {
    id: "referral",
    label: "招待クーポン",
    icon: "🎫",
    href: "/dashboard/referral",
  },
];

interface UserInfo {
  id: string;
  email?: string;
  mentor_profile?: {
    display_name?: string;
    avatar_url?: string | null;
  } | null;
}

interface DashboardLayoutProps {
  /** サイドメニューでハイライトするセクション */
  activeSection: string;
  /** ヘッダーに表示するユーザー情報（オプション） */
  user?: UserInfo | null;
  children: ComponentChildren;
}

export default function DashboardLayout({
  activeSection,
  user,
  children,
}: DashboardLayoutProps) {
  const profile = user?.mentor_profile;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/dashboard" class="flex items-center gap-2">
            <img src="/type.svg" alt="イニット" class="h-8" />
            <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium">
              メンター
            </span>
          </a>
          <nav class="flex items-center gap-4">
            {/* ユーザー情報 */}
            {user && (
              <a
                href="/dashboard/profile"
                class="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || "アバター"}
                    class="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <span class="text-sm text-gray-700 hidden sm:inline">
                  {profile?.display_name || "メンター"}
                </span>
              </a>
            )}
            <a href="/logout" class="text-gray-600 hover:text-gray-900 text-sm">
              ログアウト
            </a>
          </nav>
        </div>
      </header>

      <div class="max-w-7xl mx-auto flex">
        {/* 左サイドバー（デスクトップ） */}
        <aside class="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <nav class="p-4">
            <ul class="space-y-1">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    class={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* モバイルナビゲーション */}
        <div class="md:hidden w-full border-b border-gray-200 bg-white overflow-x-auto">
          <nav class="flex px-2 py-2 gap-1">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                class={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* メインコンテンツ */}
        <main class="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
