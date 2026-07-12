import { render } from "hono/jsx/dom";
import { AdminShell, Menu, ToastContainer } from "@in-it/components/mod.ts";
import { Route, Switch, useLocation } from "./router.tsx";
import { DashboardPage } from "./pages/Dashboard.tsx";
import { SettingsPage } from "./pages/Settings.tsx";
import type { NavItem } from "@in-it/components/admin/AdminShell.tsx";
import type { MenuItemDef } from "@in-it/components/interactive/Menu.tsx";

const NAV_ITEMS: NavItem[] = [
  { icon: "📊", label: "概要", href: "/admin" },
  { icon: "👥", label: "ユーザー", href: "/admin/users" },
  { icon: "📁", label: "プロジェクト", href: "/admin/projects" },
  { icon: "⚙️", label: "設定", href: "/admin/settings" },
];

const USER_MENU: MenuItemDef[] = [
  { id: "profile", label: "プロフィール", icon: "👤" },
  { id: "settings", label: "個人設定", icon: "⚙️" },
  { id: "logout", label: "ログアウト", icon: "🚪", separator: true },
];

function UsersPage() {
  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">ユーザー管理</h2>
          <p class="sc-page__desc">ユーザーの管理と権限設定</p>
        </div>
      </div>
      <p style={{ color: "var(--sc-on-surface-variant)" }}>ユーザー管理ページ（準備中）</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h2 class="sc-page__title">ページが見つかりません</h2>
      <p class="sc-page__desc" style={{ marginTop: "8px" }}>
        このページは準備中です。
      </p>
    </div>
  );
}

function App() {
  const [path, navigate] = useLocation();

  return (
    <>
      <AdminShell brand="in-it Demo" navItems={NAV_ITEMS} currentPath={path} onNavigate={navigate}>
        <Switch>
          <Route path="/admin" component={DashboardPage} />
          <Route path="/admin/users" component={UsersPage} />
          <Route path="/admin/settings" component={SettingsPage} />
          <Route path="/admin/:page" component={NotFound} />
        </Switch>
      </AdminShell>
      <ToastContainer position="top-right" />
    </>
  );
}

const root = document.getElementById("app");
if (root) {
  render(<App />, root);
}
