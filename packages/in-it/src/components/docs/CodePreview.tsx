/**
 * CodePreview — Live preview component for documentation.
 *
 * Renders HTML code blocks inside a Shadow DOM with
 * tab-toggle between Preview and Code views, plus a
 * dark/light mode switch for the preview pane.
 *
 * @example
 * ```tsx
 * <CodePreview
 *   code={`<button class="ii-button">Click me</button>`}
 *   lang="html"
 *   title="Button Example"
 * />
 * ```
 */
import { useState, useRef, useEffect, useCallback } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for CodePreview — co-located for self-containment. */
export const CODE_PREVIEW_CSS = `/* --- CodePreview --- */
.ii-code-preview {
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  overflow: hidden;
  margin-bottom: 24px;
}
.ii-code-preview__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  background: var(--ii-surface-container);
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-code-preview__tabs {
  display: flex;
  gap: 2px;
  background: var(--ii-surface-container-high);
  border-radius: var(--ii-shape-sm);
  padding: 2px;
}
.ii-code-preview__tab {
  padding: 5px 14px;
  font-size: var(--ii-font-sm);
  font-weight: 500;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--ii-on-surface-variant);
  cursor: pointer;
  transition: all 150ms ease;
  display: flex;
  align-items: center;
  gap: 5px;
}
.ii-code-preview__tab:hover {
  color: var(--ii-on-surface);
}
.ii-code-preview__tab--active {
  background: var(--ii-surface);
  color: var(--ii-on-surface);
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}
.ii-code-preview__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.ii-code-preview__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: var(--ii-shape-sm);
  background: transparent;
  color: var(--ii-on-surface-variant);
  cursor: pointer;
  transition: all 150ms ease;
}
.ii-code-preview__action:hover {
  background: var(--ii-surface-container-high);
  color: var(--ii-on-surface);
}
.ii-code-preview__action--active {
  color: var(--ii-primary);
}
.ii-code-preview__preview {
  padding: 24px;
  min-height: 80px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 200ms ease;
}
.ii-code-preview__preview--dark {
  background: #1a1a2e;
}
.ii-code-preview__code {
  display: none;
  position: relative;
}
.ii-code-preview__code--visible {
  display: block;
}
.ii-code-preview__code pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  background: var(--ii-surface-container);
  font-size: 0.8125rem;
  line-height: 1.6;
}
.ii-code-preview__code pre code {
  padding: 0;
  background: none;
}
.ii-code-preview__copy {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: var(--ii-shape-sm);
  background: color-mix(in srgb, var(--ii-surface) 80%, transparent);
  backdrop-filter: blur(4px);
  color: var(--ii-on-surface-variant);
  cursor: pointer;
  transition: all 150ms ease;
  opacity: 0;
}
.ii-code-preview__code:hover .ii-code-preview__copy {
  opacity: 1;
}
.ii-code-preview__copy:hover {
  background: var(--ii-surface-container-high);
  color: var(--ii-on-surface);
}
.ii-code-preview__title {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
`;

/** Tab view mode. */
type ViewMode = "preview" | "code";

/** Props for the CodePreview component. */
export interface CodePreviewProps {
  /** The HTML/CSS code to preview and display. */
  code: string;
  /** Language identifier for syntax display (e.g. "html"). */
  lang?: string;
  /** Optional title displayed in the toolbar. */
  title?: string;
  /** Base CSS to inject into the Shadow DOM preview (e.g. your design system CSS). */
  previewCSS?: string;
  /** Initial view mode. @default "preview" */
  defaultView?: ViewMode;
  /** Minimum height for the preview pane. @default "80px" */
  minHeight?: string;
}

/** Escape HTML for safe display in code view. */
function escapeForDisplay(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Live code preview component for documentation sites.
 *
 * Renders HTML in an isolated Shadow DOM with tab-switching
 * between live preview and source code views.
 */
export function CodePreview({
  code,
  lang = "html",
  title,
  previewCSS = "",
  defaultView = "preview",
  minHeight = "80px",
}: CodePreviewProps): any {
  injectCSS("ii-code-preview", CODE_PREVIEW_CSS);

  const [view, setView] = useState<ViewMode>(defaultView);
  const [darkPreview, setDarkPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Render HTML into Shadow DOM for isolation
  useEffect(() => {
    const host = previewRef.current;
    if (!host) return;

    // Clear and recreate shadow root
    let shadow = host.shadowRoot;
    if (!shadow) {
      shadow = host.attachShadow({ mode: "open" });
    }

    // Build the shadow DOM content
    const colorScheme = darkPreview ? "dark" : "light";
    shadow.innerHTML = `
      <style>
        :host { display: block; color-scheme: ${colorScheme}; }
        * { box-sizing: border-box; }
        ${previewCSS}
        ${darkPreview ? `
          :host { color: #e6e0e9; }
          [data-theme="dark"], .dark { /* already dark */ }
        ` : `
          :host { color: #1d1b20; }
        `}
      </style>
      <div data-theme="${darkPreview ? "dark" : "light"}">${code}</div>
    `;
  }, [code, previewCSS, darkPreview]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  }, [code]);

  const previewClass = [
    "ii-code-preview__preview",
    darkPreview && "ii-code-preview__preview--dark",
  ].filter(Boolean).join(" ");

  const codeClass = [
    "ii-code-preview__code",
    view === "code" && "ii-code-preview__code--visible",
  ].filter(Boolean).join(" ");

  return (
    <div class="ii-code-preview">
      {/* Toolbar */}
      <div class="ii-code-preview__toolbar">
        <div class="ii-code-preview__tabs">
          <button
            type="button"
            class={`ii-code-preview__tab${view === "preview" ? " ii-code-preview__tab--active" : ""}`}
            onClick={() => setView("preview")}
            aria-pressed={view === "preview"}
          >
            <Icon name="eye" size={14} />
            Preview
          </button>
          <button
            type="button"
            class={`ii-code-preview__tab${view === "code" ? " ii-code-preview__tab--active" : ""}`}
            onClick={() => setView("code")}
            aria-pressed={view === "code"}
          >
            <Icon name="code" size={14} />
            Code
          </button>
        </div>

        <div class="ii-code-preview__actions">
          {title && <span class="ii-code-preview__title">{title}</span>}
          {view === "preview" && (
            <button
              type="button"
              class={`ii-code-preview__action${darkPreview ? " ii-code-preview__action--active" : ""}`}
              onClick={() => setDarkPreview(!darkPreview)}
              aria-label={darkPreview ? "Switch to light preview" : "Switch to dark preview"}
              title={darkPreview ? "Light mode" : "Dark mode"}
            >
              <Icon name={darkPreview ? "sun" : "moon"} size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Preview pane */}
      {view === "preview" && (
        <div
          ref={previewRef}
          class={previewClass}
          style={{ minHeight }}
        />
      )}

      {/* Code pane */}
      <div class={codeClass}>
        <pre><code class={`language-${lang}`}>{escapeForDisplay(code)}</code></pre>
        <button
          type="button"
          class="ii-code-preview__copy"
          onClick={handleCopy}
          aria-label="Copy code"
          title={copied ? "Copied!" : "Copy"}
        >
          <Icon name={copied ? "check" : "copy"} size={14} />
        </button>
      </div>
    </div>
  );
}
