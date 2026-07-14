/**
 * SettingsSection — Settings page section with title, description, and content.
 *
 * Usage:
 *   <SettingsSection title="Profile" description="Update your personal information.">
 *     <Input label="Name" value="John" />
 *   </SettingsSection>
 */

/** @internal CSS for SettingsSection — co-located for self-containment. */
export const SETTINGS_SECTION_CSS = `/* --- SettingsSection --- */
.ii-settings-section {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--ii-spacing-6);
  padding: var(--ii-spacing-6) 0;
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-settings-section:last-child {
  border-bottom: none;
}
.ii-settings-section__title {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
  margin: 0 0 var(--ii-spacing-1);
}
.ii-settings-section__desc {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin: 0;
}
.ii-settings-section__content {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-4);
}
.ii-settings-section__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ii-spacing-4);
}
@media (max-width: 768px) {
  .ii-settings-section {
    grid-template-columns: 1fr;
    gap: var(--ii-spacing-3);
  }
}
`;

/** Props for SettingsSection. */
export interface SettingsSectionProps {
  /** Section title. */
  title: string;
  /** Section description. */
  description?: string;
  /** Section content. */
  children: any;
  /** Additional CSS class. */
  class?: string;
}

/** Settings page section with heading and description. */
export function SettingsSection({
  title,
  description,
  children,
  class: cls,
}: SettingsSectionProps): any {
  return (
    <section class={`ii-settings-section${cls ? ` ${cls}` : ""}`}>
      <div class="ii-settings-section__header">
        <h3 class="ii-settings-section__title">{title}</h3>
        {description && <p class="ii-settings-section__desc">{description}</p>}
      </div>
      <div class="ii-settings-section__content">
        {children}
      </div>
    </section>
  );
}
