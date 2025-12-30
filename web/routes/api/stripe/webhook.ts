import { Handlers } from "$fresh/server.ts";
import {
  constructWebhookEvent,
  stripe,
} from "@in-it/backend/services/stripe.ts";
import { supabaseAdmin } from "@in-it/backend/supabase.ts";
import type Stripe from "npm:stripe";

export const handler: Handlers = {
  async POST(req) {
    console.log("=== Stripe Webhook received ===");

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("Missing stripe-signature header");
      return new Response("Missing signature", { status: 400 });
    }

    const payload = await req.text();
    console.log("Payload length:", payload.length);

    const event = await constructWebhookEvent(payload, signature);

    if (!event) {
      console.error("Failed to construct webhook event - invalid signature");
      return new Response("Invalid signature", { status: 400 });
    }

    console.log("Event type:", event.type);

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutComplete(session);
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionUpdate(subscription);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDelete(subscription);
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Webhook handler error:", error);
      return new Response("Webhook handler failed", { status: 500 });
    }
  },
};

/**
 * Checkout完了時の処理
 */
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  console.log("handleCheckoutComplete:", {
    userId,
    customerId,
    subscriptionId,
  });

  if (!userId) {
    console.error("Missing user_id in session metadata");
    return;
  }

  // サブスクリプション詳細を取得
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // DBを更新（upsertで存在しない場合も作成）
  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: subscription.status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to update subscription:", error);
  } else {
    console.log("Subscription updated successfully for user:", userId);
  }
}

/**
 * サブスクリプション更新時の処理
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const updateData: Record<string, unknown> = {
    status: subscription.status,
  };

  // 日付フィールドが存在する場合のみ更新
  if (subscription.current_period_start) {
    updateData.current_period_start = new Date(
      subscription.current_period_start * 1000
    ).toISOString();
  }
  if (subscription.current_period_end) {
    updateData.current_period_end = new Date(
      subscription.current_period_end * 1000
    ).toISOString();
  }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update(updateData)
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("Failed to update subscription:", error);
  }
}

/**
 * サブスクリプション削除時の処理
 */
async function handleSubscriptionDelete(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "canceled",
      stripe_subscription_id: null,
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("Failed to cancel subscription:", error);
  }
}
