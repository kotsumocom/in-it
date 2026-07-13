/**
 * @module docs
 * Markdown parser (self-implemented, no additional dependencies).
 * JSON Frontmatter + GFM subset + TOC generation.
 * Deno/Bun compatible.
 *
 * @example
 * ```ts
 * import { parseMarkdown } from "@kotsumo/in-it/docs";
 *
 * const result = parseMarkdown(`---
 * title: Hello
 * ---
 * # Heading
 * Some **bold** text.
 * `);
 * console.log(result.meta.title); // "Hello"
 * console.log(result.html);       // "<h1>...</h1><p>...</p>"
 * console.log(result.toc);        // [{ id, text, level }]
 * ```
 */

/** Frontmatter metadata extracted from a markdown document. Supports arbitrary key-value pairs via index signature. */
export interface MarkdownMeta {
  title?: string;
  description?: string;
  sidebar_label?: string;
  sidebar_position?: number;
  [key: string]: unknown;
}

/** A single table-of-contents entry generated from h2/h3 headings in the markdown. */
export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Result of {@link parseMarkdown}: contains extracted metadata, rendered HTML, and table-of-contents entries. */
export interface ParsedMarkdown {
  meta: MarkdownMeta;
  html: string;
  toc: TocItem[];
}

/** Parse JSON Frontmatter */
function parseFrontmatter(content: string): { meta: MarkdownMeta; body: string } {
  const jsonMatch = content.match(/^---json\s*\n([\s\S]*?)\n---\s*\n/);
  if (jsonMatch) {
    try {
      const meta = JSON.parse(jsonMatch[1]) as MarkdownMeta;
      return { meta, body: content.slice(jsonMatch[0].length) };
    } catch {
      return { meta: {}, body: content };
    }
  }
  // Standard --- YAML-like (key: value only)
  const yamlMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (yamlMatch) {
    const meta: MarkdownMeta = {};
    for (const line of yamlMatch[1].split("\n")) {
      const m = line.match(/^(\w[\w_]*)\s*:\s*"?([^"]*)"?\s*$/);
      if (m) {
        const val = m[2].trim();
        meta[m[1]] = isNaN(Number(val)) ? val : Number(val);
      }
    }
    return { meta, body: content.slice(yamlMatch[0].length) };
  }
  return { meta: {}, body: content };
}

/** Slugify text */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3000-\u9fff\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Escape HTML special characters */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Parse inline markdown */
function parseInline(text: string): string {
  let result = escapeHtml(text);
  // Code span
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Link
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Image
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  return result;
}

/** Markdown → HTML + TOC */
export function parseMarkdown(content: string): ParsedMarkdown {
  const { meta, body } = parseFrontmatter(content);
  const toc: TocItem[] = [];
  const lines = body.split("\n");
  const htmlParts: string[] = [];
  let i = 0;
  let inList = false;
  let listType = "";
  let inTable = false;

  function closeList() {
    if (inList) {
      htmlParts.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
    }
  }

  function closeTable() {
    if (inTable) {
      htmlParts.push("</tbody></table>");
      inTable = false;
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    const codeMatch = line.match(/^```(\w*)\s*(title="([^"]*)")?\s*$/);
    if (codeMatch) {
      closeList(); closeTable();
      const lang = codeMatch[1] || "";
      const title = codeMatch[3] || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = escapeHtml(codeLines.join("\n"));
      if (title) {
        htmlParts.push(`<div class="ii-code-block"><div class="ii-code-block__title">${escapeHtml(title)}</div><pre><code class="language-${lang}">${code}</code></pre></div>`);
      } else {
        htmlParts.push(`<pre><code class="language-${lang}">${code}</code></pre>`);
      }
      continue;
    }

    // Aside/Callout: > [!NOTE], > [!TIP], > [!CAUTION], > [!DANGER]
    const asideMatch = line.match(/^>\s*\[!(NOTE|TIP|CAUTION|DANGER)\]\s*$/i);
    if (asideMatch) {
      closeList(); closeTable();
      const variant = asideMatch[1].toLowerCase();
      const asideLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].startsWith("> ")) {
        asideLines.push(lines[i].slice(2));
        i++;
      }
      const asideContent = asideLines.map(parseInline).join("<br>");
      const iconMap: Record<string, string> = {
        note: '<svg class="ii-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>',
        tip: '<svg class="ii-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>',
        caution: '<svg class="ii-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" /><path d="M12 16h.01" /></svg>',
        danger: '<svg class="ii-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M10 10l4 4m0 -4l-4 4" /></svg>',
      };
      htmlParts.push(`<div class="ii-aside ii-aside--${variant}"><div class="ii-aside__title"><span>${iconMap[variant] ?? ""}</span><span>${variant.charAt(0).toUpperCase() + variant.slice(1)}</span></div><div class="ii-aside__body">${asideContent}</div></div>`);
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList(); closeTable();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = slugify(text);
      if (level === 2 || level === 3) {
        toc.push({ id, text, level: level as 2 | 3 });
      }
      htmlParts.push(`<h${level} id="${id}">${parseInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && line.trim().startsWith("|")) {
      if (!inTable) {
        closeList();
        // Header row
        const headers = line.split("|").filter(c => c.trim()).map(c => c.trim());
        i++; // separator row
        if (i < lines.length && lines[i].match(/^\|[\s:-]+\|/)) i++;
        htmlParts.push("<table><thead><tr>");
        headers.forEach(h => htmlParts.push(`<th>${parseInline(h)}</th>`));
        htmlParts.push("</tr></thead><tbody>");
        inTable = true;
      } else {
        const cells = line.split("|").filter(c => c.trim()).map(c => c.trim());
        htmlParts.push("<tr>");
        cells.forEach(c => htmlParts.push(`<td>${parseInline(c)}</td>`));
        htmlParts.push("</tr>");
      }
      i++;
      continue;
    } else {
      closeTable();
    }

    // Unordered list
    const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    if (ulMatch) {
      closeTable();
      if (!inList || listType !== "ul") {
        closeList();
        htmlParts.push("<ul>");
        inList = true;
        listType = "ul";
      }
      htmlParts.push(`<li>${parseInline(ulMatch[2])}</li>`);
      i++;
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (olMatch) {
      closeTable();
      if (!inList || listType !== "ol") {
        closeList();
        htmlParts.push("<ol>");
        inList = true;
        listType = "ol";
      }
      htmlParts.push(`<li>${parseInline(olMatch[2])}</li>`);
      i++;
      continue;
    }

    closeList();

    // Horizontal rule
    if (line.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
      htmlParts.push("<hr>");
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    const paraLines: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].match(/^#{1,6}\s/) && !lines[i].startsWith("```") && !lines[i].match(/^[-*]\s/) && !lines[i].match(/^\d+\.\s/)) {
      paraLines.push(lines[i]);
      i++;
    }
    htmlParts.push(`<p>${paraLines.map(parseInline).join(" ")}</p>`);
  }

  closeList();
  closeTable();

  return { meta, html: htmlParts.join("\n"), toc };
}

/** Convert TOC items to DocsTocItem format */
export function tocToDocsFormat(toc: TocItem[]): { id: string; text: string; level: 2 | 3 }[] {
  return toc;
}