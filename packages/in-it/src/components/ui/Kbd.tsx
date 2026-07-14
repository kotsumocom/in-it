
/** @internal CSS for Kbd — co-located for self-containment. */
export const KBD_CSS = `/* --- Kbd --- */
.ii-kbd {
  display: inline-flex; align-items: center; padding: 2px 6px; border: 1px solid var(--ii-outline-variant);
  border-radius: 4px; background: var(--ii-surface-container); font-family: 'Fira Code', monospace;
  font-size: 0.75rem; font-weight: 500; color: var(--ii-on-surface);
  box-shadow: 0 1px 0 var(--ii-outline-variant);
}
`;

/** Props for the Kbd component. */
export interface KbdProps {
  children: any;
}

/** Keyboard shortcut indicator styled as a key cap. */
export function Kbd({ children }: KbdProps): any {
  return <kbd class="ii-kbd">{children}</kbd>;
}
