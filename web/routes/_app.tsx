import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>in-it - 手数料ゼロのメンター掲載プラットフォーム</title>
        <meta
          name="description"
          content="手数料ゼロ・直接契約OK。月額1,000円でメンターとして掲載できるプラットフォーム。"
        />
        <link rel="icon" type="image/svg+xml" href="/symbol.svg" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
