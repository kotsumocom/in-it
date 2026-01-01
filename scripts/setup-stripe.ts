/**
 * Stripe 設定スクリプト
 *
 * 年間プラン用 Price と紹介制度用クーポン・Promotion Code を作成
 *
 * 使用方法:
 *   deno run -A scripts/setup-stripe.ts
 *
 * 必要な環境変数:
 *   STRIPE_SECRET_KEY
 */

import "$std/dotenv/load.ts";
import Stripe from "npm:stripe";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY が設定されていません");
  Deno.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-12-18.acacia",
});

async function main() {
  console.log("🚀 Stripe 設定を開始...\n");

  // 1. 既存の Product を取得または作成
  console.log("📦 Product を確認中...");
  const product = await findOrCreateProduct();
  console.log(`   ✅ Product: ${product.name} (${product.id})\n`);

  // 2. 月額プラン Price を確認
  console.log("💴 月額プラン Price を確認中...");
  const monthlyPrice = await findOrCreateMonthlyPrice(product.id);
  console.log(
    `   ✅ 月額: ¥${monthlyPrice.unit_amount} (${monthlyPrice.id})\n`
  );

  // 3. 年間プラン Price を作成
  console.log("💴 年間プラン Price を確認中...");
  const yearlyPrice = await findOrCreateYearlyPrice(product.id);
  console.log(`   ✅ 年間: ¥${yearlyPrice.unit_amount} (${yearlyPrice.id})\n`);

  // 4. 紹介制度用クーポンを作成（初月無料）
  console.log("🎫 紹介制度用クーポンを確認中...");
  const referralCoupon = await findOrCreateReferralCoupon();
  console.log(
    `   ✅ クーポン: ${referralCoupon.name} (${referralCoupon.id})\n`
  );

  // 結果を表示
  console.log("=".repeat(50));
  console.log("✅ Stripe 設定完了！\n");
  console.log("以下の環境変数を .env に追加してください:\n");
  console.log(`STRIPE_PRICE_ID=${monthlyPrice.id}`);
  console.log(`STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`);
  console.log(`STRIPE_REFERRAL_COUPON_ID=${referralCoupon.id}`);
  console.log("=".repeat(50));
}

async function findOrCreateProduct(): Promise<Stripe.Product> {
  // 既存の Product を検索
  const products = await stripe.products.list({ limit: 10 });
  const existing = products.data.find((p) => p.name === "in-it スペース掲載");

  if (existing) {
    return existing;
  }

  // 新規作成
  return await stripe.products.create({
    name: "in-it スペース掲載",
    description: "メンタースペースの掲載料金（手数料0%）",
  });
}

async function findOrCreateMonthlyPrice(
  productId: string
): Promise<Stripe.Price> {
  // 既存の Price を検索
  const prices = await stripe.prices.list({ product: productId, limit: 10 });
  const existing = prices.data.find(
    (p) => p.recurring?.interval === "month" && p.unit_amount === 1000
  );

  if (existing) {
    return existing;
  }

  // 新規作成
  return await stripe.prices.create({
    product: productId,
    unit_amount: 1000,
    currency: "jpy",
    recurring: { interval: "month" },
    nickname: "月額プラン",
  });
}

async function findOrCreateYearlyPrice(
  productId: string
): Promise<Stripe.Price> {
  // 既存の Price を検索
  const prices = await stripe.prices.list({ product: productId, limit: 10 });
  const existing = prices.data.find(
    (p) => p.recurring?.interval === "year" && p.unit_amount === 10000
  );

  if (existing) {
    return existing;
  }

  // 新規作成
  return await stripe.prices.create({
    product: productId,
    unit_amount: 10000,
    currency: "jpy",
    recurring: { interval: "year" },
    nickname: "年間プラン（2ヶ月お得）",
  });
}

async function findOrCreateReferralCoupon(): Promise<Stripe.Coupon> {
  // 既存のクーポンを検索
  const coupons = await stripe.coupons.list({ limit: 50 });
  const existing = coupons.data.find((c) => c.name === "紹介特典: 初月無料");

  if (existing) {
    return existing;
  }

  // 新規作成（100% OFF、1ヶ月間）
  return await stripe.coupons.create({
    name: "紹介特典: 初月無料",
    percent_off: 100,
    duration: "once",
    metadata: {
      type: "referral",
      description: "紹介コードで登録した場合の初月無料特典",
    },
  });
}

main().catch(console.error);
