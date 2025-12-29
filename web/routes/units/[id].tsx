import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import Header from "../../components/Header.tsx";
import ProgressButton from "../../islands/ProgressButton.tsx";
import { State } from "../_middleware.ts";

interface UnitData {
  unit: {
    id: string;
    title: string;
    description: string | null;
    content_markdown: string | null;
    estimated_duration: number;
    standard_month: number | null;
    grade_category: string;
    parent_id: string | null;
  } | null;
  parent: {
    id: string;
    title: string;
  } | null;
  siblings: {
    id: string;
    title: string;
    order_index: number;
  }[];
  user: State["user"];
  progressStatus: "completed" | "unlocked" | "locked" | null;
}

export const handler: Handlers<UnitData, State> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;

    // 単元を取得
    const { data: unit, error } = await supabase
      .from("units")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !unit) {
      return ctx.render({
        unit: null,
        parent: null,
        siblings: [],
        user: ctx.state.user,
      });
    }

    // 親単元を取得
    let parent = null;
    if (unit.parent_id) {
      const { data: parentData } = await supabase
        .from("units")
        .select("id, title")
        .eq("id", unit.parent_id)
        .single();
      parent = parentData;
    }

    // 兄弟単元を取得（同じ親を持つ単元）
    let siblings: { id: string; title: string; order_index: number }[] = [];
    if (unit.parent_id) {
      const { data: siblingsData } = await supabase
        .from("units")
        .select("id, title, order_index")
        .eq("parent_id", unit.parent_id)
        .order("order_index", { ascending: true });
      siblings = siblingsData || [];
    }

    // ユーザーの進捗を取得
    let progressStatus: "completed" | "unlocked" | "locked" | null = null;
    if (ctx.state.user) {
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("status")
        .eq("user_id", ctx.state.user.id)
        .eq("unit_id", id)
        .single();
      progressStatus = progressData?.status || null;
    }

    return ctx.render({
      unit,
      parent,
      siblings,
      user: ctx.state.user,
      progressStatus,
    });
  },
};

export default function UnitDetailPage({ data }: PageProps<UnitData>) {
  const { unit, parent, siblings, user, progressStatus } = data;

  if (!unit) {
    return (
      <div class="min-h-screen bg-gray-900 text-white">
        <Header user={user} />
        <div class="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 class="text-3xl font-bold mb-4">単元が見つかりません</h1>
          <a
            href="/map"
            class="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← 学習マップに戻る
          </a>
        </div>
      </div>
    );
  }

  // 現在の単元のインデックスを探す
  const currentIndex = siblings.findIndex((s) => s.id === unit.id);
  const prevUnit = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextUnit =
    currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  return (
    <div class="min-h-screen bg-gray-900 text-white">
      <Header user={user} />

      <main class="max-w-4xl mx-auto px-4 py-8">
        {/* パンくずリスト */}
        <nav class="text-sm text-gray-400 mb-6">
          <a href="/map" class="hover:text-white transition-colors">
            学習マップ
          </a>
          {parent && (
            <>
              <span class="mx-2">›</span>
              <a
                href={`/units/${parent.id}`}
                class="hover:text-white transition-colors"
              >
                {parent.title}
              </a>
            </>
          )}
          <span class="mx-2">›</span>
          <span class="text-white">{unit.title}</span>
        </nav>

        {/* メインコンテンツ */}
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
          {/* ヘッダー */}
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full">
                {unit.grade_category.replace("_", " ").toUpperCase()}
              </span>
              {unit.estimated_duration > 0 && (
                <span class="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                  ⏱ 約{unit.estimated_duration}分
                </span>
              )}
              {unit.standard_month && (
                <span class="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                  📅 標準: {unit.standard_month}月
                </span>
              )}
            </div>
            <h1 class="text-3xl font-bold mb-2">{unit.title}</h1>
            {unit.description && (
              <p class="text-gray-400 text-lg">{unit.description}</p>
            )}
          </div>

          {/* コンテンツ */}
          <div class="prose prose-invert max-w-none">
            {unit.content_markdown ? (
              <div
                class="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: unit.content_markdown }}
              />
            ) : (
              <div class="text-center py-12 text-gray-500">
                <div class="text-5xl mb-4">📝</div>
                <p class="text-lg">この単元のコンテンツは準備中です</p>
                <p class="text-sm mt-2">
                  近日中にGist（要点）コンテンツを追加予定です
                </p>
              </div>
            )}
          </div>

          {/* 完了ボタン */}
          <div class="mt-8 pt-8 border-t border-gray-700">
            <ProgressButton
              unitId={unit.id}
              initialStatus={progressStatus}
              isLoggedIn={!!user}
            />
          </div>
        </div>

        {/* ナビゲーション */}
        <div class="flex justify-between items-center">
          {prevUnit ? (
            <a
              href={`/units/${prevUnit.id}`}
              class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span>←</span>
              <span class="text-sm text-gray-400">前の単元</span>
              <span class="font-medium">{prevUnit.title}</span>
            </a>
          ) : (
            <div />
          )}

          {nextUnit ? (
            <a
              href={`/units/${nextUnit.id}`}
              class="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span class="font-medium">{nextUnit.title}</span>
              <span class="text-sm text-gray-400">次の単元</span>
              <span>→</span>
            </a>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
