/**
 * CSS Splitter — main.css をコンポーネントごとのファイルに分割
 *
 * Usage: deno run -A scripts/split-css.ts
 */

const INPUT = "packages/in-it/src/css/main.css";
const OUTPUT_DIR = "packages/in-it/src/css/components";

// Section mapping: regex pattern → output filename
const SECTIONS: [RegExp, string][] = [
  [/\/\* --- Variables ---/, "_variables.css"],
  [/\/\* --- Dark Mode ---/, "_variables.css"],       // append to variables
  [/\/\* --- Icon ---/, "_icon.css"],
  [/\/\* --- Reset ---/, "_reset.css"],
  [/\/\* --- Admin Shell Layout ---/, "_admin-shell.css"],
  [/\/\* Rail \*\//, "_admin-shell.css"],
  [/\/\* Main \*\//, "_admin-shell.css"],
  [/\/\* Header \*\//, "_admin-shell.css"],
  [/\/\* Content \*\//, "_admin-shell.css"],
  [/\/\* --- Page ---/, "_page.css"],
  [/\/\* --- Button ---/, "_button.css"],
  [/\/\* --- Badge ---/, "_badge.css"],
  [/\/\* --- Card ---/, "_card.css"],
  [/\/\* --- Stat Card ---/, "_stat-card.css"],
  [/\/\* --- Switch ---/, "_switch.css"],
  [/\/\* --- Data Table ---/, "_data-table.css"],
  [/\/\* --- Stats Grid ---/, "_stat-card.css"],     // append
  [/\/\* --- Section ---/, "_section.css"],
  [/\/\* --- Dialog ---/, "_dialog.css"],
  [/\/\* --- Tabs ---/, "_tabs.css"],
  [/\/\* --- Menu ---/, "_menu.css"],
  [/\/\* --- Toast ---/, "_toast.css"],
  [/\/\* --- Select ---/, "_select.css"],
  [/\/\* --- Accordion ---/, "_accordion.css"],
  [/\/\* --- Popover ---/, "_popover.css"],
  [/\/\* --- Input \/ TextField ---/, "_input.css"],
  [/\/\* --- Chip \/ Tag ---/, "_chip.css"],
  [/\/\* --- Avatar ---/, "_avatar.css"],
  [/\/\* --- Skeleton ---/, "_skeleton.css"],
  [/\/\* --- Empty State ---/, "_empty-state.css"],
  [/\/\* --- Theme Toggle ---/, "_theme-toggle.css"],
  [/\/\* --- Combobox ---/, "_combobox.css"],
  [/\/\* --- Checkbox ---/, "_checkbox.css"],
  [/\/\* --- Radio Group ---/, "_radio-group.css"],
  [/\/\* --- Textarea ---/, "_textarea.css"],
  [/\/\* --- Slider ---/, "_slider.css"],
  [/\/\* --- Number Input ---/, "_number-input.css"],
  [/\/\* --- Password Input ---/, "_password-input.css"],
  [/\/\* --- Pin Input ---/, "_pin-input.css"],
  [/\/\* --- Tags Input ---/, "_tags-input.css"],
  [/\/\* --- Toggle ---/, "_toggle.css"],
  [/\/\* --- Toggle Group ---/, "_toggle-group.css"],
  [/\/\* --- Alert ---/, "_alert.css"],
  [/\/\* --- Drawer ---/, "_drawer.css"],
  [/\/\* --- Progress Bar ---/, "_progress.css"],
  [/\/\* --- Progress Circular ---/, "_progress.css"],  // append
  [/\/\* --- Pagination ---/, "_pagination.css"],
  [/\/\* --- Steps ---/, "_steps.css"],
  [/\/\* --- Segmented Control ---/, "_segmented-control.css"],
  [/\/\* --- Collapsible ---/, "_collapsible.css"],
  [/\/\* --- HoverCard ---/, "_hover-card.css"],
  [/\/\* --- Clipboard ---/, "_clipboard.css"],
  [/\/\* --- Breadcrumb ---/, "_breadcrumb.css"],
  [/\/\* --- File Upload ---/, "_file-upload.css"],
  [/\/\* --- Editable ---/, "_editable.css"],
  [/\/\* --- Rating Group ---/, "_rating-group.css"],
  [/\/\* --- NavigationMenu ---/, "_navigation-menu.css"],
  [/\/\* --- Listbox ---/, "_listbox.css"],
  [/\/\* --- Carousel ---/, "_carousel.css"],
  [/\/\* --- Marquee ---/, "_marquee.css"],
  [/\/\* --- Timer ---/, "_timer.css"],
  [/\/\* --- TreeView ---/, "_tree-view.css"],
  [/\/\* --- Divider ---/, "_divider.css"],
  [/\/\* --- Kbd ---/, "_kbd.css"],
  [/\/\* --- Toolbar ---/, "_toolbar.css"],
  [/\/\* --- Utility: Animations ---/, "_animations.css"],
  [/\/\* ={3,}/, "_landing.css"],  // Landing page sections
  [/\/\* Component grid for LP/, "_landing.css"],
  [/\/\* Docs article typography/, "_docs.css"],
  [/\/\* Aside\/Callout/, "_docs.css"],
  [/\/\* Prev\/Next navigation/, "_docs.css"],
  [/\/\* Responsive \*\//, "_responsive.css"],
  [/\/\* --- AdminShell Mobile ---/, "_admin-shell-mobile.css"],
  [/\/\* --- Input Validation States ---/, "_input.css"],  // append
  [/\/\* Also support bare input/, "_input.css"],          // append
  [/\/\* --- PricingCard ---/, "_pricing-card.css"],
  [/\/\* --- AuthForm ---/, "_auth-form.css"],
  [/\/\* --- SettingsSection ---/, "_settings-section.css"],
  [/\/\* --- ErrorPage ---/, "_error-page.css"],
  [/\/\* --- UserMenu ---/, "_user-menu.css"],
  [/\/\* --- Utility: Fade In ---/, "_animations.css"],   // append
];

async function main() {
  const content = await Deno.readTextFile(INPUT);
  const lines = content.split("\n");

  // Find all section boundaries
  interface Section {
    start: number;
    file: string;
  }

  const sections: Section[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const [pattern, filename] of SECTIONS) {
      if (pattern.test(line)) {
        sections.push({ start: i, file: filename });
        break;
      }
    }
  }

  // Sort by line number
  sections.sort((a, b) => a.start - b.start);

  // Collect content per file
  const fileContents = new Map<string, string[]>();

  for (let si = 0; si < sections.length; si++) {
    const s = sections[si];
    const nextStart = si + 1 < sections.length ? sections[si + 1].start : lines.length;
    const chunk = lines.slice(s.start, nextStart);

    if (!fileContents.has(s.file)) {
      fileContents.set(s.file, []);
    }
    fileContents.get(s.file)!.push(...chunk);
  }

  // Create output dir
  await Deno.mkdir(OUTPUT_DIR, { recursive: true });

  // Write files
  const importLines: string[] = [];
  for (const [filename, contentLines] of fileContents) {
    const filePath = `${OUTPUT_DIR}/${filename}`;
    await Deno.writeTextFile(filePath, contentLines.join("\n"));
    importLines.push(`@import "./components/${filename}";`);
    console.log(`  ✓ ${filename} (${contentLines.length} lines)`);
  }

  // Generate new main.css
  const mainCss = `/* ======================================
   in-it Core CSS
   ====================================== */

${[...new Set(importLines)].join("\n")}
`;
  await Deno.writeTextFile(INPUT, mainCss);
  console.log(`\n✓ main.css updated with ${fileContents.size} imports`);
}

main();
