/**
 * ErrorPage — Full-page error display (404, 500, etc.)
 *
 * Usage:
 *   <ErrorPage code={404} title="Page Not Found" />
 *   <ErrorPage code={500} title="Server Error" description="Something went wrong." />
 */

import { t } from "../../locale.ts";
import { Button } from "./mod.tsx";

/** @internal CSS for ErrorPage — co-located for self-containment. */
export const ERROR_PAGE_CSS = `/* --- ErrorPage --- */
.ii-error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--ii-spacing-6);
  background: var(--ii-surface);
}
.ii-error-page__inner {
  text-align: center;
  max-width: 480px;
}
.ii-error-page__code {
  font-size: 6rem;
  font-weight: 800;
  color: var(--ii-primary);
  line-height: 1;
  opacity: 0.3;
}
.ii-error-page__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ii-on-surface);
  margin: var(--ii-spacing-2) 0;
}
.ii-error-page__desc {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  margin: 0 0 var(--ii-spacing-6);
}
`;

/** Props for ErrorPage. */
export interface ErrorPageProps {
  /** HTTP status code to display. */
  code: number;
  /** Error title. */
  title: string;
  /** Error description. */
  description?: string;
  /** Action button text. */
  actionLabel?: string;
  /** Action button callback or href. */
  onAction?: () => void;
  /** Additional CSS class. */
  class?: string;
}

/** Full-page error display with status code, title, and optional action. */
export function ErrorPage({
  code,
  title,
  description,
  actionLabel,
  onAction,
  class: cls,
}: ErrorPageProps): any {
  return (
    <div class={`ii-error-page${cls ? ` ${cls}` : ""}`}>
      <div class="ii-error-page__inner">
        <span class="ii-error-page__code">{code}</span>
        <h1 class="ii-error-page__title">{title}</h1>
        {description && <p class="ii-error-page__desc">{description}</p>}
        <Button variant="filled" onClick={onAction}>
          {actionLabel ?? t("goHome")}
        </Button>
      </div>
    </div>
  );
}
