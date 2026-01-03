export default function Terms() {
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
        <h1 class="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>

        <div class="prose prose-gray max-w-none space-y-8">
          <p class="text-gray-600">
            この利用規約（以下「本規約」）は、コツモ（以下「当社」）が提供するin-it（以下「本サービス」）の利用条件を定めるものです。
          </p>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第1条（適用）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              本規約は、本サービスを利用するすべてのユーザー（メンター・利用者を含む）に適用されます。ユーザーは本規約に同意した上で本サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第2条（サービス内容）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              本サービスは、メンターが自身のスキルや経験を掲載し、利用者がメンターを探すことができるプラットフォームです。当社はメンターと利用者間の契約・取引に関与せず、両者間で直接やり取りを行うものとします。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第3条（利用料金）
            </h2>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li>
                メンター掲載料：月額1,000円（税込）または年額10,000円（税込）
              </li>
              <li>利用者：無料で検索・閲覧可能</li>
              <li>
                メンターと利用者間の契約料金は、当社を介さず直接やり取りされます
              </li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第4条（禁止事項）
            </h2>
            <p class="text-gray-700 leading-relaxed mb-2">
              ユーザーは、以下の行為を行ってはなりません。
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>虚偽の情報を登録・掲載する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>反社会的勢力への利益供与</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第5条（免責事項）
            </h2>
            <ul class="list-disc list-inside text-gray-700 space-y-2">
              <li>
                当社は、メンターと利用者間のトラブルについて一切責任を負いません
              </li>
              <li>
                当社は、本サービスの提供の中断・停止・終了について責任を負いません
              </li>
              <li>
                当社は、ユーザーが本サービスを利用して得た情報の正確性を保証しません
              </li>
            </ul>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第6条（アカウント停止・削除）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              当社は、ユーザーが本規約に違反した場合、事前の通知なくアカウントを停止または削除することができます。この場合、既に支払われた利用料金の返金は行いません。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第7条（規約の変更）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              当社は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上で公開した時点から効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">
              第8条（準拠法・裁判管轄）
            </h2>
            <p class="text-gray-700 leading-relaxed">
              本規約は日本法に準拠し、本サービスに関する紛争については東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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
