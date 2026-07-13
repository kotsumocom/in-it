import { useState } from "hono/jsx";
import { Switch, Tabs, Dialog, Button, toast } from "@in-it/components/mod.ts";
import type { TabItem } from "@in-it/components/interactive/Tabs.tsx";

const TABS: TabItem[] = [
  { value: "general", label: "General" },
  { value: "security", label: "Security" },
  { value: "notifications", label: "Notifications" },
];

function GeneralTab() {
  return (
    <div>
      <Switch label="Maintenance Mode" description="Restrict access to admins only" />
      <Switch label="Audit Log" description="Record and store all operations" checked={true} />
      <Switch label="Auto Backup" description="Back up data daily at 3:00 AM" checked={true} />
      <Switch label="API Rate Limit" description="Limit to 100 requests per minute" />
    </div>
  );
}

function SecurityTab() {
  return (
    <div>
      <Switch label="Two-Factor Authentication" description="Require verification code on login" checked={true} />
      <Switch label="IP Allowlist" description="Allow access only from approved IP addresses" />
      <Switch label="Session Timeout" description="Auto logout after 30 minutes of inactivity" checked={true} />
      <Switch label="Password Policy" description="Require 8+ characters with uppercase, lowercase, and numbers" checked={true} />
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <Switch label="Email Notifications" description="Get notified about important changes via email" checked={true} />
      <Switch label="Slack Integration" description="Send notifications to a Slack channel" />
      <Switch label="Browser Notifications" description="Enable browser push notifications" />
      <Switch label="Weekly Report" description="Send a summary every Monday" checked={true} />
    </div>
  );
}

export function SettingsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    toast("Settings saved", "success");
  };

  const handleReset = () => {
    setConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setConfirmOpen(false);
    toast("Settings have been reset", "warning");
  };

  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">Settings</h2>
          <p class="sc-page__desc">Manage application settings</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="outlined" onClick={handleReset}>Reset</Button>
          <Button variant="filled" onClick={handleSave}>Save Settings</Button>
        </div>
      </div>

      <Tabs items={TABS} defaultValue="general">
        <GeneralTab />
        <SecurityTab />
        <NotificationsTab />
      </Tabs>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Reset Settings"
        description="All settings will be restored to defaults. This action cannot be undone."
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <Button variant="outlined" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="filled" onClick={handleConfirmReset}>Reset</Button>
        </div>
      </Dialog>
    </div>
  );
}
