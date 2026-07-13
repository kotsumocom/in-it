import { useState } from "hono/jsx";
import { Badge, Button } from "~/components.ts";
import { Icon } from "@kotsumo/in-it/icons";

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "New user signed up", body: "alice@example.com joined the Pro plan.", time: "5 min ago", read: false, icon: "user-plus" },
  { id: "2", title: "Payment received", body: "Invoice INV-004 ($29.00) has been paid.", time: "1 hour ago", read: false, icon: "credit-card" },
  { id: "3", title: "Usage alert", body: "API calls have reached 85% of your monthly limit.", time: "3 hours ago", read: false, icon: "alert-triangle" },
  { id: "4", title: "New feature released", body: "Charts and analytics are now available in the dashboard.", time: "1 day ago", read: true, icon: "rocket" },
  { id: "5", title: "Scheduled maintenance", body: "System maintenance is planned for Saturday 2:00 AM UTC.", time: "2 days ago", read: true, icon: "settings" },
  { id: "6", title: "Team member invited", body: "bob@example.com was invited to join the team.", time: "3 days ago", read: true, icon: "users" },
];

export function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const filtered = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <>
      <div class="ii-admin-page__header">
        <div class="ii-admin-page__header-left">
          <h2 class="ii-admin-page__title">
            Notifications
            {unreadCount > 0 && <Badge variant="info">{unreadCount}</Badge>}
          </h2>
          <p class="ii-admin-page__desc">Stay up to date with your account activity.</p>
        </div>
        <div class="ii-admin-page__actions">
          <Button variant="text" onClick={() => setFilter(filter === "all" ? "unread" : "all")}>
            {filter === "all" ? "Show Unread" : "Show All"}
          </Button>
          {unreadCount > 0 && (
            <Button variant="outlined" onClick={markAllRead}>Mark All Read</Button>
          )}
        </div>
      </div>

      <div class="ii-notification-list">
        {filtered.length === 0 && (
          <div class="ii-placeholder">
            <div class="ii-placeholder__icon"><Icon name="bell-off" size={48} /></div>
            <p class="ii-placeholder__text">No notifications</p>
          </div>
        )}
        {filtered.map(n => (
          <div
            key={n.id}
            class={`ii-notification-item${n.read ? "" : " ii-notification-item--unread"}`}
            onClick={() => markRead(n.id)}
          >
            <div class="ii-notification-item__icon">
              <Icon name={n.icon} size={20} />
            </div>
            <div class="ii-notification-item__content">
              <div class="ii-notification-item__title">{n.title}</div>
              <div class="ii-notification-item__body">{n.body}</div>
              <div class="ii-notification-item__time">{n.time}</div>
            </div>
            {!n.read && <div class="ii-notification-item__dot" />}
          </div>
        ))}
      </div>
    </>
  );
}
