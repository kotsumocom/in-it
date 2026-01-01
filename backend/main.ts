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
import {
  createSpace,
  getSpace,
  getSpaceBySlug,
  updateSpace,
  deleteSpace,
  getUserSpaces,
  getPublicSpaces,
} from "./services/spaces.ts";
import {
  getCategories,
  getTags,
  getFeaturedTags,
  searchTags,
  addTagsToSpace,
  getSpaceTags,
  removeTagFromSpace,
} from "./services/tags.ts";
import { supabase, supabaseAdmin } from "./supabase.ts";
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

  // 公開APIはベーシック認証をスキップ
  const publicPaths = [
    "/api/categories",
    "/api/tags",
    "/api/public/spaces",
    "/api/health",
  ];
  if (publicPaths.some((path) => c.req.path.startsWith(path))) {
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

// ===========================================
// Categories & Tags API
// ===========================================

// カテゴリ一覧
app.get("/api/categories", async (c) => {
  try {
    const result = await getCategories();
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    return c.json(result.categories);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// タグ一覧（カテゴリで絞り込み可能）
app.get("/api/tags", async (c) => {
  try {
    const categoryId = c.req.query("category");
    const result = await getTags(categoryId);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    return c.json(result.tags);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// 注目タグ
app.get("/api/tags/featured", async (c) => {
  try {
    const result = await getFeaturedTags();
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    return c.json(result.tags);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// タグ検索
app.get("/api/tags/search", async (c) => {
  try {
    const query = c.req.query("q") || "";
    const result = await searchTags(query);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    return c.json(result.tags);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ===========================================
// Spaces API
// ===========================================

// 公開スペース一覧
app.get("/api/public/spaces", async (c) => {
  try {
    const categoryId = c.req.query("category");
    const limit = parseInt(c.req.query("limit") || "20");
    const offset = parseInt(c.req.query("offset") || "0");
    const result = await getPublicSpaces(categoryId, limit, offset);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    return c.json(result.spaces);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// スペース公開ページ（slugで取得）
app.get("/api/public/spaces/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const result = await getSpaceBySlug(slug);
    if (!result.success) {
      return c.json({ error: result.error }, 404);
    }
    return c.json(result.space);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// ユーザーのスペース一覧
app.get("/api/users/:userId/spaces", async (c) => {
  try {
    const userId = c.req.param("userId");
    const result = await getUserSpaces(userId);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    return c.json(result.spaces);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// スペース作成
app.post("/api/spaces", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "認証が必要です" }, 401);
    }
    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: "認証に失敗しました" }, 401);
    }

    const body = await c.req.json();
    const result = await createSpace(user.id, body);
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
    return c.json(result.space, 201);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// スペース取得
app.get("/api/spaces/:id", async (c) => {
  try {
    const spaceId = c.req.param("id");
    const result = await getSpace(spaceId);
    if (!result.success) {
      return c.json({ error: result.error }, 404);
    }
    return c.json(result.space);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// スペース更新
app.put("/api/spaces/:id", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "認証が必要です" }, 401);
    }
    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: "認証に失敗しました" }, 401);
    }

    const spaceId = c.req.param("id");
    const body = await c.req.json();
    const result = await updateSpace(spaceId, user.id, body);
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
    return c.json(result.space);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// スペース削除
app.delete("/api/spaces/:id", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "認証が必要です" }, 401);
    }
    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: "認証に失敗しました" }, 401);
    }

    const spaceId = c.req.param("id");
    const result = await deleteSpace(spaceId, user.id);
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// スペースのタグを更新
app.post("/api/spaces/:id/tags", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "認証が必要です" }, 401);
    }
    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return c.json({ error: "認証に失敗しました" }, 401);
    }

    const spaceId = c.req.param("id");
    const { tagIds } = await c.req.json();
    const result = await addTagsToSpace(spaceId, user.id, tagIds || []);
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// スペースのタグを取得
app.get("/api/spaces/:id/tags", async (c) => {
  try {
    const spaceId = c.req.param("id");
    const result = await getSpaceTags(spaceId);
    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }
    return c.json(result.tags);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Subscriptions API
app.get("/api/subscriptions/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("status, current_period_start, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Subscription fetch error:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({
      status: data?.status || null,
      current_period_start: data?.current_period_start || null,
      current_period_end: data?.current_period_end || null,
    });
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
});

// Stripe Checkout Session
app.post("/api/stripe/checkout", async (c) => {
  try {
    const body = await c.req.json();
    const {
      userId,
      email,
      spaceId,
      planType,
      referralCode,
      successUrl,
      cancelUrl,
    } = body;

    if (!userId || !email || !spaceId) {
      return c.json({ error: "userId, email, and spaceId are required" }, 400);
    }

    const plan = planType === "yearly" ? "yearly" : "monthly";

    const baseUrl = Deno.env.get("APP_URL") || "https://in-it.ooo";
    const success = successUrl || `${baseUrl}/dashboard?success=true`;
    const cancel = cancelUrl || `${baseUrl}/dashboard?canceled=true`;

    const result = await createCheckoutSession(
      userId,
      email,
      spaceId,
      plan,
      success,
      cancel,
      referralCode
    );

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
  const spaceId = session.metadata?.space_id;
  const planType = session.metadata?.plan_type || "monthly";
  const referralCode = session.metadata?.referral_code;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  console.log("handleCheckoutComplete:", {
    userId,
    spaceId,
    planType,
    referralCode,
    customerId,
    subscriptionId,
  });

  if (!userId || !spaceId) {
    console.error("Missing user_id or space_id in session metadata");
    return;
  }

  // deno-lint-ignore no-explicit-any
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      space_id: spaceId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: subscription.status,
      plan_type: planType,
      referral_code: referralCode || null,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    },
    { onConflict: "space_id" }
  );

  if (error) {
    console.error("Failed to update subscription:", error);
  } else {
    console.log("Subscription updated successfully for space:", spaceId);
  }

  // 紹介コードがあれば紹介者にクレジットを付与（将来実装）
  if (referralCode) {
    console.log("Referral code used:", referralCode);
    // TODO: 紹介者への 1,000 円クレジット付与ロジック
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
