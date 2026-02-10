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
        question: "イニットとは何ですか？",
        answer:
          "イニットは、手数料ゼロでメンターとして掲載できるプラットフォームです。月額1,000円でプロフィールを公開し、利用者と直接やり取りができます。",
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
          "イニットの利用（メンター検索・閲覧）は無料です。メンターとの契約料金は、各メンターが設定しており、直接お支払いいただきます。",
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
          "登録情報の変更ページ下部の「メンターデータの削除」から削除ください。尚、各スペースのサブスクリプションを解約後でないと、メンターデータは削除できません。",
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
            <img src="/symbol.svg" alt="イニット" class="h-8" />
            <img src="/type.svg" alt="イニット" class="h-5" />
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
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div class="flex items-center gap-3">
              <a
                href="https://x.com/in_it_ooo"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                title="公式X"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://note.com/in_it_ooo"
                target="_blank"
                rel="noopener noreferrer"
                class="w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                title="公式note"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.904 6.162c-.078-1.476-.936-2.496-2.478-2.964-.624-.192-5.4-1.074-8.094-.408C9.696 3.45 8.742 5.154 8.742 7.17v4.596c0 .378.27.588.594.468l.792-.288c.33-.126.594-.51.594-.846V8.238c0-.612.456-1.338 1.056-1.56 0 0 3.87-1.398 6.3-.87 1.014.222 1.56.846 1.56 1.848v6.942c0 1.002-.606 1.62-1.608 1.62-.534 0-2.022-.264-3.222-.534-.912-.204-1.746.168-2.1.846-.354.684-.174 1.476.444 1.92.33.234 3.066 1.53 5.466 1.53 2.058 0 3.474-1.014 3.954-2.754.144-.504.33-3.93.33-5.55V6.162zM6.27 10.86c-.924 0-1.674.75-1.674 1.674 0 .924.75 1.674 1.674 1.674.924 0 1.674-.75 1.674-1.674 0-.924-.75-1.674-1.674-1.674z" />
                </svg>
              </a>
            </div>
            <div class="flex gap-6 text-sm">
              <a href="/" class="hover:text-white">
                トップ
              </a>
              <a href="/terms" class="hover:text-white">
                利用規約
              </a>
              <a href="/privacy" class="hover:text-white">
                プライバシーポリシー
              </a>
            </div>
          </div>
          <p class="text-sm text-center">
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
