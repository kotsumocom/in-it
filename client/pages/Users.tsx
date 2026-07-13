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
  { id: "1", name: "Alice Johnson", email: "alice@example.com", plan: "Pro", status: "Active", createdAt: "2025-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", plan: "Starter", status: "Active", createdAt: "2025-02-20" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", plan: "Free", status: "Inactive", createdAt: "2025-03-10" },
  { id: "4", name: "Diana Lee", email: "diana@example.com", plan: "Pro", status: "Active", createdAt: "2025-04-05" },
  { id: "5", name: "Eric Davis", email: "eric@example.com", plan: "Starter", status: "Active", createdAt: "2025-05-12" },
  { id: "6", name: "Frank Wilson", email: "frank@example.com", plan: "Pro", status: "Active", createdAt: "2025-06-01" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", plan: "Free", status: "Pending", createdAt: "2025-06-20" },
  { id: "8", name: "Henry Park", email: "henry@example.com", plan: "Starter", status: "Active", createdAt: "2025-07-08" },
];

const PLAN_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Plans" },
  { value: "Pro", label: "Pro" },
  { value: "Starter", label: "Starter" },
  { value: "Free", label: "Free" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Pending", label: "Pending" },
];

const COLUMNS: DataTableColumn<User>[] = [
  { key: "name", header: "User" },
  { key: "email", header: "Email" },
  {
    key: "plan",
    header: "Plan",
    render: (_: string, row: User) => (
      <Badge variant={row.plan === "Pro" ? "primary" : row.plan === "Starter" ? "success" : "default"}>
        {row.plan}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (_: string, row: User) => (
      <Badge variant={row.status === "Active" ? "success" : row.status === "Inactive" ? "error" : "warning"}>
        {row.status}
      </Badge>
    ),
  },
  { key: "createdAt", header: "Joined" },
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
      toast(`${deleteTarget.name} has been deleted`, "success");
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">User Management</h2>
          <p class="sc-page__desc">{filtered.length} users</p>
        </div>
        <Button variant="filled" onClick={() => toast("Invitation email sent", "info")}>
          + Invite User
        </Button>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ width: "200px" }}>
          <Select options={PLAN_OPTIONS} value="all" label="Plan" onChange={setPlanFilter} />
        </div>
        <div style={{ width: "200px" }}>
          <Select options={STATUS_OPTIONS} value="all" label="Status" onChange={setStatusFilter} />
        </div>
      </div>

      <DataTable columns={COLUMNS} data={filtered} />

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
        description={deleteTarget ? `Are you sure you want to delete ${deleteTarget.name} (${deleteTarget.email})? This action cannot be undone.` : ""}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="filled" onClick={handleDelete}>Delete</Button>
        </div>
      </Dialog>
    </div>
  );
}
