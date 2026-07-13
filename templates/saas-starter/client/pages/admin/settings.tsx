import { SettingsSection, Switch, ThemeToggle, Button } from "~/components.ts";

export function SettingsPage() {
  return (
    <>
      <div class="ii-admin-page__header">
        <div class="ii-admin-page__header-left">
          <h2 class="ii-admin-page__title">Settings</h2>
          <p class="ii-admin-page__desc">Manage your account and preferences.</p>
        </div>
      </div>

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
        <div class="ii-settings-section__row">
          <span>Theme</span>
          <ThemeToggle />
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications" description="Choose what you want to be notified about.">
        <div class="ii-settings-section__row">
          <span>Email notifications</span>
          <Switch label="Email notifications" />
        </div>
        <div class="ii-settings-section__row">
          <span>Marketing emails</span>
          <Switch label="Marketing emails" />
        </div>
      </SettingsSection>

      <SettingsSection title="Danger Zone" description="Irreversible actions.">
        <div class="ii-settings-section__row">
          <div>
            <strong>Delete Account</strong>
            <p class="ii-admin-page__desc">Once you delete your account, there is no going back.</p>
          </div>
          <Button variant="outlined" class="ii-btn--danger">Delete Account</Button>
        </div>
      </SettingsSection>
    </>
  );
}
