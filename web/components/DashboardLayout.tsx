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

interface DashboardLayoutProps {
  /** サイドメニューでハイライトするセクション */
  activeSection: string;
  children: ComponentChildren;
}

export default function DashboardLayout({
  activeSection,
  children,
}: DashboardLayoutProps) {
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
            <a href="/logout" class="text-gray-600 hover:text-gray-900">
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
