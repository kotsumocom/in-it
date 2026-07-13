import { AdminShell, StatCard, UserMenu, BarChart, LineChart, DonutChart, SparkLine } from "~/components.ts";
import { Icon } from "@kotsumo/in-it/icons";
import { Route, Switch, useLocation } from "@kotsumo/in-it/router";
import { SettingsPage } from "./settings.tsx";
import { UsersPage } from "./users.tsx";
import { BillingPage } from "./billing.tsx";
import { NotificationsPage } from "./notifications.tsx";

const NAV = [
  { icon: (<Icon name="layout-dashboard" size={20} /> as any), label: "Dashboard", href: "/admin" },
  { icon: (<Icon name="users" size={20} /> as any), label: "Users", href: "/admin/users" },
  { icon: (<Icon name="bell" size={20} /> as any), label: "Notifications", href: "/admin/notifications" },
  { icon: (<Icon name="credit-card" size={20} /> as any), label: "Billing", href: "/admin/billing" },
  { icon: (<Icon name="settings" size={20} /> as any), label: "Settings", href: "/admin/settings" },
];

function DashboardHome() {
  return (
    <>
      <div class="ii-admin-page__header">
        <div class="ii-admin-page__header-left">
          <h2 class="ii-admin-page__title">Dashboard</h2>
          <p class="ii-admin-page__desc">Overview of your SaaS metrics.</p>
        </div>
      </div>

      <div class="ii-stat-grid">
        <StatCard label="Total Users" value="1,234" trend="+12%">
          <SparkLine data={[800, 920, 980, 1050, 1120, 1180, 1234]} variant="success" />
        </StatCard>
        <StatCard label="Revenue" value="$5,678" trend="+8%">
          <SparkLine data={[3200, 3800, 4100, 4500, 4900, 5200, 5678]} variant="success" />
        </StatCard>
        <StatCard label="Active Projects" value="42" />
        <StatCard label="Churn Rate" value="1.8%" trend="-0.3%">
          <SparkLine data={[3.2, 2.8, 2.5, 2.2, 2.0, 1.9, 1.8]} variant="success" />
        </StatCard>
      </div>

      <div class="ii-stat-grid">
        <div class="ii-card" style={{ gridColumn: "span 2" }}>
          <div class="ii-card__body">
            <h3 class="ii-admin-page__title">Monthly Revenue</h3>
            <BarChart
              data={[3200, 3800, 4100, 4500, 4900, 5200, 5678]}
              labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
              height={220}
            />
          </div>
        </div>
        <div class="ii-card">
          <div class="ii-card__body">
            <h3 class="ii-admin-page__title">Users by Plan</h3>
            <DonutChart
              data={[
                { label: "Pro", value: 45 },
                { label: "Free", value: 30 },
                { label: "Enterprise", value: 25 },
              ]}
              size={140}
              centerValue="1,234"
              centerLabel="Total"
            />
          </div>
        </div>
      </div>

      <div class="ii-card">
        <div class="ii-card__body">
          <h3 class="ii-admin-page__title">User Growth</h3>
          <LineChart
            data={[120, 250, 380, 520, 680, 850, 1050, 1234]}
            labels={["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            height={200}
            area
          />
        </div>
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
        <Route path="/admin/notifications" component={NotificationsPage} />
        <Route path="/admin/billing" component={BillingPage} />
        <Route path="/admin/settings" component={SettingsPage} />
      </Switch>
    </AdminShell>
  );
}
