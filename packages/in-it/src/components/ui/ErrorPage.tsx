/**
 * ErrorPage — Full-page error display (404, 500, etc.)
 *
 * Usage:
 *   <ErrorPage code={404} title="Page Not Found" />
 *   <ErrorPage code={500} title="Server Error" description="Something went wrong." />
 */

/** Props for ErrorPage. */
import { ERROR_PAGE_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
import { t } from "../../locale.ts";
import { Button } from "./mod.tsx";
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
  injectCSS("ii-error-page", ERROR_PAGE_CSS);
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
