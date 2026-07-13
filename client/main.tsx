import { render } from "hono/jsx/dom";
import { AdminShell, ToastContainer } from "@in-it/components/mod.ts";
import { Route, Switch, useLocation } from "@in-it/router.tsx";
import { DashboardPage } from "./pages/Dashboard.tsx";
import { SettingsPage } from "./pages/Settings.tsx";
import { UsersPage } from "./pages/Users.tsx";
import type { NavItem } from "@in-it/components/admin/AdminShell.tsx";

const NAV_ITEMS: NavItem[] = [
  { icon: "📊", label: "Overview", href: "/admin" },
  { icon: "👥", label: "Users", href: "/admin/users" },
  { icon: "📁", label: "Projects", href: "/admin/projects" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h2 class="sc-page__title">Page Not Found</h2>
      <p class="sc-page__desc" style={{ marginTop: "8px" }}>
        This page is under construction.
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
