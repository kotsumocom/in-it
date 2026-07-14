/**
 * Script to add injectCSS calls to all components.
 * 
 * Strategy:
 * 1. Add import lines at the very top of the file (before any existing content)
 *    OR after existing import block
 * 2. Add injectCSS calls inside the first exported function
 *
 * Run: deno run -A scripts/add-inject-to-components.ts
 */

const COMP_DIR = "packages/in-it/src/components";

// Map: component file path → { css: [id, CONST_NAME][] }
const componentCSSMap: Record<string, { css: [string, string][] }> = {
  // UI (mod.tsx has multiple components — inject in first function)
  "ui/mod.tsx": {
    css: [
      ["ii-badge", "BADGE_CSS"],
      ["ii-card", "CARD_CSS"],
      ["ii-btn", "BUTTON_CSS"],
      ["ii-stat", "STAT_CARD_CSS"],
      ["ii-table", "DATA_TABLE_CSS"],
      ["ii-input", "INPUT_CSS"],
      ["ii-avatar", "AVATAR_CSS"],
      ["ii-chip", "CHIP_CSS"],
      ["ii-skeleton", "SKELETON_CSS"],
      ["ii-empty", "EMPTY_STATE_CSS"],
    ],
  },
  "ui/extras.tsx": {
    css: [
      ["ii-textarea", "TEXTAREA_CSS"],
      ["ii-alert", "ALERT_CSS"],
      ["ii-progress", "PROGRESS_CSS"],
      ["ii-breadcrumb", "BREADCRUMB_CSS"],
      ["ii-divider", "DIVIDER_CSS"],
      ["ii-kbd", "KBD_CSS"],
    ],
  },
  "ui/Aside.tsx": { css: [["ii-section", "SECTION_CSS"]] },
  "ui/PricingCard.tsx": { css: [["ii-pricing", "PRICING_CARD_CSS"]] },
  "ui/SettingsSection.tsx": { css: [["ii-settings", "SETTINGS_SECTION_CSS"]] },
  "ui/ErrorPage.tsx": { css: [["ii-error-page", "ERROR_PAGE_CSS"]] },
  "ui/Blog.tsx": { css: [["ii-blog", "BLOG_NOTIFICATIONS_CSS"]] },

  // Interactive
  "interactive/Switch.tsx": { css: [["ii-switch", "SWITCH_CSS"]] },
  "interactive/Dialog.tsx": { css: [["ii-dialog", "DIALOG_CSS"]] },
  "interactive/Tabs.tsx": { css: [["ii-tabs", "TABS_CSS"]] },
  "interactive/Menu.tsx": { css: [["ii-menu", "MENU_CSS"]] },
  "interactive/Toast.tsx": { css: [["ii-toast", "TOAST_CSS"]] },
  "interactive/Select.tsx": { css: [["ii-select", "SELECT_CSS"]] },
  "interactive/Accordion.tsx": { css: [["ii-accordion", "ACCORDION_CSS"]] },
  "interactive/Popover.tsx": { css: [["ii-popover", "POPOVER_CSS"]] },
  "interactive/ThemeToggle.tsx": { css: [["ii-theme-toggle", "THEME_TOGGLE_CSS"]] },
  "interactive/Combobox.tsx": { css: [["ii-combobox", "COMBOBOX_CSS"]] },
  "interactive/Checkbox.tsx": { css: [["ii-checkbox", "CHECKBOX_CSS"]] },
  "interactive/RadioGroup.tsx": { css: [["ii-radio", "RADIO_GROUP_CSS"]] },
  "interactive/Drawer.tsx": { css: [["ii-drawer", "DRAWER_CSS"]] },
  "interactive/Slider.tsx": { css: [["ii-slider", "SLIDER_CSS"]] },
  "interactive/Pagination.tsx": { css: [["ii-pagination", "PAGINATION_CSS"]] },
  "interactive/Steps.tsx": { css: [["ii-steps", "STEPS_CSS"]] },
  "interactive/Tooltip.tsx": { css: [["ii-popover", "POPOVER_CSS"]] },
  "interactive/AuthForm.tsx": { css: [["ii-auth-form", "AUTH_FORM_CSS"]] },
  "interactive/UserMenu.tsx": { css: [["ii-user-menu", "USER_MENU_CSS"]] },

  // Admin / Layout
  "admin/AdminShell.tsx": {
    css: [
      ["ii-admin-shell", "ADMIN_SHELL_CSS"],
      ["ii-admin-shell-mobile", "ADMIN_SHELL_MOBILE_CSS"],
    ],
  },
  "layout/DocsShell.tsx": { css: [["ii-docs", "DOCS_CSS"]] },
  "layout/Landing.tsx": { css: [["ii-landing", "LANDING_CSS"]] },

  // Charts
  "charts/BarChart.tsx": { css: [["ii-chart", "CHART_CSS"]] },
  "charts/LineChart.tsx": { css: [["ii-chart", "CHART_CSS"]] },
  "charts/DonutChart.tsx": { css: [["ii-chart", "CHART_CSS"]] },
  "charts/SparkLine.tsx": { css: [["ii-chart", "CHART_CSS"]] },
};

