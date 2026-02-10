import { Head } from "$fresh/runtime.ts";
import FAQ from "../islands/FAQ.tsx";

// FAQ構造化データ（JSON-LD）
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "イニットとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "イニットは、手数料ゼロでメンターとして掲載できるプラットフォームです。月額1,000円でプロフィールを公開し、利用者と直接やり取りができます。",
      },
    },
    {
      "@type": "Question",
      name: "手数料はかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "メンターと利用者間の取引に対する手数料は一切いただきません。月額掲載料（1,000円/月 or 10,000円/年）のみです。",
      },
    },
    {
      "@type": "Question",
      name: "メンターとして掲載するにはどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1. アカウント登録 → 2. プロフィール作成 → 3. スペース（掲載ページ）作成 → 4. 月額プランに登録 で公開できます。",
      },
    },
    {
      "@type": "Question",
      name: "掲載料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "月額1,000円（税込）または年額10,000円（税込・2ヶ月分お得）です。",
      },
    },
    {
      "@type": "Question",
      name: "利用料金はかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "イニットの利用（メンター検索・閲覧）は無料です。メンターとの契約料金は、各メンターが設定しており、直接お支払いいただきます。",
      },
    },
    {
      "@type": "Question",
      name: "支払い方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "クレジットカード（Visa, Mastercard, JCB, American Express）に対応しています。決済はStripeを通じて安全に処理されます。",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>よくある質問（FAQ） - イニット</title>
        <meta
          name="description"
          content="イニットに関するよくある質問をまとめました。サービス内容、料金、メンター登録方法、利用方法などについてお答えします。"
        />
        <meta property="og:title" content="よくある質問（FAQ） - イニット" />
        <meta
          property="og:description"
          content="イニットに関するよくある質問をまとめました。サービス内容、料金、メンター登録方法、利用方法などについてお答えします。"
        />
        <meta property="og:url" content="https://in-it.ooo/faq" />
        <meta property="og:image" content="https://in-it.ooo/ogp.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="よくある質問（FAQ） - イニット" />
        <meta
          name="twitter:description"
          content="イニットに関するよくある質問をまとめました。料金、登録方法、利用方法などについてお答えします。"
        />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Head>
      <FAQ />
    </>
  );
}
