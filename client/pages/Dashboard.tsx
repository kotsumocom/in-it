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
  { id: "1", name: "田中 太郎", email: "tanaka@example.com", plan: "Pro", status: "アクティブ" },
  { id: "2", name: "佐藤 花子", email: "sato@example.com", plan: "Starter", status: "アクティブ" },
  { id: "3", name: "鈴木 一郎", email: "suzuki@example.com", plan: "Free", status: "無効" },
  { id: "4", name: "高橋 美咲", email: "takahashi@example.com", plan: "Pro", status: "アクティブ" },
  { id: "5", name: "伊藤 健太", email: "ito@example.com", plan: "Starter", status: "アクティブ" },
];

const columns: DataTableColumn<User>[] = [
  { key: "name", label: "ユーザー" },
  { key: "email", label: "メール" },
  {
    key: "plan",
    label: "プラン",
    render: (v) => {
      const variant = v === "Pro" ? "info" : v === "Starter" ? "success" : "neutral";
      return <Badge variant={variant}>{v as string}</Badge>;
    },
  },
  {
    key: "status",
    label: "ステータス",
    render: (v) => (
      <Badge variant={v === "アクティブ" ? "success" : "neutral"}>{v as string}</Badge>
    ),
  },
];

export function DashboardPage() {
  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">ダッシュボード</h2>
          <p class="sc-page__desc">サービスの概要と主要指標</p>
        </div>
      </div>

      <div class="sc-stats-grid">
        <StatCard label="MRR" value="¥1,234,567" trend="+12.5%" trendUp={true} />
        <StatCard label="アクティブユーザー" value="3,847" trend="+5.2%" trendUp={true} />
        <StatCard label="解約率" value="1.8%" trend="-0.3%" trendUp={false} />
        <StatCard label="NPS スコア" value="72" trend="+4" trendUp={true} />
      </div>

      <section class="sc-section">
        <h3 class="sc-section__title">最近のサインアップ</h3>
        <Card outlined>
          <DataTable columns={columns} data={USERS} rowKey={(r) => r.id} />
        </Card>
      </section>
    </div>
  );
}
