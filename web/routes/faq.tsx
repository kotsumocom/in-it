import { Head } from "$fresh/runtime.ts";
import FAQ from "../islands/FAQ.tsx";

// FAQ構造化データ�E�ESON-LD�E�E
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "イニットとは何ですか�E�E,
      acceptedAnswer: {
        "@type": "Answer",
        text: "イニット�E、手数料ゼロでメンターとして掲載できるプラチE��フォームです。月顁E,000冁E��プロフィールを�E開し、利用老E��直接めE��取りができます、E,
      },
    },
    {
      "@type": "Question",
      name: "手数料�Eかかりますか�E�E,
      acceptedAnswer: {
        "@type": "Answer",
        text: "メンターと利用老E��の取引に対する手数料�E一刁E��ただきません。月額掲載料�E�E,000冁E朁Eor 10,000冁E年�E��Eみです、E,
      },
    },
    {
      "@type": "Question",
      name: "メンターとして掲載するにはどぁE��れ�EぁE��ですか�E�E,
      acceptedAnswer: {
        "@type": "Answer",
        text: "1. アカウント登録 ↁE2. プロフィール作�E ↁE3. スペ�Eス�E�掲載�Eージ�E�作�E ↁE4. 月額�Eランに登録 で公開できます、E,
      },
    },
    {
      "@type": "Question",
      name: "掲載料金�EぁE��らですか�E�E,
      acceptedAnswer: {
        "@type": "Answer",
        text: "月顁E,000冁E��税込�E�また�E年顁E0,000冁E��税込・2ヶ月�Eお得）です、E,
      },
    },
    {
      "@type": "Question",
      name: "利用料��はかかりますか�E�E,
      acceptedAnswer: {
        "@type": "Answer",
        text: "イニット�E利用�E�メンター検索・閲覧�E��E無料です。メンターとの契紁E��金�E、各メンターが設定しており、直接お支払いぁE��だきます、E,
      },
    },
    {
      "@type": "Question",
      name: "支払い方法�E�E�E,
      acceptedAnswer: {
        "@type": "Answer",
        text: "クレジチE��カード！Eisa, Mastercard, JCB, American Express�E�に対応してぁE��す。決済�EStripeを通じて安�Eに処琁E��れます、E,
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>よくある質問！EAQ�E�E- イニッチE/title>
        <meta
          name="description"
          content="イニットに関するよくある質問をまとめました。サービス冁E��、料金、メンター登録方法、利用方法などにつぁE��お答えします、E
        />
        <meta property="og:title" content="よくある質問！EAQ�E�E- イニッチE />
        <meta
          property="og:description"
          content="イニットに関するよくある質問をまとめました。サービス冁E��、料金、メンター登録方法、利用方法などにつぁE��お答えします、E
        />
        <meta property="og:url" content="https://in-it.dev/faq" />
        <meta property="og:image" content="https://in-it.dev/ogp.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="よくある質問！EAQ�E�E- イニッチE />
        <meta
          name="twitter:description"
          content="イニットに関するよくある質問をまとめました。料金、登録方法、利用方法などにつぁE��お答えします、E
        />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Head>
      <FAQ />
    </>
  );
}
