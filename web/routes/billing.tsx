import { Handlers } from "$fresh/server.ts";
import { supabaseAdmin } from "@in-it/backend/supabase.ts";
import { createCustomerPortalSession } from "@in-it/backend/services/stripe.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<unknown, State> = {
  async GET(req, ctx) {
    // 未ログインはログインページへ
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const user = ctx.state.user;

    // Stripe Customer IDを取得
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      // Customer IDがなければサブスク登録へ
      return new Response(null, {
        status: 303,
        headers: { Location: "/subscribe" },
      });
    }

    const url = new URL(req.url);
    const origin = url.origin;

    // Customer Portalセッション作成
    const { url: portalUrl, error } = await createCustomerPortalSession(
      subscription.stripe_customer_id,
      `${origin}/dashboard`
    );

    if (error || !portalUrl) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard?error=portal" },
      });
    }

    // Stripe Portalにリダイレクト
    return new Response(null, {
      status: 303,
      headers: { Location: portalUrl },
    });
  },
};
