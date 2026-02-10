import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { State } from "../_middleware.ts";
import { getPublicSpace } from "../../lib/api.ts";
import type { Space } from "../../lib/api.ts";
import ShareButtons from "../../islands/ShareButtons.tsx";

interface SpacePageData {
  space: Space;
  user: State["user"];
}

export const handler: Handlers<SpacePageData, State> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;

    const { space, error } = await getPublicSpace(slug);

    if (error || !space) {
      return ctx.renderNotFound();
    }

    return ctx.render({
      space,
      user: ctx.state.user,
    });
  },
};

// Editor.jsのブロックデータをHTML風にレンダリング
function renderDescription(description: string | undefined) {
  if (!description) return null;

  try {
    const data = JSON.parse(description);
    if (!data.blocks || !Array.isArray(data.blocks)) return null;

    return (
      <div class="markdown-body">
        {data.blocks.map(
          (
            block: { type: string; data: Record<string, unknown> },
            index: number,
          ) => {
            switch (block.type) {
              case "header": {
                const level = (block.data.level as number) || 3;
                const text = (block.data.text as string) || "";
                if (level === 3)
                  return (
                    <h3
                      key={index}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  );
                if (level === 4)
                  return (
                    <h4
                      key={index}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  );
                if (level === 5)
                  return (
                    <h5
                      key={index}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  );
                if (level === 6)
                  return (
                    <h6
                      key={index}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  );
                return (
                  <h3 key={index} dangerouslySetInnerHTML={{ __html: text }} />
                );
              }
              case "paragraph":
                return (
                  <p
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: (block.data.text as string) || "",
                    }}
                  />
                );
              case "list": {
                const items = (block.data.items as string[]) || [];
                const style = block.data.style as string;
                if (style === "ordered") {
                  return (
                    <ol key={index}>
                      {items.map((item, i) => (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      ))}
                    </ol>
                  );
                }
                return (
                  <ul key={index}>
                    {items.map((item, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                );
              }
              case "quote":
                return (
                  <blockquote key={index}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: (block.data.text as string) || "",
                      }}
                    />
                    {block.data.caption && (
                      <cite>{block.data.caption as string}</cite>
                    )}
                  </blockquote>
                );
              case "image":
                return (
                  <figure key={index} class="my-4">
                    <img
                      src={(block.data.file as { url: string })?.url || ""}
                      alt={(block.data.caption as string) || ""}
                      class="max-w-full rounded"
                    />
                    {block.data.caption && (
                      <figcaption class="text-sm text-gray-500 mt-2">
                        {block.data.caption as string}
                      </figcaption>
                    )}
                  </figure>
                );
              default:
                return null;
            }
          },
        )}
      </div>
    );
  } catch {
    // パース失敗時はプレーンテキストとして表示
    return <p class="whitespace-pre-wrap text-gray-700">{description}</p>;
  }
}

// URLからユーザー名を抽出
function extractUsername(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const match = url.match(/(?:x\.com|twitter\.com|instagram\.com)\/([^/?]+)/);
  return match ? match[1] : undefined;
}

export default function SpacePage({ data }: PageProps<SpacePageData>) {
  const { space, user } = data;

  const xUsername = extractUsername(space.x_url ?? undefined);
  const instagramUsername = extractUsername(space.instagram_url ?? undefined);
  const spaceUrl = `https://in-it.ooo/s/${space.slug}`;
  const ogDescription = space.description
    ? space.description.substring(0, 120).replace(/[\n\r]/g, " ")
    : `${space.title} - イニットで相談できます`;
  const ogImage = space.thumbnail_url || "https://in-it.ooo/ogp.svg";

  return (
    <div class="min-h-screen bg-gray-50">
      <Head>
        <title>{space.title} - イニット</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${space.title} - イニット`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={spaceUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${space.title} - イニット`} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: space.title,
            description: ogDescription,
            url: spaceUrl,
            image: ogImage,
            category: space.category?.name || undefined,
          })}
        </script>
      </Head>
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニット" class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/" class="text-gray-600 hover:text-gray-900">
              スペース一覧
            </a>
            {user ? (
              <a href="/dashboard" class="text-gray-600 hover:text-gray-900">
                ダッシュボード
              </a>
            ) : (
              <a
                href="/login"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                ログイン
              </a>
            )}
          </nav>
        </div>
      </header>

      <div class="max-w-3xl mx-auto py-12 px-4">
        {/* SNS共有ボタン */}
        <div class="mb-6 flex justify-end">
          <ShareButtons url={spaceUrl} title={space.title} />
        </div>

        {/* スペースヘッダー */}
        <div class="mb-8">
          {/* カテゴリ（リンク） */}
          {space.category && (
            <a
              href={`/?category=${space.category.id}`}
              class="inline-block text-sm text-blue-600 hover:text-blue-700 mb-2"
            >
              {space.category.display_name}
            </a>
          )}

          <h1 class="text-3xl font-bold text-gray-900 mb-4">{space.title}</h1>

          {/* タグ（リンク） */}
          {space.tags && space.tags.length > 0 && (
            <div class="flex flex-wrap gap-2 mb-6">
              {space.tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/?tag=${tag.name}`}
                  class="px-3 py-1 bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag.display_name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 説明文 */}
        {space.description && (
          <section class="mb-8 p-6 bg-white border border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 mb-4">📝 説明</h2>
            {renderDescription(space.description)}
          </section>
        )}

        {/* 外部リンク */}
        {(space.website_url || space.x_url || space.instagram_url) && (
          <section class="p-6 bg-white border border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 mb-4">🔗 リンク</h2>
            <div class="space-y-2">
              {space.website_url && (
                <a
                  href={space.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  🌐{" "}
                  {space.website_url
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              )}
              {space.x_url && xUsername && (
                <a
                  href={space.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  𝕏 @{xUsername}
                </a>
              )}
              {space.instagram_url && instagramUsername && (
                <a
                  href={space.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  📷 @{instagramUsername}
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
