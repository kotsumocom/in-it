import { SettingsSection, Switch, ThemeToggle, Button } from "@kotsumo/in-it/components";

export function SettingsPage() {
  return (
    <>
      <h2 style={{ margin: "0 0 8px", fontSize: "1.25rem", fontWeight: 600 }}>Settings</h2>
      <p style={{ margin: "0 0 24px", color: "var(--ii-on-surface-variant)" }}>Manage your account and preferences.</p>

      <SettingsSection title="Profile" description="Update your personal information.">
        <div class="ii-input-field">
          <label class="ii-input-field__label" for="settings-name">Name</label>
          <input id="settings-name" type="text" class="ii-input" value="John Doe" />
        </div>
        <div class="ii-input-field">
          <label class="ii-input-field__label" for="settings-email">Email</label>
          <input id="settings-email" type="email" class="ii-input" value="john@example.com" />
        </div>
        <div>
          <Button variant="filled">Save Changes</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Appearance" description="Customize how the app looks.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Theme</span>
          <ThemeToggle />
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications" description="Choose what you want to be notified about.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Email notifications</span>
          <Switch label="Email notifications" />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Marketing emails</span>
          <Switch label="Marketing emails" />
        </div>
      </SettingsSection>

      <SettingsSection title="Danger Zone" description="Irreversible actions.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <strong>Delete Account</strong>
            <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--ii-on-surface-variant)" }}>
              Once you delete your account, there is no going back.
            </p>
          </div>
          <Button variant="outlined" class="ii-btn--danger">Delete Account</Button>
        </div>
      </SettingsSection>
    </>
  );
}
