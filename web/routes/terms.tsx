import { Handlers, PageProps } from "$fresh/server.ts";
import { marked } from "marked";

interface TermsData {
  html: string;
}

export const handler: Handlers<TermsData> = {
  async GET(_req, ctx) {
    try {
      const markdown = await Deno.readTextFile(
        new URL("../content/terms.md", import.meta.url),
      );
      const html = await marked(markdown);
      return ctx.render({ html });
    } catch (error) {
      console.error("Failed to load terms.md:", error);
      return ctx.render({ html: "<p>読み込みに失敗しました</p>" });
    }
  },
};

export default function Terms({ data }: PageProps<TermsData>) {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニット" class="h-8" />
          </a>
        </div>
      </header>

      {/* コンテンツ */}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <article
          class="markdown-body bg-white rounded-lg shadow-sm border border-gray-200 p-8"
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
      </main>

      {/* フッター */}
      <footer class="py-8 px-4 bg-gray-900 text-gray-400 mt-12">
        <div class="max-w-4xl mx-auto text-center">
          <p class="text-sm">
            <a
              href="https://kotsumo.com/"
              class="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              © 2025 コツモ
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
