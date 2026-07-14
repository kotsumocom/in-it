/**
 * SettingsSection — Settings page section with title, description, and content.
 *
 * Usage:
 *   <SettingsSection title="Profile" description="Update your personal information.">
 *     <Input label="Name" value="John" />
 *   </SettingsSection>
 */

/** Props for SettingsSection. */
import { SETTINGS_SECTION_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
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
  injectCSS("ii-settings", SETTINGS_SECTION_CSS);
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
