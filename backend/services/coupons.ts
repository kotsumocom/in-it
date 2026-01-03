/**
 * クーポン管理サービス
 */

import { supabaseAdmin } from "../supabase.ts";

// クーポンの型定義
export interface AdminCoupon {
  id: string;
  code: string;
  stripe_coupon_id: string | null;
  type: "year_free" | "forever_free" | "custom";
  duration_months: number | null;
  max_uses: number;
  use_count: number;
  expires_at: string | null;
  created_at: string;
}

export interface CreateCouponInput {
  code: string;
  type: "year_free" | "forever_free" | "custom";
  duration_months?: number;
  max_uses?: number;
  expires_at?: string;
}

type CouponResult =
  | { success: true; coupons: AdminCoupon[] }
  | { success: false; error: string };

type SingleCouponResult =
  | { success: true; coupon: AdminCoupon }
  | { success: false; error: string };

/**
 * クーポン一覧を取得
 */
export const getCoupons = async (): Promise<CouponResult> => {
  const { data, error } = await supabaseAdmin
    .from("admin_coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, coupons: data || [] };
};

/**
 * クーポンを作成（Stripeにも100%オフクーポンを作成）
 */
export const createCoupon = async (
  input: CreateCouponInput
): Promise<SingleCouponResult> => {
  const { code, type, duration_months, max_uses = 1, expires_at } = input;

  // コードが既に存在するか確認
  const { data: existing } = await supabaseAdmin
    .from("admin_coupons")
    .select("id")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (existing) {
    return { success: false, error: "このクーポンコードは既に存在します" };
  }

  // クーポン期間を計算
  const durationMonths =
    type === "year_free"
      ? 12
      : type === "forever_free"
      ? null
      : duration_months;

  // Stripeに100%オフクーポンを作成
  let stripeCouponId: string | null = null;
  try {
    const { stripe } = await import("./stripe.ts");

    const stripeCouponParams: {
      percent_off: number;
      duration: "once" | "repeating" | "forever";
      duration_in_months?: number;
      id: string;
      name: string;
    } = {
      percent_off: 100,
      duration: durationMonths ? "repeating" : "forever",
      id: `coupon_${code.toUpperCase()}_${Date.now()}`,
      name: `${code.toUpperCase()} - ${type}`,
    };

    if (durationMonths) {
      stripeCouponParams.duration_in_months = durationMonths;
    }

    const stripeCoupon = await stripe.coupons.create(stripeCouponParams);
    stripeCouponId = stripeCoupon.id;
    console.log(`Created Stripe coupon: ${stripeCouponId}`);
  } catch (stripeError) {
    console.error("Failed to create Stripe coupon:", stripeError);
    // Stripeクーポン作成失敗時もDBには保存（後で手動対応可能）
  }

  const { data, error } = await supabaseAdmin
    .from("admin_coupons")
    .insert({
      code: code.toUpperCase(),
      type,
      duration_months: durationMonths,
      max_uses,
      expires_at,
      stripe_coupon_id: stripeCouponId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, coupon: data };
};

/**
 * クーポンを削除
 */
export const deleteCoupon = async (
  couponId: string
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabaseAdmin
    .from("admin_coupons")
    .delete()
    .eq("id", couponId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

/**
 * クーポンを適用（使用カウントを増やす）
 */
export const applyCoupon = async (
  code: string
): Promise<{ success: boolean; coupon?: AdminCoupon; error?: string }> => {
  // クーポンを取得
  const { data: coupon, error: fetchError } = await supabaseAdmin
    .from("admin_coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  if (!coupon) {
    return { success: false, error: "クーポンが見つかりません" };
  }

  // 有効期限チェック
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { success: false, error: "このクーポンは有効期限が切れています" };
  }

  // 使用回数チェック
  if (coupon.use_count >= coupon.max_uses) {
    return { success: false, error: "このクーポンは使用上限に達しています" };
  }

  // 使用カウントを増やす
  const { error: updateError } = await supabaseAdmin
    .from("admin_coupons")
    .update({ use_count: coupon.use_count + 1 })
    .eq("id", coupon.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, coupon };
};
