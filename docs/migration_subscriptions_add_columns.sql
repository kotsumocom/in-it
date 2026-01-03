-- subscriptionsテーブルにplan_typeとreferral_codeカラムを追加
-- 実行日: 2026-01-03

-- plan_typeカラム追加（monthly/yearly）
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'monthly';

-- referral_codeカラム追加
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS referral_code TEXT;
