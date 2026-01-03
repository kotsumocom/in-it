import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import CouponForm from "../islands/CouponForm.tsx";

interface AdminCoupon {
  id: string;
  code: string;
  type: "year_free" | "forever_free" | "custom";
  duration_months: number | null;
  max_uses: number;
  use_count: number;
  expires_at: string | null;
  created_at: string;
}

interface AdminData {
  user: State["user"];
  coupons: AdminCoupon[];
  error?: string;
}

const API_URL = Deno.env.get("API_URL") || "http://localhost:3001";

export const handler: Handlers<AdminData, State> = {
  async GET(_req, ctx) {
    const user = ctx.state.user;

    // 未ログインはリダイレクト
    if (!user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/login" },
      });
    }

    // 管理者権限チェック（is_admin フラグで判定）
    if (!user.is_admin) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard" },
      });
    }

    // クーポン一覧を取得
    let coupons: AdminCoupon[] = [];
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`);
      if (res.ok) {
        coupons = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch coupons:", e);
    }

    return ctx.render({ user, coupons });
  },

  async POST(req, ctx) {
    const user = ctx.state.user;

    if (!user) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/login" },
      });
    }

    const formData = await req.formData();
    const action = formData.get("action") as string;

    if (action === "create") {
      const code = formData.get("code") as string;
      const type = formData.get("type") as
        | "year_free"
        | "forever_free"
        | "custom";
      const duration_months =
        parseInt(formData.get("duration_months") as string) || null;
      const max_uses = parseInt(formData.get("max_uses") as string) || 1;
      const expires_at = (formData.get("expires_at") as string) || null;

      try {
        const res = await fetch(`${API_URL}/api/admin/coupons`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            type,
            duration_months,
            max_uses,
            expires_at,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          const couponsRes = await fetch(`${API_URL}/api/admin/coupons`);
          const coupons = couponsRes.ok ? await couponsRes.json() : [];
          return ctx.render({ user, coupons, error: data.error });
        }
      } catch (e) {
        console.error("Failed to create coupon:", e);
      }
    }

    if (action === "delete") {
      const couponId = formData.get("couponId") as string;
      try {
        await fetch(`${API_URL}/api/admin/coupons/${couponId}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to delete coupon:", e);
      }
    }

    return new Response(null, {
      status: 302,
      headers: { Location: "/admin" },
    });
  },
};

export default function AdminPage({ data }: PageProps<AdminData>) {
  const { user, coupons, error } = data;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/admin" class="flex items-center gap-2">
            <img src="/type.svg" alt="イニット" class="h-8" />
            <span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium">
              Admin
            </span>
          </a>
          <nav class="flex items-center gap-4">
            <a href="/dashboard" class="text-gray-600 hover:text-gray-900">
              ダッシュボード
            </a>
            <span class="text-gray-600">{user?.email}</span>
          </nav>
        </div>
      </header>

      <div class="max-w-4xl mx-auto py-8 px-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">クーポン管理</h1>

        {/* クーポン作成フォーム */}
        <CouponForm error={error} />

        {/* クーポン一覧 */}
        <section class="p-6 bg-white border border-gray-200">
          <h2 class="text-lg font-bold text-gray-900 mb-4">
            クーポン一覧 ({coupons.length}件)
          </h2>

          {coupons.length === 0 ? (
            <p class="text-gray-500">クーポンがありません</p>
          ) : (
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="border-b border-gray-200">
                  <tr class="text-left text-sm text-gray-600">
                    <th class="pb-3">コード</th>
                    <th class="pb-3">タイプ</th>
                    <th class="pb-3">期間</th>
                    <th class="pb-3">使用状況</th>
                    <th class="pb-3">有効期限</th>
                    <th class="pb-3">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} class="text-sm">
                      <td class="py-3 font-mono font-medium">{coupon.code}</td>
                      <td class="py-3">
                        <span
                          class={`px-2 py-1 text-xs ${
                            coupon.type === "year_free"
                              ? "bg-green-100 text-green-700"
                              : coupon.type === "forever_free"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {coupon.type === "year_free"
                            ? "1年無料"
                            : coupon.type === "forever_free"
                            ? "永久無料"
                            : "カスタム"}
                        </span>
                      </td>
                      <td class="py-3">
                        {coupon.duration_months
                          ? `${coupon.duration_months}ヶ月`
                          : coupon.type === "forever_free"
                          ? "∞"
                          : "-"}
                      </td>
                      <td class="py-3">
                        {coupon.use_count} / {coupon.max_uses}
                      </td>
                      <td class="py-3">
                        {coupon.expires_at
                          ? new Date(coupon.expires_at).toLocaleDateString(
                              "ja-JP"
                            )
                          : "無期限"}
                      </td>
                      <td class="py-3">
                        <form method="POST" class="inline">
                          <input type="hidden" name="action" value="delete" />
                          <input
                            type="hidden"
                            name="couponId"
                            value={coupon.id}
                          />
                          <button
                            type="submit"
                            class="text-red-600 hover:text-red-800"
                          >
                            削除
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
