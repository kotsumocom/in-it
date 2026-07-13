import { DataTable, Badge, Button } from "~/components.ts";
import { Icon } from "@kotsumo/in-it/icons";
import type { DataTableColumn } from "@kotsumo/in-it/components";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joined: string;
}

const SAMPLE_USERS: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active", joined: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "User", status: "active", joined: "2024-02-20" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "User", status: "inactive", joined: "2024-03-10" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Editor", status: "active", joined: "2024-04-05" },
  { id: "5", name: "Eve Davis", email: "eve@example.com", role: "User", status: "active", joined: "2024-05-22" },
];

const COLUMNS: DataTableColumn<User>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  {
    key: "status",
    label: "Status",
    render: (u) => (
      <Badge variant={u.status === "active" ? "success" : "default"}>
        {u.status}
      </Badge>
    ),
  },
  { key: "joined", label: "Joined" },
];

export function UsersPage() {
  return (
    <>
      <div class="ii-admin-page__header">
        <div class="ii-admin-page__header-left">
          <h2 class="ii-admin-page__title">Users</h2>
          <p class="ii-admin-page__desc">{SAMPLE_USERS.length} total users</p>
        </div>
        <div class="ii-admin-page__actions">
          <Button variant="filled">
            <Icon name="plus" size={16} /> Add User
          </Button>
        </div>
      </div>

      <DataTable data={SAMPLE_USERS} columns={COLUMNS} />
    </>
  );
}
