import { type PageProps } from "$fresh/server.ts";
import FeedbackFAB from "../islands/FeedbackFAB.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>イニット - 手数料ゼロのメンター掲載プラットフォーム</title>
        <meta
          name="description"
          content="手数料ゼロ・直接契約OK。月額1,000円でメンターとして掲載できるプラットフォーム。"
        />
        {/* OGP */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="イニット" />
        <meta property="og:title" content="イニット - メンターを見つけよう" />
        <meta
          property="og:description"
          content="プログラミング、デザイン、マーケティングなど様々な分野のプロに直接相談。手数料ゼロ・月額1,000円のメンター掲載プラットフォーム。"
        />
        <meta property="og:url" content="https://in-it.ooo" />
        <meta property="og:image" content="https://in-it.ooo/ogp.png" />
        <meta property="og:locale" content="ja_JP" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="イニット - メンターを見つけよう" />
        <meta
          name="twitter:description"
          content="手数料ゼロ・直接契約OK。月額1,000円のメンター掲載プラットフォーム。"
        />
        <meta name="twitter:image" content="https://in-it.ooo/ogp.png" />
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
