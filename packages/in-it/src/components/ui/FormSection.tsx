/**
 * FormSection — Form section with title, optional description, and content.
 *
 * Groups related form fields under a heading, similar to SettingsSection
 * but designed for form layouts (vertical stacking, no grid).
 *
 * @example
 * ```tsx
 * <FormSection title="Basic Info" description="Enter the basic information.">
 *   <Input label="Name" ... />
 *   <Input label="Date" ... />
 * </FormSection>
 * ```
 */
import { injectCSS } from "../../inject.ts";

/** @internal CSS for FormSection — co-located for self-containment. */
export const FORM_SECTION_CSS = `/* --- FormSection --- */
.ii-form-section {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-3);
}
.ii-form-section + .ii-form-section {
  padding-top: var(--ii-spacing-4);
  border-top: 1px solid var(--ii-outline-variant);
}
.ii-form-section__title {
  font-size: var(--ii-font-md);
  font-weight: 600;
  color: var(--ii-on-surface);
  margin: 0;
}
.ii-form-section__desc {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin: 0;
}
.ii-form-section__content {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-3);
}
`;

/** Props for the {@link FormSection} component. */
export interface FormSectionProps {
  /** Section heading text. */
  title: string;
  /** Optional description below the title. */
  description?: string;
  /** Form fields and content. */
  children: any;
  /** Additional CSS class. */
  class?: string;
}

/**
 * Form section with heading, optional description, and grouped content.
 * Consecutive FormSections are separated by a border.
 */
export function FormSection({
  title,
  description,
  children,
  class: cls,
}: FormSectionProps): any {
  injectCSS("ii-form-section", FORM_SECTION_CSS);
  return (
    <section class={`ii-form-section${cls ? ` ${cls}` : ""}`}>
      <div>
        <h3 class="ii-form-section__title">{title}</h3>
        {description && <p class="ii-form-section__desc">{description}</p>}
      </div>
      <div class="ii-form-section__content">
        {children}
      </div>
    </section>
  );
}
