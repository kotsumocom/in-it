export default function Contact() {
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
        <h1 class="text-3xl font-bold text-gray-900 mb-8">お問い合わせ</h1>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p class="text-gray-700 mb-6">
            in-itに関するお問い合わせは、以下のメールアドレスまでご連絡ください。
          </p>

          <div class="bg-gray-50 rounded-lg p-6 mb-8">
            <p class="text-sm text-gray-500 mb-2">メールアドレス</p>
            <a
              href="mailto:support@in-it.ooo"
              class="text-xl text-blue-600 hover:underline font-medium"
            >
              support@in-it.ooo
            </a>
          </div>

          <div class="space-y-4 text-gray-600">
            <p>
              お問い合わせの際は、以下の情報をご記載いただけるとスムーズに対応できます。
            </p>
            <ul class="list-disc list-inside space-y-1">
              <li>お名前（ニックネーム可）</li>
              <li>登録メールアドレス（アカウントをお持ちの場合）</li>
              <li>お問い合わせ内容の詳細</li>
            </ul>
          </div>

          <div class="mt-8 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>回答までの目安：</strong>
              通常2〜3営業日以内にご返信いたします。
            </p>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">よくある質問</h2>
          <p class="text-gray-600">
            お問い合わせの前に、
            <a href="/faq" class="text-blue-600 hover:underline">
              FAQ（よくある質問）
            </a>
            もご確認ください。
          </p>
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
