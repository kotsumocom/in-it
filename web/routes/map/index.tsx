import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import Header from "../../components/Header.tsx";
import { State } from "../_middleware.ts";

interface Unit {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  grade_category: string;
  parent_id: string | null;
  estimated_duration: number;
  standard_month: number | null;
}

interface MapData {
  units: Unit[];
  user: State["user"];
  progressMap: Record<string, "locked" | "unlocked" | "completed" | "mastered">;
}

export const handler: Handlers<MapData, State> = {
  async GET(_req, ctx) {
    try {
      // フラットなリストとして取得（順番通り）
      const { data, error } = await supabase
        .from("units")
        .select(
          "id, title, description, order_index, grade_category, parent_id, estimated_duration, standard_month"
        )
        .order("grade_category", { ascending: true })
        .order("order_index", { ascending: true });

      if (error) throw error;

      // ログインユーザーの進捗を取得
      let progressMap: Record<
        string,
        "locked" | "unlocked" | "completed" | "mastered"
      > = {};
      if (ctx.state.user) {
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("unit_id, status")
          .eq("user_id", ctx.state.user.id);

        if (progressData) {
          progressMap = progressData.reduce((acc, p) => {
            acc[p.unit_id] = p.status;
            return acc;
          }, {} as Record<string, "locked" | "unlocked" | "completed" | "mastered">);
        }
      }

      return ctx.render({
        units: data || [],
        user: ctx.state.user,
        progressMap,
      });
    } catch (e) {
      console.error(e);
      return ctx.render({ units: [], user: ctx.state.user, progressMap: {} });
    }
  },
};

export default function MapPage({ data }: PageProps<MapData>) {
  const { units, user, progressMap } = data;

  // 完了した単元の数を計算
  const completedCount = Object.values(progressMap).filter(
    (s) => s === "completed" || s === "mastered"
  ).length;

  // カテゴリごとにグループ化
  const categories = units.reduce((acc, unit) => {
    if (!acc[unit.grade_category]) {
      acc[unit.grade_category] = [];
    }
    acc[unit.grade_category].push(unit);
    return acc;
  }, {} as Record<string, Unit[]>);

  const categoryLabels: Record<string, { name: string; grade: string }> = {
    math_1: { name: "数学 I", grade: "高1" },
    math_2: { name: "数学 II", grade: "高2" },
    math_3: { name: "数学 III", grade: "高3" },
    math_a: { name: "数学 A", grade: "高1" },
    math_b: { name: "数学 B", grade: "高2" },
    math_c: { name: "数学 C", grade: "高3" },
  };

  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <Header user={user} />

      <div class="max-w-2xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          学習マップ
        </h1>
        <p class="text-gray-400 text-center mb-8">
          上から順番に学習を進めましょう
        </p>

        {Object.entries(categories).map(([category, categoryUnits]) => (
          <div key={category} class="mb-12">
            {/* カテゴリヘッダー */}
            <div class="sticky top-0 bg-gray-900/95 backdrop-blur-sm py-3 mb-4 z-10 flex items-center gap-3">
              <h2 class="text-xl font-bold text-indigo-400">
                {categoryLabels[category]?.name || category}
              </h2>
              {categoryLabels[category]?.grade && (
                <span class="px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">
                  {categoryLabels[category].grade}
                </span>
              )}
            </div>

            {/* 単元リスト（直線状） */}
            <div class="relative">
              {/* 縦の線 */}
              <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

              {categoryUnits.map((unit, index) => (
                <div key={unit.id} class="relative pl-16 pb-8 last:pb-0">
                  {/* ノードポイント */}
                  <div
                    class={`absolute left-4 w-5 h-5 rounded-full bg-gray-800 border-2 flex items-center justify-center ${
                      progressMap[unit.id] === "completed" ||
                      progressMap[unit.id] === "mastered"
                        ? "border-green-500"
                        : "border-indigo-500"
                    }`}
                  >
                    {progressMap[unit.id] === "completed" ||
                    progressMap[unit.id] === "mastered" ? (
                      <span class="text-green-400 text-xs">✓</span>
                    ) : (
                      <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
                    )}
                  </div>

                  {/* 単元カード */}
                  <a
                    href={`/units/${unit.id}`}
                    class={`block bg-gray-800/80 hover:bg-gray-800 border rounded-xl p-5 transition-all duration-300 hover:shadow-lg ${
                      progressMap[unit.id] === "completed" ||
                      progressMap[unit.id] === "mastered"
                        ? "border-green-500/50 hover:border-green-400 hover:shadow-green-500/20"
                        : "border-gray-700 hover:border-indigo-500 hover:shadow-indigo-500/20"
                    }`}
                  >
                    <div class="flex items-start justify-between mb-2">
                      <span class="text-xs font-mono text-gray-500">
                        #{index + 1}
                      </span>
                      <div class="flex gap-2">
                        {unit.estimated_duration > 0 && (
                          <span class="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full">
                            ⏱ {unit.estimated_duration}分
                          </span>
                        )}
                        {unit.standard_month && (
                          <span class="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                            {unit.standard_month}月
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 class="text-lg font-bold mb-1 group-hover:text-indigo-300">
                      {unit.title}
                    </h3>

                    {unit.description && (
                      <p class="text-sm text-gray-400">{unit.description}</p>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}

        {units.length === 0 && (
          <div class="text-center py-16 text-gray-500">
            <div class="text-5xl mb-4">📚</div>
            <p>単元データがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
