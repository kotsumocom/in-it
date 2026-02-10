import { Handlers } from "$fresh/server.ts";

const API_URL = Deno.env.get("API_URL") || "http://localhost:3001";
const SITE_URL = "https://in-it.ooo";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    // 公開スペース一覧を取得
    let spaces: { slug: string; updated_at?: string }[] = [];
    try {
      const res = await fetch(`${API_URL}/api/spaces?limit=1000`);
      if (res.ok) {
        const data = await res.json();
        spaces = data.spaces || [];
      }
    } catch {
      // API取得失敗時は空配列
    }

    const now = new Date().toISOString().split("T")[0];

    const urls = [
      // 静的ページ
      { loc: SITE_URL, changefreq: "daily", priority: "1.0" },
      { loc: `${SITE_URL}/lp`, changefreq: "weekly", priority: "0.8" },
      { loc: `${SITE_URL}/mentors`, changefreq: "weekly", priority: "0.7" },
      // 動的ページ（スペース詳細）
      ...spaces.map((s) => ({
        loc: `${SITE_URL}/s/${s.slug}`,
        changefreq: "weekly",
        priority: "0.6",
        lastmod: s.updated_at
          ? new Date(s.updated_at).toISOString().split("T")[0]
          : now,
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      "lastmod" in u ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