/**
 * Find the end of the import block.
 * Looks for lines starting with "import " (not inside comments).
 * Returns the position after the last import statement's newline.
 */
function findImportInsertPos(content: string): number {
  const lines = content.split("\n");
  let lastImportLineEnd = -1;
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimStart();

    // Track block comments
    if (inBlockComment) {
      if (line.includes("*/")) inBlockComment = false;
      continue;
    }
    if (line.startsWith("/*")) {
      if (!line.includes("*/")) inBlockComment = true;
      continue;
    }
    if (line.startsWith("//")) continue;
    if (line.startsWith("*")) continue;

    // Actual import line
    if (line.startsWith("import ")) {
      // Find end of this line in original content
      let pos = 0;
      for (let j = 0; j <= i; j++) {
        pos += lines[j].length + 1; // +1 for \n
      }
      lastImportLineEnd = pos;
    }
  }

  if (lastImportLineEnd === -1) {
    // No imports found — find end of initial block comment
    let pos = 0;
    for (let i = 0; i < lines.length; i++) {
      pos += lines[i].length + 1;
      const trimmed = lines[i].trimStart();
      if (trimmed.includes("*/") || (!trimmed.startsWith("/*") && !trimmed.startsWith("*") && !trimmed.startsWith("//") && trimmed.length > 0)) {
        // Check if we're past the initial comment
        if (!trimmed.startsWith("/*") && !trimmed.startsWith("*")) {
          return pos - lines[i].length - 1; // Insert before this line
        }
      }
    }
    return 0;
  }

  return lastImportLineEnd;
}

for (const [relPath, { css }] of Object.entries(componentCSSMap)) {
  const fullPath = `${COMP_DIR}/${relPath}`;
  let content: string;
  try {
    content = await Deno.readTextFile(fullPath);
  } catch {
    console.warn(`⚠ Skipping ${relPath} (file not found)`);
    continue;
  }

  // Skip if already has injectCSS
  if (content.includes("injectCSS")) {
    console.log(`⏭ ${relPath} (already has injectCSS)`);
    continue;
  }

  // Determine relative path prefix
  const depth = relPath.split("/").length;
  const prefix = depth === 2 ? "../../" : "../";

  // Build import lines
  const cssImports = [...new Set(css.map(([, name]) => name))].join(", ");
  const importLines = `import { ${cssImports} } from "${prefix}css.ts";\nimport { injectCSS } from "${prefix}inject.ts";\n`;

  // Build inject calls
  const injectCalls = css.map(([id, name]) => `  injectCSS("${id}", ${name});`).join("\n");

  // Step 1: Insert imports at the right position
  const insertPos = findImportInsertPos(content);
  content = content.slice(0, insertPos) + importLines + content.slice(insertPos);

  // Step 2: Find first "export function" and add inject calls
  const funcPattern = /^(export function \w+\([^)]*\)(?::\s*\w+)?\s*\{)/m;
  const funcMatch = funcPattern.exec(content);

  if (funcMatch && funcMatch.index !== undefined) {
    const insertAfter = funcMatch.index + funcMatch[0].length;
    content = content.slice(0, insertAfter) + "\n" + injectCalls + content.slice(insertAfter);
    await Deno.writeTextFile(fullPath, content);
    console.log(`✅ ${relPath} — added ${css.length} CSS inject(s)`);
  } else {
    console.warn(`⚠ ${relPath} — no exported function found`);
  }
}

console.log("\n✨ Done!");
