import { StatCard, Badge, Card, DataTable } from "@in-it/components/mod.ts";
import type { DataTableColumn } from "@in-it/components/ui/mod.tsx";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
}

const USERS: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", plan: "Pro", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", plan: "Starter", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", plan: "Free", status: "Inactive" },
  { id: "4", name: "Diana Lee", email: "diana@example.com", plan: "Pro", status: "Active" },
  { id: "5", name: "Eric Davis", email: "eric@example.com", plan: "Starter", status: "Active" },
];

const columns: DataTableColumn<User>[] = [
  { key: "name", label: "User" },
  { key: "email", label: "Email" },
  {
    key: "plan",
    label: "Plan",
    render: (v) => {
      const variant = v === "Pro" ? "info" : v === "Starter" ? "success" : "neutral";
      return <Badge variant={variant}>{v as string}</Badge>;
    },
  },
  {
    key: "status",
    label: "Status",
    render: (v) => (
      <Badge variant={v === "Active" ? "success" : "neutral"}>{v as string}</Badge>
    ),
  },
];

export function DashboardPage() {
  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">Dashboard</h2>
          <p class="sc-page__desc">Service overview and key metrics</p>
        </div>
      </div>

      <div class="sc-stats-grid">
        <StatCard label="MRR" value="$12,345" trend="+12.5%" trendUp={true} />
        <StatCard label="Active Users" value="3,847" trend="+5.2%" trendUp={true} />
        <StatCard label="Churn Rate" value="1.8%" trend="-0.3%" trendUp={false} />
        <StatCard label="NPS Score" value="72" trend="+4" trendUp={true} />
      </div>

      <section class="sc-section">
        <h3 class="sc-section__title">Recent Sign-ups</h3>
        <Card outlined>
          <DataTable columns={columns} data={USERS} rowKey={(r) => r.id} />
        </Card>
      </section>
    </div>
  );
}
