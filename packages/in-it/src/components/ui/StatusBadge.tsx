
import { Badge } from "./Badge.tsx";
import type { BadgeProps } from "./Badge.tsx";

/**
 * Configuration for a single status entry.
 * Maps a status key to its display label and visual variant.
 */
export interface StatusDef {
  /** Display label for this status. */
  label: string;
  /** Badge variant for color-coding. */
  variant: BadgeProps["variant"];
}

/**
 * Status configuration map.
 * Keys are status string identifiers, values define how to render them.
 *
 * @example
 * ```ts
 * const STATUSES: StatusConfig = {
 *   draft: { label: "Draft", variant: "neutral" },
 *   approved: { label: "Approved", variant: "success" },
 *   rejected: { label: "Rejected", variant: "error" },
 * };
 * ```
 */
export type StatusConfig = Record<string, StatusDef>;

/**
 * Props for the {@link StatusBadge} component.
 * @property status - Current status key (must exist in config).
 * @property config - Map of status keys to label/variant definitions.
 * @property class - Additional CSS class.
 */
export interface StatusBadgeProps {
  status: string;
  config: StatusConfig;
  class?: string;
}

/**
 * Thin wrapper around {@link Badge} that maps a status key
 * to its label and color variant via a user-defined config.
 *
 * No additional CSS — delegates entirely to Badge.
 *
 * @example
 * ```tsx
 * const JOURNAL_STATUSES: StatusConfig = {
 *   draft:     { label: "下書き", variant: "neutral" },
 *   submitted: { label: "確認中", variant: "info" },
 *   approved:  { label: "確定",   variant: "success" },
 *   rejected:  { label: "却下",   variant: "error" },
 * };
 *
 * <StatusBadge status={journal.status} config={JOURNAL_STATUSES} />
 * ```
 */
export function StatusBadge({ status, config, class: cls }: StatusBadgeProps): any {
  const def = config[status];
  if (!def) {
    // Fallback for unknown status: render as neutral badge with raw key
    return <Badge variant="neutral">{status}</Badge>;
  }
  return <Badge variant={def.variant}>{def.label}</Badge>;
}
