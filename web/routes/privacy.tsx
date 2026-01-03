export default function Privacy() {
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
          プライバシーポリシー
        </h1>

        <div class="prose prose-gray max-w-none space-y-8">
          <p class="text-gray-600">
            コツモ（以下「当社」）は、in-it（以下「本サービス」）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
          </p>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第1条（収集する情報）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              当社は、本サービスの提供にあたり、以下の情報を収集することがあります。
            </p>
            <ul class="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>氏名、メールアドレス等の連絡先情報</li>
              <li>プロフィール情報（自己紹介、スキル、経歴等）</li>
              <li>決済情報（クレジットカード情報は決済代行会社が保持）</li>
              <li>サービス利用履歴、アクセスログ</li>
              <li>その他、本サービスの利用に際して取得する情報</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第2条（利用目的）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              当社は、収集した情報を以下の目的で利用します。
            </p>
            <ul class="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザーへの連絡・通知</li>
              <li>利用料金の請求</li>
              <li>不正利用の防止、利用規約違反への対応</li>
              <li>統計データの作成・分析（個人を特定しない形式）</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第3条（第三者提供）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              当社は、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。
            </p>
            <ul class="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護に必要な場合</li>
              <li>公衆衛生・児童の健全育成に必要な場合</li>
              <li>国の機関等への協力が必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第4条（開示・訂正・削除）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              ユーザーは、当社に対して個人情報の開示・訂正・削除を請求することができます。請求の際は、本人確認を行った上で対応いたします。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第5条（Cookie等の使用）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              本サービスでは、ユーザー体験向上のためCookieを使用しています。ブラウザ設定によりCookieを無効化できますが、一部機能が制限される場合があります。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第6条（お問い合わせ）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              本ポリシーに関するお問い合わせは、
              <a href="/contact" class="text-blue-600 hover:underline">
                お問い合わせページ
              </a>
              よりご連絡ください。
            </p>
          </section>

          <p class="text-gray-500 text-sm mt-12">制定日：2025年1月1日</p>
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
