import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - ページが見つかりません</title>
      </Head>
      <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div class="text-center">
          <img src="/type.svg" alt="in-it" class="h-12 mx-auto mb-8" />
          <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p class="text-xl text-gray-600 mb-8">ページが見つかりませんでした</p>
          <a
            href="/"
            class="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            トップページに戻る
          </a>
        </div>
      </div>
    </>
  );
}
