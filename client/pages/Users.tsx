import { useState, useCallback } from "hono/jsx";
import { Badge, Button, DataTable, Dialog, Select, toast } from "@in-it/components/mod.ts";
import type { DataTableColumn } from "@in-it/components/ui/mod.tsx";
import type { SelectOption } from "@in-it/components/interactive/Select.tsx";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  createdAt: string;
}

const USERS: User[] = [
  { id: "1", name: "田中 太郎", email: "tanaka@example.com", plan: "Pro", status: "アクティブ", createdAt: "2025-01-15" },
  { id: "2", name: "佐藤 花子", email: "sato@example.com", plan: "Starter", status: "アクティブ", createdAt: "2025-02-20" },
  { id: "3", name: "鈴木 一郎", email: "suzuki@example.com", plan: "Free", status: "無効", createdAt: "2025-03-10" },
  { id: "4", name: "高橋 美咲", email: "takahashi@example.com", plan: "Pro", status: "アクティブ", createdAt: "2025-04-05" },
  { id: "5", name: "伊藤 健太", email: "ito@example.com", plan: "Starter", status: "アクティブ", createdAt: "2025-05-12" },
  { id: "6", name: "山田 次郎", email: "yamada@example.com", plan: "Pro", status: "アクティブ", createdAt: "2025-06-01" },
  { id: "7", name: "渡辺 さくら", email: "watanabe@example.com", plan: "Free", status: "保留", createdAt: "2025-06-20" },
  { id: "8", name: "中村 大輔", email: "nakamura@example.com", plan: "Starter", status: "アクティブ", createdAt: "2025-07-08" },
];

const PLAN_OPTIONS: SelectOption[] = [
  { value: "all", label: "すべてのプラン" },
  { value: "Pro", label: "Pro" },
  { value: "Starter", label: "Starter" },
  { value: "Free", label: "Free" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "すべてのステータス" },
  { value: "アクティブ", label: "アクティブ" },
  { value: "無効", label: "無効" },
  { value: "保留", label: "保留" },
];

const COLUMNS: DataTableColumn<User>[] = [
  { key: "name", header: "ユーザー" },
  { key: "email", header: "メール" },
  {
    key: "plan",
    header: "プラン",
    render: (_: string, row: User) => (
      <Badge variant={row.plan === "Pro" ? "primary" : row.plan === "Starter" ? "success" : "default"}>
        {row.plan}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "ステータス",
    render: (_: string, row: User) => (
      <Badge variant={row.status === "アクティブ" ? "success" : row.status === "無効" ? "error" : "warning"}>
        {row.status}
      </Badge>
    ),
  },
  { key: "createdAt", header: "登録日" },
];

export function UsersPage() {
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = USERS.filter((u) => {
    if (planFilter !== "all" && u.plan !== planFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  const handleDelete = useCallback(() => {
    if (deleteTarget) {
      toast(`${deleteTarget.name} を削除しました`, "success");
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">ユーザー管理</h2>
          <p class="sc-page__desc">{filtered.length} 名のユーザー</p>
        </div>
        <Button variant="filled" onClick={() => toast("招待メールを送信しました", "info")}>
          ＋ ユーザーを招待
        </Button>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "200px" }}>
          <Select options={PLAN_OPTIONS} value="all" label="プラン" onChange={setPlanFilter} />
        </div>
        <div style={{ width: "200px" }}>
          <Select options={STATUS_OPTIONS} value="all" label="ステータス" onChange={setStatusFilter} />
        </div>
      </div>

      <DataTable columns={COLUMNS} data={filtered} />

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="ユーザーを削除"
        description={deleteTarget ? `${deleteTarget.name}（${deleteTarget.email}）を削除しますか？この操作は取り消せません。` : ""}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>キャンセル</Button>
          <Button variant="filled" onClick={handleDelete}>削除</Button>
        </div>
      </Dialog>
    </div>
  );
}
