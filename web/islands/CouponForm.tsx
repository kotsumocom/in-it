import { useState } from "preact/hooks";

interface CouponFormProps {
  error?: string;
}

export default function CouponForm({ error }: CouponFormProps) {
  const [type, setType] = useState<"year_free" | "forever_free" | "custom">(
    "year_free"
  );

  return (
    <section class="mb-8 p-6 bg-white border border-gray-200">
      <h2 class="text-lg font-bold text-gray-900 mb-4">新規クーポン作成</h2>

      {error && (
        <div class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form method="POST" class="space-y-4">
        <input type="hidden" name="action" value="create" />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              クーポンコード
            </label>
            <input
              type="text"
              name="code"
              required
              placeholder="WELCOME2026"
              class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              タイプ
            </label>
            <select
              name="type"
              required
              value={type}
              onChange={(e) =>
                setType((e.target as HTMLSelectElement).value as typeof type)
              }
              class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="year_free">1年無料</option>
              <option value="forever_free">永久無料</option>
              <option value="custom">カスタム（期間指定）</option>
            </select>
          </div>

          {type === "custom" && (
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                無料期間（月）
              </label>
              <input
                type="number"
                name="duration_months"
                required
                min={1}
                placeholder="6"
                class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              最大使用回数
            </label>
            <input
              type="number"
              name="max_uses"
              value="1"
              min={1}
              class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              有効期限
            </label>
            <input
              type="date"
              name="expires_at"
              class="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          クーポンを作成
        </button>
      </form>
    </section>
  );
}
