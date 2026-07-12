import { render } from "hono/jsx/dom";
import { AdminShell, ToastContainer } from "@kotsumo/in-it/components";
import { useLocation } from "@kotsumo/in-it/router";

function Dashboard() {
  return (
    <div>
      <h2 class="sc-page__title">ダッシュボード</h2>
      <p class="sc-page__desc">ここから SaaS を構築しましょう</p>
    </div>
  );
}

const NAV = [
  { icon: "📊", label: "概要", href: "/admin" },
  { icon: "⚙️", label: "設定", href: "/admin/settings" },
];

function App() {
  const [path, navigate] = useLocation();

  return (
    <>
      <AdminShell brand="My SaaS" navItems={NAV} currentPath={path} onNavigate={navigate}>
        <Dashboard />
      </AdminShell>
      <ToastContainer />
    </>
  );
}

render(<App />, document.getElementById("app")!);
