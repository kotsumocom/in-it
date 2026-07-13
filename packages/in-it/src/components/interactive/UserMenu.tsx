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
