import { Head } from "$fresh/runtime.ts";

export default function ForLearnersPage() {
  return (
    <div class="min-h-screen bg-white">
      <Head>
        <title>メンターを見つけよう - イニット</title>
        <meta
          name="description"
          content="プログラミング、デザイン、マーケティングなど様々な分野のプロに直接相談。イニットであなたにぴったりのメンターを見つけましょう。"
        />
        <meta property="og:title" content="メンターを見つけよう - イニット" />
        <meta
          property="og:description"
          content="様々な分野のプロに直接相談できるメンタリングプラットフォーム"
        />
        <meta property="og:url" content="https://in-it.ooo/for-learners" />
        <meta property="og:image" content="https://in-it.ooo/ogp.svg" />
      </Head>

      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="in-it" class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/" class="text-gray-600 hover:text-gray-900">
              スペース一覧
            </a>
            <a
              href="/login"
              class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg"
            >
              ログイン
            </a>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section class="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            あなたにぴったりの
            <br />
            <span class="text-blue-200">プロ</span>に相談しよう
          </h1>
          <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            プログラミング、デザイン、マーケティングなど
            <br class="hidden md:block" />
            様々な分野のメンターが直接相談に乗ります
          </p>
          <a
            href="/"
            class="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            メンターを探す →
          </a>
        </div>
      </section>

      {/* 利用の流れ */}
      <section class="py-20 px-4 bg-gray-50">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-4 text-gray-900">
            かんたん3ステップ
          </h2>
          <p class="text-gray-500 text-center mb-12">
            メンターに相談するまでの流れ
          </p>
          <div class="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 class="text-lg font-bold mb-3 text-gray-900">
                スペースを探す
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                カテゴリやキーワードで、あなたの悩みに合ったメンターの「スペース」を検索できます。
              </p>
            </div>
            {/* Step 2 */}
            <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 class="text-lg font-bold mb-3 text-gray-900">内容を確認</h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                スペースの詳細を読んで、メンターの専門分野や対応内容を確認。自分に合うか判断できます。
              </p>
            </div>
            {/* Step 3 */}
            <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 class="text-lg font-bold mb-3 text-gray-900">直接相談</h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                メンターが掲載している連絡先から直接コンタクト。仲介手数料は一切かかりません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* メリット */}
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
            イニットが選ばれる理由
          </h2>
          <div class="space-y-8">
            <div class="flex items-start gap-6">
              <div class="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">
                  仲介手数料ゼロ
                </h3>
                <p class="text-gray-600">
                  メンターとの契約に仲介手数料は発生しません。料金はメンターと直接調整できます。
                </p>
              </div>
            </div>
            <div class="flex items-start gap-6">
              <div class="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">分野別検索</h3>
                <p class="text-gray-600">
                  カテゴリやタグで絞り込み、あなたの目的に合ったメンターをすぐに見つけられます。
                </p>
              </div>
            </div>
            <div class="flex items-start gap-6">
              <div class="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">
                  直接やり取り
                </h3>
                <p class="text-gray-600">
                  プラットフォーム内のチャットではなく、メンターが選んだ連絡手段で直接コミュニケーション。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* カテゴリ紹介 */}
      <section class="py-20 px-4 bg-gray-50">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4 text-gray-900">
            様々な分野のメンターが在籍
          </h2>
          <p class="text-gray-500 mb-10">
            あなたが学びたい分野のプロが見つかります
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            {[
              "プログラミング",
              "Webデザイン",
              "マーケティング",
              "動画編集",
              "ライティング",
              "英語",
              "キャリア相談",
              "起業・副業",
              "データ分析",
              "UI/UX",
            ].map((cat) => (
              <span
                key={cat}
                class="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 text-sm font-medium shadow-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">今すぐメンターを見つけよう</h2>
          <p class="text-blue-100 mb-8">
            無料でスペースを閲覧・メンターに直接連絡できます
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              class="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              スペース一覧を見る
            </a>
            <a
              href="/lp"
              class="inline-block border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white hover:text-blue-700 transition-colors"
            >
              メンターとして登録
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer class="bg-gray-900 text-gray-400 py-8 px-4">
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/type.svg" alt="in-it" class="h-6 brightness-200" />
          <div class="flex gap-6 text-sm">
            <a href="/terms" class="hover:text-white">
              利用規約
            </a>
            <a href="/privacy" class="hover:text-white">
              プライバシーポリシー
            </a>
            <a href="/lp" class="hover:text-white">
              メンター登録
            </a>
          </div>
          <p class="text-sm">&copy; 2025 in-it</p>
        </div>
      </footer>
    </div>
  );
}
