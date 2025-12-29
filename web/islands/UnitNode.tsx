import { Unit } from "@in-it/backend/services/units.ts";
import { useState } from "preact/hooks";

interface UnitNodeProps {
  unit: Unit;
  level: number;
}

export default function UnitNode({ unit, level }: UnitNodeProps) {
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren = unit.children && unit.children.length > 0;

  const handleCardClick = (e: MouseEvent) => {
    // リンククリック時は展開/折りたたみしない
    if ((e.target as HTMLElement).tagName === "A") {
      return;
    }
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div class="flex flex-col items-center">
      {/* Node Card */}
      <div
        class={`
          relative z-10 w-64 p-4 rounded-xl border-2 transition-all duration-300
          ${
            level === 0
              ? "bg-indigo-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              : "bg-gray-800 border-gray-600 hover:border-blue-400"
          }
        `}
      >
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-mono text-gray-400">Lv.{level + 1}</span>
          <span
            class={`text-xs px-2 py-0.5 rounded-full ${
              unit.status === "completed"
                ? "bg-green-500/20 text-green-400"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {unit.status === "completed"
              ? "完了"
              : unit.status === "unlocked"
              ? "学習可能"
              : unit.status === "mastered"
              ? "マスター"
              : "未開放"}
          </span>
        </div>

        {/* タイトル（クリックで詳細ページへ） */}
        <a
          href={`/units/${unit.id}`}
          class="block font-bold text-lg mb-1 hover:text-indigo-300 transition-colors"
        >
          {unit.title}
        </a>

        {unit.standard_month && (
          <div class="text-xs text-blue-300">
            標準学習月: {unit.standard_month}月
          </div>
        )}

        {/* 展開/折りたたみボタン */}
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            class="mt-3 w-full py-1 text-xs text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
          >
            {isOpen ? "▲ 閉じる" : `▼ ${unit.children!.length}件の子単元を表示`}
          </button>
        )}
      </div>

      {/* Children Connection Lines (Simplified) */}
      {hasChildren && isOpen && (
        <div class="flex flex-col items-center w-full">
          <div class="h-8 w-px bg-gray-600"></div>
          <div class="flex flex-wrap justify-center gap-6 relative pt-4 border-t border-gray-600 w-full px-4">
            {unit.children!.map((child) => (
              <UnitNode key={child.id} unit={child} level={level + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
