import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import { State } from "./_middleware.ts";

interface HomeData {
  user: State["user"];
}

export const handler: Handlers<HomeData, State> = {
  GET(_req, ctx) {
    return ctx.render({ user: ctx.state.user });
  },
};

export default function Home({ data }: PageProps<HomeData>) {
  const { user } = data;

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
      <Header user={user} />

      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-4 py-8">
        <h1 class="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          in-it
        </h1>
        <p class="text-xl text-gray-300 mb-8 text-center">
          あなたの学習を可視化する、スキルマッププラットフォーム
        </p>
        <div class="flex gap-4 flex-wrap justify-center">
          <a
            href="/map"
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
          >
            学習マップを見る
          </a>
          {user ? (
            <a
              href="/dashboard"
              class="px-6 py-3 border border-gray-500 hover:border-indigo-400 rounded-lg font-semibold transition-all duration-300"
            >
              ダッシュボード
            </a>
          ) : (
            <a
              href="/signup"
              class="px-6 py-3 border border-gray-500 hover:border-indigo-400 rounded-lg font-semibold transition-all duration-300"
            >
              無料で始める
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
