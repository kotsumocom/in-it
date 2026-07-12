import { type PageProps } from "$fresh/server.ts";
import FeedbackFAB from "../islands/FeedbackFAB.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>イニッチE- 手数料ゼロのメンター掲載�EラチE��フォーム</title>
        <meta
          name="description"
          content="手数料ゼロ・直接契約OK。月顁E,000冁E��メンターとして掲載できるプラチE��フォーム、E
        />
        {/* OGP */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="イニッチE />
        <meta property="og:title" content="イニッチE- メンターを見つけよぁE />
        <meta
          property="og:description"
          content="プログラミング、デザイン、�EーケチE��ングなど様、E��刁E��のプロに直接相諁E��手数料ゼロ・月顁E,000冁E�Eメンター掲載�EラチE��フォーム、E
        />
        <meta property="og:url" content="https://in-it.dev" />
        <meta property="og:image" content="https://in-it.dev/ogp.png" />
        <meta property="og:locale" content="ja_JP" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="イニッチE- メンターを見つけよぁE />
        <meta
          name="twitter:description"
          content="手数料ゼロ・直接契約OK。月顁E,000冁E�Eメンター掲載�EラチE��フォーム、E
        />
        <meta name="twitter:site" content="@in_it_ooo" />
        <meta name="twitter:image" content="https://in-it.dev/ogp.png" />
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
