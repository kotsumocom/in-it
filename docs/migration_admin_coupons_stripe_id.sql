-- admin_couponsテーブルにstripe_coupon_idカラムを追加
-- Stripeで作成したクーポンIDを保存

ALTER TABLE admin_coupons 
ADD COLUMN IF NOT EXISTS stripe_coupon_id TEXT;

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_admin_coupons_stripe_coupon_id 
ON admin_coupons(stripe_coupon_id);
