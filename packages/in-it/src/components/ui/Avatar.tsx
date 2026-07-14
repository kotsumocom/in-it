import { injectCSS } from "../../inject.ts";

/** @internal CSS for Avatar — co-located for self-containment. */
export const AVATAR_CSS = `/* --- Avatar --- */
.ii-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--ii-primary-container);
  color: var(--ii-primary);
  font-weight: 600;
  overflow: hidden;
}
.ii-avatar--sm { width: 32px; height: 32px; font-size: 0.8rem; }
.ii-avatar--md { width: 40px; height: 40px; font-size: 1rem; }
.ii-avatar--lg { width: 56px; height: 56px; font-size: 1.25rem; }
.ii-avatar img { width: 100%; height: 100%; object-fit: cover; }
`;

/** Props for the {@link Avatar} component.
 * @property name - User's full name; initials are derived from the first letters of each word (max 2).
 * @property src - Image URL. When provided, displays the image instead of initials.
 * @property size - sm (small), md (default), or lg (large).
 */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

/** Circular avatar displaying a user image or auto-generated initials from the user's name. */
export function Avatar({ name, src, size = "md" }: AvatarProps): any {
  injectCSS("ii-avatar", AVATAR_CSS);
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  return (
    <div class={`ii-avatar ii-avatar--${size}`}>
      {src ? <img src={src} alt={name ?? ""} /> : initials}
    </div>
  );
}
