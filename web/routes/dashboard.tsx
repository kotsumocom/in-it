import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "./_middleware.ts";
import Header from "../components/Header.tsx";

interface ProgressStats {
  totalUnits: number;
  completedUnits: number;
  completedList: {
    id: string;
    title: string;
    completed_at: string | null;
    standard_month: number | null;
  }[];
  currentMonth: number;
  monthsAhead: number;
}

interface DashboardData {
  nickname: string | null;
  user: State["user"];
  stats: ProgressStats;
}

export const handler: Handlers<DashboardData, State> = {
  async GET(_req, ctx) {
    // 未ログインの場合はログインページへリダイレクト
    if (!ctx.state.user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    // 全単元数を取得
    const { count: totalUnits } = await supabase
      .from("units")
      .select("*", { count: "exact", head: true });

    // ユーザーの完了済み単元を取得
    const { data: progressData } = await supabase
      .from("user_progress")
      .select(
        `
        unit_id,
        status,
        completed_at,
        units (
          id,
          title,
          standard_month,
          grade_category
        )
      `
      )
      .eq("user_id", ctx.state.user.id)
      .eq("status", "completed");

    const completedList = (progressData || []).map((p: any) => ({
      id: p.units?.id || p.unit_id,
      title: p.units?.title || "不明",
      completed_at: p.completed_at,
      standard_month: p.units?.standard_month,
    }));

    // 現在の月を取得
    const currentMonth = new Date().getMonth() + 1;

    // 先取り月数を計算（完了した単元の最大standard_monthと現在月の差）
    let monthsAhead = 0;
    if (completedList.length > 0) {
      const maxStandardMonth = Math.max(
        ...completedList
          .filter((c) => c.standard_month !== null)
          .map((c) => c.standard_month!)
      );
      if (maxStandardMonth > currentMonth) {
        monthsAhead = maxStandardMonth - currentMonth;
      }
    }

    const stats: ProgressStats = {
      totalUnits: totalUnits || 0,
      completedUnits: completedList.length,
      completedList,
      currentMonth,
      monthsAhead,
    };

    return ctx.render({
      nickname: ctx.state.user.nickname,
      user: ctx.state.user,
      stats,
    });
  },
};

function getLevelInfo(completedUnits: number): {
  name: string;
  color: string;
  description: string;
} {
  if (completedUnits === 0) {
    return {
      name: "入門者",
      color: "from-gray-400 to-gray-500",
      description: "学習を始めましょう！",
    };
  } else if (completedUnits < 5) {
    return {
      name: "初心者",
      color: "from-green-400 to-emerald-500",
      description: "順調なスタートです！",
    };
  } else if (completedUnits < 10) {
    return {
      name: "学習者",
      color: "from-blue-400 to-cyan-500",
      description: "着実に進んでいます！",
    };
  } else if (completedUnits < 20) {
    return {
      name: "熟練者",
      color: "from-purple-400 to-pink-500",
      description: "素晴らしい進捗！",
    };
  } else {
    return {
      name: "マスター",
      color: "from-yellow-400 to-orange-500",
      description: "圧倒的な学習力！",
    };
  }
}

export default function DashboardPage({ data }: PageProps<DashboardData>) {
  const { nickname, user, stats } = data;
  const displayName = nickname || "ユーザー";
  const level = getLevelInfo(stats.completedUnits);
  const progressPercent =
    stats.totalUnits > 0
      ? Math.round((stats.completedUnits / stats.totalUnits) * 100)
      : 0;

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
      <Header user={user} />

      {/* Main Content */}
      <main class="max-w-6xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2">
            こんにちは、{displayName}さん！
          </h1>
          <p class="text-gray-400">あなたの学習ダッシュボード</p>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* レベルカード */}
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div class="text-sm text-gray-400 mb-2">現在のレベル</div>
            <div
              class={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${level.color}`}
            >
              {level.name}
            </div>
            <div class="text-xs text-gray-500 mt-1">{level.description}</div>
          </div>

          {/* 完了単元カード */}
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div class="text-sm text-gray-400 mb-2">完了した単元</div>
            <div class="text-2xl font-bold">
              {stats.completedUnits} / {stats.totalUnits}
            </div>
            {/* プログレスバー */}
            <div class="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={`width: ${progressPercent}%`}
              ></div>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {progressPercent}% 完了
            </div>
          </div>

          {/* 先取り状況カード */}
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div class="text-sm text-gray-400 mb-2">先取り状況</div>
            {stats.monthsAhead > 0 ? (
              <>
                <div class="text-2xl font-bold text-green-400">
                  +{stats.monthsAhead}ヶ月
                </div>
                <div class="text-xs text-green-500 mt-1">
                  🚀 標準より先に進んでいます！
                </div>
              </>
            ) : stats.completedUnits > 0 ? (
              <>
                <div class="text-2xl font-bold text-blue-400">標準ペース</div>
                <div class="text-xs text-gray-500 mt-1">
                  📅 現在: {stats.currentMonth}月
                </div>
              </>
            ) : (
              <>
                <div class="text-2xl font-bold">—</div>
                <div class="text-xs text-gray-500 mt-1">
                  まだ単元を完了していません
                </div>
              </>
            )}
          </div>
        </div>

        {/* 最近完了した単元 */}
        {stats.completedList.length > 0 && (
          <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <h2 class="text-xl font-bold mb-4">✓ 完了した単元</h2>
            <div class="space-y-3">
              {stats.completedList.slice(0, 5).map((unit) => (
                <a
                  key={unit.id}
                  href={`/units/${unit.id}`}
                  class="flex items-center justify-between p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <span class="text-green-400 text-lg">✓</span>
                    <span>{unit.title}</span>
                  </div>
                  {unit.completed_at && (
                    <span class="text-xs text-gray-500">
                      {new Date(unit.completed_at).toLocaleDateString("ja-JP")}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 class="text-xl font-bold mb-4">クイックアクション</h2>
          <div class="flex flex-wrap gap-4">
            <a
              href="/map"
              class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
            >
              📚 学習マップを見る
            </a>
            {stats.completedUnits === 0 && (
              <a
                href="/map"
                class="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all duration-300"
              >
                🚀 最初の単元を始める
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
