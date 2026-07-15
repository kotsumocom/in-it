/**
 * @module docs/hydrate-previews
 * Client-side hydration for code preview placeholders.
 *
 * When the markdown parser emits `ii-code-preview-placeholder` elements
 * (via the `preview` meta on code blocks), this script upgrades them
 * into interactive CodePreview components on the client.
 *
 * @example
 * ```ts
 * // In your client-side entry point:
 * import { hydratePreviews } from "@kotsumo/in-it/docs";
 *
 * // Call after DOM is ready
 * hydratePreviews({ previewCSS: myDesignSystemCSS });
 * ```
 */

/** Options for hydrating code preview placeholders. */
export interface HydratePreviewsOptions {
  /**
   * CSS to inject into each preview's Shadow DOM.
   * Typically your design system CSS so previewed components render correctly.
   */
  previewCSS?: string;
  /** Container element to search within. @default document */
  container?: Element | Document;
}

/**
 * Hydrate all `ii-code-preview-placeholder` elements into interactive previews.
 *
 * This function is framework-agnostic: it uses vanilla DOM APIs to create
 * the interactive preview UI (tabs, dark mode toggle, copy button).
 * No dependency on Hono JSX at runtime.
 */
export function hydratePreviews(options: HydratePreviewsOptions = {}): void {
  const { previewCSS = "", container = document } = options;

  const placeholders = container.querySelectorAll(".ii-code-preview-placeholder");
  for (const el of placeholders) {
    const code = decodeEntities(el.getAttribute("data-code") ?? "");
    const lang = el.getAttribute("data-lang") ?? "html";
    const title = el.getAttribute("data-title") ?? "";
    if (!code) continue;

    // Replace placeholder with interactive preview
    const preview = createInteractivePreview({ code, lang, title, previewCSS });
    el.replaceWith(preview);
  }
}

/** Decode HTML entities from data attributes. */
function decodeEntities(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

/** Escape HTML for safe display in code view. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** SVG icon paths (inline to avoid dependency on Icon component at runtime). */
const ICONS = {
  eye: '<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />',
  code: '<path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" />',
  sun: '<path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />',
  moon: '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />',
  copy: '<path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />',
  check: '<path d="M5 12l5 5l10 -10" />',
} as const;

function svgIcon(name: keyof typeof ICONS, size = 16): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}

interface CreatePreviewOptions {
  code: string;
  lang: string;
  title: string;
  previewCSS: string;
}

/** Create the interactive preview DOM element. */
function createInteractivePreview({ code, lang, title, previewCSS }: CreatePreviewOptions): HTMLElement {
  const root = document.createElement("div");
  root.className = "ii-code-preview";

  let currentView: "preview" | "code" = "preview";
  let darkMode = false;

  // --- Toolbar ---
  const toolbar = document.createElement("div");
  toolbar.className = "ii-code-preview__toolbar";

  const tabs = document.createElement("div");
  tabs.className = "ii-code-preview__tabs";

  const previewTab = document.createElement("button");
  previewTab.type = "button";
  previewTab.className = "ii-code-preview__tab ii-code-preview__tab--active";
  previewTab.innerHTML = `${svgIcon("eye", 14)} Preview`;

  const codeTab = document.createElement("button");
  codeTab.type = "button";
  codeTab.className = "ii-code-preview__tab";
  codeTab.innerHTML = `${svgIcon("code", 14)} Code`;

  tabs.append(previewTab, codeTab);

  const actions = document.createElement("div");
  actions.className = "ii-code-preview__actions";

  if (title) {
    const titleEl = document.createElement("span");
    titleEl.className = "ii-code-preview__title";
    titleEl.textContent = title;
    actions.append(titleEl);
  }

  const themeBtn = document.createElement("button");
  themeBtn.type = "button";
  themeBtn.className = "ii-code-preview__action";
  themeBtn.title = "Dark mode";
  themeBtn.setAttribute("aria-label", "Switch to dark preview");
  themeBtn.innerHTML = svgIcon("moon", 16);

  actions.append(themeBtn);
  toolbar.append(tabs, actions);

  // --- Preview pane ---
  const previewPane = document.createElement("div");
  previewPane.className = "ii-code-preview__preview";

  function renderShadow() {
    let shadow = previewPane.shadowRoot;
    if (!shadow) {
      shadow = previewPane.attachShadow({ mode: "open" });
    }
    const colorScheme = darkMode ? "dark" : "light";
    shadow.innerHTML = `
      <style>
        :host { display: block; color-scheme: ${colorScheme}; }
        * { box-sizing: border-box; }
        ${previewCSS}
        :host { color: ${darkMode ? "#e6e0e9" : "#1d1b20"}; }
      </style>
      <div data-theme="${colorScheme}">${code}</div>
    `;
  }
  renderShadow();

  // --- Code pane ---
  const codePane = document.createElement("div");
  codePane.className = "ii-code-preview__code";
  codePane.innerHTML = `
    <pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>
    <button type="button" class="ii-code-preview__copy" aria-label="Copy code" title="Copy">
      ${svgIcon("copy", 14)}
    </button>
  `;

  // Copy button
  const copyBtn = codePane.querySelector(".ii-code-preview__copy") as HTMLButtonElement;
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code);
      copyBtn.innerHTML = svgIcon("check", 14);
      copyBtn.title = "Copied!";
      setTimeout(() => {
        copyBtn.innerHTML = svgIcon("copy", 14);
        copyBtn.title = "Copy";
      }, 2000);
    } catch {
      // Fallback
    }
  });

  // --- Tab switching ---
  function updateView() {
    if (currentView === "preview") {
      previewTab.classList.add("ii-code-preview__tab--active");
      codeTab.classList.remove("ii-code-preview__tab--active");
      previewPane.style.display = "";
      codePane.classList.remove("ii-code-preview__code--visible");
      themeBtn.style.display = "";
    } else {
      previewTab.classList.remove("ii-code-preview__tab--active");
      codeTab.classList.add("ii-code-preview__tab--active");
      previewPane.style.display = "none";
      codePane.classList.add("ii-code-preview__code--visible");
      themeBtn.style.display = "none";
    }
  }

  previewTab.addEventListener("click", () => {
    currentView = "preview";
    updateView();
  });

  codeTab.addEventListener("click", () => {
    currentView = "code";
    updateView();
  });

  // --- Dark mode toggle ---
  themeBtn.addEventListener("click", () => {
    darkMode = !darkMode;
    previewPane.classList.toggle("ii-code-preview__preview--dark", darkMode);
    themeBtn.innerHTML = svgIcon(darkMode ? "sun" : "moon", 16);
    themeBtn.title = darkMode ? "Light mode" : "Dark mode";
    themeBtn.setAttribute("aria-label", darkMode ? "Switch to light preview" : "Switch to dark preview");
    themeBtn.classList.toggle("ii-code-preview__action--active", darkMode);
    renderShadow();
  });

  // Assemble
  root.append(toolbar, previewPane, codePane);
  return root;
}
