import "$std/dotenv/load.ts";
import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { getUnitsTree } from "./services/units.ts";
import { getUserProgress, updateUserProgress } from "./services/progress.ts";
import {
  constructWebhookEvent,
  stripe,
  createCheckoutSession,
} from "./services/stripe.ts";
import { supabaseAdmin } from "./supabase.ts";
import type Stripe from "npm:stripe";

const app = new Hono();

// CORS設定
app.use(
  "/api/*",
  cors({
    origin: [
      "http://localhost:8000",
      "https://in-it.ooo",
      "https://www.in-it.ooo",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ベーシック認証（環境変数で設定されている場合のみ有効）
app.use("*", async (c, next) => {
  const basicAuthUser = Deno.env.get("BASIC_AUTH_USER");
  const basicAuthPass = Deno.env.get("BASIC_AUTH_PASS");

  // 環境変数が設定されていない場合はスキップ
  if (!basicAuthUser || !basicAuthPass) {
    return next();
  }

  // Stripe Webhookはベーシック認証をスキップ
  if (c.req.path === "/api/stripe/webhook") {
    return next();
  }

  const authHeader = c.req.header("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return c.text("Unauthorized", 401, {
      "WWW-Authenticate": 'Basic realm="in-it-api"',
    });
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = atob(base64Credentials);
  const [user, pass] = credentials.split(":");

  if (user !== basicAuthUser || pass !== basicAuthPass) {
    return c.text("Unauthorized", 401, {
      "WWW-Authenticate": 'Basic realm="in-it-api"',
    });
  }

  return next();
});

// Health check
app.get("/", (c) => {
  return c.text("in-it API Backend");
});

app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Units API
app.get("/api/units", async (c) => {
  try {
    const units = await getUnitsTree();
    return c.json(units);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Progress API
app.get("/api/progress/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const progress = await getUserProgress(userId);
    return c.json(progress);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

app.post("/api/progress", async (c) => {
  const body = await c.req.json();
  const { userId, unitId, status } = body;
  try {
    await updateUserProgress(userId, unitId, status);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Stripe Checkout Session
app.post("/api/stripe/checkout", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, email, successUrl, cancelUrl } = body;

    if (!userId || !email) {
      return c.json({ error: "userId and email are required" }, 400);
    }

    const baseUrl = Deno.env.get("APP_URL") || "https://in-it.ooo";
    const success = successUrl || `${baseUrl}/dashboard?success=true`;
    const cancel = cancelUrl || `${baseUrl}/dashboard?canceled=true`;

    const result = await createCheckoutSession(userId, email, success, cancel);

    if (result.error) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({ url: result.url });
  } catch (e) {
    console.error("Checkout error:", e);
    return c.json({ error: e.message }, 500);
  }
});

// Stripe Webhook
app.post("/api/stripe/webhook", async (c) => {
  console.log("=== Stripe Webhook received ===");

  const signature = c.req.header("stripe-signature");

  if (!signature) {
    console.error("Missing stripe-signature header");
    return c.text("Missing signature", 400);
  }

  const payload = await c.req.text();
  console.log("Payload length:", payload.length);

  const event = await constructWebhookEvent(payload, signature);

  if (!event) {
    console.error("Failed to construct webhook event - invalid signature");
    return c.text("Invalid signature", 400);
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

    return c.text("OK", 200);
  } catch (error) {
    console.error("Webhook handler error:", error);
    return c.text("Webhook handler failed", 500);
  }
});

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

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

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

const port = parseInt(Deno.env.get("PORT") || "3001");
console.log(`Backend server starting on port ${port}...`);
Deno.serve({ port }, app.fetch);
