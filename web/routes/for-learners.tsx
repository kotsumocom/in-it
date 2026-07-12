import { Head } from "$fresh/runtime.ts";

export default function ForLearnersPage() {
  return (
    <div class="min-h-screen bg-white">
      <Head>
        <title>メンターを見つけよぁE- イニッチE/title>
        <meta
          name="description"
          content="プログラミング、デザイン、�EーケチE��ングなど様、E��刁E��のプロに直接相諁E��イニットであなたにぴったりのメンターを見つけましょぁE��E
        />
        <meta property="og:title" content="メンターを見つけよぁE- イニッチE />
        <meta
          property="og:description"
          content="様、E��刁E��のプロに直接相諁E��きるメンタリングプラチE��フォーム"
        />
        <meta property="og:url" content="https://in-it.dev/for-learners" />
        <meta property="og:image" content="https://in-it.dev/ogp.svg" />
      </Head>

      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニッチE class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/" class="text-gray-600 hover:text-gray-900">
              スペ�Eス一覧
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

      {/* ヒ�Eローセクション */}
      <section class="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            あなたにぴったりの
            <br />
            <span class="text-blue-200">プロ</span>に相諁E��よう
          </h1>
          <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            プログラミング、デザイン、�EーケチE��ングなど
            <br class="hidden md:block" />
            様、E��刁E��のメンターが直接相諁E��乗りまぁE
          </p>
          <a
            href="/"
            class="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            メンターを探ぁEↁE
          </a>
        </div>
      </section>

      {/* 利用の流れ */}
      <section class="py-20 px-4 bg-gray-50">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-4 text-gray-900">
            かんたん3スチE��チE
          </h2>
          <p class="text-gray-500 text-center mb-12">
            メンターに相諁E��るまでの流れ
          </p>
          <div class="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 class="text-lg font-bold mb-3 text-gray-900">
                スペ�Eスを探ぁE
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                カチE��リめE��ーワードで、あなた�E悩みに合ったメンターの「スペ�Eス」を検索できます、E
              </p>
            </div>
            {/* Step 2 */}
            <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 class="text-lg font-bold mb-3 text-gray-900">冁E��を確誁E/h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                スペ�Eスの詳細を読んで、メンターの専門刁E��めE��応�E容を確認。�E刁E��合うか判断できます、E
              </p>
            </div>
            {/* Step 3 */}
            <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 class="text-lg font-bold mb-3 text-gray-900">直接相諁E/h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                メンターが掲載してぁE��連絡先から直接コンタクト。仲介手数料�E一刁E��かりません、E
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* メリチE�� */}
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12 text-gray-900">
            イニットが選ばれる琁E��
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
                  メンターとの契紁E��仲介手数料�E発生しません。料金�Eメンターと直接調整できます、E
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
                <h3 class="text-lg font-bold text-gray-900 mb-1">刁E��別検索</h3>
                <p class="text-gray-600">
                  カチE��リめE��グで絞り込み、あなた�E目皁E��合ったメンターをすぐに見つけられます、E
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
                  直接めE��取り
                </h3>
                <p class="text-gray-600">
                  プラチE��フォーム冁E�EチャチE��ではなく、メンターが選んだ連絡手段で直接コミュニケーション、E
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* カチE��リ紹仁E*/}
      <section class="py-20 px-4 bg-gray-50">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4 text-gray-900">
            様、E��刁E��のメンターが在籁E
          </h2>
          <p class="text-gray-500 mb-10">
            あなたが学びたい刁E��のプロが見つかりまぁE
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            {[
              "プログラミング",
              "WebチE��イン",
              "マ�EケチE��ング",
              "動画編雁E,
              "ライチE��ング",
              "英誁E,
              "キャリア相諁E,
              "起業・副業",
              "チE�Eタ刁E��",
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
          <h2 class="text-3xl font-bold mb-4">今すぐメンターを見つけよぁE/h2>
          <p class="text-blue-100 mb-8">
            無料でスペ�Eスを閲覧・メンターに直接連絡できまぁE
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              class="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              スペ�Eス一覧を見る
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
          <div class="flex items-center gap-4">
            <img src="/type.svg" alt="イニッチE class="h-6 brightness-200" />
            <div class="flex items-center gap-2">
              <a
                href="https://x.com/in_it_ooo"
                target="_blank"
                rel="noopener noreferrer"
                class="w-7 h-7 flex items-center justify-center bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                title="公式X"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://note.com/in_it_ooo"
                target="_blank"
                rel="noopener noreferrer"
                class="w-7 h-7 flex items-center justify-center bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                title="公式note"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.904 6.162c-.078-1.476-.936-2.496-2.478-2.964-.624-.192-5.4-1.074-8.094-.408C9.696 3.45 8.742 5.154 8.742 7.17v4.596c0 .378.27.588.594.468l.792-.288c.33-.126.594-.51.594-.846V8.238c0-.612.456-1.338 1.056-1.56 0 0 3.87-1.398 6.3-.87 1.014.222 1.56.846 1.56 1.848v6.942c0 1.002-.606 1.62-1.608 1.62-.534 0-2.022-.264-3.222-.534-.912-.204-1.746.168-2.1.846-.354.684-.174 1.476.444 1.92.33.234 3.066 1.53 5.466 1.53 2.058 0 3.474-1.014 3.954-2.754.144-.504.33-3.93.33-5.55V6.162zM6.27 10.86c-.924 0-1.674.75-1.674 1.674 0 .924.75 1.674 1.674 1.674.924 0 1.674-.75 1.674-1.674 0-.924-.75-1.674-1.674-1.674z" />
                </svg>
              </a>
            </div>
          </div>
          <div class="flex gap-6 text-sm">
            <a href="/faq" class="hover:text-white">
              よくある質啁E
            </a>
            <a href="/terms" class="hover:text-white">
              利用規紁E
            </a>
            <a href="/privacy" class="hover:text-white">
              プライバシーポリシー
            </a>
            <a href="/lp" class="hover:text-white">
              メンター登録
            </a>
          </div>
          <p class="text-sm">&copy; 2025 イニッチE/p>
        </div>
      </footer>
    </div>
  );
}
