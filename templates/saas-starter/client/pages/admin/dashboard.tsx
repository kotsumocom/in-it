import { AdminShell, StatCard, UserMenu } from "@kotsumo/in-it/components";
import { Icon } from "@kotsumo/in-it/icons";
import { Route, Switch, useLocation } from "@kotsumo/in-it/router";
import { SettingsPage } from "./settings.tsx";
import { UsersPage } from "./users.tsx";
import { BillingPage } from "./billing.tsx";

const NAV = [
  { icon: (<Icon name="layout-dashboard" size={20} /> as any), label: "Dashboard", href: "/admin" },
  { icon: (<Icon name="users" size={20} /> as any), label: "Users", href: "/admin/users" },
  { icon: (<Icon name="credit-card" size={20} /> as any), label: "Billing", href: "/admin/billing" },
  { icon: (<Icon name="settings" size={20} /> as any), label: "Settings", href: "/admin/settings" },
];

function DashboardHome() {
  return (
    <>
      <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 600 }}>Dashboard</h2>
      <p style={{ margin: "0 0 24px", color: "var(--ii-on-surface-variant)" }}>Overview of your SaaS metrics.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <StatCard label="Total Users" value="1,234" trend="+12%" />
        <StatCard label="Revenue" value="$5,678" trend="+8%" />
        <StatCard label="Active Projects" value="42" />
        <StatCard label="Uptime" value="99.9%" />
      </div>

      <div style={{ background: "var(--ii-surface-container)", borderRadius: "var(--ii-shape-md)", padding: "48px", textAlign: "center", color: "var(--ii-on-surface-variant)" }}>
        <Icon name="chart-bar" size={48} />
        <p style={{ marginTop: "12px" }}>Charts and detailed analytics will go here.</p>
        <p style={{ fontSize: "0.75rem" }}>Integrate with your preferred charting library.</p>
      </div>
    </>
  );
}

export function AdminApp() {
  const [path, navigate] = useLocation();

  const userMenu = (
    <UserMenu
      name="John Doe"
      email="john@example.com"
      items={[
        { label: "Settings", icon: <Icon name="settings" size={16} />, onClick: () => navigate("/admin/settings") },
        { divider: true },
        { label: "Sign Out", icon: <Icon name="logout" size={16} />, onClick: () => window.location.href = "/login" },
      ]}
    />
  );

  return (
    <AdminShell
      brand="My SaaS"
      navItems={NAV}
      currentPath={path}
      onNavigate={navigate}
      headerActions={userMenu}
    >
      <Switch>
        <Route path="/admin" component={DashboardHome} />
        <Route path="/admin/users" component={UsersPage} />
        <Route path="/admin/billing" component={BillingPage} />
        <Route path="/admin/settings" component={SettingsPage} />
      </Switch>
    </AdminShell>
  );
}
