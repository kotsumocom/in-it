import { render } from "hono/jsx/dom";
import { AdminShell, ToastContainer } from "@kotsumo/in-it/components";
import { useLocation } from "@kotsumo/in-it/router";

function Dashboard() {
  return (
    <div>
      <h2 class="sc-page__title">Dashboard</h2>
      <p class="sc-page__desc">Start building your SaaS from here</p>
    </div>
  );
}

const NAV = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
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
