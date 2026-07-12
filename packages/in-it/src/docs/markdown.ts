/**
 * Markdown パーサー（自前実装、ゼロ外部依存）
 * JSON Frontmatter + GFM サブセット + TOC 生成
 * Deno/Bun 両対応
 */

export interface MarkdownMeta {
  title?: string;
  description?: string;
  sidebar_label?: string;
  sidebar_position?: number;
  [key: string]: unknown;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface ParsedMarkdown {
  meta: MarkdownMeta;
  html: string;
  toc: TocItem[];
}

/** JSON Frontmatter をパース */
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
  // 通常の --- YAML 風（key: value のみサポート）
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

/** テキストを slug 化 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3000-\u9fff\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** HTML 特殊文字エスケープ */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** インラインマークダウンをパース */
function parseInline(text: string): string {
  let result = escapeHtml(text);
  // コードスパン
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // 太字
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // 斜体
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // リンク
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // 画像
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

    // コードブロック
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
      const icons: Record<string, string> = { note: "", tip: "", caution: "", danger: "" };
      htmlParts.push(`<div class="ii-aside ii-aside--${variant}"><div class="ii-aside__title"><span>${icons[variant]}</span><span>${variant.charAt(0).toUpperCase() + variant.slice(1)}</span></div><div class="ii-aside__body">${asideContent}</div></div>`);
      continue;
    }

    // 見出し
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

    // テーブル
    if (line.includes("|") && line.trim().startsWith("|")) {
      if (!inTable) {
        closeList();
        // ヘッダー行
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

    // リスト（ul）
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

    // リスト（ol）
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

    // 水平線
    if (line.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
      htmlParts.push("<hr>");
      i++;
      continue;
    }

    // 空行
    if (line.trim() === "") {
      i++;
      continue;
    }

    // パラグラフ
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

/** TOC アイテムを DocsTocItem 形式に変換 */
export function tocToDocsFormat(toc: TocItem[]): { id: string; text: string; level: 2 | 3 }[] {
  return toc;
}
