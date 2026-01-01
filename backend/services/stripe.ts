import Stripe from "npm:stripe";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const stripeMonthlyPriceId = Deno.env.get("STRIPE_PRICE_ID") || "";
const stripeYearlyPriceId = Deno.env.get("STRIPE_YEARLY_PRICE_ID") || "";

if (!stripeSecretKey) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable.");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-12-18.acacia",
});

export type PlanType = "monthly" | "yearly";

/**
 * Checkoutセッションを作成（サブスク開始用）
 * @param userId ユーザーID
 * @param email メールアドレス
 * @param spaceId スペースID（課金対象）
 * @param planType プランタイプ（monthly/yearly）
 * @param successUrl 成功時リダイレクトURL
 * @param cancelUrl キャンセル時リダイレクトURL
 * @param referralCode 紹介コード（オプション）
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  spaceId: string,
  planType: PlanType,
  successUrl: string,
  cancelUrl: string,
  referralCode?: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const priceId =
      planType === "yearly" ? stripeYearlyPriceId : stripeMonthlyPriceId;

    if (!priceId) {
      return {
        url: null,
        error: `${planType} プランの価格IDが設定されていません`,
      };
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        space_id: spaceId,
        plan_type: planType,
        referral_code: referralCode || "",
      },
      // 紹介コードがある場合は紹介クーポンを自動適用、なければ手動入力を許可
      ...(referralCode
        ? {
            discounts: [
              { coupon: Deno.env.get("STRIPE_REFERRAL_COUPON_ID") || "" },
            ].filter((d) => d.coupon), // coupon が空なら適用しない
          }
        : { allow_promotion_codes: true }),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    return { url: session.url };
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return { url: null, error: "決済セッションの作成に失敗しました" };
  }
}

/**
 * Customer Portalセッションを作成（支払い管理用）
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  } catch (error) {
    console.error("Stripe portal session error:", error);
    return { url: null, error: "ポータルセッションの作成に失敗しました" };
  }
}

/**
 * Webhookイベントを検証（非同期）
 */
export async function constructWebhookEvent(
  payload: string,
  signature: string
): Promise<Stripe.Event | null> {
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

  console.log(
    "Webhook secret loaded:",
    webhookSecret ? `${webhookSecret.substring(0, 10)}...` : "MISSING"
  );

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return null;
  }

  try {
    const event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      webhookSecret
    );
    console.log("Webhook signature verified successfully");
    return event;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}
