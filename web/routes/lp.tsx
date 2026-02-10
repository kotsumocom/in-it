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
        <title>メンター登録 - イニット</title>
        <meta
          name="description"
          content="手数料ゼロ・月額1,000円でメンターとして掲載。直接契約OK、外部リンク自由。イニットでメンターとしての活動を始めましょう。"
        />
        <meta property="og:title" content="メンター登録 - イニット" />
        <meta
          property="og:description"
          content="手数料ゼロ・月額1,000円のメンター掲載プラットフォーム。直接契約OK。"
        />
        <meta property="og:url" content="https://in-it.ooo/lp" />
        <meta property="og:image" content="https://in-it.ooo/ogp.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="メンター登録 - イニット" />
        <meta
          name="twitter:description"
          content="手数料ゼロ・月額1,000円のメンター掲載プラットフォーム"
        />
      </Head>
      {/* ヘッダー */}
      <header class="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="flex items-center">
            <img src="/type.svg" alt="イニット" class="h-8" />
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
                マイページ
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

      {/* ヒーローセクション */}
      <section class="pt-32 pb-20 px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="flex justify-center mb-6">
            <img src="/type.svg" alt="イニット" class="h-16" />
          </div>
          <p class="text-xl md:text-2xl text-gray-700 mb-4">
            手数料ゼロ・直接契約OKの
          </p>
          <p class="text-xl md:text-2xl text-gray-700 mb-8">
            メンター掲載プラットフォーム
          </p>
          <p class="text-lg text-gray-500 mb-10">月額1,000円、それだけ。</p>
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
            こんなお悩みありませんか？
          </h2>
          <div class="space-y-4">
            {[
              "売上の20-30%が手数料で消える",
              "生徒と直接やり取りできない",
              "自分の予約ページに誘導できない",
              "プラットフォームに依存してしまう",
            ].map((pain) => (
              <div class="flex items-center gap-3 text-gray-700">
                <span class="text-2xl">😓</span>
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
            イニットなら、すべて解決。
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "💰",
                title: "手数料0%",
                desc: "売上は100%あなたのもの",
              },
              {
                icon: "📅",
                title: "月額1,000円",
                desc: "固定料金、隠れコストなし",
              },
              {
                icon: "🔗",
                title: "直接取引OK",
                desc: "予約・SNS・Zoom 自由掲載",
              },
              {
                icon: "⚡",
                title: "5分で公開",
                desc: "プロフィール入力だけ",
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

      {/* 招待特典セクション */}
      <section class="py-16 px-4 bg-blue-50">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            🎁 招待で1,000円OFF
          </h2>
          <p class="text-gray-700 mb-6">
            既存メンターからの招待コードで1,000円OFFでお試しできます
          </p>
          <a
            href="/signup"
            class="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-colors"
          >
            招待コードで登録する
          </a>
        </div>
      </section>

      {/* スペースとは？セクション */}
      <section class="py-16 px-4 bg-white">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
            📋 「スペース」とは？
          </h2>
          <p class="text-gray-600 text-center mb-10">
            イニットでは、メンターが作成する相談窓口を「スペース」と呼びます。
          </p>
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">スペースを作成</h3>
                <p class="text-gray-600 text-sm">
                  タイトル、説明文、カテゴリ、連絡先リンクなどを自由に設定。あなただけの相談窓口ページが完成します。
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">生徒が検索・発見</h3>
                <p class="text-gray-600 text-sm">
                  カテゴリやキーワードであなたのスペースが検索結果に表示。SNSでのシェアもかんたんです。
                </p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">直接やり取り開始</h3>
                <p class="text-gray-600 text-sm">
                  スペースに掲載した連絡先から生徒が直接コンタクト。予約システム、LINE、Zoom等お好みの方法で。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section class="py-16 px-4">
        <div class="max-w-xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
            💳 シンプルな料金体系
          </h2>
          <div class="p-8 bg-white border-2 border-blue-600 text-center">
            <p class="text-gray-600 mb-2">月額</p>
            <p class="text-4xl font-bold text-gray-900 mb-6">
              ¥1,000
              <span class="text-base font-normal text-gray-500">（税別）</span>
            </p>
            <ul class="text-left space-y-3 mb-8">
              {[
                "手数料0%",
                "外部リンク可",
                "いつでも解約",
                "招待で1,000円OFF",
              ].map((item) => (
                <li class="flex items-center gap-2 text-gray-700">
                  <span class="text-green-500">✓</span>
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

      {/* 最終CTA */}
      <section class="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div class="max-w-3xl mx-auto text-center text-white">
          <p class="text-xl md:text-2xl mb-2">あなたのスキルを、誰かの力に。</p>
          <p class="text-lg mb-8 opacity-90">手数料に悩まない働き方を。</p>
          <a
            href="/signup"
            class="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            メンター登録を始める
          </a>
        </div>
      </section>

      {/* フッター */}
      <footer class="py-12 px-4 bg-gray-900 text-gray-400">
        <div class="max-w-4xl mx-auto">
          <img src="/type.svg" alt="イニット" class="h-6 mb-6" />
          <div class="flex flex-wrap gap-6 mb-8">
            <a href="/terms" class="hover:text-white">
              利用規約
            </a>
            <a href="/privacy" class="hover:text-white">
              プライバシーポリシー
            </a>
            <a href="/legal" class="hover:text-white">
              特定商取引法に基づく表記
            </a>
            <a
              href="https://forms.gle/6PkZAk7AdMu52qGUA"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-white"
            >
              お問い合わせ
            </a>
          </div>
          <p class="text-sm">© 2025 コツモ</p>
        </div>
      </footer>
    </div>
  );
}
