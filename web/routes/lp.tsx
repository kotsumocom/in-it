import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { State } from "./_middleware.ts";

interface LPData {
  user: State["user"];
}

export const handler: Handlers<LPData, State> = {
  GET(_req, ctx) {
    return ctx.render({ user: ctx.state.user });
  },
};

export default function LandingPage({ data }: PageProps<LPData>) {
  const { user } = data;

  return (
    <div class="min-h-screen bg-white">
      <Head>
        <title>メンター登録 - イニッチE/title>
        <meta
          name="description"
          content="手数料ゼロ・月顁E,000冁E��メンターとして掲載。直接契約OK、外部リンク自由。イニットでメンターとしての活動を始めましょぁE��E
        />
        <meta property="og:title" content="メンター登録 - イニッチE />
        <meta
          property="og:description"
          content="手数料ゼロ・月顁E,000冁E�Eメンター掲載�EラチE��フォーム。直接契約OK、E
        />
        <meta property="og:url" content="https://in-it.dev/lp" />
        <meta property="og:image" content="https://in-it.dev/ogp.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="メンター登録 - イニッチE />
        <meta
          name="twitter:description"
          content="手数料ゼロ・月顁E,000冁E�Eメンター掲載�EラチE��フォーム"
        />
      </Head>
      {/* ヘッダー */}
      <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニッチE class="h-8" />
          </a>
          <nav class="flex items-center gap-4">
            <a href="/mentors" class="text-gray-600 hover:text-gray-900">
              メンター一覧
            </a>
            {user ? (
              <a
                href="/dashboard"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                マイペ�Eジ
              </a>
            ) : (
              <a
                href="/login"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                ログイン
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* ヒ�Eローセクション */}
      <section class="pt-32 pb-20 px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="flex justify-center mb-6">
            <img src="/type.svg" alt="イニッチE class="h-16" />
          </div>
          <p class="text-xl md:text-2xl text-gray-700 mb-4">
            手数料ゼロ・直接契約OKの
          </p>
          <p class="text-xl md:text-2xl text-gray-700 mb-8">
            メンター掲載�EラチE��フォーム
          </p>
          <p class="text-lg text-gray-500 mb-10">月顁E,000冁E��それだけ、E/p>
          <a
            href="/signup"
            class="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            今すぐ登録する
          </a>
        </div>
      </section>

      {/* ペインポイントセクション */}
      <section class="py-16 px-4 bg-gray-50">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
            こんなお悩みありませんか！E          </h2>
          <div class="space-y-4">
            {[
              "売上�E20-30%が手数料で消えめE,
              "生徒と直接めE��取りできなぁE,
              "自刁E�E予紁E�Eージに誘導できなぁE,
              "プラチE��フォームに依存してしまぁE,
            ].map((pain) => (
              <div class="flex items-center gap-3 text-gray-700">
                <span class="text-2xl">�E</span>
                <span class="text-lg">{pain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ソリューションセクション */}
      <section class="py-16 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-10 text-center">
            イニットなら、すべて解決、E          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "💰",
                title: "手数斁E%",
                desc: "売上�E100%あなた�Eも�E",
              },
              {
                icon: "📅",
                title: "月顁E,000冁E,
                desc: "固定料金、E��れコストなぁE,
              },
              {
                icon: "🔗",
                title: "直接取引OK",
                desc: "予紁E�ESNS・Zoom 自由掲輁E,
              },
              {
                icon: "⚡",
                title: "5刁E��公閁E,
                desc: "プロフィール入力だぁE,
              },
            ].map((feature) => (
              <div class="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <div class="text-3xl mb-3">{feature.icon}</div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p class="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 招征E��典セクション */}
      <section class="py-16 px-4 bg-blue-50">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            🎁 招征E��1,000冁EFF
          </h2>
          <p class="text-gray-700 mb-6">
            既存メンターからの招征E��ードで1,000冁EFFでお試しできまぁE          </p>
          <a
            href="/signup"
            class="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-colors"
          >
            招征E��ードで登録する
          </a>
        </div>
      </section>

      {/* スペ�Eスとは�E�セクション */}
      <section class="py-16 px-4 bg-white">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
            📋 「スペ�Eス」とは�E�E          </h2>
          <p class="text-gray-600 text-center mb-10">
            イニットでは、メンターが作�Eする相諁E��口を「スペ�Eス」と呼びます、E          </p>
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">スペ�Eスを作�E</h3>
                <p class="text-gray-600 text-sm">
                  タイトル、説明文、カチE��リ、E��絡先リンクなどを�E由に設定。あなただけ�E相諁E��口ペ�Eジが完�Eします、E                </p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">生徒が検索・発要E/h3>
                <p class="text-gray-600 text-sm">
                  カチE��リめE��ーワードであなた�Eスペ�Eスが検索結果に表示。SNSでのシェアもかんたんです、E                </p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">直接めE��取り開姁E/h3>
                <p class="text-gray-600 text-sm">
                  スペ�Eスに掲載した連絡先から生徒が直接コンタクト。予紁E��スチE��、LINE、Zoom等お好みの方法で、E                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料��セクション */}
      <section class="py-16 px-4">
        <div class="max-w-xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
            💳 シンプルな料��体系
          </h2>
          <div class="p-8 bg-white border-2 border-blue-600 text-center">
            <p class="text-gray-600 mb-2">月顁E/p>
            <p class="text-4xl font-bold text-gray-900 mb-6">
              ¥1,000
              <span class="text-base font-normal text-gray-500">�E�税別�E�E/span>
            </p>
            <ul class="text-left space-y-3 mb-8">
              {[
                "手数斁E%",
                "外部リンク可",
                "ぁE��でも解紁E,
                "招征E��1,000冁EFF",
              ].map((item) => (
                <li class="flex items-center gap-2 text-gray-700">
                  <span class="text-green-500">✁E/span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              class="inline-block w-full px-6 py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              今すぐ登録
            </a>
          </div>
        </div>
      </section>

      {/* 最絁ETA */}
      <section class="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div class="max-w-3xl mx-auto text-center text-white">
          <p class="text-xl md:text-2xl mb-2">あなた�Eスキルを、誰か�E力に、E/p>
          <p class="text-lg mb-8 opacity-90">手数料に悩まなぁE��き方を、E/p>
          <a
            href="/signup"
            class="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            メンター登録を始めめE          </a>
        </div>
      </section>

      {/* フッター */}
      <footer class="py-12 px-4 bg-gray-900 text-gray-400">
        <div class="max-w-4xl mx-auto">
          <img src="/type.svg" alt="イニッチE class="h-6 mb-6" />
          <div class="flex flex-wrap gap-6 mb-8">
            <a href="/terms" class="hover:text-white">
              利用規紁E            </a>
            <a href="/privacy" class="hover:text-white">
              プライバシーポリシー
            </a>
            <a href="/legal" class="hover:text-white">
              特定商取引法に基づく表訁E            </a>
            <a
              href="https://forms.gle/6PkZAk7AdMu52qGUA"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-white"
            >
              お問ぁE��わせ
            </a>
          </div>
          <p class="text-sm">© 2025 コチE��</p>
        </div>
      </footer>
    </div>
  );
}
