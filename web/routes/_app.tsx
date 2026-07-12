import { type PageProps } from "$fresh/server.ts";
import FeedbackFAB from "../islands/FeedbackFAB.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>繧､繝九ャ繝・- 謇区焚譁吶ぞ繝ｭ縺ｮ繝｡繝ｳ繧ｿ繝ｼ謗ｲ霈峨・繝ｩ繝・ヨ繝輔か繝ｼ繝</title>
        <meta
          name="description"
          content="謇区焚譁吶ぞ繝ｭ繝ｻ逶ｴ謗･螂醍ｴОK縲よ怦鬘・,000蜀・〒繝｡繝ｳ繧ｿ繝ｼ縺ｨ縺励※謗ｲ霈峨〒縺阪ｋ繝励Λ繝・ヨ繝輔か繝ｼ繝縲・
        />
        {/* OGP */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="繧､繝九ャ繝・ />
        <meta property="og:title" content="繧､繝九ャ繝・- 繝｡繝ｳ繧ｿ繝ｼ繧定ｦ九▽縺代ｈ縺・ />
        <meta
          property="og:description"
          content="繝励Ο繧ｰ繝ｩ繝溘Φ繧ｰ縲√ョ繧ｶ繧､繝ｳ縲√・繝ｼ繧ｱ繝・ぅ繝ｳ繧ｰ縺ｪ縺ｩ讒倥・↑蛻・㍽縺ｮ繝励Ο縺ｫ逶ｴ謗･逶ｸ隲・よ焔謨ｰ譁吶ぞ繝ｭ繝ｻ譛磯｡・,000蜀・・繝｡繝ｳ繧ｿ繝ｼ謗ｲ霈峨・繝ｩ繝・ヨ繝輔か繝ｼ繝縲・
        />
        <meta property="og:url" content="https://init.dev" />
        <meta property="og:image" content="https://init.dev/ogp.png" />
        <meta property="og:locale" content="ja_JP" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="繧､繝九ャ繝・- 繝｡繝ｳ繧ｿ繝ｼ繧定ｦ九▽縺代ｈ縺・ />
        <meta
          name="twitter:description"
          content="謇区焚譁吶ぞ繝ｭ繝ｻ逶ｴ謗･螂醍ｴОK縲よ怦鬘・,000蜀・・繝｡繝ｳ繧ｿ繝ｼ謗ｲ霈峨・繝ｩ繝・ヨ繝輔か繝ｼ繝縲・
        />
        <meta name="twitter:site" content="@in_it_ooo" />
        <meta name="twitter:image" content="https://init.dev/ogp.png" />
        <link rel="icon" type="image/svg+xml" href="/symbol.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
        {/* Google Tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-08DVEJVK5G"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-08DVEJVK5G');
            `,
          }}
        />
      </head>
      <body>
        <Component />
        <FeedbackFAB />
      </body>
    </html>
  );
}
