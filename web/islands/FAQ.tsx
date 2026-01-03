import { useState } from "preact/hooks";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: { category: string; items: FAQItem[] }[] = [
  {
    category: "サービスについて",
    items: [
      {
        question: "in-itとは何ですか？",
        answer:
          "in-itは、手数料ゼロでメンターとして掲載できるプラットフォームです。月額1,000円でプロフィールを公開し、利用者と直接やり取りができます。",
      },
      {
        question: "メンターと利用者のマッチングは行っていますか？",
        answer:
          "いいえ、当社はマッチングや仲介は行いません。メンターのプロフィール掲載のみを提供し、連絡・契約は両者間で直接行っていただきます。",
      },
      {
        question: "手数料はかかりますか？",
        answer:
          "メンターと利用者間の取引に対する手数料は一切いただきません。月額掲載料（1,000円/月 or 10,000円/年）のみです。",
      },
    ],
  },
  {
    category: "メンター向け",
    items: [
      {
        question: "メンターとして掲載するにはどうすればいいですか？",
        answer:
          "1. アカウント登録 → 2. プロフィール作成 → 3. スペース（掲載ページ）作成 → 4. 月額プランに登録 で公開できます。",
      },
      {
        question: "掲載料金はいくらですか？",
        answer:
          "月額1,000円（税込）または年額10,000円（税込・2ヶ月分お得）です。",
      },
      {
        question: "掲載を停止したい場合は？",
        answer:
          "マイページからいつでもサブスクリプションをキャンセルできます。キャンセル後は次の更新日まで掲載が継続され、その後非公開となります。",
      },
      {
        question: "複数の専門分野で掲載できますか？",
        answer:
          "はい、1つのアカウントで複数のスペース（掲載ページ）を作成できます。それぞれ別途月額料金がかかります。",
      },
    ],
  },
  {
    category: "利用者向け",
    items: [
      {
        question: "メンターへの連絡方法は？",
        answer:
          "各メンターのプロフィールページに記載された連絡先（X、Webサイト等）から直接ご連絡ください。",
      },
      {
        question: "利用料金はかかりますか？",
        answer:
          "in-itの利用（メンター検索・閲覧）は無料です。メンターとの契約料金は、各メンターが設定しており、直接お支払いいただきます。",
      },
      {
        question: "トラブルがあった場合は？",
        answer:
          "メンターと利用者間のトラブルについては、当社は関与・仲裁いたしません。ただし、違法行為や規約違反があった場合はお問い合わせからご報告ください。",
      },
    ],
  },
  {
    category: "アカウント・決済",
    items: [
      {
        question: "支払い方法は？",
        answer:
          "クレジットカード（Visa, Mastercard, JCB, American Express）に対応しています。決済はStripeを通じて安全に処理されます。",
      },
      {
        question: "領収書は発行できますか？",
        answer:
          "はい、決済完了後にメールで領収書が送信されます。また、Stripeの管理画面からもダウンロード可能です。",
      },
      {
        question: "アカウントを削除したい場合は？",
        answer:
          "お問い合わせページからアカウント削除をご依頼ください。サブスクリプション解約後、データを完全に削除いたします。",
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div class="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="w-full py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span class="font-medium text-gray-900">{item.question}</span>
        <svg
          class={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div class="pb-4 text-gray-600">{item.answer}</div>}
    </div>
  );
}

export default function FAQ() {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-2">
            <img src="/symbol.svg" alt="in-it" class="h-8" />
            <img src="/type.svg" alt="in-it" class="h-5" />
          </a>
        </div>
      </header>

      {/* コンテンツ */}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">
          よくある質問（FAQ）
        </h1>

        <div class="space-y-8">
          {faqs.map((section) => (
            <div
              key={section.category}
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 class="text-lg font-bold text-gray-900 mb-4">
                {section.category}
              </h2>
              <div>
                {section.items.map((item, index) => (
                  <FAQAccordion key={index} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div class="mt-12 text-center">
          <p class="text-gray-600 mb-4">
            お探しの回答が見つからない場合は、お気軽にお問い合わせください。
          </p>
          <a
            href="/contact"
            class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            お問い合わせ
          </a>
        </div>
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
