/**
 * UserMenu — Avatar + dropdown menu for the admin header.
 *
 * Usage:
 *   <UserMenu
 *     name="John Doe"
 *     email="john@example.com"
 *     avatar="https://..."
 *     items={[
 *       { label: "Settings", onClick: () => navigate("/admin/settings") },
 *       { label: "Sign Out", onClick: signOut },
 *     ]}
 *   />
 */
import { useState, useCallback, useRef, useEffect } from "hono/jsx";

/** @internal CSS for UserMenu — co-located for self-containment. */
export const USER_MENU_CSS = `/* --- UserMenu --- */
.ii-user-menu {
  position: relative;
}
.ii-user-menu__trigger {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: box-shadow var(--ii-transition);
}
.ii-user-menu__trigger:hover {
  box-shadow: 0 0 0 2px var(--ii-outline-variant);
}
.ii-user-menu__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.ii-user-menu__avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  font-size: var(--ii-font-sm);
  font-weight: 600;
}
.ii-user-menu__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 220px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-lg);
  padding: var(--ii-spacing-1) 0;
  z-index: 50;
  animation: ii-fade-in 0.15s ease;
}
.ii-user-menu__info {
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-user-menu__name {
  display: block;
  font-size: var(--ii-font-base);
  font-weight: 600;
  color: var(--ii-on-surface);
}
.ii-user-menu__email {
  display: block;
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-top: 2px;
}
.ii-user-menu__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  width: 100%;
  padding: var(--ii-spacing-2) var(--ii-spacing-4);
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  cursor: pointer;
  text-align: left;
  transition: background var(--ii-transition);
}
.ii-user-menu__item:hover {
  background: var(--ii-surface-container-high);
}
.ii-user-menu__divider {
  margin: var(--ii-spacing-1) 0;
  border: none;
  border-top: 1px solid var(--ii-outline-variant);
}
`;

/** A menu item in the user dropdown. */
export interface UserMenuItem {
  label: string;
  icon?: any;
  onClick?: () => void;
  divider?: boolean;
}

/** Props for UserMenu. */
export interface UserMenuProps {
  /** User display name. */
  name: string;
  /** User email. */
  email?: string;
  /** Avatar image URL. Falls back to initials if not provided. */
  avatar?: string;
  /** Dropdown menu items. */
  items?: UserMenuItem[];
  /** Additional CSS class. */
  class?: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** User avatar with dropdown menu for admin layouts. */
export function UserMenu({
  name,
  email,
  avatar,
  items = [],
  class: cls,
}: UserMenuProps): any {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((v: boolean) => !v), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div class={`ii-user-menu${cls ? ` ${cls}` : ""}`} ref={ref}>
      <button type="button" class="ii-user-menu__trigger" onClick={toggle} aria-expanded={open}>
        {avatar ? (
          <img class="ii-user-menu__avatar" src={avatar} alt={name} />
        ) : (
          <span class="ii-user-menu__avatar ii-user-menu__avatar--initials">{getInitials(name)}</span>
        )}
      </button>

      {open && (
        <div class="ii-user-menu__dropdown" role="menu">
          <div class="ii-user-menu__info">
            <span class="ii-user-menu__name">{name}</span>
            {email && <span class="ii-user-menu__email">{email}</span>}
          </div>
          {items.map((item, i) =>
            item.divider ? (
              <hr key={i} class="ii-user-menu__divider" />
            ) : (
              <button
                key={i}
                type="button"
                class="ii-user-menu__item"
                role="menuitem"
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
              >
                {item.icon ?? null}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
