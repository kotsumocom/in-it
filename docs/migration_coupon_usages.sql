-- クーポン使用履歴テーブル
-- 同じユーザーが同じクーポンを2度使えないようにする

CREATE TABLE IF NOT EXISTS coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES admin_coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  space_id UUID NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 同一ユーザー・同一クーポンの組み合わせはユニーク
  UNIQUE(coupon_id, user_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user_id ON coupon_usages(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
