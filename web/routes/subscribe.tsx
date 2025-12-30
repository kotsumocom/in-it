import { Handlers } from "$fresh/server.ts";
import { createCheckoutSession } from "@in-it/backend/services/stripe.ts";
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

    // 既にアクティブなサブスクがあればダッシュボードへ
    if (
      user.subscription_status === "active" ||
      user.subscription_status === "trialing"
    ) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard" },
      });
    }

    const url = new URL(req.url);
    const origin = url.origin;

    // Checkoutセッション作成
    const { url: checkoutUrl, error } = await createCheckoutSession(
      user.id,
      user.email,
      `${origin}/dashboard?success=true`,
      `${origin}/subscribe?canceled=true`
    );

    if (error || !checkoutUrl) {
      // エラー時はダッシュボードにリダイレクト
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard?error=checkout" },
      });
    }

    // Stripe Checkoutにリダイレクト
    return new Response(null, {
      status: 303,
      headers: { Location: checkoutUrl },
    });
  },
};
